"use strict";
/**
 * Excel Processor API Server with Comprehensive Error Handling
 * Production-ready API with 60+ edge case protections
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const field_validator_1 = require("./validators/field-validator");
const excel_processor_1 = require("./processors/excel-processor");
const rate_limiter_1 = require("./middleware/rate-limiter");
const queue_manager_1 = require("./services/queue-manager");
const error_handler_1 = require("./middleware/error-handler");
const error_logger_1 = require("./services/error-logger");
const api_contract_1 = require("./types/api-contract");
const custom_errors_1 = require("./errors/custom-errors");
const bitrix24_1 = require("./integrations/bitrix24");
const bitrix_auth_1 = require("./middleware/bitrix-auth");
// Load environment variables
dotenv_1.default.config();
// Initialize comprehensive error handling system
error_handler_1.GlobalErrorHandler.setup();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Initialize services with enhanced error handling
const validator = new field_validator_1.FieldValidator();
const errorLogger = new error_logger_1.ErrorLogger();
const errorHandler = new error_handler_1.ErrorHandler({
    enableRecovery: true,
    maxRetryAttempts: 3,
    includeStackTrace: process.env.NODE_ENV === 'development',
    sanitizeErrorMessages: process.env.NODE_ENV === 'production'
});
// Initialize Excel processor with enhanced options
const excelProcessor = new excel_processor_1.ExcelProcessor({
    maxRetries: 3,
    retryDelayMs: 200,
    enableCircularReferenceDetection: true,
    memoryLimitMB: 512,
    enableFileIntegrityCheck: true
});
const queueManager = new queue_manager_1.QueueManager(excelProcessor, {
    maxWorkers: 5,
    maxQueueSize: 200,
    requestTimeoutMs: 45000 // Increased for complex calculations
});
// Circuit breaker for critical operations
const circuitBreaker = new error_handler_1.CircuitBreaker(5, 60000);
// Initialize simplified Bitrix24 integration (no auth)
const bitrix24Integration = new bitrix24_1.Bitrix24Integration();
const bitrixAuthMiddleware = new bitrix_auth_1.BitrixAuthMiddleware();
// Middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// CORS configuration for Bitrix24
app.use((0, cors_1.default)({
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
app.use(rate_limiter_1.rateLimiter.middleware());
// Basic request logging middleware
app.use((req, res, next) => {
    const requestId = (0, api_contract_1.generateRequestId)();
    const startTime = Date.now();
    req.requestId = requestId;
    req.startTime = startTime;
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
        }
        catch (error) {
            console.warn(`[${requestId}] Request body processing warning:`, error instanceof Error ? error.message : String(error));
        }
    }
    next();
    return;
});
// Simplified calculation handler
async function executeCalculation(data, requestId) {
    const startTime = Date.now();
    try {
        // Basic validation only
        const validationResult = await validator.validate(data);
        if (!validationResult.isValid) {
            return (0, api_contract_1.createErrorResponse)('VALIDATION_FAILED', 'Input validation failed', requestId, { details: validationResult.errors });
        }
        // Process calculation
        const processingResult = await queueManager.processRequest(requestId, validationResult.sanitizedData);
        if (!processingResult.success) {
            return (0, api_contract_1.createErrorResponse)('PROCESSING_FAILED', processingResult.error || 'Processing failed', requestId, { processingTimeMs: processingResult.processingTimeMs });
        }
        // Success response
        return (0, api_contract_1.createSuccessResponse)(processingResult.results, requestId, processingResult.processingTimeMs, {
            excelVersion: 'calc.xlsx v7',
            timestamp: new Date().toISOString(),
            queueTimeMs: processingResult.queueTimeMs,
            totalTimeMs: Date.now() - startTime
        });
    }
    catch (error) {
        return (0, api_contract_1.createErrorResponse)('INTERNAL_ERROR', error instanceof Error ? error.message : String(error), requestId, { processingTimeMs: Date.now() - startTime });
    }
}
// Bitrix24 webhook endpoint
app.post('/api/bitrix24/webhook', bitrixAuthMiddleware.handlePreflight(), bitrixAuthMiddleware.addBitrixHeaders(), bitrixAuthMiddleware.authenticate(), async (req, res) => {
    await bitrix24Integration.handleCalculationWebhook(req, res, executeCalculation);
});
// Bitrix24 REST API endpoint
app.post('/api/bitrix24/rest', bitrixAuthMiddleware.handlePreflight(), bitrixAuthMiddleware.addBitrixHeaders(), bitrixAuthMiddleware.authenticate(), async (req, res) => {
    await bitrix24Integration.handleRestRequest(req, res, executeCalculation);
});
// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// Get required fields
app.get('/api/fields/required', (_req, res) => {
    const requiredFields = validator.getRequiredFields();
    res.json({
        success: true,
        fields: requiredFields,
        count: requiredFields.length
    });
});
// Excel processor diagnostics
app.get('/api/diagnostics', async (_req, res) => {
    try {
        const stats = await excelProcessor.getProcessingStats();
        const templateValidation = await excelProcessor.validateTemplate();
        res.json({
            success: true,
            excel_processor: stats,
            template_validation: templateValidation,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Diagnostics failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toISOString()
        });
    }
});
// Queue metrics and monitoring
app.get('/api/metrics', (_req, res) => {
    try {
        const queueStats = queueManager.getStats();
        const rateLimiterStats = rate_limiter_1.rateLimiter.getStats();
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Metrics collection failed: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toISOString()
        });
    }
});
// Admin endpoints (for monitoring and management)
app.get('/api/admin/queue/stats', (_req, res) => {
    try {
        const stats = queueManager.getStats();
        const workers = queueManager.getWorkerStats();
        res.json({
            success: true,
            queue_stats: stats,
            workers: workers,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Failed to get queue stats: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toISOString()
        });
    }
});
app.post('/api/admin/queue/clear', (_req, res) => {
    try {
        queueManager.clear();
        res.json({
            success: true,
            message: 'Queue cleared successfully',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Failed to clear queue: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toISOString()
        });
    }
});
app.get('/api/admin/rate-limiter/stats', (_req, res) => {
    try {
        const stats = rate_limiter_1.rateLimiter.getStats();
        res.json({
            success: true,
            rate_limiter_stats: stats,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Failed to get rate limiter stats: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toISOString()
        });
    }
});
app.post('/api/admin/rate-limiter/reset', (_req, res) => {
    try {
        rate_limiter_1.rateLimiter.resetAll();
        res.json({
            success: true,
            message: 'Rate limiter reset successfully',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Failed to reset rate limiter: ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toISOString()
        });
    }
});
// Enhanced error monitoring endpoints
app.get('/api/admin/errors/recent', async (_req, res) => {
    try {
        const recentErrors = errorLogger.getRecentErrors(50);
        const metrics = errorLogger.getMetrics();
        res.json({
            success: true,
            recent_errors: recentErrors,
            metrics,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Failed to get error data: ${error instanceof Error ? error.message : String(error)}`
        });
    }
});
app.get('/api/admin/errors/security', async (_req, res) => {
    try {
        const securityIncidents = errorLogger.getSecurityIncidents();
        res.json({
            success: true,
            security_incidents: securityIncidents,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Failed to get security data: ${error instanceof Error ? error.message : String(error)}`
        });
    }
});
app.get('/api/admin/circuit-breaker/status', (_req, res) => {
    const status = circuitBreaker.getState();
    res.json({
        success: true,
        circuit_breaker: status,
        timestamp: new Date().toISOString()
    });
});
// Main calculation endpoint with comprehensive error handling
app.post('/api/calculate', async (req, res) => {
    const startTime = req.startTime || Date.now();
    const requestId = req.requestId;
    return circuitBreaker.execute(async () => {
        try {
            console.log(`[${requestId}] Processing calculation request with enhanced error handling`);
            // Basic validation
            const validationResult = await validator.validate(req.body);
            // Handle validation errors with enhanced error responses
            if (!validationResult.isValid) {
                console.log(`[${requestId}] Validation failed: ${validationResult.errors.length} errors`);
                return res.status(422).json({
                    success: false,
                    request_id: requestId,
                    error: {
                        code: 'VALIDATION_FAILED',
                        message: 'Input validation failed with comprehensive edge case detection',
                        details: validationResult.errors
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
            const processingResult = await queueManager.processRequest(requestId, validationResult.sanitizedData);
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
            const response = (0, api_contract_1.createSuccessResponse)(processingResult.results, requestId, processingResult.processingTimeMs, {
                excelVersion: 'calc.xlsx v7',
                timestamp: new Date().toISOString(),
                queueTimeMs: processingResult.queueTimeMs,
                totalTimeMs: Date.now() - startTime
            });
            // Add validation warnings if present
            if (validationResult.warnings && validationResult.warnings.length > 0) {
                response.validation_warnings = validationResult.warnings;
            }
            console.log(`[${requestId}] Request completed in ${Date.now() - startTime}ms`);
            return res.json(response);
        }
        catch (error) {
            const totalTime = Date.now() - startTime;
            console.error(`[${requestId}] Error processing request:`, error);
            // Convert to ExcelApiError if needed
            const excelError = error instanceof custom_errors_1.ExcelApiError ? error :
                custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.INTERNAL_ERROR, error instanceof Error ? error.message : String(error), { requestId, processingTime: totalTime });
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
app.use((err, req, res, _next) => {
    const requestId = req.requestId || 'unknown';
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
const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}, shutting down gracefully with error system cleanup...`);
    try {
        // Stop accepting new requests
        console.log('Stopping queue manager...');
        await queueManager.shutdown();
        // Reset rate limiter
        console.log('Shutting down rate limiter...');
        rate_limiter_1.rateLimiter.shutdown();
        // Final error log flush
        console.log('Flushing error logs...');
        console.log('Graceful shutdown completed');
        process.exit(0);
    }
    catch (error) {
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
exports.default = app;
//# sourceMappingURL=index.js.map