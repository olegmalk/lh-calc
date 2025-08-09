"use strict";
/**
 * Error Handler Middleware with Recovery Mechanisms
 * Handles all custom errors and provides appropriate responses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = exports.GlobalErrorHandler = exports.ErrorHandler = void 0;
const custom_errors_1 = require("../errors/custom-errors");
const error_logger_1 = require("../services/error-logger");
/**
 * Main error handler middleware with comprehensive error processing
 */
class ErrorHandler {
    constructor(options = {}) {
        this.options = {
            enableRecovery: options.enableRecovery ?? true,
            maxRetryAttempts: options.maxRetryAttempts ?? 3,
            securityAlertWebhook: options.securityAlertWebhook ?? '',
            includeStackTrace: options.includeStackTrace ?? process.env.NODE_ENV === 'development',
            sanitizeErrorMessages: options.sanitizeErrorMessages ?? true
        };
        this.logger = new error_logger_1.ErrorLogger();
    }
    /**
     * Express middleware error handler
     */
    middleware() {
        return async (error, req, res, next) => {
            const requestId = req.requestId || 'unknown';
            const startTime = Date.now();
            try {
                // Convert generic errors to ExcelApiError
                const excelError = this.normalizeError(error, req);
                // Log error with context
                await this.logger.logError(excelError, {
                    requestId,
                    url: req.url,
                    method: req.method,
                    userAgent: req.get('User-Agent'),
                    ip: req.ip,
                    body: this.sanitizeRequestBody(req.body)
                });
                // Handle security threats immediately
                if (custom_errors_1.ErrorClassifier.isSecurityThreat(excelError)) {
                    await this.handleSecurityThreat(excelError, req);
                }
                // Attempt recovery if enabled and error is recoverable
                let recoveryResult = null;
                if (this.options.enableRecovery && custom_errors_1.ErrorClassifier.isRecoverable(excelError)) {
                    recoveryResult = await this.attemptRecovery(excelError, req);
                }
                // Generate error response
                const errorResponse = await this.generateErrorResponse(excelError, requestId, Date.now() - startTime, recoveryResult);
                // Set appropriate HTTP status
                const statusCode = this.getHttpStatusCode(excelError);
                res.status(statusCode).json(errorResponse);
            }
            catch (handlingError) {
                // Error in error handling - fallback to basic response
                console.error('Error in error handler:', handlingError);
                res.status(500).json({
                    success: false,
                    error: 'Internal server error during error processing',
                    request_id: requestId,
                    timestamp: new Date().toISOString()
                });
            }
        };
    }
    /**
     * Normalize generic errors to ExcelApiError
     */
    normalizeError(error, req) {
        if (error instanceof custom_errors_1.ExcelApiError) {
            return error;
        }
        // Detect error patterns and create appropriate error types
        const errorMessage = error.message.toLowerCase();
        // Division by zero patterns
        if (errorMessage.includes('division by zero') || errorMessage.includes('#div/0')) {
            return new custom_errors_1.ExcelApiError(error.message, custom_errors_1.ErrorType.DIVISION_BY_ZERO, custom_errors_1.ErrorSeverity.HIGH, { originalError: error.constructor.name }, false);
        }
        // VLOOKUP patterns
        if (errorMessage.includes('#n/a') || errorMessage.includes('vlookup')) {
            return new custom_errors_1.ExcelApiError(error.message, custom_errors_1.ErrorType.VLOOKUP_FAILURE, custom_errors_1.ErrorSeverity.HIGH, { originalError: error.constructor.name }, false);
        }
        // Memory patterns
        if (errorMessage.includes('memory') || errorMessage.includes('out of memory')) {
            return new custom_errors_1.ExcelApiError(error.message, custom_errors_1.ErrorType.MEMORY_EXHAUSTION, custom_errors_1.ErrorSeverity.CRITICAL, { originalError: error.constructor.name }, false);
        }
        // Timeout patterns
        if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
            return new custom_errors_1.ExcelApiError(error.message, custom_errors_1.ErrorType.TIMEOUT_ERROR, custom_errors_1.ErrorSeverity.HIGH, { originalError: error.constructor.name }, true);
        }
        // File access patterns
        if (errorMessage.includes('enoent') || errorMessage.includes('file not found')) {
            return new custom_errors_1.ExcelApiError(error.message, custom_errors_1.ErrorType.FILE_CORRUPTION, custom_errors_1.ErrorSeverity.HIGH, { originalError: error.constructor.name }, false);
        }
        // Default to internal error
        return new custom_errors_1.ExcelApiError(error.message, custom_errors_1.ErrorType.INTERNAL_ERROR, custom_errors_1.ErrorSeverity.MEDIUM, { originalError: error.constructor.name, stack: error.stack }, false);
    }
    /**
     * Attempt error recovery based on error type
     */
    async attemptRecovery(error, req) {
        try {
            switch (error.type) {
                case custom_errors_1.ErrorType.TIMEOUT_ERROR:
                    return {
                        recovered: false,
                        retryAfter: 30000 // 30 seconds
                    };
                case custom_errors_1.ErrorType.MEMORY_EXHAUSTION:
                    // Trigger garbage collection and suggest retry
                    if (global.gc) {
                        global.gc();
                    }
                    return {
                        recovered: false,
                        retryAfter: 60000 // 1 minute
                    };
                case custom_errors_1.ErrorType.CONCURRENT_ACCESS_ERROR:
                    return {
                        recovered: false,
                        retryAfter: 5000 // 5 seconds
                    };
                case custom_errors_1.ErrorType.TYPE_CONVERSION_ERROR:
                    // Try to provide default values for type conversion errors
                    if (error.context.field && error.context.expectedType) {
                        const defaultValue = this.getDefaultValueForType(error.context.expectedType);
                        if (defaultValue !== null) {
                            return {
                                recovered: true,
                                alternativeResult: {
                                    field: error.context.field,
                                    defaultValue,
                                    warning: `Used default value due to type conversion error`
                                }
                            };
                        }
                    }
                    break;
                case custom_errors_1.ErrorType.MISSING_REQUIRED_FIELDS:
                    // Provide information about missing fields for recovery
                    return {
                        recovered: false,
                        alternativeResult: {
                            missingFields: error.context.missingFields,
                            suggestion: 'Please provide all required fields and retry'
                        }
                    };
                default:
                    return { recovered: false };
            }
        }
        catch (recoveryError) {
            console.error('Error during recovery attempt:', recoveryError);
        }
        return { recovered: false };
    }
    /**
     * Handle security threats with immediate action
     */
    async handleSecurityThreat(error, req) {
        const context = {
            error: error.toJSON(),
            request: {
                url: req.url,
                method: req.method,
                headers: this.sanitizeHeaders(req.headers),
                ip: req.ip,
                userAgent: req.get('User-Agent')
            },
            timestamp: new Date().toISOString()
        };
        // Log security incident
        await this.logger.logSecurityIncident(error, context);
        // Send alert if webhook configured
        if (this.options.securityAlertWebhook) {
            try {
                // In production, this would send to security monitoring system
                console.warn('SECURITY ALERT:', context);
            }
            catch (alertError) {
                console.error('Failed to send security alert:', alertError);
            }
        }
        // Consider implementing IP blocking for repeated offenses
        if (error.type === custom_errors_1.ErrorType.SQL_INJECTION_ATTEMPT || error.type === custom_errors_1.ErrorType.XSS_ATTEMPT) {
            // Log IP for potential blocking
            console.warn(`Potential malicious activity from IP: ${req.ip}`);
        }
    }
    /**
     * Generate structured error response
     */
    async generateErrorResponse(error, requestId, processingTime, recovery) {
        const baseResponse = {
            success: false,
            error: {
                code: error.type,
                message: this.sanitizeErrorMessage(error.message),
                severity: error.severity,
                recoverable: error.recoverable,
                error_id: error.errorId
            },
            request_id: requestId,
            timestamp: error.timestamp,
            processing_time_ms: processingTime
        };
        // Add recovery information
        if (recovery) {
            baseResponse.recovery = {
                attempted: true,
                successful: recovery.recovered,
                retry_after_ms: recovery.retryAfter,
                alternative_result: recovery.alternativeResult
            };
        }
        // Add context for non-security errors
        if (!custom_errors_1.ErrorClassifier.isSecurityThreat(error)) {
            baseResponse.details = this.sanitizeErrorContext(error.context);
        }
        // Add stack trace in development
        if (this.options.includeStackTrace && error.context.stack) {
            baseResponse.stack = error.context.stack;
        }
        // Add specific error type information
        if (error instanceof custom_errors_1.ValidationError) {
            baseResponse.validation = {
                field: error.context.field,
                expected_type: error.context.expectedType,
                mitigation: error.context.mitigationStrategy
            };
        }
        if (error instanceof custom_errors_1.FormulaError) {
            baseResponse.excel_details = {
                affected_cells: error.context.affectedCells,
                formula_error: true,
                mitigation: error.context.mitigationStrategy
            };
        }
        if (error instanceof custom_errors_1.BusinessLogicError) {
            baseResponse.business_logic = {
                constraint_violation: true,
                affected_fields: error.context.fields,
                mitigation: error.context.mitigationStrategy
            };
        }
        return baseResponse;
    }
    /**
     * Determine HTTP status code for error type
     */
    getHttpStatusCode(error) {
        switch (error.constructor) {
            case custom_errors_1.ValidationError:
            case custom_errors_1.ApiContractError:
                return 400; // Bad Request
            case custom_errors_1.SecurityError:
                return 403; // Forbidden
            case custom_errors_1.SystemError:
                if (error.type === custom_errors_1.ErrorType.TIMEOUT_ERROR) {
                    return 408; // Request Timeout
                }
                if (error.type === custom_errors_1.ErrorType.MEMORY_EXHAUSTION) {
                    return 503; // Service Unavailable
                }
                return 500; // Internal Server Error
            case custom_errors_1.FormulaError:
            case custom_errors_1.BusinessLogicError:
                return 422; // Unprocessable Entity
            default:
                switch (error.severity) {
                    case custom_errors_1.ErrorSeverity.CRITICAL:
                        return 500;
                    case custom_errors_1.ErrorSeverity.HIGH:
                        return 422;
                    case custom_errors_1.ErrorSeverity.MEDIUM:
                        return 400;
                    default:
                        return 400;
                }
        }
    }
    /**
     * Utility methods for data sanitization
     */
    sanitizeErrorMessage(message) {
        if (!this.options.sanitizeErrorMessages) {
            return message;
        }
        // Remove sensitive information patterns
        return message
            .replace(/password[=:]\s*\w+/gi, 'password=[REDACTED]')
            .replace(/token[=:]\s*\w+/gi, 'token=[REDACTED]')
            .replace(/key[=:]\s*\w+/gi, 'key=[REDACTED]')
            .replace(/secret[=:]\s*\w+/gi, 'secret=[REDACTED]');
    }
    sanitizeErrorContext(context) {
        const sanitized = { ...context };
        // Remove sensitive fields
        const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
        for (const field of sensitiveFields) {
            if (sanitized[field]) {
                sanitized[field] = '[REDACTED]';
            }
        }
        // Truncate long values
        for (const [key, value] of Object.entries(sanitized)) {
            if (typeof value === 'string' && value.length > 1000) {
                sanitized[key] = value.substring(0, 1000) + '... [TRUNCATED]';
            }
        }
        return sanitized;
    }
    sanitizeRequestBody(body) {
        if (!body || typeof body !== 'object') {
            return body;
        }
        const sanitized = { ...body };
        const maxFieldSize = 100;
        // Truncate all field values
        for (const [key, value] of Object.entries(sanitized)) {
            if (typeof value === 'string' && value.length > maxFieldSize) {
                sanitized[key] = value.substring(0, maxFieldSize) + '...';
            }
        }
        return sanitized;
    }
    sanitizeHeaders(headers) {
        const sanitized = { ...headers };
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
        for (const header of sensitiveHeaders) {
            if (sanitized[header]) {
                sanitized[header] = '[REDACTED]';
            }
        }
        return sanitized;
    }
    getDefaultValueForType(type) {
        switch (type.toLowerCase()) {
            case 'number':
                return 0;
            case 'string':
                return '';
            case 'boolean':
                return false;
            default:
                return null;
        }
    }
}
exports.ErrorHandler = ErrorHandler;
/**
 * Global error handler for uncaught exceptions
 */
