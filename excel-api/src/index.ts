/**
 * Excel Processor API Server
 * Handles calculation requests from Bitrix24
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { FieldValidator } from './validators/field-validator';
import { ExcelProcessor } from './processors/excel-processor';
import { 
  CalculationRequest, 
  createSuccessResponse, 
  createErrorResponse, 
  generateRequestId
} from './types/api-contract';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const validator = new FieldValidator();
const excelProcessor = new ExcelProcessor();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Bitrix24
app.use(cors({
  origin: [
    /^https:\/\/.*\.bitrix24\.com$/,
    /^https:\/\/.*\.bitrix24\.ru$/,
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const requestId = generateRequestId();
  (req as any).requestId = requestId;
  console.log(`[${new Date().toISOString()}] ${requestId} ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Get required fields
app.get('/api/fields/required', (_req: Request, res: Response) => {
  const requiredFields = validator.getRequiredFields();
  res.json({
    success: true,
    fields: requiredFields,
    count: requiredFields.length
  });
});

// Excel processor diagnostics
app.get('/api/diagnostics', async (_req: Request, res: Response) => {
  try {
    const stats = await excelProcessor.getProcessingStats();
    const templateValidation = await excelProcessor.validateTemplate();
    
    res.json({
      success: true,
      excel_processor: stats,
      template_validation: templateValidation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Diagnostics failed: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toISOString()
    });
  }
});

// Main calculation endpoint
app.post('/api/calculate', async (req: Request, res: Response): Promise<Response> => {
  const startTime = Date.now();
  const requestId = (req as any).requestId;

  try {
    console.log(`[${requestId}] Processing calculation request`);

    // Step 1: Validate input
    const validationResult = validator.validate(req.body);

    // Return validation errors if any critical errors
    if (!validationResult.isValid) {
      console.log(`[${requestId}] Validation failed: ${validationResult.errors.length} errors`);
      return res.status(400).json({
        success: false,
        requestId,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Input validation failed',
          details: validationResult.errors
        },
        warnings: validationResult.warnings,
        metadata: {
          processingTimeMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Log warnings but continue processing
    if (validationResult.warnings.length > 0) {
      console.log(`[${requestId}] Validation warnings: ${validationResult.warnings.length}`);
    }

    // Step 2: Process with Excel
    console.log(`[${requestId}] Starting Excel processing`);
    const processingResult = await excelProcessor.processCalculation(req.body as CalculationRequest);

    if (!processingResult.success) {
      console.log(`[${requestId}] Excel processing failed: ${processingResult.error}`);
      return res.status(422).json(
        createErrorResponse(
          processingResult.error || 'Excel processing failed',
          requestId,
          {
            error_type: 'EXCEL_CALCULATION_FAILED',
            excel_errors: [processingResult.error || 'Unknown processing error']
          }
        )
      );
    }

    // Step 3: Build response
    console.log(`[${requestId}] Excel processing completed successfully`);
    const response = createSuccessResponse(
      processingResult.results!,
      requestId,
      processingResult.processingTimeMs,
      {
        excelVersion: 'calc.xlsx v7',
        timestamp: new Date().toISOString(),
        tempFileUsed: processingResult.tempFilePath !== undefined
      }
    );

    // Add validation warnings
    (response as any).validation = {
      errors: [],
      warnings: validationResult.warnings
    };

    console.log(`[${requestId}] Calculation completed in ${Date.now() - startTime}ms`);
    return res.json(response);

  } catch (error) {
    console.error(`[${requestId}] Error processing request:`, error);
    return res.status(500).json({
      success: false,
      requestId,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      metadata: {
        processingTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Excel Processor API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Calculation endpoint: POST http://localhost:${PORT}/api/calculate`);
  console.log(`Required fields: GET http://localhost:${PORT}/api/fields/required`);
  console.log(`Diagnostics: GET http://localhost:${PORT}/api/diagnostics`);
});

export default app;