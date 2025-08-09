/**
 * Excel Processing Engine for Heat Exchanger Cost Calculations
 * Handles Excel template processing with field mapping and formula calculation
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
import { FIELD_MAPPING } from '../../../excel-processor/field-names-contract';

export interface ProcessingOptions {
  templatePath?: string;
  keepTempFiles?: boolean;
  maxProcessingTime?: number;
}

export interface ProcessingResult {
  success: boolean;
  results?: CalculationResults;
  error?: string;
  processingTimeMs: number;
  tempFilePath?: string;
}

export class ExcelProcessingError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: any,
    public failedCells?: string[]
  ) {
    super(message);
    this.name = 'ExcelProcessingError';
  }
}

export class ExcelProcessor {
  private readonly DEFAULT_TEMPLATE_PATH = '/home/vmuser/dev/lh_calc/calc.xlsx';
  private readonly RESULTS_SHEET = 'результат ';
  private readonly RESULTS_RANGE = ['J30', 'J31', 'J32', 'J33', 'J34', 'J35', 'J36'];
  
  constructor(private options: ProcessingOptions = {}) {}

  /**
   * Main processing method - accepts input data and returns calculation results
   */
  async processCalculation(inputData: CalculationRequest): Promise<ProcessingResult> {
    const startTime = Date.now();
    let tempFilePath: string | undefined;

    try {
      // Create temporary copy of template
      tempFilePath = await this.createTempFile();
      
      // Load workbook
      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(tempFilePath);

      // Map input data to cells
      await this.mapInputsToWorkbook(workbook, inputData);

      // Force recalculation
      this.forceRecalculation(workbook);

      // Save workbook to trigger formula calculation
      await workbook.xlsx.writeFile(tempFilePath);
      
      // Reload to get calculated values
      await workbook.xlsx.readFile(tempFilePath);

      // Extract results
      const results = await this.extractResults(workbook);

      const processingTime = Date.now() - startTime;

      // Cleanup temp file unless keepTempFiles is set
      if (!this.options.keepTempFiles && tempFilePath) {
        await this.cleanupTempFile(tempFilePath);
        tempFilePath = undefined;
      }

      return {
        success: true,
        results,
        processingTimeMs: processingTime,
        tempFilePath: this.options.keepTempFiles ? tempFilePath : undefined
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      // Cleanup on error
      if (tempFilePath && !this.options.keepTempFiles) {
        await this.cleanupTempFile(tempFilePath).catch(() => {});
      }

      if (error instanceof ExcelProcessingError) {
        return {
          success: false,
          error: error.message,
          processingTimeMs: processingTime,
          tempFilePath: this.options.keepTempFiles ? tempFilePath : undefined
        };
      }

      return {
        success: false,
        error: `Unexpected processing error: ${error instanceof Error ? error.message : String(error)}`,
        processingTimeMs: processingTime
      };
    }
  }

  /**
   * Creates temporary copy of Excel template
   */
  private async createTempFile(): Promise<string> {
    try {
      const templatePath = this.options.templatePath || this.DEFAULT_TEMPLATE_PATH;
      
      // Check if template exists
      await fs.access(templatePath);
      
      // Generate unique temp filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const tempFileName = `calc_${timestamp}_${random}.xlsx`;
      const tempFilePath = path.join(os.tmpdir(), tempFileName);

      // Copy template to temp location
      await fs.copyFile(templatePath, tempFilePath);
      
      return tempFilePath;
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
        tech_F27_quantityType: this.getCellStringValue(techSheet.getCell('F27')),
        tech_G27_quantityType: this.getCellStringValue(techSheet.getCell('G27')),
        tech_P27_materialType: this.getCellStringValue(techSheet.getCell('P27')),
        tech_Q27_materialType: this.getCellStringValue(techSheet.getCell('Q27')),
        tech_R27_materialThicknessType: this.getCellStringValue(techSheet.getCell('R27')),
        tech_S27_materialThicknessType: this.getCellStringValue(techSheet.getCell('S27')),
        tech_U27_materialThicknessType: this.getCellNumericValue(techSheet.getCell('U27'))
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
}

// Export singleton instance for easy use
export const excelProcessor = new ExcelProcessor();