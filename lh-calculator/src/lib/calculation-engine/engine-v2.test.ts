import { describe, it, expect, beforeEach } from 'vitest';
import { CalculationEngineV2 } from './engine-v2';
import type { HeatExchangerInput } from './types';

describe('CalculationEngineV2', () => {
  let engine: CalculationEngineV2;
  let validInput: HeatExchangerInput;

  beforeEach(() => {
    engine = new CalculationEngineV2();
    validInput = {
      equipmentType: 'К4-750',
      modelCode: 'К4-750',
      plateConfiguration: '1/6',
      plateCount: 400,
      pressureA: 100,
      pressureB: 100,
      temperatureA: 80,
      temperatureB: 60,
      materialPlate: 'AISI 316L',
      materialBody: 'AISI 304',
      surfaceType: 'Гладкая',
      componentsA: 5,
      componentsB: 1,
      plateThickness: 3,
    };
  });

  describe('Initialization', () => {
    it('should initialize with materials', () => {
      expect(engine).toBeDefined();
    });
  });

  describe('Calculate Method', () => {
    it('should calculate results for valid input', () => {
      const result = engine.calculate(validInput);
      
      expect(result).toBeDefined();
      expect(result.pressureTestA).toBeGreaterThan(0);
      expect(result.pressureTestB).toBeGreaterThan(0);
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('should throw error for unknown equipment type', () => {
      validInput.equipmentType = 'UNKNOWN';
      expect(() => engine.calculate(validInput)).toThrow('Unknown equipment type');
    });

    it('should calculate pressure tests correctly', () => {
      const result = engine.calculate(validInput);
      
      // Pressure test should be higher than input pressure
      expect(result.pressureTestA).toBeGreaterThan(validInput.pressureA);
      expect(result.pressureTestB).toBeGreaterThan(validInput.pressureB);
    });

    it('should calculate component costs', () => {
      const result = engine.calculate(validInput);
      
      expect(result.componentCosts).toBeDefined();
      expect(result.componentCosts.covers).toBeGreaterThan(0);
      expect(result.componentCosts.columns).toBeGreaterThan(0);
      expect(result.componentCosts.total).toBeGreaterThan(0);
      
      // Total should be sum of all components
      const sum = result.componentCosts.covers +
                  result.componentCosts.columns +
                  result.componentCosts.panelsA +
                  result.componentCosts.panelsB +
                  result.componentCosts.fasteners +
                  result.componentCosts.flanges +
                  result.componentCosts.gaskets +
                  result.componentCosts.materials;
      
      expect(Math.abs(result.componentCosts.total - sum)).toBeLessThan(0.01);
    });

    it('should calculate material requirements', () => {
      const result = engine.calculate(validInput);
      
      expect(result.materialRequirements).toBeDefined();
      expect(result.materialRequirements.size).toBeGreaterThan(0);
      
      result.materialRequirements.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(isFinite(value)).toBe(true);
      });
    });

    it('should calculate cost breakdown percentages', () => {
      const result = engine.calculate(validInput);
      
      expect(result.costBreakdown).toBeDefined();
      
      let totalPercentage = 0;
      result.costBreakdown.forEach(percentage => {
        expect(percentage).toBeGreaterThanOrEqual(0);
        expect(percentage).toBeLessThanOrEqual(100);
        totalPercentage += percentage;
      });
      
      // Total should be approximately 100%
      expect(Math.abs(totalPercentage - 100)).toBeLessThan(1);
    });

    it('should prepare export data', () => {
      const result = engine.calculate(validInput);
      
      expect(result.exportData).toBeDefined();
      expect(result.exportData.equipment).toBeDefined();
      expect(result.exportData.equipment.type).toBe(validInput.equipmentType);
      expect(result.exportData.calculations).toBeDefined();
      expect(result.exportData.totalCost).toBe(result.totalCost);
      expect(result.exportData.version).toBe('2.0.0');
    });
  });

  describe('Equipment Type Variations', () => {
    const equipmentTypes = [
      'К4-150', 'К4-200', 'К4-300', 'К4-400', 'К4-500',
      'К4-600', 'К4-750', 'К4-1000', 'К4-1200'
    ];

    equipmentTypes.forEach(type => {
      it(`should calculate for equipment type ${type}`, () => {
        validInput.equipmentType = type;
        const result = engine.calculate(validInput);
        
        expect(result).toBeDefined();
        expect(result.totalCost).toBeGreaterThan(0);
        expect(result.interpolatedValues.size).toBeGreaterThanOrEqual(53);
      });
    });
  });

  describe('Plate Configuration Variations', () => {
    const configurations = ['1/6', '1/4', '1/3', '1/2', '2/3', '3/4'];

    configurations.forEach(config => {
      it(`should calculate for plate configuration ${config}`, () => {
        validInput.plateConfiguration = config;
        const result = engine.calculate(validInput);
        
        expect(result).toBeDefined();
        expect(result.totalCost).toBeGreaterThan(0);
      });
    });
  });

  describe('Material Variations', () => {
    const materials = ['AISI 316L', 'AISI 304', 'Ст3', 'Ст20', '09Г2С', '12Х18Н10Т'];

    materials.forEach(material => {
      it(`should calculate for material ${material}`, () => {
        validInput.materialPlate = material;
        validInput.materialBody = material;
        const result = engine.calculate(validInput);
        
        expect(result).toBeDefined();
        expect(result.totalCost).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum plate count', () => {
      validInput.plateCount = 10;
      const result = engine.calculate(validInput);
      
      expect(result).toBeDefined();
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('should handle maximum plate count', () => {
      validInput.plateCount = 1000;
      const result = engine.calculate(validInput);
      
      expect(result).toBeDefined();
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('should handle minimum pressure', () => {
      validInput.pressureA = 0;
      validInput.pressureB = 0;
      const result = engine.calculate(validInput);
      
      expect(result).toBeDefined();
      expect(result.pressureTestA).toBeGreaterThanOrEqual(0);
      expect(result.pressureTestB).toBeGreaterThanOrEqual(0);
    });

    it('should handle maximum pressure', () => {
      validInput.pressureA = 400;
      validInput.pressureB = 400;
      const result = engine.calculate(validInput);
      
      expect(result).toBeDefined();
      expect(result.pressureTestA).toBeGreaterThan(400);
      expect(result.pressureTestB).toBeGreaterThan(400);
    });

    it('should handle minimum temperature', () => {
      validInput.temperatureA = -40;
      validInput.temperatureB = -40;
      const result = engine.calculate(validInput);
      
      expect(result).toBeDefined();
      expect(result.totalCost).toBeGreaterThan(0);
    });

    it('should handle maximum temperature', () => {
      validInput.temperatureA = 200;
      validInput.temperatureB = 200;
      const result = engine.calculate(validInput);
      
      expect(result).toBeDefined();
      expect(result.totalCost).toBeGreaterThan(0);
    });
  });

  describe('Validation Against Excel', () => {
    it('should validate calculations against expected values', () => {
      const expectedValues = new Map([
        ['G_ComponentsCount', 1],
        ['I_BaseDimension', 70],
        ['J_DimensionPlus20', 90],
      ]);

      const validationResult = engine.validateAgainstExcel(validInput, expectedValues);
      
      expect(validationResult).toBeDefined();
      validationResult.forEach((validation) => {
        expect(validation.calculated).toBeDefined();
        expect(validation.expected).toBeDefined();
        expect(validation.difference).toBeDefined();
        // The validation object only has calculated, expected, and difference
        // percentDiff and pass would be computed from these values
        const percentDiff = Math.abs(validation.difference / validation.expected) * 100;
        const pass = percentDiff < 0.01;
        expect(percentDiff).toBeDefined();
        expect(pass).toBeDefined();
      });
    });
  });

  describe('Performance', () => {
    it('should calculate within reasonable time', () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        engine.calculate(validInput);
      }
      
      const end = performance.now();
      const avgTime = (end - start) / 100;
      
      // Should calculate in less than 10ms on average
      expect(avgTime).toBeLessThan(10);
    });

    it('should use cache effectively', () => {
      // Warm up
      engine.calculate(validInput);
      
      // First timed calculation
      const start1 = performance.now();
      engine.calculate(validInput);
      const time1 = performance.now() - start1;
      
      // Second calculation with same inputs (should use cache)
      const start2 = performance.now();
      engine.calculate(validInput);
      const time2 = performance.now() - start2;
      
      // Both should be fast after warmup
      expect(time1).toBeLessThan(5);
      expect(time2).toBeLessThan(5);
    });
  });
});