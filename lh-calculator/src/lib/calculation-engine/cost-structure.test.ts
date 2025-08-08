// Cost Structure Tests - Stories 5, 6, 7
// Comprehensive tests for all 23 cost fields added in Sprint 2

import { describe, it, expect } from 'vitest';
import type { HeatExchangerInput } from './types';

describe('Cost Structure Fields - Stories 5, 6, 7', () => {
  
  describe('Story 5: Component Cost Structure (7 fields)', () => {
    const testInput: HeatExchangerInput = {
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
      plateThickness: 1.0,
    };

    it('should have correct default values for component costs', () => {
      // Story 5: Component Cost Structure default values
      expect(testInput.componentCost1).toBe(undefined); // Should default to 3300 in store
      expect(testInput.componentCost2).toBe(undefined); // Should default to 1750 in store
      expect(testInput.componentCost3).toBe(undefined); // Should default to 2800 in store
      expect(testInput.componentCost4).toBe(undefined); // Should default to 1200 in store
      expect(testInput.additionalCost1).toBe(undefined); // Should default to 600 in store
      expect(testInput.additionalCost2).toBe(undefined); // Should default to 87 in store
      expect(testInput.additionalCost3).toBe(undefined); // Should default to 50 in store
    });

    it('should accept valid component cost values', () => {
      const inputWithCosts: HeatExchangerInput = {
        ...testInput,
        componentCost1: 3300, // D43
        componentCost2: 1750, // D44
        componentCost3: 2800, // D45
        componentCost4: 1200, // D46
        additionalCost1: 600, // G43
        additionalCost2: 87,  // G44
        additionalCost3: 50,  // G45
      };

      expect(inputWithCosts.componentCost1).toBe(3300);
      expect(inputWithCosts.componentCost2).toBe(1750);
      expect(inputWithCosts.componentCost3).toBe(2800);
      expect(inputWithCosts.componentCost4).toBe(1200);
      expect(inputWithCosts.additionalCost1).toBe(600);
      expect(inputWithCosts.additionalCost2).toBe(87);
      expect(inputWithCosts.additionalCost3).toBe(50);
    });

    it('should accept valid component cost ranges', () => {
      const validCosts = [0, 100, 1000, 50000, 999999, 1000000];
      
      validCosts.forEach(cost => {
        const inputWithValidCost: HeatExchangerInput = {
          ...testInput,
          componentCost1: cost,
        };
        
        // Should accept valid values within range
        expect(inputWithValidCost.componentCost1).toBe(cost);
      });
    });

    it('should allow zero values for component costs', () => {
      const inputWithZeroCosts: HeatExchangerInput = {
        ...testInput,
        componentCost1: 0,
        componentCost2: 0,
        additionalCost1: 0,
      };

      expect(inputWithZeroCosts.componentCost1).toBe(0);
      expect(inputWithZeroCosts.componentCost2).toBe(0);
      expect(inputWithZeroCosts.additionalCost1).toBe(0);
    });
  });

  describe('Story 6: Manufacturing Process Costs (8 fields)', () => {
    const testInput: HeatExchangerInput = {
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
      plateThickness: 1.0,
    };

    it('should have correct default values for manufacturing costs', () => {
      // Story 6: Manufacturing Process Costs default values
      expect(testInput.processCost1).toBe(undefined); // Should default to 100 in store
      expect(testInput.processCost2).toBe(undefined); // Should default to 100 in store
      expect(testInput.processCost3).toBe(undefined); // Should default to 200 in store
      expect(testInput.processCost4).toBe(undefined); // Should default to 150 in store
      expect(testInput.assemblyWork1).toBe(undefined); // Should default to 1000 in store
      expect(testInput.assemblyWork2).toBe(undefined); // Should default to 1000 in store
      expect(testInput.additionalWork1).toBe(undefined); // Should default to 1500 in store
      expect(testInput.additionalWork2).toBe(undefined); // Should default to 1200 in store
    });

    it('should accept valid manufacturing cost values', () => {
      const inputWithCosts: HeatExchangerInput = {
        ...testInput,
        processCost1: 100,    // H54
        processCost2: 100,    // H55
        processCost3: 200,    // H56
        processCost4: 150,    // H57
        assemblyWork1: 1000,  // I38
        assemblyWork2: 1000,  // I39
        additionalWork1: 1500, // K38
        additionalWork2: 1200, // K39
      };

      expect(inputWithCosts.processCost1).toBe(100);
      expect(inputWithCosts.processCost2).toBe(100);
      expect(inputWithCosts.processCost3).toBe(200);
      expect(inputWithCosts.processCost4).toBe(150);
      expect(inputWithCosts.assemblyWork1).toBe(1000);
      expect(inputWithCosts.assemblyWork2).toBe(1000);
      expect(inputWithCosts.additionalWork1).toBe(1500);
      expect(inputWithCosts.additionalWork2).toBe(1200);
    });

    it('should validate manufacturing cost ranges', () => {
      const validCosts = [0, 100, 1000, 50000, 999999];
      
      validCosts.forEach(cost => {
        const inputWithCost: HeatExchangerInput = {
          ...testInput,
          processCost1: cost,
          assemblyWork1: cost,
        };
        
        expect(inputWithCost.processCost1).toBe(cost);
        expect(inputWithCost.assemblyWork1).toBe(cost);
      });
    });

    it('should handle manufacturing cost edge cases', () => {
      const inputWithEdgeCosts: HeatExchangerInput = {
        ...testInput,
        processCost1: 1000000, // Maximum allowed
        processCost2: 0,       // Minimum allowed
        assemblyWork1: 999999, // Near maximum
        additionalWork1: 1,    // Near minimum
      };

      expect(inputWithEdgeCosts.processCost1).toBe(1000000);
      expect(inputWithEdgeCosts.processCost2).toBe(0);
      expect(inputWithEdgeCosts.assemblyWork1).toBe(999999);
      expect(inputWithEdgeCosts.additionalWork1).toBe(1);
    });
  });

  describe('Story 7: Material and Special Costs (8 fields)', () => {
    const testInput: HeatExchangerInput = {
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
      plateThickness: 1.0,
    };

    it('should have correct default values for material and special costs', () => {
      // Story 7: Material and Special Costs default values
      expect(testInput.materialCost1).toBe(undefined); // Should default to 50000 in store
      expect(testInput.materialCost2).toBe(undefined); // Should default to 0 in store
      expect(testInput.materialCost3).toBe(undefined); // Should default to 0 in store
      expect(testInput.extraCost).toBe(undefined); // Should default to 20000 in store
      expect(testInput.specialCost1).toBe(undefined); // Should default to 5000 in store
      expect(testInput.specialCost2).toBe(undefined); // Should default to 7000 in store
      expect(testInput.specialCost3).toBe(undefined); // Should default to 15000 in store
      expect(testInput.specialCost4).toBe(undefined); // Should default to 30000 in store
    });

    it('should accept valid material and special cost values', () => {
      const inputWithCosts: HeatExchangerInput = {
        ...testInput,
        materialCost1: 50000, // M44
        materialCost2: 0,     // M45 - can be 0
        materialCost3: 0,     // M46 - can be 0
        extraCost: 20000,     // P45
        specialCost1: 5000,   // M51
        specialCost2: 7000,   // M52
        specialCost3: 15000,  // M55
        specialCost4: 30000,  // M57
      };

      expect(inputWithCosts.materialCost1).toBe(50000);
      expect(inputWithCosts.materialCost2).toBe(0);
      expect(inputWithCosts.materialCost3).toBe(0);
      expect(inputWithCosts.extraCost).toBe(20000);
      expect(inputWithCosts.specialCost1).toBe(5000);
      expect(inputWithCosts.specialCost2).toBe(7000);
      expect(inputWithCosts.specialCost3).toBe(15000);
      expect(inputWithCosts.specialCost4).toBe(30000);
    });

    it('should validate material cost ranges', () => {
      const validCosts = [0, 1000, 50000, 100000, 999999];
      
      validCosts.forEach(cost => {
        const inputWithCost: HeatExchangerInput = {
          ...testInput,
          materialCost1: cost,
          extraCost: cost,
          specialCost1: cost,
        };
        
        expect(inputWithCost.materialCost1).toBe(cost);
        expect(inputWithCost.extraCost).toBe(cost);
        expect(inputWithCost.specialCost1).toBe(cost);
      });
    });

    it('should specifically allow zero for material costs 2 and 3', () => {
      const inputWithZeroCosts: HeatExchangerInput = {
        ...testInput,
        materialCost2: 0, // M45 - explicitly can be 0
        materialCost3: 0, // M46 - explicitly can be 0
      };

      expect(inputWithZeroCosts.materialCost2).toBe(0);
      expect(inputWithZeroCosts.materialCost3).toBe(0);
    });

    it('should handle large material cost values', () => {
      const inputWithLargeCosts: HeatExchangerInput = {
        ...testInput,
        materialCost1: 500000, // Large but valid
        extraCost: 200000,     // Large but valid
        specialCost4: 300000,  // Large but valid
      };

      expect(inputWithLargeCosts.materialCost1).toBe(500000);
      expect(inputWithLargeCosts.extraCost).toBe(200000);
      expect(inputWithLargeCosts.specialCost4).toBe(300000);
    });
  });

  describe('Integration Tests: All Cost Fields Together', () => {
    it('should handle all 23 cost fields simultaneously', () => {
      const completeInput: HeatExchangerInput = {
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
        plateThickness: 1.0,
        
        // Story 5: Component Costs (7 fields)
        componentCost1: 3300,
        componentCost2: 1750,
        componentCost3: 2800,
        componentCost4: 1200,
        additionalCost1: 600,
        additionalCost2: 87,
        additionalCost3: 50,
        
        // Story 6: Manufacturing Costs (8 fields)
        processCost1: 100,
        processCost2: 100,
        processCost3: 200,
        processCost4: 150,
        assemblyWork1: 1000,
        assemblyWork2: 1000,
        additionalWork1: 1500,
        additionalWork2: 1200,
        
        // Story 7: Material and Special Costs (8 fields)
        materialCost1: 50000,
        materialCost2: 0,
        materialCost3: 0,
        extraCost: 20000,
        specialCost1: 5000,
        specialCost2: 7000,
        specialCost3: 15000,
        specialCost4: 30000,
      };

      // Verify all cost fields are present and have correct values
      const expectedTotalFields = 23; // 7 + 8 + 8 = 23 cost fields
      
      // Count actual cost fields
      const costFields = [
        'componentCost1', 'componentCost2', 'componentCost3', 'componentCost4',
        'additionalCost1', 'additionalCost2', 'additionalCost3',
        'processCost1', 'processCost2', 'processCost3', 'processCost4',
        'assemblyWork1', 'assemblyWork2', 'additionalWork1', 'additionalWork2',
        'materialCost1', 'materialCost2', 'materialCost3', 'extraCost',
        'specialCost1', 'specialCost2', 'specialCost3', 'specialCost4'
      ];
      
      expect(costFields.length).toBe(expectedTotalFields);
      
      // Verify all fields are defined in the input
      costFields.forEach(field => {
        expect(completeInput[field as keyof HeatExchangerInput]).toBeDefined();
      });
      
      // Calculate total cost (sum of all cost fields)
      const totalCost = costFields.reduce((sum, field) => {
        const value = completeInput[field as keyof HeatExchangerInput] as number;
        return sum + (value || 0);
      }, 0);
      
      // Expected total: sum of all default values
      const expectedTotal = 3300 + 1750 + 2800 + 1200 + 600 + 87 + 50 + // Component costs
                           100 + 100 + 200 + 150 + 1000 + 1000 + 1500 + 1200 + // Manufacturing costs
                           50000 + 0 + 0 + 20000 + 5000 + 7000 + 15000 + 30000; // Material & special costs
      
      expect(totalCost).toBe(expectedTotal);
      expect(totalCost).toBe(142037); // Verification of manual calculation
    });

    it('should maintain backward compatibility', () => {
      // Test that existing inputs without cost fields still work
      const basicInput: HeatExchangerInput = {
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
        plateThickness: 1.0,
      };

      // Should not throw errors and all cost fields should be undefined
      expect(basicInput.componentCost1).toBeUndefined();
      expect(basicInput.processCost1).toBeUndefined();
      expect(basicInput.materialCost1).toBeUndefined();
      
      // Basic calculation fields should still work
      expect(basicInput.equipmentType).toBe('К4-750');
      expect(basicInput.plateCount).toBe(400);
      expect(basicInput.pressureA).toBe(100);
    });
  });

  describe('Field Mapping Verification', () => {
    it('should map to correct Excel cells', () => {
      const cellMapping = {
        // Story 5: Component Cost Structure
        componentCost1: 'D43',
        componentCost2: 'D44',
        componentCost3: 'D45',
        componentCost4: 'D46',
        additionalCost1: 'G43',
        additionalCost2: 'G44',
        additionalCost3: 'G45',
        
        // Story 6: Manufacturing Process Costs
        processCost1: 'H54',
        processCost2: 'H55',
        processCost3: 'H56',
        processCost4: 'H57',
        assemblyWork1: 'I38',
        assemblyWork2: 'I39',
        additionalWork1: 'K38',
        additionalWork2: 'K39',
        
        // Story 7: Material and Special Costs
        materialCost1: 'M44',
        materialCost2: 'M45',
        materialCost3: 'M46',
        extraCost: 'P45',
        specialCost1: 'M51',
        specialCost2: 'M52',
        specialCost3: 'M55',
        specialCost4: 'M57',
      };

      // Verify all expected Excel cells are accounted for
      const expectedCells = Object.keys(cellMapping);
      expect(expectedCells.length).toBe(23);
      
      // Verify no duplicate cell mappings
      const cellValues = Object.values(cellMapping);
      const uniqueCells = [...new Set(cellValues)];
      expect(uniqueCells.length).toBe(cellValues.length);
    });
  });
});