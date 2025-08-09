/**
 * Error Handler Middleware with Recovery Mechanisms
 * Handles all custom errors and provides appropriate responses
 */

import { Request, Response, NextFunction } from 'express';
import { 
  ExcelApiError, 
  ErrorType, 
  ErrorSeverity, 
  ErrorClassifier, 
  SecurityError,
  SystemError,
  ValidationError,
  FormulaError,
  BusinessLogicError,
  ApiContractError
} from '../errors/custom-errors';
import { ErrorLogger } from '../services/error-logger';

export interface ErrorHandlerOptions {
  enableRecovery?: boolean;
  maxRetryAttempts?: number;
  securityAlertWebhook?: string;
  includeStackTrace?: boolean;
  sanitizeErrorMessages?: boolean;
}

export interface ErrorRecoveryResult {
  recovered: boolean;
  alternativeResult?: any;
  retryAfter?: number;
}

/**
 * Main error handler middleware with comprehensive error processing
 */
export class ErrorHandler {
  private readonly logger: ErrorLogger;
  private readonly options: Required<ErrorHandlerOptions>;

  constructor(options: ErrorHandlerOptions = {}) {
    this.options = {
      enableRecovery: options.enableRecovery ?? true,
      maxRetryAttempts: options.maxRetryAttempts ?? 3,
      securityAlertWebhook: options.securityAlertWebhook ?? '',
      includeStackTrace: options.includeStackTrace ?? process.env.NODE_ENV === 'development',
      sanitizeErrorMessages: options.sanitizeErrorMessages ?? true
    };
    this.logger = new ErrorLogger();
  }

  /**
   * Express middleware error handler
   */
  middleware() {
    return async (error: Error, req: Request, res: Response, _next: NextFunction) => {
      const requestId = (req as any).requestId || 'unknown';
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
        if (ErrorClassifier.isSecurityThreat(excelError)) {
          await this.handleSecurityThreat(excelError, req);
        }

        // Attempt recovery if enabled and error is recoverable
        let recoveryResult: ErrorRecoveryResult | null = null;
        if (this.options.enableRecovery && ErrorClassifier.isRecoverable(excelError)) {
          recoveryResult = await this.attemptRecovery(excelError, req);
        }

        // Generate error response
        const errorResponse = await this.generateErrorResponse(
          excelError,
          requestId,
          Date.now() - startTime,
          recoveryResult
        );

        // Set appropriate HTTP status
        const statusCode = this.getHttpStatusCode(excelError);
        res.status(statusCode).json(errorResponse);

      } catch (handlingError) {
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
  private normalizeError(error: Error, _req: Request): ExcelApiError {
    if (error instanceof ExcelApiError) {
      return error;
    }

    // Detect error patterns and create appropriate error types
    const errorMessage = error.message.toLowerCase();

    // Division by zero patterns
    if (errorMessage.includes('division by zero') || errorMessage.includes('#div/0')) {
      return new ExcelApiError(
        error.message,
        ErrorType.DIVISION_BY_ZERO,
        ErrorSeverity.HIGH,
        { originalError: error.constructor.name },
        false
      );
    }

    // VLOOKUP patterns
    if (errorMessage.includes('#n/a') || errorMessage.includes('vlookup')) {
      return new ExcelApiError(
        error.message,
        ErrorType.VLOOKUP_FAILURE,
        ErrorSeverity.HIGH,
        { originalError: error.constructor.name },
        false
      );
    }

    // Memory patterns
    if (errorMessage.includes('memory') || errorMessage.includes('out of memory')) {
      return new ExcelApiError(
        error.message,
        ErrorType.MEMORY_EXHAUSTION,
        ErrorSeverity.CRITICAL,
        { originalError: error.constructor.name },
        false
      );
    }

    // Timeout patterns
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return new ExcelApiError(
        error.message,
        ErrorType.TIMEOUT_ERROR,
        ErrorSeverity.HIGH,
        { originalError: error.constructor.name },
        true
      );
    }

    // File access patterns
    if (errorMessage.includes('enoent') || errorMessage.includes('file not found')) {
      return new ExcelApiError(
        error.message,
        ErrorType.FILE_CORRUPTION,
        ErrorSeverity.HIGH,
        { originalError: error.constructor.name },
        false
      );
    }

    // Default to internal error
    return new ExcelApiError(
      error.message,
      ErrorType.INTERNAL_ERROR,
      ErrorSeverity.MEDIUM,
      { originalError: error.constructor.name, stack: error.stack },
      false
    );
  }

  /**
   * Attempt error recovery based on error type
   */
  private async attemptRecovery(error: ExcelApiError, _req: Request): Promise<ErrorRecoveryResult> {
    try {
      switch (error.type) {
        case ErrorType.TIMEOUT_ERROR:
          return {
            recovered: false,
            retryAfter: 30000 // 30 seconds
          };

        case ErrorType.MEMORY_EXHAUSTION:
          // Trigger garbage collection and suggest retry
          if (global.gc) {
            global.gc();
          }
          return {
            recovered: false,
            retryAfter: 60000 // 1 minute
          };

        case ErrorType.CONCURRENT_ACCESS_ERROR:
          return {
            recovered: false,
            retryAfter: 5000 // 5 seconds
          };

        case ErrorType.TYPE_CONVERSION_ERROR:
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

        case ErrorType.MISSING_REQUIRED_FIELDS:
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
    } catch (recoveryError) {
      console.error('Error during recovery attempt:', recoveryError);
    }

    return { recovered: false };
  }

  /**
   * Handle security threats with immediate action
   */
  private async handleSecurityThreat(error: SecurityError, req: Request): Promise<void> {
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
      } catch (alertError) {
        console.error('Failed to send security alert:', alertError);
      }
    }

    // Consider implementing IP blocking for repeated offenses
    if (error.type === ErrorType.SQL_INJECTION_ATTEMPT || error.type === ErrorType.XSS_ATTEMPT) {
      // Log IP for potential blocking
      console.warn(`Potential malicious activity from IP: ${req.ip}`);
    }
  }

