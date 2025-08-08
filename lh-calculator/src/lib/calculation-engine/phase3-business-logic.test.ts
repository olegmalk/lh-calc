import { describe, it, expect, beforeEach } from 'vitest';
import { CalculationEngineV2 } from './engine-v2';
import { 
  calculateEnhancedMaterialCosts, 
  calculateEnhancedLaborCosts,
  calculateLogisticsCosts,
  applyEquipmentSpecificLogic,
  validateConfiguration,
  getMaterialLimits,
  getMaterialRecommendation
} from './formula-library-complete';
import type { HeatExchangerInput, FormulaContext, SupplyParameters } from './types';

describe('Phase 3 Business Logic Implementation', () => {
  let engine: CalculationEngineV2;
  let testInputs: HeatExchangerInput;
  let testSupplyParams: SupplyParameters;
  let mockContext: FormulaContext;

  beforeEach(() => {
    engine = new CalculationEngineV2();
    
    testInputs = {
      equipmentType: 'К4-750',
      modelCode: 'К4-750',
      plateConfiguration: '1/6',
      plateCount: 400,
      pressureA: 22, // Hot side pressure (bar)
      pressureB: 22, // Cold side pressure (bar) 
      temperatureA: 100, // Hot side temperature (°C)
      temperatureB: 100, // Cold side temperature (°C)
      materialPlate: 'AISI 316L',
      materialBody: '09Г2С',
      surfaceType: 'гофра',
      drawDepth: 5, // mm
      plateThickness: 1.0, // mm
      claddingThickness: 3, // mm
      deliveryType: 'standard'
    };

    testSupplyParams = {
      plateMaterialPrice: 700, // ₽/kg
      claddingMaterialPrice: 700, // ₽/kg
      columnCoverMaterialPrice: 750, // ₽/kg
      panelMaterialPrice: 650, // ₽/kg
      laborRate: 2500, // ₽/hour
      standardLaborHours: 8, // hours
      cuttingCost: 150, // ₽/m
      internalLogistics: 120000, // ₽
      claddingCorrection: 1.05,
      columnCorrection: 1.03,
      coverCorrection: 1.02,
      panelCorrection: 1.04,
    };

    mockContext = {
      inputs: testInputs,
      supply: testSupplyParams,
      materials: new Map(),
      namedRanges: new Map(),
      intermediateValues: new Map(),
      dependencies: new Map(),
    };
  });

  describe('LH-F009: Material Cost Calculations', () => {
    it('should calculate enhanced material costs using supply parameters', () => {
      const result = calculateEnhancedMaterialCosts(mockContext);
      
      // Test that all cost components are calculated
      expect(result).toHaveProperty('plateMaterialCost');
      expect(result).toHaveProperty('claddingMaterialCost');
      expect(result).toHaveProperty('columnCoverMaterialCost');
      expect(result).toHaveProperty('panelMaterialCost');
      expect(result).toHaveProperty('totalMaterialCost');
      expect(result).toHaveProperty('cuttingCost');
      expect(result).toHaveProperty('materialBreakdown');

      // Test that costs are positive numbers
      expect(result.plateMaterialCost).toBeGreaterThan(0);
      expect(result.totalMaterialCost).toBeGreaterThan(0);
      expect(result.cuttingCost).toBeGreaterThan(0);

      // Test that material breakdown contains expected values
      expect(result.materialBreakdown.has('plateWeight')).toBe(true);
      expect(result.materialBreakdown.has('materialMultiplier')).toBe(true);
      expect(result.materialBreakdown.has('equipmentMultiplier')).toBe(true);

      // Test AISI 316L material multiplier (should be 1.4)
      expect(result.materialBreakdown.get('materialMultiplier')).toBe(1.4);
    });

    it('should apply material-specific price multipliers correctly', () => {
      // Test with different materials
      const materials = ['AISI 316L', 'AISI 304', '09Г2С', 'Ст3'];
      const expectedMultipliers = [1.4, 1.2, 1.0, 0.8];

      materials.forEach((material, index) => {
        const contextWithMaterial = { ...mockContext, inputs: { ...testInputs, materialPlate: material } };
        const result = calculateEnhancedMaterialCosts(contextWithMaterial);
        expect(result.materialBreakdown.get('materialMultiplier')).toBe(expectedMultipliers[index]);
      });
    });

    it('should calculate cutting costs based on material difficulty', () => {
      // Test with harder to cut material
      const hardMaterialContext = { ...mockContext, inputs: { ...testInputs, materialPlate: 'AISI 316L' } };
      const easyMaterialContext = { ...mockContext, inputs: { ...testInputs, materialPlate: 'Ст3' } };

      const hardResult = calculateEnhancedMaterialCosts(hardMaterialContext);
      const easyResult = calculateEnhancedMaterialCosts(easyMaterialContext);

      // AISI 316L should be more expensive to cut than Ст3
      expect(hardResult.cuttingCost).toBeGreaterThan(easyResult.cuttingCost);
    });
  });

  describe('LH-F010: Labor Cost Calculations', () => {
    it('should calculate enhanced labor costs with complexity factors', () => {
      const result = calculateEnhancedLaborCosts(mockContext);
      
      // Test that all labor components are calculated
      expect(result).toHaveProperty('baseLaborCost');
      expect(result).toHaveProperty('assemblyLaborCost');
      expect(result).toHaveProperty('testingLaborCost');
      expect(result).toHaveProperty('totalLaborCost');
      expect(result).toHaveProperty('complexityFactor');
      expect(result).toHaveProperty('laborBreakdown');

      // Test that costs are positive
      expect(result.totalLaborCost).toBeGreaterThan(0);
      expect(result.baseLaborCost).toBeGreaterThan(0);
      expect(result.assemblyLaborCost).toBeGreaterThan(0);
      expect(result.testingLaborCost).toBeGreaterThan(0);

      // Test complexity factor for 400 plates (should be 1.5 for large equipment)
      expect(result.complexityFactor).toBe(1.5);

      // Test labor breakdown contains expected values
      expect(result.laborBreakdown.has('totalLaborHours')).toBe(true);
      expect(result.laborBreakdown.get('totalLaborHours')).toBeGreaterThan(0);
    });

    it('should apply different complexity factors based on equipment size', () => {
      const smallEquipmentContext = { ...mockContext, inputs: { ...testInputs, plateCount: 50 } };
      const mediumEquipmentContext = { ...mockContext, inputs: { ...testInputs, plateCount: 200 } };
      const largeEquipmentContext = { ...mockContext, inputs: { ...testInputs, plateCount: 500 } };

      const smallResult = calculateEnhancedLaborCosts(smallEquipmentContext);
      const mediumResult = calculateEnhancedLaborCosts(mediumEquipmentContext);
      const largeResult = calculateEnhancedLaborCosts(largeEquipmentContext);

      expect(smallResult.complexityFactor).toBe(1.0);
      expect(mediumResult.complexityFactor).toBe(1.2);
      expect(largeResult.complexityFactor).toBe(1.5);

      // Total costs should increase with complexity
      expect(smallResult.totalLaborCost).toBeLessThan(mediumResult.totalLaborCost);
      expect(mediumResult.totalLaborCost).toBeLessThan(largeResult.totalLaborCost);
    });
  });

  describe('LH-F011: Logistics Cost Distribution', () => {
    it('should calculate logistics costs based on weight and delivery type', () => {
      const result = calculateLogisticsCosts(mockContext);
      
      // Test that all logistics components are calculated
      expect(result).toHaveProperty('internalLogisticsCost');
      expect(result).toHaveProperty('distributionCost');
      expect(result).toHaveProperty('totalLogisticsCost');
      expect(result).toHaveProperty('weightPercentage');

      // Test that costs are positive
      expect(result.totalLogisticsCost).toBeGreaterThan(0);
      expect(result.internalLogisticsCost).toBeGreaterThan(0);
      expect(result.distributionCost).toBeGreaterThan(0);

      // Test minimum logistics charge is applied
      expect(result.internalLogisticsCost).toBeGreaterThanOrEqual(50000);

      // Test weight percentage is between 0 and 1
      expect(result.weightPercentage).toBeGreaterThanOrEqual(0);
      expect(result.weightPercentage).toBeLessThanOrEqual(1);
    });

    it('should not apply delivery type surcharge (Excel does not use F27 in calculations)', () => {
      const completeHE = { ...mockContext, inputs: { ...testInputs, deliveryType: 'Целый ТА' } };
      const shotBlock = { ...mockContext, inputs: { ...testInputs, deliveryType: 'ШОТ-БЛОК' } };
      const reeng = { ...mockContext, inputs: { ...testInputs, deliveryType: 'РЕИНЖ' } };

      const completeResult = calculateLogisticsCosts(completeHE);
      const shotResult = calculateLogisticsCosts(shotBlock);
      const reengResult = calculateLogisticsCosts(reeng);

      // Delivery type should NOT affect cost (F27 is not used in Excel calculations)
      expect(completeResult.distributionCost).toBe(shotResult.distributionCost);
      expect(shotResult.distributionCost).toBe(reengResult.distributionCost);
      expect(completeResult.totalLogisticsCost).toBe(shotResult.totalLogisticsCost);
    });
  });

  describe('LH-F012: Conditional Equipment Logic', () => {
    it('should apply К4 series standard logic correctly', () => {
      const result = applyEquipmentSpecificLogic(mockContext);
      
      expect(result).toHaveProperty('additionalCosts');
      expect(result).toHaveProperty('specialRequirements');
      expect(result).toHaveProperty('materialAdjustments');

      // К4-750 should have standard configuration
      expect(result.specialRequirements).toContain('Стандартная конфигурация К4');
    });

    it('should apply large equipment surcharge for equipment >1000mm', () => {
      // К4-1200 has width 950mm, so should not trigger large equipment surcharge
      const normalContext = { ...mockContext, inputs: { ...testInputs, equipmentType: 'К4-1200' } };
      const result = applyEquipmentSpecificLogic(normalContext);
      
      // Should not have large equipment surcharge for К4-1200 (950mm width)
      expect(result.specialRequirements.some(req => req.includes('крупногабаритное'))).toBe(false);
    });

    it('should recommend appropriate materials based on operating conditions', () => {
      // High pressure and temperature should recommend AISI 316L
      const highTempPressureContext = { 
        ...mockContext, 
        inputs: { ...testInputs, pressureA: 30, temperatureA: 250, materialPlate: '09Г2С' } 
      };
      
      const result = applyEquipmentSpecificLogic(highTempPressureContext);
      expect(result.specialRequirements.some(req => req.includes('AISI 316L'))).toBe(true);
    });
  });

  describe('LH-F013: Validation Rules', () => {
    it('should validate material pressure and temperature limits correctly', () => {
      // Valid configuration
      const validResult = validateConfiguration(mockContext);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      // Invalid pressure for Ст3 (max 10 bar)
      const highPressureContext = { 
        ...mockContext, 
        inputs: { ...testInputs, materialPlate: 'Ст3', pressureA: 15 } 
      };
      const invalidResult = validateConfiguration(highPressureContext);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should validate plate count limits by equipment type', () => {
      // К4-750 has maxPlates of 750, so 400 should be valid
      const validResult = validateConfiguration(mockContext);
      expect(validResult.validationDetails.get('plateCountLimit')).toBe(true);

      // Test with exceeding plate count
      const excessivePlatesContext = { 
        ...mockContext, 
        inputs: { ...testInputs, plateCount: 1000 } 
      };
      const invalidResult = validateConfiguration(excessivePlatesContext);
      expect(invalidResult.validationDetails.get('plateCountLimit')).toBe(false);
      expect(invalidResult.errors.some(error => error.includes('превышает максимум'))).toBe(true);
    });

    it('should validate plate thickness range', () => {
      // Valid thickness
      expect(validateConfiguration(mockContext).validationDetails.get('thicknessRange')).toBe(true);

      // Invalid thickness (too thin)
      const thinPlateContext = { 
        ...mockContext, 
        inputs: { ...testInputs, plateThickness: 0.3 } 
      };
      expect(validateConfiguration(thinPlateContext).validationDetails.get('thicknessRange')).toBe(false);

      // Invalid thickness (too thick)
      const thickPlateContext = { 
        ...mockContext, 
        inputs: { ...testInputs, plateThickness: 1.5 } 
      };
      expect(validateConfiguration(thickPlateContext).validationDetails.get('thicknessRange')).toBe(false);
    });

    it('should provide material limits for different materials', () => {
      const aisi316Limits = getMaterialLimits('AISI 316L');
      expect(aisi316Limits.maxPressure).toBe(40);
      expect(aisi316Limits.maxTemperature).toBe(300);

      const st3Limits = getMaterialLimits('Ст3');
      expect(st3Limits.maxPressure).toBe(10);
      expect(st3Limits.maxTemperature).toBe(150);
    });

    it('should provide material recommendations based on conditions', () => {
      // High pressure and temperature
      const highConditionsContext = { 
        ...mockContext, 
        inputs: { ...testInputs, pressureA: 30, temperatureA: 250 } 
      };
      expect(getMaterialRecommendation(highConditionsContext)).toBe('AISI 316L');

      // Standard conditions
      const standardConditionsContext = { 
        ...mockContext, 
        inputs: { ...testInputs, pressureA: 8, pressureB: 8, temperatureA: 80, temperatureB: 80 } 
      };
      expect(getMaterialRecommendation(standardConditionsContext)).toBe('Ст3');
    });
  });

  describe('Integration Test: Complete Phase 3 Flow', () => {
    it('should execute all Phase 3 calculations successfully through engine', () => {
      const result = engine.calculate(testInputs, testSupplyParams);

      // Test that Phase 3 features are included in result
      expect(result.exportData.phase3Implemented).toBe(true);
      expect(result.exportData.version).toBe('2.1.0');

      // Test validation is included
      expect(result.validation).toBeDefined();
      expect(result.validation?.isValid).toBe(true);

      // Test enhanced costs are included
      expect(result.exportData.enhancedCosts).toBeDefined();
      expect(result.exportData.enhancedCosts?.materialBreakdown).toBeDefined();
      expect(result.exportData.enhancedCosts?.laborBreakdown).toBeDefined();
      expect(result.exportData.enhancedCosts?.logistics).toBeDefined();
      expect(result.exportData.enhancedCosts?.equipmentSpecific).toBeDefined();

      // Test that total cost is calculated and positive
      expect(result.totalCost).toBeGreaterThan(0);

      // Test pressure calculations still work
      expect(result.pressureTestHot).toBeGreaterThan(0);
      expect(result.pressureTestCold).toBeGreaterThan(0);

      console.log('✅ Phase 3 Integration Test Results:');
      console.log(`Total Cost: ₽${result.totalCost.toLocaleString()}`);
      console.log(`Material Costs: ₽${result.exportData.enhancedCosts?.cutting || 0}`);
      console.log(`Logistics: ₽${result.exportData.enhancedCosts?.logistics?.total || 0}`);
      console.log(`Validation: ${result.validation?.isValid ? 'PASSED' : 'FAILED'}`);
    });

    it('should handle invalid configurations gracefully', () => {
      const invalidInputs = { 
        ...testInputs, 
        materialPlate: 'Ст3', 
        pressureA: 25, // Exceeds Ст3 limit of 10 bar
        plateThickness: 1.5 // Exceeds max of 1.2mm
      };

      const result = engine.calculate(invalidInputs, testSupplyParams);

      // Should still calculate but show validation errors
      expect(result.validation?.isValid).toBe(false);
      expect(result.validation?.errors?.length).toBeGreaterThan(0);
      expect(result.totalCost).toBeGreaterThan(0); // Should still calculate cost
    });
  });
});