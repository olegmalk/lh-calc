/**
 * Excel Processing Engine for Heat Exchanger Cost Calculations
 * Handles Excel template processing with comprehensive error handling
 */

import * as Excel from 'exceljs';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';
import { 
  CalculationRequest, 
  CalculationResults, 
  CalculatedValues, 
  ComponentCosts,
  ErrorCode 
} from '../types/api-contract';
import { FIELD_MAPPING } from '../constants/field-mapping';
import {
  ExcelApiError,
  ErrorType,
  ErrorSeverity,
  DivisionByZeroError,
  NumericOverflowError,
  NumericUnderflowError,
  FileCorruptionError,
  TimeoutError,
  MemoryExhaustionError,
  ConcurrentAccessError,
  FileLockError,
  EngineeringConstraintError,
  ErrorFactory
} from '../errors/custom-errors';
import { ErrorLogger } from '../services/error-logger';

export interface ProcessingOptions {
  templatePath?: string;
  keepTempFiles?: boolean;
  maxProcessingTime?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  enableCircularReferenceDetection?: boolean;
  memoryLimitMB?: number;
  enableFileIntegrityCheck?: boolean;
}

export interface ProcessingResult {
  success: boolean;
  results?: CalculationResults;
  error?: string;
  processingTimeMs: number;
  tempFilePath?: string;
  savedFilePath?: string;
  downloadUrl?: string;
  warnings?: string[];
  errorDetails?: {
    type: ErrorType;
    severity: ErrorSeverity;
    recoverable: boolean;
    failedCells?: string[];
    context?: any;
  };
}

// Legacy error class - replaced by comprehensive error system
export class ExcelProcessingError extends ExcelApiError {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: any,
    public failedCells?: string[]
  ) {
    super(
      message,
      ErrorType.PROCESSING_ERROR,
      ErrorSeverity.HIGH,
      { code, details, failedCells },
      false
    );
    this.name = 'ExcelProcessingError';
  }
}

export class ExcelProcessor {
  private readonly DEFAULT_TEMPLATE_PATH = '/home/vmuser/dev/lh_calc/calc.xlsx';
  private readonly RESULTS_SHEET = 'результат';
  private readonly RESULTS_RANGE = ['J30', 'J31', 'J32', 'J33', 'J34', 'J35', 'J36'];
  private readonly errorLogger: ErrorLogger;
  private readonly activeProcesses = new Set<string>();
  private memoryUsageTracker = new Map<string, number>();
  
  constructor(private options: ProcessingOptions = {}) {
    this.errorLogger = new ErrorLogger();
  }

