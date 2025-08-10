import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { ExcelProcessor } from '../processors/excel-processor';
// import { QueueManager } from '../services/queue-manager';
import { logger } from '../utils/logger';
import crypto from 'crypto';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xlsx' && ext !== '.xls') {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
      return;
    }
    cb(null, true);
  },
});

/**
 * GET /api/admin/template/info
 * Get current template information
 */
router.get('/template/info', async (_req: Request, res: Response) => {
  try {
    const templatePath = path.join(process.cwd(), 'calc.xlsx');
    const stats = await fs.stat(templatePath);
    
    // Get template metadata
    const metadata = {
      path: templatePath,
      size: stats.size,
      modified: stats.mtime,
      created: stats.ctime,
      sizeFormatted: formatBytes(stats.size),
    };

    // Try to get template version from Excel
    let version = 'Unknown';
    try {
      const processor = new ExcelProcessor();
      await processor.initialize();
      version = processor.getTemplateVersion() || 'calc.xlsx v7';
    } catch (error) {
      logger.warn('Could not read template version:', error);
    }

    res.json({
      success: true,
      template: {
        ...metadata,
        version,
        backups: await getBackupList(),
      },
    });
  } catch (error: any) {
    logger.error('Failed to get template info:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get template information',
        details: error.message,
      },
    });
  }
});

/**
 * POST /api/admin/template/upload
 * Upload and replace Excel template
 */
router.post('/template/upload', upload.single('template'), async (req: Request, res: Response): Promise<Response> => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No file uploaded',
        code: 'NO_FILE',
      },
    });
  }

  const uploadId = crypto.randomBytes(8).toString('hex');
  logger.info(`Template upload started: ${uploadId}`, {
    originalName: req.file.originalname,
    size: req.file.size,
  });

  try {
    // Step 1: Validate the uploaded file
    const validation = await validateTemplate(req.file.buffer);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid template file',
          code: 'INVALID_TEMPLATE',
          details: validation.errors,
        },
      });
    }

    // Step 2: Create backup of current template
    const backupPath = await createBackup();
    logger.info(`Created backup: ${backupPath}`);

    // Step 3: Save new template
    const templatePath = path.join(process.cwd(), 'calc.xlsx');
    await fs.writeFile(templatePath, req.file.buffer);
    logger.info(`Template saved: ${templatePath}`);

    // Step 4: Workers will use new template on next request
    // Note: In production, you may want to restart the service
    logger.info('Template updated - workers will use new template on next request');

    // Step 5: Verify new template works
    const testResult = await testNewTemplate();
    if (!testResult.success) {
      // Rollback on failure
      logger.error('New template test failed, rolling back');
      await fs.copyFile(backupPath, templatePath);
      // Workers will pick up the old template on next request
      
      return res.status(500).json({
        success: false,
        error: {
          message: 'Template validation failed, rolled back to previous version',
          code: 'TEMPLATE_TEST_FAILED',
          details: testResult.error,
        },
      });
    }

    return res.json({
      success: true,
      uploadId,
      message: 'Template successfully uploaded and activated',
      backup: backupPath,
      validation: validation.details,
      test: testResult.details,
    });

  } catch (error: any) {
    logger.error(`Template upload failed: ${uploadId}`, error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to upload template',
        code: 'UPLOAD_FAILED',
        details: error.message,
      },
    });
  }
});

/**
 * POST /api/admin/template/restore
 * Restore template from backup
 */
router.post('/template/restore', async (req: Request, res: Response): Promise<Response> => {
  const { backupFile } = req.body;

  if (!backupFile) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'No backup file specified',
        code: 'NO_BACKUP_FILE',
      },
    });
  }

  try {
    const backupPath = path.join(process.cwd(), 'backups', backupFile);
    const templatePath = path.join(process.cwd(), 'calc.xlsx');

    // Verify backup exists
    await fs.access(backupPath);

    // Create backup of current before restoring
    await createBackup('pre-restore');

    // Restore from backup
    await fs.copyFile(backupPath, templatePath);
    logger.info(`Restored template from: ${backupPath}`);

    // Workers will pick up restored template on next request
    logger.info('Template restored - workers will use restored template on next request');

    return res.json({
      success: true,
      message: 'Template restored successfully',
      restoredFrom: backupFile,
    });

  } catch (error: any) {
    logger.error('Template restore failed:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Failed to restore template',
        code: 'RESTORE_FAILED',
        details: error.message,
      },
    });
  }
});

/**
 * GET /api/admin/template/download
 * Download current template
 */
