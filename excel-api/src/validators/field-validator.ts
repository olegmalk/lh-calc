/**
 * Simplified Field Validation - No validation rules
 * All fields are optional
 */

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  sanitizedData?: any;
}

export interface ValidationError {
  field: string;
  value: any;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export class FieldValidator {
  constructor() {
    // No schema needed - accepting all fields
  }

  /**
   * Validate request data - always returns valid
   */
  public validate(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Sanitize input
    const sanitized = this.sanitizeInput(data);

    return {
      isValid: true,
      errors,
      warnings,
      sanitizedData: sanitized
    };
  }

  /**
   * Sanitize input data
   */
  private sanitizeInput(data: any): any {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(data)) {
      // Remove SQL injection attempts
      if (typeof value === 'string') {
        let cleaned = value
          .replace(/['";\\]/g, '') // Remove dangerous characters
          .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
          .trim();
        
        // Limit string length
        if (cleaned.length > 1000) {
          cleaned = cleaned.substring(0, 1000);
        }
        
        sanitized[key] = cleaned;
      } 
      // Handle numbers
      else if (typeof value === 'number') {
        // Check for Infinity or NaN
        if (!isFinite(value)) {
          sanitized[key] = 0;
        } 
        // Check for overflow
        else if (Math.abs(value) > Number.MAX_SAFE_INTEGER) {
          sanitized[key] = Math.sign(value) * Number.MAX_SAFE_INTEGER;
        } else {
          sanitized[key] = value;
        }
      } 
      // Pass through other types
      else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Get required fields list - empty since no validation
   */
  public getRequiredFields(): string[] {
    return [];
  }

  /**
   * Get field metadata
   */
  public getFieldMetadata(_fieldName: string): any {
    return null;
  }
}