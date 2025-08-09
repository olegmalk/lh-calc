/**
 * Rate limiting middleware for Excel API
 * Implements token bucket algorithm with 100 requests per minute per IP
 */
import { Request, Response, NextFunction } from 'express';
interface RateLimitConfig {
    maxTokens: number;
    refillRate: number;
    blockDurationMs: number;
    cleanupIntervalMs: number;
}
export declare class RateLimiter {
    private limits;
    private cleanupTimer;
    private readonly config;
    constructor(customConfig?: Partial<RateLimitConfig>);
    /**
     * Express middleware function
     */
    middleware(): (req: Request, res: Response, next: NextFunction) => void;
    /**
     * Check if request is allowed and consume token
     */
    private checkLimit;
    /**
     * Extract client identifier from request
     */
    private getClientId;
    /**
     * Clean up old entries
     */
    private cleanup;
    /**
     * Get current statistics
     */
    getStats(): {
        totalClients: number;
        blockedClients: number;
        config: RateLimitConfig;
    };
    /**
     * Reset limits for specific client (admin function)
     */
    resetClient(clientId: string): boolean;
    /**
     * Reset all limits (admin function)
     */
    resetAll(): void;
    /**
     * Graceful shutdown
     */
    shutdown(): void;
}
export declare const rateLimiter: RateLimiter;
export {};
//# sourceMappingURL=rate-limiter.d.ts.map