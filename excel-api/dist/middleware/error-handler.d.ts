/**
 * Error Handler Middleware with Recovery Mechanisms
 * Handles all custom errors and provides appropriate responses
 */
import { Request, Response, NextFunction } from 'express';
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
export declare class ErrorHandler {
    private readonly logger;
    private readonly options;
    constructor(options?: ErrorHandlerOptions);
    /**
     * Express middleware error handler
     */
    middleware(): (error: Error, req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Normalize generic errors to ExcelApiError
     */
    private normalizeError;
    /**
     * Attempt error recovery based on error type
     */
    private attemptRecovery;
    /**
     * Handle security threats with immediate action
     */
    private handleSecurityThreat;
    /**
     * Generate structured error response
     */
    private generateErrorResponse;
    /**
     * Determine HTTP status code for error type
     */
    private getHttpStatusCode;
    /**
     * Utility methods for data sanitization
     */
    private sanitizeErrorMessage;
    private sanitizeErrorContext;
    private sanitizeRequestBody;
    private sanitizeHeaders;
    private getDefaultValueForType;
}
/**
 * Global error handler for uncaught exceptions
 */
export declare class GlobalErrorHandler {
    private static logger;
    static setup(): void;
}
/**
 * Circuit breaker for preventing cascading failures
 */
export declare class CircuitBreaker {
    private maxFailures;
    private resetTimeoutMs;
    private failures;
    private lastFailureTime;
    private state;
    constructor(maxFailures?: number, resetTimeoutMs?: number);
    execute<T>(operation: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
    getState(): {
        state: string;
        failures: number;
        lastFailureTime: number;
    };
}
//# sourceMappingURL=error-handler.d.ts.map