// Core types for the calculation engine

export interface HeatExchangerInput {
  // технолог sheet inputs - CRITICAL FIELDS
  positionNumber?: string; // D27 - номер позиции
  customerOrderNumber?: string; // E27 - номер в ОЛ заказчика (для Bitrix24)
  deliveryType?: string; // F27 - тип поставки
  
  // Core equipment fields
  equipmentType: string; // G27 - типоразмер (e.g., 'К4-750')
  modelCode: string; // G27 - модель
  plateConfiguration: string; // H27 - конфигурация пластин (e.g., '1/6')
  plateCount: number; // I27 - количество пластин
  
  // Pressure and temperature parameters
  pressureA: number; // J27 - давление горячая сторона (bar)
  pressureB: number; // K27 - давление холодная сторона (bar)
  temperatureA: number; // L27 - температура горячая сторона (°C)
  temperatureB: number; // M27 - температура холодная сторона (°C)
  
  // Material specifications
  materialPlate: string; // P27 - материал пластин (e.g., 'AISI 316L')
  materialBody: string; // R27 - материал корпуса (e.g., '09Г2С')
  surfaceType: string; // S27 - тип поверхности (e.g., 'гофра')
  
  // Geometry parameters  
  drawDepth?: number; // T27 - глубина вытяжки (mm)
  plateThickness: number; // U27 - толщина пластины (mm)
  claddingThickness?: number; // V27 - толщина плакировки (mm)
  
  // Test pressure fields (N27/O27)
  testPressureHot?: number; // N27 - давление испытания горячая сторона (bar)
  testPressureCold?: number; // O27 - давление испытания холодная сторона (bar)
  
  // снабжение sheet inputs - SUPPLY PARAMETERS
  // Pricing Policy (D8-G8, A12-A13)
  plateMaterialPricePerKg?: number; // D8 - цена материала пластин
  claddingMaterialPricePerKg?: number; // E8 - цена плакировки
  columnCoverMaterialPricePerKg?: number; // F8 - цена колонн/крышек
  panelMaterialPricePerKg?: number; // G8 - цена панелей
  laborRatePerHour?: number; // A12 - стоимость нормо-часа
  cuttingCostPerMeter?: number; // A13 - стоимость раскроя
  
  // Logistics (K13, P13, P19)
  internalLogisticsCost?: number; // P13 - внутренняя логистика
  standardLaborHours?: number; // K13 - количество нормо-часов
  panelFastenerQuantity?: number; // P19 - количество крепежа
  
  // Correction Factors (A14-A17)
  claddingCuttingCorrection?: number; // A14 - поправка плакировки
  columnCuttingCorrection?: number; // A15 - поправка колонн
  coverCuttingCorrection?: number; // A16 - поправка крышек
  panelCuttingCorrection?: number; // A17 - поправка панелей
}

export interface MaterialProperties {
  name: string;
  density: number; // kg/m³
  pricePerKg: number; // RUB/kg
  temperatureStressMatrix?: Map<number, number>; // temperature -> stress
}

export interface ComponentCosts {
  covers: number; // крышка
  columns: number; // колонна
  panelsA: number; // панель A
  panelsB: number; // панель B
  fasteners: number; // крепеж
  flanges: number; // фланцы
  gaskets: number; // прокладки
  materials: number; // материалы
  total: number;
}

export interface CalculationResult {
  // технолог calculations
  pressureTestHot: number; // AI73 - test pressure for hot side
  pressureTestCold: number; // AJ73 - test pressure for cold side
  interpolatedValues: Map<string, number>;
  
  // снабжение calculations
  componentDimensions: Map<string, number>;
  materialRequirements: Map<string, number>;
  componentCosts: ComponentCosts;
  
  // результат aggregations
  totalCost: number;
  costBreakdown: Map<string, number>;
  exportData: ExportData;
  
  // Phase 3 additions
  validation?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    validationDetails: Map<string, boolean>;
  };
  
  // Phase 4: Final aggregations (результат sheet) - LH-F014/F015
  finalCostBreakdown?: FinalCostBreakdown;
  componentUsage?: ComponentUsageSummary;
  finalTotalCost?: number;
  costPercentages?: Map<string, number>;
}

export interface ExportData {
  equipment: {
    type: string;
    plateCount: number;
    configuration: string;
  };
  materials: {
    plate: string;
    body: string;
    surface: string;
  };
  parameters: {
    pressureA: number;
    pressureB: number;
    temperatureA: number;
    temperatureB: number;
  };
  costs: Record<string, number>;
  calculations: Record<string, number>;
  totalCost: number;
  version: string;
  calculatedAt: string;
  excelRow?: number;
  
