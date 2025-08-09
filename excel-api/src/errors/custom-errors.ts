/**
 * Custom Error Classes for Excel API
 * Handles all edge cases from comprehensive error analysis
 */

export enum ErrorType {
  // Excel Formula Errors
  DIVISION_BY_ZERO = 'DIVISION_BY_ZERO',
  VLOOKUP_FAILURE = 'VLOOKUP_FAILURE',
  CIRCULAR_REFERENCE = 'CIRCULAR_REFERENCE',
  INVALID_CELL_REFERENCE = 'INVALID_CELL_REFERENCE',
  FORMULA_ERROR = 'FORMULA_ERROR',
  
  // Data Type Errors
  TYPE_CONVERSION_ERROR = 'TYPE_CONVERSION_ERROR',
  NULL_UNDEFINED_ERROR = 'NULL_UNDEFINED_ERROR',
  NUMERIC_OVERFLOW = 'NUMERIC_OVERFLOW',
  NUMERIC_UNDERFLOW = 'NUMERIC_UNDERFLOW',
  PRECISION_ERROR = 'PRECISION_ERROR',
  INVALID_NUMBER = 'INVALID_NUMBER',
  
  // String/Security Errors
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  UNICODE_ERROR = 'UNICODE_ERROR',
  STRING_LENGTH_EXCEEDED = 'STRING_LENGTH_EXCEEDED',
  INVALID_PATTERN = 'INVALID_PATTERN',
  CONTROL_CHARACTERS = 'CONTROL_CHARACTERS',
  
  // Enum Validation Errors
  INVALID_ENUM_VALUE = 'INVALID_ENUM_VALUE',
  CASE_SENSITIVITY_ERROR = 'CASE_SENSITIVITY_ERROR',
  WHITESPACE_ERROR = 'WHITESPACE_ERROR',
  
  // Business Logic Errors
  FIELD_COMBINATION_ERROR = 'FIELD_COMBINATION_ERROR',
  ENGINEERING_CONSTRAINT_ERROR = 'ENGINEERING_CONSTRAINT_ERROR',
  MATERIAL_PROPERTY_ERROR = 'MATERIAL_PROPERTY_ERROR',
  
  // System Errors
  CONCURRENT_ACCESS_ERROR = 'CONCURRENT_ACCESS_ERROR',
  FILE_LOCKED_ERROR = 'FILE_LOCKED_ERROR',
  MEMORY_EXHAUSTION = 'MEMORY_EXHAUSTION',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  FILE_CORRUPTION = 'FILE_CORRUPTION',
  
  // API Contract Errors
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',
  REQUEST_SIZE_EXCEEDED = 'REQUEST_SIZE_EXCEEDED',
  UNKNOWN_FIELDS = 'UNKNOWN_FIELDS',
  
  // Performance Errors
  CALCULATION_TIMEOUT = 'CALCULATION_TIMEOUT',
  PERFORMANCE_DEGRADATION = 'PERFORMANCE_DEGRADATION',
  
  // Generic Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
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
export class ExcelApiError extends Error {
  public readonly timestamp: string;
  public readonly errorId: string;

