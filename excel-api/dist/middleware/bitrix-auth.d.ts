/**
 * Simplified Bitrix24 Middleware
 * Basic middleware for private deployment without authentication
 */
import { Request, Response, NextFunction } from 'express';
export interface BitrixAuthContext {
    origin?: string;
    event?: string;
}
export declare class BitrixAuthMiddleware {
    /**
     * Simplified middleware - no authentication required
     */
    authenticate(): (req: Request, _res: Response, next: NextFunction) => void;
    /**
     * Check if origin is valid Bitrix24 domain (keep CORS support)
     */
    private isValidBitrixOrigin;
    /**
     * Middleware for CORS preflight requests
     */
    handlePreflight(): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
    /**
     * Middleware to add basic headers
     */
    addBitrixHeaders(): (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=bitrix-auth.d.ts.map