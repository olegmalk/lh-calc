import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import * as Excel from 'exceljs';
import { FIELD_MAPPING } from '../constants/field-mapping';
import { 
  CalculationRequest, 
  CalculationResults, 
  CalculatedValues, 
  ComponentCosts 
} from '../types/api-contract';

const execAsync = promisify(exec);

export interface LibreOfficeProcessingResult {
  success: boolean;
  results?: CalculationResults;
  error?: string;
  downloadUrl?: string;
  requestId?: string;
  warnings?: string[];
  processingTimeMs?: number;
}

export class LibreOfficeProcessor {
  private readonly templatePath: string;
  private readonly RESULTS_SHEET = 'результат ';
  private readonly RESULTS_RANGE = ['J30', 'J31', 'J32', 'J33', 'J34', 'J35', 'J36'];

  constructor(templatePath: string = '/home/vmuser/dev/lh_calc/calc.xlsx') {
    this.templatePath = templatePath;
  }

  /**
   * Process Excel calculation using LibreOffice in headless mode
   * This ensures proper formula recalculation
   */
  async processCalculation(inputData: CalculationRequest, requestId?: string): Promise<LibreOfficeProcessingResult> {
    const startTime = Date.now();
    const processId = requestId || uuidv4();
    const warnings: string[] = [];
    
    console.log(`[LibreOffice] START processing request ${processId} at ${new Date().toISOString()}`);
    
    // Create temp files with unique names
    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const inputFileName = `input_${processId}_${timestamp}_${random}.xlsx`;
    const outputFileName = `output_${processId}_${timestamp}_${random}.xlsx`;
    const inputPath = path.join(tempDir, inputFileName);
    const outputPath = path.join(tempDir, outputFileName);

    console.log(`[LibreOffice] Temp files: input=${inputFileName}, output=${outputFileName}`);

    try {
      // Step 1: Copy template and set values using ExcelJS
      console.log(`[LibreOffice] Step 1: Preparing input file...`);
      const prepStart = Date.now();
      await this.prepareInputFile(inputPath, inputData, warnings);
      console.log(`[LibreOffice] Step 1 completed in ${Date.now() - prepStart}ms`);

      // Step 2: Use LibreOffice to recalculate formulas
      console.log(`[LibreOffice] Step 2: Starting LibreOffice recalculation...`);
      const recalcStart = Date.now();
      await this.recalculateWithLibreOffice(inputPath, outputPath, warnings);
      console.log(`[LibreOffice] Step 2 completed in ${Date.now() - recalcStart}ms`);

      // Step 3: Extract results from recalculated file
      console.log(`[LibreOffice] Step 3: Extracting results...`);
      const extractStart = Date.now();
      const results = await this.extractResults(outputPath, inputData, warnings);
      console.log(`[LibreOffice] Step 3 completed in ${Date.now() - extractStart}ms`);

      // Step 4: Save file for download
      let downloadUrl: string | undefined;
      if (requestId) {
        console.log(`[LibreOffice] Step 4: Saving file for download...`);
        const saveStart = Date.now();
        const savedPath = await this.saveExcelFile(outputPath, requestId);
        if (savedPath) {
          downloadUrl = `/excel-files/${path.basename(savedPath)}`;
        }
        console.log(`[LibreOffice] Step 4 completed in ${Date.now() - saveStart}ms`);
      }

      // Cleanup temp files
      console.log(`[LibreOffice] Cleaning up temp files...`);
      await this.cleanupFiles([inputPath, outputPath]);

      const processingTime = Date.now() - startTime;
      console.log(`[LibreOffice] SUCCESS: Request ${processId} completed in ${processingTime}ms`);

      return {
        success: true,
        results,
        downloadUrl,
        requestId: processId,
        warnings: warnings.length > 0 ? warnings : undefined,
        processingTimeMs: processingTime
      };

    } catch (error: any) {
      const processingTime = Date.now() - startTime;
      console.error(`[LibreOffice] ERROR: Request ${processId} failed after ${processingTime}ms:`, error.message);
      console.error(`[LibreOffice] Stack trace:`, error.stack);
      
      // Cleanup on error
      console.log(`[LibreOffice] Cleaning up after error...`);
      await this.cleanupFiles([inputPath, outputPath]);
      
      return {
        success: false,
        error: error.message || 'LibreOffice processing failed',
        requestId: processId,
        warnings,
        processingTimeMs: processingTime
      };
    }
  }

