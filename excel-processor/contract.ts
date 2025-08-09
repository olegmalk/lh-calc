/**
 * Excel Processor API Contract
 * Complete type definitions for LH Calculator Excel processing service
 */

// Cell color constants
export const CELL_COLORS = {
  GREEN: 'FF92D050',   // Supply team inputs
  ORANGE: 'FFFFC000',  // Engineering inputs  
  YELLOW: 'FFFFFF00'   // Dropdown/computed values
} as const;

// Cell metadata for validation and documentation
export interface CellMetadata {
  coordinate: string;      // e.g., "D8"
  sheet: string;           // e.g., "снабжение"
  fieldName: string;       // e.g., "material_price_1"
  description: string;     // Human-readable description
  dataType: 'number' | 'string' | 'boolean' | 'formula';
  color: string;           // RGB color code
  role: 'supply' | 'engineering' | 'computed';
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    enum?: string[];
    pattern?: string;
  };
  formula?: string;        // Excel formula if applicable
  dependsOn?: string[];    // Other cells this depends on
}

// Complete input field definitions
export const INPUT_CELLS: Record<string, CellMetadata> = {
  // Green cells - Supply team (материальные затраты)
  'снабжение!D8': {
    coordinate: 'D8',
    sheet: 'снабжение',
    fieldName: 'material_price_1',
    description: 'Цена материала 1',
    dataType: 'number',
    color: CELL_COLORS.GREEN,
    role: 'supply',
    validation: { required: true, min: 0 }
  },
  'снабжение!E8': {
    coordinate: 'E8',
    sheet: 'снабжение',
    fieldName: 'material_price_2',
    description: 'Цена материала 2',
    dataType: 'number',
    color: CELL_COLORS.GREEN,
    role: 'supply',
    validation: { required: true, min: 0 }
  },
  'снабжение!D10': {
    coordinate: 'D10',
    sheet: 'снабжение',
    fieldName: 'material_cost_3',
    description: 'Стоимость материала 3',
    dataType: 'number',
    color: CELL_COLORS.GREEN,
    role: 'supply',
    validation: { min: 0 }
  },
  'снабжение!D11': {
    coordinate: 'D11',
    sheet: 'снабжение',
    fieldName: 'material_cost_4',
    description: 'Стоимость материала 4',
    dataType: 'number',
    color: CELL_COLORS.GREEN,
    role: 'supply',
    validation: { min: 0 }
  },
  'снабжение!K13': {
    coordinate: 'K13',
    sheet: 'снабжение',
    fieldName: 'quantity',
    description: 'Количество',
    dataType: 'number',
    color: CELL_COLORS.GREEN,
    role: 'supply',
    validation: { required: true, min: 1 }
  },
  'снабжение!P13': {
    coordinate: 'P13',
    sheet: 'снабжение',
    fieldName: 'internal_logistics',
    description: 'Внутренняя логистика',
    dataType: 'number',
    color: CELL_COLORS.GREEN,
    role: 'supply',
    validation: { min: 0 }
  },

  // Orange cells - Engineering inputs
  'снабжение!D9': {
    coordinate: 'D9',
    sheet: 'снабжение',
    fieldName: 'material_specification',
    description: 'Марка материала',
    dataType: 'string',
    color: CELL_COLORS.ORANGE,
    role: 'engineering',
    validation: {
      required: true,
      enum: ['09Г2С', 'Ст3', '12Х18Н10Т', '20', '40Х', '65Г']
    }
  },

  // Additional cells would be enumerated here...
  // This is a subset for demonstration
};

// Request structure
export interface ExcelCalculationRequest {
  // Input values mapped by cell reference
  inputs: {
    [cellRef: string]: number | string | boolean | null;
  };

  // Alternative structure - grouped by color/role
  inputsByRole?: {
    supply: Record<string, any>;      // Green cells
    engineering: Record<string, any>;  // Orange cells
    computed?: Record<string, any>;    // Yellow cells
  };

  // Options
  options?: {
    returnFormulas?: boolean;          // Include formulas in response
    returnIntermediateValues?: boolean; // Include all calculated cells
    validateOnly?: boolean;            // Only validate, don't calculate
    resultCells?: string[];            // Specific cells to extract
  };
}

// Result structure from "результат " sheet
export interface CalculationResults {
  // Main cost categories (Row 4)
  summary: {
    materials: number;     // B4
    labor: number;        // C4  
    overhead: number;     // D4
    total: number;        // E4
  };

  // Corpus section (Rows 7-15)
  corpus: {
    outerShell: ComponentCost;      // Row 7
    innerShell: ComponentCost;      // Row 8
    bottomRing: ComponentCost;       // Row 9
    supportRing: ComponentCost;      // Row 10
    supportPlate: ComponentCost;     // Row 11
    brackets: ComponentCost;         // Row 12
    pipeConnections: ComponentCost;  // Row 13
    reinforcement: ComponentCost;    // Row 14
    total: ComponentCost;           // Row 15
  };

