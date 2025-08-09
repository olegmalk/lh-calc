"use strict";
/**
 * Custom Error Classes for Excel API
 * Handles all edge cases from comprehensive error analysis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorClassifier = exports.ErrorFactory = exports.RequestSizeError = exports.MissingRequiredFieldsError = exports.ApiContractError = exports.FileCorruptionError = exports.TimeoutError = exports.MemoryExhaustionError = exports.FileLockError = exports.ConcurrentAccessError = exports.SystemError = exports.MaterialPropertyError = exports.EngineeringConstraintError = exports.FieldCombinationError = exports.BusinessLogicError = exports.EnumValidationError = exports.UnicodeError = exports.PatternValidationError = exports.StringLengthError = exports.StringValidationError = exports.SQLInjectionError = exports.XSSAttemptError = exports.SecurityError = exports.NumericUnderflowError = exports.NumericOverflowError = exports.TypeConversionError = exports.ValidationError = exports.CircularReferenceError = exports.VLookupError = exports.DivisionByZeroError = exports.FormulaError = exports.ExcelApiError = exports.ErrorSeverity = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    // Excel Formula Errors
    ErrorType["DIVISION_BY_ZERO"] = "DIVISION_BY_ZERO";
    ErrorType["VLOOKUP_FAILURE"] = "VLOOKUP_FAILURE";
    ErrorType["CIRCULAR_REFERENCE"] = "CIRCULAR_REFERENCE";
    ErrorType["INVALID_CELL_REFERENCE"] = "INVALID_CELL_REFERENCE";
    ErrorType["FORMULA_ERROR"] = "FORMULA_ERROR";
    // Data Type Errors
    ErrorType["TYPE_CONVERSION_ERROR"] = "TYPE_CONVERSION_ERROR";
    ErrorType["NULL_UNDEFINED_ERROR"] = "NULL_UNDEFINED_ERROR";
    ErrorType["NUMERIC_OVERFLOW"] = "NUMERIC_OVERFLOW";
    ErrorType["NUMERIC_UNDERFLOW"] = "NUMERIC_UNDERFLOW";
    ErrorType["PRECISION_ERROR"] = "PRECISION_ERROR";
    ErrorType["INVALID_NUMBER"] = "INVALID_NUMBER";
    // String/Security Errors
    ErrorType["XSS_ATTEMPT"] = "XSS_ATTEMPT";
    ErrorType["SQL_INJECTION_ATTEMPT"] = "SQL_INJECTION_ATTEMPT";
    ErrorType["UNICODE_ERROR"] = "UNICODE_ERROR";
    ErrorType["STRING_LENGTH_EXCEEDED"] = "STRING_LENGTH_EXCEEDED";
    ErrorType["INVALID_PATTERN"] = "INVALID_PATTERN";
    ErrorType["CONTROL_CHARACTERS"] = "CONTROL_CHARACTERS";
    // Enum Validation Errors
    ErrorType["INVALID_ENUM_VALUE"] = "INVALID_ENUM_VALUE";
    ErrorType["CASE_SENSITIVITY_ERROR"] = "CASE_SENSITIVITY_ERROR";
    ErrorType["WHITESPACE_ERROR"] = "WHITESPACE_ERROR";
    // Business Logic Errors
    ErrorType["FIELD_COMBINATION_ERROR"] = "FIELD_COMBINATION_ERROR";
    ErrorType["ENGINEERING_CONSTRAINT_ERROR"] = "ENGINEERING_CONSTRAINT_ERROR";
    ErrorType["MATERIAL_PROPERTY_ERROR"] = "MATERIAL_PROPERTY_ERROR";
    // System Errors
    ErrorType["CONCURRENT_ACCESS_ERROR"] = "CONCURRENT_ACCESS_ERROR";
    ErrorType["FILE_LOCKED_ERROR"] = "FILE_LOCKED_ERROR";
    ErrorType["MEMORY_EXHAUSTION"] = "MEMORY_EXHAUSTION";
    ErrorType["TIMEOUT_ERROR"] = "TIMEOUT_ERROR";
    ErrorType["FILE_CORRUPTION"] = "FILE_CORRUPTION";
    // API Contract Errors
    ErrorType["MISSING_REQUIRED_FIELDS"] = "MISSING_REQUIRED_FIELDS";
    ErrorType["REQUEST_SIZE_EXCEEDED"] = "REQUEST_SIZE_EXCEEDED";
    ErrorType["UNKNOWN_FIELDS"] = "UNKNOWN_FIELDS";
    // Performance Errors
    ErrorType["CALCULATION_TIMEOUT"] = "CALCULATION_TIMEOUT";
    ErrorType["PERFORMANCE_DEGRADATION"] = "PERFORMANCE_DEGRADATION";
    // Generic Errors
    ErrorType["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorType["PROCESSING_ERROR"] = "PROCESSING_ERROR";
    ErrorType["INTERNAL_ERROR"] = "INTERNAL_ERROR";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "low";
    ErrorSeverity["MEDIUM"] = "medium";
    ErrorSeverity["HIGH"] = "high";
    ErrorSeverity["CRITICAL"] = "critical";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
/**
 * Base error class for all Excel API errors
 */
