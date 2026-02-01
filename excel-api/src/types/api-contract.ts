/**
 * API Contract Types for Excel Processor Service
 * Generated from OpenAPI specification
 */

// Enums for validation
export const MATERIAL_CODES = ['0000', '06ХН28МДТ', '09Г2С', '12Х18Н10Т', '20ХН3А', '30ХМА', '40Х'] as const;
export const PRESSURE_RATINGS = ['Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160'] as const;
export const DIAMETER_CODES = ['Ду25', 'Ду32', 'Ду40', 'Ду50', 'Ду65', 'Ду80', 'Ду100', 'Ду125', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду600', 'Ду800', 'Ду1000'] as const;
export const THREAD_SPECS = ['М16', 'М18', 'М20', 'М22', 'М24', 'М27', 'М30', 'М33', 'М36', 'М39', 'М42', 'М48'] as const;
export const SURFACE_TREATMENTS = ['Zn-Cr 9мкм', 'ст40Х'] as const;

export type MaterialCode = typeof MATERIAL_CODES[number];
export type PressureRating = typeof PRESSURE_RATINGS[number];
export type DiameterCode = typeof DIAMETER_CODES[number];
export type ThreadSpec = typeof THREAD_SPECS[number];
export type SurfaceTreatment = typeof SURFACE_TREATMENTS[number];

/**
 * Main calculation request interface
 * Contains all 134+ fields from Excel template
 */
export interface CalculationRequest {
  // Project identification (снабжение sheet)
  sup_F2_projectNumber: string;

  // Required Engineering parameters (технолог sheet)
  tech_D27_sequenceNumber: number;
  tech_E27_customerOrderPosition: string;
  tech_H27_passes: string;
  tech_I27_plateQuantity: number;
  tech_J27_calcPressureHotSide: number;
  tech_K27_calcPressureColdSide: number;
  tech_L27_calcTempHotSide: number;
  tech_M27_calcTempColdSide: number;
  tech_T27_drawDepth: number;
  
  // Optional engineering parameters
  tech_V27_thicknessType?: number;

  // Required Supply parameters (снабжение sheet)
  sup_D8_flowPartMaterialPricePerKg: number;
  sup_E8_flowPartMaterialPrice: number;
  sup_K13_normHoursPerUnit: number;
  sup_P13_internalLogistics: number;
  sup_D78_stainlessSteelThickness: number;

  // Required string input fields (Green cells)
  sup_D10_columnCoverMaterialPrice: string;
  sup_D11_panelMaterialPrice: string;
  sup_D17_panelCuttingCoefficient: string;
  sup_D38_panelGasketsPrice: string;
  sup_E20_coverCuttingPrice: string;
  sup_E21_coverProcessingCost: string;
  sup_E26_panelCuttingPrice: string;
  sup_E27_panelProcessingCost: string;
  sup_F28_flange1PanelAPrice: string;
  sup_F29_flange2PanelAPrice: string;
  sup_F30_pipeBilletFlange1Price: string;
  sup_F31_pipeBilletFlange2Price: string;
  sup_F32_drainageNozzlePrice: string;
  sup_F33_ventilationNozzlePrice: string;
  sup_K20_columnCuttingPrice: string;
  sup_K21_columnProcessingCost: string;
  sup_K26_panelBCuttingPrice: string;
  sup_K27_panelBProcessingCost: string;
  sup_L28_panelBFlange3Price: string;
  sup_L29_panelBFlange4Price: string;
  sup_L30_panelBPipeBilletFlange3Price: string;
  sup_L31_panelBPipeBilletFlange4Price: string;
  sup_L32_panelBDrainageNozzlePrice: string;
  sup_L33_panelBVentilationNozzlePrice: string;
  sup_Q22_panelFastenersStudCost: string;
  sup_Q23_panelFastenersNutCost: string;
  sup_Q24_panelFastenersWasherCost: string;
  sup_T29_cofFastenersFlange1KitPrice: string;
  sup_T30_cofGasketFlange1Price: string;
  sup_T31_cofObturatorFlange1Price: string;
  sup_T33_cofFastenersFlange2KitPrice: string;
  sup_T34_cofGasketFlange2Price: string;
  sup_T35_cofObturatorFlange2Price: string;
  sup_T37_cofFastenersFlange3KitPrice: string;
  sup_T38_cofGasketFlange3Price: string;
  sup_T39_cofObturatorFlange3Price: string;
  sup_T41_cofFastenersFlange4KitPrice: string;
  sup_T42_cofGasketFlange4Price: string;
  sup_T43_cofObturatorFlange4Price: string;

  // Required number fields (Green cells)
  sup_D43_studM24x2000Price: number;
  sup_D44_studM24x1000Price: number;
  sup_D45_studM20x2000Price: number;
  sup_D46_studM20M16x1000Price: number;
  sup_G43_nutM24DIN6330Price: number;
  sup_G44_nutM24DIN933Price: number;
  sup_G45_nutM20M16DIN933Price: number;
  sup_H54_spareFlangeFlange1Price: number;
  sup_H55_spareFlangeFlange2Price: number;
  sup_H56_spareFlangeFlange3Price: number;
  sup_H57_spareFlangeFlange4Price: number;
  sup_I38_eyeboltKitMaterialCost: number;
  sup_I39_eyeboltKitProcessingCost: number;
  sup_I44_otherMaterialsDesc1: string;
  sup_I45_otherMaterialsDesc2: string;
  sup_I46_otherMaterialsDesc3: string;
  sup_I50_sparePanelStudQuantity: number;
  sup_I51_sparePanelNutQuantity: number;
  sup_I52_sparePanelWasherQuantity: number;
  sup_I54_flangeFastenersFlange1Quantity: number;
  sup_I55_flangeFastenersFlange2Quantity: number;
  sup_I56_flangeFastenersFlange3Quantity: number;
  sup_I57_flangeFastenersFlange4Quantity: number;
  sup_K38_supportsKitMaterialCost: number;
  sup_K39_supportsKitProcessingCost: number;
  sup_M38_bracesKitMaterialCost: number;
  sup_M39_bracesKitProcessingCost: number;
  sup_M44_otherMaterialsCost1: number;
  sup_M45_otherMaterialsCost2: number;
  sup_M46_otherMaterialsCost3: number;
  sup_M51_spareAnchorBoltsCost: number;
  sup_M52_spareOtherCost: number;
  sup_N50_sparePanelGasketsQuantity: number;
  sup_N51_spareAnchorBoltsQuantity: number;
  sup_N52_spareOtherQuantity: number;
  sup_N54_spareFlangeGasketsFlange1Quantity: number;
  sup_N55_spareFlangeGasketsFlange2Quantity: number;
  sup_N56_spareFlangeGasketsFlange3Quantity: number;
  sup_N57_spareFlangeGasketsFlange4Quantity: number;
  sup_P45_unaccountedCost: number;

  // Optional Orange cells (Engineering parameters - computed/optional)
  sup_C28_panelAFlange1Pressure?: PressureRating;
  sup_C29_panelAFlange2Pressure?: PressureRating;
  sup_D28_panelAFlange1Diameter?: DiameterCode;
  sup_D29_panelAFlange2Diameter?: DiameterCode;
  sup_D9_bodyMaterial?: MaterialCode;
  sup_E19_coverRolledThickness?: string;
  sup_E25_panelRolledThickness?: string;
  sup_F39_spareKitsPressureReserve?: number;
  sup_I28_panelBFlange3Pressure?: PressureRating;
  sup_I29_panelBFlange4Pressure?: PressureRating;
  sup_J28_panelBFlange3Diameter?: DiameterCode;
  sup_J29_panelBFlange4Diameter?: DiameterCode;
  sup_K19_columnRolledThickness?: string;
  sup_K25_panelBRolledThickness?: string;
  sup_P19_panelFastenersQuantity?: number;
  sup_P20_panelFastenersMaterial?: MaterialCode;
  sup_P21_panelFastenersCoating?: SurfaceTreatment;
  sup_P22_panelFastenersStudSize?: ThreadSpec;
  sup_P29_cofFastenersFlange1Size?: ThreadSpec;
  sup_P33_cofFastenersFlange2Size?: ThreadSpec;
  sup_P37_cofFastenersFlange3Size?: ThreadSpec;
  sup_P41_cofFastenersFlange4Size?: ThreadSpec;
  sup_Q29_cofFastenersFlange1Material?: SurfaceTreatment;
  sup_Q33_cofFastenersFlange2Material?: SurfaceTreatment;
  sup_Q37_cofFastenersFlange3Material?: SurfaceTreatment;
  sup_Q41_cofFastenersFlange4Material?: SurfaceTreatment;
  sup_R29_cofFastenersFlange1Coating?: SurfaceTreatment;
  sup_R33_cofFastenersFlange2Coating?: SurfaceTreatment;
  sup_R37_cofFastenersFlange3Coating?: SurfaceTreatment;
  sup_R41_cofFastenersFlange4Coating?: SurfaceTreatment;
}

/**
 * Calculated results returned by Excel processing
 * Yellow cells - computed values
 */
export interface CalculatedValues {
  tech_F27_deliveryType: string;
  tech_G27_sizeTypeK4: string;
  tech_P27_plateMaterial: string;
  tech_Q27_materialType: string;
  tech_R27_bodyMaterial: string;
  tech_S27_plateSurfaceType: string;
  tech_U27_plateThickness: number;
}

/**
 * Cost breakdown by component type
 */
export interface ComponentCosts {
  materials: number;
  processing: number;
  hardware: number;
  other: number;
}

/**
 * Detailed cost breakdown from результат sheet row 26
 */
export interface DetailedCosts {
  flowPartMaterialPricePerKg: number;  // E26
  work: number;                        // F26 - РАБОТЫ
  panels: number;                      // G26 - панели (материал+обработка, патрубки, фланцы)
  panelCladding: number;               // H26 - плакировка панелей (материал + раскрой)
  covers: number;                      // I26 - крышки (материал + обработка)
  columns: number;                     // J26 - стойки (материал + обработка)
  panelFasteners: number;              // K26 - КРЕПЁЖ ПАНЕЛЕЙ шпильки и гайки
  panelGasketsPerSet: number;          // L26 - прокладки панелей (1 комплект)
  spareGasketSetsQuantity: number;     // M25 - резервных комплектов (кол-во)
  spareGasketSetsTotal: number;        // M26 - резервных комплектов (цена)
  platePack: number;                   // N26 - пакет пластин (материал + раскрой)
  mirrorsCombs: number;                // O26 - зеркала, гребёнки, плакировка крышек, перегородки
  internalSpacers: number;             // P26 - внутренние распорки (шпильки+гайки)
  cof: number;                         // Q26 - КОФ
  eyebolts: number;                    // R26 - проушины
  supports: number;                    // S26 - лапы
  otherMaterials: number;              // T26 - другие материалы
  braces: number;                      // U26 - раскосы
  unaccounted: number;                 // V26 - НЕУЧТЁНКА
  spareParts: number;                  // W26 - ЗИП
  internalLogistics: number;           // X26 - Внутренняя логистика
}

/**
 * Calculation results container
 */
export interface CalculationResults {
  calculated_values: CalculatedValues;
  total_cost: number;
  component_costs: ComponentCosts;
  detailed_costs: DetailedCosts;
}

/**
 * Successful calculation response
 */
export interface CalculationResponse {
  success: true;
  results: CalculationResults;
  request_id: string;
  processing_time_ms: number;
  metadata?: {
    excelVersion?: string;
    timestamp?: string;
    tempFileUsed?: boolean;
    [key: string]: any;
  };
}

/**
 * Error details for different types of failures
 */
export interface ErrorDetails {
  field_errors?: Record<string, string>;
  missing_required_fields?: string[];
  excel_errors?: string[];
  processing_errors?: string[];
  failed_cells?: string[];
  error_type?: string;
  message?: string;
  queue_time_ms?: number;
  processing_time_ms?: number;
  queue_full?: boolean;
  retry_after?: string;
  timeout_ms?: number;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: ErrorDetails;
  request_id: string;
}

/**
 * Union type for all API responses
 */
export type ApiResponse = CalculationResponse | ErrorResponse;

/**
 * Request validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  missingRequired: string[];
}

/**
 * Field validation rule (from validation-rules.ts)
 */
export interface ValidationRule {
  type: 'string' | 'number' | 'enum' | 'any';
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  values?: string[];
  description?: string;
}

/**
 * CORS configuration
 */
export interface CorsConfig {
  enabled: boolean;
  allow_origins: string[];
  allow_methods: string[];
  allow_headers: string[];
  allow_credentials: boolean;
  max_age: number;
}

/**
 * API error codes
 */
export enum ErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  EXCEL_CALCULATION_FAILED = 'EXCEL_CALCULATION_FAILED',
  EXCEL_FILE_NOT_FOUND = 'EXCEL_FILE_NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  INVALID_INPUT_DATA = 'INVALID_INPUT_DATA',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS'
}

