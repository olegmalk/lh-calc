/**
 * Processor Wrapper that can use either ExcelJS or LibreOffice
 */

import { ExcelProcessor, ProcessingResult } from './excel-processor';
import { libreOfficeProcessor } from './libreoffice-processor';
import { CalculationRequest } from '../types/api-contract';

export class ProcessorWrapper {
  private excelProcessor: ExcelProcessor;
  private useLibreOffice: boolean;

  constructor(excelProcessor: ExcelProcessor, useLibreOffice: boolean = true) {
    this.excelProcessor = excelProcessor;
    this.useLibreOffice = useLibreOffice;
  }

  /**
   * Process calculation using selected processor
   */
  async processCalculation(inputData: CalculationRequest, requestId?: string): Promise<ProcessingResult> {
    // Try LibreOffice first if enabled
    if (this.useLibreOffice) {
      try {
        console.log(`[ProcessorWrapper] Using LibreOffice for request ${requestId}`);
        
        // Check if LibreOffice is available
        const availability = await libreOfficeProcessor.checkAvailability();
        if (!availability.available) {
          throw new Error('LibreOffice not available');
        }
        
        // Process with LibreOffice
        const result = await libreOfficeProcessor.processCalculation(inputData, requestId);
        
        // Convert LibreOfficeProcessingResult to ProcessingResult
        return {
          success: result.success,
          results: result.results,
          error: result.error,
          processingTimeMs: result.processingTimeMs || 0,
          downloadUrl: result.downloadUrl,
          warnings: result.warnings
        };
        
      } catch (error: any) {
        console.warn(`[ProcessorWrapper] LibreOffice failed, falling back to ExcelJS: ${error.message}`);
        // Fall back to ExcelJS if LibreOffice fails
      }
    }
    
    // Use ExcelJS (with fallback calculation)
    console.log(`[ProcessorWrapper] Using ExcelJS for request ${requestId}`);
    return await this.excelProcessor.processCalculation(inputData, requestId);
  }
  
  /**
   * Switch between processors
   */
  setUseLibreOffice(useLibreOffice: boolean): void {
    this.useLibreOffice = useLibreOffice;
    console.log(`[ProcessorWrapper] Switched to ${useLibreOffice ? 'LibreOffice' : 'ExcelJS'} processor`);
  }
  
  /**
   * Get current processor status
   */
  getStatus(): { processor: string; available: boolean } {
    return {
      processor: this.useLibreOffice ? 'LibreOffice' : 'ExcelJS',
      available: true
    };
  }
}

export const createProcessorWrapper = (excelProcessor: ExcelProcessor, useLibreOffice: boolean = true) => {
  return new ProcessorWrapper(excelProcessor, useLibreOffice);
};