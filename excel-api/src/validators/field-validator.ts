/**
 * Field Validation with Dynamic Enum Rules and Type Detection
 * Validates fields against rules extracted from Excel template and field types
 */

import { ExcelValidationExtractor, ExtractedValidationRules } from '../services/excel-validation-extractor';
import { FieldTypeDetector, FieldTypeInfo, FieldType } from '../services/field-type-detector';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  sanitizedData?: any;
  fieldTypes?: Map<string, FieldTypeInfo>;
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
  private fieldTypeDetector: FieldTypeDetector;
  private validationRules: ExtractedValidationRules | null = null;
  private lastRulesFetch: number = 0;
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor() {
    this.validationExtractor = new ExcelValidationExtractor();
    this.fieldTypeDetector = new FieldTypeDetector();
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
   * Validate request data with dynamic enum validation and type checking
   */
  public async validate(data: any): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const fieldTypes = new Map<string, FieldTypeInfo>();
    
    // Get current validation rules
    const rules = await this.getValidationRules();
    
    // Build enum fields map
    const enumFields: { [field: string]: string[] } = {};
    for (const [field, values] of Object.entries(rules)) {
      if (field !== 'extractedAt' && field !== 'templatePath' && Array.isArray(values)) {
        enumFields[field] = values as string[];
      }
    }
    
    // Sanitize input
    const sanitized = this.sanitizeInput(data);
    
    // Validate each field
    for (const [field, value] of Object.entries(sanitized)) {
      // Detect field type
      const typeInfo = this.fieldTypeDetector.detectFieldType(field, value, enumFields[field]);
      fieldTypes.set(field, typeInfo);
      
      // Skip validation for null/undefined/empty values unless required
      if (value === null || value === undefined || value === '') {
        if (typeInfo.validation?.required) {
          errors.push({
            field,
            value,
            message: 'Field is required',
            code: 'required'
          });
        }
        continue;
      }
      
      // Type-based validation
      const validationResult = this.fieldTypeDetector.validateValue(value, typeInfo);
      if (!validationResult.valid) {
        validationResult.errors.forEach(errorMsg => {
          errors.push({
            field,
            value,
            message: errorMsg,
            code: `${typeInfo.type}.invalid`
          });
        });
      }
      
      // Add warnings for low confidence type detection
      if (typeInfo.confidence < 0.5) {
        warnings.push({
          field,
          message: `Field type detection confidence is low (${Math.round(typeInfo.confidence * 100)}%)`
        });
      }
      
      // Security warnings
      if (typeof value === 'string') {
        if (value.includes('SELECT') || value.includes('DROP') || value.includes('DELETE')) {
          warnings.push({
            field,
            message: 'Value contains SQL-like keywords'
          });
        }
        
        if (value.includes('<script') || value.includes('javascript:')) {
          warnings.push({
            field,
            message: 'Value contains potential script injection'
          });
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedData: sanitized,
      fieldTypes
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
   * Get field types for all fields
   */
  public async getFieldTypes(fieldIds: string[]): Promise<Map<string, FieldTypeInfo>> {
    const enumFields = await this.getEnumFields();
    const fieldTypes = new Map<string, FieldTypeInfo>();
    
    for (const fieldId of fieldIds) {
      const typeInfo = this.fieldTypeDetector.detectFieldType(fieldId, undefined, enumFields[fieldId]);
      fieldTypes.set(fieldId, typeInfo);
    }
    
    return fieldTypes;
  }

  /**
   * Get complete field metadata including type and validation
   */
  public async getFieldsMetadata(): Promise<Array<{
    id: string;
    type: FieldType;
    validation?: any;
    enumValues?: string[];
    confidence: number;
  }>> {
    // Get all possible field IDs from a representative set
    const sampleFields = [
      // Supply fields
      'sup_F2_projectNumber',
      'sup_D8_flowPartMaterialPricePerKg',
      'sup_E8_flowPartMaterialPrice',
      'sup_D9_bodyMaterial',
      'sup_D10_columnCoverMaterialPrice',
      'sup_I44_otherMaterialsDesc1',
      'sup_P20_panelFastenersMaterial',
      'sup_P22_panelFastenersStudSize',
      'sup_F39_spareKitsPressureReserve',
      // Tech fields
      'tech_D27_type',
      'tech_E27_weightType',
      'tech_G27_sizeTypeK4',
      'tech_H27_quantityType',
      'tech_P27_plateMaterial',
      'tech_Q27_materialType',
      'tech_R27_bodyMaterial',
      'tech_S27_plateSurfaceType',
      'tech_U27_plateThickness',
      'tech_V27_claddingThickness',
      'tech_F27_deliveryType',
      // Add more representative fields as needed
    ];

    const enumFields = await this.getEnumFields();
    const metadata: Array<any> = [];

    // Process all known fields
    const allFieldIds = new Set<string>();
    
    // Add enum fields
    Object.keys(enumFields).forEach(field => allFieldIds.add(field));
    
    // Add sample fields
    sampleFields.forEach(field => allFieldIds.add(field));

    for (const fieldId of allFieldIds) {
      const typeInfo = this.fieldTypeDetector.detectFieldType(fieldId, undefined, enumFields[fieldId]);
      metadata.push({
        id: fieldId,
        type: typeInfo.type,
        validation: typeInfo.validation,
        enumValues: typeInfo.enumValues,
        confidence: typeInfo.confidence
      });
    }

    return metadata;
  }

  /**
   * Clear validation cache
   */
  public clearCache(): void {
    this.validationRules = null;
    this.lastRulesFetch = 0;
  }
}