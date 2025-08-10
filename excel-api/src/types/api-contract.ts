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
  tech_D27_type: number;
  tech_E27_weightType: string;
  tech_H27_quantityType: string;
  tech_I27_quantityType: number;
  tech_J27_quantityType: number;
  tech_K27_quantity: number;
  tech_L27_quantity: number;
  tech_M27_material: number;
  tech_T27_materialThicknessType: number;
  
  // Optional engineering parameters
  tech_V27_thicknessType?: number;

  // Required Supply parameters (снабжение sheet)
  sup_D8_priceMaterial: number;
  sup_E8_priceMaterial: number;
  sup_K13_costQuantityNormTotal: number;
  sup_P13_costQuantityMaterialNorm: number;
  sup_D78_massThickness: number;

  // Required string input fields (Green cells)
  sup_D10_priceCostMaterial: string;
  sup_D11_priceCostMaterial: string;
  sup_D17_priceWeightThickness: string;
  sup_D38_priceQuantityTotal: string;
  sup_E101_priceMassPipeTotal: string;
  sup_E105_priceMassPipeTotal: string;
  sup_E20_priceWeightThicknessTotal: string;
  sup_E21_priceWeightThicknessTotal: string;
  sup_E26_priceWeightThickness: string;
  sup_E27_priceWeightThickness: string;
  sup_F28_priceWeightThicknessTotal: string;
  sup_F29_priceWeightPipeTotal: string;
  sup_F30_priceWeightPipeTotal: string;
  sup_F31_priceWeightPipeTotal: string;
  sup_F32_priceWeightPipeTotal: string;
  sup_F33_priceWeightPipeTotal: string;
  sup_K20_priceWeightThicknessTotal: string;
  sup_K21_priceWeightThicknessTotal: string;
  sup_K26_priceWeightThickness: string;
  sup_K27_priceWeightThickness: string;
  sup_L28_priceWeightThicknessTotalType: string;
  sup_L29_priceWeightPipeTotalType: string;
  sup_L30_priceWeightPipeTotalType: string;
  sup_L31_priceWeightPipeTotalType: string;
  sup_L32_priceWeightPipeTotalType: string;
  sup_L33_priceWeightPipeTotalType: string;
  sup_Q22_priceQuantityMaterialThicknessTotal: string;
  sup_Q23_priceMaterialThicknessTotal: string;
  sup_Q24_priceThicknessTotal: string;
  sup_T29_priceMaterial: string;
  sup_T30_priceMaterial: string;
  sup_T31_priceMaterial: string;
  sup_T33_priceMaterialPipe: string;
  sup_T34_priceMaterialTotal: string;
  sup_T35_priceMaterialTotal: string;
  sup_T37_price: string;
  sup_T38_price: string;
  sup_T39_priceQuantity: string;
  sup_T41_priceTotal: string;
  sup_T42_priceMaterialInsulationTotal: string;
  sup_T43_priceTotal: string;

  // Required number fields (Green cells)
  sup_D43_priceTotal: number;
  sup_D44_price: number;
  sup_D45_price: number;
  sup_D46_price: number;
  sup_G43_priceMaterialInsulationTotal: number;
  sup_G44_priceMaterialInsulation: number;
  sup_G45_priceMaterialInsulation: number;
  sup_H54_priceTotal: number;
  sup_H55_priceTotal: number;
  sup_H56_priceTotal: number;
  sup_H57_priceTotal: number;
  sup_I38_priceThicknessTotalType: number;
  sup_I39_priceQuantityMaterialThicknessInsulationTotalType: number;
  sup_I44_priceMaterialThicknessInsulationTotalType: string;
  sup_I45_priceMaterialThicknessInsulationTotalType: string;
  sup_I46_priceQuantityMaterialThicknessInsulationTotalSumType: string;
  sup_I50_priceQuantityMaterialThicknessInsulationTotalSumType: number;
  sup_I51_priceQuantityMaterialThicknessInsulationTotalSumType: number;
  sup_I52_priceQuantityMaterialThicknessInsulationTotalSumType: number;
  sup_I54_priceQuantityMaterialThicknessInsulationTotalType: number;
  sup_I55_priceQuantityMaterialThicknessInsulationTotalType: number;
  sup_I56_priceQuantityMaterialThicknessInsulationTotalType: number;
  sup_I57_priceQuantityMaterialThicknessInsulationTotalType: number;
  sup_K38_pricePipeTotal: number;
  sup_K39_priceQuantityMaterialPipeInsulationTotal: number;
  sup_M38_priceMaterialTotal: number;
  sup_M39_quantityMaterialTotal: number;
  sup_M44_priceMaterial: number;
  sup_M45_priceMaterial: number;
  sup_M46_priceQuantityMaterialSum: number;
  sup_M51_priceQuantityMaterialTotalSum: number;
  sup_M52_priceQuantityMaterialTotalSum: number;
  sup_N50_priceQuantityWeightThicknessTotalSum: number;
  sup_N51_priceQuantityWeightThicknessTotalSum: number;
  sup_N52_priceQuantityWeightThicknessTotalSum: number;
  sup_N54_quantityWeightThicknessTotal: number;
  sup_N55_quantityWeightThicknessTotal: number;
  sup_N56_quantityWeightThicknessTotal: number;
  sup_N57_quantityWeightThicknessTotal: number;
  sup_P45_priceMaterialTotal: number;

  // Optional Orange cells (Engineering parameters - computed/optional)
  sup_C28_priceWeightThickness?: PressureRating;
  sup_C29_priceWeightPipeThickness?: PressureRating;
  sup_D28_priceWeightThickness?: DiameterCode;
  sup_D29_priceWeightPipe?: DiameterCode;
  sup_D9_priceMaterial?: MaterialCode;
  sup_E19_priceWeightThicknessTotal?: string;
  sup_E25_priceWeightThicknessTotal?: string;
  sup_F39_priceQuantityWeightMaterialInsulationTotal?: number;
  sup_I28_priceWeightThicknessType?: PressureRating;
  sup_I29_priceWeightPipeThicknessType?: PressureRating;
  sup_J28_priceQuantityWeightThicknessNormTotal?: DiameterCode;
  sup_J29_priceQuantityWeightPipeNormTotal?: DiameterCode;
  sup_K19_priceWeightThicknessTotal?: string;
  sup_K25_priceWeightThicknessTotal?: string;
  sup_P19_priceQuantityMaterialThickness?: number;
  sup_P20_priceQuantityWeightMaterial?: MaterialCode;
  sup_P21_priceQuantityMaterial?: SurfaceTreatment;
  sup_P22_priceQuantityMaterialTotal?: ThreadSpec;
  sup_P29_priceMaterialTotal?: ThreadSpec;
  sup_P33_priceMaterialPipeTotal?: ThreadSpec;
  sup_P37_priceMaterialTotal?: ThreadSpec;
  sup_P41_priceMaterialTotal?: ThreadSpec;
  sup_Q29_priceThickness?: SurfaceTreatment;
  sup_Q33_pricePipeThickness?: SurfaceTreatment;
  sup_Q37_priceThickness?: SurfaceTreatment;
  sup_Q41_priceThicknessTotal?: SurfaceTreatment;
  sup_R29_price?: SurfaceTreatment;
  sup_R33_pricePipe?: SurfaceTreatment;
  sup_R37_price?: SurfaceTreatment;
  sup_R41_priceTotal?: SurfaceTreatment;
}

/**
 * Calculated results returned by Excel processing
 * Yellow cells - computed values
 */
export interface CalculatedValues {
  tech_F27_quantityType: string;
  tech_G27_quantityType: string;
  tech_P27_materialType: string;
  tech_Q27_materialType: string;
  tech_R27_materialThicknessType: string;
  tech_S27_materialThicknessType: string;
  tech_U27_materialThicknessType: number;
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
 * Calculation results container
 */
export interface CalculationResults {
  calculated_values: CalculatedValues;
  total_cost: number;
  component_costs: ComponentCosts;
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