router.get('/template/download', async (_req: Request, res: Response) => {
  try {
    const templatePath = path.join(process.cwd(), 'calc.xlsx');
    const stats = await fs.stat(templatePath);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="calc_template_${Date.now()}.xlsx"`);
    res.setHeader('Content-Length', stats.size);
    
    const fileBuffer = await fs.readFile(templatePath);
    res.send(fileBuffer);
  } catch (error: any) {
    logger.error('Template download failed:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to download template',
        details: error.message,
      },
    });
  }
});

// Helper functions

async function validateTemplate(buffer: Buffer): Promise<{
  isValid: boolean;
  errors: string[];
  details: any;
}> {
  const errors: string[] = [];
  const details: any = {};

  try {
    // Create temporary processor to validate
    const processor = new ExcelProcessor();
    
    // Write to temp file for validation
    const tempPath = path.join(process.cwd(), `temp_validate_${Date.now()}.xlsx`);
    await fs.writeFile(tempPath, buffer);

    try {
      // Load and check structure
      await processor.loadTemplate(tempPath);
      
      // Check required sheets
      const requiredSheets = ['технолог', 'снабжение', 'результат'];
      const sheets = await processor.getSheetNames();
      details.sheets = sheets;

      for (const sheet of requiredSheets) {
        if (!sheets.includes(sheet)) {
          errors.push(`Missing required sheet: ${sheet}`);
        }
      }

      // Check key cells exist
      const keyCells = [
        { sheet: 'технолог', cell: 'D27', name: 'tech_D27_type' },
        { sheet: 'снабжение', cell: 'D8', name: 'sup_D8_priceMaterial' },
        { sheet: 'результат', cell: 'B3', name: 'total_cost' },
      ];

      for (const { sheet, cell, name } of keyCells) {
        try {
          const value = await processor.getCellValue(sheet, cell);
          details[name] = { exists: true, value };
        } catch (error) {
          errors.push(`Missing key cell: ${sheet}!${cell} (${name})`);
          details[name] = { exists: false };
        }
      }

      // Check formulas in результат sheet
      const formulaCells = ['B3', 'B4', 'B5', 'B6', 'B7'];
      details.formulas = {};
      
      for (const cell of formulaCells) {
        try {
          const formula = await processor.getCellFormula('результат', cell);
          if (!formula) {
            errors.push(`Missing formula in результат!${cell}`);
          }
          details.formulas[cell] = formula || 'No formula';
        } catch (error) {
          errors.push(`Cannot read результат!${cell}`);
        }
      }

    } finally {
      // Clean up temp file
      await fs.unlink(tempPath).catch(() => {});
    }

  } catch (error: any) {
    errors.push(`Failed to parse Excel file: ${error.message}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    details,
  };
}

async function createBackup(suffix?: string): Promise<string> {
  const backupDir = path.join(process.cwd(), 'backups');
  await fs.mkdir(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `calc_backup_${timestamp}${suffix ? '_' + suffix : ''}.xlsx`;
  const backupPath = path.join(backupDir, backupName);

  const templatePath = path.join(process.cwd(), 'calc.xlsx');
  await fs.copyFile(templatePath, backupPath);

  // Keep only last 10 backups
  const files = await fs.readdir(backupDir);
  const backups = files
    .filter(f => f.startsWith('calc_backup_'))
    .sort()
    .reverse();

  for (const oldBackup of backups.slice(10)) {
    await fs.unlink(path.join(backupDir, oldBackup)).catch(() => {});
  }

  return backupPath;
}

async function getBackupList(): Promise<any[]> {
  const backupDir = path.join(process.cwd(), 'backups');
  
  try {
    await fs.mkdir(backupDir, { recursive: true });
    const files = await fs.readdir(backupDir);
    
    const backups = await Promise.all(
      files
        .filter(f => f.startsWith('calc_backup_'))
        .map(async (file) => {
          const filePath = path.join(backupDir, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            size: stats.size,
            sizeFormatted: formatBytes(stats.size),
            created: stats.birthtime,
            modified: stats.mtime,
          };
        })
    );

    return backups.sort((a, b) => b.modified.getTime() - a.modified.getTime());
  } catch {
    return [];
  }
}

async function testNewTemplate(): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    const processor = new ExcelProcessor();
    await processor.initialize();

    // Test basic calculation
    const testData = {
      tech_D27_type: 1,
      tech_E27_weightType: 'TEST',
      sup_D8_priceMaterial: 100,
      sup_E8_priceMaterial: 100,
    };

    // Write test values
    for (const [field, value] of Object.entries(testData)) {
      const mapping = processor.getFieldMapping(field);
      if (mapping) {
        await processor.setCellValueForTesting(mapping.sheet, mapping.cell, value);
      }
    }

    // Try to calculate
    await processor.calculateFormulas();

    // Read result
    const totalCost = await processor.getCellValue('результат', 'B3');
    
    return {
      success: true,
      details: {
        testData,
        totalCost,
        calculated: typeof totalCost === 'number',
      },
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;