  // Core section (Rows 18-26)
  core: {
    tubes: ComponentCost;           // Row 18
    tubePlates: ComponentCost;      // Row 19
    baffles: ComponentCost;         // Row 20
    tieRods: ComponentCost;         // Row 21
    spacers: ComponentCost;         // Row 22
    gaskets: ComponentCost;         // Row 23
    supports: ComponentCost;        // Row 24
    accessories: ComponentCost;     // Row 25
    total: ComponentCost;          // Row 26
  };

  // Connections section (Rows 29-37)
  connections: {
    inlet: ComponentCost;          // Row 29
    outlet: ComponentCost;         // Row 30
    drain: ComponentCost;          // Row 31
    vent: ComponentCost;           // Row 32
    instrumentation: ComponentCost; // Row 33
    manholes: ComponentCost;       // Row 34
    inspection: ComponentCost;     // Row 35
    accessories: ComponentCost;    // Row 36
    total: ComponentCost;         // Row 37
  };

  // Additional components (Rows 40-48)
  additional: {
    insulation: ComponentCost;     // Row 40
    cladding: ComponentCost;       // Row 41
    painting: ComponentCost;       // Row 42
    testing: ComponentCost;        // Row 43
    certification: ComponentCost;  // Row 44
    packaging: ComponentCost;      // Row 45
    transportation: ComponentCost; // Row 46
    installation: ComponentCost;   // Row 47
    total: ComponentCost;         // Row 48
  };

  // Grand totals (Rows 51-59)
  totals: {
    totalMaterials: number;        // B51
    totalLabor: number;           // C51
    totalOverhead: number;        // D51
    grandTotal: number;           // E51
    vat: number;                  // E53
    totalWithVat: number;         // E55
    margin: number;               // E57
    finalPrice: number;           // E59
  };
}

// Component cost breakdown
export interface ComponentCost {
  materials: number;    // Column B
  labor: number;       // Column C
  overhead: number;    // Column D
  total: number;       // Column E
}

// Complete response structure
export interface ExcelCalculationResponse {
  success: boolean;
  requestId: string;
  timestamp: string;

  // Main calculation results
  results: CalculationResults;

  // All calculated cells if requested
  calculatedCells?: {
    [cellRef: string]: {
      value: any;
      formula?: string;
      sheet: string;
      dependsOn?: string[];
    };
  };

  // Validation results
  validation: {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  };

  // Processing metadata
  metadata: {
    processedAt: string;
    processingTimeMs: number;
    excelFile: string;
    excelVersion: string;
    formulasEvaluated: number;
    cellsModified: number;
    cellsRead: number;
  };
}

// Validation structures
export interface ValidationError {
  cell: string;
  field: string;
  message: string;
  expectedType: string;
  receivedValue: any;
  validation?: any;
}

export interface ValidationWarning {
  cell: string;
  field: string;
  message: string;
  suggestion?: string;
}

// Error response
export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
    stack?: string;
  };
  requestId: string;
  timestamp: string;
}

// Error codes
export enum ErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  EXCEL_FILE_NOT_FOUND = 'EXCEL_FILE_NOT_FOUND',
  EXCEL_PROCESSING_ERROR = 'EXCEL_PROCESSING_ERROR',
  FORMULA_EVALUATION_ERROR = 'FORMULA_EVALUATION_ERROR',
  TIMEOUT = 'TIMEOUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// Service configuration
export interface ExcelProcessorConfig {
  excelFilePath: string;          // Path to calc.xlsx template
  tempDirectory: string;          // Directory for temp files
  maxProcessingTimeMs: number;    // Timeout for processing
  cacheTemplateInMemory: boolean; // Cache template file
  parallelProcessing: boolean;    // Use worker threads
  maxConcurrentRequests: number;  // Request queue size
}

// Utility types for client libraries
export type InputValue = number | string | boolean | null;
export type CellReference = string; // e.g., "снабжение!D8"
export type SheetName = 'технолог' | 'снабжение' | 'результат ';

// Helper to build cell reference
export function buildCellRef(sheet: SheetName, cell: string): CellReference {
  return `${sheet}!${cell}`;
}

// Helper to parse cell reference
export function parseCellRef(ref: CellReference): { sheet: string; cell: string } {
  const [sheet, cell] = ref.split('!');
  return { sheet, cell };
}

// Export all types
export type {
  CellMetadata,
  ExcelCalculationRequest,
  ExcelCalculationResponse,
  CalculationResults,
  ComponentCost,
  ValidationError,
  ValidationWarning,
  ErrorResponse,
  ExcelProcessorConfig,
  InputValue,
  CellReference,
  SheetName
};