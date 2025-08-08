import { describe, it, expect, beforeEach } from 'vitest';
import { useInputStore } from '../../stores/inputStore';
import type { HeatExchangerInput } from './types';

describe('Material Specifications - Story 2', () => {
  let updateInput: (field: keyof HeatExchangerInput, value: any) => void;
  let inputs: HeatExchangerInput;

  beforeEach(() => {
    // Reset store before each test
    useInputStore.getState().reset();
    updateInput = useInputStore.getState().updateInput;
    inputs = useInputStore.getState().inputs;
  });

  describe('Q27 - Cladding Material Auto-sync', () => {
    it('should auto-sync claddingMaterial with materialPlate by default', () => {
      const { inputs } = useInputStore.getState();
      expect(inputs.claddingMaterial).toBe(inputs.materialPlate);
    });

    it('should update claddingMaterial when materialPlate changes', () => {
      updateInput('materialPlate', 'AISI 304');
      
      const updatedInputs = useInputStore.getState().inputs;
      expect(updatedInputs.materialPlate).toBe('AISI 304');
      expect(updatedInputs.claddingMaterial).toBe('AISI 304');
    });

    it('should maintain auto-sync through multiple changes', () => {
      // Change 1
      updateInput('materialPlate', 'AISI 304');
      let state = useInputStore.getState().inputs;
      expect(state.claddingMaterial).toBe('AISI 304');

      // Change 2
      updateInput('materialPlate', '12Х18Н10Т');
      state = useInputStore.getState().inputs;
      expect(state.claddingMaterial).toBe('12Х18Н10Т');

      // Change 3
      updateInput('materialPlate', 'AISI 316L');
      state = useInputStore.getState().inputs;
      expect(state.claddingMaterial).toBe('AISI 316L');
    });
  });

  describe('R27 - Body Material Dropdown', () => {
    it('should have default value of 09Г2С', () => {
      expect(inputs.bodyMaterial).toBe('09Г2С');
    });

    it('should accept valid body material options', () => {
      const validOptions = ['09Г2С', 'Ст3', 'Ст20', '12Х18Н10Т'];
      
      validOptions.forEach(material => {
        updateInput('bodyMaterial', material);
        const state = useInputStore.getState().inputs;
        expect(state.bodyMaterial).toBe(material);
      });
    });

    it('should allow empty value for optional field', () => {
      updateInput('bodyMaterial', '');
      const state = useInputStore.getState().inputs;
      expect(state.bodyMaterial).toBe('');
    });
  });

  describe('S27 - Corrugation Type Dropdown', () => {
    it('should have default value of гофра', () => {
      expect(inputs.corrugationType).toBe('гофра');
    });

    it('should accept valid corrugation type options', () => {
      const validOptions = ['гофра', 'плоская', 'специальная'];
      
      validOptions.forEach(type => {
        updateInput('corrugationType', type);
        const state = useInputStore.getState().inputs;
        expect(state.corrugationType).toBe(type);
      });
    });

    it('should allow empty value for optional field', () => {
      updateInput('corrugationType', '');
      const state = useInputStore.getState().inputs;
      expect(state.corrugationType).toBe('');
    });
  });

  describe('Field Integration', () => {
    it('should maintain all material specification fields independently except for auto-sync', () => {
      // Set different values
      updateInput('materialPlate', 'AISI 304');
      updateInput('bodyMaterial', 'Ст3');
      updateInput('corrugationType', 'плоская');

      const state = useInputStore.getState().inputs;
      
      // Q27 should auto-sync with P27
      expect(state.materialPlate).toBe('AISI 304');
      expect(state.claddingMaterial).toBe('AISI 304');
      
      // R27 and S27 should be independent
      expect(state.bodyMaterial).toBe('Ст3');
      expect(state.corrugationType).toBe('плоская');
    });

    it('should handle complete material specification workflow', () => {
      // Simulate user filling out all material fields
      updateInput('materialPlate', '12Х18Н10Т');
      updateInput('bodyMaterial', '12Х18Н10Т');
      updateInput('corrugationType', 'специальная');

      const state = useInputStore.getState().inputs;
      
      expect(state.materialPlate).toBe('12Х18Н10Т');
      expect(state.claddingMaterial).toBe('12Х18Н10Т'); // Auto-synced
      expect(state.bodyMaterial).toBe('12Х18Н10Т');
      expect(state.corrugationType).toBe('специальная');
    });

    it('should preserve legacy fields for backward compatibility', () => {
      // Legacy fields should still work
      updateInput('materialBody', 'AISI 316L');
      updateInput('surfaceType', 'гофра');

      const state = useInputStore.getState().inputs;
      
      expect(state.materialBody).toBe('AISI 316L');
      expect(state.surfaceType).toBe('гофра');
    });
  });

  describe('Type Safety and Schema Validation', () => {
    it('should have correct TypeScript types for all fields', () => {
      const state = useInputStore.getState().inputs;
      
      // These should all be string | undefined as per the interface
      expect(typeof state.claddingMaterial).toBe('string');
      expect(typeof state.bodyMaterial).toBe('string');
      expect(typeof state.corrugationType).toBe('string');
    });

    it('should maintain data consistency after store operations', () => {
      // Reset and check defaults
      useInputStore.getState().reset();
      let state = useInputStore.getState().inputs;
      
      expect(state.claddingMaterial).toBe('AISI 316L');
      expect(state.bodyMaterial).toBe('09Г2С');
      expect(state.corrugationType).toBe('гофра');

      // Update and verify persistence
      updateInput('materialPlate', 'AISI 304');
      updateInput('bodyMaterial', 'Ст20');
      updateInput('corrugationType', 'плоская');
      
      state = useInputStore.getState().inputs;
      
      expect(state.materialPlate).toBe('AISI 304');
      expect(state.claddingMaterial).toBe('AISI 304');
      expect(state.bodyMaterial).toBe('Ст20');
      expect(state.corrugationType).toBe('плоская');
    });
  });

  describe('Excel Formula Equivalence', () => {
    it('should implement Q27 formula: =P27', () => {
      // Test the Excel formula equivalence Q27 = P27
      const testMaterials = ['AISI 316L', 'AISI 304', '12Х18Н10Т', 'AISI 321'];
      
      testMaterials.forEach(material => {
        updateInput('materialPlate', material);
        const state = useInputStore.getState().inputs;
        
        // Q27 should always equal P27
        expect(state.claddingMaterial).toBe(state.materialPlate);
      });
    });

    it('should match TEST_SCENARIO_DATA.md defaults', () => {
      // From TEST_SCENARIO_DATA.md:
      // Q27: Formula =P27 (equals materialPlate)
      // R27: Default "09Г2С" 
      // S27: Default "гофра"
      
      useInputStore.getState().reset();
      const state = useInputStore.getState().inputs;
      
      expect(state.claddingMaterial).toBe(state.materialPlate); // Q27 = P27
      expect(state.bodyMaterial).toBe('09Г2С'); // R27 default
      expect(state.corrugationType).toBe('гофра'); // S27 default
    });
  });

  describe('Story 2 Requirements Compliance', () => {
    it('should meet all Story 2 acceptance criteria', () => {
      // 1. Q27 (claddingMaterial) - Formula field that equals P27 ✓
      updateInput('materialPlate', 'TestMaterial');
      let state = useInputStore.getState().inputs;
      expect(state.claddingMaterial).toBe('TestMaterial');

      // 2. R27 (bodyMaterial) - Dropdown selection ✓
      const bodyMaterials = ['09Г2С', 'Ст3', 'Ст20', '12Х18Н10Т'];
      bodyMaterials.forEach(material => {
        updateInput('bodyMaterial', material);
        state = useInputStore.getState().inputs;
        expect(bodyMaterials).toContain(state.bodyMaterial);
      });

      // 3. S27 (corrugationType) - Dropdown selection ✓
      const corrugationTypes = ['гофра', 'плоская', 'специальная'];
      corrugationTypes.forEach(type => {
        updateInput('corrugationType', type);
        state = useInputStore.getState().inputs;
        expect(corrugationTypes).toContain(state.corrugationType);
      });

      // 4. Default values match requirements ✓
      useInputStore.getState().reset();
      state = useInputStore.getState().inputs;
      expect(state.bodyMaterial).toBe('09Г2С');
      expect(state.corrugationType).toBe('гофра');
    });

    it('should handle edge cases properly', () => {
      // Empty string handling
      updateInput('materialPlate', '');
      let state = useInputStore.getState().inputs;
      expect(state.claddingMaterial).toBe('');

      // Special characters
      updateInput('materialPlate', 'AISI 316L (Special)');
      state = useInputStore.getState().inputs;
      expect(state.claddingMaterial).toBe('AISI 316L (Special)');

      // Unicode characters (Russian materials)
      updateInput('materialPlate', '12Х18Н10Т');
      state = useInputStore.getState().inputs;
      expect(state.claddingMaterial).toBe('12Х18Н10Т');
    });
  });
});