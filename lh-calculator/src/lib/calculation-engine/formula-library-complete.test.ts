import { describe, it, expect, beforeEach } from 'vitest';
import type { FormulaContext, HeatExchangerInput } from './types';
import {
  CEILING_PRECISE,
  FLOOR_PRECISE,
  VLOOKUP,
  calc_G_ComponentsCount,
  calc_H_CoverArea,
  calc_I_BaseDimension,
  calc_J_DimensionPlus20,
  calc_K_ColumnHeightBase,
  calc_L_ComponentVolume,
  calc_M_DimensionPlus10,
  calc_N_ColumnHeightRepeat,
  calc_O_SecondaryVolume,
  calc_P_WidthCalculation,
  calc_Q_HeightCalculation,
  calc_R_AreaCalculation,
  calc_S_AdditionalDimension,
  calc_T_DimensionPlusOffset,
  calc_W_OffsetCalculation,
  calc_X_WidthWithOffset,
  calc_Y_HeightWithOffset,
  calc_Z_SimpleOffset,
  calc_AA_Perimeter,
  calc_AB_PerimeterVolume,
  calc_PressureTest,
  executeAllCalculations,
} from './formula-library-complete';

describe('Excel Formula Utilities', () => {
  describe('CEILING_PRECISE', () => {
    it('should round up to precision', () => {
      expect(CEILING_PRECISE(4.3, 1)).toBe(5);
      expect(CEILING_PRECISE(4.3, 0.5)).toBe(4.5);
      expect(CEILING_PRECISE(4.3, 0.1)).toBe(4.3);
      expect(CEILING_PRECISE(4.32, 0.1)).toBe(4.4);
    });
  });

  describe('FLOOR_PRECISE', () => {
    it('should round down to precision', () => {
      expect(FLOOR_PRECISE(4.7, 1)).toBe(4);
      expect(FLOOR_PRECISE(4.7, 0.5)).toBe(4.5);
      expect(FLOOR_PRECISE(4.78, 0.1)).toBe(4.7);
    });
  });

  describe('VLOOKUP', () => {
    it('should find exact match', () => {
      const table = new Map([[10, 100], [20, 200], [30, 300]]);
      expect(VLOOKUP(20, table)).toBe(200);
    });

    it('should find closest match without interpolation', () => {
      const table = new Map([[10, 100], [20, 200], [30, 300]]);
      expect(VLOOKUP(25, table, false)).toBe(200);
    });

    it('should interpolate between values', () => {
      const table = new Map([[10, 100], [20, 200], [30, 300]]);
      expect(VLOOKUP(15, table, true)).toBe(150);
      expect(VLOOKUP(25, table, true)).toBe(250);
    });
  });
});

