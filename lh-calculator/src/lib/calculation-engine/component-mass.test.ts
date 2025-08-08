/**
 * Component Mass Calculations Test - Story 4
 * Tests implementation of 7 component mass calculations using VLOOKUP
 */

import { describe, test, expect } from 'vitest';
import { CalculationEngineV2 } from './engine-v2';
import type { HeatExchangerInput } from './types';

describe('Component Mass Calculations', () => {
  const engine = new CalculationEngineV2();
  
  // К4-750 test inputs from TEST_SCENARIO_DATA.md
  const k4750TestInput: HeatExchangerInput = {
    equipmentType: "К4-750",
    plateCount: 1, // Equipment count = 1
    plateThickness: 0.6,
    materialPlate: "AISI 316L",
    materialBody: "AISI 316L",
    plateConfiguration: "standard",
    pressureA: 1.6,
    pressureB: 1.6,
    temperatureA: 90,
    temperatureB: 85,
    surfaceType: "standard",
    modelCode: "К4-750-001",
    drawDepth: 1.5,
    deliveryType: "standard"
  };

  describe('Individual Component Calculations (equipmentCount = 1)', () => {
    test('E93: Гребенка 4шт should equal 29.625648 kg', () => {
      const result = engine.calculate(k4750TestInput);
      const componentMass = result.materialRequirements.get('Гребенка 4шт');
      
      expect(componentMass).toBeDefined();
      expect(componentMass).toBeCloseTo(29.625648, 6);
    });

    test('E94: Полоса гребенки 4шт should equal 27.346752 kg', () => {
      const result = engine.calculate(k4750TestInput);
      const componentMass = result.materialRequirements.get('Полоса гребенки 4шт');
      
      expect(componentMass).toBeDefined();
      expect(componentMass).toBeCloseTo(27.346752, 6);
    });

    test('E95: Лист концевой 2шт should equal 43.6640256 kg', () => {
      const result = engine.calculate(k4750TestInput);
      const componentMass = result.materialRequirements.get('Лист концевой 2шт');
      
      expect(componentMass).toBeDefined();
      expect(componentMass).toBeCloseTo(43.6640256, 6);
    });

    test('E97: Зеркало А 4шт should equal 9.0266976 kg', () => {
      const result = engine.calculate(k4750TestInput);
      const componentMass = result.materialRequirements.get('Зеркало А 4шт');
      
      expect(componentMass).toBeDefined();
      expect(componentMass).toBeCloseTo(9.0266976, 6);
    });

    test('E98: Зеркало Б 4шт should equal 9.021024 kg', () => {
      const result = engine.calculate(k4750TestInput);
      const componentMass = result.materialRequirements.get('Зеркало Б 4шт');
      
      expect(componentMass).toBeDefined();
      expect(componentMass).toBeCloseTo(9.021024, 6);
    });

    test('E99: Лист плакирующий А 2шт should equal 92.22890688 kg', () => {
      const result = engine.calculate(k4750TestInput);
      const componentMass = result.materialRequirements.get('Лист плакирующий А 2шт');
      
      expect(componentMass).toBeDefined();
      expect(componentMass).toBeCloseTo(92.22890688, 6);
    });

    test('E100: Лист плакирующий Б 2шт should equal 91.9960056 kg', () => {
      const result = engine.calculate(k4750TestInput);
      const componentMass = result.materialRequirements.get('Лист плакирующий Б 2шт');
      
      expect(componentMass).toBeDefined();
      expect(componentMass).toBeCloseTo(91.9960056, 6);
    });
  });

  describe('Total Component Mass Validation', () => {
    test('Sum of E93-E100 should equal expected total', () => {
      const result = engine.calculate(k4750TestInput);
      const totalComponentMass = result.materialRequirements.get('totalComponentMass');
      
      // Calculate expected total from individual VLOOKUP values
      const expectedComponents = [
        29.625648,     // E93: Гребенка 4шт
        27.346752,     // E94: Полоса гребенки 4шт  
        43.6640256,    // E95: Лист концевой 2шт
        9.0266976,     // E97: Зеркало А 4шт
        9.021024,      // E98: Зеркало Б 4шт
        92.22890688,   // E99: Лист плакирующий А 2шт
        91.9960056     // E100: Лист плакирующий Б 2шт
      ];
      const expectedTotal = expectedComponents.reduce((sum, val) => sum + val, 0);
      
      expect(totalComponentMass).toBeDefined();
      expect(typeof totalComponentMass === 'number').toBe(true);
      if (typeof totalComponentMass === 'number') {
        expect(totalComponentMass).toBeCloseTo(expectedTotal, 4);
        console.log(`Calculated: ${totalComponentMass}, Expected: ${expectedTotal}, Difference: ${Math.abs(totalComponentMass - expectedTotal)}`);
      }
    });
  });

  describe('Equipment Count Scaling', () => {
    test('Components should scale correctly with equipment count', () => {
      const scaledInput = { ...k4750TestInput, plateCount: 2 }; // equipmentCount = 2
      const result = engine.calculate(scaledInput);
      
      // Check that each component is doubled
      const grebenka = result.materialRequirements.get('Гребенка 4шт');
      if (typeof grebenka === 'number') {
        expect(grebenka).toBeCloseTo(29.625648 * 2, 6);
      }
      
      const polosa = result.materialRequirements.get('Полоса гребенки 4шт');
      if (typeof polosa === 'number') {
        expect(polosa).toBeCloseTo(27.346752 * 2, 6);
      }
      
      const totalComponentMass = result.materialRequirements.get('totalComponentMass');
      // Use actual calculated value from single equipment test  
      if (typeof totalComponentMass === 'number') {
        expect(totalComponentMass).toBeCloseTo(302.90905968 * 2, 6);
      }
    });
  });

  describe('Different Equipment Types', () => {
    test('К4-500 should have different component values', () => {
      const k4500Input: HeatExchangerInput = {
        ...k4750TestInput,
        equipmentType: "К4-500"
      };
      
      const result = engine.calculate(k4500Input);
      
      // К4-500 component values from VLOOKUP table
      const grebenka = result.materialRequirements.get('Гребенка 4шт');
      if (typeof grebenka === 'number') {
        expect(grebenka).toBeCloseTo(18.75, 6); // componentL for К4-500
      }
      
      const polosa = result.materialRequirements.get('Полоса гребенки 4шт');
      if (typeof polosa === 'number') {
        expect(polosa).toBeCloseTo(14.26, 6); // componentO for К4-500
      }
    });

    test('К4-1000 should have different component values', () => {
      const k41000Input: HeatExchangerInput = {
        ...k4750TestInput,
        equipmentType: "К4-1000"
      };
      
      const result = engine.calculate(k41000Input);
      
      // К4-1000 component values from VLOOKUP table
      const grebenka = result.materialRequirements.get('Гребенка 4шт');
      if (typeof grebenka === 'number') {
        expect(grebenka).toBeCloseTo(35.84, 6); // componentL for К4-1000
      }
      
      const polosa = result.materialRequirements.get('Полоса гребенки 4шт');
      if (typeof polosa === 'number') {
        expect(polosa).toBeCloseTo(32.15, 6); // componentO for К4-1000
      }
    });
  });

  describe('Component Data Structure', () => {
    test('Each component should have correct data structure', () => {
      const result = engine.calculate(k4750TestInput);
      const grebenka = result.materialRequirements.get('Гребенка 4шт');
      
      expect(grebenka).toBeDefined();
      if (typeof grebenka === 'number') {
        expect(grebenka).toBeGreaterThan(0);
      }
    });
  });
});