/**
 * Upload Prefill Route
 * Handles Excel file uploads for form prefilling
 */

import { Request, Response, Router } from 'express';
import multer from 'multer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ExcelFieldExtractor } from '../services/excel-field-extractor';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  dest: '/tmp/uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx') {
      cb(new Error('Only .xlsx files are allowed'));
      return;
    }
    cb(null, true);
  }
});

// Initialize field extractor
const fieldExtractor = new ExcelFieldExtractor();

/**
 * POST /api/upload-prefill
 * Upload an Excel file to prefill form fields
 */
router.post('/', upload.single('excel'), async (req: Request, res: Response): Promise<Response> => {
  const startTime = Date.now();
  let uploadedFilePath: string | undefined;

  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        message: 'Please select an Excel file to upload'
      });
    }

    uploadedFilePath = req.file.path;
    console.log(`[Upload Prefill] Processing file: ${req.file.originalname}`);

    // Validate file
    const validation = fieldExtractor.validateFile(uploadedFilePath);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
        message: 'File validation failed'
      });
    }

    // Extract fields from Excel
    const extractionResult = await fieldExtractor.extractFields(uploadedFilePath);

    // Log extraction results
    console.log(`[Upload Prefill] Extracted ${extractionResult.metadata.fieldsExtracted} fields from ${extractionResult.metadata.sheetsFound.length} sheets`);
    
    if (extractionResult.warnings.length > 0) {
      console.log(`[Upload Prefill] Warnings: ${extractionResult.warnings.join(', ')}`);
    }

    // Build response
    const response = {
      success: true,
      extracted_fields: extractionResult.fields,
      warnings: extractionResult.warnings,
      metadata: {
        ...extractionResult.metadata,
        originalFileName: req.file.originalname,
        uploadTimeMs: Date.now() - startTime
      }
    };

    return res.json(response);

  } catch (error) {
    console.error('[Upload Prefill] Error:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process Excel file',
      processing_time_ms: Date.now() - startTime
    });
  } finally {
    // Clean up uploaded file
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
        console.log(`[Upload Prefill] Cleaned up temporary file: ${uploadedFilePath}`);
      } catch (err) {
        console.error(`[Upload Prefill] Failed to clean up file: ${err}`);
      }
    }
  }
});

/**
 * GET /api/upload-prefill/sample
 * Download a sample Excel template
 */
router.get('/sample', async (_req: Request, res: Response): Promise<Response | void> => {
  try {
    const templatePath = path.join(process.cwd(), '../calc.xlsx');
    
    // Check if template exists
    try {
      await fs.access(templatePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: 'Sample template not found'
      });
    }

    // Send file
    res.download(templatePath, 'sample-template.xlsx', (err) => {
      if (err) {
        console.error('[Upload Prefill] Error sending sample template:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Failed to download sample template'
          });
        }
      }
    });
  } catch (error) {
    console.error('[Upload Prefill] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process request'
    });
  }
});

export default router;