  // Phase 3 enhanced fields
  enhancedCosts?: {
    materialBreakdown: Record<string, number>;
    laborBreakdown: Record<string, number>;
    logistics: {
      internal: number;
      distribution: number;
      total: number;
      weightPercentage: number;
    };
    equipmentSpecific: {
      additionalCosts: number;
      specialRequirements: string[];
      materialAdjustments: Record<string, number>;
    };
    cutting: number;
  };
  validation?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    validationDetails: Record<string, boolean>;
  };
  phase3Implemented?: boolean;
}

export interface SupplyParameters {
  plateMaterialPrice?: number;
  claddingMaterialPrice?: number;
  columnCoverMaterialPrice?: number;
  panelMaterialPrice?: number;
  laborRate?: number;
  standardLaborHours?: number;
  cuttingCost?: number;
  internalLogistics?: number;
  claddingCorrection?: number;
  columnCorrection?: number;
  coverCorrection?: number;
  panelCorrection?: number;
  panelFastenerQuantity?: number;
}

export interface EnhancedMaterialCosts {
  plateMaterialCost: number;
  claddingMaterialCost: number;
  columnCoverMaterialCost: number;
  panelMaterialCost: number;
  totalMaterialCost: number;
  cuttingCost: number;
  materialBreakdown: Map<string, number>;
}

export interface EnhancedLaborCosts {
  baseLaborCost: number;
  assemblyLaborCost: number;
  testingLaborCost: number;
  totalLaborCost: number;
  complexityFactor: number;
  laborBreakdown: Map<string, number>;
}

export interface LogisticsCosts {
  internalLogisticsCost: number;
  distributionCost: number;
  totalLogisticsCost: number;
  weightPercentage: number;
}

export interface EquipmentLogic {
  additionalCosts: number;
  specialRequirements: string[];
  materialAdjustments: Map<string, number>;
}

// Phase 4: Final aggregations interfaces (результат sheet)
export interface FinalCostBreakdown {
  // Direct results from results sheet cells F26-X26
  F26_PlateWork: number;      // =снабжение!K14
  G26_CorpusTotal: number;    // =снабжение!G35+снабжение!M35
  H26_PanelMaterial: number;  // Complex panel material calculation
  I26_Covers: number;         // =снабжение!G22*2
  J26_Columns: number;        // =снабжение!M22*4
  K26_Connections: number;    // =снабжение!Q25
  L26_Gaskets: number;        // =снабжение!F38
  M26_GasketSets: number;     // =L26*M25
  N26_PlatePackage: number;   // Complex plate package calculation
  O26_CladMaterial: number;   // Complex cladding material calculation
  P26_InternalSupports: number; // Equipment-specific supports
  Q26_Other: number;          // =снабжение!T44
  R26_Attachment: number;     // =снабжение!I40
  S26_Legs: number;           // =снабжение!K40
  T26_OtherMaterials: number; // =снабжение!M44+снабжение!M45+снабжение!M46
  U26_ShotBlock: number;      // =снабжение!M40
  V26_Uncounted: number;      // =снабжение!P45
  W26_SpareKit: number;       // Complex spare kit calculation
  X26_InternalLogistics: number; // =снабжение!P13
  
  // Category totals J30-J36
  J30_WorkTotal: number;      // =F26
  J31_CorpusCategory: number; // =G26+H26+I26+J26
  J32_CoreCategory: number;   // =N26+O26+P26
  J33_ConnectionsCategory: number; // =K26+L26+M26
  J34_OtherCategory: number;  // =R26+S26+T26+U26+V26+X26
  J35_COFCategory: number;    // =Q26
  J36_SpareCategory: number;  // =W26
  
  // Grand total
  U32_GrandTotal: number;     // =SUM(F26:X26)
  
  // Additional summary data
  totalMaterialCost: number;
  totalLaborCost: number;
  totalLogisticsCost: number;
  costPerUnit: number;
  profitMargin: number;
}

export interface ComponentUsageSummary {
  plates: { quantity: number; weight: number; cost: number; };
  covers: { quantity: number; weight: number; cost: number; };
  columns: { quantity: number; weight: number; cost: number; };
  panels: { quantity: number; weight: number; cost: number; };
  fasteners: { quantity: number; weight: number; cost: number; };
  gaskets: { quantity: number; weight: number; cost: number; };
  totalWeight: number;
  totalCost: number;
  wastePercentage: number;
  materialBreakdown: Map<string, { weight: number; cost: number; }>;
}

export interface FormulaContext {
  inputs: HeatExchangerInput;
  materials: Map<string, MaterialProperties>;
  namedRanges: Map<string, Record<string, unknown>>;
  intermediateValues: Map<string, number>;
  dependencies: Map<string, string[]>;
  supply?: SupplyParameters;
}

export type FormulaFunction = (context: FormulaContext) => number;

export interface Formula {
  id: string;
  sheet: 'технолог' | 'снабжение' | 'результат';
  cell: string;
  expression: string;
  evaluate: FormulaFunction;
  dependencies: string[];
}