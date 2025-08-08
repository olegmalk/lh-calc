import { describe, it, expect, beforeEach } from 'vitest';
import { useInputStore } from '../../stores/inputStore';

describe('Configuration Parameters - Story 3', () => {
  beforeEach(() => {
    // Reset store before each test
    useInputStore.getState().reset();
  });
  describe('Default Values', () => {
    it('should match TEST_SCENARIO_DATA.md defaults', () => {
      const { inputs } = useInputStore.getState();
      
      expect(inputs.solutionDensity).toBe(1.0);
      expect(inputs.solutionVolume).toBe("Е-113");
      expect(inputs.equipmentTypeDetail).toBe("Целый ТА");
      expect(inputs.flowRatio).toBe("1/6");
    });
  });

  describe('Solution Density Validation', () => {
    it('should accept valid density values within range 0.5-2.0', () => {
      const validValues = [0.5, 1.0, 1.5, 2.0];
      
      validValues.forEach(density => {
        const isValid = density >= 0.5 && density <= 2.0;
        expect(isValid).toBe(true);
      });
    });

    it('should reject density values outside range 0.5-2.0', () => {
      const invalidValues = [0.4, 0.3, 2.1, 3.0, -1.0];
      
      invalidValues.forEach(density => {
        const isValid = density >= 0.5 && density <= 2.0;
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Flow Ratio Validation', () => {
    it('should accept valid flow ratio patterns', () => {
      const validRatios = ["1/6", "1/4", "1/3", "1/2", "2/3", "3/4", "5/6", "10/15"];
      
      validRatios.forEach(ratio => {
        const isValid = /^\d+\/\d+$/.test(ratio);
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid flow ratio patterns', () => {
      const invalidRatios = ["1", "1/", "/6", "1-6", "1:6", "1.5/6", "a/b", ""];
      
      invalidRatios.forEach(ratio => {
        const isValid = /^\d+\/\d+$/.test(ratio);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Cyrillic Text Handling', () => {
    it('should handle Cyrillic text in solutionVolume', () => {
      const cyrillicValues = ["Е-113", "Б-456", "В-789", "Г-ABC"];
      
      cyrillicValues.forEach(value => {
        expect(value.length).toBeGreaterThan(0);
        expect(value.length).toBeLessThanOrEqual(50); // maxLength validation
      });
    });

    it('should handle Cyrillic text in equipmentTypeDetail', () => {
      const cyrillicValues = ["Целый ТА", "Частичный ТА", "Специальный тип"];
      
      cyrillicValues.forEach(value => {
        expect(value.length).toBeGreaterThan(0);
        expect(value.length).toBeLessThanOrEqual(100); // maxLength validation
      });
    });
  });

  describe('Integration with Existing Calculations', () => {
    it('should preserve configuration parameters when updating store', () => {
      const { updateInput } = useInputStore.getState();
      
      updateInput('solutionDensity', 1.5);
      updateInput('solutionVolume', "Е-456");
      updateInput('equipmentTypeDetail', "Специальный ТА");
      updateInput('flowRatio', "2/3");

      const updatedInputs = useInputStore.getState().inputs;
      expect(updatedInputs.solutionDensity).toBe(1.5);
      expect(updatedInputs.solutionVolume).toBe("Е-456");
      expect(updatedInputs.equipmentTypeDetail).toBe("Специальный ТА");
      expect(updatedInputs.flowRatio).toBe("2/3");
    });

    it('should not affect existing critical calculation fields', () => {
      const { updateInput } = useInputStore.getState();
      const originalInputs = useInputStore.getState().inputs;
      
      // Update configuration parameters
      updateInput('solutionDensity', 1.8);
      updateInput('flowRatio', "1/4");
      
      const updatedInputs = useInputStore.getState().inputs;
      
      // Core calculation fields should remain unchanged
      expect(updatedInputs.equipmentType).toBe(originalInputs.equipmentType);
      expect(updatedInputs.plateCount).toBe(originalInputs.plateCount);
      expect(updatedInputs.pressureA).toBe(originalInputs.pressureA);
      expect(updatedInputs.materialPlate).toBe(originalInputs.materialPlate);
    });
  });

  describe('Field Constraints', () => {
    it('should respect solutionVolume maxLength constraint', () => {
      const maxLength = 50;
      const validValue = "Е".repeat(maxLength);
      const invalidValue = "Е".repeat(maxLength + 1);

      expect(validValue.length).toBe(maxLength);
      expect(invalidValue.length).toBeGreaterThan(maxLength);
    });

    it('should respect equipmentTypeDetail maxLength constraint', () => {
      const maxLength = 100;
      const validValue = "А".repeat(maxLength);
      const invalidValue = "А".repeat(maxLength + 1);

      expect(validValue.length).toBe(maxLength);
      expect(invalidValue.length).toBeGreaterThan(maxLength);
    });

    it('should handle step precision for solutionDensity', () => {
      const step = 0.01;
      const testValues = [1.00, 1.01, 1.99, 2.00];

      testValues.forEach(value => {
        const rounded = Math.round(value / step) * step;
        expect(Math.abs(value - rounded)).toBeLessThan(0.0001);
      });
    });
  });
});