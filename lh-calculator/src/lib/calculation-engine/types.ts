// Core types for the calculation engine

export interface HeatExchangerInput {
  // технолог sheet inputs - CRITICAL FIELDS
  positionNumber?: string; // D27 - номер позиции
  customerOrderNumber?: string; // E27 - номер в ОЛ заказчика (для Bitrix24)
  deliveryType?: string; // F27 - тип поставки
  
  // Story 3: Configuration parameters  
  solutionDensity?: number; // solution density (range 0.5-2.0)
  solutionVolume?: string; // solution volume identifier
  equipmentTypeDetail?: string; // equipment type details
  flowRatio?: string; // flow ratio configuration
  
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
  claddingMaterial?: string; // Q27 - материал плакировки (auto-synced with P27)
  bodyMaterial?: string; // R27 - материал корпуса (e.g., '09Г2С')
  corrugationType?: string; // S27 - тип гофры (e.g., 'гофра')
  
  // Legacy field for compatibility
  materialBody: string; // R27 - материал корпуса (e.g., '09Г2С')
  surfaceType: string; // S27 - тип поверхности (e.g., 'гофра')
  
  // Geometry parameters  
  drawDepth?: number; // T27 - глубина вытяжки (mm)
  plateThickness: number; // U27 - толщина пластины (mm)
  claddingThickness?: number; // V27 - толщина плакировки (mm)
  plateLength?: number; // T27 - длина пластины (mm)
  mountingPanelsCount?: number; // V27 - количество монтажных панелей
  
  // Story 5: Additional cost calculation factors
  additionalPlatesFactor?: number; // U27 - additional plates factor (default 1)
  panelCountFactor?: number; // V27 - panel count factor (default 3)
  
  // Component count factors for calculations
  componentsA?: number; // Component A count factor
  componentsB?: number; // Component B count factor
  
  // Test pressure fields (N27/O27)
  testPressureHot?: number; // N27 - давление испытания горячая сторона (bar)
  testPressureCold?: number; // O27 - давление испытания холодная сторона (bar)
  
  // снабжение sheet inputs - SUPPLY PARAMETERS
  // Pricing Policy (D8-G8, A12-A13, D12-D14)
  plateMaterialPricePerKg?: number; // D8 - цена материала пластин
  claddingMaterialPricePerKg?: number; // E8 - цена плакировки
  columnCoverMaterialPricePerKg?: number; // F8 - цена колонн/крышек
  panelMaterialPricePerKg?: number; // G8 - цена панелей
  laborRatePerHour?: number; // A12 - стоимость нормо-часа
  cuttingCostPerMeter?: number; // A13 - стоимость раскроя
  laborRate?: number; // D12 - Labor rate ₽/hour
  laborCoefficient?: number; // D13 - Labor multiplier
  materialCoefficient?: number; // D14 - Material factor (squared in formulas)
  
  // Logistics (K13, P13, P19)
  internalLogisticsCost?: number; // P13 - внутренняя логистика
  standardLaborHours?: number; // K13 - количество нормо-часов
  panelFastenerQuantity?: number; // P19 - количество крепежа
  
  // Correction Factors (A14-A17)
  claddingCuttingCorrection?: number; // A14 - поправка плакировки
  columnCuttingCorrection?: number; // A15 - поправка колонн
  coverCuttingCorrection?: number; // A16 - поправка крышек
  panelCuttingCorrection?: number; // A17 - поправка панелей
  
  // Story 4: Flange System Specifications
  // Hot side flanges
  flangeHotPressure1?: string;   // C28
  flangeHotDiameter1?: string;    // D28
  flangeHotPressure2?: string;    // C29
  flangeHotDiameter2?: string;    // D29
  // Cold side flanges
  flangeColdPressure1?: string;   // I28
  flangeColdDiameter1?: string;   // J28
  flangeColdPressure2?: string;   // I29
  flangeColdDiameter2?: string;   // J29
  
  // Stories 5, 6, 7: Cost Structure Implementation
  // Story 5: Component Cost Structure (7 fields)
  componentCost1?: number;        // D43 - Component cost 1
  componentCost2?: number;        // D44 - Component cost 2
  componentCost3?: number;        // D45 - Component cost 3
  componentCost4?: number;        // D46 - Component cost 4
  additionalCost1?: number;       // G43 - Additional cost 1
  additionalCost2?: number;       // G44 - Additional cost 2
  additionalCost3?: number;       // G45 - Additional cost 3
  
