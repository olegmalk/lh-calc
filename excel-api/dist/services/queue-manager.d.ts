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
export declare class QueueManager extends EventEmitter {
    private excelProcessor;
    private queue;
    private workers;
    private nextWorkerId;
    private cleanupTimer;
    private processingStats;
    private readonly config;
    constructor(excelProcessor: any, customConfig?: Partial<QueueConfig>);
    /**
     * Add request to queue and process
     */
    processRequest(requestId: string, data: CalculationRequest): Promise<ProcessingResult>;
    /**
     * Process queued requests
     */
    private processQueue;
    /**
     * Find available worker
     */
    private findAvailableWorker;
    /**
     * Create new worker
     */
    private createWorker;
    /**
     * Process request with specific worker
     */
    private processWithWorker;
    /**
     * Update moving average
     */
    private updateAverage;
    /**
     * Cleanup expired requests and idle workers
     */
    private cleanup;
    /**
     * Get current queue statistics
     */
    getStats(): QueueStats;
    /**
     * Get detailed worker information
     */
    getWorkerStats(): WorkerStats[];
    /**
     * Clear queue and reset stats (admin function)
     */
    clear(): void;
    /**
     * Graceful shutdown
     */
    shutdown(): Promise<void>;
}
export {};
//# sourceMappingURL=queue-manager.d.ts.map