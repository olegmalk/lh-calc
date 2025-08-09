/**
 * Rate limiting middleware for Excel API
 * Implements token bucket algorithm with 100 requests per minute per IP
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimit {
  tokens: number;
  lastRefill: number;
  blocked?: boolean;
  blockUntil?: number;
}

interface RateLimitConfig {
  maxTokens: number;
  refillRate: number; // tokens per minute
  blockDurationMs: number;
  cleanupIntervalMs: number;
}

export class RateLimiter {
  private limits: Map<string, RateLimit> = new Map();
  private cleanupTimer: NodeJS.Timeout;

  private readonly config: RateLimitConfig = {
    maxTokens: 100,
    refillRate: 100, // 100 requests per minute
    blockDurationMs: 60000, // 1 minute block
    cleanupIntervalMs: 300000 // 5 minutes
  };

  constructor(customConfig?: Partial<RateLimitConfig>) {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }

    // Start cleanup timer
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupIntervalMs);

    // Graceful shutdown
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  /**
   * Express middleware function
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const clientId = this.getClientId(req);
      const allowed = this.checkLimit(clientId);

      if (!allowed) {
        const limit = this.limits.get(clientId);
        const resetTime = limit?.blockUntil || Date.now() + this.config.blockDurationMs;
        
        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            details: {
              limit: this.config.maxTokens,
              window: '1 minute',
              resetTime: new Date(resetTime).toISOString()
            }
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      // Add rate limit headers
      const limit = this.limits.get(clientId);
      if (limit) {
        res.setHeader('X-RateLimit-Limit', this.config.maxTokens);
        res.setHeader('X-RateLimit-Remaining', Math.floor(limit.tokens));
        res.setHeader('X-RateLimit-Reset', new Date(limit.lastRefill + 60000).toISOString());
      }

      next();
    };
  }

  /**
   * Check if request is allowed and consume token
   */
  private checkLimit(clientId: string): boolean {
    const now = Date.now();
    let limit = this.limits.get(clientId);

    if (!limit) {
      limit = {
        tokens: this.config.maxTokens - 1, // Consume one token immediately
        lastRefill: now
      };
      this.limits.set(clientId, limit);
      return true;
    }

    // Check if client is blocked
    if (limit.blocked && limit.blockUntil && now < limit.blockUntil) {
      return false;
    }

    // Clear block if expired
    if (limit.blocked && limit.blockUntil && now >= limit.blockUntil) {
      limit.blocked = false;
      delete limit.blockUntil;
    }

    // Refill tokens based on time elapsed
    const timeSinceLastRefill = now - limit.lastRefill;
    const tokensToAdd = Math.floor((timeSinceLastRefill / 60000) * this.config.refillRate);
    
    if (tokensToAdd > 0) {
      limit.tokens = Math.min(this.config.maxTokens, limit.tokens + tokensToAdd);
      limit.lastRefill = now;
    }

    // Check if tokens available
    if (limit.tokens >= 1) {
      limit.tokens -= 1;
      this.limits.set(clientId, limit);
      return true;
    }

    // No tokens available - block client temporarily
    limit.blocked = true;
    limit.blockUntil = now + this.config.blockDurationMs;
    this.limits.set(clientId, limit);
    
    return false;
  }

  /**
   * Extract client identifier from request
   */
  private getClientId(req: Request): string {
    // Try different methods to get client IP
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    const remoteAddress = req.connection?.remoteAddress || req.socket?.remoteAddress;
    
    let clientIp: string;
    
    if (typeof forwarded === 'string') {
      clientIp = forwarded.split(',')[0].trim();
    } else if (typeof realIp === 'string') {
      clientIp = realIp;
    } else if (remoteAddress) {
      clientIp = remoteAddress;
    } else {
      clientIp = 'unknown';
    }

    // Clean IPv6 format
    if (clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.substring(7);
    }

    return clientIp;
  }

  /**
   * Clean up old entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expireTime = 10 * 60000; // 10 minutes

    for (const [clientId, limit] of this.limits.entries()) {
      // Remove entries older than expire time and not blocked
      if (!limit.blocked && (now - limit.lastRefill) > expireTime) {
        this.limits.delete(clientId);
      }
      // Remove expired blocks
      else if (limit.blocked && limit.blockUntil && now > limit.blockUntil + expireTime) {
        this.limits.delete(clientId);
      }
    }
  }

  /**
   * Get current statistics
   */
  getStats(): {
    totalClients: number;
    blockedClients: number;
    config: RateLimitConfig;
  } {
    const blockedClients = Array.from(this.limits.values()).filter(limit => limit.blocked).length;
    
    return {
      totalClients: this.limits.size,
      blockedClients,
      config: this.config
    };
  }

  /**
   * Reset limits for specific client (admin function)
   */
  resetClient(clientId: string): boolean {
    return this.limits.delete(clientId);
  }

  /**
   * Reset all limits (admin function)
   */
  resetAll(): void {
    this.limits.clear();
  }

  /**
   * Graceful shutdown
   */
  shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();