// Core types for the calculation engine

export interface HeatExchangerInput {
  // технолог sheet inputs
  equipmentType: string; // E27 - типоразмер (e.g., 'К4-750')
  modelCode: string; // G27 - модель
  plateConfiguration: string; // H27 - конфигурация пластин (e.g., '1/6')
  plateCount: number; // I27 - количество пластин
  pressureA: number; // L27 - давление A (bar)
  pressureB: number; // M27 - давление B (bar)
  temperatureA: number; // температура A (°C)
  temperatureB: number; // температура B (°C)
  materialPlate: string; // P27 - материал пластин (e.g., 'AISI 316L')
  materialBody: string; // Q27 - материал корпуса
  surfaceType: string; // S27 - тип поверхности (e.g., 'гофра')
  componentsA: number; // T27 - компоненты A
  componentsB: number; // U27 - компоненты B
  plateThickness: number; // V27 - толщина пластины (mm)
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
  pressureTestA: number; // AI73
  pressureTestB: number; // AJ73
  interpolatedValues: Map<string, number>;
  
  // снабжение calculations
  componentDimensions: Map<string, number>;
  materialRequirements: Map<string, number>;
  componentCosts: ComponentCosts;
  
  // результат aggregations
  totalCost: number;
  costBreakdown: Map<string, number>;
  exportData: any; // For Bitrix24
}

export interface FormulaContext {
  inputs: HeatExchangerInput;
  materials: Map<string, MaterialProperties>;
  namedRanges: Map<string, any>;
  intermediateValues: Map<string, number>;
  dependencies: Map<string, string[]>;
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