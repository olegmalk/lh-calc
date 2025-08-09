/**
 * Bitrix24 Integration Layer
 * Production-ready webhook handler with signature verification and response formatting
 */

import { Request, Response } from 'express';
import crypto from 'crypto';
import { 
  CalculationRequest, 
  CalculationResponse,
  createSuccessResponse,
  createErrorResponse,
  generateRequestId 
} from '../types/api-contract';
import { ExcelApiError, ErrorType, ErrorFactory } from '../errors/custom-errors';
import { ErrorLogger } from '../services/error-logger';

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

export interface BitrixConfig {
  webhookSecret: string;
  applicationId: string;
  applicationSecret: string;
  verifySignatures: boolean;
  logWebhooks: boolean;
  corsOrigins: string[];
}

export class Bitrix24Integration {
  private config: BitrixConfig;
  private errorLogger: ErrorLogger;

  constructor(config: BitrixConfig) {
    this.config = config;
    this.errorLogger = new ErrorLogger();
  }

  /**
   * Verify Bitrix24 webhook signature for security
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config.verifySignatures) {
      return true;
    }

    if (!signature || !this.config.webhookSecret) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Transform Bitrix24 webhook data to CalculationRequest format
   */
  transformWebhookData(bitrixData: BitrixWebhookRequest): CalculationRequest {
    const fields = bitrixData.data.FIELDS || {};
    
    // Map Bitrix24 field names to our internal format
    const fieldMapping: Record<string, string> = {
      'UF_CRM_1_MATERIAL_TYPE': 'materialType',
      'UF_CRM_1_TUBE_DIAMETER': 'tubeDiameter', 
      'UF_CRM_1_TUBE_THICKNESS': 'tubeThickness',
      'UF_CRM_1_HEAT_CAPACITY': 'heatCapacity',
      'UF_CRM_1_THERMAL_LOAD': 'thermalLoad',
      'UF_CRM_1_WORKING_PRESSURE': 'workingPressure',
      'UF_CRM_1_TEST_PRESSURE': 'testPressure',
      'UF_CRM_1_SURFACE_AREA': 'surfaceArea',
      'UF_CRM_1_QUANTITY': 'quantity'
    };

    const transformedData: any = {};
    
    for (const [bitrixField, internalField] of Object.entries(fieldMapping)) {
      if (fields[bitrixField] !== undefined) {
        const value = fields[bitrixField];
        // Convert string numbers to actual numbers
        if (typeof value === 'string' && !isNaN(Number(value))) {
          transformedData[internalField] = Number(value);
        } else {
          transformedData[internalField] = value;
        }
      }
    }

    // Add Bitrix24 specific metadata
    transformedData._bitrixMeta = {
      event: bitrixData.event,
      timestamp: bitrixData.ts,
      applicationToken: bitrixData.auth.application_token,
      originalFields: Object.keys(fields)
    };

    return transformedData as CalculationRequest;
  }

  /**
   * Transform our response to Bitrix24 expected format
   */
  transformResponseToBitrix(response: CalculationResponse, processingTimeMs: number): BitrixResponse {
    const startTime = Date.now() - processingTimeMs;
    const finishTime = Date.now();

    if (response.success) {
      return {
        result: {
          calculation_id: response.request_id,
          results: response.results,
          metadata: {
            processing_time_ms: processingTimeMs,
            excel_version: response.metadata?.excelVersion,
            bitrix_integration: true
          }
        },
        time: {
          start: startTime / 1000,
          finish: finishTime / 1000,
          duration: processingTimeMs / 1000,
          processing: processingTimeMs / 1000,
          date_start: new Date(startTime).toISOString(),
          date_finish: new Date(finishTime).toISOString()
        }
      };
    } else {
      return {
        error: {
          error: response.error?.code || 'CALCULATION_ERROR',
          error_description: response.error?.message || 'Calculation failed'
        },
        time: {
          start: startTime / 1000,
          finish: finishTime / 1000,
          duration: processingTimeMs / 1000,
          processing: processingTimeMs / 1000,
          date_start: new Date(startTime).toISOString(),
          date_finish: new Date(finishTime).toISOString()
        }
      };
    }
  }

  /**
   * Create Bitrix24 error response
   */
  createBitrixError(error: string, description: string): BitrixResponse {
    const now = Date.now();
    return {
      error: {
        error,
        error_description: description
      },
      time: {
        start: now / 1000,
        finish: now / 1000,
        duration: 0,
        processing: 0,
        date_start: new Date(now).toISOString(),
        date_finish: new Date(now).toISOString()
      }
    };
  }

  /**
   * Log webhook interaction for audit
   */
  async logWebhookInteraction(
    requestId: string,
    event: string,
    success: boolean,
    processingTimeMs: number,
    metadata?: any
  ): Promise<void> {
    if (!this.config.logWebhooks) {
      return;
    }

    const logData = {
      requestId,
      source: 'bitrix24_webhook',
      event,
      success,
      processingTimeMs,
      timestamp: new Date().toISOString(),
      ...metadata
    };

    console.log(`[BITRIX24] ${requestId} ${event} - ${success ? 'SUCCESS' : 'FAILED'} (${processingTimeMs}ms)`);
    
    if (!success && metadata?.error) {
      await this.errorLogger.logError(metadata.error, {
        source: 'bitrix24_integration',
        requestId,
        event
      });
    }
  }

