/**
 * Field Validation with Dynamic Enum Rules
 * Validates fields against rules extracted from Excel template
 */

import { ExcelValidationExtractor, ExtractedValidationRules } from '../services/excel-validation-extractor';

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
  private validationExtractor: ExcelValidationExtractor;
  private validationRules: ExtractedValidationRules | null = null;
  private lastRulesFetch: number = 0;
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor() {
    this.validationExtractor = new ExcelValidationExtractor();
  }

  /**
   * Get validation rules with caching
   */
  private async getValidationRules(): Promise<ExtractedValidationRules> {
    const now = Date.now();
    
    // Use cached rules if available and not expired
    if (this.validationRules && (now - this.lastRulesFetch) < this.CACHE_TTL) {
      return this.validationRules;
    }

    // Fetch new rules
    try {
      this.validationRules = await this.validationExtractor.getValidationRules();
      this.lastRulesFetch = now;
      return this.validationRules;
    } catch (error) {
      console.error('[FieldValidator] Failed to get validation rules:', error);
      // Return empty rules as fallback
      return {
        extractedAt: new Date().toISOString(),
        templatePath: ''
      };
    }
  }

  /**
   * Validate request data with dynamic enum validation
   */
  public async validate(data: any): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Get current validation rules
    const rules = await this.getValidationRules();
    
    // Sanitize input
    const sanitized = this.sanitizeInput(data);
    
    // Validate enum fields
    for (const [field, value] of Object.entries(sanitized)) {
      if (rules[field] && Array.isArray(rules[field])) {
        // This field has enum validation
        const allowedValues = rules[field] as string[];
        
        if (value && !allowedValues.includes(String(value))) {
          errors.push({
            field,
            value,
            message: `Value must be one of: ${allowedValues.join(', ')}`,
            code: 'enum.invalid'
          });
        }
      }
      
      // Add warnings for deprecated patterns
      if (typeof value === 'string') {
        // Warn about potential issues
        if (value.includes('SELECT') || value.includes('DROP')) {
          warnings.push({
            field,
            message: 'Value contains SQL-like keywords'
          });
        }
        
        if (value.length > 500) {
          warnings.push({
            field,
            message: `Value is very long (${value.length} characters)`
          });
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
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
   * Get required fields list - empty since validation is optional
   */
  public getRequiredFields(): string[] {
    return [];
  }

  /**
   * Get field metadata including enum values
   */
  public async getFieldMetadata(fieldName: string): Promise<any> {
    const rules = await this.getValidationRules();
    
    if (rules[fieldName]) {
      return {
        field: fieldName,
        type: 'enum',
        values: rules[fieldName]
      };
    }
    
    return null;
  }

  /**
   * Get all fields with enum validation
   */
  public async getEnumFields(): Promise<{ [field: string]: string[] }> {
    const rules = await this.getValidationRules();
    const enumFields: { [field: string]: string[] } = {};
    
    for (const [field, values] of Object.entries(rules)) {
      if (field !== 'extractedAt' && field !== 'templatePath' && Array.isArray(values)) {
        enumFields[field] = values as string[];
      }
    }
    
    return enumFields;
  }

  /**
   * Clear validation cache
   */
  public clearCache(): void {
    this.validationRules = null;
    this.lastRulesFetch = 0;
  }
}