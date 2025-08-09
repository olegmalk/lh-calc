/**
 * Custom Error Classes for Excel API
 * Handles all edge cases from comprehensive error analysis
 */
export declare enum ErrorType {
    DIVISION_BY_ZERO = "DIVISION_BY_ZERO",
    VLOOKUP_FAILURE = "VLOOKUP_FAILURE",
    CIRCULAR_REFERENCE = "CIRCULAR_REFERENCE",
    INVALID_CELL_REFERENCE = "INVALID_CELL_REFERENCE",
    FORMULA_ERROR = "FORMULA_ERROR",
    TYPE_CONVERSION_ERROR = "TYPE_CONVERSION_ERROR",
    NULL_UNDEFINED_ERROR = "NULL_UNDEFINED_ERROR",
    NUMERIC_OVERFLOW = "NUMERIC_OVERFLOW",
    NUMERIC_UNDERFLOW = "NUMERIC_UNDERFLOW",
    PRECISION_ERROR = "PRECISION_ERROR",
    INVALID_NUMBER = "INVALID_NUMBER",
    XSS_ATTEMPT = "XSS_ATTEMPT",
    SQL_INJECTION_ATTEMPT = "SQL_INJECTION_ATTEMPT",
    UNICODE_ERROR = "UNICODE_ERROR",
    STRING_LENGTH_EXCEEDED = "STRING_LENGTH_EXCEEDED",
    INVALID_PATTERN = "INVALID_PATTERN",
    CONTROL_CHARACTERS = "CONTROL_CHARACTERS",
    INVALID_ENUM_VALUE = "INVALID_ENUM_VALUE",
    CASE_SENSITIVITY_ERROR = "CASE_SENSITIVITY_ERROR",
    WHITESPACE_ERROR = "WHITESPACE_ERROR",
    FIELD_COMBINATION_ERROR = "FIELD_COMBINATION_ERROR",
    ENGINEERING_CONSTRAINT_ERROR = "ENGINEERING_CONSTRAINT_ERROR",
    MATERIAL_PROPERTY_ERROR = "MATERIAL_PROPERTY_ERROR",
    CONCURRENT_ACCESS_ERROR = "CONCURRENT_ACCESS_ERROR",
    FILE_LOCKED_ERROR = "FILE_LOCKED_ERROR",
    MEMORY_EXHAUSTION = "MEMORY_EXHAUSTION",
    TIMEOUT_ERROR = "TIMEOUT_ERROR",
    FILE_CORRUPTION = "FILE_CORRUPTION",
    MISSING_REQUIRED_FIELDS = "MISSING_REQUIRED_FIELDS",
    REQUEST_SIZE_EXCEEDED = "REQUEST_SIZE_EXCEEDED",
    UNKNOWN_FIELDS = "UNKNOWN_FIELDS",
    CALCULATION_TIMEOUT = "CALCULATION_TIMEOUT",
    PERFORMANCE_DEGRADATION = "PERFORMANCE_DEGRADATION",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    PROCESSING_ERROR = "PROCESSING_ERROR",
    INTERNAL_ERROR = "INTERNAL_ERROR"
}
export declare enum ErrorSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export interface ErrorContext {
    field?: string;
    value?: any;
    expectedType?: string;
    affectedCells?: string[];
    mitigationStrategy?: string;
    requestId?: string;
    timestamp?: string;
    userAgent?: string;
    [key: string]: any;
}
/**
 * Base error class for all Excel API errors
 */
export declare class ExcelApiError extends Error {
    readonly type: ErrorType;
    readonly severity: ErrorSeverity;
    readonly context: ErrorContext;
    readonly recoverable: boolean;
    readonly timestamp: string;
    readonly errorId: string;
    constructor(message: string, type: ErrorType, severity: ErrorSeverity, context?: ErrorContext, recoverable?: boolean);
    toJSON(): {
        name: string;
        message: string;
        type: ErrorType;
        severity: ErrorSeverity;
        context: ErrorContext;
        recoverable: boolean;
        timestamp: string;
        errorId: string;
    };
}
/**
 * Excel formula calculation errors
 */