class GlobalErrorHandler {
    static setup() {
        // Handle uncaught exceptions
        process.on('uncaughtException', async (error) => {
            console.error('Uncaught Exception:', error);
            const excelError = new custom_errors_1.ExcelApiError(`Uncaught exception: ${error.message}`, custom_errors_1.ErrorType.INTERNAL_ERROR, custom_errors_1.ErrorSeverity.CRITICAL, { stack: error.stack, uncaught: true });
            await GlobalErrorHandler.logger.logError(excelError, {
                source: 'uncaughtException',
                pid: process.pid,
                timestamp: new Date().toISOString()
            });
            // Graceful shutdown
            process.exit(1);
        });
        // Handle unhandled promise rejections
        process.on('unhandledRejection', async (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
            const excelError = new custom_errors_1.ExcelApiError(`Unhandled promise rejection: ${reason}`, custom_errors_1.ErrorType.INTERNAL_ERROR, custom_errors_1.ErrorSeverity.HIGH, { reason: String(reason), unhandledRejection: true });
            await GlobalErrorHandler.logger.logError(excelError, {
                source: 'unhandledRejection',
                pid: process.pid,
                timestamp: new Date().toISOString()
            });
        });
        // Handle warnings
        process.on('warning', (warning) => {
            console.warn('Node.js Warning:', warning.name, warning.message);
        });
    }
}
exports.GlobalErrorHandler = GlobalErrorHandler;
GlobalErrorHandler.logger = new error_logger_1.ErrorLogger();
/**
 * Circuit breaker for preventing cascading failures
 */
class CircuitBreaker {
    constructor(maxFailures = 5, resetTimeoutMs = 60000 // 1 minute
    ) {
        this.maxFailures = maxFailures;
        this.resetTimeoutMs = resetTimeoutMs;
        this.failures = 0;
        this.lastFailureTime = 0;
        this.state = 'CLOSED';
    }
    async execute(operation) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime < this.resetTimeoutMs) {
                throw new custom_errors_1.SystemError('Circuit breaker is OPEN - too many recent failures', custom_errors_1.ErrorType.INTERNAL_ERROR, { state: this.state, failures: this.failures });
            }
            this.state = 'HALF_OPEN';
        }
        try {
            const result = await operation();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        this.failures = 0;
        this.state = 'CLOSED';
    }
    onFailure() {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.maxFailures) {
            this.state = 'OPEN';
        }
    }
    getState() {
        return {
            state: this.state,
            failures: this.failures,
            lastFailureTime: this.lastFailureTime
        };
    }
}
exports.CircuitBreaker = CircuitBreaker;
//# sourceMappingURL=error-handler.js.map