  // Story 6: Manufacturing Process Costs (8 fields)
  processCost1?: number;          // H54 - Process cost 1
  processCost2?: number;          // H55 - Process cost 2
  processCost3?: number;          // H56 - Process cost 3
  processCost4?: number;          // H57 - Process cost 4
  assemblyWork1?: number;         // I38 - Assembly work 1
  assemblyWork2?: number;         // I39 - Assembly work 2
  additionalWork1?: number;       // K38 - Additional work 1
  additionalWork2?: number;       // K39 - Additional work 2
  
  // Story 7: Material and Special Costs (8 fields)
  materialCost1?: number;         // M44 - Material cost 1
  materialCost2?: number;         // M45 - Material cost 2
  materialCost3?: number;         // M46 - Material cost 3
  extraCost?: number;             // P45 - Extra cost
  specialCost1?: number;          // M51 - Special cost 1
  specialCost2?: number;          // M52 - Special cost 2
  specialCost3?: number;          // M55 - Special cost 3
  specialCost4?: number;          // M57 - Special cost 4

  // =====================================================
  // SPRINT 3: REMAINING 94 FIELDS IMPLEMENTATION
  // =====================================================

  // Group 1: Project & Order Tracking (6 fields) - Priority 3
  projectName?: string;           // A3 - project name
  orderNumber?: string;           // A4 - order number
  clientName?: string;            // A5 - client name
  deliveryDate?: string;          // A6 - delivery date
  projectManager?: string;        // A7 - project manager
  salesManager?: string;          // A8 - sales manager

  // Group 2: Equipment Extended Specs (7 fields) - Priority 3  
  plateArea?: number;             // G27 - calculated plate area
  channelHeight?: number;         // AY27 - channel height
  channelWidth?: number;          // AZ27 - channel width
  frameThickness?: number;        // BA27 - frame thickness
  frameMaterial?: string;         // BB27 - frame material
  insulationThickness?: number;   // BC27 - insulation thickness
  insulationType?: string;        // BD27 - insulation type

  // Group 3: Process Parameters (8 fields) - Priority 3
  operatingPressureA?: number;    // BE27 - operating pressure A
  operatingPressureB?: number;    // BF27 - operating pressure B
  designTemperatureA?: number;    // BG27 - design temperature A
  designTemperatureB?: number;    // BH27 - design temperature B
  flowRateA?: number;             // BI27 - flow rate A
  flowRateB?: number;             // BJ27 - flow rate B
  pressureDropA?: number;         // BK27 - pressure drop A
  pressureDropB?: number;         // BL27 - pressure drop B

  // Group 4: Fastener Specifications (8 fields) - Priority 3
  boltType?: string;              // BM27 - bolt type
  boltMaterial?: string;          // BN27 - bolt material
  boltQuantity?: number;          // BO27 - bolt quantity
  nutType?: string;               // BP27 - nut type
  nutMaterial?: string;           // BQ27 - nut material
  nutQuantity?: number;           // BR27 - nut quantity
  washerType?: string;            // BS27 - washer type
  washerQuantity?: number;        // BT27 - washer quantity

  // Group 5: Manufacturing Details (8 fields) - Priority 3
  weldingMethod?: string;         // BU27 - welding method
  weldingMaterial?: string;       // BV27 - welding material
  surfaceTreatment?: string;      // BW27 - surface treatment
  paintType?: string;             // BX27 - paint type
  paintThickness?: number;        // BY27 - paint thickness
  qualityControl?: string;        // BZ27 - quality control
  certificationRequired?: boolean;// CA27 - certification required
  inspectionLevel?: string;       // CB27 - inspection level

  // Group 6: Logistics & Packaging (7 fields) - Priority 3
  packagingType?: string;         // CC27 - packaging type
  packagingMaterial?: string;     // CD27 - packaging material
  crateRequired?: boolean;        // CE27 - crate required
  shippingMethod?: string;        // CF27 - shipping method
  deliveryTerms?: string;         // CG27 - delivery terms
  insuranceRequired?: boolean;    // CH27 - insurance required
  customsClearance?: boolean;     // CI27 - customs clearance

