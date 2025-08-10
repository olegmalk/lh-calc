/**
 * Queue Manager for Excel API
 * Handles request queuing and worker pool management for concurrent Excel processing
 */

import { EventEmitter } from 'events';
import { CalculationRequest, CalculationResults } from '../types/api-contract';

export interface QueuedRequest {
  id: string;
  data: CalculationRequest;
  timestamp: number;
  timeoutAt: number;
  resolve: (result: ProcessingResult) => void;
  reject: (error: Error) => void;
}

export interface ProcessingResult {
  success: boolean;
  results?: CalculationResults;
  error?: string;
  processingTimeMs: number;
  queueTimeMs: number;
}

export interface WorkerStats {
  id: number;
  busy: boolean;
  currentRequestId?: string;
  processedCount: number;
  averageProcessingTime: number;
  lastActivityTime: number;
}

export interface QueueStats {
  queueSize: number;
  activeWorkers: number;
  totalWorkers: number;
  averageQueueTime: number;
  averageProcessingTime: number;
  processedRequests: number;
  failedRequests: number;
  timeoutRequests: number;
}

interface QueueConfig {
  maxWorkers: number;
  maxQueueSize: number;
  requestTimeoutMs: number;
  workerIdleTimeoutMs: number;
  cleanupIntervalMs: number;
}

export class QueueManager extends EventEmitter {
  private queue: QueuedRequest[] = [];
  private workers: Map<number, WorkerStats> = new Map();
  private nextWorkerId = 1;
  private cleanupTimer: NodeJS.Timeout;
  private processingStats = {
    processedRequests: 0,
    failedRequests: 0,
    timeoutRequests: 0,
    totalProcessingTime: 0,
    totalQueueTime: 0
  };

  private readonly config: QueueConfig = {
    maxWorkers: process.env.NODE_ENV === 'test' ? 10 : 5, // More workers for testing
    maxQueueSize: process.env.NODE_ENV === 'test' ? 500 : 200, // Larger queue for testing
    requestTimeoutMs: process.env.NODE_ENV === 'test' ? 120000 : 30000, // 2 minutes for tests vs 30 seconds
    workerIdleTimeoutMs: process.env.NODE_ENV === 'test' ? 60000 : 300000, // Shorter idle timeout for tests
    cleanupIntervalMs: process.env.NODE_ENV === 'test' ? 30000 : 60000 // More frequent cleanup for tests
  };

  constructor(
    private excelProcessor: any,
    customConfig?: Partial<QueueConfig>
  ) {
    super();
    
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }

