/**
 * Error Logger Service with Monitoring and Analytics
 * Provides comprehensive error tracking and reporting
 */
import { ExcelApiError, ErrorType, ErrorSeverity, SecurityError } from '../errors/custom-errors';
export interface LogContext {
    requestId?: string;
    url?: string;
    method?: string;
    userAgent?: string;
    ip?: string;
    body?: any;
    userId?: string;
    sessionId?: string;
    [key: string]: any;
}
export interface ErrorMetrics {
    totalErrors: number;
    errorsByType: Record<ErrorType, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
    securityThreats: number;
    averageResolutionTime: number;
    topErrors: Array<{
        type: ErrorType;
        count: number;
        lastOccurrence: string;
    }>;
    systemHealth: {
        memoryUsage: number;
        cpuUsage: number;
        uptime: number;
        errorRate: number;
    };
}
export interface LogEntry {
    timestamp: string;
    level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'SECURITY';
    errorId: string;
    type: ErrorType;
    severity: ErrorSeverity;
    message: string;
    context: LogContext;
    stack?: string;
    resolved: boolean;
    resolutionTime?: number;
    tags: string[];
}
export interface SecurityIncident {
    timestamp: string;
    incidentId: string;
    threatType: ErrorType;
    severity: ErrorSeverity;
    sourceIP: string;
    userAgent: string;
    attackVector: string;
    blocked: boolean;
    context: any;
}
/**
 * Comprehensive error logging service
 */
export declare class ErrorLogger {
    private readonly logDirectory;
    private readonly maxLogFileSize;
    private readonly maxLogFiles;
    private readonly errorMetrics;
    private readonly securityIncidents;
    private readonly errorHistory;
    private lastCleanup;
    constructor(logDirectory?: string);
    /**
     * Log error with comprehensive context
     */
    logError(error: ExcelApiError, context?: LogContext): Promise<void>;
    /**
     * Log security incident with special handling
     */
    logSecurityIncident(error: SecurityError, context: any): Promise<void>;
    /**
     * Get comprehensive error metrics
     */
    getMetrics(): ErrorMetrics;
    /**
     * Get recent errors for monitoring dashboard
     */
    getRecentErrors(limit?: number): LogEntry[];
    /**
     * Get security incidents for security dashboard
     */
    getSecurityIncidents(limit?: number): SecurityIncident[];
    /**
     * Search errors by criteria
     */
    searchErrors(criteria: {
        type?: ErrorType;
        severity?: ErrorSeverity;
        timeRange?: {
            start: string;
            end: string;
        };
        requestId?: string;
        ip?: string;
        tags?: string[];
    }): LogEntry[];
    /**
     * Mark error as resolved
     */
    markResolved(errorId: string, resolutionTimeMs?: number): boolean;
    /**
     * Export logs for external analysis
     */
    exportLogs(format?: 'json' | 'csv', timeRange?: {
        start: string;
        end: string;
    }): Promise<string>;
    /**
     * Private helper methods
     */
    private ensureLogDirectory;
    private getLogLevel;
    private updateMetrics;
    private generateTags;
    private writeToLogFile;
    private writeToDailyLog;
    private rotateLogFile;
    private logToConsole;
    private triggerCriticalAlert;
    private sanitizeContext;
    private sanitizeSecurityContext;
    private sanitizeObject;
    private identifyAttackVector;
    private performPeriodicCleanup;
}
//# sourceMappingURL=error-logger.d.ts.map