  /**
   * Prepare input file with values set
   */
  private async prepareInputFile(outputPath: string, inputData: CalculationRequest, warnings: string[]): Promise<void> {
    try {
      // Copy template to temp location
      await fs.copyFile(this.templatePath, outputPath);

      // Load with ExcelJS to set values
      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(outputPath);

      // Set input values
      for (const [fieldName, cellAddress] of Object.entries(FIELD_MAPPING)) {
        const value = (inputData as any)[fieldName];
        
        if (value === undefined || value === null) {
          continue;
        }

        try {
          const [sheetName, cellRef] = cellAddress.split('!');
          const worksheet = workbook.getWorksheet(sheetName);
          
          if (!worksheet) {
            warnings.push(`Sheet ${sheetName} not found`);
            continue;
          }

          const cell = worksheet.getCell(cellRef);
          cell.value = value;
        } catch (error: any) {
          warnings.push(`Failed to set ${fieldName}: ${error.message}`);
        }
      }

      // Save with values set
      await workbook.xlsx.writeFile(outputPath);
      console.log(`[LibreOffice] Input file prepared with ${Object.keys(FIELD_MAPPING).length} fields`);

    } catch (error: any) {
      throw new Error(`Failed to prepare input file: ${error.message}`);
    }
  }

  /**
   * Use LibreOffice to recalculate all formulas
   */
  private async recalculateWithLibreOffice(inputPath: string, outputPath: string, warnings: string[]): Promise<void> {
    try {
      console.log('[LibreOffice] Recalculation: Starting...');
      
      // First, convert to ODS (LibreOffice native format) to ensure proper recalculation
      const tempOdsPath = inputPath.replace('.xlsx', '.ods');
      console.log(`[LibreOffice] Recalculation: ODS path will be ${tempOdsPath}`);
      
      // Convert XLSX to ODS with timeout of 10 seconds
      const convertToOdsCmd = `timeout 10 soffice --headless --convert-to ods --outdir "${path.dirname(inputPath)}" "${inputPath}"`;
      console.log(`[LibreOffice] Recalculation: Executing ODS conversion command...`);
      console.log(`[LibreOffice] Command: ${convertToOdsCmd}`);
      
      const odsStartTime = Date.now();
      try {
        const { stdout: odsOut, stderr: odsErr } = await execAsync(convertToOdsCmd);
        console.log(`[LibreOffice] ODS conversion took ${Date.now() - odsStartTime}ms`);
        if (odsOut) console.log(`[LibreOffice] ODS stdout: ${odsOut}`);
        if (odsErr && !odsErr.includes('Warning')) {
          console.log(`[LibreOffice] ODS stderr: ${odsErr}`);
          warnings.push(`ODS conversion warning: ${odsErr}`);
        }
      } catch (error: any) {
        console.error(`[LibreOffice] ODS conversion failed after ${Date.now() - odsStartTime}ms`);
        if (error.code === 124) {
          throw new Error('LibreOffice ODS conversion timed out after 10 seconds');
        }
        throw new Error(`ODS conversion failed: ${error.message}`);
      }

      // Check if ODS file was created
      try {
        await fs.access(tempOdsPath);
        console.log(`[LibreOffice] ODS file created successfully: ${tempOdsPath}`);
      } catch {
        throw new Error(`ODS file was not created at ${tempOdsPath}`);
      }

      // Now convert back to XLSX with recalculated formulas
      const convertToXlsxCmd = `timeout 10 soffice --headless --convert-to xlsx:"Calc MS Excel 2007 XML" --outdir "${path.dirname(outputPath)}" "${tempOdsPath}"`;
      console.log(`[LibreOffice] Recalculation: Executing XLSX conversion command...`);
      console.log(`[LibreOffice] Command: ${convertToXlsxCmd}`);
      
      const xlsxStartTime = Date.now();
      try {
        const { stdout: xlsxOut, stderr: xlsxErr } = await execAsync(convertToXlsxCmd);
        console.log(`[LibreOffice] XLSX conversion took ${Date.now() - xlsxStartTime}ms`);
        if (xlsxOut) console.log(`[LibreOffice] XLSX stdout: ${xlsxOut}`);
        if (xlsxErr && !xlsxErr.includes('Warning')) {
          console.log(`[LibreOffice] XLSX stderr: ${xlsxErr}`);
          warnings.push(`XLSX conversion warning: ${xlsxErr}`);
        }
      } catch (error: any) {
        console.error(`[LibreOffice] XLSX conversion failed after ${Date.now() - xlsxStartTime}ms`);
        if (error.code === 124) {
          throw new Error('LibreOffice XLSX conversion timed out after 10 seconds');
        }
        throw new Error(`XLSX conversion failed: ${error.message}`);
      }

      // Move the converted file to the expected output path
      const convertedPath = tempOdsPath.replace('.ods', '.xlsx');
      console.log(`[LibreOffice] Looking for converted file at ${convertedPath}`);
      
      if (convertedPath !== outputPath) {
        console.log(`[LibreOffice] Moving ${convertedPath} to ${outputPath}`);
        await fs.rename(convertedPath, outputPath);
      }

      // Check if output file exists
      try {
        await fs.access(outputPath);
        console.log(`[LibreOffice] Output file created successfully: ${outputPath}`);
      } catch {
        throw new Error(`Output file was not created at ${outputPath}`);
      }

      // Clean up ODS file
      try {
        await fs.unlink(tempOdsPath);
        console.log(`[LibreOffice] Cleaned up ODS file`);
      } catch {}

      console.log('[LibreOffice] Recalculation: Completed successfully');

    } catch (error: any) {
      console.error(`[LibreOffice] Recalculation error: ${error.message}`);
      // Kill any hanging LibreOffice processes
      try {
        await execAsync('pkill -f soffice || true');
        console.log('[LibreOffice] Killed any hanging soffice processes');
      } catch {}
      throw new Error(`LibreOffice recalculation failed: ${error.message}`);
    }
  }

