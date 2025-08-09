"use strict";
/**
 * Excel Processing Engine for Heat Exchanger Cost Calculations
 * Handles Excel template processing with comprehensive error handling
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelProcessor = exports.ExcelProcessor = exports.ExcelProcessingError = void 0;
const Excel = __importStar(require("exceljs"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const api_contract_1 = require("../types/api-contract");
const field_mapping_1 = require("../constants/field-mapping");
const custom_errors_1 = require("../errors/custom-errors");
const error_logger_1 = require("../services/error-logger");
// Legacy error class - replaced by comprehensive error system
class ExcelProcessingError extends custom_errors_1.ExcelApiError {
    constructor(message, code, details, failedCells) {
        super(message, custom_errors_1.ErrorType.PROCESSING_ERROR, custom_errors_1.ErrorSeverity.HIGH, { code, details, failedCells }, false);
        this.code = code;
        this.details = details;
        this.failedCells = failedCells;
        this.name = 'ExcelProcessingError';
    }
}
exports.ExcelProcessingError = ExcelProcessingError;
class ExcelProcessor {
    constructor(options = {}) {
        this.options = options;
        this.DEFAULT_TEMPLATE_PATH = '/home/vmuser/dev/lh_calc/calc.xlsx';
        this.RESULTS_SHEET = 'результат ';
        this.RESULTS_RANGE = ['J30', 'J31', 'J32', 'J33', 'J34', 'J35', 'J36'];
        this.activeProcesses = new Set();
        this.memoryUsageTracker = new Map();
        this.errorLogger = new error_logger_1.ErrorLogger();
    }
    /**
     * Main processing method with comprehensive error handling
     * Handles all edge cases from Excel formula calculations
     */
    async processCalculation(inputData) {
        const processId = `proc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const maxRetries = this.options.maxRetries || 2;
        const retryDelay = this.options.retryDelayMs || 100;
        const maxProcessingTime = this.options.maxProcessingTime || 30000;
        let lastError;
        const warnings = [];
        // Track active process for concurrency control
        if (this.activeProcesses.has(processId)) {
            throw new custom_errors_1.ConcurrentAccessError(`Process ${processId} already active`);
        }
        this.activeProcesses.add(processId);
        try {
            // Memory usage tracking
            const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024; // MB
            this.memoryUsageTracker.set(processId, initialMemory);
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                const startTime = Date.now();
                let tempFilePath;
                let timeoutHandle;
                try {
                    // Set up processing timeout
                    const timeoutPromise = new Promise((_, reject) => {
                        timeoutHandle = setTimeout(() => {
                            reject(new custom_errors_1.TimeoutError('Excel processing', maxProcessingTime, { processId, attempt }));
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
                        throw new custom_errors_1.MemoryExhaustionError(currentMemory, memoryLimit, { processId });
                    }
                    // Process with timeout protection
                    const processingPromise = this.performCalculation(inputData, processId, warnings);
                    const result = await Promise.race([processingPromise, timeoutPromise]);
                    // Clear timeout
                    if (timeoutHandle) {
                        clearTimeout(timeoutHandle);
                    }
                    const processingTime = Date.now() - startTime;
                    return {
                        success: true,
                        results: result.results,
                        processingTimeMs: processingTime,
                        tempFilePath: this.options.keepTempFiles ? result.tempFilePath : undefined,
                        warnings: warnings.length > 0 ? warnings : undefined
                    };
                }
                catch (error) {
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
        }
        finally {
            // Cleanup tracking
            this.activeProcesses.delete(processId);
            this.memoryUsageTracker.delete(processId);
        }
    }
    /**
     * Core calculation logic separated for timeout handling
     */
    async performCalculation(inputData, processId, warnings) {
        let tempFilePath;
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
            const results = await this.extractResultsSafely(workbook, warnings);
            // Final validation of results
            this.validateCalculationResults(results, warnings);
            // Cleanup temp file unless keepTempFiles is set
            if (!this.options.keepTempFiles && tempFilePath) {
                await this.cleanupTempFile(tempFilePath);
                tempFilePath = undefined;
            }
            return {
                results,
                tempFilePath: this.options.keepTempFiles ? tempFilePath : undefined
            };
        }
        catch (error) {
            // Cleanup on error
            if (tempFilePath && !this.options.keepTempFiles) {
                await this.cleanupTempFile(tempFilePath).catch(() => { });
            }
            throw error;
        }
    }
    /**
     * Comprehensive input data validation to prevent edge cases
     */
    async validateInputData(inputData, warnings) {
        try {
            // Check for null/undefined required fields
            const requiredNumericFields = ['tech_D27_type', 'tech_I27_quantityType', 'tech_J27_quantityType'];
            for (const field of requiredNumericFields) {
                const value = inputData[field];
                if (value === null || value === undefined) {
                    throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.MISSING_REQUIRED_FIELDS, `Required field ${field} is missing`, {
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
        }
        catch (error) {
            if (error instanceof custom_errors_1.ExcelApiError) {
                throw error;
            }
            throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.VALIDATION_ERROR, `Input validation failed: ${error instanceof Error ? error.message : String(error)}`, { originalError: error });
        }
    }
    async validateNumericFields(inputData, warnings) {
        const numericFields = [
            { field: 'tech_D27_type', min: 0, max: 1000000 },
            { field: 'tech_I27_quantityType', min: 0, max: 1000000 },
            { field: 'tech_J27_quantityType', min: 0, max: 1000000 },
            { field: 'sup_D8_priceMaterial', min: 0, max: 1000000000 }
        ];
        for (const { field, min, max } of numericFields) {
            const value = inputData[field];
            if (value !== undefined && value !== null) {
                // Check for division by zero scenarios
                if (field === 'tech_I27_quantityType' && value === 0) {
                    throw new custom_errors_1.DivisionByZeroError(field, value, {
                        affectedCells: ['снабжение!E7', 'снабжение!F7']
                    });
                }
                // Check for numeric overflow
                if (typeof value === 'number' && (value > max || value < min)) {
                    if (value > max) {
                        throw new custom_errors_1.NumericOverflowError(field, value);
                    }
                    else {
                        throw new custom_errors_1.NumericUnderflowError(field, value);
                    }
                }
                // Check for infinity and NaN
                if (typeof value === 'number' && (!isFinite(value) || isNaN(value))) {
                    throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.INVALID_NUMBER, `Invalid number in field ${field}: ${value}`, { field, value });
                }
                // Check for precision issues
                if (typeof value === 'number' && value > 0 && value < 1e-10) {
                    warnings.push(`Very small number in ${field} may cause precision issues: ${value}`);
                }
            }
        }
    }
    async validateStringFields(inputData, warnings) {
        const stringFields = ['tech_E27_weightType', 'tech_H27_quantityType'];
        for (const field of stringFields) {
            const value = inputData[field];
            if (value && typeof value === 'string') {
                // Check string length
                if (value.length > 1000) {
                    throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.STRING_LENGTH_EXCEEDED, `String too long in field ${field}`, { field, length: value.length, maxLength: 1000 });
                }
                // Check for control characters
                if (/[\x00-\x1F\x7F-\x9F]/.test(value)) {
                    throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.CONTROL_CHARACTERS, `Control characters detected in field ${field}`, { field, value: '[REDACTED]' });
                }
                // Validate equipment code pattern
                if (field === 'tech_E27_weightType' && !/^[ЕК][-0-9А-Я*]*$/.test(value)) {
                    warnings.push(`Equipment code pattern may be invalid: ${value}`);
                }
                // Validate fraction pattern
                if (field === 'tech_H27_quantityType' && value.includes('/')) {
                    if (!/^\d+\/\d+$/.test(value)) {
                        throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.INVALID_PATTERN, `Invalid fraction pattern in field ${field}`, { field, value, pattern: '^\\d+/\\d+$' });
                    }
                    // Check for division by zero in fractions
                    const [, denominator] = value.split('/');
                    if (parseInt(denominator) === 0) {
                        throw new custom_errors_1.DivisionByZeroError(field, denominator);
                    }
                }
            }
        }
    }
    async validateBusinessLogic(inputData, warnings) {
        // Validate material and temperature combinations
        if (inputData.sup_F2_parameter && inputData.tech_L27_quantity) {
            const material = inputData.sup_F2_parameter;
            const temperature = inputData.tech_L27_quantity;
            // Check material temperature limits
            const materialLimits = {
                '09Г2С': { min: -40, max: 475 },
                '12Х18Н10Т': { min: -253, max: 600 },
                '20ХН3А': { min: -40, max: 400 }
            };
            const limits = materialLimits[material];
            if (limits && (temperature < limits.min || temperature > limits.max)) {
                throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.MATERIAL_PROPERTY_ERROR, `Temperature ${temperature}°C exceeds limits for material ${material}`, { material, property: 'temperature', value: temperature });
            }
        }
        // Validate pressure and diameter combinations
        if (inputData.sup_C28_priceWeightThickness && inputData.sup_D28_priceWeightThickness) {
            const pressure = inputData.sup_C28_priceWeightThickness;
            const diameter = inputData.sup_D28_priceWeightThickness;
            // Engineering constraints validation
            const incompatibleCombinations = [
                { pressure: 'Ру160', diameter: 'Ду25' },
                { pressure: 'Ру160', diameter: 'Ду32' }
            ];
            const isIncompatible = incompatibleCombinations.some(combo => combo.pressure === pressure && combo.diameter === diameter);
            if (isIncompatible) {
                throw new EngineeringConstraintError('Pressure rating incompatible with diameter', { pressure, diameter });
            }
        }
    }
    /**
     * Create temporary file with integrity validation
     */
    async createTempFileWithValidation() {
        try {
            const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
            // Check if template exists and is accessible
            await fs_1.promises.access(templatePath, fs_1.promises.constants.R_OK);
            // Optional file integrity check
            if (this.options.enableFileIntegrityCheck) {
                const stats = await fs_1.promises.stat(templatePath);
                if (stats.size === 0) {
                    throw new custom_errors_1.FileCorruptionError(templatePath, { reason: 'Empty file' });
                }
            }
            return await this.createTempFileSecurely(templatePath);
        }
        catch (error) {
            if (error instanceof custom_errors_1.ExcelApiError) {
                throw error;
            }
            throw new custom_errors_1.FileCorruptionError(this.options.templatePath || this.DEFAULT_TEMPLATE_PATH, { originalError: error instanceof Error ? error.message : String(error) });
        }
    }
    async createTempFileSecurely(templatePath) {
        const timestamp = Date.now();
        const processId = process.pid;
        const random = Math.random().toString(36).substring(2, 15);
        const threadId = Math.random().toString(36).substring(2, 8);
        const tempFileName = `calc_${processId}_${timestamp}_${threadId}_${random}.xlsx`;
        const tempFilePath = path.join(os.tmpdir(), tempFileName);
        // Ensure unique file (very unlikely collision, but safety first)
        try {
            await fs_1.promises.access(tempFilePath);
            // If file exists, try again with additional randomness
            const extraRandom = Math.random().toString(36).substring(2, 8);
            const retryFileName = `calc_${processId}_${timestamp}_${threadId}_${random}_${extraRandom}.xlsx`;
            const retryFilePath = path.join(os.tmpdir(), retryFileName);
            await fs_1.promises.copyFile(templatePath, retryFilePath);
            return retryFilePath;
        }
        catch {
            // File doesn't exist, proceed with copy
            await fs_1.promises.copyFile(templatePath, tempFilePath);
            return tempFilePath;
        }
    }
    /**
     * Load workbook with corruption detection
     */
    async loadWorkbookSafely(filePath) {
        try {
            const workbook = new Excel.Workbook();
            await workbook.xlsx.readFile(filePath);
            // Basic integrity checks
            const requiredSheets = ['снабжение', 'технолог', this.RESULTS_SHEET];
            for (const sheetName of requiredSheets) {
                if (!workbook.getWorksheet(sheetName)) {
                    throw new custom_errors_1.FileCorruptionError(filePath, {
                        reason: `Missing required sheet: ${sheetName}`
                    });
                }
            }
            return workbook;
        }
        catch (error) {
            if (error instanceof custom_errors_1.ExcelApiError) {
                throw error;
            }
            throw new custom_errors_1.FileCorruptionError(filePath, {
                reason: 'Failed to load workbook',
                originalError: error instanceof Error ? error.message : String(error)
            });
        }
    }
    normalizeProcessingError(error, processId, attempt) {
        if (error instanceof custom_errors_1.ExcelApiError) {
            return error;
        }
        const errorMessage = error.message?.toLowerCase() || String(error).toLowerCase();
        // Pattern matching for different error types
        if (errorMessage.includes('eacces') || errorMessage.includes('permission denied')) {
            return new custom_errors_1.FileLockError('Excel template file', { processId, attempt });
        }
        if (errorMessage.includes('emfile') || errorMessage.includes('too many open files')) {
            return new custom_errors_1.ConcurrentAccessError('File handles', { processId, attempt });
        }
        if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
            return new custom_errors_1.TimeoutError('Excel processing', 30000, { processId, attempt });
        }
        return custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.PROCESSING_ERROR, error instanceof Error ? error.message : String(error), { processId, attempt, originalError: error });
    }
    shouldRetryError(error) {
        const retryableTypes = [
            custom_errors_1.ErrorType.CONCURRENT_ACCESS_ERROR,
            custom_errors_1.ErrorType.FILE_LOCKED_ERROR,
            custom_errors_1.ErrorType.TIMEOUT_ERROR
        ];
        return retryableTypes.includes(error.type) && error.recoverable;
    }
    /**
     * Enhanced mapping with comprehensive error detection
     */
    async mapInputsToWorkbookSafely(workbook, inputData, warnings) {
        const failedCells = [];
        const divisionByZeroRisks = [];
        try {
            for (const [fieldName, cellAddress] of Object.entries(field_mapping_1.FIELD_MAPPING)) {
                const value = inputData[fieldName];
                // Skip undefined/null values for optional fields
                if (value === undefined || value === null) {
                    continue;
                }
                try {
                    // Pre-validate problematic values
                    if (typeof value === 'number' && value === 0) {
                        // Check if this field could cause division by zero
                        if (fieldName === 'tech_I27_quantityType') {
                            divisionByZeroRisks.push(cellAddress);
                            warnings.push(`Zero value in ${fieldName} may cause division by zero in Excel formulas`);
                        }
                    }
                    await this.setCellValueSafely(workbook, cellAddress, value, fieldName);
                }
                catch (error) {
                    failedCells.push(cellAddress);
                    await this.errorLogger.logError(custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.PROCESSING_ERROR, `Failed to set cell ${cellAddress}`, { field: fieldName, value, error: error instanceof Error ? error.message : String(error) }));
                }
            }
            if (failedCells.length > 0) {
                throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.PROCESSING_ERROR, `Failed to set ${failedCells.length} cells`, { failedCells, divisionByZeroRisks });
            }
            if (divisionByZeroRisks.length > 0) {
                warnings.push(`${divisionByZeroRisks.length} cells may cause division by zero`);
            }
        }
        catch (error) {
            if (error instanceof custom_errors_1.ExcelApiError) {
                throw error;
            }
            throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.PROCESSING_ERROR, `Cell mapping failed: ${error instanceof Error ? error.message : String(error)}`, { failedCells });
        }
    }
    async setCellValueSafely(workbook, cellAddress, value, fieldName) {
        try {
            // Parse cell address (e.g., "снабжение!D10" or "технолог!D27")
            const [sheetName, cellRef] = cellAddress.split('!');
            const worksheet = workbook.getWorksheet(sheetName);
            if (!worksheet) {
                throw new custom_errors_1.FileCorruptionError(cellAddress, {
                    reason: `Worksheet '${sheetName}' not found`
                });
            }
            const cell = worksheet.getCell(cellRef);
            // Type-specific value setting with validation
            if (typeof value === 'number') {
                // Check for problematic numbers
                if (!isFinite(value)) {
                    throw new custom_errors_1.NumericOverflowError(fieldName, value);
                }
                if (isNaN(value)) {
                    throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.INVALID_NUMBER, `NaN value for field ${fieldName}`, { field: fieldName, value });
                }
                cell.value = value;
            }
            else if (typeof value === 'string') {
                // Validate string patterns
                if (value.match(/^\d+\/\d+$/)) {
                    // Fraction pattern - validate denominator
                    const [, denominator] = value.split('/');
                    if (parseInt(denominator) === 0) {
                        throw new custom_errors_1.DivisionByZeroError(fieldName, denominator);
                    }
                    cell.value = value;
                }
                else {
                    // Regular string
                    cell.value = value;
                }
            }
            else {
                cell.value = value;
            }
        }
        catch (error) {
            if (error instanceof custom_errors_1.ExcelApiError) {
                throw error;
            }
            throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.PROCESSING_ERROR, `Failed to set cell ${cellAddress}`, { cellAddress, fieldName, value, error: error instanceof Error ? error.message : String(error) });
        }
    }
    /**
     * Enhanced recalculation with formula error detection
     */
    async forceRecalculationSafely(workbook, warnings) {
        try {
            // Set calculation mode to automatic and force full calculation
            workbook.calcProperties = {
                fullCalcOnLoad: true
            };
            const formulaErrors = [];
            const potentialIssues = [];
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
                            }
                            catch (error) {
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
                throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.FORMULA_ERROR, `${formulaErrors.length} formula errors detected`, { formulaErrors });
            }
        }
        catch (error) {
            if (error instanceof custom_errors_1.ExcelApiError) {
                throw error;
            }
            throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.FORMULA_ERROR, `Formula recalculation failed: ${error instanceof Error ? error.message : String(error)}`, { originalError: error });
        }
    }
    getColumnLetter(colIndex) {
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
    async detectCircularReferences(workbook, warnings) {
        const cellDependencies = new Map();
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
            const visited = new Set();
            const recursionStack = new Set();
            const circularRefs = [];
            for (const [cellRef] of cellDependencies) {
                if (!visited.has(cellRef)) {
                    const path = [];
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
        }
        catch (error) {
            warnings.push(`Circular reference detection failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    extractCellReferences(formula) {
        // Simple regex to extract cell references - could be enhanced
        const cellRefPattern = /([A-Z]+[0-9]+)/g;
        const matches = formula.match(cellRefPattern) || [];
        return matches;
    }
    hasCircularReference(cellRef, dependencies, visited, recursionStack, path) {
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
    async saveAndReloadWorkbook(workbook, filePath) {
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
            }
            catch (error) {
                retryCount++;
                const errorMsg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
                if (errorMsg.includes('ebusy') || errorMsg.includes('locked')) {
                    if (retryCount >= maxRetries) {
                        throw new custom_errors_1.FileLockError(filePath, { retryCount });
                    }
                    // Wait longer on each retry
                    await new Promise(resolve => setTimeout(resolve, 200 * retryCount));
                    continue;
                }
                throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.PROCESSING_ERROR, `Failed to save/reload workbook: ${error instanceof Error ? error.message : String(error)}`, { filePath, retryCount });
            }
        }
    }
    /**
     * Enhanced results extraction with comprehensive validation
     */
    async extractResultsSafely(workbook, warnings) {
        try {
            // Get results worksheet
            const resultsSheet = workbook.getWorksheet(this.RESULTS_SHEET);
            if (!resultsSheet) {
                throw new custom_errors_1.FileCorruptionError(this.RESULTS_SHEET, {
                    reason: `Results worksheet '${this.RESULTS_SHEET}' not found`
                });
            }
            // Extract results from J30-J36 with error detection
            const resultValues = [];
            const failedCells = [];
            const formulaErrors = [];
            for (const cellRef of this.RESULTS_RANGE) {
                try {
                    const cell = resultsSheet.getCell(cellRef);
                    // Check for formula errors
                    if (cell.value && typeof cell.value === 'object') {
                        const cellValue = cell.value;
                        if (cellValue.error) {
                            formulaErrors.push(`${cellRef}: ${cellValue.error}`);
                            resultValues.push(0);
                            continue;
                        }
                    }
                    const value = this.getCellNumericValueSafely(cell, cellRef);
                    resultValues.push(value);
                }
                catch (error) {
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
            const totalCost = resultValues.reduce((sum, val) => sum + val, 0);
            // Validate total cost is reasonable
            if (totalCost < 0) {
                warnings.push('Total cost is negative - possible calculation error');
            }
            if (totalCost > 1e9) {
                warnings.push('Total cost is extremely high - possible overflow error');
            }
            // Map results to component costs
            const componentCosts = {
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
        }
        catch (error) {
            if (error instanceof custom_errors_1.ExcelApiError) {
                throw error;
            }
            throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.PROCESSING_ERROR, `Results extraction failed: ${error instanceof Error ? error.message : String(error)}`, { originalError: error });
        }
    }
    getCellNumericValueSafely(cell, cellRef) {
        if (cell.value === null || cell.value === undefined) {
            return 0;
        }
        if (typeof cell.value === 'number') {
            if (!isFinite(cell.value)) {
                throw new custom_errors_1.NumericOverflowError(cellRef, cell.value);
            }
            if (isNaN(cell.value)) {
                throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.INVALID_NUMBER, `NaN in cell ${cellRef}`, { cellRef });
            }
            return cell.value;
        }
        if (typeof cell.value === 'string') {
            const parsed = parseFloat(cell.value);
            if (isNaN(parsed)) {
                return 0;
            }
            if (!isFinite(parsed)) {
                throw new custom_errors_1.NumericOverflowError(cellRef, parsed);
            }
            return parsed;
        }
        // Handle formula results
        if (cell.value && typeof cell.value === 'object' && 'result' in cell.value) {
            const result = cell.value.result;
            if (typeof result === 'number') {
                if (!isFinite(result)) {
                    throw new custom_errors_1.NumericOverflowError(cellRef, result);
                }
                if (isNaN(result)) {
                    throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.INVALID_NUMBER, `NaN in formula result ${cellRef}`, { cellRef });
                }
                return result;
            }
        }
        return 0;
    }
    async extractCalculatedValuesSafely(workbook, warnings) {
        try {
            const techSheet = workbook.getWorksheet('технолог');
            if (!techSheet) {
                throw new custom_errors_1.FileCorruptionError('технолог', { reason: "Worksheet 'технолог' not found" });
            }
            // Extract yellow cells (computed values) from row 27 with validation
            const calculatedValues = {
                tech_F27_quantityType: this.getCellStringValueSafely(techSheet.getCell('F27'), 'F27'),
                tech_G27_quantityType: this.getCellStringValueSafely(techSheet.getCell('G27'), 'G27'),
                tech_P27_materialType: this.getCellStringValueSafely(techSheet.getCell('P27'), 'P27'),
                tech_Q27_materialType: this.getCellStringValueSafely(techSheet.getCell('Q27'), 'Q27'),
                tech_R27_materialThicknessType: this.getCellStringValueSafely(techSheet.getCell('R27'), 'R27'),
                tech_S27_materialThicknessType: this.getCellStringValueSafely(techSheet.getCell('S27'), 'S27'),
                tech_U27_materialThicknessType: this.getCellNumericValueSafely(techSheet.getCell('U27'), 'U27')
            };
            // Validate calculated values
            let emptyCount = 0;
            for (const [key, value] of Object.entries(calculatedValues)) {
                if (value === '' || value === 0) {
                    emptyCount++;
                }
            }
            if (emptyCount > 3) {
                warnings.push(`${emptyCount} calculated values are empty - possible calculation failure`);
            }
            return calculatedValues;
        }
        catch (error) {
            if (error instanceof custom_errors_1.ExcelApiError) {
                throw error;
            }
            throw custom_errors_1.ErrorFactory.create(custom_errors_1.ErrorType.PROCESSING_ERROR, `Calculated values extraction failed: ${error instanceof Error ? error.message : String(error)}`, { originalError: error });
        }
    }
    getCellStringValueSafely(cell, cellRef) {
        if (cell.value === null || cell.value === undefined) {
            return '';
        }
        if (typeof cell.value === 'string') {
            return cell.value;
        }
        if (typeof cell.value === 'number') {
            if (!isFinite(cell.value)) {
                throw new custom_errors_1.NumericOverflowError(cellRef, cell.value);
            }
            return cell.value.toString();
        }
        // Handle formula results
        if (cell.value && typeof cell.value === 'object') {
            if ('result' in cell.value) {
                const result = cell.value.result;
                if (result !== null && result !== undefined) {
                    if (typeof result === 'number' && !isFinite(result)) {
                        throw new custom_errors_1.NumericOverflowError(cellRef, result);
                    }
                    return result.toString();
                }
            }
            if ('formula' in cell.value) {
                const formula = cell.value;
                if (formula.result !== undefined && formula.result !== null) {
                    return formula.result.toString();
                }
            }
            // If it's a complex object, try to stringify it safely
            try {
                return JSON.stringify(cell.value);
            }
            catch {
                return '[Complex Value]';
            }
        }
        return cell.value ? cell.value.toString() : '';
    }
    /**
     * Final validation of calculation results
     */
    validateCalculationResults(results, warnings) {
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
    async createTempFile() {
        try {
            const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
            // Check if template exists
            await fs_1.promises.access(templatePath);
            // Generate highly unique temp filename for thread safety
            const timestamp = Date.now();
            const processId = process.pid;
            const random = Math.random().toString(36).substring(2, 15);
            const threadId = Math.random().toString(36).substring(2, 8);
            const tempFileName = `calc_${processId}_${timestamp}_${threadId}_${random}.xlsx`;
            const tempFilePath = path.join(os.tmpdir(), tempFileName);
            // Ensure unique file (very unlikely collision, but safety first)
            try {
                await fs_1.promises.access(tempFilePath);
                // If file exists, try again with additional randomness
                const extraRandom = Math.random().toString(36).substring(2, 8);
                const retryFileName = `calc_${processId}_${timestamp}_${threadId}_${random}_${extraRandom}.xlsx`;
                const retryFilePath = path.join(os.tmpdir(), retryFileName);
                await fs_1.promises.copyFile(templatePath, retryFilePath);
                return retryFilePath;
            }
            catch {
                // File doesn't exist, proceed with copy
                await fs_1.promises.copyFile(templatePath, tempFilePath);
                return tempFilePath;
            }
        }
        catch (error) {
            throw new ExcelProcessingError(`Failed to create temporary file: ${error instanceof Error ? error.message : String(error)}`, api_contract_1.ErrorCode.EXCEL_FILE_NOT_FOUND);
        }
    }
    /**
     * Maps input data to Excel cells using field mappings
     */
    async mapInputsToWorkbook(workbook, inputData) {
        const failedCells = [];
        try {
            for (const [fieldName, cellAddress] of Object.entries(field_mapping_1.FIELD_MAPPING)) {
                const value = inputData[fieldName];
                // Skip undefined/null values for optional fields
                if (value === undefined || value === null) {
                    continue;
                }
                try {
                    await this.setCellValue(workbook, cellAddress, value);
                }
                catch (error) {
                    failedCells.push(cellAddress);
                    console.error(`Failed to set cell ${cellAddress} with value ${value}:`, error);
                }
            }
            if (failedCells.length > 0) {
                throw new ExcelProcessingError(`Failed to set ${failedCells.length} cells`, api_contract_1.ErrorCode.EXCEL_CALCULATION_FAILED, { failedCells }, failedCells);
            }
        }
        catch (error) {
            if (error instanceof ExcelProcessingError) {
                throw error;
            }
            throw new ExcelProcessingError(`Cell mapping failed: ${error instanceof Error ? error.message : String(error)}`, api_contract_1.ErrorCode.EXCEL_CALCULATION_FAILED, undefined, failedCells);
        }
    }
    /**
     * Sets value in specific Excel cell
     */
    async setCellValue(workbook, cellAddress, value) {
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
            }
            else if (typeof value === 'string') {
                // Handle special string patterns
                if (value.match(/^\d+\/\d+$/)) {
                    // Fraction pattern
                    cell.value = value;
                }
                else {
                    cell.value = value;
                }
            }
            else {
                cell.value = value;
            }
        }
        catch (error) {
            throw new Error(`Failed to set cell ${cellAddress}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Forces recalculation of all formulas in workbook
     */
    forceRecalculation(workbook) {
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
        }
        catch (error) {
            throw new ExcelProcessingError(`Formula recalculation failed: ${error instanceof Error ? error.message : String(error)}`, api_contract_1.ErrorCode.EXCEL_CALCULATION_FAILED);
        }
    }
    /**
     * Extracts calculation results from the results sheet
     */
    async extractResults(workbook) {
        try {
            // Get results worksheet
            const resultsSheet = workbook.getWorksheet(this.RESULTS_SHEET);
            if (!resultsSheet) {
                throw new ExcelProcessingError(`Results worksheet '${this.RESULTS_SHEET}' not found`, api_contract_1.ErrorCode.EXCEL_CALCULATION_FAILED);
            }
            // Extract results from J30-J36
            const resultValues = [];
            const failedCells = [];
            for (const cellRef of this.RESULTS_RANGE) {
                try {
                    const cell = resultsSheet.getCell(cellRef);
                    const value = this.getCellNumericValue(cell);
                    resultValues.push(value);
                }
                catch (error) {
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
            const componentCosts = {
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
        }
        catch (error) {
            if (error instanceof ExcelProcessingError) {
                throw error;
            }
            throw new ExcelProcessingError(`Results extraction failed: ${error instanceof Error ? error.message : String(error)}`, api_contract_1.ErrorCode.EXCEL_CALCULATION_FAILED);
        }
    }
    /**
     * Extracts calculated values from yellow cells in технолог sheet
     */
    async extractCalculatedValues(workbook) {
        try {
            const techSheet = workbook.getWorksheet('технолог');
            if (!techSheet) {
                throw new Error(`Worksheet 'технолог' not found`);
            }
            // Extract yellow cells (computed values) from row 27
            return {
                tech_F27_quantityType: this.getCellStringValue(techSheet.getCell('F27')),
                tech_G27_quantityType: this.getCellStringValue(techSheet.getCell('G27')),
                tech_P27_materialType: this.getCellStringValue(techSheet.getCell('P27')),
                tech_Q27_materialType: this.getCellStringValue(techSheet.getCell('Q27')),
                tech_R27_materialThicknessType: this.getCellStringValue(techSheet.getCell('R27')),
                tech_S27_materialThicknessType: this.getCellStringValue(techSheet.getCell('S27')),
                tech_U27_materialThicknessType: this.getCellNumericValue(techSheet.getCell('U27'))
            };
        }
        catch (error) {
            throw new Error(`Calculated values extraction failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Safely gets numeric value from Excel cell
     */
    getCellNumericValue(cell) {
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
            const result = cell.value.result;
            return typeof result === 'number' ? result : 0;
        }
        return 0;
    }
    /**
     * Safely gets string value from Excel cell
     */
    getCellStringValue(cell) {
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
                const result = cell.value.result;
                return result !== null && result !== undefined ? result.toString() : '';
            }
            if ('formula' in cell.value) {
                // For formulas, try to get the cached result
                const formula = cell.value;
                if (formula.result !== undefined && formula.result !== null) {
                    return formula.result.toString();
                }
            }
            // If it's a complex object, try to stringify it safely
            try {
                return JSON.stringify(cell.value);
            }
            catch {
                return '[Complex Value]';
            }
        }
        return cell.value ? cell.value.toString() : '';
    }
    /**
     * Cleanup temporary file
     */
    async cleanupTempFile(filePath) {
        try {
            await fs_1.promises.unlink(filePath);
        }
        catch (error) {
            console.warn(`Failed to cleanup temp file ${filePath}:`, error);
        }
    }
    /**
     * Validates Excel template structure
     */
    async validateTemplate(templatePath) {
        const errors = [];
        try {
            const path = templatePath || this.DEFAULT_TEMPLATE_PATH;
            // Check if file exists
            await fs_1.promises.access(path);
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
        }
        catch (error) {
            errors.push(`Template validation failed: ${error instanceof Error ? error.message : String(error)}`);
            return { valid: false, errors };
        }
    }
    /**
     * Get processing statistics and diagnostics
     */
    async getProcessingStats() {
        const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
        let templateExists = false;
        try {
            await fs_1.promises.access(templatePath);
            templateExists = true;
        }
        catch { }
        return {
            templatePath,
            templateExists,
            supportedFields: Object.keys(field_mapping_1.FIELD_MAPPING).length,
            tempDirectory: os.tmpdir()
        };
    }
}
exports.ExcelProcessor = ExcelProcessor;
// Export singleton instance for easy use
exports.excelProcessor = new ExcelProcessor();
//# sourceMappingURL=excel-processor.js.map