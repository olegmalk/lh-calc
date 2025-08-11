/**
 * Processor Wrapper - uses LibreOffice for Excel processing
 */

import { libreOfficeProcessor } from './libreoffice-processor';
import { CalculationRequest } from '../types/api-contract';

export interface ProcessingResult {
  success: boolean;
  results?: any;
  error?: string;
  processingTimeMs: number;
  queueTimeMs: number;
  downloadUrl?: string;
}

export class ProcessorWrapper {
  async processCalculation(inputData: CalculationRequest, requestId?: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    console.log(`[ProcessorWrapper] Request ${requestId}: Starting LibreOffice processing...`);
    
    try {
      // Check if LibreOffice is available
      const availability = await libreOfficeProcessor.checkAvailability();
      
      if (!availability.available) {
        throw new Error(`LibreOffice not available: ${availability.error}`);
      }
      
      // Process with LibreOffice
      const result = await libreOfficeProcessor.processCalculation(inputData, requestId);
      
      console.log(`[ProcessorWrapper] Request ${requestId}: LibreOffice processing completed in ${Date.now() - startTime}ms`);
      
      return {
        ...result,
        processingTimeMs: Date.now() - startTime,
        queueTimeMs: 0
      };
      
    } catch (error: any) {
      console.error(`[ProcessorWrapper] Request ${requestId}: Processing failed after ${Date.now() - startTime}ms:`, error.message);
      
      return {
        success: false,
        error: error.message,
        processingTimeMs: Date.now() - startTime,
        queueTimeMs: 0
      };
    }
  }
}

export const createProcessorWrapper = () => {
  return new ProcessorWrapper();
};