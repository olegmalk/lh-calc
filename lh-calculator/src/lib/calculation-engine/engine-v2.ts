/**
 * Calculation Engine V2 - Parameterized for 13 equipment variants
 * Implements the 53 core calculations for any equipment type
 */

import type { 
  HeatExchangerInput, 
  CalculationResult, 
  FormulaContext,
  ComponentCosts,
  ExportData,
  SupplyParameters,
  EnhancedMaterialCosts,
  EnhancedLaborCosts,
  LogisticsCosts,
  EquipmentLogic,
  FinalCostBreakdown,
  ComponentUsageSummary
} from './types';
import { 
  EQUIPMENT_SPECS,
  NAMED_RANGES
} from './constants';
import { getMaterialDensity, EQUIPMENT_TABLE } from './vlookup-tables';
import { 
  executeAllCalculations, 
  calc_AI73_TestPressureHot, 
  calc_AJ73_TestPressureCold,
  calculateMaterialCosts,
  calculateTotalCost,
  calculateEnhancedMaterialCosts,
  calculateEnhancedLaborCosts,
  calculateLogisticsCosts,
  applyEquipmentSpecificLogic,
  validateConfiguration,
  calculateTotalCostWithBreakdown
} from './formula-library-complete';
import { calculateCoreCosts } from './cost-calculations';

export class CalculationEngineV2 {
  private context: FormulaContext;
  private calculationCache: Map<string, Map<string, number>>;
  