/**
 * HTTP status codes used by the API
 */
export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500
}

/**
 * Type guard for successful response
 */
export function isSuccessResponse(response: ApiResponse): response is CalculationResponse {
  return response.success === true;
}

/**
 * Type guard for error response
 */
export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return response.success === false;
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: string,
  requestId: string,
  details?: ErrorDetails
): ErrorResponse {
  return {
    success: false,
    error,
    details,
    request_id: requestId
  };
}

/**
 * Create standardized success response
 */
export function createSuccessResponse(
  results: CalculationResults,
  requestId: string,
  processingTimeMs: number,
  metadata?: { [key: string]: any }
): CalculationResponse {
  return {
    success: true,
    results,
    request_id: requestId,
    processing_time_ms: processingTimeMs,
    metadata
  };
}

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
  const random = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${random}`;
}

/**
 * Validate material code
 */
export function isValidMaterialCode(value: string): value is MaterialCode {
  return MATERIAL_CODES.includes(value as MaterialCode);
}

/**
 * Validate pressure rating
 */
export function isValidPressureRating(value: string): value is PressureRating {
  return PRESSURE_RATINGS.includes(value as PressureRating);
}

/**
 * Validate diameter code
 */
export function isValidDiameterCode(value: string): value is DiameterCode {
  return DIAMETER_CODES.includes(value as DiameterCode);
}

/**
 * Validate thread specification
 */
export function isValidThreadSpec(value: string): value is ThreadSpec {
  return THREAD_SPECS.includes(value as ThreadSpec);
}

/**
 * Validate surface treatment
 */
export function isValidSurfaceTreatment(value: string): value is SurfaceTreatment {
  return SURFACE_TREATMENTS.includes(value as SurfaceTreatment);
}

/**
 * Equipment code pattern validator
 */
export function isValidEquipmentCode(value: string): boolean {
  return /^[ЕК][-0-9А-Я*]*$/.test(value);
}

/**
 * Fraction pattern validator (e.g., "1/6")
 */
export function isValidFractionPattern(value: string): boolean {
  return /^\d+\/\d+$/.test(value);
}

/**
 * Number validation with min/max constraints
 */
export function isValidNumber(value: any, min?: number, max?: number): boolean {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
}