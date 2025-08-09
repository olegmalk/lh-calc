"use strict";
/**
 * API Contract Types for Excel Processor Service
 * Generated from OpenAPI specification
 * Compatible with Bitrix24 integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatus = exports.ErrorCode = exports.SURFACE_TREATMENTS = exports.THREAD_SPECS = exports.DIAMETER_CODES = exports.PRESSURE_RATINGS = exports.MATERIAL_CODES = void 0;
exports.isSuccessResponse = isSuccessResponse;
exports.isErrorResponse = isErrorResponse;
exports.createErrorResponse = createErrorResponse;
exports.createSuccessResponse = createSuccessResponse;
exports.generateRequestId = generateRequestId;
exports.isValidMaterialCode = isValidMaterialCode;
exports.isValidPressureRating = isValidPressureRating;
exports.isValidDiameterCode = isValidDiameterCode;
exports.isValidThreadSpec = isValidThreadSpec;
exports.isValidSurfaceTreatment = isValidSurfaceTreatment;
exports.isValidEquipmentCode = isValidEquipmentCode;
exports.isValidFractionPattern = isValidFractionPattern;
exports.isValidNumber = isValidNumber;
// Enums for validation
exports.MATERIAL_CODES = ['0000', '06ХН28МДТ', '09Г2С', '12Х18Н10Т', '20ХН3А', '30ХМА', '40Х'];
exports.PRESSURE_RATINGS = ['Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160'];
exports.DIAMETER_CODES = ['Ду25', 'Ду32', 'Ду40', 'Ду50', 'Ду65', 'Ду80', 'Ду100', 'Ду125', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду600', 'Ду800', 'Ду1000'];
exports.THREAD_SPECS = ['М16', 'М18', 'М20', 'М22', 'М24', 'М27', 'М30', 'М33', 'М36', 'М39', 'М42', 'М48'];
exports.SURFACE_TREATMENTS = ['Zn-Cr 9мкм', 'ст40Х'];
/**
 * API error codes
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["VALIDATION_FAILED"] = "VALIDATION_FAILED";
    ErrorCode["EXCEL_CALCULATION_FAILED"] = "EXCEL_CALCULATION_FAILED";
    ErrorCode["EXCEL_FILE_NOT_FOUND"] = "EXCEL_FILE_NOT_FOUND";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["INVALID_REQUEST"] = "INVALID_REQUEST";
    ErrorCode["INVALID_INPUT_DATA"] = "INVALID_INPUT_DATA";
    ErrorCode["MISSING_REQUIRED_FIELDS"] = "MISSING_REQUIRED_FIELDS";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
/**
 * HTTP status codes used by the API
 */
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
/**
 * Type guard for successful response
 */
function isSuccessResponse(response) {
    return response.success === true;
}
/**
 * Type guard for error response
 */
function isErrorResponse(response) {
    return response.success === false;
}
/**
 * Create standardized error response
 */
function createErrorResponse(error, requestId, details) {
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
function createSuccessResponse(results, requestId, processingTimeMs, metadata) {
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
function generateRequestId() {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
    const random = Math.random().toString(36).substring(2, 8);
    return `req_${timestamp}_${random}`;
}
/**
 * Validate material code
 */
function isValidMaterialCode(value) {
    return exports.MATERIAL_CODES.includes(value);
}
/**
 * Validate pressure rating
 */
function isValidPressureRating(value) {
    return exports.PRESSURE_RATINGS.includes(value);
}
/**
 * Validate diameter code
 */
function isValidDiameterCode(value) {
    return exports.DIAMETER_CODES.includes(value);
}
/**
 * Validate thread specification
 */
function isValidThreadSpec(value) {
    return exports.THREAD_SPECS.includes(value);
}
/**
 * Validate surface treatment
 */
function isValidSurfaceTreatment(value) {
    return exports.SURFACE_TREATMENTS.includes(value);
}
/**
 * Equipment code pattern validator
 */
function isValidEquipmentCode(value) {
    return /^[ЕК][-0-9А-Я*]*$/.test(value);
}
/**
 * Fraction pattern validator (e.g., "1/6")
 */
function isValidFractionPattern(value) {
    return /^\d+\/\d+$/.test(value);
}
/**
 * Number validation with min/max constraints
 */
function isValidNumber(value, min, max) {
    const num = Number(value);
    if (isNaN(num))
        return false;
    if (min !== undefined && num < min)
        return false;
    if (max !== undefined && num > max)
        return false;
    return true;
}
//# sourceMappingURL=api-contract.js.map