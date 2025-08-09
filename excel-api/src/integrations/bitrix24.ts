/**
 * Simplified Bitrix24 Integration Layer
 * Basic webhook handler without authentication for private deployment
 */

import { Request, Response } from 'express';
import { 
  CalculationRequest, 
  CalculationResponse,
  generateRequestId 
} from '../types/api-contract';

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

export class Bitrix24Integration {
  constructor() {
    // No configuration needed for simplified version
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
          error: 'CALCULATION_ERROR',
          error_description: 'Calculation failed'
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
   * Basic validation for request data
   */
  validateWebhookStructure(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.data || typeof data.data !== 'object') {
      errors.push('Missing or invalid data object');
    }

    if (!data.data?.FIELDS || typeof data.data.FIELDS !== 'object') {
      errors.push('Missing or invalid FIELDS object');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if request is from Bitrix24 domain (for CORS)
   */
  isValidBitrixOrigin(origin: string | undefined): boolean {
    if (!origin) return false;
    
    const bitrixDomains = [
      /^https:\/\/.*\.bitrix24\.com$/,
      /^https:\/\/.*\.bitrix24\.ru$/,
      /^https:\/\/.*\.bitrix24\.eu$/,
      /^https:\/\/.*\.bitrix24\.de$/
    ];

    return bitrixDomains.some(pattern => pattern.test(origin));
  }

  /**
   * Add headers with CORS support
   */
  setBitrixHeaders(res: Response, origin?: string): void {
    if (origin && this.isValidBitrixOrigin(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('X-Bitrix24-Integration', 'v1.0.0');
  }

  /**
   * Simplified webhook handler
   */
  async handleCalculationWebhook(
    req: Request,
    res: Response,
    calculateFn: (data: CalculationRequest, requestId: string) => Promise<CalculationResponse>
  ): Promise<void> {
    const requestId = generateRequestId();
    const startTime = Date.now();

    this.setBitrixHeaders(res, req.get('Origin'));

    try {
      // Basic validation only
      const validation = this.validateWebhookStructure(req.body);
      if (!validation.valid) {
        const error = this.createBitrixError(
          'INVALID_WEBHOOK_STRUCTURE',
          `Validation failed: ${validation.errors.join(', ')}`
        );
        res.status(400).json(error);
        return;
      }

      // Transform webhook data
      const calculationData = this.transformWebhookData(req.body);
      
      // Process calculation
      const result = await calculateFn(calculationData, requestId);
      
      // Transform response to Bitrix24 format
      const bitrixResponse = this.transformResponseToBitrix(result, Date.now() - startTime);
      
      res.json(bitrixResponse);

    } catch (error) {
      const bitrixError = this.createBitrixError(
        'INTERNAL_ERROR',
        `Processing failed: ${error instanceof Error ? error.message : String(error)}`
      );
      res.status(500).json(bitrixError);
    }
  }

  /**
   * Handle REST API format requests
   */
  async handleRestRequest(
    req: Request,
    res: Response,
    calculateFn: (data: CalculationRequest, requestId: string) => Promise<CalculationResponse>
  ): Promise<void> {
    const requestId = generateRequestId();
    const startTime = Date.now();

    this.setBitrixHeaders(res, req.get('Origin'));

    try {
      // For REST API, data comes directly in request body
      const result = await calculateFn(req.body, requestId);
      
      // Transform to Bitrix24 format
      const bitrixResponse = this.transformResponseToBitrix(result, Date.now() - startTime);
      
      res.json(bitrixResponse);

    } catch (error) {
      const bitrixError = this.createBitrixError(
        'INTERNAL_ERROR',
        `Processing failed: ${error instanceof Error ? error.message : String(error)}`
      );
      res.status(500).json(bitrixError);
    }
  }
}