  constructor(
    message: string,
    public readonly type: ErrorType,
    public readonly severity: ErrorSeverity,
    public readonly context: ErrorContext = {},
    public readonly recoverable: boolean = false
  ) {
    super(message);
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

/**
 * Excel formula calculation errors
 */
export class FormulaError extends ExcelApiError {
  constructor(message: string, type: ErrorType, context: ErrorContext = {}) {
    super(message, type, ErrorSeverity.HIGH, context, false);
    this.name = 'FormulaError';
  }
}

export class DivisionByZeroError extends FormulaError {
  constructor(field: string, denominator: any, context: ErrorContext = {}) {
    super(
      `Division by zero detected in field '${field}' with denominator: ${denominator}`,
      ErrorType.DIVISION_BY_ZERO,
      { ...context, field, value: denominator, mitigationStrategy: 'Add zero-check validation before calculation' }
    );
  }
}

export class VLookupError extends FormulaError {
  constructor(lookupValue: any, table: string, context: ErrorContext = {}) {
    super(
      `VLOOKUP failed: value '${lookupValue}' not found in table '${table}'`,
      ErrorType.VLOOKUP_FAILURE,
      { ...context, value: lookupValue, table, mitigationStrategy: 'Use IFERROR wrapper, validate enum values' }
    );
  }
}

export class CircularReferenceError extends FormulaError {
  constructor(cells: string[], context: ErrorContext = {}) {
    super(
      `Circular reference detected between cells: ${cells.join(' -> ')}`,
      ErrorType.CIRCULAR_REFERENCE,
      { ...context, affectedCells: cells, mitigationStrategy: 'Pre-validate formula dependencies' }
    );
  }
}

/**
 * Data type validation errors
 */
export class ValidationError extends ExcelApiError {
  constructor(message: string, type: ErrorType, context: ErrorContext = {}) {
    super(message, type, ErrorSeverity.MEDIUM, context, true);
    this.name = 'ValidationError';
  }
}

export class TypeConversionError extends ValidationError {
  constructor(field: string, value: any, expectedType: string, context: ErrorContext = {}) {
    super(
      `Cannot convert value '${value}' to type '${expectedType}' for field '${field}'`,
      ErrorType.TYPE_CONVERSION_ERROR,
      { ...context, field, value, expectedType, mitigationStrategy: 'Validate data types before conversion' }
    );
  }
}

export class NumericOverflowError extends ValidationError {
  constructor(field: string, value: number, context: ErrorContext = {}) {
    super(
      `Numeric overflow in field '${field}': value ${value} exceeds maximum`,
      ErrorType.NUMERIC_OVERFLOW,
      { ...context, field, value, mitigationStrategy: 'Validate numeric ranges and handle overflow gracefully' }
    );
  }
}

export class NumericUnderflowError extends ValidationError {
  constructor(field: string, value: number, context: ErrorContext = {}) {
    super(
      `Numeric underflow in field '${field}': value ${value} below minimum precision`,
      ErrorType.NUMERIC_UNDERFLOW,
      { ...context, field, value, mitigationStrategy: 'Set minimum precision thresholds' }
    );
  }
}

/**
 * Security-related errors
 */
export class SecurityError extends ExcelApiError {
  constructor(message: string, type: ErrorType, context: ErrorContext = {}) {
    super(message, type, ErrorSeverity.CRITICAL, context, false);
    this.name = 'SecurityError';
  }
}

export class XSSAttemptError extends SecurityError {
  constructor(field: string, value: string, context: ErrorContext = {}) {
    super(
      `XSS attempt detected in field '${field}'`,
      ErrorType.XSS_ATTEMPT,
      { ...context, field, value: '[REDACTED]', mitigationStrategy: 'HTML encode output, validate input format' }
    );
  }
}

export class SQLInjectionError extends SecurityError {
  constructor(field: string, value: string, context: ErrorContext = {}) {
    super(
      `SQL injection attempt detected in field '${field}'`,
      ErrorType.SQL_INJECTION_ATTEMPT,
      { ...context, field, value: '[REDACTED]', mitigationStrategy: 'Sanitize inputs, use parameterized queries' }
    );
  }
}

/**
 * String validation errors
 */
export class StringValidationError extends ValidationError {
  constructor(message: string, type: ErrorType, context: ErrorContext = {}) {
    super(message, type, ErrorSeverity.MEDIUM, context, true);
    this.name = 'StringValidationError';
  }
}

export class StringLengthError extends StringValidationError {
  constructor(field: string, length: number, maxLength: number, context: ErrorContext = {}) {
    super(
      `String length ${length} exceeds maximum ${maxLength} for field '${field}'`,
      ErrorType.STRING_LENGTH_EXCEEDED,
      { ...context, field, length, maxLength, mitigationStrategy: 'Set maximum string length validation' }
    );
  }
}

export class PatternValidationError extends StringValidationError {
  constructor(field: string, value: string, pattern: string, context: ErrorContext = {}) {
    super(
      `Value '${value}' does not match required pattern for field '${field}'`,
      ErrorType.INVALID_PATTERN,
      { ...context, field, value, pattern, mitigationStrategy: 'Test regex patterns against edge cases' }
    );
  }
}

export class UnicodeError extends StringValidationError {
  constructor(field: string, value: string, context: ErrorContext = {}) {
    super(
      `Unicode normalization error in field '${field}'`,
      ErrorType.UNICODE_ERROR,
      { ...context, field, value, mitigationStrategy: 'Normalize Unicode before validation' }
    );
  }
}

/**
 * Enum validation errors
 */
export class EnumValidationError extends ValidationError {
  constructor(field: string, value: string, validValues: string[], context: ErrorContext = {}) {
    super(
      `Invalid enum value '${value}' for field '${field}'. Valid values: ${validValues.join(', ')}`,
      ErrorType.INVALID_ENUM_VALUE,
      { ...context, field, value, validValues, mitigationStrategy: 'Use exact matching for enum validation' }
    );
  }
}

/**
 * Business logic errors
 */
export class BusinessLogicError extends ExcelApiError {
  constructor(message: string, type: ErrorType, context: ErrorContext = {}) {
    super(message, type, ErrorSeverity.HIGH, context, false);
    this.name = 'BusinessLogicError';
  }
}

export class FieldCombinationError extends BusinessLogicError {
  constructor(fields: string[], values: any[], context: ErrorContext = {}) {
    super(
      `Invalid combination of field values: ${fields.join(', ')}`,
      ErrorType.FIELD_COMBINATION_ERROR,
      { ...context, fields, values, mitigationStrategy: 'Implement cross-field validation rules' }
    );
  }
}

export class EngineeringConstraintError extends BusinessLogicError {
  constructor(constraint: string, values: Record<string, any>, context: ErrorContext = {}) {
    super(
      `Engineering constraint violation: ${constraint}`,
      ErrorType.ENGINEERING_CONSTRAINT_ERROR,
      { ...context, constraint, values, mitigationStrategy: 'Implement engineering validation matrix' }
    );
  }
}

export class MaterialPropertyError extends BusinessLogicError {
  constructor(material: string, property: string, value: any, context: ErrorContext = {}) {
    super(
      `Material '${material}' property '${property}' value '${value}' exceeds limits`,
      ErrorType.MATERIAL_PROPERTY_ERROR,
      { ...context, material, property, value, mitigationStrategy: 'Implement material property validation' }
    );
  }
}

/**
 * System and performance errors
 */
export class SystemError extends ExcelApiError {
  constructor(message: string, type: ErrorType, context: ErrorContext = {}) {
    super(message, type, ErrorSeverity.CRITICAL, context, false);
    this.name = 'SystemError';
  }
}

export class ConcurrentAccessError extends SystemError {
  constructor(resource: string, context: ErrorContext = {}) {
    super(
      `Concurrent access conflict for resource: ${resource}`,
      ErrorType.CONCURRENT_ACCESS_ERROR,
      { ...context, resource, mitigationStrategy: 'Use thread-safe Excel processing, queue requests' }
    );
  }
}

export class FileLockError extends SystemError {
  constructor(filePath: string, context: ErrorContext = {}) {
    super(
      `File is locked and cannot be accessed: ${filePath}`,
      ErrorType.FILE_LOCKED_ERROR,
      { ...context, filePath, mitigationStrategy: 'Implement file locking detection and retry logic' }
    );
  }
}

export class MemoryExhaustionError extends SystemError {
  constructor(memoryUsed: number, memoryLimit: number, context: ErrorContext = {}) {
    super(
      `Memory exhaustion: ${memoryUsed}MB used, ${memoryLimit}MB limit`,
      ErrorType.MEMORY_EXHAUSTION,
      { ...context, memoryUsed, memoryLimit, mitigationStrategy: 'Monitor memory usage, implement request queuing' }
    );
  }
}

export class TimeoutError extends SystemError {
  constructor(operation: string, timeoutMs: number, context: ErrorContext = {}) {
    super(
      `Operation '${operation}' timed out after ${timeoutMs}ms`,
      ErrorType.TIMEOUT_ERROR,
      { ...context, operation, timeoutMs, mitigationStrategy: 'Implement timeout and progress tracking' }
    );
  }
}

export class FileCorruptionError extends SystemError {
  constructor(filePath: string, context: ErrorContext = {}) {
    super(
      `File corruption detected: ${filePath}`,
      ErrorType.FILE_CORRUPTION,
      { ...context, filePath, mitigationStrategy: 'Validate file integrity before processing' }
    );
  }
}

/**
 * API contract errors
 */
export class ApiContractError extends ExcelApiError {
  constructor(message: string, type: ErrorType, context: ErrorContext = {}) {
    super(message, type, ErrorSeverity.HIGH, context, true);
    this.name = 'ApiContractError';
  }
}

export class MissingRequiredFieldsError extends ApiContractError {
  constructor(fields: string[], context: ErrorContext = {}) {
    super(
      `Missing required fields: ${fields.join(', ')}`,
      ErrorType.MISSING_REQUIRED_FIELDS,
      { ...context, missingFields: fields, mitigationStrategy: 'Comprehensive request validation before processing' }
    );
  }
}

export class RequestSizeError extends ApiContractError {
  constructor(size: number, limit: number, context: ErrorContext = {}) {
    super(
      `Request size ${size} bytes exceeds limit of ${limit} bytes`,
      ErrorType.REQUEST_SIZE_EXCEEDED,
      { ...context, size, limit, mitigationStrategy: 'Implement request size limits' }
    );
  }
}

/**
 * Error factory for creating appropriate error instances
 */
export class ErrorFactory {
  static create(type: ErrorType, message: string, context: ErrorContext = {}): ExcelApiError {
    switch (type) {
      case ErrorType.DIVISION_BY_ZERO:
        return new DivisionByZeroError(context.field || 'unknown', context.value, context);
      
      case ErrorType.VLOOKUP_FAILURE:
        return new VLookupError(context.value, context.table || 'unknown', context);
      
      case ErrorType.CIRCULAR_REFERENCE:
        return new CircularReferenceError(context.affectedCells || [], context);
      
      case ErrorType.TYPE_CONVERSION_ERROR:
        return new TypeConversionError(
          context.field || 'unknown',
          context.value,
          context.expectedType || 'unknown',
          context
        );
      
      case ErrorType.NUMERIC_OVERFLOW:
        return new NumericOverflowError(context.field || 'unknown', context.value, context);
      
      case ErrorType.NUMERIC_UNDERFLOW:
        return new NumericUnderflowError(context.field || 'unknown', context.value, context);
      
      case ErrorType.XSS_ATTEMPT:
        return new XSSAttemptError(context.field || 'unknown', context.value, context);
      
      case ErrorType.SQL_INJECTION_ATTEMPT:
        return new SQLInjectionError(context.field || 'unknown', context.value, context);
      
      case ErrorType.STRING_LENGTH_EXCEEDED:
        return new StringLengthError(
          context.field || 'unknown',
          context.length || 0,
          context.maxLength || 0,
          context
        );
      
      case ErrorType.INVALID_PATTERN:
        return new PatternValidationError(
          context.field || 'unknown',
          context.value,
          context.pattern || 'unknown',
          context
        );
      
      case ErrorType.UNICODE_ERROR:
        return new UnicodeError(context.field || 'unknown', context.value, context);
      
      case ErrorType.INVALID_ENUM_VALUE:
        return new EnumValidationError(
          context.field || 'unknown',
          context.value,
          context.validValues || [],
          context
        );
      
      case ErrorType.FIELD_COMBINATION_ERROR:
        return new FieldCombinationError(context.fields || [], context.values || [], context);
      
      case ErrorType.ENGINEERING_CONSTRAINT_ERROR:
        return new EngineeringConstraintError(
          context.constraint || 'unknown',
          context.values || {},
          context
        );
      
      case ErrorType.MATERIAL_PROPERTY_ERROR:
        return new MaterialPropertyError(
          context.material || 'unknown',
          context.property || 'unknown',
          context.value,
          context
        );
      
      case ErrorType.CONCURRENT_ACCESS_ERROR:
        return new ConcurrentAccessError(context.resource || 'unknown', context);
      
      case ErrorType.FILE_LOCKED_ERROR:
        return new FileLockError(context.filePath || 'unknown', context);
      
      case ErrorType.MEMORY_EXHAUSTION:
        return new MemoryExhaustionError(
          context.memoryUsed || 0,
          context.memoryLimit || 0,
          context
        );
      
      case ErrorType.TIMEOUT_ERROR:
        return new TimeoutError(
          context.operation || 'unknown',
          context.timeoutMs || 0,
          context
        );
      
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

/**
 * Error classification utilities
 */
export class ErrorClassifier {
  static isRecoverable(error: ExcelApiError): boolean {
    return error.recoverable;
  }

  static isCritical(error: ExcelApiError): boolean {
    return error.severity === ErrorSeverity.CRITICAL;
  }

  static isSecurityThreat(error: ExcelApiError): boolean {
    return error instanceof SecurityError;
  }

  static requiresImmediateAction(error: ExcelApiError): boolean {
    return error.severity === ErrorSeverity.CRITICAL || error instanceof SecurityError;
  }

  static shouldRetry(error: ExcelApiError): boolean {
    const retryableTypes = [
      ErrorType.CONCURRENT_ACCESS_ERROR,
      ErrorType.FILE_LOCKED_ERROR,
      ErrorType.TIMEOUT_ERROR,
      ErrorType.MEMORY_EXHAUSTION
    ];
    return retryableTypes.includes(error.type) && error.recoverable;
  }
}