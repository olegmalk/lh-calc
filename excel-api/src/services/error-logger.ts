/**
 * Error Logger Service with Monitoring and Analytics
 * Provides comprehensive error tracking and reporting
 */

import { promises as fs } from 'fs';
import * as path from 'path';
// import * as os from 'os'; // Unused import
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
  topErrors: Array<{ type: ErrorType; count: number; lastOccurrence: string }>;
  systemHealth: {
    memoryUsage: number;
    cpuUsage: number;
    uptime: number;
    errorRate: number; // errors per minute
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
export class ErrorLogger {
  private readonly logDirectory: string;
  private readonly maxLogFileSize = 10 * 1024 * 1024; // 10MB
  private readonly maxLogFiles = 10;
  private readonly errorMetrics: Map<string, number> = new Map();
  private readonly securityIncidents: SecurityIncident[] = [];
  private readonly errorHistory: LogEntry[] = [];
  private lastCleanup = Date.now();

  constructor(logDirectory?: string) {
    this.logDirectory = logDirectory || path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  /**
   * Log error with comprehensive context
   */
  async logError(error: ExcelApiError, context: LogContext = {}): Promise<void> {
    try {
      const logEntry: LogEntry = {
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
      if (error.severity === ErrorSeverity.CRITICAL) {
        await this.triggerCriticalAlert(error, context);
      }

      // Cleanup old logs periodically
      await this.performPeriodicCleanup();

    } catch (logError) {
      // Fallback logging to prevent infinite loops
      console.error('Failed to log error:', logError);
      console.error('Original error:', error);
    }
  }

  /**
   * Log security incident with special handling
   */
  async logSecurityIncident(error: SecurityError, context: any): Promise<void> {
    const incident: SecurityIncident = {
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
      level: 'SECURITY' as const,
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
  getMetrics(): ErrorMetrics {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    // Calculate recent error rate
    const recentErrors = this.errorHistory.filter(
      entry => new Date(entry.timestamp).getTime() > oneHourAgo
    );
    const errorRate = recentErrors.length / 60; // errors per minute

    // Group errors by type
    const errorsByType = {} as Record<ErrorType, number>;
    const errorsBySeverity = {} as Record<ErrorSeverity, number>;
    
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
          .filter(e => e.type === type as ErrorType)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        
        return {
          type: type as ErrorType,
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
  getRecentErrors(limit = 50): LogEntry[] {
    return this.errorHistory
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get security incidents for security dashboard
   */
  getSecurityIncidents(limit = 20): SecurityIncident[] {
    return this.securityIncidents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Search errors by criteria
   */
  searchErrors(criteria: {
    type?: ErrorType;
    severity?: ErrorSeverity;
    timeRange?: { start: string; end: string };
    requestId?: string;
    ip?: string;
    tags?: string[];
  }): LogEntry[] {
    return this.errorHistory.filter(entry => {
      if (criteria.type && entry.type !== criteria.type) return false;
      if (criteria.severity && entry.severity !== criteria.severity) return false;
      if (criteria.requestId && entry.context.requestId !== criteria.requestId) return false;
      if (criteria.ip && entry.context.ip !== criteria.ip) return false;
      
      if (criteria.timeRange) {
        const entryTime = new Date(entry.timestamp).getTime();
        const startTime = new Date(criteria.timeRange.start).getTime();
        const endTime = new Date(criteria.timeRange.end).getTime();
        if (entryTime < startTime || entryTime > endTime) return false;
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
  markResolved(errorId: string, resolutionTimeMs?: number): boolean {
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
  async exportLogs(format: 'json' | 'csv' = 'json', timeRange?: { start: string; end: string }): Promise<string> {
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
    } else {
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
  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.logDirectory, { recursive: true });
    } catch (error) {
      console.error('Failed to create log directory:', error);
    }
  }

  private getLogLevel(error: ExcelApiError): LogEntry['level'] {
    if (error instanceof SecurityError) return 'SECURITY';
    switch (error.severity) {
      case ErrorSeverity.CRITICAL: return 'ERROR';
      case ErrorSeverity.HIGH: return 'ERROR';
      case ErrorSeverity.MEDIUM: return 'WARN';
      case ErrorSeverity.LOW: return 'INFO';
      default: return 'ERROR';
    }
  }

  private updateMetrics(error: ExcelApiError): void {
    const key = `${error.type}_${error.severity}`;
    this.errorMetrics.set(key, (this.errorMetrics.get(key) || 0) + 1);
  }

  private generateTags(error: ExcelApiError, context: LogContext): string[] {
    const tags = [
      error.type.toLowerCase(),
      error.severity,
      'excel-api'
    ];

    if (error instanceof SecurityError) {
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

  private async writeToLogFile(filename: string, entry: LogEntry): Promise<void> {
    try {
      const filePath = path.join(this.logDirectory, filename);
      const logLine = JSON.stringify(entry) + '\n';
      
      // Check file size and rotate if necessary
      try {
        const stats = await fs.stat(filePath);
        if (stats.size > this.maxLogFileSize) {
          await this.rotateLogFile(filePath);
        }
      } catch {
        // File doesn't exist yet, that's fine
      }

      await fs.appendFile(filePath, logLine);
    } catch (error) {
      console.error(`Failed to write to log file ${filename}:`, error);
    }
  }

  private async writeToDailyLog(entry: LogEntry): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const filename = `error-${date}.log`;
    await this.writeToLogFile(filename, entry);
  }

  private async rotateLogFile(filePath: string): Promise<void> {
    try {
      const ext = path.extname(filePath);
      const base = filePath.replace(ext, '');
      
      // Rotate existing numbered files
      for (let i = this.maxLogFiles - 1; i > 0; i--) {
        const oldFile = `${base}.${i}${ext}`;
        const newFile = `${base}.${i + 1}${ext}`;
        
        try {
          await fs.access(oldFile);
          if (i === this.maxLogFiles - 1) {
            await fs.unlink(oldFile); // Delete oldest
          } else {
            await fs.rename(oldFile, newFile);
          }
        } catch {
          // File doesn't exist, continue
        }
      }
      
      // Move current file to .1
      await fs.rename(filePath, `${base}.1${ext}`);
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  private logToConsole(entry: LogEntry): void {
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m',  // Yellow
      INFO: '\x1b[36m',  // Cyan
      DEBUG: '\x1b[37m', // White
      SECURITY: '\x1b[41m' // Red background
    };
    
    const reset = '\x1b[0m';
    const color = colors[entry.level] || '';
    
    console.log(
      `${color}[${entry.timestamp}] ${entry.level} ${entry.type}${reset}: ${entry.message}`
    );
    
    if (entry.context.requestId) {
      console.log(`  Request ID: ${entry.context.requestId}`);
    }
    
    if (entry.context.ip) {
      console.log(`  IP: ${entry.context.ip}`);
    }
  }

  private async triggerCriticalAlert(error: ExcelApiError, context: LogContext): Promise<void> {
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

  private sanitizeContext(context: LogContext): LogContext {
    const sanitized = { ...context };
    
    // Remove sensitive information
    if (sanitized.body) {
      sanitized.body = this.sanitizeObject(sanitized.body);
    }
    
    return sanitized;
  }

  private sanitizeSecurityContext(context: any): any {
    const sanitized = { ...context };
    
    // For security incidents, we want to capture attack payloads
    // but sanitize any potentially harmful content
    if (sanitized.request?.body) {
      sanitized.request.body = '[SECURITY_INCIDENT_PAYLOAD]';
    }
    
    return sanitized;
  }

  private sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized: any = {};
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
    
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 500) {
        sanitized[key] = value.substring(0, 500) + '... [TRUNCATED]';
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  private identifyAttackVector(error: SecurityError): string {
    switch (error.type) {
      case ErrorType.XSS_ATTEMPT:
        return 'Cross-Site Scripting';
      case ErrorType.SQL_INJECTION_ATTEMPT:
        return 'SQL Injection';
      default:
        return 'Unknown';
    }
  }

  private async performPeriodicCleanup(): Promise<void> {
    const now = Date.now();
    const cleanupInterval = 24 * 60 * 60 * 1000; // 24 hours
    
    if (now - this.lastCleanup < cleanupInterval) {
      return;
    }
    
    try {
      // Clean up old daily log files (keep last 30 days)
      const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
      const files = await fs.readdir(this.logDirectory);
      
      for (const file of files) {
        if (file.startsWith('error-') && file.endsWith('.log')) {
          const dateStr = file.match(/error-(\d{4}-\d{2}-\d{2})\.log/)?.[1];
          if (dateStr && new Date(dateStr) < thirtyDaysAgo) {
            await fs.unlink(path.join(this.logDirectory, file));
          }
        }
      }
      
      this.lastCleanup = now;
    } catch (error) {
      console.error('Failed to perform log cleanup:', error);
    }
  }
}