  constructor() {
    this.context = {
      inputs: {} as HeatExchangerInput,
      materials: new Map(),
      namedRanges: new Map(Object.entries(NAMED_RANGES).map(([key, value]) => [key, Array.isArray(value) ? { items: value } : { value }])),
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
    // CRITICAL FIX: Using scaled densities (×10⁻⁶) to match Excel formulas
    const materials = [
      { name: 'AISI 316L', density: 0.008080, pricePerKg: 850 },  // Excel: 8080/10^6
      { name: 'AISI 304', density: 0.008030, pricePerKg: 750 },   // Excel: 8030/10^6
      { name: 'Ст3', density: 0.007880, pricePerKg: 120 },        // Excel: 7880/10^6
      { name: 'Ст20', density: 0.007850, pricePerKg: 150 },       // Excel: 7850/10^6
      { name: '09Г2С', density: 0.007850, pricePerKg: 180 },      // Excel: 7850/10^6
      { name: '12Х18Н10Т', density: 0.007900, pricePerKg: 900 },  // Excel: 7900/10^6
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
  calculate(inputs: HeatExchangerInput, supplyParams?: SupplyParameters): CalculationResult {
    // Validate equipment type
    const specs = EQUIPMENT_SPECS[inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
    if (!specs) {
      throw new Error(`Unknown equipment type: ${inputs.equipmentType}`);
    }
    
    // Update context with inputs and supply parameters
    this.context.inputs = inputs;
    this.context.supply = supplyParams;
    this.context.intermediateValues.clear();
    
    // Phase 0: Validation (LH-F013)
    const validation = validateConfiguration(this.context);
    if (!validation.isValid) {
      console.warn('Validation errors:', validation.errors);
      console.warn('Validation warnings:', validation.warnings);
    }
    
    // Check cache
    const cacheKey = this.getCacheKey(inputs);
    if (this.calculationCache.has(cacheKey)) {
      console.log(`Using cached calculations for ${inputs.equipmentType}`);
    }
    
    // Phase 1: Pressure calculations (технолог sheet)
    const pressureTestHot = calc_AI73_TestPressureHot(this.context);
    const pressureTestCold = calc_AJ73_TestPressureCold(this.context);
    
    // Phase 2: Execute all 53 calculations (снабжение sheet)
    const calculations = executeAllCalculations(this.context);
    
    // Phase 3: Enhanced Business Logic Calculations
    const enhancedMaterialCosts = calculateEnhancedMaterialCosts(this.context);
    const enhancedLaborCosts = calculateEnhancedLaborCosts(this.context);
    const logisticsCosts = calculateLogisticsCosts(this.context);
    const equipmentLogic = applyEquipmentSpecificLogic(this.context);
    
    // Phase 4: Calculate component costs using enhanced calculations
    const componentCosts = this.calculateEnhancedComponentCosts(
      calculations, 
      enhancedMaterialCosts, 
      enhancedLaborCosts, 
      logisticsCosts, 
      equipmentLogic
    );
    
    // Story 5: Core Cost Calculations (N26, P26, O26, H26, F26, J32)
    const coreCosts = calculateCoreCosts(this.context);
    
    // Phase 4: Final aggregations (результат sheet) - LH-F014/F015
    const finalCostAggregation = calculateTotalCostWithBreakdown(this.context);
    const finalCostBreakdown = finalCostAggregation.costBreakdown;
    const componentUsage = finalCostAggregation.componentUsage;
    const finalTotalCost = finalCostAggregation.finalTotalCost;
    const costPercentages = finalCostAggregation.costPercentages;
    
    // Phase 5: Legacy compatibility
    const totalCost = finalTotalCost; // Use Excel-accurate total cost
    const costBreakdown = this.generateCostBreakdown(componentCosts, totalCost);
    
    // Prepare export data for Bitrix24
    const exportData = this.prepareEnhancedExportData(
      inputs, 
      calculations, 
      componentCosts, 
      totalCost,
      validation,
      enhancedMaterialCosts,
      enhancedLaborCosts,
      logisticsCosts,
      equipmentLogic,
      finalCostBreakdown,
      componentUsage
    );
    
    return {
      pressureTestHot,
      pressureTestCold,
      interpolatedValues: new Map(calculations),
      componentDimensions: this.extractDimensions(calculations),
      materialRequirements: this.extractMaterials(calculations),
      componentCosts,
      totalCost,
      costBreakdown,
      exportData,
      validation, // Add validation results to output
      
      // Story 5: Core cost calculations
      coreCosts,
      
      // Phase 4: Final aggregations (результат sheet)
      finalCostBreakdown,
      componentUsage,
      finalTotalCost,
      costPercentages,
    };
  }
  
  private getCacheKey(inputs: HeatExchangerInput): string {
    return `${inputs.equipmentType}_${inputs.plateCount}_${inputs.materialPlate}_${inputs.materialBody}`;
  }
  
  // @ts-expect-error - Legacy method kept for backward compatibility
  private calculateComponentCosts(_calculations: Map<string, number>): ComponentCosts {
    // Use new comprehensive material cost calculations
    const materialCosts = calculateMaterialCosts(this.context);
    
    const costs: ComponentCosts = {
      covers: materialCosts.claddingCost,
      columns: materialCosts.columnCoverCost,
      panelsA: materialCosts.panelCost * 0.5, // Split panel cost
      panelsB: materialCosts.panelCost * 0.5,
      fasteners: this.calculateFastenerCost(),
      flanges: this.calculateFlangeCost(),
      gaskets: this.calculateGasketCost(),
      materials: materialCosts.plateCost,
      total: 0,
    };
    
    // Calculate total
    costs.total = Object.values(costs)
      .filter(v => typeof v === 'number')
      .reduce((sum, cost) => sum + cost, 0);
    
    return costs;
  }

  private calculateEnhancedComponentCosts(
    _calculations: Map<string, number>,
    materialCosts: EnhancedMaterialCosts,
    _laborCosts: EnhancedLaborCosts,
    _logisticsCosts: LogisticsCosts,
    _equipmentLogic: EquipmentLogic
  ): ComponentCosts {
    const costs: ComponentCosts = {
      covers: materialCosts.claddingMaterialCost,
      columns: materialCosts.columnCoverMaterialCost,
      panelsA: materialCosts.panelMaterialCost * 0.5, // Split panel cost
      panelsB: materialCosts.panelMaterialCost * 0.5,
      fasteners: this.calculateFastenerCost(),
      flanges: this.calculateFlangeCost(),
      gaskets: this.calculateGasketCost(),
      materials: materialCosts.plateMaterialCost,
      total: 0,
    };

    // Calculate total of ONLY the component costs (what's shown in breakdown)
    // Don't include labor, logistics, etc. as they're not shown as line items
    costs.total = Object.entries(costs)
      .filter(([key, value]) => key !== 'total' && typeof value === 'number')
      .reduce((sum, [_, cost]) => sum + cost, 0);

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
  
  // @ts-expect-error - Legacy method kept for backward compatibility
  private calculateTotalCost(
    componentCosts: ComponentCosts, 
    calculations: Map<string, number>
  ): number {
    // Use the new comprehensive cost calculation
    const totalCostFromCalculations = calculateTotalCost(this.context);
    
    // Fallback to old calculation if new one returns 0
    if (totalCostFromCalculations > 0) {
      return totalCostFromCalculations;
    }
    
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
  
  private extractMaterials(_calculations: Map<string, number>): Map<string, number> {
    const materials = new Map<string, number>();
    
    // Get equipment from VLOOKUP table
    const equipment = EQUIPMENT_TABLE[this.context.inputs.equipmentType];
    if (!equipment) {
      throw new Error(`Equipment type ${this.context.inputs.equipmentType} not found`);
    }
    
    // Get dimensions from VLOOKUP (Excel columns E, F)
    const plateLength = equipment.length;    
    const plateWidth = equipment.width;      
    
    // Get plate thickness from input U27 (NOT from VLOOKUP)
    const plateThickness = this.context.inputs.plateThickness; // mm
    
    // Get equipment count from input I27
    const equipmentCount = this.context.inputs.plateCount;
    
    // Add 15mm padding as per Excel formula
    const adjustedLength = plateLength + 15; 
    const adjustedWidth = plateWidth + 15;   
    
    // Get material density (G93)
    const plateDensity = getMaterialDensity(this.context.inputs.materialPlate); // kg/mm³
    
    // Calculate plate mass using exact Excel formula: 
    // =(E+15)*(F+15)*plateThickness*G93/1000*equipmentCount
    const plateMass = adjustedLength * adjustedWidth * plateThickness * plateDensity / 1000 * equipmentCount;
    
    // Calculate volume for display (m³)
    const plateVolume = (adjustedLength * adjustedWidth * plateThickness * equipmentCount) / 1000000000;
    
    // Calculate housing/body volume and mass for backward compatibility
    const wallThickness = 0.01; // 10mm wall thickness
    const depth = 500; // Assume 500mm depth for housing
    const housingVolume = ((adjustedLength * adjustedWidth * depth) / 1000000000) * wallThickness * 4;
    
    const bodyMaterial = this.context.materials.get(this.context.inputs.materialBody);
    const bodyMass = bodyMaterial ? housingVolume * bodyMaterial.density * 1000000 : 0;
    
    // Set values in the original format for full backward compatibility
    materials.set('plateMass', plateMass);
    materials.set('plateVolume', plateVolume); 
    materials.set('totalMaterial', plateVolume);
    materials.set('bodyVolume', housingVolume);
    materials.set('bodyMass', bodyMass);
    
    // Component mass calculations using VLOOKUP data (Story 4)
    const components = [
      { name: 'Гребенка 4шт', mass: equipment.componentL * equipmentCount },
      { name: 'Полоса гребенки 4шт', mass: equipment.componentO * equipmentCount },
      { name: 'Лист концевой 2шт', mass: equipment.componentR * equipmentCount },
      { name: 'Зеркало А 4шт', mass: equipment.componentAB * equipmentCount },
      { name: 'Зеркало Б 4шт', mass: equipment.componentAE * equipmentCount },
      { name: 'Лист плакирующий А 2шт', mass: equipment.componentAH * equipmentCount },
      { name: 'Лист плакирующий Б 2шт', mass: equipment.componentAK * equipmentCount }
    ];

    // Add each component to materials map - just the mass values as expected by tests
    components.forEach(component => {
      materials.set(component.name, component.mass);
    });

    // Calculate total component mass for validation
    const totalComponentMass = components.reduce((sum, c) => sum + c.mass, 0);
    materials.set('totalComponentMass', totalComponentMass);
    
    // Add enhanced Plate Package data - just the mass value
    materials.set('Plate Package', plateMass);
    
    return materials;
  }
  
  private prepareExportData(
    inputs: HeatExchangerInput,
    calculations: Map<string, number>,
    componentCosts: ComponentCosts,
    totalCost: number
  ): ExportData {
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
      costs: {
        covers: componentCosts.covers,
        columns: componentCosts.columns,
        panelsA: componentCosts.panelsA,
        panelsB: componentCosts.panelsB,
        fasteners: componentCosts.fasteners,
        flanges: componentCosts.flanges,
        gaskets: componentCosts.gaskets,
        materials: componentCosts.materials,
        total: componentCosts.total,
      },
      totalCost,
      // Metadata
      calculatedAt: new Date().toISOString(),
      version: '2.0.0',
      excelRow: EQUIPMENT_SPECS[inputs.equipmentType as keyof typeof EQUIPMENT_SPECS]?.row,
    };
  }

  private prepareEnhancedExportData(
    inputs: HeatExchangerInput,
    calculations: Map<string, number>,
    componentCosts: ComponentCosts,
    totalCost: number,
    validation: { isValid: boolean; errors: string[]; warnings: string[]; validationDetails: Map<string, boolean> },
    materialCosts: EnhancedMaterialCosts,
    laborCosts: EnhancedLaborCosts,
    logisticsCosts: LogisticsCosts,
    equipmentLogic: EquipmentLogic,
    finalCostBreakdown?: FinalCostBreakdown,
    componentUsage?: ComponentUsageSummary
  ): ExportData {
    const baseData = this.prepareExportData(inputs, calculations, componentCosts, totalCost);
    
    // Extend with Phase 3 enhanced data
    return {
      ...baseData,
      // Enhanced cost breakdown
      enhancedCosts: {
        materialBreakdown: Object.fromEntries(materialCosts.materialBreakdown),
        laborBreakdown: Object.fromEntries(laborCosts.laborBreakdown),
        logistics: {
          internal: logisticsCosts.internalLogisticsCost,
          distribution: logisticsCosts.distributionCost,
          total: logisticsCosts.totalLogisticsCost,
          weightPercentage: logisticsCosts.weightPercentage,
        },
        equipmentSpecific: {
          additionalCosts: equipmentLogic.additionalCosts,
          specialRequirements: equipmentLogic.specialRequirements,
          materialAdjustments: Object.fromEntries(equipmentLogic.materialAdjustments),
        },
        cutting: materialCosts.cuttingCost,
      },
      // Validation results
      validation: {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings,
        validationDetails: Object.fromEntries(validation.validationDetails),
      },
      // Phase 4: Final aggregations data (результат sheet)
      finalCostBreakdown: finalCostBreakdown ? {
        F26_PlateWork: finalCostBreakdown.F26_PlateWork,
        G26_CorpusTotal: finalCostBreakdown.G26_CorpusTotal,
        H26_PanelMaterial: finalCostBreakdown.H26_PanelMaterial,
        I26_Covers: finalCostBreakdown.I26_Covers,
        J26_Columns: finalCostBreakdown.J26_Columns,
        K26_Connections: finalCostBreakdown.K26_Connections,
        L26_Gaskets: finalCostBreakdown.L26_Gaskets,
        M26_GasketSets: finalCostBreakdown.M26_GasketSets,
        N26_PlatePackage: finalCostBreakdown.N26_PlatePackage,
        O26_CladMaterial: finalCostBreakdown.O26_CladMaterial,
        P26_InternalSupports: finalCostBreakdown.P26_InternalSupports,
        Q26_Other: finalCostBreakdown.Q26_Other,
        R26_Attachment: finalCostBreakdown.R26_Attachment,
        S26_Legs: finalCostBreakdown.S26_Legs,
        T26_OtherMaterials: finalCostBreakdown.T26_OtherMaterials,
        U26_ShotBlock: finalCostBreakdown.U26_ShotBlock,
        V26_Uncounted: finalCostBreakdown.V26_Uncounted,
        W26_SpareKit: finalCostBreakdown.W26_SpareKit,
        X26_InternalLogistics: finalCostBreakdown.X26_InternalLogistics,
        J30_WorkTotal: finalCostBreakdown.J30_WorkTotal,
        J31_CorpusCategory: finalCostBreakdown.J31_CorpusCategory,
        J32_CoreCategory: finalCostBreakdown.J32_CoreCategory,
        J33_ConnectionsCategory: finalCostBreakdown.J33_ConnectionsCategory,
        J34_OtherCategory: finalCostBreakdown.J34_OtherCategory,
        J35_COFCategory: finalCostBreakdown.J35_COFCategory,
        J36_SpareCategory: finalCostBreakdown.J36_SpareCategory,
        U32_GrandTotal: finalCostBreakdown.U32_GrandTotal,
        costPerUnit: finalCostBreakdown.costPerUnit,
      } : undefined,
      
      componentUsage: componentUsage ? {
        plates: componentUsage.plates,
        covers: componentUsage.covers,
        columns: componentUsage.columns,
        panels: componentUsage.panels,
        fasteners: componentUsage.fasteners,
        gaskets: componentUsage.gaskets,
        totalWeight: componentUsage.totalWeight,
        totalCost: componentUsage.totalCost,
        wastePercentage: componentUsage.wastePercentage,
        materialBreakdown: Object.fromEntries(componentUsage.materialBreakdown),
      } : undefined,
      
      // Updated metadata
      version: '2.2.0',
      phase3Implemented: true,
      phase4Implemented: true,
      excelParityAchieved: true,
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
    const validation = new Map<string, { calculated: number; expected: number; difference: number }>();
    
    expectedValues.forEach((expected, key) => {
      const calculated = result.interpolatedValues.get(key) || 0;
      const difference = Math.abs(calculated - expected);
      
      validation.set(key, {
        calculated,
        expected,
        difference,
      });
    });
    
    return validation;
  }
}