class ExcelApiError extends Error {
    constructor(message, type, severity, context = {}, recoverable = false) {
        super(message);
        this.type = type;
        this.severity = severity;
        this.context = context;
        this.recoverable = recoverable;
        this.name = 'ExcelApiError';
        this.timestamp = new Date().toISOString();
        this.errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        // Ensure proper prototype chain
        Object.setPrototypeOf(this, ExcelApiError.prototype);
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            type: this.type,
            severity: this.severity,
            context: this.context,
            recoverable: this.recoverable,
            timestamp: this.timestamp,
            errorId: this.errorId
        };
    }
}
exports.ExcelApiError = ExcelApiError;
/**
 * Excel formula calculation errors
 */
class FormulaError extends ExcelApiError {
    constructor(message, type, context = {}) {
        super(message, type, ErrorSeverity.HIGH, context, false);
        this.name = 'FormulaError';
    }
}
exports.FormulaError = FormulaError;
class DivisionByZeroError extends FormulaError {
    constructor(field, denominator, context = {}) {
        super(`Division by zero detected in field '${field}' with denominator: ${denominator}`, ErrorType.DIVISION_BY_ZERO, { ...context, field, value: denominator, mitigationStrategy: 'Add zero-check validation before calculation' });
    }
}
exports.DivisionByZeroError = DivisionByZeroError;
class VLookupError extends FormulaError {
    constructor(lookupValue, table, context = {}) {
        super(`VLOOKUP failed: value '${lookupValue}' not found in table '${table}'`, ErrorType.VLOOKUP_FAILURE, { ...context, value: lookupValue, table, mitigationStrategy: 'Use IFERROR wrapper, validate enum values' });
    }
}
exports.VLookupError = VLookupError;
class CircularReferenceError extends FormulaError {
    constructor(cells, context = {}) {
        super(`Circular reference detected between cells: ${cells.join(' -> ')}`, ErrorType.CIRCULAR_REFERENCE, { ...context, affectedCells: cells, mitigationStrategy: 'Pre-validate formula dependencies' });
    }
}
exports.CircularReferenceError = CircularReferenceError;
/**
 * Data type validation errors
 */
