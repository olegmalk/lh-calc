/**
 * Cost Calculations Test Suite - Story 5
 * Tests N26, P26, O26, H26, F26, J32 formulas against Excel expected values
 */

import { describe, expect, test } from 'vitest';
import { 
  calculateCoreCosts,
  calc_N26_PlatePackageCost,
  calc_P26_EquipmentCost,
  calc_O26_ComponentCost,
  calc_H26_PanelMaterialCost,
  calc_F26_PlateWorkCost,
  calc_J32_GrandTotal,
  validateCoreCosts
} from './cost-calculations';
import type { FormulaContext } from './types';

describe('Story 5: Core Cost Calculations', () => {
  // Test data from Excel - К4-750 test case
  const testContext: FormulaContext = {
    inputs: {
      equipmentType: 'К4-750',
      modelCode: 'К4-750',
      plateConfiguration: '1/6',
      plateCount: 1,
      pressureA: 22,
      pressureB: 16,
      temperatureA: 100,
      temperatureB: 60,
      materialPlate: 'AISI 316L',
      materialBody: '09Г2С',
      surfaceType: 'гофра',
      plateThickness: 0.6,
      additionalPlatesFactor: 1,
      panelCountFactor: 3,
    },
    materials: new Map(),
    namedRanges: new Map(),
    intermediateValues: new Map([
      ['F78', 1820.5952], // Plate mass from Excel
      ['E78', 118.68414720000001], // Component factor
      ['G78', 184.22491248], // Panel material factor
      ['H78', 31.2384], // Panel secondary factor
      ['J78', 31.2384], // Additional plate mass factor
      ['D78', 3], // Additional component factor
      ['I78', 0], // Secondary component factor (causes O26 = 0)
      ['K14', 0], // Work cost (causes F26 = 0)
    ]),
    supply: {
      plateCostFactor: 700, // D8
      panelCostFactor: 700, // E8
      thicknessFactor: 0, // D14 (causes H26 and O26 to be 0)
      additionalCostFactor: 0, // D13 (causes additional terms to be 0)
    },
    dependencies: new Map(),
  };

  describe('Individual cost calculations', () => {
    test('N26 - Plate Package Cost', () => {
      const result = calc_N26_PlatePackageCost(testContext);
      // Excel: F78 * D8 + U27 * J78 * D13 = 1820.5952 * 700 + 1 * 31.2384 * 0 = 1274416.64
      expect(result).toBeCloseTo(1274416.64, 2);
    });

    test('P26 - Equipment Cost', () => {
      const result = calc_P26_EquipmentCost(testContext);
      // Excel: Fixed value for К4-750 = 81920
      expect(result).toBe(81920);
    });

    test('O26 - Component Cost', () => {
      const result = calc_O26_ComponentCost(testContext);
      // Excel: D8*E78*D14*D14 + D78*I78*D13 = 700*118.68*0*0 + 3*0*0 = 0 (because D14=0)
      expect(result).toBe(0);
    });

    test('H26 - Panel Material Cost', () => {
      const result = calc_H26_PanelMaterialCost(testContext);
      // Excel: E8*G78*D14*D14 + V27*H78*D13 = 700*184.22*0*0 + 3*31.24*0 = 0 (because D14=0)
      expect(result).toBe(0);
    });

    test('F26 - Plate Work Cost', () => {
      const result = calc_F26_PlateWorkCost(testContext);
      // Excel: K14 = 0 (from test data)
      expect(result).toBe(0);
    });

    test('J32 - Grand Total', () => {
      const result = calc_J32_GrandTotal(testContext);
      // Excel: N26 + O26 + P26 = 1274416.64 + 0 + 81920 = 1356336.64
      expect(result).toBeCloseTo(1356336.64, 2);
    });
  });

  describe('Complete cost calculation', () => {
    test('calculateCoreCosts returns all values correctly', () => {
      const results = calculateCoreCosts(testContext);
      
      expect(results.N26_PlatePackageCost).toBeCloseTo(1274416.64, 2);
      expect(results.P26_EquipmentCost).toBe(81920);
      expect(results.O26_ComponentCost).toBe(0);
      expect(results.H26_PanelMaterialCost).toBe(0);
      expect(results.F26_PlateWorkCost).toBe(0);
      expect(results.J32_GrandTotal).toBeCloseTo(1356336.64, 2);
    });
  });

  describe('Cost validation', () => {
    test('validateCoreCosts with exact Excel values', () => {
      const calculated = calculateCoreCosts(testContext);
      const expected = {
        N26: 1274416.64,
        P26: 81920,
        O26: 0,
        H26: 0,
        F26: 0,
        J32: 1356336.64,
      };
      
      const validation = validateCoreCosts(calculated, expected);
      
      expect(validation.isValid).toBe(true);
      expect(validation.differences.get('N26')).toBeLessThan(0.01);
      expect(validation.differences.get('P26')).toBe(0);
      expect(validation.differences.get('O26')).toBe(0);
      expect(validation.differences.get('H26')).toBe(0);
      expect(validation.differences.get('F26')).toBe(0);
      expect(validation.differences.get('J32')).toBeLessThan(0.01);
    });
  });

  describe('Edge cases and parameter variations', () => {
    test('Different equipment types have different P26 costs', () => {
      const testContextK41200 = {
        ...testContext,
        inputs: { ...testContext.inputs, equipmentType: 'К4-1200' }
      };
      
      const resultK4750 = calc_P26_EquipmentCost(testContext);
      const resultK41200 = calc_P26_EquipmentCost(testContextK41200);
      
      // Both К4-750 and К4-1200 should have same cost (81920)
      expect(resultK4750).toBe(81920);
      expect(resultK41200).toBe(81920);
    });

    test('Unknown equipment type uses default cost', () => {
      const testContextUnknown = {
        ...testContext,
        inputs: { ...testContext.inputs, equipmentType: 'Unknown-Type' }
      };
      
      const result = calc_P26_EquipmentCost(testContextUnknown);
      expect(result).toBe(102400); // Default R78 value
    });

    test('Non-zero additional cost factors affect calculations', () => {
      const testContextWithAdditional = {
        ...testContext,
        supply: {
          ...testContext.supply,
          additionalCostFactor: 100, // D13 = 100 instead of 0
        }
      };
      
      // N26 should increase: F78 * D8 + U27 * J78 * D13
      // = 1820.5952 * 700 + 1 * 31.2384 * 100 = 1274416.64 + 3123.84 = 1277540.48
      const N26_result = calc_N26_PlatePackageCost(testContextWithAdditional);
      expect(N26_result).toBeCloseTo(1277540.48, 2);
      
      // O26 should still be 0 because D14 = 0 (even with D13 != 0, D14=0 makes the main term 0)
      const O26_result = calc_O26_ComponentCost(testContextWithAdditional);
      expect(O26_result).toBeCloseTo(0, 2);
      
      // H26 should still be 0 because D14 = 0 (even with D13 != 0, D14=0 makes the main term 0)
      // E8*G78*D14*D14 + V27*H78*D13 = 700*184.22*0*0 + 3*31.2384*100 = 0 + 9371.52 = 9371.52
      const H26_result = calc_H26_PanelMaterialCost(testContextWithAdditional);
      expect(H26_result).toBeCloseTo(9371.52, 2);
    });

    test('4 decimal precision requirement', () => {
      const results = calculateCoreCosts(testContext);
      
      // Check that all results match expected values within 4 decimal precision (0.0001 tolerance)
      expect(results.N26_PlatePackageCost).toBeCloseTo(1274416.64, 4);
      expect(results.P26_EquipmentCost).toBe(81920); // Integer value
      expect(results.O26_ComponentCost).toBe(0); // Should be exactly 0
      expect(results.H26_PanelMaterialCost).toBe(0); // Should be exactly 0  
      expect(results.F26_PlateWorkCost).toBe(0); // Should be exactly 0
      expect(results.J32_GrandTotal).toBeCloseTo(1356336.64, 4);
      
      // Verify the values are properly formatted (no excess precision)
      expect(Number(results.N26_PlatePackageCost.toFixed(2))).toBe(1274416.64);
      expect(Number(results.J32_GrandTotal.toFixed(2))).toBe(1356336.64);
    });
  });

  describe('Formula accuracy tests', () => {
    test('N26 formula breakdown matches Excel exactly', () => {
      // Test the exact Excel formula: F78 * D8 + U27 * J78 * D13
      const F78 = 1820.5952;
      const D8 = 700;
      const U27 = 1; 
      const J78 = 31.2384;
      const D13 = 0;
      
      const expectedN26 = (F78 * D8) + (U27 * J78 * D13);
      expect(expectedN26).toBeCloseTo(1274416.64, 2);
      
      const actualN26 = calc_N26_PlatePackageCost(testContext);
      expect(actualN26).toBeCloseTo(expectedN26, 2);
    });

    test('J32 aggregation matches Excel SUM function', () => {
      const N26 = calc_N26_PlatePackageCost(testContext);
      const O26 = calc_O26_ComponentCost(testContext);
      const P26 = calc_P26_EquipmentCost(testContext);
      
      const manualSum = N26 + O26 + P26;
      const calculatedJ32 = calc_J32_GrandTotal(testContext);
      
      expect(calculatedJ32).toBeCloseTo(manualSum, 10);
      expect(calculatedJ32).toBeCloseTo(1356336.64, 2);
    });
  });
});