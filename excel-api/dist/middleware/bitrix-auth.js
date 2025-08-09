"use strict";
/**
 * Simplified Bitrix24 Middleware
 * Basic middleware for private deployment without authentication
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitrixAuthMiddleware = void 0;
class BitrixAuthMiddleware {
    /**
     * Simplified middleware - no authentication required
     */
    authenticate() {
        return (req, _res, next) => {
            const context = {
                origin: req.get('Origin') || req.get('Referer'),
                event: req.body?.event
            };
            // Add minimal context to request
            req.bitrixAuth = context;
            next();
        };
    }
    /**
     * Check if origin is valid Bitrix24 domain (keep CORS support)
     */
    isValidBitrixOrigin(origin) {
        if (!origin)
            return false;
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
     * Middleware for CORS preflight requests
     */
    handlePreflight() {
        return (req, res, next) => {
            if (req.method === 'OPTIONS') {
                const origin = req.get('Origin');
                // Allow all Bitrix24 domains
                if (origin && this.isValidBitrixOrigin(origin)) {
                    res.header('Access-Control-Allow-Origin', origin);
                }
                else {
                    res.header('Access-Control-Allow-Origin', '*');
                }
                res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
                res.header('Access-Control-Allow-Headers', 'Content-Type');
                res.header('Access-Control-Max-Age', '86400');
                return res.status(200).end();
            }
            next();
            return;
        };
    }
    /**
     * Middleware to add basic headers
     */
    addBitrixHeaders() {
        return (req, res, next) => {
            const origin = req.get('Origin');
            // Set CORS for Bitrix24 domains
            if (origin && this.isValidBitrixOrigin(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
            }
            else {
                res.header('Access-Control-Allow-Origin', '*');
            }
            res.header('X-Bitrix24-Integration', 'v1.0.0');
            next();
        };
    }
}
exports.BitrixAuthMiddleware = BitrixAuthMiddleware;
//# sourceMappingURL=bitrix-auth.js.map