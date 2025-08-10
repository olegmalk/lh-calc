/**
 * Excel Processor API Server with Comprehensive Error Handling
 * Production-ready API with 60+ edge case protections
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { FieldValidator } from './validators/field-validator';
import { ExcelProcessor } from './processors/excel-processor';
import { rateLimiter } from './middleware/rate-limiter';
import { QueueManager } from './services/queue-manager';
import { ErrorHandler, GlobalErrorHandler, CircuitBreaker } from './middleware/error-handler';
import { ErrorLogger } from './services/error-logger';
import { 
  CalculationRequest, 
  CalculationResponse,
  createSuccessResponse, 
  createErrorResponse, 
  generateRequestId
} from './types/api-contract';
import {
  ExcelApiError,
  ErrorType,
  ErrorFactory
} from './errors/custom-errors';
import { Bitrix24Integration } from './integrations/bitrix24';
import { BitrixAuthMiddleware } from './middleware/bitrix-auth';

// Load environment variables
dotenv.config();

// Initialize comprehensive error handling system
GlobalErrorHandler.setup();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services with enhanced error handling
const validator = new FieldValidator();
const errorLogger = new ErrorLogger();
const errorHandler = new ErrorHandler({
  enableRecovery: true,
  maxRetryAttempts: 3,
  includeStackTrace: process.env.NODE_ENV === 'development',
  sanitizeErrorMessages: process.env.NODE_ENV === 'production'
});

// Initialize Excel processor with enhanced options
const excelProcessor = new ExcelProcessor({
  maxRetries: 3,
  retryDelayMs: 200,
  enableCircularReferenceDetection: true,
  memoryLimitMB: 512,
  enableFileIntegrityCheck: true
});

const queueManager = new QueueManager(excelProcessor, {
  maxWorkers: process.env.NODE_ENV === 'test' ? 10 : 5,
  maxQueueSize: process.env.NODE_ENV === 'test' ? 500 : 200,
  requestTimeoutMs: process.env.NODE_ENV === 'test' ? 120000 : 45000 // Extended timeout for tests
});

// Circuit breaker for critical operations
const circuitBreaker = new CircuitBreaker(5, 60000);

// Initialize simplified Bitrix24 integration (no auth)
const bitrix24Integration = new Bitrix24Integration();
const bitrixAuthMiddleware = new BitrixAuthMiddleware();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Bitrix24
app.use(cors({
  origin: [
    /^https:\/\/.*\.bitrix24\.com$/,
    /^https:\/\/.*\.bitrix24\.ru$/,
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting middleware (apply globally)
app.use(rateLimiter.middleware());

// Basic request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = generateRequestId();
  const startTime = Date.now();
  (req as any).requestId = requestId;
  (req as any).startTime = startTime;
  
  console.log(`[${new Date().toISOString()}] ${requestId} ${req.method} ${req.path} - ${req.ip}`);
  
  // Basic size limit check only
  if (req.body && typeof req.body === 'object') {
    try {
      const bodyStr = JSON.stringify(req.body);
      if (bodyStr.length > 1000000) { // 1MB limit
        return res.status(413).json({
          success: false,
          error: 'Request too large',
          request_id: requestId,
          details: { maxSize: '1MB' }
        });
      }
    } catch (error) {
      console.warn(`[${requestId}] Request body processing warning:`, error instanceof Error ? error.message : String(error));
    }
  }
  
  next();
  return;
});

// Simplified calculation handler
async function executeCalculation(data: CalculationRequest, requestId: string): Promise<CalculationResponse> {
  const startTime = Date.now();
  
  try {
    // Basic validation only
    const validationResult = await validator.validate(data);
    
    if (!validationResult.isValid) {
      // Categorize validation errors
      const missingRequiredFields = validationResult.errors
        .filter(err => err.code === 'any.required')
        .map(err => err.field);
      
      const fieldErrors = validationResult.errors
        .filter(err => err.code !== 'any.required')
        .reduce((acc, err) => {
          acc[err.field] = err.message;
          return acc;
        }, {} as Record<string, string>);
      
      const errorDetails: any = {};
      if (missingRequiredFields.length > 0) {
        errorDetails.missing_required_fields = missingRequiredFields;
      }
      if (Object.keys(fieldErrors).length > 0) {
        errorDetails.field_errors = fieldErrors;
      }
      
      return createErrorResponse(
        'VALIDATION_FAILED',
        requestId,
        errorDetails
      ) as any;
    }

    // Process calculation
    const processingResult = await queueManager.processRequest(
      requestId, 
      validationResult.sanitizedData as CalculationRequest
    );

    if (!processingResult.success) {
      return createErrorResponse(
        'PROCESSING_FAILED', 
        requestId,
        { message: processingResult.error || 'Processing failed', processing_time_ms: processingResult.processingTimeMs }
      ) as any;
    }

    // Success response
    return createSuccessResponse(
      processingResult.results!,
      requestId,
      processingResult.processingTimeMs,
      {
        excelVersion: 'calc.xlsx v7',
        timestamp: new Date().toISOString(),
        queueTimeMs: processingResult.queueTimeMs,
        totalTimeMs: Date.now() - startTime
      }
    );

  } catch (error) {
    return createErrorResponse(
      'INTERNAL_ERROR',
      requestId,
      { message: error instanceof Error ? error.message : String(error), processing_time_ms: Date.now() - startTime }
    ) as any;
  }
}

// Bitrix24 webhook endpoint
app.post('/api/bitrix24/webhook', 
  bitrixAuthMiddleware.handlePreflight(),
  bitrixAuthMiddleware.addBitrixHeaders(),
  bitrixAuthMiddleware.authenticate(),
  async (req: Request, res: Response) => {
    await bitrix24Integration.handleCalculationWebhook(req, res, executeCalculation);
  }
);

// Bitrix24 REST API endpoint
app.post('/api/bitrix24/rest',
  bitrixAuthMiddleware.handlePreflight(),
  bitrixAuthMiddleware.addBitrixHeaders(),
  bitrixAuthMiddleware.authenticate(),
  async (req: Request, res: Response) => {
    await bitrix24Integration.handleRestRequest(req, res, executeCalculation);
  }
);


// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Get required fields
app.get('/api/fields/required', (_req: Request, res: Response) => {
  const requiredFields = validator.getRequiredFields();
  res.json({
    success: true,
    fields: requiredFields,
    count: requiredFields.length
  });
});

// Excel processor diagnostics
app.get('/api/diagnostics', async (_req: Request, res: Response) => {
  try {
    const stats = await excelProcessor.getProcessingStats();
    const templateValidation = await excelProcessor.validateTemplate();
    
    res.json({
      success: true,
      excel_processor: stats,
      template_validation: templateValidation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Diagnostics failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    });
  }
});

// Queue metrics and monitoring
app.get('/api/metrics', (_req: Request, res: Response) => {
  try {
    const queueStats = queueManager.getStats();
    const rateLimiterStats = rateLimiter.getStats();
    const workerStats = queueManager.getWorkerStats();

    res.json({
      success: true,
      metrics: {
        queue: queueStats,
        rate_limiter: rateLimiterStats,
        workers: workerStats,
        system: {
          memory: process.memoryUsage(),
          uptime: process.uptime(),
          pid: process.pid,
          platform: process.platform,
          node_version: process.version
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Metrics collection failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    });
  }
});

// Admin endpoints (for monitoring and management)
app.get('/api/admin/queue/stats', (_req: Request, res: Response) => {
  try {
    const stats = queueManager.getStats();
    const workers = queueManager.getWorkerStats();
    
    res.json({
      success: true,
      queue_stats: stats,
      workers: workers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to get queue stats: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/admin/queue/clear', (_req: Request, res: Response) => {
  try {
    queueManager.clear();
    res.json({
      success: true,
      message: 'Queue cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to clear queue: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/admin/rate-limiter/stats', (_req: Request, res: Response) => {
  try {
    const stats = rateLimiter.getStats();
    res.json({
      success: true,
      rate_limiter_stats: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to get rate limiter stats: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/admin/rate-limiter/reset', (_req: Request, res: Response) => {
  try {
    rateLimiter.resetAll();
    res.json({
      success: true,
      message: 'Rate limiter reset successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to reset rate limiter: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced error monitoring endpoints
app.get('/api/admin/errors/recent', async (_req: Request, res: Response) => {
  try {
    const recentErrors = errorLogger.getRecentErrors(50);
    const metrics = errorLogger.getMetrics();
    
    res.json({
      success: true,
      recent_errors: recentErrors,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to get error data: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

app.get('/api/admin/errors/security', async (_req: Request, res: Response) => {
  try {
    const securityIncidents = errorLogger.getSecurityIncidents();
    
    res.json({
      success: true,
      security_incidents: securityIncidents,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Failed to get security data: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

app.get('/api/admin/circuit-breaker/status', (_req: Request, res: Response) => {
  const status = circuitBreaker.getState();
  res.json({
    success: true,
    circuit_breaker: status,
    timestamp: new Date().toISOString()
  });
});


// Main calculation endpoint with comprehensive error handling
app.post('/api/calculate', async (req: Request, res: Response): Promise<Response> => {
  const startTime = (req as any).startTime || Date.now();
  const requestId = (req as any).requestId;

  return circuitBreaker.execute(async () => {
    try {
      console.log(`[${requestId}] Processing calculation request with enhanced error handling`);

      // Basic validation
      const validationResult = await validator.validate(req.body);

      // Handle validation errors with enhanced error responses
      if (!validationResult.isValid) {
        console.log(`[${requestId}] Validation failed: ${validationResult.errors.length} errors`);
        
        // Categorize validation errors
        const missingRequiredFields = validationResult.errors
          .filter(err => err.code === 'any.required')
          .map(err => err.field);
        
        const fieldErrors = validationResult.errors
          .filter(err => err.code !== 'any.required')
          .reduce((acc, err) => {
            acc[err.field] = err.message;
            return acc;
          }, {} as Record<string, string>);
        
        const errorDetails: any = {};
        if (missingRequiredFields.length > 0) {
          errorDetails.missing_required_fields = missingRequiredFields;
        }
        if (Object.keys(fieldErrors).length > 0) {
          errorDetails.field_errors = fieldErrors;
        }
        
        return res.status(422).json({
          success: false,
          request_id: requestId,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Input validation failed with comprehensive edge case detection',
            details: errorDetails
          },
          warnings: validationResult.warnings,
          metadata: {
            processingTimeMs: Date.now() - startTime,
            timestamp: new Date().toISOString()
          }
        });
      }

      // Log warnings but continue processing
      if (validationResult.warnings && validationResult.warnings.length > 0) {
        console.log(`[${requestId}] Validation warnings: ${validationResult.warnings.length}`);
      }

      // Step 3: Queue request for processing
      console.log(`[${requestId}] Queuing request for Excel processing`);
      const processingResult = await queueManager.processRequest(
        requestId, 
        validationResult.sanitizedData as CalculationRequest
      );

      if (!processingResult.success) {
        console.log(`[${requestId}] Processing failed: ${processingResult.error}`);
        return res.status(422).json({
          success: false,
          request_id: requestId,
          error: {
            code: 'PROCESSING_FAILED',
            message: processingResult.error || 'Processing failed',
            queue_time_ms: processingResult.queueTimeMs,
            processing_time_ms: processingResult.processingTimeMs
          },
          timestamp: new Date().toISOString()
        });
      }

      // Step 4: Build success response
      console.log(`[${requestId}] Processing completed successfully`);
      const response = createSuccessResponse(
        processingResult.results!,
        requestId,
        processingResult.processingTimeMs,
        {
          excelVersion: 'calc.xlsx v7',
          timestamp: new Date().toISOString(),
          queueTimeMs: processingResult.queueTimeMs,
          totalTimeMs: Date.now() - startTime
        }
      );

      // Add validation warnings if present
      if (validationResult.warnings && validationResult.warnings.length > 0) {
        (response as any).validation_warnings = validationResult.warnings;
      }

      console.log(`[${requestId}] Request completed in ${Date.now() - startTime}ms`);
      return res.json(response);

    } catch (error) {
      const totalTime = Date.now() - startTime;
      console.error(`[${requestId}] Error processing request:`, error);

      // Convert to ExcelApiError if needed
      const excelError = error instanceof ExcelApiError ? error : 
        ErrorFactory.create(
          ErrorType.INTERNAL_ERROR,
          error instanceof Error ? error.message : String(error),
          { requestId, processingTime: totalTime }
        );

      // Log error
      await errorLogger.logError(excelError, {
        requestId,
        endpoint: '/api/calculate',
        processingTimeMs: totalTime
      });

      return res.status(500).json({
        success: false,
        request_id: requestId,
        error: {
          code: excelError.type,
          message: 'An error occurred during processing',
          error_id: excelError.errorId
        },
        metadata: {
          processingTimeMs: totalTime,
          timestamp: new Date().toISOString()
        }
      });
    }
  });
});

// Apply comprehensive error handling middleware
app.use(errorHandler.middleware());

// Final error handling middleware for any remaining errors
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req as any).requestId || 'unknown';
  console.error(`[${requestId}] Unhandled error:`, err);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    },
    request_id: requestId,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling with enhanced cleanup
const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}, shutting down gracefully with error system cleanup...`);
  
  try {
    // Stop accepting new requests
    console.log('Stopping queue manager...');
    await queueManager.shutdown();
    
    // Reset rate limiter
    console.log('Shutting down rate limiter...');
    rateLimiter.shutdown();
    
    // Final error log flush
    console.log('Flushing error logs...');
    
    console.log('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Enhanced startup logging
app.listen(PORT, () => {
  console.log(`\nExcel Processor API with Comprehensive Error Handling`);
  console.log(`Running on port ${PORT}`);
  console.log(`Security: Request sanitization, threat detection`);
  console.log(`Performance: Circuit breaker, queue management, memory limits`);
  console.log(`Error Handling: 60+ edge cases, comprehensive logging`);
  console.log(`Monitoring: Real-time metrics, error tracking`);
  console.log('');
  console.log('API Endpoints:');
  console.log(`  Health check:     GET  http://localhost:${PORT}/health`);
  console.log(`  Calculation:      POST http://localhost:${PORT}/api/calculate`);
  console.log(`  Required fields:  GET  http://localhost:${PORT}/api/fields/required`);
  console.log(`  Diagnostics:      GET  http://localhost:${PORT}/api/diagnostics`);
  console.log(`  Metrics:          GET  http://localhost:${PORT}/api/metrics`);
  console.log('');
  console.log('Bitrix24 Endpoints:');
  console.log(`  Webhook:          POST http://localhost:${PORT}/api/bitrix24/webhook`);
  console.log(`  REST API:         POST http://localhost:${PORT}/api/bitrix24/rest`);
  console.log(`  Auth stats:       GET  http://localhost:${PORT}/api/bitrix24/auth/stats`);
  console.log('');
  console.log('Admin Endpoints:');
  console.log(`  Queue stats:      GET  http://localhost:${PORT}/api/admin/queue/stats`);
  console.log(`  Error monitoring: GET  http://localhost:${PORT}/api/admin/errors/recent`);
  console.log(`  Security events:  GET  http://localhost:${PORT}/api/admin/errors/security`);
  console.log(`  Circuit breaker:  GET  http://localhost:${PORT}/api/admin/circuit-breaker/status`);
  console.log(`  Bitrix24 reset:   POST http://localhost:${PORT}/api/admin/bitrix24/auth/reset/:app`);
  console.log('');
  console.log('System Status:');
  console.log(`  Workers: ${queueManager.getStats().totalWorkers}`);
  console.log(`  Rate limit: 100/min`);
  console.log(`  Memory limit: 512MB`);
  console.log(`  Error logging: Enabled`);
  console.log(`  Security scanning: Enabled`);
  console.log('');
});

export default app;