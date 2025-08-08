// Health check and monitoring utilities
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    database?: boolean;
    bitrix24?: boolean;
    storage?: boolean;
  };
}

export class HealthMonitor {
  private static instance: HealthMonitor;
  private isHealthy = true;
  private lastCheck: Date = new Date();

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  async performHealthCheck(): Promise<HealthCheck> {
    const checks = {
      storage: this.checkLocalStorage(),
      bitrix24: await this.checkBitrix24Connection(),
    };

    const isHealthy = Object.values(checks).every(check => check === true);
    this.isHealthy = isHealthy;
    this.lastCheck = new Date();

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: this.lastCheck.toISOString(),
      version: import.meta.env.VITE_APP_VERSION || 'unknown',
      environment: import.meta.env.VITE_APP_ENV || 'development',
      checks,
    };
  }

  private checkLocalStorage(): boolean {
    try {
      const testKey = '__health_check__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private async checkBitrix24Connection(): Promise<boolean> {
    try {
      const webhookUrl = import.meta.env.VITE_BITRIX24_WEBHOOK_URL;
      if (!webhookUrl) return true; // Skip check if not configured

      // Simple connectivity check - just verify we can reach the endpoint
      const response = await fetch(webhookUrl.replace('/rest/', '/rest/app.info'), {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      
      return response.status < 500;
    } catch {
      return false;
    }
  }

  getStatus(): boolean {
    return this.isHealthy;
  }

  getLastCheck(): Date {
    return this.lastCheck;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Array<{
    name: string;
    value: number;
    timestamp: number;
  }> = [];

  static recordMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    });

    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  static getMetrics(): typeof PerformanceMonitor.metrics {
    return [...this.metrics];
  }

  static recordPageLoad(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.recordMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
        this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
        this.recordMetric('first_paint', navigation.responseStart - navigation.fetchStart);
      }
    }
  }

  static recordCalculationTime(duration: number): void {
    this.recordMetric('calculation_duration', duration);
  }

  static recordApiCall(endpoint: string, duration: number, success: boolean): void {
    this.recordMetric(`api_call_${endpoint}_duration`, duration);
    this.recordMetric(`api_call_${endpoint}_success`, success ? 1 : 0);
  }
}

// Error tracking
export class ErrorTracker {
  private static errors: Array<{
    message: string;
    stack?: string;
    timestamp: number;
    url: string;
    userAgent: string;
  }> = [];

  static trackError(error: Error, context?: string): void {
    const errorInfo = {
      message: `${context ? `[${context}] ` : ''}${error.message}`,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errors.push(errorInfo);

    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50);
    }

    // Send to external service if configured
    if (import.meta.env.VITE_SENTRY_DSN) {
      // Sentry integration would go here
      console.error('Error tracked:', errorInfo);
    }
  }

  static getErrors(): typeof ErrorTracker.errors {
    return [...this.errors];
  }

  static clearErrors(): void {
    this.errors = [];
  }
}

// Usage analytics (privacy-friendly)
export class UsageAnalytics {
  private static events: Array<{
    event: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
  }> = [];

  static trackEvent(event: string, metadata?: Record<string, unknown>): void {
    this.events.push({
      event,
      timestamp: Date.now(),
      metadata,
    });

    // Keep only last 200 events
    if (this.events.length > 200) {
      this.events = this.events.slice(-200);
    }
  }

  static getEvents(): typeof UsageAnalytics.events {
    return [...this.events];
  }

  static trackCalculation(inputCount: number, processingTime: number): void {
    this.trackEvent('calculation_performed', {
      inputCount,
      processingTime,
      timestamp: Date.now(),
    });
  }

  static trackExport(format: string, success: boolean): void {
    this.trackEvent('data_exported', {
      format,
      success,
      timestamp: Date.now(),
    });
  }
}

// Initialize monitoring
if (typeof window !== 'undefined') {
  // Record initial page load
  window.addEventListener('load', () => {
    PerformanceMonitor.recordPageLoad();
  });

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    ErrorTracker.trackError(new Error(event.message), 'unhandled_error');
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    ErrorTracker.trackError(new Error(event.reason), 'unhandled_rejection');
  });
}