export declare class FormulaError extends ExcelApiError {
    constructor(message: string, type: ErrorType, context?: ErrorContext);
}
export declare class DivisionByZeroError extends FormulaError {
    constructor(field: string, denominator: any, context?: ErrorContext);
}
export declare class VLookupError extends FormulaError {
    constructor(lookupValue: any, table: string, context?: ErrorContext);
}
export declare class CircularReferenceError extends FormulaError {
    constructor(cells: string[], context?: ErrorContext);
}
/**
 * Data type validation errors
 */
export declare class ValidationError extends ExcelApiError {
    constructor(message: string, type: ErrorType, context?: ErrorContext);
}
export declare class TypeConversionError extends ValidationError {
    constructor(field: string, value: any, expectedType: string, context?: ErrorContext);
}
export declare class NumericOverflowError extends ValidationError {
    constructor(field: string, value: number, context?: ErrorContext);
}
export declare class NumericUnderflowError extends ValidationError {
    constructor(field: string, value: number, context?: ErrorContext);
}
/**
 * Security-related errors
 */
export declare class SecurityError extends ExcelApiError {
    constructor(message: string, type: ErrorType, context?: ErrorContext);
}
export declare class XSSAttemptError extends SecurityError {
    constructor(field: string, value: string, context?: ErrorContext);
}
export declare class SQLInjectionError extends SecurityError {
    constructor(field: string, value: string, context?: ErrorContext);
}
/**
 * String validation errors
 */
export declare class StringValidationError extends ValidationError {
    constructor(message: string, type: ErrorType, context?: ErrorContext);
}
export declare class StringLengthError extends StringValidationError {
    constructor(field: string, length: number, maxLength: number, context?: ErrorContext);
}
export declare class PatternValidationError extends StringValidationError {
    constructor(field: string, value: string, pattern: string, context?: ErrorContext);
}
export declare class UnicodeError extends StringValidationError {
    constructor(field: string, value: string, context?: ErrorContext);
}
/**
 * Enum validation errors
 */
export declare class EnumValidationError extends ValidationError {
    constructor(field: string, value: string, validValues: string[], context?: ErrorContext);
}
/**
 * Business logic errors
 */
export declare class BusinessLogicError extends ExcelApiError {
    constructor(message: string, type: ErrorType, context?: ErrorContext);
}
export declare class FieldCombinationError extends BusinessLogicError {
    constructor(fields: string[], values: any[], context?: ErrorContext);
}
export declare class EngineeringConstraintError extends BusinessLogicError {
    constructor(constraint: string, values: Record<string, any>, context?: ErrorContext);
}
export declare class MaterialPropertyError extends BusinessLogicError {
    constructor(material: string, property: string, value: any, context?: ErrorContext);
}
/**
 * System and performance errors
 */
export declare class SystemError extends ExcelApiError {
    constructor(message: string, type: ErrorType, context?: ErrorContext);
}
export declare class ConcurrentAccessError extends SystemError {
    constructor(resource: string, context?: ErrorContext);
}
export declare class FileLockError extends SystemError {
    constructor(filePath: string, context?: ErrorContext);
}
export declare class MemoryExhaustionError extends SystemError {
    constructor(memoryUsed: number, memoryLimit: number, context?: ErrorContext);
}
export declare class TimeoutError extends SystemError {
    constructor(operation: string, timeoutMs: number, context?: ErrorContext);
}
export declare class FileCorruptionError extends SystemError {
    constructor(filePath: string, context?: ErrorContext);
}
/**
 * API contract errors
 */
export declare class ApiContractError extends ExcelApiError {
    constructor(message: string, type: ErrorType, context?: ErrorContext);
}
export declare class MissingRequiredFieldsError extends ApiContractError {
    constructor(fields: string[], context?: ErrorContext);
}
export declare class RequestSizeError extends ApiContractError {
    constructor(size: number, limit: number, context?: ErrorContext);
}
/**
 * Error factory for creating appropriate error instances
 */
export declare class ErrorFactory {
    static create(type: ErrorType, message: string, context?: ErrorContext): ExcelApiError;
}
/**
 * Error classification utilities
 */
export declare class ErrorClassifier {
    static isRecoverable(error: ExcelApiError): boolean;
    static isCritical(error: ExcelApiError): boolean;
    static isSecurityThreat(error: ExcelApiError): boolean;
    static requiresImmediateAction(error: ExcelApiError): boolean;
    static shouldRetry(error: ExcelApiError): boolean;
}
//# sourceMappingURL=custom-errors.d.ts.map