describe('Formula Library Calculations', () => {
  let context: FormulaContext;
  let baseInput: HeatExchangerInput;

  beforeEach(() => {
    baseInput = {
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

    context = {
      inputs: baseInput,
      materials: new Map([
        ['AISI 316L', { name: 'AISI 316L', density: 8080, pricePerKg: 850, temperatureStressMatrix: new Map() }],
        ['AISI 304', { name: 'AISI 304', density: 8030, pricePerKg: 750, temperatureStressMatrix: new Map() }],
      ]),
      namedRanges: new Map(),
      intermediateValues: new Map(),
      dependencies: new Map(),
    };
  });

  describe('Column G - Components Count', () => {
    it('should return componentsB value', () => {
      expect(calc_G_ComponentsCount(context)).toBe(1);
      context.inputs.componentsB = 5;
      expect(calc_G_ComponentsCount(context)).toBe(5);
    });
  });

  describe('Column H - Cover Area', () => {
    it('should calculate cover area based on equipment specs', () => {
      const result = calc_H_CoverArea(context);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(2000000); // Reasonable upper bound for large equipment
    });

    it('should return 0 for unknown equipment type', () => {
      context.inputs.equipmentType = 'UNKNOWN';
      expect(calc_H_CoverArea(context)).toBe(0);
    });
  });

  describe('Column I - Base Dimension', () => {
    it('should return dimension based on equipment size', () => {
      expect(calc_I_BaseDimension(context)).toBeGreaterThanOrEqual(40);
      expect(calc_I_BaseDimension(context)).toBeLessThanOrEqual(90);
    });

    it('should return 40 for small equipment', () => {
      context.inputs.equipmentType = 'К4-150';
      expect(calc_I_BaseDimension(context)).toBe(40);
    });
  });

  describe('Column J - Dimension Plus 20', () => {
    it('should add 20 to base dimension', () => {
      const baseDim = calc_I_BaseDimension(context);
      context.intermediateValues.set('I_BaseDimension', baseDim);
      expect(calc_J_DimensionPlus20(context)).toBe(baseDim + 20);
    });
  });

  describe('Column K - Column Height Base', () => {
    it('should calculate column height', () => {
      const result = calc_K_ColumnHeightBase(context);
      expect(result).toBeGreaterThan(2400);
      expect(result).toBeLessThan(10000);
    });

    it('should increase with plate count', () => {
      const result1 = calc_K_ColumnHeightBase(context);
      context.inputs.plateCount = 600;
      const result2 = calc_K_ColumnHeightBase(context);
      expect(result2).toBeGreaterThan(result1);
    });
  });

  describe('Column L - Component Volume', () => {
    it('should calculate primary component volume', () => {
      context.intermediateValues.set('J_DimensionPlus20', 70);
      context.intermediateValues.set('K_ColumnHeightBase', 3000);
      const result = calc_L_ComponentVolume(context);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('Column M - Dimension Plus 10', () => {
    it('should add 10 to base dimension', () => {
      const baseDim = calc_I_BaseDimension(context);
      context.intermediateValues.set('I_BaseDimension', baseDim);
      expect(calc_M_DimensionPlus10(context)).toBe(baseDim + 10);
    });
  });

  describe('Pressure Test Calculation', () => {
    it('should calculate pressure test value', () => {
      const result = calc_PressureTest(100, context);
      expect(result).toBeGreaterThan(100);
      expect(result).toBeLessThan(2000); // Pressure test can be high
    });

    it('should increase with pressure', () => {
      const result1 = calc_PressureTest(50, context);
      const result2 = calc_PressureTest(100, context);
      const result3 = calc_PressureTest(200, context);
      expect(result2).toBeGreaterThan(result1);
      expect(result3).toBeGreaterThan(result2);
    });
  });
});

describe('Complete Calculation Execution', () => {
  let context: FormulaContext;

  beforeEach(() => {
    const baseInput: HeatExchangerInput = {
      equipmentType: 'K4-750',
      modelCode: 'K4-750',
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

    context = {
      inputs: baseInput,
      materials: new Map([
        ['AISI 316L', { name: 'AISI 316L', density: 8080, pricePerKg: 850, temperatureStressMatrix: new Map() }],
        ['AISI 304', { name: 'AISI 304', density: 8030, pricePerKg: 750, temperatureStressMatrix: new Map() }],
      ]),
      namedRanges: new Map(),
      intermediateValues: new Map(),
      dependencies: new Map(),
    };
  });

  it('should execute all 53 calculations', () => {
    const results = executeAllCalculations(context);
    
    // Should have at least 53 calculations (columns G-BI)
    // We actually have 55 because I_BaseDimension is included and U/V are placeholders
    expect(results.size).toBeGreaterThanOrEqual(53);
    
    // Verify key calculations exist
    expect(results.has('G_ComponentsCount')).toBe(true);
    expect(results.has('H_CoverArea')).toBe(true);
    expect(results.has('BI_TotalComponents')).toBe(true);
  });

  it('should produce consistent results on multiple runs', () => {
    // Create fresh context for each run
    const ctx1 = { ...context, intermediateValues: new Map() };
    const ctx2 = { ...context, intermediateValues: new Map() };
    
    const results1 = executeAllCalculations(ctx1);
    const results2 = executeAllCalculations(ctx2);
    
    // Results should be identical
    results1.forEach((value, key) => {
      expect(results2.get(key)).toBeCloseTo(value, 5); // Use closeTo for floating point
    });
  });

  it('should handle different equipment types', () => {
    const equipmentTypes = ['К4-150', 'К4-300', 'К4-500', 'К4-750', 'К4-1000'];
    const results = new Map<string, Map<string, number>>();
    
    equipmentTypes.forEach(type => {
      context.inputs.equipmentType = type;
      results.set(type, executeAllCalculations(context));
    });
    
    // Each equipment type should produce different results
    const values = Array.from(results.values());
    for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        const diff = Array.from(values[i].values()).some((val, idx) => 
          val !== Array.from(values[j].values())[idx]
        );
        expect(diff).toBe(true);
      }
    }
  });

  it('should handle edge cases', () => {
    // Minimum plate count
    context.inputs.plateCount = 10;
    const minResults = executeAllCalculations(context);
    expect(minResults.size).toBe(55); // 53 base + I_BaseDimension + 1 extra
    
    // Maximum plate count
    context.inputs.plateCount = 1000;
    const maxResults = executeAllCalculations(context);
    expect(maxResults.size).toBe(55);  // 53 base + I_BaseDimension + 1 extra
    
    // Different plate configurations
    const configs = ['1/6', '1/4', '1/2', '3/4'];
    configs.forEach(config => {
      context.inputs.plateConfiguration = config;
      const results = executeAllCalculations(context);
      expect(results.size).toBe(55);  // 53 base + I_BaseDimension + 1 extra
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete calculation flow', () => {
    const input: HeatExchangerInput = {
      equipmentType: 'К4-500',
      modelCode: 'К4-500',
      plateConfiguration: '1/4',
      plateCount: 250,
      pressureA: 75,
      pressureB: 80,
      temperatureA: 70,
      temperatureB: 50,
      materialPlate: 'AISI 316L',
      materialBody: 'AISI 316L',
      surfaceType: 'Рифленая',
      componentsA: 4,
      componentsB: 2,
      plateThickness: 2.5,
    };

    const context: FormulaContext = {
      inputs: input,
      materials: new Map([
        ['AISI 316L', { 
          name: 'AISI 316L', 
          density: 8080, 
          pricePerKg: 850, 
          temperatureStressMatrix: new Map([[20, 170], [100, 160]]) 
        }],
      ]),
      namedRanges: new Map(),
      intermediateValues: new Map(),
      dependencies: new Map(),
    };

    const results = executeAllCalculations(context);
    
    // Verify critical calculations
    expect(results.get('G_ComponentsCount')).toBe(2);
    expect(results.get('I_BaseDimension')).toBeGreaterThan(0);
    expect(results.get('K_ColumnHeightBase')).toBeGreaterThan(2400);
    
    // Verify all calculations produce numeric results
    results.forEach((value, key) => {
      expect(typeof value).toBe('number');
      expect(isNaN(value)).toBe(false);
      expect(isFinite(value)).toBe(true);
    });
  });
});