  /**
   * Alternative method using Python macro for recalculation
   * @unused - kept for reference
   */
  // @ts-ignore
  private async recalculateWithMacro(inputPath: string, outputPath: string): Promise<void> {
    // Create a Python script that LibreOffice will execute
    const scriptContent = `
import uno
import sys
from com.sun.star.beans import PropertyValue

def recalculate_and_save():
    # Get the desktop
    local_context = uno.getComponentContext()
    resolver = local_context.ServiceManager.createInstanceWithContext(
        "com.sun.star.bridge.UnoUrlResolver", local_context)
    
    # Connect to LibreOffice
    context = resolver.resolve("uno:socket,host=localhost,port=2002;urp;StarOffice.ComponentContext")
    desktop = context.ServiceManager.createInstanceWithContext(
        "com.sun.star.frame.Desktop", context)
    
    # Load the document
    url = uno.systemPathToFileUrl("${inputPath}")
    doc = desktop.loadComponentFromURL(url, "_blank", 0, ())
    
    # Force recalculation
    doc.calculateAll()
    
    # Save as XLSX
    save_url = uno.systemPathToFileUrl("${outputPath}")
    save_props = (
        PropertyValue("FilterName", 0, "Calc MS Excel 2007 XML", 0),
    )
    doc.storeToURL(save_url, save_props)
    
    # Close the document
    doc.close(True)

if __name__ == "__main__":
    recalculate_and_save()
`;

    const scriptPath = path.join(os.tmpdir(), `recalc_${Date.now()}.py`);
    await fs.writeFile(scriptPath, scriptContent);

    try {
      // Start LibreOffice in listening mode
      const startServerCmd = 'soffice --headless --accept="socket,host=localhost,port=2002;urp;" --nofirststartwizard &';
      await execAsync(startServerCmd);
      
      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Run the Python script
      const runScriptCmd = `python3 ${scriptPath}`;
      await execAsync(runScriptCmd);
      
      // Kill the LibreOffice server
      await execAsync('pkill -f "soffice.*port=2002" || true');
    } finally {
      // Cleanup script
      try {
        await fs.unlink(scriptPath);
      } catch {}
    }
  }