  // Group 7: Documentation (5 fields) - Priority 3
  drawingsIncluded?: boolean;     // CJ27 - drawings included
  manualsIncluded?: boolean;      // CK27 - manuals included
  certificatesIncluded?: boolean; // CL27 - certificates included
  warrantyPeriod?: number;        // CM27 - warranty period (months)
  serviceContract?: boolean;      // CN27 - service contract

  // Group 8: Spare Parts (5 fields) - Priority 3
  sparePlates?: number;           // CO27 - spare plates quantity
  spareGaskets?: number;          // CP27 - spare gaskets quantity
  spareBolts?: number;            // CQ27 - spare bolts quantity
  spareNuts?: number;             // CR27 - spare nuts quantity
  spareKit?: boolean;             // CS27 - spare kit required

  // Group 9: Financial (5 fields) - Priority 3
  paymentTerms?: string;          // CT27 - payment terms
  discountPercent?: number;       // CU27 - discount percentage
  taxRate?: number;               // CV27 - tax rate percentage
  currencyType?: string;          // CW27 - currency type
  exchangeRate?: number;          // CX27 - exchange rate

  // Group 10: Additional Costs Arrays (18 fields total) - Priority 3
  // Additional Materials (6 fields: CY27-DD27)
  additionalMaterial1?: string;   // CY27 - additional material 1 name
  additionalMaterialCost1?: number; // CZ27 - additional material 1 cost
  additionalMaterial2?: string;   // DA27 - additional material 2 name
  additionalMaterialCost2?: number; // DB27 - additional material 2 cost
  additionalMaterial3?: string;   // DC27 - additional material 3 name
  additionalMaterialCost3?: number; // DD27 - additional material 3 cost

  // Additional Labor (6 fields: DE27-DJ27)
  additionalLabor1?: string;      // DE27 - additional labor 1 description
  additionalLaborCost1?: number;  // DF27 - additional labor 1 cost
  additionalLabor2?: string;      // DG27 - additional labor 2 description
  additionalLaborCost2?: number;  // DH27 - additional labor 2 cost
  additionalLabor3?: string;      // DI27 - additional labor 3 description
  additionalLaborCost3?: number;  // DJ27 - additional labor 3 cost

  // Additional Services (6 fields: DK27-DP27)
  additionalService1?: string;    // DK27 - additional service 1 description
  additionalServiceCost1?: number; // DL27 - additional service 1 cost
  additionalService2?: string;    // DM27 - additional service 2 description
  additionalServiceCost2?: number; // DN27 - additional service 2 cost
  additionalService3?: string;    // DO27 - additional service 3 description
  additionalServiceCost3?: number; // DP27 - additional service 3 cost

  // CRITICAL MISSING FIELDS: Director-level controls (G93, G96)
  managementCoefficient?: number;  // G93 - Management coefficient (коэффициент управления)
  directorReserve?: number;        // G96 - Director's reserve (резерв директора)
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
  
  // Story 5: Core cost calculations
  coreCosts?: {
    N26_PlatePackageCost: number;
    P26_EquipmentCost: number; 
    O26_ComponentCost: number;
    H26_PanelMaterialCost: number;
    F26_PlateWorkCost: number;
    J32_GrandTotal: number;
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
  phase4Implemented?: boolean;
  excelParityAchieved?: boolean;
  finalCostBreakdown?: Record<string, number>;
  componentUsage?: {
    plates?: { quantity: number; weight: number; cost: number; };
    covers?: { quantity: number; weight: number; cost: number; };
    columns?: { quantity: number; weight: number; cost: number; };
    panels?: { quantity: number; weight: number; cost: number; };
    fasteners?: { quantity: number; weight: number; cost: number; };
    gaskets?: { quantity: number; weight: number; cost: number; };
    totalWeight?: number;
    totalCost?: number;
    wastePercentage?: number;
    materialBreakdown?: Record<string, { weight: number; cost: number; }>;
  };
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
  
  // Story 5: Core cost calculation factors
  plateCostFactor?: number; // D8 - plate cost factor (700 rubles/kg)
  panelCostFactor?: number; // E8 - panel cost factor (700 rubles/kg)
  thicknessFactor?: number; // D14 - thickness factor (default 1)
  additionalCostFactor?: number; // D13 - additional cost factor (default 0)
  profitMargin?: number; // Profit margin factor
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