import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CalculationResult, HeatExchangerInput, SupplyParameters } from '../lib/calculation-engine/types';
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
          
          // Load supply parameters from localStorage and map field names
          const savedSupplyParams = localStorage.getItem('lh-calculator-supply-params');
          let supplyParams: SupplyParameters | undefined = undefined;
          
          if (savedSupplyParams) {
            try {
              const rawSupplyParams = JSON.parse(savedSupplyParams);
              // Map form field names to engine field names
              supplyParams = {
                plateMaterialPrice: rawSupplyParams.plateMaterialPricePerKg,
                claddingMaterialPrice: rawSupplyParams.claddingMaterialPricePerKg,
                columnCoverMaterialPrice: rawSupplyParams.columnCoverMaterialPricePerKg,
                panelMaterialPrice: rawSupplyParams.panelMaterialPricePerKg,
                laborRate: rawSupplyParams.laborRatePerHour,
                cuttingCost: rawSupplyParams.cuttingCostPerMeter,
                internalLogistics: rawSupplyParams.internalLogisticsCost,
                standardLaborHours: rawSupplyParams.standardLaborHours,
                panelFastenerQuantity: rawSupplyParams.panelFastenerQuantity,
                claddingCorrection: rawSupplyParams.claddingCuttingCorrection,
                columnCorrection: rawSupplyParams.columnCuttingCorrection,
                coverCorrection: rawSupplyParams.coverCuttingCorrection,
                panelCorrection: rawSupplyParams.panelCuttingCorrection,
              };
            } catch (parseError) {
              console.warn('Failed to parse supply parameters from localStorage:', parseError);
            }
          }
          
          const result = get().engine.calculate(inputs, supplyParams);
          
          set({
            result,
            isCalculating: false,
            lastCalculatedAt: new Date(),
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Calculation failed', // TODO: localize this
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