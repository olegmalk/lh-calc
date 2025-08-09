"use strict";
/**
 * Error Logger Service with Monitoring and Analytics
 * Provides comprehensive error tracking and reporting
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLogger = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const custom_errors_1 = require("../errors/custom-errors");
/**
 * Comprehensive error logging service
 */
class ErrorLogger {
    constructor(logDirectory) {
        this.maxLogFileSize = 10 * 1024 * 1024; // 10MB
        this.maxLogFiles = 10;
        this.errorMetrics = new Map();
        this.securityIncidents = [];
        this.errorHistory = [];
        this.lastCleanup = Date.now();
        this.logDirectory = logDirectory || path.join(process.cwd(), 'logs');
        this.ensureLogDirectory();
    }
    /**
     * Log error with comprehensive context
     */
    async logError(error, context = {}) {
        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                level: this.getLogLevel(error),
                errorId: error.errorId,
                type: error.type,
                severity: error.severity,
                message: error.message,
                context: this.sanitizeContext(context),
                stack: error.stack,
                resolved: false,
                tags: this.generateTags(error, context)
            };
            // Add to in-memory history (limited size)
            this.errorHistory.push(logEntry);
            if (this.errorHistory.length > 1000) {
                this.errorHistory.shift();
            }
            // Update metrics
            this.updateMetrics(error);
            // Write to log files
            await Promise.all([
                this.writeToLogFile('error.log', logEntry),
                this.writeToLogFile(`${error.type.toLowerCase()}.log`, logEntry),
                this.writeToDailyLog(logEntry)
            ]);
            // Console output with color coding
            this.logToConsole(logEntry);
            // Trigger alerts for critical errors
            if (error.severity === custom_errors_1.ErrorSeverity.CRITICAL) {
                await this.triggerCriticalAlert(error, context);
            }
            // Cleanup old logs periodically
            await this.performPeriodicCleanup();
        }
        catch (logError) {
            // Fallback logging to prevent infinite loops
            console.error('Failed to log error:', logError);
            console.error('Original error:', error);
        }
    }
    /**
     * Log security incident with special handling
     */
    async logSecurityIncident(error, context) {
        const incident = {
            timestamp: new Date().toISOString(),
            incidentId: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            threatType: error.type,
            severity: error.severity,
            sourceIP: context.request?.ip || 'unknown',
            userAgent: context.request?.userAgent || 'unknown',
            attackVector: this.identifyAttackVector(error),
            blocked: true, // Assuming we block by default
            context: this.sanitizeSecurityContext(context)
        };
        // Add to security incidents tracking
        this.securityIncidents.push(incident);
        if (this.securityIncidents.length > 100) {
            this.securityIncidents.shift();
        }
        // Write to security log
        await this.writeToLogFile('security.log', {
            timestamp: incident.timestamp,
            level: 'SECURITY',
            errorId: error.errorId,
            type: error.type,
            severity: error.severity,
            message: `Security threat detected: ${error.message}`,
            context: incident,
            resolved: false,
            tags: ['security', 'threat', error.type.toLowerCase()]
        });
        // Immediate console alert
        console.error(`🚨 SECURITY ALERT 🚨`);
        console.error(`Incident ID: ${incident.incidentId}`);
        console.error(`Threat: ${error.type}`);
        console.error(`Source: ${incident.sourceIP}`);
        console.error(`Time: ${incident.timestamp}`);
    }
    /**
     * Get comprehensive error metrics
     */
    getMetrics() {
        const now = Date.now();
        const oneHourAgo = now - 60 * 60 * 1000;
        // Calculate recent error rate
        const recentErrors = this.errorHistory.filter(entry => new Date(entry.timestamp).getTime() > oneHourAgo);
        const errorRate = recentErrors.length / 60; // errors per minute
        // Group errors by type
        const errorsByType = {};
        const errorsBySeverity = {};
        for (const entry of this.errorHistory) {
            errorsByType[entry.type] = (errorsByType[entry.type] || 0) + 1;
            errorsBySeverity[entry.severity] = (errorsBySeverity[entry.severity] || 0) + 1;
        }
        // Get top errors
        const topErrors = Object.entries(errorsByType)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([type, count]) => {
            const lastError = this.errorHistory
                .filter(e => e.type === type)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            return {
                type: type,
                count,
                lastOccurrence: lastError?.timestamp || 'unknown'
            };
        });
        // Calculate average resolution time
        const resolvedErrors = this.errorHistory.filter(e => e.resolved && e.resolutionTime);
        const averageResolutionTime = resolvedErrors.length > 0
            ? resolvedErrors.reduce((sum, e) => sum + (e.resolutionTime || 0), 0) / resolvedErrors.length
            : 0;
        return {
            totalErrors: this.errorHistory.length,
            errorsByType,
            errorsBySeverity,
            securityThreats: this.securityIncidents.length,
            averageResolutionTime,
            topErrors,
            systemHealth: {
                memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
                cpuUsage: process.cpuUsage().user / 1000000, // seconds
                uptime: process.uptime(),
                errorRate
            }
        };
    }
    /**
     * Get recent errors for monitoring dashboard
     */
    getRecentErrors(limit = 50) {
        return this.errorHistory
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
    /**
     * Get security incidents for security dashboard
     */
    getSecurityIncidents(limit = 20) {
        return this.securityIncidents
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
    /**
     * Search errors by criteria
     */
    searchErrors(criteria) {
        return this.errorHistory.filter(entry => {
            if (criteria.type && entry.type !== criteria.type)
                return false;
            if (criteria.severity && entry.severity !== criteria.severity)
                return false;
            if (criteria.requestId && entry.context.requestId !== criteria.requestId)
                return false;
            if (criteria.ip && entry.context.ip !== criteria.ip)
                return false;
            if (criteria.timeRange) {
                const entryTime = new Date(entry.timestamp).getTime();
                const startTime = new Date(criteria.timeRange.start).getTime();
                const endTime = new Date(criteria.timeRange.end).getTime();
                if (entryTime < startTime || entryTime > endTime)
                    return false;
            }
            if (criteria.tags && !criteria.tags.some(tag => entry.tags.includes(tag))) {
                return false;
            }
            return true;
        });
    }
    /**
     * Mark error as resolved
     */
    markResolved(errorId, resolutionTimeMs) {
        const entry = this.errorHistory.find(e => e.errorId === errorId);
        if (entry) {
            entry.resolved = true;
            entry.resolutionTime = resolutionTimeMs;
            return true;
        }
        return false;
    }
    /**
     * Export logs for external analysis
     */
    async exportLogs(format = 'json', timeRange) {
        let entries = this.errorHistory;
        if (timeRange) {
            const startTime = new Date(timeRange.start).getTime();
            const endTime = new Date(timeRange.end).getTime();
            entries = entries.filter(entry => {
                const entryTime = new Date(entry.timestamp).getTime();
                return entryTime >= startTime && entryTime <= endTime;
            });
        }
        if (format === 'json') {
            return JSON.stringify(entries, null, 2);
        }
        else {
            // CSV format
            const headers = ['timestamp', 'level', 'errorId', 'type', 'severity', 'message', 'resolved'];
            const rows = entries.map(entry => [
                entry.timestamp,
                entry.level,
                entry.errorId,
                entry.type,
                entry.severity,
                entry.message.replace(/"/g, '""'),
                entry.resolved
            ]);
            return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        }
    }
    /**
     * Private helper methods
     */
    async ensureLogDirectory() {
        try {
            await fs_1.promises.mkdir(this.logDirectory, { recursive: true });
        }
        catch (error) {
            console.error('Failed to create log directory:', error);
        }
    }
    getLogLevel(error) {
        if (error instanceof custom_errors_1.SecurityError)
            return 'SECURITY';
        switch (error.severity) {
            case custom_errors_1.ErrorSeverity.CRITICAL: return 'ERROR';
            case custom_errors_1.ErrorSeverity.HIGH: return 'ERROR';
            case custom_errors_1.ErrorSeverity.MEDIUM: return 'WARN';
            case custom_errors_1.ErrorSeverity.LOW: return 'INFO';
            default: return 'ERROR';
        }
    }
    updateMetrics(error) {
        const key = `${error.type}_${error.severity}`;
        this.errorMetrics.set(key, (this.errorMetrics.get(key) || 0) + 1);
    }
    generateTags(error, context) {
        const tags = [
            error.type.toLowerCase(),
            error.severity,
            'excel-api'
        ];
        if (error instanceof custom_errors_1.SecurityError) {
            tags.push('security', 'threat');
        }
        if (context.method) {
            tags.push(`method:${context.method.toLowerCase()}`);
        }
        if (context.url) {
            tags.push(`endpoint:${context.url.split('?')[0]}`);
        }
        return tags;
    }
    async writeToLogFile(filename, entry) {
        try {
            const filePath = path.join(this.logDirectory, filename);
            const logLine = JSON.stringify(entry) + '\n';
            // Check file size and rotate if necessary
            try {
                const stats = await fs_1.promises.stat(filePath);
                if (stats.size > this.maxLogFileSize) {
                    await this.rotateLogFile(filePath);
                }
            }
            catch {
                // File doesn't exist yet, that's fine
            }
            await fs_1.promises.appendFile(filePath, logLine);
        }
        catch (error) {
            console.error(`Failed to write to log file ${filename}:`, error);
        }
    }
    async writeToDailyLog(entry) {
        const date = new Date().toISOString().split('T')[0];
        const filename = `error-${date}.log`;
        await this.writeToLogFile(filename, entry);
    }
    async rotateLogFile(filePath) {
        try {
            const ext = path.extname(filePath);
            const base = filePath.replace(ext, '');
            // Rotate existing numbered files
            for (let i = this.maxLogFiles - 1; i > 0; i--) {
                const oldFile = `${base}.${i}${ext}`;
                const newFile = `${base}.${i + 1}${ext}`;
                try {
                    await fs_1.promises.access(oldFile);
                    if (i === this.maxLogFiles - 1) {
                        await fs_1.promises.unlink(oldFile); // Delete oldest
                    }
                    else {
                        await fs_1.promises.rename(oldFile, newFile);
                    }
                }
                catch {
                    // File doesn't exist, continue
                }
            }
            // Move current file to .1
            await fs_1.promises.rename(filePath, `${base}.1${ext}`);
        }
        catch (error) {
            console.error('Failed to rotate log file:', error);
        }
    }
    logToConsole(entry) {
        const colors = {
            ERROR: '\x1b[31m', // Red
            WARN: '\x1b[33m', // Yellow
            INFO: '\x1b[36m', // Cyan
            DEBUG: '\x1b[37m', // White
            SECURITY: '\x1b[41m' // Red background
        };
        const reset = '\x1b[0m';
        const color = colors[entry.level] || '';
        console.log(`${color}[${entry.timestamp}] ${entry.level} ${entry.type}${reset}: ${entry.message}`);
        if (entry.context.requestId) {
            console.log(`  Request ID: ${entry.context.requestId}`);
        }
        if (entry.context.ip) {
            console.log(`  IP: ${entry.context.ip}`);
        }
    }
    async triggerCriticalAlert(error, context) {
        console.error(`🚨 CRITICAL ERROR ALERT 🚨`);
        console.error(`Error ID: ${error.errorId}`);
        console.error(`Type: ${error.type}`);
        console.error(`Message: ${error.message}`);
        console.error(`Time: ${error.timestamp}`);
        if (context.requestId) {
            console.error(`Request ID: ${context.requestId}`);
        }
        // In production, this would integrate with alerting systems
        // like PagerDuty, Slack, email notifications, etc.
    }
    sanitizeContext(context) {
        const sanitized = { ...context };
        // Remove sensitive information
        if (sanitized.body) {
            sanitized.body = this.sanitizeObject(sanitized.body);
        }
        return sanitized;
    }
    sanitizeSecurityContext(context) {
        const sanitized = { ...context };
        // For security incidents, we want to capture attack payloads
        // but sanitize any potentially harmful content
        if (sanitized.request?.body) {
            sanitized.request.body = '[SECURITY_INCIDENT_PAYLOAD]';
        }
        return sanitized;
    }
    sanitizeObject(obj) {
        if (!obj || typeof obj !== 'object')
            return obj;
        const sanitized = {};
        const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
        for (const [key, value] of Object.entries(obj)) {
            if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
                sanitized[key] = '[REDACTED]';
            }
            else if (typeof value === 'string' && value.length > 500) {
                sanitized[key] = value.substring(0, 500) + '... [TRUNCATED]';
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
    identifyAttackVector(error) {
        switch (error.type) {
            case custom_errors_1.ErrorType.XSS_ATTEMPT:
                return 'Cross-Site Scripting';
            case custom_errors_1.ErrorType.SQL_INJECTION_ATTEMPT:
                return 'SQL Injection';
            default:
                return 'Unknown';
        }
    }
    async performPeriodicCleanup() {
        const now = Date.now();
        const cleanupInterval = 24 * 60 * 60 * 1000; // 24 hours
        if (now - this.lastCleanup < cleanupInterval) {
            return;
        }
        try {
            // Clean up old daily log files (keep last 30 days)
            const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
            const files = await fs_1.promises.readdir(this.logDirectory);
            for (const file of files) {
                if (file.startsWith('error-') && file.endsWith('.log')) {
                    const dateStr = file.match(/error-(\d{4}-\d{2}-\d{2})\.log/)?.[1];
                    if (dateStr && new Date(dateStr) < thirtyDaysAgo) {
                        await fs_1.promises.unlink(path.join(this.logDirectory, file));
                    }
                }
            }
            this.lastCleanup = now;
        }
        catch (error) {
            console.error('Failed to perform log cleanup:', error);
        }
    }
}
exports.ErrorLogger = ErrorLogger;
//# sourceMappingURL=error-logger.js.map