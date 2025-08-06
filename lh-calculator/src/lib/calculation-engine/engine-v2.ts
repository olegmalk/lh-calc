/**
 * Calculation Engine V2 - Parameterized for 13 equipment variants
 * Implements the 53 core calculations for any equipment type
 */

import type { 
  HeatExchangerInput, 
  CalculationResult, 
  FormulaContext,
  ComponentCosts 
} from './types';
import { 
  EQUIPMENT_SPECS,
  NAMED_RANGES
} from './constants';
import { executeAllCalculations, calc_PressureTest } from './formula-library-complete';

export class CalculationEngineV2 {
  private context: FormulaContext;
  private calculationCache: Map<string, Map<string, number>>;
  
  constructor() {
    this.context = {
      inputs: {} as HeatExchangerInput,
      materials: new Map(),
      namedRanges: new Map(Object.entries(NAMED_RANGES)),
      intermediateValues: new Map(),
      dependencies: new Map(),
    };
    
    // Cache calculations per equipment type
    this.calculationCache = new Map();
    
    this.initializeMaterials();
    this.initializeDependencies();
  }
  
  private initializeMaterials() {
    // Initialize all materials from named ranges
    const materials = [
      { name: 'AISI 316L', density: 8080, pricePerKg: 850 },
      { name: 'AISI 304', density: 8030, pricePerKg: 750 },
      { name: 'Ст3', density: 7880, pricePerKg: 120 },
      { name: 'Ст20', density: 7880, pricePerKg: 150 },
      { name: '09Г2С', density: 7880, pricePerKg: 180 },
      { name: '12Х18Н10Т', density: 8080, pricePerKg: 900 },
    ];
    
    materials.forEach(mat => {
      this.context.materials.set(mat.name, {
        name: mat.name,
        density: mat.density,
        pricePerKg: mat.pricePerKg,
        temperatureStressMatrix: this.getTemperatureStressMatrix(mat.name),
      });
    });
  }
  
  private getTemperatureStressMatrix(material: string): Map<number, number> {
    // Temperature-stress relationships for materials
    const matrices: Record<string, Map<number, number>> = {
      'AISI 316L': new Map([
        [20, 170], [100, 160], [150, 154], [200, 150], [250, 145], [300, 140]
      ]),
      'AISI 304': new Map([
        [20, 165], [100, 155], [150, 150], [200, 145], [250, 140], [300, 135]
      ]),
      'default': new Map([
        [20, 160], [100, 150], [150, 145], [200, 140], [250, 135], [300, 130]
      ]),
    };
    
    return matrices[material] || matrices.default;
  }
  
  private initializeDependencies() {
    // Define calculation dependencies
    this.context.dependencies.set('L_ComponentVolume', ['J_DimensionPlus20', 'K_ColumnHeightBase']);
    this.context.dependencies.set('O_SecondaryVolume', ['M_DimensionPlus10', 'N_ColumnHeightRepeat']);
    this.context.dependencies.set('R_AreaCalculation', ['P_WidthCalculation', 'Q_HeightCalculation']);
    this.context.dependencies.set('BA_MaterialTotal', [
      'AL_LengthCalculation', 'AM_Calculation', 'AN_Calculation',
      'AP_Calculation', 'AQ_Calculation', 'AR_Calculation', 'AS_Calculation'
    ]);
    // ... Add more dependencies
  }
  
