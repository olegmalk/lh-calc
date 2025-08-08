import { describe, it, expect } from 'vitest';
import { 
  CEILING_PRECISE, 
  calc_AI73_TestPressureHot, 
  calc_AJ73_TestPressureCold 
} from './formula-library-complete';
import type { FormulaContext } from './types';

describe('Test Pressure Calculations - Story 1 Critical Safety', () => {
  
  describe('CEILING_PRECISE function', () => {
    it('should implement Excel CEILING.PRECISE correctly', () => {
      // Test basic functionality
      expect(CEILING_PRECISE(4.3, 1)).toBe(5);
      expect(CEILING_PRECISE(4.3, 0.5)).toBe(4.5);
      expect(CEILING_PRECISE(4.3, 0.1)).toBe(4.3);
      expect(CEILING_PRECISE(4.32, 0.1)).toBe(4.4);
      
      // Test 0.01 precision (critical for safety calculations)
      expect(CEILING_PRECISE(31.456, 0.01)).toBe(31.46);
      expect(CEILING_PRECISE(31.451, 0.01)).toBe(31.46);
      expect(CEILING_PRECISE(31.460, 0.01)).toBe(31.46);
      expect(CEILING_PRECISE(31.461, 0.01)).toBeCloseTo(31.47, 2);
      
      // Edge cases
      expect(CEILING_PRECISE(0, 0.01)).toBe(0);
      expect(CEILING_PRECISE(31.46, 0.01)).toBe(31.46); // Exact value
    });
    
    it('should handle very high pressures', () => {
      expect(CEILING_PRECISE(399.99, 0.01)).toBe(399.99);
      expect(CEILING_PRECISE(399.991, 0.01)).toBe(400.00);
    });
  });

  describe('calc_AI73_TestPressureHot', () => {
    const createContext = (pressureA: number): FormulaContext => ({
      inputs: {
        equipmentType: 'К4-750',
        modelCode: 'К4-750',
        plateConfiguration: '1/6',
        plateCount: 400,
        pressureA,
        pressureB: 22,
        temperatureA: 100,
        temperatureB: 60,
        materialPlate: '09Г2С',
        materialBody: '09Г2С',
        surfaceType: 'гофра',
        plateThickness: 1.0
      },
      materials: new Map(),
      namedRanges: new Map(),
      intermediateValues: new Map(),
      dependencies: new Map()
    });

    it('should calculate exactly 31.46 for J27=22 (test scenario)', () => {
      const ctx = createContext(22);
      const result = calc_AI73_TestPressureHot(ctx);
      expect(result).toBe(31.46);
    });

    it('should use simple formula J27 * 1.43', () => {
      // Test various pressure values
      expect(calc_AI73_TestPressureHot(createContext(10))).toBe(14.30);
      expect(calc_AI73_TestPressureHot(createContext(25))).toBe(35.75);
      expect(calc_AI73_TestPressureHot(createContext(50))).toBe(71.50);
      expect(calc_AI73_TestPressureHot(createContext(100))).toBe(143.00);
    });

    it('should handle zero pressure', () => {
      const ctx = createContext(0);
      const result = calc_AI73_TestPressureHot(ctx);
      expect(result).toBe(0);
    });

    it('should handle fractional pressures with CEILING.PRECISE', () => {
      const ctx = createContext(22.5);
      const result = calc_AI73_TestPressureHot(ctx);
      // 22.5 * 1.43 = 32.175, CEILING.PRECISE to 0.01 = 32.18
      expect(result).toBe(32.18);
    });

    it('should handle high pressures correctly', () => {
      const ctx = createContext(300);
      const result = calc_AI73_TestPressureHot(ctx);
      // 300 * 1.43 = 429.00
      expect(result).toBe(429.00);
    });

    it('should be independent of material and temperature', () => {
      // Test with different materials - should give same result
      const ctx1 = createContext(22);
      ctx1.inputs.materialPlate = 'AISI 316L';
      ctx1.inputs.temperatureA = 150;
      
      const ctx2 = createContext(22);
      ctx2.inputs.materialPlate = 'AISI 304';
      ctx2.inputs.temperatureB = 80;
      
      expect(calc_AI73_TestPressureHot(ctx1)).toBe(31.46);
      expect(calc_AI73_TestPressureHot(ctx2)).toBe(31.46);
    });
  });

  describe('calc_AJ73_TestPressureCold', () => {
    const createContext = (pressureB: number): FormulaContext => ({
      inputs: {
        equipmentType: 'К4-750',
        modelCode: 'К4-750',
        plateConfiguration: '1/6',
        plateCount: 400,
        pressureA: 22,
        pressureB,
        temperatureA: 100,
        temperatureB: 60,
        materialPlate: '09Г2С',
        materialBody: '09Г2С',
        surfaceType: 'гофра',
        plateThickness: 1.0
      },
      materials: new Map(),
      namedRanges: new Map(),
      intermediateValues: new Map(),
      dependencies: new Map()
    });

    it('should calculate exactly 31.46 for K27=22 (test scenario)', () => {
      const ctx = createContext(22);
      const result = calc_AJ73_TestPressureCold(ctx);
      expect(result).toBe(31.46);
    });

    it('should use simple formula K27 * 1.43', () => {
      // Test various pressure values
      expect(calc_AJ73_TestPressureCold(createContext(10))).toBe(14.30);
      expect(calc_AJ73_TestPressureCold(createContext(25))).toBe(35.75);
      expect(calc_AJ73_TestPressureCold(createContext(50))).toBe(71.50);
      expect(calc_AJ73_TestPressureCold(createContext(100))).toBe(143.00);
    });

    it('should handle zero pressure', () => {
      const ctx = createContext(0);
      const result = calc_AJ73_TestPressureCold(ctx);
      expect(result).toBe(0);
    });

    it('should handle fractional pressures with CEILING.PRECISE', () => {
      const ctx = createContext(15.5);
      const result = calc_AJ73_TestPressureCold(ctx);
      // 15.5 * 1.43 = 22.165, CEILING.PRECISE to 0.01 = 22.17
      expect(result).toBe(22.17);
    });

    it('should be independent of material and temperature', () => {
      // Test with different materials - should give same result
      const ctx1 = createContext(22);
      ctx1.inputs.materialPlate = 'AISI 316L';
      ctx1.inputs.temperatureB = 150;
      
      const ctx2 = createContext(22);
      ctx2.inputs.materialPlate = 'AISI 304';
      ctx2.inputs.temperatureB = 80;
      
      expect(calc_AJ73_TestPressureCold(ctx1)).toBe(31.46);
      expect(calc_AJ73_TestPressureCold(ctx2)).toBe(31.46);
    });
  });

  describe('Integration with Calculation Engine', () => {
    it('should provide consistent results between hot and cold when pressures are equal', () => {
      const ctx: FormulaContext = {
        inputs: {
          equipmentType: 'К4-750',
          modelCode: 'К4-750',
          plateConfiguration: '1/6',
          plateCount: 400,
          pressureA: 22, // Same as pressureB
          pressureB: 22, // Same as pressureA
          temperatureA: 100,
          temperatureB: 60,
          materialPlate: '09Г2С',
          materialBody: '09Г2С',
          surfaceType: 'гофра',
          plateThickness: 1.0
        },
        materials: new Map(),
        namedRanges: new Map(),
        intermediateValues: new Map(),
        dependencies: new Map()
      };

      const hotPressure = calc_AI73_TestPressureHot(ctx);
      const coldPressure = calc_AJ73_TestPressureCold(ctx);
      
      expect(hotPressure).toBe(coldPressure);
      expect(hotPressure).toBe(31.46);
    });

    it('should handle different pressure combinations correctly', () => {
      const ctx: FormulaContext = {
        inputs: {
          equipmentType: 'К4-750',
          modelCode: 'К4-750',
          plateConfiguration: '1/6',
          plateCount: 400,
          pressureA: 30, // Higher hot pressure
          pressureB: 15, // Lower cold pressure
          temperatureA: 100,
          temperatureB: 60,
          materialPlate: '09Г2С',
          materialBody: '09Г2С',
          surfaceType: 'гофра',
          plateThickness: 1.0
        },
        materials: new Map(),
        namedRanges: new Map(),
        intermediateValues: new Map(),
        dependencies: new Map()
      };

      const hotPressure = calc_AI73_TestPressureHot(ctx);  // 30 * 1.43 = 42.90
      const coldPressure = calc_AJ73_TestPressureCold(ctx); // 15 * 1.43 = 21.45
      
      expect(hotPressure).toBe(42.90);
      expect(coldPressure).toBe(21.45);
      expect(hotPressure).toBeGreaterThan(coldPressure);
    });
  });

  describe('Safety and Edge Cases', () => {
    const createTestContext = (pressureA: number, pressureB: number): FormulaContext => ({
      inputs: {
        equipmentType: 'К4-750',
        modelCode: 'К4-750',
        plateConfiguration: '1/6',
        plateCount: 400,
        pressureA,
        pressureB,
        temperatureA: 100,
        temperatureB: 60,
        materialPlate: '09Г2С',
        materialBody: '09Г2С',
        surfaceType: 'гофра',
        plateThickness: 1.0
      },
      materials: new Map(),
      namedRanges: new Map(),
      intermediateValues: new Map(),
      dependencies: new Map()
    });

    it('should handle very small pressures', () => {
      const ctx = createTestContext(0.01, 0.01);
      
      const hotPressure = calc_AI73_TestPressureHot(ctx);
      const coldPressure = calc_AJ73_TestPressureCold(ctx);
      
      // 0.01 * 1.43 = 0.0143, CEILING.PRECISE to 0.01 = 0.02
      expect(hotPressure).toBe(0.02);
      expect(coldPressure).toBe(0.02);
    });

    it('should handle maximum typical pressures', () => {
      const ctx = createTestContext(400, 400);
      
      const hotPressure = calc_AI73_TestPressureHot(ctx);
      const coldPressure = calc_AJ73_TestPressureCold(ctx);
      
      // 400 * 1.43 = 572.00
      expect(hotPressure).toBe(572.00);
      expect(coldPressure).toBe(572.00);
    });

    it('should maintain precision for safety-critical values', () => {
      // Test values that could be problematic with floating point precision
      const testValues = [22.333333, 22.666666, 23.000001];
      
      testValues.forEach(pressure => {
        const ctx = createTestContext(pressure, pressure);
        const hotResult = calc_AI73_TestPressureHot(ctx);
        const coldResult = calc_AJ73_TestPressureCold(ctx);
        
        // Ensure results are equal and valid numbers
        expect(Number.isFinite(hotResult)).toBe(true);
        expect(Number.isFinite(coldResult)).toBe(true);
        expect(hotResult).toBe(coldResult);
      });
    });

    it('should be deterministic across multiple calls', () => {
      const ctx = createTestContext(22, 22);
      
      const results = Array.from({ length: 100 }, () => ({
        hot: calc_AI73_TestPressureHot(ctx),
        cold: calc_AJ73_TestPressureCold(ctx)
      }));
      
      // All results should be identical
      expect(results.every(r => r.hot === 31.46)).toBe(true);
      expect(results.every(r => r.cold === 31.46)).toBe(true);
    });
  });
});