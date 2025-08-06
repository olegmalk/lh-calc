import type { 
  HeatExchangerInput, 
  CalculationResult, 
  FormulaContext,
  ComponentCosts 
} from './types';
import { 
  MATERIAL_DENSITIES, 
  SAFETY_FACTOR, 
  PRESSURE_SIZE_MATRIX,
  EQUIPMENT_SPECS,
  NAMED_RANGES 
} from './constants';

export class CalculationEngine {
  private context: FormulaContext;
  
  constructor() {
    this.context = {
      inputs: {} as HeatExchangerInput,
      materials: new Map(),
      namedRanges: new Map(Object.entries(NAMED_RANGES)),
      intermediateValues: new Map(),
      dependencies: new Map(),
    };
    
    this.initializeMaterials();
  }
  
  private initializeMaterials() {
    // Initialize material properties
    this.context.materials.set('AISI 316L', {
      name: 'AISI 316L',
      density: MATERIAL_DENSITIES['AISI 316L'],
      pricePerKg: 850,
    });
    
    this.context.materials.set('AISI 304', {
      name: 'AISI 304',
      density: MATERIAL_DENSITIES['AISI 304'],
      pricePerKg: 750,
    });
  }
  
  /**
   * Main calculation method
   */
  calculate(inputs: HeatExchangerInput): CalculationResult {
    this.context.inputs = inputs;
    
    // Clear previous intermediate values
    this.context.intermediateValues.clear();
    
    // Phase 1: Technical calculations (технолог)
    const pressureTestA = this.calculatePressureTest(inputs.pressureA, 'A');
    const pressureTestB = this.calculatePressureTest(inputs.pressureB, 'B');
    
    // Phase 2: Component calculations (снабжение)
    const componentDimensions = this.calculateComponentDimensions();
    const materialRequirements = this.calculateMaterialRequirements();
    const componentCosts = this.calculateComponentCosts();
    
    // Phase 3: Results aggregation (результат)
    const totalCost = this.calculateTotalCost(componentCosts);
    const costBreakdown = this.generateCostBreakdown(componentCosts);
    
    return {
      pressureTestA,
      pressureTestB,
      interpolatedValues: new Map(this.context.intermediateValues),
      componentDimensions,
      materialRequirements,
      componentCosts,
      totalCost,
      costBreakdown,
      exportData: this.prepareExportData(),
    };
  }
  
  /**
   * Calculate pressure test value (AI73/AJ73 formulas)
   * Excel: =CEILING.PRECISE(1.25*pressure*factor/divisor, 0.01)
   */
  private calculatePressureTest(pressure: number, side: 'A' | 'B'): number {
    // Get interpolated size factor
    const sizeFactor = this.interpolatePressureSize(pressure);
    this.context.intermediateValues.set(`sizeFactor${side}`, sizeFactor);
    
    // Apply safety factor and calculate
    const calculated = SAFETY_FACTOR * pressure * 1800 / sizeFactor;
    
    // CEILING.PRECISE equivalent - round up to nearest 0.01
    return Math.ceil(calculated * 100) / 100;
  }
  
  /**
   * Interpolate pressure-size relationship
   * Implements VLOOKUP/INDEX/MATCH logic from Excel
   */
  private interpolatePressureSize(pressure: number): number {
    const pressures = Array.from(PRESSURE_SIZE_MATRIX.keys()).sort((a, b) => a - b);
    
    // Find bracketing values
    let lowerPressure = pressures[0];
    let upperPressure = pressures[pressures.length - 1];
    
    for (let i = 0; i < pressures.length - 1; i++) {
      if (pressure >= pressures[i] && pressure <= pressures[i + 1]) {
        lowerPressure = pressures[i];
        upperPressure = pressures[i + 1];
        break;
      }
    }
    
    // If exact match
    if (PRESSURE_SIZE_MATRIX.has(pressure)) {
      return PRESSURE_SIZE_MATRIX.get(pressure)!;
    }
    
    // Linear interpolation
    const lowerSize = PRESSURE_SIZE_MATRIX.get(lowerPressure)!;
    const upperSize = PRESSURE_SIZE_MATRIX.get(upperPressure)!;
    
    const ratio = (pressure - lowerPressure) / (upperPressure - lowerPressure);
    return Math.floor(lowerSize + (upperSize - lowerSize) * ratio);
  }
  
