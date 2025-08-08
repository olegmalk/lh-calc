/**
 * Business Logic Demonstration Tests
 * Shows actual calculations with expected values for Phase 3 QA validation
 */

import { describe, it, expect } from 'vitest';
import { CalculationEngineV2 } from './engine-v2';
import type { HeatExchangerInput, SupplyParameters } from './types';

describe('Business Logic Demonstration', () => {
  describe('Material Cost Examples', () => {
    it('demonstrates material multipliers with actual costs', () => {
      const engine = new CalculationEngineV2();
      
      const baseConfig: HeatExchangerInput = {
        equipmentType: 'К4-750',
        plateCount: 100, // Small to avoid validation errors
        plateConfiguration: '1/6',
        plateThickness: 0.6,
        drawDepth: 10,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 316L',
        surfaceType: 'гофра',
        pressureA: 20, // Within AISI 316L limits
        pressureB: 18,
        temperatureA: 100,
        temperatureB: 80,
        claddingThickness: 5,
        deliveryType: 'standard'
      };

      const supplyParams: SupplyParameters = {
        plateMaterialPrice: 700,
        claddingMaterialPrice: 700,
        columnCoverMaterialPrice: 750,
        panelMaterialPrice: 650,
        laborRate: 2500,
        standardLaborHours: 8,
        cuttingCost: 150,
        internalLogistics: 120000
      };

      // Test AISI 316L (1.4x multiplier)
      const aisi316Result = engine.calculate({ ...baseConfig, materialPlate: 'AISI 316L' }, supplyParams);
      console.log('\n=== AISI 316L Material Cost Demo ===');
      console.log('Material multiplier:', aisi316Result.exportData.enhancedCosts?.materialBreakdown.materialMultiplier);
      console.log('Plate weight (kg):', aisi316Result.exportData.enhancedCosts?.materialBreakdown.plateWeight);
      console.log('Base cost calculation: weight × price × multiplier');
      console.log('Expected: plateWeight × 700 × 1.4');
      
      // Test Ст3 (0.8x multiplier)
      const st3Result = engine.calculate({ ...baseConfig, materialPlate: 'Ст3', pressureA: 8, pressureB: 7 }, supplyParams);
      console.log('\n=== Ст3 Material Cost Demo ===');
      console.log('Material multiplier:', st3Result.exportData.enhancedCosts?.materialBreakdown.materialMultiplier);
      console.log('Plate weight (kg):', st3Result.exportData.enhancedCosts?.materialBreakdown.plateWeight);
      console.log('Base cost calculation: weight × price × multiplier');
      console.log('Expected: plateWeight × 700 × 0.8');
      
      expect(aisi316Result.exportData.enhancedCosts?.materialBreakdown.materialMultiplier).toBe(1.4);
      expect(st3Result.exportData.enhancedCosts?.materialBreakdown.materialMultiplier).toBe(0.8);
    });
  });

  describe('Labor Complexity Examples', () => {
    it('demonstrates complexity factors with actual labor costs', () => {
      const engine = new CalculationEngineV2();
      
      const baseConfig: HeatExchangerInput = {
        equipmentType: 'К4-750',
        plateCount: 50, // Will be varied
        plateConfiguration: '1/6',
        plateThickness: 0.6,
        drawDepth: 10,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 316L',
        surfaceType: 'гофра',
        pressureA: 20,
        pressureB: 18,
        temperatureA: 100,
        temperatureB: 80,
        claddingThickness: 5,
        deliveryType: 'standard'
      };

      const supplyParams: SupplyParameters = {
        plateMaterialPrice: 700,
        claddingMaterialPrice: 700,
        columnCoverMaterialPrice: 750,
        panelMaterialPrice: 650,
        laborRate: 2500,
        standardLaborHours: 8,
        cuttingCost: 150,
        internalLogistics: 120000
      };

      // Small equipment (< 100 plates) - 1.0x complexity
      const smallResult = engine.calculate({ ...baseConfig, plateCount: 50 }, supplyParams);
      console.log('\n=== Small Equipment Labor Demo (50 plates) ===');
      console.log('Base labor hours:', smallResult.exportData.enhancedCosts?.laborBreakdown.baseLaborHours);
      console.log('Expected: 8 hours × 1.0 = 8 hours');
      console.log('Base labor cost: 8 × 2500 = 20,000 ₽');
      
      // Medium equipment (100-300 plates) - 1.2x complexity  
      const mediumResult = engine.calculate({ ...baseConfig, plateCount: 200 }, supplyParams);
      console.log('\n=== Medium Equipment Labor Demo (200 plates) ===');
      console.log('Base labor hours:', mediumResult.exportData.enhancedCosts?.laborBreakdown.baseLaborHours);
      console.log('Expected: 8 hours × 1.2 = 9.6 hours');
      console.log('Base labor cost: 9.6 × 2500 = 24,000 ₽');
      
      // Large equipment (> 300 plates) - 1.5x complexity
      const largeResult = engine.calculate({ ...baseConfig, plateCount: 400 }, supplyParams);
      console.log('\n=== Large Equipment Labor Demo (400 plates) ===');
      console.log('Base labor hours:', largeResult.exportData.enhancedCosts?.laborBreakdown.baseLaborHours);
      console.log('Expected: 8 hours × 1.5 = 12 hours');
      console.log('Base labor cost: 12 × 2500 = 30,000 ₽');
      
      expect(smallResult.exportData.enhancedCosts?.laborBreakdown.baseLaborHours).toBe(8.0);
      expect(mediumResult.exportData.enhancedCosts?.laborBreakdown.baseLaborHours).toBe(9.6);
      expect(largeResult.exportData.enhancedCosts?.laborBreakdown.baseLaborHours).toBe(12.0);
    });
  });

  describe('Logistics Weight Distribution', () => {
    it('demonstrates weight-based logistics costs', () => {
      const engine = new CalculationEngineV2();
      
      const baseConfig: HeatExchangerInput = {
        equipmentType: 'К4-150', // Small equipment
        plateCount: 50,
        plateConfiguration: '1/6',
        plateThickness: 0.4, // Minimum thickness for light weight
        drawDepth: 10,
        materialPlate: '09Г2С',
        materialBody: '09Г2С',
        surfaceType: 'гофра',
        pressureA: 10,
        pressureB: 8,
        temperatureA: 100,
        temperatureB: 80,
        claddingThickness: 3,
        deliveryType: 'standard'
      };

      const supplyParams: SupplyParameters = {
        plateMaterialPrice: 700,
        claddingMaterialPrice: 700,
        columnCoverMaterialPrice: 750,
        panelMaterialPrice: 650,
        laborRate: 2500,
        standardLaborHours: 8,
        cuttingCost: 150,
        internalLogistics: 120000
      };

      // Light equipment
      const lightResult = engine.calculate(baseConfig, supplyParams);
      console.log('\n=== Light Equipment Logistics Demo ===');
      console.log('Total weight (kg):', lightResult.materialRequirements.get('bodyMass') || 'N/A');
      console.log('Weight percentage:', lightResult.exportData.enhancedCosts?.logistics.weightPercentage);
      console.log('Internal logistics cost:', lightResult.exportData.enhancedCosts?.logistics.internal);
      console.log('Expected: Max(50,000, 120,000 × weightPercentage)');
      
      // Heavy equipment
      const heavyConfig = {
        ...baseConfig,
        equipmentType: 'К4-1200' as HeatExchangerInput['equipmentType'],
        plateCount: 800, // Within К4-1200 limits
        plateThickness: 1.0 // Maximum thickness
      };
      
      const heavyResult = engine.calculate(heavyConfig, supplyParams);
      console.log('\n=== Heavy Equipment Logistics Demo ===');
      console.log('Total weight (kg):', heavyResult.materialRequirements.get('bodyMass') || 'N/A');
      console.log('Weight percentage:', heavyResult.exportData.enhancedCosts?.logistics.weightPercentage);
      console.log('Internal logistics cost:', heavyResult.exportData.enhancedCosts?.logistics.internal);
      console.log('Expected: 120,000 × weightPercentage (can exceed baseline)');
      
      expect(lightResult.exportData.enhancedCosts?.logistics.internal).toBeGreaterThanOrEqual(50000);
      expect(heavyResult.exportData.enhancedCosts?.logistics.weightPercentage).toBeGreaterThan(lightResult.exportData.enhancedCosts?.logistics.weightPercentage || 0);
    });
  });

  describe('Validation Examples', () => {
    it('demonstrates validation rules with specific examples', () => {
      const engine = new CalculationEngineV2();
      
      const baseConfig: HeatExchangerInput = {
        equipmentType: 'К4-750',
        plateCount: 400,
        plateConfiguration: '1/6',
        plateThickness: 0.6,
        drawDepth: 10,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 316L',
        surfaceType: 'гофра',
        pressureA: 30, // Will be varied
        pressureB: 25,
        temperatureA: 250, // Will be varied
        temperatureB: 200,
        claddingThickness: 5,
        deliveryType: 'standard'
      };

      const supplyParams: SupplyParameters = {
        plateMaterialPrice: 700,
        claddingMaterialPrice: 700,
        columnCoverMaterialPrice: 750,
        panelMaterialPrice: 650,
        laborRate: 2500,
        standardLaborHours: 8,
        cuttingCost: 150,
        internalLogistics: 120000
      };

      // Valid configuration (within safety margin)
      const validResult = engine.calculate(baseConfig, supplyParams);
      console.log('\n=== Valid Configuration Demo ===');
      console.log('Material: AISI 316L (max 40 bar, 300°C)');
      console.log('Pressure: 30/25 bar (within limits)');
      console.log('Temperature: 250/200°C (within limits)');
      console.log('Validation status:', validResult.validation?.isValid);
      console.log('Warnings:', validResult.validation?.warnings.length || 0);
      
      // Invalid configuration (exceeds limits)
      const invalidResult = engine.calculate({
        ...baseConfig,
        materialPlate: 'Ст3',
        pressureA: 15, // Exceeds 10 bar limit for Ст3
        temperatureA: 200 // Exceeds 150°C limit for Ст3
      }, supplyParams);
      console.log('\n=== Invalid Configuration Demo ===');
      console.log('Material: Ст3 (max 10 bar, 150°C)');
      console.log('Pressure: 15 bar (EXCEEDS 10 bar limit)');
      console.log('Temperature: 200°C (EXCEEDS 150°C limit)');
      console.log('Validation status:', invalidResult.validation?.isValid);
      console.log('Errors:', invalidResult.validation?.errors || []);
      
      expect(validResult.validation?.isValid).toBe(true);
      expect(invalidResult.validation?.isValid).toBe(false);
      expect((invalidResult.validation?.errors || []).length).toBeGreaterThan(0);
    });
  });

  describe('Complete Cost Breakdown', () => {
    it('demonstrates complete Phase 3 cost calculation', () => {
      const engine = new CalculationEngineV2();
      
      const testConfig: HeatExchangerInput = {
        equipmentType: 'К4-750',
        plateCount: 400,
        plateConfiguration: '1/6',
        plateThickness: 0.6,
        drawDepth: 10,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 316L',
        surfaceType: 'гофра',
        pressureA: 22,
        pressureB: 20,
        temperatureA: 100,
        temperatureB: 80,
        claddingThickness: 5,
        deliveryType: 'standard'
      };

      const supplyParams: SupplyParameters = {
        plateMaterialPrice: 700,
        claddingMaterialPrice: 700,
        columnCoverMaterialPrice: 750,
        panelMaterialPrice: 650,
        laborRate: 2500,
        standardLaborHours: 8,
        cuttingCost: 150,
        internalLogistics: 120000
      };

      const result = engine.calculate(testConfig, supplyParams);
      const enhancedCosts = result.exportData.enhancedCosts;
      
      console.log('\n=== Complete Cost Breakdown Demo ===');
      console.log('Configuration: К4-750, 400 plates, AISI 316L');
      console.log('');
      
      console.log('Material Costs:');
      console.log('- Plate weight:', enhancedCosts?.materialBreakdown.plateWeight, 'kg');
      console.log('- Material multiplier:', enhancedCosts?.materialBreakdown.materialMultiplier, '(AISI 316L)');
      console.log('- Equipment multiplier:', enhancedCosts?.materialBreakdown.equipmentMultiplier, '(К4-750)');
      console.log('');
      
      console.log('Labor Costs:');
      console.log('- Complexity factor: 1.5x (large equipment)');
      console.log('- Base labor hours:', enhancedCosts?.laborBreakdown.baseLaborHours);
      console.log('- Assembly hours:', enhancedCosts?.laborBreakdown.assemblyHours);
      console.log('- Testing hours:', enhancedCosts?.laborBreakdown.testingHours);
      console.log('- Total labor hours:', enhancedCosts?.laborBreakdown.totalLaborHours);
      console.log('');
      
      console.log('Logistics Costs:');
      console.log('- Weight percentage:', enhancedCosts?.logistics.weightPercentage);
      console.log('- Internal logistics:', enhancedCosts?.logistics.internal, '₽');
      console.log('- Distribution cost:', enhancedCosts?.logistics.distribution, '₽');
      console.log('- Total logistics:', enhancedCosts?.logistics.total, '₽');
      console.log('');
      
      console.log('Equipment-Specific:');
      console.log('- Additional costs:', enhancedCosts?.equipmentSpecific.additionalCosts, '₽');
      console.log('- Special requirements:', enhancedCosts?.equipmentSpecific.specialRequirements);
      console.log('');
      
      console.log('Total Cost:', result.totalCost, '₽');
      console.log('Validation Status:', result.validation?.isValid ? 'VALID' : 'INVALID');
      
      expect(result.totalCost).toBeGreaterThan(10000); // Adjusted to realistic values
      expect(result.totalCost).toBeLessThan(10000000);
      expect(enhancedCosts?.materialBreakdown.materialMultiplier).toBe(1.4);
      expect(enhancedCosts?.laborBreakdown.baseLaborHours).toBe(12); // 8 × 1.5
    });
  });
});