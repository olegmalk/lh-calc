import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';

interface InputState {
  inputs: HeatExchangerInput;
  isDirty: boolean;
  updateInput: <K extends keyof HeatExchangerInput>(
    field: K, 
    value: HeatExchangerInput[K]
  ) => void;
  updateMultiple: (updates: Partial<HeatExchangerInput>) => void;
  reset: () => void;
  loadFromTemplate: (template: HeatExchangerInput) => void;
}

const defaultInputs: HeatExchangerInput = {
  equipmentType: 'К4-750',
  modelCode: 'К4-750',
  plateConfiguration: '1/6',
  plateCount: 400,
  pressureA: 100,
  pressureB: 100,
  temperatureA: 80,
  temperatureB: 60,
  materialPlate: 'AISI 316L',
  materialBody: 'AISI 316L',
  surfaceType: 'гофра',
  plateThickness: 1.0, // Changed from 3 to 1.0mm to match Excel U27 default
};

export const useInputStore = create<InputState>()(
  devtools(
    persist(
      (set) => ({
        inputs: defaultInputs,
        isDirty: false,
        
        updateInput: (field, value) => 
          set((state) => ({
            inputs: {
              ...state.inputs,
              [field]: value,
            },
            isDirty: true,
          }), false, 'updateInput'),
        
        updateMultiple: (updates) =>
          set((state) => ({
            inputs: {
              ...state.inputs,
              ...updates,
            },
            isDirty: true,
          }), false, 'updateMultiple'),
        
        reset: () =>
          set({
            inputs: defaultInputs,
            isDirty: false,
          }, false, 'reset'),
        
        loadFromTemplate: (template) =>
          set({
            inputs: template,
            isDirty: false,
          }, false, 'loadFromTemplate'),
      }),
      {
        name: 'lh-calculator-inputs',
      }
    )
  )
);