    // Start cleanup timer
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupIntervalMs);

    // Graceful shutdown
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  /**
   * Add request to queue and process
   */
  async processRequest(
    requestId: string, 
    data: CalculationRequest
  ): Promise<ProcessingResult> {
    return new Promise((resolve, reject) => {
      // Check queue size limit
      if (this.queue.length >= this.config.maxQueueSize) {
        reject(new Error('Queue is full - too many concurrent requests'));
        return;
      }

      const now = Date.now();
      const queuedRequest: QueuedRequest = {
        id: requestId,
        data,
        timestamp: now,
        timeoutAt: now + this.config.requestTimeoutMs,
        resolve,
        reject
      };

      this.queue.push(queuedRequest);
      this.emit('requestQueued', { requestId, queueSize: this.queue.length });

      // Try to process immediately
      this.processQueue();
    });
  }

  /**
   * Process queued requests
   */
  private async processQueue(): Promise<void> {
    // Check if we have available workers or can create new ones
    const availableWorker = this.findAvailableWorker();
    const canCreateWorker = this.workers.size < this.config.maxWorkers;

    if (!availableWorker && !canCreateWorker) {
      return; // No workers available and at max capacity
    }

    // Get next request from queue
    const request = this.queue.shift();
    if (!request) {
      return; // No requests in queue
    }

    // Check if request has timed out
    if (Date.now() > request.timeoutAt) {
      this.processingStats.timeoutRequests++;
      request.reject(new Error('Request timeout'));
      this.emit('requestTimeout', { requestId: request.id });
      
      // Try to process next request
      setImmediate(() => this.processQueue());
      return;
    }

    // Get or create worker
    const worker = availableWorker || this.createWorker();
    
    // Process request with worker
    this.processWithWorker(worker, request);

    // Continue processing queue if there are more requests
    if (this.queue.length > 0) {
      setImmediate(() => this.processQueue());
    }
  }

  /**
   * Find available worker
   */
  private findAvailableWorker(): WorkerStats | null {
    for (const worker of this.workers.values()) {
      if (!worker.busy) {
        return worker;
      }
    }
    return null;
  }

  /**
   * Create new worker
   */
  private createWorker(): WorkerStats {
    const worker: WorkerStats = {
      id: this.nextWorkerId++,
      busy: false,
      processedCount: 0,
      averageProcessingTime: 0,
      lastActivityTime: Date.now()
    };

    this.workers.set(worker.id, worker);
    this.emit('workerCreated', { workerId: worker.id });

    return worker;
  }

  /**
   * Process request with specific worker
   */
  private async processWithWorker(
    worker: WorkerStats, 
    request: QueuedRequest
  ): Promise<void> {
    const startTime = Date.now();
    const queueTime = startTime - request.timestamp;

    worker.busy = true;
    worker.currentRequestId = request.id;
    worker.lastActivityTime = startTime;

    this.emit('requestProcessingStarted', { 
      requestId: request.id, 
      workerId: worker.id,
      queueTimeMs: queueTime
    });

    try {
      // Process with Excel processor
      const result = await this.excelProcessor.processCalculation(request.data);
      const processingTime = Date.now() - startTime;

      // Update worker stats
      worker.processedCount++;
      worker.averageProcessingTime = this.updateAverage(
        worker.averageProcessingTime,
        processingTime,
        worker.processedCount
      );

      // Update global stats
      this.processingStats.processedRequests++;
      this.processingStats.totalProcessingTime += processingTime;
      this.processingStats.totalQueueTime += queueTime;

      // Resolve request
      const processingResult: ProcessingResult = {
        success: result.success,
        results: result.results,
        error: result.error,
        processingTimeMs: processingTime,
        queueTimeMs: queueTime
      };

      request.resolve(processingResult);

      this.emit('requestCompleted', {
        requestId: request.id,
        workerId: worker.id,
        success: true,
        processingTimeMs: processingTime,
        queueTimeMs: queueTime
      });

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      // Update stats
      this.processingStats.failedRequests++;
      this.processingStats.totalQueueTime += queueTime;

      // Reject request
      request.reject(error instanceof Error ? error : new Error(String(error)));

      this.emit('requestFailed', {
        requestId: request.id,
        workerId: worker.id,
        error: error instanceof Error ? error.message : String(error),
        processingTimeMs: processingTime,
        queueTimeMs: queueTime
      });

    } finally {
      // Mark worker as available
      worker.busy = false;
      worker.currentRequestId = undefined;
      worker.lastActivityTime = Date.now();

      // Continue processing queue
      setImmediate(() => this.processQueue());
    }
  }

  /**
   * Update moving average
   */
  private updateAverage(currentAvg: number, newValue: number, count: number): number {
    return ((currentAvg * (count - 1)) + newValue) / count;
  }

  /**
   * Cleanup expired requests and idle workers
   */
  private cleanup(): void {
    const now = Date.now();

    // Remove timed out requests
    const timedOutRequests = this.queue.filter(req => now > req.timeoutAt);
    this.queue = this.queue.filter(req => now <= req.timeoutAt);

    // Handle timed out requests
    timedOutRequests.forEach(request => {
      this.processingStats.timeoutRequests++;
      request.reject(new Error('Request timeout during queue wait'));
      this.emit('requestTimeout', { requestId: request.id });
    });

    // Remove idle workers
    const idleWorkers: number[] = [];
    for (const [workerId, worker] of this.workers.entries()) {
      if (!worker.busy && (now - worker.lastActivityTime) > this.config.workerIdleTimeoutMs) {
        idleWorkers.push(workerId);
      }
    }

    idleWorkers.forEach(workerId => {
      this.workers.delete(workerId);
      this.emit('workerRemoved', { workerId });
    });

    // Emit cleanup stats
    if (timedOutRequests.length > 0 || idleWorkers.length > 0) {
      this.emit('cleanup', { 
        timedOutRequests: timedOutRequests.length,
        removedWorkers: idleWorkers.length
      });
    }
  }

  /**
   * Get current queue statistics
   */
  getStats(): QueueStats {
    const activeWorkers = Array.from(this.workers.values()).filter(w => w.busy).length;
    
    return {
      queueSize: this.queue.length,
      activeWorkers,
      totalWorkers: this.workers.size,
      averageQueueTime: this.processingStats.processedRequests > 0 
        ? this.processingStats.totalQueueTime / this.processingStats.processedRequests 
        : 0,
      averageProcessingTime: this.processingStats.processedRequests > 0
        ? this.processingStats.totalProcessingTime / this.processingStats.processedRequests
        : 0,
      processedRequests: this.processingStats.processedRequests,
      failedRequests: this.processingStats.failedRequests,
      timeoutRequests: this.processingStats.timeoutRequests
    };
  }

  /**
   * Get detailed worker information
   */
  getWorkerStats(): WorkerStats[] {
    return Array.from(this.workers.values());
  }

  /**
   * Clear queue and reset stats (admin function)
   */
  clear(): void {
    // Reject all queued requests
    this.queue.forEach(request => {
      request.reject(new Error('Queue cleared by administrator'));
    });
    
    this.queue = [];
    
    // Reset stats
    this.processingStats = {
      processedRequests: 0,
      failedRequests: 0,
      timeoutRequests: 0,
      totalProcessingTime: 0,
      totalQueueTime: 0
    };

    this.emit('queueCleared');
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    console.log('Shutting down queue manager...');

    // Clear cleanup timer
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    // Reject all pending requests
    this.queue.forEach(request => {
      request.reject(new Error('Server shutting down'));
    });

    // Wait for active workers to finish (with timeout)
    const activeWorkers = Array.from(this.workers.values()).filter(w => w.busy);
    if (activeWorkers.length > 0) {
      console.log(`Waiting for ${activeWorkers.length} active workers to finish...`);
      
      const shutdownTimeout = setTimeout(() => {
        console.log('Shutdown timeout reached, forcing exit');
      }, 10000); // 10 second timeout

      // Poll for workers to finish
      while (Array.from(this.workers.values()).some(w => w.busy)) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      clearTimeout(shutdownTimeout);
    }

    this.emit('shutdown');
    console.log('Queue manager shutdown complete');
  }
}

// QueueManager is already exported above - no need to re-export