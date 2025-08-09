/**
 * Bitrix24 Authentication Middleware
 * Handles webhook signature verification and Bitrix24-specific authentication
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { ErrorFactory, ErrorType } from '../errors/custom-errors';
import { ErrorLogger } from '../services/error-logger';

export interface BitrixAuthConfig {
  webhookSecret: string;
  applicationId: string;
  applicationSecret: string;
  verifySignatures: boolean;
  allowedApplications: string[];
  enableOriginCheck: boolean;
  rateLimitByApp: boolean;
}

export interface BitrixAuthContext {
  applicationToken?: string;
  accessToken?: string;
  origin?: string;
  signature?: string;
  timestamp?: number;
  event?: string;
}

export class BitrixAuthMiddleware {
  private config: BitrixAuthConfig;
  private errorLogger: ErrorLogger;
  private applicationRateLimits: Map<string, { count: number; resetTime: number }>;

  constructor(config: BitrixAuthConfig) {
    this.config = config;
    this.errorLogger = new ErrorLogger();
    this.applicationRateLimits = new Map();
  }

  /**
   * Main authentication middleware
   */
  authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const context = this.extractAuthContext(req);
        
        // Check origin if enabled
        if (this.config.enableOriginCheck && !this.isValidOrigin(context.origin)) {
          return this.sendAuthError(res, 'INVALID_ORIGIN', 'Request origin not allowed', 403);
        }

        // Verify signature for webhooks
        if (context.signature && this.config.verifySignatures) {
          const payload = this.getRequestPayload(req);
          if (!this.verifySignature(payload, context.signature)) {
            await this.logSecurityIncident(req, 'SIGNATURE_VERIFICATION_FAILED', context);
            return this.sendAuthError(res, 'SIGNATURE_INVALID', 'Webhook signature verification failed', 401);
          }
        }

        // Verify application token
        if (context.applicationToken && !this.isValidApplicationToken(context.applicationToken)) {
          return this.sendAuthError(res, 'INVALID_APPLICATION', 'Application token not recognized', 401);
        }

        // Rate limiting by application
        if (this.config.rateLimitByApp && context.applicationToken) {
          if (!this.checkApplicationRateLimit(context.applicationToken)) {
            return this.sendAuthError(res, 'RATE_LIMIT_EXCEEDED', 'Application rate limit exceeded', 429);
          }
        }

        // Add auth context to request
        (req as any).bitrixAuth = context;
        next();

      } catch (error) {
        await this.logSecurityIncident(req, 'AUTH_MIDDLEWARE_ERROR', { error: error instanceof Error ? error.message : String(error) });
        return this.sendAuthError(res, 'AUTH_ERROR', 'Authentication processing failed', 500);
      }
    };
  }

  /**
   * Extract authentication context from request
   */
  private extractAuthContext(req: Request): BitrixAuthContext {
    const context: BitrixAuthContext = {
      origin: req.get('Origin') || req.get('Referer'),
      signature: req.get('X-Bitrix24-Signature'),
    };

    // Extract from webhook body
    if (req.body && typeof req.body === 'object') {
      if (req.body.auth) {
        context.applicationToken = req.body.auth.application_token;
        context.accessToken = req.body.auth.access_token;
      }
      context.timestamp = req.body.ts;
      context.event = req.body.event;
    }

    // Extract from headers as fallback
    if (!context.applicationToken) {
      context.applicationToken = req.get('X-Bitrix24-App-Token');
    }
    if (!context.accessToken) {
      context.accessToken = req.get('Authorization')?.replace('Bearer ', '');
    }

    return context;
  }

  /**
   * Get request payload for signature verification
   */
  private getRequestPayload(req: Request): string {
    if (req.body && typeof req.body === 'object') {
      return JSON.stringify(req.body);
    }
    return '';
  }

  /**
   * Verify webhook signature
   */
  private verifySignature(payload: string, signature: string): boolean {
    if (!signature || !this.config.webhookSecret) {
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload, 'utf8')
        .digest('hex');

      // Support both hex and base64 signatures
      const signatureHex = signature.startsWith('sha256=') ? signature.slice(7) : signature;
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(signatureHex, 'hex')
      );
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  /**
   * Check if origin is valid Bitrix24 domain
   */
  private isValidOrigin(origin?: string): boolean {
    if (!origin) return false;

    const validPatterns = [
      /^https:\/\/[a-z0-9-]+\.bitrix24\.com$/i,
      /^https:\/\/[a-z0-9-]+\.bitrix24\.ru$/i,
      /^https:\/\/[a-z0-9-]+\.bitrix24\.eu$/i,
      /^https:\/\/[a-z0-9-]+\.bitrix24\.de$/i,
      /^https:\/\/[a-z0-9-]+\.bitrix24\.fr$/i,
      /^https:\/\/[a-z0-9-]+\.bitrix24\.it$/i,
      /^https:\/\/[a-z0-9-]+\.bitrix24\.pl$/i,
      /^https:\/\/[a-z0-9-]+\.bitrix24\.br$/i,
      /^https:\/\/[a-z0-9-]+\.bitrix24\.in$/i,
      /^https:\/\/[a-z0-9-]+\.bitrix24\.ua$/i
    ];

    return validPatterns.some(pattern => pattern.test(origin));
  }

  /**
   * Validate application token
   */
  private isValidApplicationToken(token: string): boolean {
    if (this.config.allowedApplications.length === 0) {
      return true; // Allow all if no restrictions
    }
    
    return this.config.allowedApplications.includes(token);
  }

  /**
   * Check application-specific rate limits
   */
  private checkApplicationRateLimit(applicationToken: string): boolean {
    if (!this.config.rateLimitByApp) return true;

    const now = Date.now();
    const windowMs = 60000; // 1 minute window
    const maxRequests = 100; // 100 requests per minute per app

    const currentLimit = this.applicationRateLimits.get(applicationToken);
    
    if (!currentLimit || now > currentLimit.resetTime) {
      // Reset window
      this.applicationRateLimits.set(applicationToken, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (currentLimit.count >= maxRequests) {
      return false; // Rate limit exceeded
    }

    currentLimit.count++;
    return true;
  }

  /**
   * Log security incidents
   */
  private async logSecurityIncident(req: Request, incident: string, context: any): Promise<void> {
    const securityError = ErrorFactory.create(
      ErrorType.SECURITY_VIOLATION,
      `Bitrix24 auth incident: ${incident}`,
      {
        incident,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
        ...context
      }
    );

    await this.errorLogger.logSecurityIncident(securityError, {
      source: 'bitrix24_auth',
      incident,
      ip: req.ip
    });
  }

  /**
   * Send authentication error response
   */
  private sendAuthError(res: Response, code: string, message: string, status: number): void {
    res.status(status).json({
      error: {
        error: code,
        error_description: message
      },
      time: {
        start: Date.now() / 1000,
        finish: Date.now() / 1000,
        duration: 0,
        processing: 0,
        date_start: new Date().toISOString(),
        date_finish: new Date().toISOString()
      }
    });
  }

  /**
   * Middleware for CORS preflight requests
   */
  handlePreflight() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Bitrix24-Signature, X-Bitrix24-App-Token');
        res.header('Access-Control-Max-Age', '86400');
        return res.status(200).end();
      }
      next();
    };
  }

  /**
   * Middleware to add Bitrix24-specific headers
   */
  addBitrixHeaders() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.header('X-Bitrix24-Integration', 'v1.0.0');
      res.header('X-Powered-By', 'Excel-API-Bitrix24');
      next();
    };
  }

  /**
   * Get authentication stats for monitoring
   */
  getAuthStats(): any {
    const now = Date.now();
    const activeApplications = Array.from(this.applicationRateLimits.entries())
      .filter(([_, limit]) => now <= limit.resetTime)
      .map(([app, limit]) => ({
        application: app,
        requestCount: limit.count,
        resetTime: new Date(limit.resetTime).toISOString()
      }));

    return {
      totalApplications: this.applicationRateLimits.size,
      activeApplications: activeApplications.length,
      applicationLimits: activeApplications,
      config: {
        verifySignatures: this.config.verifySignatures,
        enableOriginCheck: this.config.enableOriginCheck,
        rateLimitByApp: this.config.rateLimitByApp,
        allowedApplicationsCount: this.config.allowedApplications.length
      }
    };
  }

  /**
   * Reset rate limits for specific application
   */
  resetApplicationRateLimit(applicationToken: string): void {
    this.applicationRateLimits.delete(applicationToken);
  }

  /**
   * Clear all rate limits
   */
  clearAllRateLimits(): void {
    this.applicationRateLimits.clear();
  }
}