  /**
   * Main calculation method - executes all 53 calculations for the equipment type
   */
  calculate(inputs: HeatExchangerInput): CalculationResult {
    // Validate equipment type
    const specs = EQUIPMENT_SPECS[inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
    if (!specs) {
      throw new Error(`Unknown equipment type: ${inputs.equipmentType}`);
    }
    
    // Update context with inputs
    this.context.inputs = inputs;
    this.context.intermediateValues.clear();
    
    // Check cache
    const cacheKey = this.getCacheKey(inputs);
    if (this.calculationCache.has(cacheKey)) {
      console.log(`Using cached calculations for ${inputs.equipmentType}`);
    }
    
    // Phase 1: Pressure calculations (технолог sheet)
    const pressureTestA = calc_PressureTest(inputs.pressureA, this.context);
    const pressureTestB = calc_PressureTest(inputs.pressureB, this.context);
    
    // Phase 2: Execute all 53 calculations (снабжение sheet)
    const calculations = executeAllCalculations(this.context);
    
    // Phase 3: Calculate component costs
    const componentCosts = this.calculateComponentCosts(calculations);
    
    // Phase 4: Aggregate results (результат sheet)
    const totalCost = this.calculateTotalCost(componentCosts, calculations);
    const costBreakdown = this.generateCostBreakdown(componentCosts, totalCost);
    
    // Prepare export data for Bitrix24
    const exportData = this.prepareExportData(inputs, calculations, componentCosts, totalCost);
    
    return {
      pressureTestA,
      pressureTestB,
      interpolatedValues: new Map(calculations),
      componentDimensions: this.extractDimensions(calculations),
      materialRequirements: this.extractMaterials(calculations),
      componentCosts,
      totalCost,
      costBreakdown,
      exportData,
    };
  }
  
  private getCacheKey(inputs: HeatExchangerInput): string {
    return `${inputs.equipmentType}_${inputs.plateCount}_${inputs.materialPlate}_${inputs.materialBody}`;
  }
  
  private calculateComponentCosts(calculations: Map<string, number>): ComponentCosts {
    const material = this.context.materials.get(this.context.inputs.materialPlate);
    const pricePerKg = material?.pricePerKg || 850;
    
    // Extract relevant calculations for cost
    const costs: ComponentCosts = {
      covers: (calculations.get('H_CoverArea') || 0) * pricePerKg,
      columns: (calculations.get('L_ComponentVolume') || 0) * pricePerKg * 1.2,
      panelsA: (calculations.get('O_SecondaryVolume') || 0) * pricePerKg,
      panelsB: (calculations.get('R_AreaCalculation') || 0) * pricePerKg,
      fasteners: this.calculateFastenerCost(),
      flanges: this.calculateFlangeCost(),
      gaskets: this.calculateGasketCost(),
      materials: (calculations.get('BA_MaterialTotal') || 0) * pricePerKg,
      total: 0,
    };
    
    // Calculate total
    costs.total = Object.values(costs)
      .filter(v => typeof v === 'number')
      .reduce((sum, cost) => sum + cost, 0);
    
    return costs;
  }
  
  private calculateFastenerCost(): number {
    const { plateCount, equipmentType } = this.context.inputs;
    const specs = EQUIPMENT_SPECS[equipmentType as keyof typeof EQUIPMENT_SPECS];
    
    // Base cost per plate, adjusted by equipment size
    const sizeFactor = specs ? (specs.width * specs.height) / 100000 : 1;
    return plateCount * 250 * sizeFactor;
  }
  
  private calculateFlangeCost(): number {
    // Calculate based on pressure rating
    const { pressureA, pressureB } = this.context.inputs;
    const maxPressure = Math.max(pressureA, pressureB);
    
    // Find appropriate flange spec
    let flangePrice = 45000; // Default
    
    if (maxPressure <= 10) {
      flangePrice = 35000;
    } else if (maxPressure <= 25) {
      flangePrice = 45000;
    } else if (maxPressure <= 40) {
      flangePrice = 55000;
    } else {
      flangePrice = 65000;
    }
    
    return flangePrice;
  }
  
  private calculateGasketCost(): number {
    const { plateCount } = this.context.inputs;
    return plateCount * 150; // 150 RUB per plate for gaskets
  }
  
  private calculateTotalCost(
    componentCosts: ComponentCosts, 
    calculations: Map<string, number>
  ): number {
    // Add any additional costs not in component costs
    const additionalCosts = calculations.get('BB_CostComponents') || 0;
    return componentCosts.total + additionalCosts;
  }
  
  private generateCostBreakdown(
    componentCosts: ComponentCosts, 
    totalCost: number
  ): Map<string, number> {
    const breakdown = new Map<string, number>();
    
    Object.entries(componentCosts).forEach(([key, value]) => {
      if (key !== 'total' && typeof value === 'number') {
        const percentage = (value / totalCost) * 100;
        breakdown.set(key, percentage);
      }
    });
    
    return breakdown;
  }
  
  private extractDimensions(calculations: Map<string, number>): Map<string, number> {
    const dimensions = new Map<string, number>();
    
    // Extract dimension-related calculations
    dimensions.set('coverWidth', calculations.get('P_WidthCalculation') || 0);
    dimensions.set('coverHeight', calculations.get('Q_HeightCalculation') || 0);
    dimensions.set('columnHeight', calculations.get('K_ColumnHeightBase') || 0);
    dimensions.set('panelWidth', calculations.get('J_DimensionPlus20') || 0);
    
    return dimensions;
  }
  
  private extractMaterials(calculations: Map<string, number>): Map<string, number> {
    const materials = new Map<string, number>();
    
    // Extract material-related calculations
    materials.set('plateVolume', calculations.get('H_CoverArea') || 0);
    materials.set('bodyVolume', calculations.get('L_ComponentVolume') || 0);
    materials.set('totalMaterial', calculations.get('BA_MaterialTotal') || 0);
    
    // Convert to mass
    const plateMaterial = this.context.materials.get(this.context.inputs.materialPlate);
    const bodyMaterial = this.context.materials.get(this.context.inputs.materialBody);
    
    if (plateMaterial) {
      materials.set('plateMass', (materials.get('plateVolume') || 0) * plateMaterial.density);
    }
    if (bodyMaterial) {
      materials.set('bodyMass', (materials.get('bodyVolume') || 0) * bodyMaterial.density);
    }
    
    return materials;
  }
  
  private prepareExportData(
    inputs: HeatExchangerInput,
    calculations: Map<string, number>,
    componentCosts: ComponentCosts,
    totalCost: number
  ): any {
    return {
      // Input parameters
      equipment: {
        type: inputs.equipmentType,
        plateCount: inputs.plateCount,
        configuration: inputs.plateConfiguration,
      },
      materials: {
        plate: inputs.materialPlate,
        body: inputs.materialBody,
        surface: inputs.surfaceType,
      },
      parameters: {
        pressureA: inputs.pressureA,
        pressureB: inputs.pressureB,
        temperatureA: inputs.temperatureA,
        temperatureB: inputs.temperatureB,
      },
      // Calculated values
      calculations: Object.fromEntries(calculations),
      costs: componentCosts,
      totalCost,
      // Metadata
      calculatedAt: new Date().toISOString(),
      version: '2.0.0',
      excelRow: EQUIPMENT_SPECS[inputs.equipmentType as keyof typeof EQUIPMENT_SPECS]?.row,
    };
  }
  
  /**
   * Validate calculations against Excel expected values
   */
  validateAgainstExcel(
    inputs: HeatExchangerInput, 
    expectedValues: Map<string, number>
  ): Map<string, { calculated: number; expected: number; difference: number }> {
    const result = this.calculate(inputs);
    const validation = new Map<string, any>();
    
    expectedValues.forEach((expected, key) => {
      const calculated = result.interpolatedValues.get(key) || 0;
      const difference = Math.abs(calculated - expected);
      const percentDiff = (difference / expected) * 100;
      
      validation.set(key, {
        calculated,
        expected,
        difference,
        percentDiff,
        pass: percentDiff < 0.01, // Within 0.01% tolerance
      });
    });
    
    return validation;
  }
}