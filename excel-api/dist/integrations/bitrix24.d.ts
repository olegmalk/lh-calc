/**
 * Simplified Bitrix24 Integration Layer
 * Basic webhook handler without authentication for private deployment
 */
import { Request, Response } from 'express';
import { CalculationRequest, CalculationResponse } from '../types/api-contract';
export interface BitrixWebhookRequest {
    data: {
        FIELDS: Record<string, any>;
    };
    ts: number;
    auth: {
        access_token: string;
        refresh_token?: string;
        application_token: string;
    };
    event: string;
    handler?: string;
}
export interface BitrixResponse {
    result?: any;
    error?: {
        error: string;
        error_description: string;
    };
    time: {
        start: number;
        finish: number;
        duration: number;
        processing: number;
        date_start: string;
        date_finish: string;
    };
}
export declare class Bitrix24Integration {
    constructor();
    /**
     * Transform Bitrix24 webhook data to CalculationRequest format
     */
    transformWebhookData(bitrixData: BitrixWebhookRequest): CalculationRequest;
    /**
     * Transform our response to Bitrix24 expected format
     */
    transformResponseToBitrix(response: CalculationResponse, processingTimeMs: number): BitrixResponse;
    /**
     * Create Bitrix24 error response
     */
    createBitrixError(error: string, description: string): BitrixResponse;
    /**
     * Basic validation for request data
     */
    validateWebhookStructure(data: any): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Check if request is from Bitrix24 domain (for CORS)
     */
    isValidBitrixOrigin(origin: string | undefined): boolean;
    /**
     * Add headers with CORS support
     */
    setBitrixHeaders(res: Response, origin?: string): void;
    /**
     * Simplified webhook handler
     */
    handleCalculationWebhook(req: Request, res: Response, calculateFn: (data: CalculationRequest, requestId: string) => Promise<CalculationResponse>): Promise<void>;
    /**
     * Handle REST API format requests
     */
    handleRestRequest(req: Request, res: Response, calculateFn: (data: CalculationRequest, requestId: string) => Promise<CalculationResponse>): Promise<void>;
}
//# sourceMappingURL=bitrix24.d.ts.map