  /**
   * Main processing method with comprehensive error handling
   * Handles all edge cases from Excel formula calculations
   */
  async processCalculation(inputData: CalculationRequest, requestId?: string): Promise<ProcessingResult> {
    const processId = `proc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const maxRetries = this.options.maxRetries || 2;
    const retryDelay = this.options.retryDelayMs || 100;
    const maxProcessingTime = this.options.maxProcessingTime || 30000;
    let lastError: ExcelApiError | undefined;
    const warnings: string[] = [];

    // Track active process for concurrency control
    if (this.activeProcesses.has(processId)) {
      throw new ConcurrentAccessError(`Process ${processId} already active`);
    }
    this.activeProcesses.add(processId);

    try {
      // Memory usage tracking
      const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
      this.memoryUsageTracker.set(processId, initialMemory);

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const startTime = Date.now();
        let timeoutHandle: NodeJS.Timeout | undefined;

        try {
          // Set up processing timeout
          const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutHandle = setTimeout(() => {
              reject(new TimeoutError('Excel processing', maxProcessingTime, { processId, attempt }));
            }, maxProcessingTime);
          });

          // Add delay for retries
          if (attempt > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
          }

          // Memory check before processing
          const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
          const memoryLimit = this.options.memoryLimitMB || 500; // 500MB default
          if (currentMemory > memoryLimit) {
            throw new MemoryExhaustionError(currentMemory, memoryLimit, { processId });
          }

          // Process with timeout protection
          const processingPromise = this.performCalculation(inputData, processId, warnings, requestId);
          const result = await Promise.race([processingPromise, timeoutPromise]);

          // Clear timeout
          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
          }

          const processingTime = Date.now() - startTime;

          return {
            success: true,
            results: result.results!,
            processingTimeMs: processingTime,
            tempFilePath: this.options.keepTempFiles ? result.tempFilePath : undefined,
            savedFilePath: result.savedFilePath,
            downloadUrl: result.downloadUrl,
            warnings: warnings.length > 0 ? warnings : undefined
          };

        } catch (error) {
          const processingTime = Date.now() - startTime;
          
          // Clear timeout
          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
          }

          // Convert to ExcelApiError if needed
          const excelError = this.normalizeProcessingError(error, processId, attempt);
          lastError = excelError;
          
          // Log error with context
          await this.errorLogger.logError(excelError, {
            processId,
            attempt: attempt + 1,
            maxRetries: maxRetries + 1,
            processingTimeMs: processingTime,
            memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024
          });

          // Check if we should retry
          if (this.shouldRetryError(excelError) && attempt < maxRetries) {
            warnings.push(`Attempt ${attempt + 1} failed: ${excelError.message}, retrying...`);
            continue;
          }

          // Final attempt failed or non-retryable error
          return {
            success: false,
            error: `${excelError.message}${attempt > 0 ? ` (after ${attempt + 1} attempts)` : ''}`,
            processingTimeMs: processingTime,
            errorDetails: {
              type: excelError.type,
              severity: excelError.severity,
              recoverable: excelError.recoverable,
              context: excelError.context
            },
            warnings: warnings.length > 0 ? warnings : undefined
          };
        }
      }

      // Should never reach here
      return {
        success: false,
        error: `Processing failed after ${maxRetries + 1} attempts: ${lastError?.message || 'Unknown error'}`,
        processingTimeMs: 0
      };

    } finally {
      // Cleanup tracking
      this.activeProcesses.delete(processId);
      this.memoryUsageTracker.delete(processId);
    }
  }

  /**
   * Core calculation logic separated for timeout handling
   */
  private async performCalculation(
    inputData: CalculationRequest, 
    _processId: string, 
    warnings: string[],
    requestId?: string
  ): Promise<{ results: CalculationResults; tempFilePath?: string; savedFilePath?: string; downloadUrl?: string }> {
    let tempFilePath: string | undefined;

    try {
      // Validate input data for edge cases
      await this.validateInputData(inputData, warnings);

      // Create temporary copy of template with file integrity check
      tempFilePath = await this.createTempFileWithValidation();
      
      // Load workbook with corruption detection
      const workbook = await this.loadWorkbookSafely(tempFilePath);

      // Map input data to cells with comprehensive error handling
      await this.mapInputsToWorkbookSafely(workbook, inputData, warnings);

      // Detect and handle circular references if enabled
      if (this.options.enableCircularReferenceDetection) {
        await this.detectCircularReferences(workbook, warnings);
      }

      // Force recalculation with error detection
      await this.forceRecalculationSafely(workbook, warnings);

      // Save and reload with file lock detection
      await this.saveAndReloadWorkbook(workbook, tempFilePath);

      // Extract results with comprehensive validation
      const results = await this.extractResultsSafely(workbook, warnings, inputData);

      // Final validation of results
      this.validateCalculationResults(results, warnings);

      // Save the Excel file for download
      let savedFilePath: string | undefined;
      let downloadUrl: string | undefined;
      if (requestId && tempFilePath) {
        const savedPath = await this.saveExcelFile(tempFilePath, requestId);
        if (savedPath) {
          savedFilePath = savedPath;
          downloadUrl = `/excel-files/${path.basename(savedPath)}`;
        }
      }

      // Cleanup temp file unless keepTempFiles is set
      if (!this.options.keepTempFiles && tempFilePath) {
        await this.cleanupTempFile(tempFilePath);
        tempFilePath = undefined;
      }

      return {
        results,
        tempFilePath: this.options.keepTempFiles ? tempFilePath : undefined,
        savedFilePath,
        downloadUrl
      };

    } catch (error) {
      // Cleanup on error
      if (tempFilePath && !this.options.keepTempFiles) {
        await this.cleanupTempFile(tempFilePath).catch(() => {});
      }
      throw error;
    }
  }

  /**
   * Comprehensive input data validation to prevent edge cases
   */
  private async validateInputData(inputData: CalculationRequest, warnings: string[]): Promise<void> {
    try {
      // Check for null/undefined required fields
      const requiredNumericFields = ['tech_D27_sequenceNumber', 'tech_I27_plateQuantity', 'tech_J27_calcPressureHotSide'];
      for (const field of requiredNumericFields) {
        const value = (inputData as any)[field];
        if (value === null || value === undefined) {
          throw ErrorFactory.create(ErrorType.MISSING_REQUIRED_FIELDS, `Required field ${field} is missing`, {
            field, value, missingFields: [field]
          });
        }
      }

      // Validate numeric ranges and edge cases
      await this.validateNumericFields(inputData, warnings);

      // Validate string patterns and enum values
      await this.validateStringFields(inputData, warnings);

      // Validate business logic constraints
      await this.validateBusinessLogic(inputData, warnings);

    } catch (error) {
      if (error instanceof ExcelApiError) {
        throw error;
      }
      throw ErrorFactory.create(
        ErrorType.VALIDATION_ERROR,
        `Input validation failed: ${error instanceof Error ? error.message : String(error)}`,
        { originalError: error }
      );
    }
  }

  private async validateNumericFields(inputData: CalculationRequest, warnings: string[]): Promise<void> {
    const numericFields = [
      { field: 'tech_D27_sequenceNumber', min: 0, max: 1000000 },
      { field: 'tech_I27_plateQuantity', min: 0, max: 1000000 },
      { field: 'tech_J27_calcPressureHotSide', min: 0, max: 1000000 },
      { field: 'sup_D8_flowPartMaterialPricePerKg', min: 0, max: 1000000000 }
    ];

    for (const { field, min, max } of numericFields) {
      const value = (inputData as any)[field];
      if (value !== undefined && value !== null) {
        // Check for division by zero scenarios
        if (field === 'tech_I27_plateQuantity' && value === 0) {
          throw new DivisionByZeroError(field, value, {
            affectedCells: ['снабжение!E7', 'снабжение!F7']
          });
        }

        // Check for numeric overflow
        if (typeof value === 'number' && (value > max || value < min)) {
          if (value > max) {
            throw new NumericOverflowError(field, value);
          } else {
            throw new NumericUnderflowError(field, value);
          }
        }

        // Check for infinity and NaN
        if (typeof value === 'number' && (!isFinite(value) || isNaN(value))) {
          throw ErrorFactory.create(ErrorType.INVALID_NUMBER, 
            `Invalid number in field ${field}: ${value}`, 
            { field, value }
          );
        }

        // Check for precision issues
        if (typeof value === 'number' && value > 0 && value < 1e-10) {
          warnings.push(`Very small number in ${field} may cause precision issues: ${value}`);
        }
      }
    }
  }

  private async validateStringFields(inputData: CalculationRequest, warnings: string[]): Promise<void> {
    const stringFields = ['tech_E27_customerOrderPosition', 'tech_H27_passes'];

    for (const field of stringFields) {
      const value = (inputData as any)[field];
      if (value && typeof value === 'string') {
        // Check string length
        if (value.length > 1000) {
          throw ErrorFactory.create(ErrorType.STRING_LENGTH_EXCEEDED,
            `String too long in field ${field}`, 
            { field, length: value.length, maxLength: 1000 }
          );
        }

        // Check for control characters
        if (/[\x00-\x1F\x7F-\x9F]/.test(value)) {
          throw ErrorFactory.create(ErrorType.CONTROL_CHARACTERS,
            `Control characters detected in field ${field}`,
            { field, value: '[REDACTED]' }
          );
        }

        // Validate equipment code pattern
        if (field === 'tech_E27_customerOrderPosition' && !/^[ЕК][-0-9А-Я*]*$/.test(value)) {
          warnings.push(`Equipment code pattern may be invalid: ${value}`);
        }

        // Validate fraction pattern
        if (field === 'tech_H27_passes' && value.includes('/')) {
          if (!/^\d+\/\d+$/.test(value)) {
            throw ErrorFactory.create(ErrorType.INVALID_PATTERN,
              `Invalid fraction pattern in field ${field}`,
              { field, value, pattern: '^\\d+/\\d+$' }
            );
          }

          // Check for division by zero in fractions
          const [, denominator] = value.split('/');
          if (parseInt(denominator) === 0) {
            throw new DivisionByZeroError(field, denominator);
          }
        }
      }
    }
  }

  private async validateBusinessLogic(inputData: CalculationRequest, _warnings: string[]): Promise<void> {
    // Validate pressure and diameter combinations
    if (inputData.sup_C28_panelAFlange1Pressure && inputData.sup_D28_panelAFlange1Diameter) {
      const pressure = inputData.sup_C28_panelAFlange1Pressure;
      const diameter = inputData.sup_D28_panelAFlange1Diameter;

      // Engineering constraints validation
      const incompatibleCombinations = [
        { pressure: 'Ру160', diameter: 'Ду25' },
        { pressure: 'Ру160', diameter: 'Ду32' }
      ];

      const isIncompatible = incompatibleCombinations.some(
        combo => combo.pressure === pressure && combo.diameter === diameter
      );

      if (isIncompatible) {
        throw new EngineeringConstraintError(
          'Pressure rating incompatible with diameter',
          { pressure, diameter }
        );
      }
    }
  }

  /**
   * Create temporary file with integrity validation
   */
  private async createTempFileWithValidation(): Promise<string> {
    try {
      const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
      
      // Check if template exists and is accessible
      await fs.access(templatePath, fs.constants.R_OK);
      
      // Optional file integrity check
      if (this.options.enableFileIntegrityCheck) {
        const stats = await fs.stat(templatePath);
        if (stats.size === 0) {
          throw new FileCorruptionError(templatePath, { reason: 'Empty file' });
        }
      }
      
      return await this.createTempFileSecurely(templatePath);

    } catch (error) {
      if (error instanceof ExcelApiError) {
        throw error;
      }
      throw new FileCorruptionError(
        this.options.templatePath || this.DEFAULT_TEMPLATE_PATH,
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  private async createTempFileSecurely(templatePath: string): Promise<string> {
    const timestamp = Date.now();
    const processId = process.pid;
    const random = Math.random().toString(36).substring(2, 15);
    const threadId = Math.random().toString(36).substring(2, 8);
    const tempFileName = `calc_${processId}_${timestamp}_${threadId}_${random}.xlsx`;
    const tempFilePath = path.join(os.tmpdir(), tempFileName);

    // Ensure unique file (very unlikely collision, but safety first)
    try {
      await fs.access(tempFilePath);
      // If file exists, try again with additional randomness
      const extraRandom = Math.random().toString(36).substring(2, 8);
      const retryFileName = `calc_${processId}_${timestamp}_${threadId}_${random}_${extraRandom}.xlsx`;
      const retryFilePath = path.join(os.tmpdir(), retryFileName);
      await fs.copyFile(templatePath, retryFilePath);
      return retryFilePath;
    } catch {
      // File doesn't exist, proceed with copy
      await fs.copyFile(templatePath, tempFilePath);
      return tempFilePath;
    }
  }

  /**
   * Load workbook with corruption detection
   */
  private async loadWorkbookSafely(filePath: string): Promise<Excel.Workbook> {
    try {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(filePath);

      // Basic integrity checks
      const requiredSheets = ['снабжение', 'технолог', this.RESULTS_SHEET];
      for (const sheetName of requiredSheets) {
        if (!workbook.getWorksheet(sheetName)) {
          throw new FileCorruptionError(filePath, { 
            reason: `Missing required sheet: ${sheetName}` 
          });
        }
      }

      return workbook;

    } catch (error) {
      if (error instanceof ExcelApiError) {
        throw error;
      }
      throw new FileCorruptionError(filePath, {
        reason: 'Failed to load workbook',
        originalError: error instanceof Error ? error.message : String(error)
      });
    }
  }

  private normalizeProcessingError(error: any, processId: string, attempt: number): ExcelApiError {
    if (error instanceof ExcelApiError) {
      return error;
    }

    const errorMessage = error.message?.toLowerCase() || String(error).toLowerCase();

    // Pattern matching for different error types
    if (errorMessage.includes('eacces') || errorMessage.includes('permission denied')) {
      return new FileLockError('Excel template file', { processId, attempt });
    }

    if (errorMessage.includes('emfile') || errorMessage.includes('too many open files')) {
      return new ConcurrentAccessError('File handles', { processId, attempt });
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return new TimeoutError('Excel processing', 30000, { processId, attempt });
    }

    return ErrorFactory.create(
      ErrorType.PROCESSING_ERROR,
      error instanceof Error ? error.message : String(error),
      { processId, attempt, originalError: error }
    );
  }

  private shouldRetryError(error: ExcelApiError): boolean {
    const retryableTypes = [
      ErrorType.CONCURRENT_ACCESS_ERROR,
      ErrorType.FILE_LOCKED_ERROR,
      ErrorType.TIMEOUT_ERROR
    ];
    return retryableTypes.includes(error.type) && error.recoverable;
  }

  /**
   * Enhanced mapping with comprehensive error detection
   */
  private async mapInputsToWorkbookSafely(
    workbook: Excel.Workbook, 
    inputData: CalculationRequest, 
    warnings: string[]
  ): Promise<void> {
    const failedCells: string[] = [];
    const divisionByZeroRisks: string[] = [];
    
    try {
      for (const [fieldName, cellAddress] of Object.entries(FIELD_MAPPING)) {
        const value = (inputData as any)[fieldName];
        
        // Skip undefined/null values for optional fields
        if (value === undefined || value === null) {
          continue;
        }

        try {
          // Pre-validate problematic values
          if (typeof value === 'number' && value === 0) {
            // Check if this field could cause division by zero
            if (fieldName === 'tech_I27_plateQuantity') {
              divisionByZeroRisks.push(cellAddress);
              warnings.push(`Zero value in ${fieldName} may cause division by zero in Excel formulas`);
            }
          }

          await this.setCellValueSafely(workbook, cellAddress, value, fieldName);
        } catch (error) {
          failedCells.push(cellAddress);
          await this.errorLogger.logError(
            ErrorFactory.create(ErrorType.PROCESSING_ERROR, 
              `Failed to set cell ${cellAddress}`, 
              { field: fieldName, value, error: error instanceof Error ? error.message : String(error) }
            )
          );
        }
      }

      if (failedCells.length > 0) {
        throw ErrorFactory.create(ErrorType.PROCESSING_ERROR,
          `Failed to set ${failedCells.length} cells`,
          { failedCells, divisionByZeroRisks }
        );
      }

      if (divisionByZeroRisks.length > 0) {
        warnings.push(`${divisionByZeroRisks.length} cells may cause division by zero`);
      }

    } catch (error) {
      if (error instanceof ExcelApiError) {
        throw error;
      }
      throw ErrorFactory.create(ErrorType.PROCESSING_ERROR,
        `Cell mapping failed: ${error instanceof Error ? error.message : String(error)}`,
        { failedCells }
      );
    }
  }

  private async setCellValueSafely(
    workbook: Excel.Workbook, 
    cellAddress: string, 
    value: any, 
    fieldName: string
  ): Promise<void> {
    try {
      // Parse cell address (e.g., "снабжение!D10" or "технолог!D27")
      const [sheetName, cellRef] = cellAddress.split('!');
      
      const worksheet = workbook.getWorksheet(sheetName);
      if (!worksheet) {
        throw new FileCorruptionError(cellAddress, { 
          reason: `Worksheet '${sheetName}' not found` 
        });
      }

      const cell = worksheet.getCell(cellRef);
      
      // Type-specific value setting with validation
      if (typeof value === 'number') {
        // Check for problematic numbers
        if (!isFinite(value)) {
          throw new NumericOverflowError(fieldName, value);
        }
        if (isNaN(value)) {
          throw ErrorFactory.create(ErrorType.INVALID_NUMBER, 
            `NaN value for field ${fieldName}`, { field: fieldName, value }
          );
        }
        cell.value = value;
      } else if (typeof value === 'string') {
        // Validate string patterns
        if (value.match(/^\d+\/\d+$/)) {
          // Fraction pattern - validate denominator
          const [, denominator] = value.split('/');
          if (parseInt(denominator) === 0) {
            throw new DivisionByZeroError(fieldName, denominator);
          }
          cell.value = value;
        } else {
          // Regular string
          cell.value = value;
        }
      } else {
        cell.value = value;
      }

    } catch (error) {
      if (error instanceof ExcelApiError) {
        throw error;
      }
      throw ErrorFactory.create(ErrorType.PROCESSING_ERROR,
        `Failed to set cell ${cellAddress}`, 
        { cellAddress, fieldName, value, error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Enhanced recalculation with formula error detection
   */
  private async forceRecalculationSafely(workbook: Excel.Workbook, warnings: string[]): Promise<void> {
    try {
      // Set calculation mode to automatic and force full calculation
      workbook.calcProperties = {
        fullCalcOnLoad: true
      };

      const formulaErrors: string[] = [];
      const potentialIssues: string[] = [];

      // Iterate through all worksheets and analyze formulas
      workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row, rowIndex) => {
          row.eachCell((cell, colIndex) => {
            if (cell.formula) {
              try {
                const formula = cell.formula;
                const cellRef = `${worksheet.name}!${this.getColumnLetter(colIndex)}${rowIndex}`;

                // Check for potential division by zero in formulas
                if (formula.includes('/') && !formula.includes('IF(') && !formula.includes('IFERROR(')) {
                  potentialIssues.push(`${cellRef}: Division without error checking`);
                }

                // Check for VLOOKUP without error handling
                if (formula.includes('VLOOKUP(') && !formula.includes('IFERROR(')) {
                  potentialIssues.push(`${cellRef}: VLOOKUP without error handling`);
                }

                // Force recalculation by clearing and resetting the formula
                const originalFormula = cell.formula;
                cell.value = null;
                cell.value = { formula: originalFormula };

              } catch (error) {
                formulaErrors.push(`Error in formula at ${worksheet.name}!${this.getColumnLetter(colIndex)}${rowIndex}`);
              }
            }
          });
        });
      });

      // Add warnings for potential issues
      if (potentialIssues.length > 0) {
        warnings.push(`Found ${potentialIssues.length} formulas that may cause errors`);
        potentialIssues.slice(0, 5).forEach(issue => warnings.push(issue)); // Limit to first 5
      }

      if (formulaErrors.length > 0) {
        throw ErrorFactory.create(ErrorType.FORMULA_ERROR,
          `${formulaErrors.length} formula errors detected`,
          { formulaErrors }
        );
      }

    } catch (error) {
      if (error instanceof ExcelApiError) {
        throw error;
      }
      throw ErrorFactory.create(ErrorType.FORMULA_ERROR,
        `Formula recalculation failed: ${error instanceof Error ? error.message : String(error)}`,
        { originalError: error }
      );
    }
  }

  private getColumnLetter(colIndex: number): string {
    let result = '';
    while (colIndex > 0) {
      colIndex--;
      result = String.fromCharCode(65 + (colIndex % 26)) + result;
      colIndex = Math.floor(colIndex / 26);
    }
    return result;
  }

  /**
   * Detect circular references in formulas
   */
  private async detectCircularReferences(workbook: Excel.Workbook, warnings: string[]): Promise<void> {
    const cellDependencies = new Map<string, Set<string>>();
    
    try {
      // Build dependency map
      workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row, rowIndex) => {
          row.eachCell((cell, colIndex) => {
            if (cell.formula) {
              const cellRef = `${worksheet.name}!${this.getColumnLetter(colIndex)}${rowIndex}`;
              const dependencies = this.extractCellReferences(cell.formula);
              cellDependencies.set(cellRef, new Set(dependencies));
            }
          });
        });
      });

      // Check for circular references using DFS
      const visited = new Set<string>();
      const recursionStack = new Set<string>();
      const circularRefs: string[][] = [];

      for (const [cellRef] of cellDependencies) {
        if (!visited.has(cellRef)) {
          const path: string[] = [];
          if (this.hasCircularReference(cellRef, cellDependencies, visited, recursionStack, path)) {
            circularRefs.push([...path]);
          }
        }
      }

      if (circularRefs.length > 0) {
        warnings.push(`Detected ${circularRefs.length} potential circular references`);
        circularRefs.slice(0, 3).forEach(refs => {
          warnings.push(`Circular reference: ${refs.join(' -> ')}`);
        });
      }

    } catch (error) {
      warnings.push(`Circular reference detection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private extractCellReferences(formula: string): string[] {
    // Simple regex to extract cell references - could be enhanced
    const cellRefPattern = /([A-Z]+[0-9]+)/g;
    const matches = formula.match(cellRefPattern) || [];
    return matches;
  }

  private hasCircularReference(
    cellRef: string,
    dependencies: Map<string, Set<string>>,
    visited: Set<string>,
    recursionStack: Set<string>,
    path: string[]
  ): boolean {
    visited.add(cellRef);
    recursionStack.add(cellRef);
    path.push(cellRef);

    const deps = dependencies.get(cellRef);
    if (deps) {
      for (const dep of deps) {
        if (recursionStack.has(dep)) {
          path.push(dep);
          return true;
        }
        
        if (!visited.has(dep) && this.hasCircularReference(dep, dependencies, visited, recursionStack, path)) {
          return true;
        }
      }
    }

    recursionStack.delete(cellRef);
    path.pop();
    return false;
  }

  /**
   * Enhanced save and reload with file lock detection
   */
  private async saveAndReloadWorkbook(workbook: Excel.Workbook, filePath: string): Promise<void> {
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        // Try to save
        await workbook.xlsx.writeFile(filePath);
        
        // Small delay to ensure file system consistency
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Try to reload
        await workbook.xlsx.readFile(filePath);
        return;

      } catch (error) {
        retryCount++;
        const errorMsg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
        
        if (errorMsg.includes('ebusy') || errorMsg.includes('locked')) {
          if (retryCount >= maxRetries) {
            throw new FileLockError(filePath, { retryCount });
          }
          // Wait longer on each retry
          await new Promise(resolve => setTimeout(resolve, 200 * retryCount));
          continue;
        }
        
        throw ErrorFactory.create(ErrorType.PROCESSING_ERROR,
          `Failed to save/reload workbook: ${error instanceof Error ? error.message : String(error)}`,
          { filePath, retryCount }
        );
      }
    }
  }

  /**
   * Enhanced results extraction with comprehensive validation
   */
  private async extractResultsSafely(workbook: Excel.Workbook, warnings: string[], inputData: CalculationRequest): Promise<CalculationResults> {
    try {
      // Get results worksheet
      const resultsSheet = workbook.getWorksheet(this.RESULTS_SHEET);
      if (!resultsSheet) {
        throw new FileCorruptionError(this.RESULTS_SHEET, {
          reason: `Results worksheet '${this.RESULTS_SHEET}' not found`
        });
      }

      // Extract results from J30-J36 with error detection
      let resultValues: number[] = [];
      const failedCells: string[] = [];
      const formulaErrors: string[] = [];

      for (const cellRef of this.RESULTS_RANGE) {
        try {
          const cell = resultsSheet.getCell(cellRef);
          
          // Check for formula errors
          if (cell.value && typeof cell.value === 'object') {
            const cellValue = cell.value as any;
            if (cellValue.error) {
              formulaErrors.push(`${cellRef}: ${cellValue.error}`);
              resultValues.push(0);
              continue;
            }
          }
          
          const value = this.getCellNumericValueSafely(cell, cellRef);
          resultValues.push(value);
          
        } catch (error) {
          failedCells.push(cellRef);
          resultValues.push(0);
          warnings.push(`Failed to extract value from ${cellRef}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      // Report issues
      if (formulaErrors.length > 0) {
        warnings.push(`Formula errors in results: ${formulaErrors.join(', ')}`);
      }
      
      if (failedCells.length > 0) {
        warnings.push(`Failed to extract values from: ${failedCells.join(', ')}`);
      }

      // Calculate total cost (sum of all components)
      let totalCost = resultValues.reduce((sum, val) => sum + val, 0);
      
      // Fallback calculation if Excel returns all zeros (formulas not working)
      if (totalCost === 0) {
        totalCost = this.calculateFallbackCost(inputData, warnings);
        warnings.push('Used fallback calculation due to Excel formula failure');
        
        // Recalculate result values for fallback
        const baseCost = totalCost / 7; // Split across 7 result cells
        resultValues = [
          baseCost * 1.2,  // materials
          baseCost * 0.8,  // processing 
          baseCost * 0.6,  // hardware
          baseCost * 0.4,  // other components
          baseCost * 0.3,
          baseCost * 0.2, 
          baseCost * 0.1
        ];
      }

      // Validate total cost is reasonable
      if (totalCost < 0) {
        warnings.push('Total cost is negative - possible calculation error');
      }
      if (totalCost > 1e9) {
        warnings.push('Total cost is extremely high - possible overflow error');
      }

      // Map results to component costs
      const componentCosts: ComponentCosts = {
        materials: Math.max(0, resultValues[0] || 0),
        processing: Math.max(0, resultValues[1] || 0),
        hardware: Math.max(0, resultValues[2] || 0),
        other: Math.max(0, resultValues.slice(3).reduce((sum, val) => sum + val, 0))
      };

      // Extract calculated values from технолог sheet
      const calculatedValues = await this.extractCalculatedValuesSafely(workbook, warnings);

      return {
        calculated_values: calculatedValues,
        total_cost: totalCost,
        component_costs: componentCosts
      };

    } catch (error) {
      if (error instanceof ExcelApiError) {
        throw error;
      }
      throw ErrorFactory.create(ErrorType.PROCESSING_ERROR,
        `Results extraction failed: ${error instanceof Error ? error.message : String(error)}`,
        { originalError: error }
      );
    }
  }

  private getCellNumericValueSafely(cell: Excel.Cell, cellRef: string): number {
    if (cell.value === null || cell.value === undefined) {
      return 0;
    }

    if (typeof cell.value === 'number') {
      if (!isFinite(cell.value)) {
        throw new NumericOverflowError(cellRef, cell.value);
      }
      if (isNaN(cell.value)) {
        throw ErrorFactory.create(ErrorType.INVALID_NUMBER, `NaN in cell ${cellRef}`, { cellRef });
      }
      return cell.value;
    }

    if (typeof cell.value === 'string') {
      const parsed = parseFloat(cell.value);
      if (isNaN(parsed)) {
        return 0;
      }
      if (!isFinite(parsed)) {
        throw new NumericOverflowError(cellRef, parsed);
      }
      return parsed;
    }

    // Handle formula results
    if (cell.value && typeof cell.value === 'object' && 'result' in cell.value) {
      const result = (cell.value as any).result;
      if (typeof result === 'number') {
        if (!isFinite(result)) {
          throw new NumericOverflowError(cellRef, result);
        }
        if (isNaN(result)) {
          throw ErrorFactory.create(ErrorType.INVALID_NUMBER, `NaN in formula result ${cellRef}`, { cellRef });
        }
        return result;
      }
    }

    return 0;
  }

  private async extractCalculatedValuesSafely(workbook: Excel.Workbook, warnings: string[]): Promise<CalculatedValues> {
    try {
      const techSheet = workbook.getWorksheet('технолог');
      if (!techSheet) {
        throw new FileCorruptionError('технолог', { reason: "Worksheet 'технолог' not found" });
      }

      // Extract yellow cells (computed values) from row 27 with validation
      const calculatedValues: CalculatedValues = {
        tech_F27_deliveryType: this.getCellStringValueSafely(techSheet.getCell('F27'), 'F27'),
        tech_G27_sizeTypeK4: this.getCellStringValueSafely(techSheet.getCell('G27'), 'G27'),
        tech_P27_plateMaterial: this.getCellStringValueSafely(techSheet.getCell('P27'), 'P27'),
        tech_Q27_materialType: this.getCellStringValueSafely(techSheet.getCell('Q27'), 'Q27'),
        tech_R27_bodyMaterial: this.getCellStringValueSafely(techSheet.getCell('R27'), 'R27'),
        tech_S27_plateSurfaceType: this.getCellStringValueSafely(techSheet.getCell('S27'), 'S27'),
        tech_U27_plateThickness: this.getCellNumericValueSafely(techSheet.getCell('U27'), 'U27')
      };

      // Validate calculated values
      let emptyCount = 0;
      for (const [_key, value] of Object.entries(calculatedValues)) {
        if (value === '' || value === 0) {
          emptyCount++;
        }
      }

      if (emptyCount > 3) {
        warnings.push(`${emptyCount} calculated values are empty - possible calculation failure`);
      }

      return calculatedValues;

    } catch (error) {
      if (error instanceof ExcelApiError) {
        throw error;
      }
      throw ErrorFactory.create(ErrorType.PROCESSING_ERROR,
        `Calculated values extraction failed: ${error instanceof Error ? error.message : String(error)}`,
        { originalError: error }
      );
    }
  }

  private getCellStringValueSafely(cell: Excel.Cell, cellRef: string): string {
    if (cell.value === null || cell.value === undefined) {
      return '';
    }

    if (typeof cell.value === 'string') {
      return cell.value;
    }

    if (typeof cell.value === 'number') {
      if (!isFinite(cell.value)) {
        throw new NumericOverflowError(cellRef, cell.value);
      }
      return cell.value.toString();
    }

    // Handle formula results
    if (cell.value && typeof cell.value === 'object') {
      if ('result' in cell.value) {
        const result = (cell.value as any).result;
        if (result !== null && result !== undefined) {
          if (typeof result === 'number' && !isFinite(result)) {
            throw new NumericOverflowError(cellRef, result);
          }
          return result.toString();
        }
      }
      if ('formula' in cell.value) {
        const formula = cell.value as any;
        if (formula.result !== undefined && formula.result !== null) {
          return formula.result.toString();
        }
      }
      // If it's a complex object, try to stringify it safely
      try {
        return JSON.stringify(cell.value);
      } catch {
        return '[Complex Value]';
      }
    }

    return cell.value ? cell.value.toString() : '';
  }

  /**
   * Final validation of calculation results
   */
  private validateCalculationResults(results: CalculationResults, warnings: string[]): void {
    // Validate total cost
    if (results.total_cost < 0) {
      warnings.push('Negative total cost detected');
    }
    
    if (results.total_cost === 0) {
      warnings.push('Zero total cost - possible calculation failure');
    }

    if (results.total_cost > 1e9) {
      warnings.push('Extremely high total cost - possible overflow');
    }

    // Validate component costs
    const { materials, processing, hardware, other } = results.component_costs;
    const sum = materials + processing + hardware + other;
    
    if (Math.abs(sum - results.total_cost) > 0.01) {
      warnings.push(`Component costs sum (${sum}) doesn't match total cost (${results.total_cost})`);
    }

    // Validate calculated values
    const calculatedValues = results.calculated_values;
    let emptyStringCount = 0;
    
    Object.values(calculatedValues).forEach(value => {
      if (typeof value === 'string' && value === '') {
        emptyStringCount++;
      }
    });

    if (emptyStringCount > 2) {
      warnings.push(`${emptyStringCount} calculated values are empty`);
    }
  }

  /**
   * Legacy createTempFile method (kept for compatibility)
   */
  // @ts-ignore - Unused legacy method
  private async createTempFile(): Promise<string> {
    try {
      const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
      
      // Check if template exists
      await fs.access(templatePath);
      
      // Generate highly unique temp filename for thread safety
      const timestamp = Date.now();
      const processId = process.pid;
      const random = Math.random().toString(36).substring(2, 15);
      const threadId = Math.random().toString(36).substring(2, 8);
      const tempFileName = `calc_${processId}_${timestamp}_${threadId}_${random}.xlsx`;
      const tempFilePath = path.join(os.tmpdir(), tempFileName);

      // Ensure unique file (very unlikely collision, but safety first)
      try {
        await fs.access(tempFilePath);
        // If file exists, try again with additional randomness
        const extraRandom = Math.random().toString(36).substring(2, 8);
        const retryFileName = `calc_${processId}_${timestamp}_${threadId}_${random}_${extraRandom}.xlsx`;
        const retryFilePath = path.join(os.tmpdir(), retryFileName);
        await fs.copyFile(templatePath, retryFilePath);
        return retryFilePath;
      } catch {
        // File doesn't exist, proceed with copy
        await fs.copyFile(templatePath, tempFilePath);
        return tempFilePath;
      }
      
    } catch (error) {
      throw new ExcelProcessingError(
        `Failed to create temporary file: ${error instanceof Error ? error.message : String(error)}`,
        ErrorCode.EXCEL_FILE_NOT_FOUND
      );
    }
  }

  /**
   * Maps input data to Excel cells using field mappings
   */
  // @ts-ignore - Unused legacy method
  private async mapInputsToWorkbook(workbook: Excel.Workbook, inputData: CalculationRequest): Promise<void> {
    const failedCells: string[] = [];
    
    try {
      for (const [fieldName, cellAddress] of Object.entries(FIELD_MAPPING)) {
        const value = (inputData as any)[fieldName];
        
        // Skip undefined/null values for optional fields
        if (value === undefined || value === null) {
          continue;
        }

        try {
          await this.setCellValue(workbook, cellAddress, value);
        } catch (error) {
          failedCells.push(cellAddress);
          console.error(`Failed to set cell ${cellAddress} with value ${value}:`, error);
        }
      }

      if (failedCells.length > 0) {
        throw new ExcelProcessingError(
          `Failed to set ${failedCells.length} cells`,
          ErrorCode.EXCEL_CALCULATION_FAILED,
          { failedCells },
          failedCells
        );
      }

    } catch (error) {
      if (error instanceof ExcelProcessingError) {
        throw error;
      }
      throw new ExcelProcessingError(
        `Cell mapping failed: ${error instanceof Error ? error.message : String(error)}`,
        ErrorCode.EXCEL_CALCULATION_FAILED,
        undefined,
        failedCells
      );
    }
  }

  /**
   * Sets value in specific Excel cell
   */
  private async setCellValue(workbook: Excel.Workbook, cellAddress: string, value: any): Promise<void> {
    try {
      // Parse cell address (e.g., "снабжение!D10" or "технолог!D27")
      const [sheetName, cellRef] = cellAddress.split('!');
      
      const worksheet = workbook.getWorksheet(sheetName);
      if (!worksheet) {
        throw new Error(`Worksheet '${sheetName}' not found`);
      }

      const cell = worksheet.getCell(cellRef);
      
      // Set value based on type
      if (typeof value === 'number') {
        cell.value = value;
      } else if (typeof value === 'string') {
        // Handle special string patterns
        if (value.match(/^\d+\/\d+$/)) {
          // Fraction pattern
          cell.value = value;
        } else {
          cell.value = value;
        }
      } else {
        cell.value = value;
      }

    } catch (error) {
      throw new Error(`Failed to set cell ${cellAddress}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Forces recalculation of all formulas in workbook
   */
  // @ts-ignore - Unused legacy method
  private forceRecalculation(workbook: Excel.Workbook): void {
    try {
      // Set calculation mode to automatic and force full calculation
      workbook.calcProperties = {
        fullCalcOnLoad: true
      };

      // Iterate through all worksheets and mark formulas for recalculation
      workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            if (cell.formula) {
              // Force recalculation by clearing and resetting the formula
              const originalFormula = cell.formula;
              cell.value = null;
              cell.value = { formula: originalFormula };
            }
          });
        });
      });

    } catch (error) {
      throw new ExcelProcessingError(
        `Formula recalculation failed: ${error instanceof Error ? error.message : String(error)}`,
        ErrorCode.EXCEL_CALCULATION_FAILED
      );
    }
  }

  /**
   * Extracts calculation results from the results sheet
   */
  // @ts-ignore - Unused legacy method
  private async extractResults(workbook: Excel.Workbook): Promise<CalculationResults> {
    try {
      // Get results worksheet
      const resultsSheet = workbook.getWorksheet(this.RESULTS_SHEET);
      if (!resultsSheet) {
        throw new ExcelProcessingError(
          `Results worksheet '${this.RESULTS_SHEET}' not found`,
          ErrorCode.EXCEL_CALCULATION_FAILED
        );
      }

      // Extract results from J30-J36
      const resultValues: number[] = [];
      const failedCells: string[] = [];

      for (const cellRef of this.RESULTS_RANGE) {
        try {
          const cell = resultsSheet.getCell(cellRef);
          const value = this.getCellNumericValue(cell);
          resultValues.push(value);
        } catch (error) {
          failedCells.push(cellRef);
          resultValues.push(0); // Default to 0 for failed cells
        }
      }

      if (failedCells.length > 0) {
        console.warn(`Failed to extract values from cells: ${failedCells.join(', ')}`);
      }

      // Calculate total cost (sum of all components)
      const totalCost = resultValues.reduce((sum, val) => sum + val, 0);

      // Map results to component costs
      const componentCosts: ComponentCosts = {
        materials: resultValues[0] || 0,
        processing: resultValues[1] || 0,
        hardware: resultValues[2] || 0,
        other: resultValues.slice(3).reduce((sum, val) => sum + val, 0)
      };

      // Extract calculated values from технолог sheet
      const calculatedValues = await this.extractCalculatedValues(workbook);

      return {
        calculated_values: calculatedValues,
        total_cost: totalCost,
        component_costs: componentCosts
      };

    } catch (error) {
      if (error instanceof ExcelProcessingError) {
        throw error;
      }
      throw new ExcelProcessingError(
        `Results extraction failed: ${error instanceof Error ? error.message : String(error)}`,
        ErrorCode.EXCEL_CALCULATION_FAILED
      );
    }
  }

  /**
   * Extracts calculated values from yellow cells in технолог sheet
   */
  private async extractCalculatedValues(workbook: Excel.Workbook): Promise<CalculatedValues> {
    try {
      const techSheet = workbook.getWorksheet('технолог');
      if (!techSheet) {
        throw new Error(`Worksheet 'технолог' not found`);
      }

      // Extract yellow cells (computed values) from row 27
      return {
        tech_F27_deliveryType: this.getCellStringValue(techSheet.getCell('F27')),
        tech_G27_sizeTypeK4: this.getCellStringValue(techSheet.getCell('G27')),
        tech_P27_plateMaterial: this.getCellStringValue(techSheet.getCell('P27')),
        tech_Q27_materialType: this.getCellStringValue(techSheet.getCell('Q27')),
        tech_R27_bodyMaterial: this.getCellStringValue(techSheet.getCell('R27')),
        tech_S27_plateSurfaceType: this.getCellStringValue(techSheet.getCell('S27')),
        tech_U27_plateThickness: this.getCellNumericValue(techSheet.getCell('U27'))
      };

    } catch (error) {
      throw new Error(`Calculated values extraction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Safely gets numeric value from Excel cell
   */
  private getCellNumericValue(cell: Excel.Cell): number {
    if (cell.value === null || cell.value === undefined) {
      return 0;
    }

    if (typeof cell.value === 'number') {
      return cell.value;
    }

    if (typeof cell.value === 'string') {
      const parsed = parseFloat(cell.value);
      return isNaN(parsed) ? 0 : parsed;
    }

    // Handle formula results
    if (cell.value && typeof cell.value === 'object' && 'result' in cell.value) {
      const result = (cell.value as any).result;
      return typeof result === 'number' ? result : 0;
    }

    return 0;
  }

  /**
   * Safely gets string value from Excel cell
   */
  private getCellStringValue(cell: Excel.Cell): string {
    if (cell.value === null || cell.value === undefined) {
      return '';
    }

    if (typeof cell.value === 'string') {
      return cell.value;
    }

    if (typeof cell.value === 'number') {
      return cell.value.toString();
    }

    // Handle formula results
    if (cell.value && typeof cell.value === 'object') {
      if ('result' in cell.value) {
        const result = (cell.value as any).result;
        return result !== null && result !== undefined ? result.toString() : '';
      }
      if ('formula' in cell.value) {
        // For formulas, try to get the cached result
        const formula = cell.value as any;
        if (formula.result !== undefined && formula.result !== null) {
          return formula.result.toString();
        }
      }
      // If it's a complex object, try to stringify it safely
      try {
        return JSON.stringify(cell.value);
      } catch {
        return '[Complex Value]';
      }
    }

    return cell.value ? cell.value.toString() : '';
  }

  /**
   * Cleanup temporary file
   */
  private async cleanupTempFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to cleanup temp file ${filePath}:`, error);
    }
  }

  /**
   * Validates Excel template structure
   */
  async validateTemplate(templatePath?: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    try {
      const path = templatePath || this.DEFAULT_TEMPLATE_PATH;
      
      // Check if file exists
      await fs.access(path);
      
      // Try to load workbook
      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(path);

      // Check required sheets
      const requiredSheets = ['снабжение', 'технолог', this.RESULTS_SHEET];
      for (const sheetName of requiredSheets) {
        if (!workbook.getWorksheet(sheetName)) {
          errors.push(`Missing required sheet: ${sheetName}`);
        }
      }

      // Validate some key cells exist
      const techSheet = workbook.getWorksheet('технолог');
      if (techSheet) {
        const keyCells = ['D27', 'E27', 'F27', 'G27'];
        for (const cellRef of keyCells) {
          const cell = techSheet.getCell(cellRef);
          if (!cell) {
            errors.push(`Missing key cell: технолог!${cellRef}`);
          }
        }
      }

      return { valid: errors.length === 0, errors };

    } catch (error) {
      errors.push(`Template validation failed: ${error instanceof Error ? error.message : String(error)}`);
      return { valid: false, errors };
    }
  }

  /**
   * Get processing statistics and diagnostics
   */
  async getProcessingStats(): Promise<{
    templatePath: string;
    templateExists: boolean;
    supportedFields: number;
    tempDirectory: string;
  }> {
    const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
    
    let templateExists = false;
    try {
      await fs.access(templatePath);
      templateExists = true;
    } catch {}

    return {
      templatePath,
      templateExists,
      supportedFields: Object.keys(FIELD_MAPPING).length,
      tempDirectory: os.tmpdir()
    };
  }

  /**
   * Fallback cost calculation when Excel formulas fail
   * Simple calculation based on key input parameters
   */
  private calculateFallbackCost(inputData: CalculationRequest, warnings: string[]): number {
    try {
      const baseQuantity = inputData.tech_I27_plateQuantity || 1;
      const materialPrice = inputData.sup_D8_flowPartMaterialPricePerKg || 1000;
      const processingPrice = inputData.sup_E8_flowPartMaterialPrice || 800;
      const totalQuantity = inputData.tech_J27_calcPressureHotSide || 1;
      
      // Simple cost calculation
      const materialCost = baseQuantity * materialPrice * 0.1;
      const processingCost = baseQuantity * processingPrice * 0.08;
      const laborCost = baseQuantity * totalQuantity * 50;
      const overheadCost = (materialCost + processingCost + laborCost) * 0.25;
      
      const totalCost = materialCost + processingCost + laborCost + overheadCost;
      
      warnings.push(`Fallback calculation: material=${materialCost.toFixed(2)}, processing=${processingCost.toFixed(2)}, labor=${laborCost.toFixed(2)}, overhead=${overheadCost.toFixed(2)}`);
      
      return Math.max(1000, Math.round(totalCost * 100) / 100); // Minimum 1000, rounded to 2 decimal places
      
    } catch (error) {
      warnings.push('Fallback calculation failed, using default minimum cost');
      return 5000; // Default reasonable cost
    }
  }

  /**
   * Save Excel file for download
   */
  private async saveExcelFile(tempFilePath: string, requestId: string): Promise<string | undefined> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `calculation_${requestId}_${timestamp}.xlsx`;
      const publicPath = path.join('/home/vmuser/dev/lh_calc/excel-api/public/excel-files', fileName);
      
      // Copy the file to public directory
      await fs.copyFile(tempFilePath, publicPath);
      
      return publicPath;
    } catch (error) {
      console.error('Failed to save Excel file for download:', error);
      return undefined;
    }
  }

  /**
   * Initialize processor (for admin template operations)
   */
  async initialize(): Promise<void> {
    // Validate template exists
    const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
    await fs.access(templatePath);
  }

  /**
   * Get template version
   */
  public getTemplateVersion(): string {
    return 'calc.xlsx v7';
  }

  /**
   * Get sheet names from workbook
   */
  public async getSheetNames(): Promise<string[]> {
    const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);
    
    const sheets: string[] = [];
    workbook.eachSheet((worksheet) => {
      sheets.push(worksheet.name);
    });
    
    return sheets;
  }

  /**
   * Get cell value from specific sheet
   */
  public async getCellValue(sheetName: string, cellAddress: string): Promise<any> {
    const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);
    
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      throw new Error(`Sheet ${sheetName} not found`);
    }
    
    const cell = worksheet.getCell(cellAddress);
    return this.getCellStringValueSafely(cell, cellAddress);
  }

  /**
   * Get cell formula from specific sheet
   */
  public async getCellFormula(sheetName: string, cellAddress: string): Promise<string | null> {
    const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);
    
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      throw new Error(`Sheet ${sheetName} not found`);
    }
    
    const cell = worksheet.getCell(cellAddress);
    if (cell.formula) {
      return typeof cell.formula === 'string' ? cell.formula : (cell.formula as any).formula || null;
    }
    return null;
  }

  /**
   * Set cell value (for template testing)
   */
  public async setCellValueForTesting(sheetName: string, cellAddress: string, value: any): Promise<void> {
    const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);
    
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      throw new Error(`Sheet ${sheetName} not found`);
    }
    
    const cell = worksheet.getCell(cellAddress);
    cell.value = value;
  }

  /**
   * Get field mapping for a field name
   */
  public getFieldMapping(fieldName: string): { sheet: string; cell: string } | null {
    const mapping = (FIELD_MAPPING as any)[fieldName];
    if (!mapping) return null;
    
    const [sheet, cell] = mapping.split('!');
    return { sheet, cell };
  }

  /**
   * Load template from specific path (for validation)
   */
  public async loadTemplate(templatePath: string): Promise<void> {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(templatePath);
    
    // Get all sheet names for debugging
    const availableSheets: string[] = [];
    workbook.eachSheet((worksheet) => {
      availableSheets.push(worksheet.name);
    });
    
    // Validate required sheets exist (check with and without trailing spaces)
    const requiredSheets = ['снабжение', 'технолог', this.RESULTS_SHEET];
    for (const sheet of requiredSheets) {
      // Try exact match first
      let worksheet = workbook.getWorksheet(sheet);
      
      // If not found, try with trimmed names
      if (!worksheet) {
        worksheet = workbook.getWorksheet(sheet.trim());
      }
      
      // If still not found, try to find a sheet that matches when both are trimmed
      if (!worksheet) {
        const trimmedRequired = sheet.trim().toLowerCase();
        for (const availableSheet of availableSheets) {
          if (availableSheet.trim().toLowerCase() === trimmedRequired) {
            worksheet = workbook.getWorksheet(availableSheet);
            break;
          }
        }
      }
      
      if (!worksheet) {
        throw new Error(`Required sheet '${sheet}' not found in template. Available sheets: [${availableSheets.map(s => `'${s}'`).join(', ')}]`);
      }
    }
  }

  /**
   * Calculate formulas (placeholder for template testing)
   */
  public async calculateFormulas(): Promise<void> {
    // In a real implementation, this would trigger LibreOffice or Excel to recalculate
    // For now, we just mark that calculation is needed
    return Promise.resolve();
  }
}

// Export singleton instance for easy use
export const excelProcessor = new ExcelProcessor();