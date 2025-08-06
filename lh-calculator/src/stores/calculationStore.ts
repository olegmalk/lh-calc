import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CalculationResult, HeatExchangerInput } from '../lib/calculation-engine/types';
import { CalculationEngineV2 } from '../lib/calculation-engine/engine-v2';

interface CalculationState {
  result: CalculationResult | null;
  isCalculating: boolean;
  error: string | null;
  lastCalculatedAt: Date | null;
  engine: CalculationEngineV2;
  
  calculate: (inputs: HeatExchangerInput) => Promise<void>;
  clearResults: () => void;
  exportToExcel: () => void;
  exportToPDF: () => void;
}

export const useCalculationStore = create<CalculationState>()(
  devtools(
    (set, get) => ({
      result: null,
      isCalculating: false,
      error: null,
      lastCalculatedAt: null,
      engine: new CalculationEngineV2(),
      
      calculate: async (inputs) => {
        set({ isCalculating: true, error: null });
        
        try {
          // Simulate async calculation (in real app, might be web worker)
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const result = get().engine.calculate(inputs);
          
          set({
            result,
            isCalculating: false,
            lastCalculatedAt: new Date(),
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Calculation failed',
            isCalculating: false,
          });
        }
      },
      
      clearResults: () =>
        set({
          result: null,
          error: null,
          lastCalculatedAt: null,
        }),
      
      exportToExcel: () => {
        const { result } = get();
        if (!result) return;
        
        // TODO: Implement Excel export
        console.log('Exporting to Excel:', result);
      },
      
      exportToPDF: () => {
        const { result } = get();
        if (!result) return;
        
        // TODO: Implement PDF export
        console.log('Exporting to PDF:', result);
      },
    })
  )
);