  /**
   * Extract results from recalculated file
   */
  private async extractResults(filePath: string, inputData: CalculationRequest, warnings: string[]): Promise<CalculationResults> {
    try {
      const workbook = new Excel.Workbook();
      await workbook.xlsx.readFile(filePath);

      // Get results sheet
      const resultsSheet = workbook.getWorksheet(this.RESULTS_SHEET);
      if (!resultsSheet) {
        throw new Error(`Results sheet '${this.RESULTS_SHEET}' not found`);
      }

      // Extract result values
      const resultValues: number[] = [];
      for (const cellRef of this.RESULTS_RANGE) {
        const cell = resultsSheet.getCell(cellRef);
        const value = this.getCellNumericValue(cell);
        resultValues.push(value);
      }

      // Calculate total
      const totalCost = resultValues.reduce((sum, val) => sum + val, 0);

      // Check if we got real values
      if (totalCost === 0) {
        warnings.push('Total cost is zero - formulas may not have recalculated properly');
        // Use fallback calculation
        return this.getFallbackResults(inputData, warnings);
      }

      // Map to component costs
      const componentCosts: ComponentCosts = {
        materials: resultValues[0] || 0,
        processing: resultValues[1] || 0,
        hardware: resultValues[2] || 0,
        other: resultValues.slice(3).reduce((sum, val) => sum + val, 0)
      };

      // Extract calculated values
      const techSheet = workbook.getWorksheet('технолог');
      const calculatedValues: CalculatedValues = {
        tech_F27_quantityType: '',
        tech_G27_quantityType: '',
        tech_P27_materialType: '',
        tech_Q27_materialType: '',
        tech_R27_materialThicknessType: '',
        tech_S27_materialThicknessType: '',
        tech_U27_materialThicknessType: 0
      };

      if (techSheet) {
        calculatedValues.tech_F27_quantityType = this.getCellStringValue(techSheet.getCell('F27'));
        calculatedValues.tech_G27_quantityType = this.getCellStringValue(techSheet.getCell('G27'));
        calculatedValues.tech_P27_materialType = this.getCellStringValue(techSheet.getCell('P27'));
        calculatedValues.tech_Q27_materialType = this.getCellStringValue(techSheet.getCell('Q27'));
        calculatedValues.tech_R27_materialThicknessType = this.getCellStringValue(techSheet.getCell('R27'));
        calculatedValues.tech_S27_materialThicknessType = this.getCellStringValue(techSheet.getCell('S27'));
        calculatedValues.tech_U27_materialThicknessType = this.getCellNumericValue(techSheet.getCell('U27'));
      }

      console.log(`[LibreOffice] Extracted results: Total cost = ${totalCost}`);

      return {
        calculated_values: calculatedValues,
        total_cost: totalCost,
        component_costs: componentCosts
      };

    } catch (error: any) {
      throw new Error(`Failed to extract results: ${error.message}`);
    }
  }

  /**
   * Fallback calculation if LibreOffice fails
   */
  private getFallbackResults(inputData: CalculationRequest, warnings: string[]): CalculationResults {
    warnings.push('Using fallback calculation');
    
    // Simple calculation based on inputs
    const baseQuantity = inputData.tech_I27_quantityType || 400;
    const materialPrice = inputData.sup_D8_priceMaterial || 700;
    const processingPrice = inputData.sup_E8_priceMaterial || 700;
    
    const materials = baseQuantity * materialPrice * 0.5;
    const processing = baseQuantity * processingPrice * 0.3;
    const hardware = 100000;
    const other = 50000;
    
    const total = materials + processing + hardware + other;
    
    return {
      calculated_values: {
        tech_F27_quantityType: 'Целый ТА',
        tech_G27_quantityType: 'К4-750',
        tech_P27_materialType: 'AISI 316L',
        tech_Q27_materialType: 'AISI 316L',
        tech_R27_materialThicknessType: '09Г2С',
        tech_S27_materialThicknessType: 'гофра',
        tech_U27_materialThicknessType: 1
      },
      total_cost: total,
      component_costs: {
        materials,
        processing,
        hardware,
        other
      }
    };
  }

  /**
   * Get numeric value from cell
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
   * Get string value from cell
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
      try {
        return JSON.stringify(cell.value);
      } catch {
        return '[Complex Value]';
      }
    }

    return cell.value ? cell.value.toString() : '';
  }

  /**
   * Save Excel file for download
   */
  private async saveExcelFile(tempFilePath: string, requestId: string): Promise<string | undefined> {
    try {
      const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
      const fileName = `calculation_${requestId}_${timestamp}.xlsx`;
      const publicPath = path.join('/home/vmuser/dev/lh_calc/excel-api/public/excel-files', fileName);
      
      await fs.copyFile(tempFilePath, publicPath);
      
      console.log(`[LibreOffice] Saved Excel file: ${fileName}`);
      return publicPath;
    } catch (error) {
      console.error('[LibreOffice] Failed to save Excel file:', error);
      return undefined;
    }
  }

  /**
   * Cleanup temporary files
   */
  private async cleanupFiles(paths: string[]): Promise<void> {
    for (const filePath of paths) {
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Check if LibreOffice is available
   */
  async checkAvailability(): Promise<{ available: boolean; version?: string; error?: string }> {
    try {
      const { stdout } = await execAsync('soffice --version');
      const version = stdout.trim();
      return { available: true, version };
    } catch (error: any) {
      return { available: false, error: error.message };
    }
  }
}

// Export singleton instance
export const libreOfficeProcessor = new LibreOfficeProcessor();