  /**
   * Calculate component dimensions based on equipment type
   */
  private calculateComponentDimensions(): Map<string, number> {
    const dimensions = new Map<string, number>();
    const { equipmentType, plateCount } = this.context.inputs;
    
    const specs = EQUIPMENT_SPECS[equipmentType as keyof typeof EQUIPMENT_SPECS];
    if (!specs) {
      throw new Error(`Unknown equipment type: ${equipmentType}`);
    }
    
    // Calculate cover dimensions (крышка)
    const coverWidth = specs.width + 15;
    const coverHeight = specs.height + 15;
    dimensions.set('coverWidth', coverWidth);
    dimensions.set('coverHeight', coverHeight);
    
    // Calculate column height (колонна)
    const columnHeight = 2400 + plateCount * 2.5; // Simplified formula
    dimensions.set('columnHeight', columnHeight);
    
    // Calculate panel dimensions
    const panelAWidth = specs.width * 0.95;
    const panelBWidth = specs.width * 0.95;
    dimensions.set('panelAWidth', panelAWidth);
    dimensions.set('panelBWidth', panelBWidth);
    
    return dimensions;
  }
  
  /**
   * Calculate material requirements based on dimensions
   */
  private calculateMaterialRequirements(): Map<string, number> {
    const requirements = new Map<string, number>();
    const dimensions = this.calculateComponentDimensions();
    const { materialPlate, materialBody } = this.context.inputs;
    
    // Get material properties
    const plateMaterial = this.context.materials.get(materialPlate);
    const bodyMaterial = this.context.materials.get(materialBody);
    
    if (!plateMaterial || !bodyMaterial) {
      throw new Error('Material not found in database');
    }
    
    // Calculate plate material volume (m³)
    const plateVolume = 
      (dimensions.get('coverWidth')! / 1000) * 
      (dimensions.get('coverHeight')! / 1000) * 
      (this.context.inputs.plateThickness / 1000);
    
    // Calculate mass (kg)
    const plateMass = plateVolume * plateMaterial.density;
    requirements.set('plateMass', plateMass);
    
    // Calculate body material
    const bodyVolume = 
      (dimensions.get('columnHeight')! / 1000) * 0.5 * 0.01; // Simplified
    const bodyMass = bodyVolume * bodyMaterial.density;
    requirements.set('bodyMass', bodyMass);
    
    return requirements;
  }
  
  /**
   * Calculate component costs
   */
  private calculateComponentCosts(): ComponentCosts {
    const dimensions = this.calculateComponentDimensions();
    const materials = this.calculateMaterialRequirements();
    const { plateCount } = this.context.inputs;
    
    // Simplified cost calculations
    const costs: ComponentCosts = {
      covers: dimensions.get('coverWidth')! * dimensions.get('coverHeight')! * 0.15,
      columns: dimensions.get('columnHeight')! * 12,
      panelsA: dimensions.get('panelAWidth')! * plateCount * 8,
      panelsB: dimensions.get('panelBWidth')! * plateCount * 8,
      fasteners: plateCount * 250,
      flanges: 45000, // Fixed for now, should be calculated
      gaskets: plateCount * 150,
      materials: materials.get('plateMass')! * 850 + materials.get('bodyMass')! * 750,
      total: 0,
    };
    
    // Calculate total
    costs.total = Object.values(costs)
      .filter(v => typeof v === 'number')
      .reduce((sum, cost) => sum + cost, 0);
    
    return costs;
  }
  
  /**
   * Calculate total cost
   */
  private calculateTotalCost(componentCosts: ComponentCosts): number {
    return componentCosts.total;
  }
  
  /**
   * Generate cost breakdown
   */
  private generateCostBreakdown(componentCosts: ComponentCosts): Map<string, number> {
    const breakdown = new Map<string, number>();
    
    Object.entries(componentCosts).forEach(([key, value]) => {
      if (key !== 'total' && typeof value === 'number') {
        const percentage = (value / componentCosts.total) * 100;
        breakdown.set(key, percentage);
      }
    });
    
    return breakdown;
  }
  
  /**
   * Prepare data for Bitrix24 export
   */
  private prepareExportData(): any {
    return {
      equipment: this.context.inputs.equipmentType,
      totalCost: this.context.intermediateValues.get('totalCost'),
      components: Object.fromEntries(this.context.intermediateValues),
      timestamp: new Date().toISOString(),
    };
  }
}