class ValidationError extends ExcelApiError {
    constructor(message, type, context = {}) {
        super(message, type, ErrorSeverity.MEDIUM, context, true);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class TypeConversionError extends ValidationError {
    constructor(field, value, expectedType, context = {}) {
        super(`Cannot convert value '${value}' to type '${expectedType}' for field '${field}'`, ErrorType.TYPE_CONVERSION_ERROR, { ...context, field, value, expectedType, mitigationStrategy: 'Validate data types before conversion' });
    }
}
exports.TypeConversionError = TypeConversionError;
class NumericOverflowError extends ValidationError {
    constructor(field, value, context = {}) {
        super(`Numeric overflow in field '${field}': value ${value} exceeds maximum`, ErrorType.NUMERIC_OVERFLOW, { ...context, field, value, mitigationStrategy: 'Validate numeric ranges and handle overflow gracefully' });
    }
}
exports.NumericOverflowError = NumericOverflowError;
class NumericUnderflowError extends ValidationError {
    constructor(field, value, context = {}) {
        super(`Numeric underflow in field '${field}': value ${value} below minimum precision`, ErrorType.NUMERIC_UNDERFLOW, { ...context, field, value, mitigationStrategy: 'Set minimum precision thresholds' });
    }
}
exports.NumericUnderflowError = NumericUnderflowError;
/**
 * Security-related errors
 */
class SecurityError extends ExcelApiError {
    constructor(message, type, context = {}) {
        super(message, type, ErrorSeverity.CRITICAL, context, false);
        this.name = 'SecurityError';
    }
}
exports.SecurityError = SecurityError;
class XSSAttemptError extends SecurityError {
    constructor(field, value, context = {}) {
        super(`XSS attempt detected in field '${field}'`, ErrorType.XSS_ATTEMPT, { ...context, field, value: '[REDACTED]', mitigationStrategy: 'HTML encode output, validate input format' });
    }
}
exports.XSSAttemptError = XSSAttemptError;
class SQLInjectionError extends SecurityError {
    constructor(field, value, context = {}) {
        super(`SQL injection attempt detected in field '${field}'`, ErrorType.SQL_INJECTION_ATTEMPT, { ...context, field, value: '[REDACTED]', mitigationStrategy: 'Sanitize inputs, use parameterized queries' });
    }
}
exports.SQLInjectionError = SQLInjectionError;
/**
 * String validation errors
 */
class StringValidationError extends ValidationError {
    constructor(message, type, context = {}) {
        super(message, type, ErrorSeverity.MEDIUM, context, true);
        this.name = 'StringValidationError';
    }
}
exports.StringValidationError = StringValidationError;
class StringLengthError extends StringValidationError {
    constructor(field, length, maxLength, context = {}) {
        super(`String length ${length} exceeds maximum ${maxLength} for field '${field}'`, ErrorType.STRING_LENGTH_EXCEEDED, { ...context, field, length, maxLength, mitigationStrategy: 'Set maximum string length validation' });
    }
}
exports.StringLengthError = StringLengthError;
class PatternValidationError extends StringValidationError {
    constructor(field, value, pattern, context = {}) {
        super(`Value '${value}' does not match required pattern for field '${field}'`, ErrorType.INVALID_PATTERN, { ...context, field, value, pattern, mitigationStrategy: 'Test regex patterns against edge cases' });
    }
}
exports.PatternValidationError = PatternValidationError;
class UnicodeError extends StringValidationError {
    constructor(field, value, context = {}) {
        super(`Unicode normalization error in field '${field}'`, ErrorType.UNICODE_ERROR, { ...context, field, value, mitigationStrategy: 'Normalize Unicode before validation' });
    }
}
exports.UnicodeError = UnicodeError;
/**
 * Enum validation errors
 */
class EnumValidationError extends ValidationError {
    constructor(field, value, validValues, context = {}) {
        super(`Invalid enum value '${value}' for field '${field}'. Valid values: ${validValues.join(', ')}`, ErrorType.INVALID_ENUM_VALUE, { ...context, field, value, validValues, mitigationStrategy: 'Use exact matching for enum validation' });
    }
}
exports.EnumValidationError = EnumValidationError;
/**
 * Business logic errors
 */
class BusinessLogicError extends ExcelApiError {
    constructor(message, type, context = {}) {
        super(message, type, ErrorSeverity.HIGH, context, false);
        this.name = 'BusinessLogicError';
    }
}
exports.BusinessLogicError = BusinessLogicError;
class FieldCombinationError extends BusinessLogicError {
    constructor(fields, values, context = {}) {
        super(`Invalid combination of field values: ${fields.join(', ')}`, ErrorType.FIELD_COMBINATION_ERROR, { ...context, fields, values, mitigationStrategy: 'Implement cross-field validation rules' });
    }
}
exports.FieldCombinationError = FieldCombinationError;
class EngineeringConstraintError extends BusinessLogicError {
    constructor(constraint, values, context = {}) {
        super(`Engineering constraint violation: ${constraint}`, ErrorType.ENGINEERING_CONSTRAINT_ERROR, { ...context, constraint, values, mitigationStrategy: 'Implement engineering validation matrix' });
    }
}
exports.EngineeringConstraintError = EngineeringConstraintError;
class MaterialPropertyError extends BusinessLogicError {
    constructor(material, property, value, context = {}) {
        super(`Material '${material}' property '${property}' value '${value}' exceeds limits`, ErrorType.MATERIAL_PROPERTY_ERROR, { ...context, material, property, value, mitigationStrategy: 'Implement material property validation' });
    }
}
exports.MaterialPropertyError = MaterialPropertyError;
/**
 * System and performance errors
 */
class SystemError extends ExcelApiError {
    constructor(message, type, context = {}) {
        super(message, type, ErrorSeverity.CRITICAL, context, false);
        this.name = 'SystemError';
    }
}
exports.SystemError = SystemError;
class ConcurrentAccessError extends SystemError {
    constructor(resource, context = {}) {
        super(`Concurrent access conflict for resource: ${resource}`, ErrorType.CONCURRENT_ACCESS_ERROR, { ...context, resource, mitigationStrategy: 'Use thread-safe Excel processing, queue requests' });
    }
}
exports.ConcurrentAccessError = ConcurrentAccessError;
class FileLockError extends SystemError {
    constructor(filePath, context = {}) {
        super(`File is locked and cannot be accessed: ${filePath}`, ErrorType.FILE_LOCKED_ERROR, { ...context, filePath, mitigationStrategy: 'Implement file locking detection and retry logic' });
    }
}
exports.FileLockError = FileLockError;
class MemoryExhaustionError extends SystemError {
    constructor(memoryUsed, memoryLimit, context = {}) {
        super(`Memory exhaustion: ${memoryUsed}MB used, ${memoryLimit}MB limit`, ErrorType.MEMORY_EXHAUSTION, { ...context, memoryUsed, memoryLimit, mitigationStrategy: 'Monitor memory usage, implement request queuing' });
    }
}
exports.MemoryExhaustionError = MemoryExhaustionError;
class TimeoutError extends SystemError {
    constructor(operation, timeoutMs, context = {}) {
        super(`Operation '${operation}' timed out after ${timeoutMs}ms`, ErrorType.TIMEOUT_ERROR, { ...context, operation, timeoutMs, mitigationStrategy: 'Implement timeout and progress tracking' });
    }
}
exports.TimeoutError = TimeoutError;
class FileCorruptionError extends SystemError {
    constructor(filePath, context = {}) {
        super(`File corruption detected: ${filePath}`, ErrorType.FILE_CORRUPTION, { ...context, filePath, mitigationStrategy: 'Validate file integrity before processing' });
    }
}
exports.FileCorruptionError = FileCorruptionError;
/**
 * API contract errors
 */
class ApiContractError extends ExcelApiError {
    constructor(message, type, context = {}) {
        super(message, type, ErrorSeverity.HIGH, context, true);
        this.name = 'ApiContractError';
    }
}
exports.ApiContractError = ApiContractError;
class MissingRequiredFieldsError extends ApiContractError {
    constructor(fields, context = {}) {
        super(`Missing required fields: ${fields.join(', ')}`, ErrorType.MISSING_REQUIRED_FIELDS, { ...context, missingFields: fields, mitigationStrategy: 'Comprehensive request validation before processing' });
    }
}
exports.MissingRequiredFieldsError = MissingRequiredFieldsError;
class RequestSizeError extends ApiContractError {
    constructor(size, limit, context = {}) {
        super(`Request size ${size} bytes exceeds limit of ${limit} bytes`, ErrorType.REQUEST_SIZE_EXCEEDED, { ...context, size, limit, mitigationStrategy: 'Implement request size limits' });
    }
}
exports.RequestSizeError = RequestSizeError;
/**
 * Error factory for creating appropriate error instances
 */
class ErrorFactory {
    static create(type, message, context = {}) {
        switch (type) {
            case ErrorType.DIVISION_BY_ZERO:
                return new DivisionByZeroError(context.field || 'unknown', context.value, context);
            case ErrorType.VLOOKUP_FAILURE:
                return new VLookupError(context.value, context.table || 'unknown', context);
            case ErrorType.CIRCULAR_REFERENCE:
                return new CircularReferenceError(context.affectedCells || [], context);
            case ErrorType.TYPE_CONVERSION_ERROR:
                return new TypeConversionError(context.field || 'unknown', context.value, context.expectedType || 'unknown', context);
            case ErrorType.NUMERIC_OVERFLOW:
                return new NumericOverflowError(context.field || 'unknown', context.value, context);
            case ErrorType.NUMERIC_UNDERFLOW:
                return new NumericUnderflowError(context.field || 'unknown', context.value, context);
            case ErrorType.XSS_ATTEMPT:
                return new XSSAttemptError(context.field || 'unknown', context.value, context);
            case ErrorType.SQL_INJECTION_ATTEMPT:
                return new SQLInjectionError(context.field || 'unknown', context.value, context);
            case ErrorType.STRING_LENGTH_EXCEEDED:
                return new StringLengthError(context.field || 'unknown', context.length || 0, context.maxLength || 0, context);
            case ErrorType.INVALID_PATTERN:
                return new PatternValidationError(context.field || 'unknown', context.value, context.pattern || 'unknown', context);
            case ErrorType.UNICODE_ERROR:
                return new UnicodeError(context.field || 'unknown', context.value, context);
            case ErrorType.INVALID_ENUM_VALUE:
                return new EnumValidationError(context.field || 'unknown', context.value, context.validValues || [], context);
            case ErrorType.FIELD_COMBINATION_ERROR:
                return new FieldCombinationError(context.fields || [], context.values || [], context);
            case ErrorType.ENGINEERING_CONSTRAINT_ERROR:
                return new EngineeringConstraintError(context.constraint || 'unknown', context.values || {}, context);
            case ErrorType.MATERIAL_PROPERTY_ERROR:
                return new MaterialPropertyError(context.material || 'unknown', context.property || 'unknown', context.value, context);
            case ErrorType.CONCURRENT_ACCESS_ERROR:
                return new ConcurrentAccessError(context.resource || 'unknown', context);
            case ErrorType.FILE_LOCKED_ERROR:
                return new FileLockError(context.filePath || 'unknown', context);
            case ErrorType.MEMORY_EXHAUSTION:
                return new MemoryExhaustionError(context.memoryUsed || 0, context.memoryLimit || 0, context);
            case ErrorType.TIMEOUT_ERROR:
                return new TimeoutError(context.operation || 'unknown', context.timeoutMs || 0, context);
            case ErrorType.FILE_CORRUPTION:
                return new FileCorruptionError(context.filePath || 'unknown', context);
            case ErrorType.MISSING_REQUIRED_FIELDS:
                return new MissingRequiredFieldsError(context.missingFields || [], context);
            case ErrorType.REQUEST_SIZE_EXCEEDED:
                return new RequestSizeError(context.size || 0, context.limit || 0, context);
            default:
                return new ExcelApiError(message, type, ErrorSeverity.MEDIUM, context);
        }
    }
}
exports.ErrorFactory = ErrorFactory;
/**
 * Error classification utilities
 */
class ErrorClassifier {
    static isRecoverable(error) {
        return error.recoverable;
    }
    static isCritical(error) {
        return error.severity === ErrorSeverity.CRITICAL;
    }
    static isSecurityThreat(error) {
        return error instanceof SecurityError;
    }
    static requiresImmediateAction(error) {
        return error.severity === ErrorSeverity.CRITICAL || error instanceof SecurityError;
    }
    static shouldRetry(error) {
        const retryableTypes = [
            ErrorType.CONCURRENT_ACCESS_ERROR,
            ErrorType.FILE_LOCKED_ERROR,
            ErrorType.TIMEOUT_ERROR,
            ErrorType.MEMORY_EXHAUSTION
        ];
        return retryableTypes.includes(error.type) && error.recoverable;
    }
}
exports.ErrorClassifier = ErrorClassifier;
//# sourceMappingURL=custom-errors.js.map