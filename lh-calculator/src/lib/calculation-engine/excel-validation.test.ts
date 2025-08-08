import { describe, it, expect } from 'vitest';
import { CalculationEngineV2 } from './engine-v2';
import type { HeatExchangerInput } from './types';

describe('Excel Validation Tests', () => {
  const engine = new CalculationEngineV2();

  describe('К4-750 Equipment - Row 118 Excel Validation', () => {
    const input: HeatExchangerInput = {
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
      plateThickness: 3,
    };

    it('should calculate pressure tests matching Excel', () => {
      const result = engine.calculate(input);
      
      // Excel формула: =ОКРВВЕРХ(1.25*B60*AA60/ПРОСМОТР(B60;Z60:Z68;AA60:AA68;1);0.01)
      // Where B60=100 (pressure), AA60=1800, safety factor=1.25
      // Expected: around 1406.25 based on interpolation
      expect(result.pressureTestHot).toBeGreaterThan(1400);
      expect(result.pressureTestHot).toBeLessThan(1410);
      
      expect(result.pressureTestCold).toBeGreaterThan(1400);
      expect(result.pressureTestCold).toBeLessThan(1410);
    });

    it('should calculate base dimensions correctly', () => {
      const result = engine.calculate(input);
      
      // For К4-750 (600x580), expected base dimension is 70
      const baseDimension = result.interpolatedValues.get('I_BaseDimension');
      expect(baseDimension).toBe(70);
      
      // J = I + 20
      const J = result.interpolatedValues.get('J_DimensionPlus20');
      expect(J).toBe(90);
      
      // M = I + 10
      const M = result.interpolatedValues.get('M_DimensionPlus10');
      expect(M).toBe(80);
    });

    it('should calculate column height correctly', () => {
      const result = engine.calculate(input);
      
      // K = 2400 + (componentsA + componentsB) * plateCount + 10
      // K = 2400 + (5 + 1) * 400 + 10 = 2400 + 2400 + 10 = 4810
      const K = result.interpolatedValues.get('K_ColumnHeightBase');
      expect(K).toBe(4810);
    });

    it('should calculate component volumes', () => {
      const result = engine.calculate(input);
      
      // L = J * K * thickness * density / 1000000 * 4
      // L = 90 * 4810 * 3 * 8080 / 1000000 * 4
      const L = result.interpolatedValues.get('L_ComponentVolume');
      expect(L).toBeGreaterThan(41900); // Value is in larger units
      expect(L).toBeLessThan(42000);
      
      // O = M * N * thickness * density / 1000000 * 4
      const O = result.interpolatedValues.get('O_SecondaryVolume');
      expect(O).toBeGreaterThan(37200);
      expect(O).toBeLessThan(37400); // Allow small tolerance
    });

    it('should calculate area dimensions', () => {
      const result = engine.calculate(input);
      
      // P = width + 2*I + 10 = 600 + 2*70 + 10 = 750
      const P = result.interpolatedValues.get('P_WidthCalculation');
      expect(P).toBe(750);
      
      // Q = height + 15 + 2*I + 10 = 580 + 15 + 2*70 + 10 = 745
      const Q = result.interpolatedValues.get('Q_HeightCalculation');
      expect(Q).toBe(745);
    });

    it('should calculate total cost components', () => {
      const result = engine.calculate(input);
      
      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.componentCosts.total).toBeGreaterThan(0);
      
      // Check all component costs are calculated
      expect(result.componentCosts.covers).toBeGreaterThan(0);
      expect(result.componentCosts.columns).toBeGreaterThan(0);
      expect(result.componentCosts.panelsA).toBeGreaterThan(0);
      expect(result.componentCosts.panelsB).toBeGreaterThan(0);
      expect(result.componentCosts.fasteners).toBeGreaterThan(0);
      expect(result.componentCosts.flanges).toBeGreaterThan(0);
      expect(result.componentCosts.gaskets).toBeGreaterThan(0);
    });
  });

  describe('К4-150 Equipment - Row 110 Excel Validation', () => {
    const input: HeatExchangerInput = {
      equipmentType: 'К4-150',
      modelCode: 'К4-150',
      plateConfiguration: '1/6',
      plateCount: 100,
      pressureA: 50,
      pressureB: 50,
      temperatureA: 60,
      temperatureB: 40,
      materialPlate: 'AISI 304',
      materialBody: 'AISI 304',
      surfaceType: 'Гладкая',
      plateThickness: 2,
    };

    it('should calculate smaller equipment correctly', () => {
      const result = engine.calculate(input);
      
      // Base dimension should be 40 for К4-150
      const baseDimension = result.interpolatedValues.get('I_BaseDimension');
      expect(baseDimension).toBe(40);
      
      // Column height: 2400 + (3+1)*100 + 10 = 2810
      const K = result.interpolatedValues.get('K_ColumnHeightBase');
      expect(K).toBe(2810);
      
      // Width calculation: 143 + 2*40 + 10 = 233
      const P = result.interpolatedValues.get('P_WidthCalculation');
      expect(P).toBe(233);
      
      // Height calculation: 128 + 15 + 2*40 + 10 = 233
      const Q = result.interpolatedValues.get('Q_HeightCalculation');
      expect(Q).toBe(233);
    });

    it('should calculate pressure test for lower pressure', () => {
      const result = engine.calculate(input);
      
      // Lower pressure should result in lower test pressure
      expect(result.pressureTestHot).toBeGreaterThan(50);
      expect(result.pressureTestHot).toBeLessThan(1000);
    });
  });

  describe('К4-1200*600 Equipment - Row 122 Excel Validation', () => {
    const input: HeatExchangerInput = {
      equipmentType: 'К4-1200*600',
      modelCode: 'К4-1200*600',
      plateConfiguration: '2/3',
      plateCount: 800,
      pressureA: 200,
      pressureB: 180,
      temperatureA: 120,
      temperatureB: 100,
      materialPlate: 'AISI 316L',
      materialBody: 'AISI 316L',
      surfaceType: 'Рифленая',
      plateThickness: 4,
    };

    it('should calculate largest equipment correctly', () => {
      const result = engine.calculate(input);
      
      // Base dimension should be 90 for К4-1200*600
      const baseDimension = result.interpolatedValues.get('I_BaseDimension');
      expect(baseDimension).toBe(90);
      
      // Column height: 2400 + (8+2)*800 + 10 = 10410
      const K = result.interpolatedValues.get('K_ColumnHeightBase');
      expect(K).toBe(10410);
      
      // Width calculation: 950 + 2*90 + 10 = 1140
      const P = result.interpolatedValues.get('P_WidthCalculation');
      expect(P).toBe(1140);
      
      // Height calculation: 600 + 15 + 2*90 + 10 = 805
      const Q = result.interpolatedValues.get('Q_HeightCalculation');
      expect(Q).toBe(805);
    });

    it('should handle different plate configuration', () => {
      const result = engine.calculate(input);
      
      // With 2/3 configuration, calculations should adjust
      const AR = result.interpolatedValues.get('AR_PlateConfigCalc1');
      expect(AR).toBeDefined();
      expect(AR).toBeGreaterThan(0);
      
      const AS = result.interpolatedValues.get('AS_PlateConfigCalc2');
      expect(AS).toBeDefined();
      expect(AS).toBeGreaterThan(0);
    });
  });

  describe('Interpolation and Formula Accuracy', () => {
    it('should match Excel VLOOKUP interpolation', () => {
      const testCases = [
        { equipmentType: 'К4-300', plateCount: 200, expectedBaseDim: 50 },
        { equipmentType: 'К4-500', plateCount: 350, expectedBaseDim: 60 },
        { equipmentType: 'К4-1000', plateCount: 700, expectedBaseDim: 80 },
      ];

      testCases.forEach(testCase => {
        const input: HeatExchangerInput = {
          equipmentType: testCase.equipmentType,
          modelCode: testCase.equipmentType,
          plateConfiguration: '1/6',
          plateCount: testCase.plateCount,
          pressureA: 75,
          pressureB: 75,
          temperatureA: 70,
          temperatureB: 50,
          materialPlate: 'AISI 316L',
          materialBody: 'AISI 304',
          surfaceType: 'Гладкая',
          plateThickness: 2.5,
        };

        const result = engine.calculate(input);
        const baseDim = result.interpolatedValues.get('I_BaseDimension');
        expect(baseDim).toBe(testCase.expectedBaseDim);
      });
    });

    it('should calculate material totals correctly', () => {
      const input: HeatExchangerInput = {
        equipmentType: 'К4-500',
        modelCode: 'К4-500',
        plateConfiguration: '1/4',
        plateCount: 300,
        pressureA: 80,
        pressureB: 80,
        temperatureA: 75,
        temperatureB: 55,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 304',
        surfaceType: 'Гладкая',
        plateThickness: 3,
      };

      const result = engine.calculate(input);
      
      // BA = sum of AL through AS calculations
      const BA = result.interpolatedValues.get('BA_MaterialTotal');
      expect(BA).toBeDefined();
      expect(BA).toBeGreaterThan(0);
      
      // BI = (BE + BF) * 2, final total
      const BI = result.interpolatedValues.get('BI_TotalComponents');
      expect(BI).toBeDefined();
      expect(BI).toBeGreaterThan(0);
    });
  });

  describe('Cost Calculation Validation', () => {
    it('should calculate costs proportionally to materials', () => {
      const smallInput: HeatExchangerInput = {
        equipmentType: 'К4-150',
        modelCode: 'К4-150',
        plateConfiguration: '1/6',
        plateCount: 50,
        pressureA: 25,
        pressureB: 25,
        temperatureA: 40,
        temperatureB: 30,
        materialPlate: 'Ст3', // Cheaper material
        materialBody: 'Ст3',
        surfaceType: 'Гладкая',
        plateThickness: 1.5,
      };

      const largeInput: HeatExchangerInput = {
        equipmentType: 'К4-1200',
        modelCode: 'К4-1200',
        plateConfiguration: '1/6',
        plateCount: 500,
        pressureA: 150,
        pressureB: 150,
        temperatureA: 100,
        temperatureB: 80,
        materialPlate: 'AISI 316L', // Expensive material
        materialBody: 'AISI 316L',
        surfaceType: 'Гладкая',
        plateThickness: 4,
      };

      const smallResult = engine.calculate(smallInput);
      const largeResult = engine.calculate(largeInput);
      
      // Large equipment with expensive materials should cost more
      expect(largeResult.totalCost).toBeGreaterThan(smallResult.totalCost * 3);
      
      // Component costs should scale
      expect(largeResult.componentCosts.covers).toBeGreaterThan(smallResult.componentCosts.covers);
      expect(largeResult.componentCosts.flanges).toBeGreaterThan(smallResult.componentCosts.flanges);
    });
  });
});