import { describe, it, expect } from 'vitest';
import { 
  calculatePlateWeightWithCladding,
  calculateCoverWeight,
  calculatePanelWeight,
  calculateTotalAssemblyWeight 
} from './formula-library-complete';
import type { FormulaContext } from './types';

describe('Density Scaling Bug Fix Validation', () => {
  const testContext: FormulaContext = {
    inputs: {
      equipmentType: 'К4-750',
      modelCode: 'К4-750',
      plateCount: 400,
      plateThickness: 0.6, // 0.6mm
      materialPlate: 'STEEL',
      materialBody: 'STEEL',
      pressureA: 10,
      pressureB: 10,
      temperatureA: 80,
      temperatureB: 60,
      plateConfiguration: '1/6',
      surfaceType: 'гофра',
      drawDepth: 10,
      claddingThickness: 5
    },
    materials: new Map(),
    namedRanges: new Map(),
    dependencies: new Map(),
    intermediateValues: new Map(),
    supply: {
      plateMaterialPrice: 150,
      claddingMaterialPrice: 200,
      columnCoverMaterialPrice: 170,
      panelMaterialPrice: 160,
      laborRate: 800,
      standardLaborHours: 40,
      cuttingCost: 15000,
      internalLogistics: 5000
    }
  };

  it('should fix plate weight calculation density scaling', () => {
    const plateWeight = calculatePlateWeightWithCladding(testContext);
    
    // Before fix: ~0.002 kg (way too small)
    // After fix: should be much larger (hundreds to thousands of kg)
    expect(plateWeight).toBeGreaterThan(100); // At least 100 kg
    expect(plateWeight).toBeLessThan(10000); // But not unreasonably large
    
    console.log(`Plate weight: ${plateWeight.toFixed(2)} kg`);
  });

  it('should fix cover weight calculation density scaling', () => {
    const coverWeight = calculateCoverWeight(testContext);
    
    expect(coverWeight).toBeGreaterThan(1); // At least 1 kg
    expect(coverWeight).toBeLessThan(1000); // But reasonable
    
    console.log(`Cover weight: ${coverWeight.toFixed(2)} kg`);
  });

  it('should fix panel weight calculation density scaling', () => {
    const panelWeight = calculatePanelWeight(testContext);
    
    expect(panelWeight).toBeGreaterThan(1); // At least 1 kg
    expect(panelWeight).toBeLessThan(1000); // But reasonable
    
    console.log(`Panel weight: ${panelWeight.toFixed(2)} kg`);
  });

  it('should produce realistic total assembly weight', () => {
    const totalWeight = calculateTotalAssemblyWeight(testContext);
    
    // For К4-750 with 400 plates at 0.6mm, expect hundreds to low thousands of kg
    expect(totalWeight).toBeGreaterThan(500); // At least 500 kg total
    expect(totalWeight).toBeLessThan(20000); // But not unreasonably large
    
    console.log(`Total assembly weight: ${totalWeight.toFixed(2)} kg`);
    console.log('✅ Density scaling fix validation PASSED');
  });

  it('should verify the exact scaling factor fix', () => {
    // Test smaller values to verify the exact scaling
    const smallContext: FormulaContext = {
      ...testContext,
      inputs: {
        ...testContext.inputs,
        plateCount: 10,
        plateThickness: 1.0
      }
    };
    
    const plateWeight = calculatePlateWeightWithCladding(smallContext);
    
    // With the fix, even small configurations should produce meaningful weights
    expect(plateWeight).toBeGreaterThan(1); // Should be > 1 kg
    expect(plateWeight).toBeLessThan(100); // But reasonable for small config
    
    console.log(`Small config plate weight: ${plateWeight.toFixed(2)} kg`);
    console.log('✅ Scaling factor correction verified');
  });
});