  /**
   * Validate Bitrix24 webhook structure
   */
  validateWebhookStructure(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.data || typeof data.data !== 'object') {
      errors.push('Missing or invalid data object');
    }

    if (!data.data?.FIELDS || typeof data.data.FIELDS !== 'object') {
      errors.push('Missing or invalid FIELDS object');
    }

    if (!data.auth || typeof data.auth !== 'object') {
      errors.push('Missing or invalid auth object');
    }

    if (!data.auth?.access_token || typeof data.auth.access_token !== 'string') {
      errors.push('Missing or invalid access_token');
    }

    if (!data.event || typeof data.event !== 'string') {
      errors.push('Missing or invalid event');
    }

    if (typeof data.ts !== 'number') {
      errors.push('Missing or invalid timestamp');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if request is from allowed Bitrix24 domain
   */
  isValidBitrixOrigin(origin: string | undefined): boolean {
    if (!origin) return false;
    
    const bitrixDomains = [
      /^https:\/\/.*\.bitrix24\.com$/,
      /^https:\/\/.*\.bitrix24\.ru$/,
      /^https:\/\/.*\.bitrix24\.eu$/,
      /^https:\/\/.*\.bitrix24\.de$/,
      ...this.config.corsOrigins.map(o => new RegExp(`^${o.replace(/\*/g, '.*')}$`))
    ];

    return bitrixDomains.some(pattern => pattern.test(origin));
  }

  /**
   * Add Bitrix24 specific headers to response
   */
  setBitrixHeaders(res: Response): void {
    res.setHeader('X-Bitrix24-Integration', 'v1.0.0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Bitrix24-Signature');
  }

  /**
   * Handle calculation request from Bitrix24 webhook
   */
  async handleCalculationWebhook(
    req: Request,
    res: Response,
    calculateFn: (data: CalculationRequest, requestId: string) => Promise<CalculationResponse>
  ): Promise<void> {
    const requestId = generateRequestId();
    const startTime = Date.now();

    this.setBitrixHeaders(res);

    try {
      // Validate webhook structure
      const validation = this.validateWebhookStructure(req.body);
      if (!validation.valid) {
        const error = this.createBitrixError(
          'INVALID_WEBHOOK_STRUCTURE',
          `Webhook validation failed: ${validation.errors.join(', ')}`
        );
        
        await this.logWebhookInteraction(
          requestId,
          req.body?.event || 'unknown',
          false,
          Date.now() - startTime,
          { errors: validation.errors }
        );

        return res.status(400).json(error);
      }

      // Verify signature if enabled
      const signature = req.get('X-Bitrix24-Signature');
      const payload = JSON.stringify(req.body);
      
      if (!this.verifyWebhookSignature(payload, signature || '')) {
        const error = this.createBitrixError(
          'SIGNATURE_VERIFICATION_FAILED',
          'Webhook signature verification failed'
        );

        await this.logWebhookInteraction(
          requestId,
          req.body.event,
          false,
          Date.now() - startTime,
          { reason: 'signature_verification_failed' }
        );

        return res.status(401).json(error);
      }

      // Transform webhook data
      const calculationData = this.transformWebhookData(req.body);
      
      // Process calculation
      const result = await calculateFn(calculationData, requestId);
      
      // Transform response to Bitrix24 format
      const bitrixResponse = this.transformResponseToBitrix(result, Date.now() - startTime);
      
      await this.logWebhookInteraction(
        requestId,
        req.body.event,
        result.success,
        Date.now() - startTime,
        { 
          fieldsCount: Object.keys(req.body.data.FIELDS).length,
          event: req.body.event 
        }
      );

      res.json(bitrixResponse);

    } catch (error) {
      const bitrixError = this.createBitrixError(
        'INTERNAL_ERROR',
        `Processing failed: ${error instanceof Error ? error.message : String(error)}`
      );

      await this.logWebhookInteraction(
        requestId,
        req.body?.event || 'unknown',
        false,
        Date.now() - startTime,
        { 
          error: error instanceof Error ? error.message : String(error)
        }
      );

      res.status(500).json(bitrixError);
    }
  }

  /**
   * Handle Bitrix24 REST API format requests
   */
  async handleRestRequest(
    req: Request,
    res: Response,
    calculateFn: (data: CalculationRequest, requestId: string) => Promise<CalculationResponse>
  ): Promise<void> {
    const requestId = generateRequestId();
    const startTime = Date.now();

    this.setBitrixHeaders(res);

    try {
      // For REST API, data comes directly in request body
      const result = await calculateFn(req.body, requestId);
      
      // Transform to Bitrix24 format
      const bitrixResponse = this.transformResponseToBitrix(result, Date.now() - startTime);
      
      await this.logWebhookInteraction(
        requestId,
        'rest_api_call',
        result.success,
        Date.now() - startTime
      );

      res.json(bitrixResponse);

    } catch (error) {
      const bitrixError = this.createBitrixError(
        'INTERNAL_ERROR',
        `Processing failed: ${error instanceof Error ? error.message : String(error)}`
      );

      await this.logWebhookInteraction(
        requestId,
        'rest_api_call',
        false,
        Date.now() - startTime,
        { error: error instanceof Error ? error.message : String(error) }
      );

      res.status(500).json(bitrixError);
    }
  }
}