  /**
   * Generate structured error response
   */
  private async generateErrorResponse(
    error: ExcelApiError,
    requestId: string,
    processingTime: number,
    recovery: ErrorRecoveryResult | null
  ): Promise<any> {
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
      (baseResponse as any).recovery = {
        attempted: true,
        successful: recovery.recovered,
        retry_after_ms: recovery.retryAfter,
        alternative_result: recovery.alternativeResult
      };
    }

    // Add context for non-security errors
    if (!ErrorClassifier.isSecurityThreat(error)) {
      (baseResponse as any).details = this.sanitizeErrorContext(error.context);
    }

    // Add stack trace in development
    if (this.options.includeStackTrace && error.context.stack) {
      (baseResponse as any).stack = error.context.stack;
    }

    // Add specific error type information
    if (error instanceof ValidationError) {
      (baseResponse as any).validation = {
        field: error.context.field,
        expected_type: error.context.expectedType,
        mitigation: error.context.mitigationStrategy
      };
    }

    if (error instanceof FormulaError) {
      (baseResponse as any).excel_details = {
        affected_cells: error.context.affectedCells,
        formula_error: true,
        mitigation: error.context.mitigationStrategy
      };
    }

    if (error instanceof BusinessLogicError) {
      (baseResponse as any).business_logic = {
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
  private getHttpStatusCode(error: ExcelApiError): number {
    switch (error.constructor) {
      case ValidationError:
      case ApiContractError:
        return 400; // Bad Request

      case SecurityError:
        return 403; // Forbidden

      case SystemError:
        if (error.type === ErrorType.TIMEOUT_ERROR) {
          return 408; // Request Timeout
        }
        if (error.type === ErrorType.MEMORY_EXHAUSTION) {
          return 503; // Service Unavailable
        }
        return 500; // Internal Server Error

      case FormulaError:
      case BusinessLogicError:
        return 422; // Unprocessable Entity

      default:
        switch (error.severity) {
          case ErrorSeverity.CRITICAL:
            return 500;
          case ErrorSeverity.HIGH:
            return 422;
          case ErrorSeverity.MEDIUM:
            return 400;
          default:
            return 400;
        }
    }
  }

  /**
   * Utility methods for data sanitization
   */
  private sanitizeErrorMessage(message: string): string {
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

  private sanitizeErrorContext(context: any): any {
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

  private sanitizeRequestBody(body: any): any {
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

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    
    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private getDefaultValueForType(type: string): any {
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

/**
 * Global error handler for uncaught exceptions
 */
export class GlobalErrorHandler {
  private static logger = new ErrorLogger();

  static setup(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', async (error: Error) => {
      console.error('Uncaught Exception:', error);
      
      const excelError = new ExcelApiError(
        `Uncaught exception: ${error.message}`,
        ErrorType.INTERNAL_ERROR,
        ErrorSeverity.CRITICAL,
        { stack: error.stack, uncaught: true }
      );

      await GlobalErrorHandler.logger.logError(excelError, {
        source: 'uncaughtException',
        pid: process.pid,
        timestamp: new Date().toISOString()
      });

      // Graceful shutdown
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason: any, promise: Promise<any>) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);

      const excelError = new ExcelApiError(
        `Unhandled promise rejection: ${reason}`,
        ErrorType.INTERNAL_ERROR,
        ErrorSeverity.HIGH,
        { reason: String(reason), unhandledRejection: true }
      );

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

/**
 * Circuit breaker for preventing cascading failures
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private maxFailures = 5,
    private resetTimeoutMs = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime < this.resetTimeoutMs) {
        throw new SystemError(
          'Circuit breaker is OPEN - too many recent failures',
          ErrorType.INTERNAL_ERROR,
          { state: this.state, failures: this.failures }
        );
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.maxFailures) {
      this.state = 'OPEN';
    }
  }

  getState(): { state: string; failures: number; lastFailureTime: number } {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime
    };
  }
}