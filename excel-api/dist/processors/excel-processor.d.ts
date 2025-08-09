/**
 * Excel Processing Engine for Heat Exchanger Cost Calculations
 * Handles Excel template processing with comprehensive error handling
 */
import { CalculationRequest, CalculationResults, ErrorCode } from '../types/api-contract';
import { ExcelApiError, ErrorType, ErrorSeverity } from '../errors/custom-errors';
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
    warnings?: string[];
    errorDetails?: {
        type: ErrorType;
        severity: ErrorSeverity;
        recoverable: boolean;
        failedCells?: string[];
        context?: any;
    };
}
export declare class ExcelProcessingError extends ExcelApiError {
    code: ErrorCode;
    details?: any | undefined;
    failedCells?: string[] | undefined;
    constructor(message: string, code: ErrorCode, details?: any | undefined, failedCells?: string[] | undefined);
}
export declare class ExcelProcessor {
    private options;
    private readonly DEFAULT_TEMPLATE_PATH;
    private readonly RESULTS_SHEET;
    private readonly RESULTS_RANGE;
    private readonly errorLogger;
    private readonly activeProcesses;
    private memoryUsageTracker;
    constructor(options?: ProcessingOptions);
    /**
     * Main processing method with comprehensive error handling
     * Handles all edge cases from Excel formula calculations
     */
    processCalculation(inputData: CalculationRequest): Promise<ProcessingResult>;
    /**
     * Core calculation logic separated for timeout handling
     */
    private performCalculation;
    /**
     * Comprehensive input data validation to prevent edge cases
     */
    private validateInputData;
    private validateNumericFields;
    private validateStringFields;
    private validateBusinessLogic;
    /**
     * Create temporary file with integrity validation
     */
    private createTempFileWithValidation;
    private createTempFileSecurely;
    /**
     * Load workbook with corruption detection
     */
    private loadWorkbookSafely;
    private normalizeProcessingError;
    private shouldRetryError;
    /**
     * Enhanced mapping with comprehensive error detection
     */
    private mapInputsToWorkbookSafely;
    private setCellValueSafely;
    /**
     * Enhanced recalculation with formula error detection
     */
    private forceRecalculationSafely;
    private getColumnLetter;
    /**
     * Detect circular references in formulas
     */
    private detectCircularReferences;
    private extractCellReferences;
    private hasCircularReference;
    /**
     * Enhanced save and reload with file lock detection
     */
    private saveAndReloadWorkbook;
    /**
     * Enhanced results extraction with comprehensive validation
     */
    private extractResultsSafely;
    private getCellNumericValueSafely;
    private extractCalculatedValuesSafely;
    private getCellStringValueSafely;
    /**
     * Final validation of calculation results
     */
    private validateCalculationResults;
    /**
     * Legacy createTempFile method (kept for compatibility)
     */
    private createTempFile;
    /**
     * Maps input data to Excel cells using field mappings
     */
    private mapInputsToWorkbook;
    /**
     * Sets value in specific Excel cell
     */
    private setCellValue;
    /**
     * Forces recalculation of all formulas in workbook
     */
    private forceRecalculation;
    /**
     * Extracts calculation results from the results sheet
     */
    private extractResults;
    /**
     * Extracts calculated values from yellow cells in технолог sheet
     */
    private extractCalculatedValues;
    /**
     * Safely gets numeric value from Excel cell
     */
    private getCellNumericValue;
    /**
     * Safely gets string value from Excel cell
     */
    private getCellStringValue;
    /**
     * Cleanup temporary file
     */
    private cleanupTempFile;
    /**
     * Validates Excel template structure
     */
    validateTemplate(templatePath?: string): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * Get processing statistics and diagnostics
     */
    getProcessingStats(): Promise<{
        templatePath: string;
        templateExists: boolean;
        supportedFields: number;
        tempDirectory: string;
    }>;
}
export declare const excelProcessor: ExcelProcessor;
//# sourceMappingURL=excel-processor.d.ts.map