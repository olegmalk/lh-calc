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
    const startTime = Date.now();
    
    // Try LibreOffice first if enabled
    if (this.useLibreOffice) {
      try {
        console.log(`[ProcessorWrapper] Request ${requestId}: Checking LibreOffice availability...`);
        
        // Check if LibreOffice is available
        const availStart = Date.now();
        const availability = await libreOfficeProcessor.checkAvailability();
        console.log(`[ProcessorWrapper] LibreOffice availability check took ${Date.now() - availStart}ms: ${availability.available ? 'Available' : 'Not available'}`);
        
        if (!availability.available) {
          throw new Error(`LibreOffice not available: ${availability.error}`);
        }
        
        // Create a timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('LibreOffice processing timeout after 20 seconds')), 20000);
        });
        
        // Process with LibreOffice with 20 second timeout
        console.log(`[ProcessorWrapper] Request ${requestId}: Starting LibreOffice processing with 20s timeout...`);
        const processStart = Date.now();
        
        const result = await Promise.race([
          libreOfficeProcessor.processCalculation(inputData, requestId),
          timeoutPromise
        ]);
        
        console.log(`[ProcessorWrapper] Request ${requestId}: LibreOffice processing completed in ${Date.now() - processStart}ms`);
        
        // Convert LibreOfficeProcessingResult to ProcessingResult
        return {
          success: result.success,
          results: result.results,
          error: result.error,
          processingTimeMs: result.processingTimeMs || (Date.now() - startTime),
          downloadUrl: result.downloadUrl,
          warnings: result.warnings
        };
        
      } catch (error: any) {
        const elapsed = Date.now() - startTime;
        console.error(`[ProcessorWrapper] Request ${requestId}: LibreOffice failed after ${elapsed}ms: ${error.message}`);
        console.log(`[ProcessorWrapper] Request ${requestId}: Falling back to ExcelJS...`);
        
        // Kill any hanging LibreOffice processes
        try {
          const { exec } = require('child_process');
          exec('pkill -f soffice || true');
        } catch {}
        
        // TODO: Fix LibreOffice integration - currently timing out
        // Fall back to ExcelJS if LibreOffice fails
      }
    }
    
    // Use ExcelJS (with fallback calculation)
    console.log(`[ProcessorWrapper] Request ${requestId}: Using ExcelJS processor`);
    const excelStart = Date.now();
    const result = await this.excelProcessor.processCalculation(inputData, requestId);
    console.log(`[ProcessorWrapper] Request ${requestId}: ExcelJS processing completed in ${Date.now() - excelStart}ms`);
    return result;
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