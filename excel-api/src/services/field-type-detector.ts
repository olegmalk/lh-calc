/**
 * Field Type Detection Service
 * Automatically detects field types based on patterns and metadata
 */

export type FieldType = 'text' | 'number' | 'enum' | 'date' | 'email' | 'url' | 'percentage' | 'currency' | 'textarea' | 'boolean';

export interface FieldTypeInfo {
  type: FieldType;
  confidence: number; // 0-1 confidence score
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    maxLength?: number;
    required?: boolean;
    decimalPlaces?: number;
  };
  format?: string;
  enumValues?: string[];
}

export class FieldTypeDetector {
  // Pattern-based type detection rules
  private readonly typePatterns: Array<{
    pattern: RegExp;
    type: FieldType;
    confidence: number;
  }> = [
    // Currency patterns
    { pattern: /price|cost|amount|sum|total|payment/i, type: 'currency', confidence: 0.9 },
    
    // Date patterns
    { pattern: /date|time|deadline|created|updated|expired/i, type: 'date', confidence: 0.9 },
    
    // Email patterns
    { pattern: /email|mail|contact/i, type: 'email', confidence: 0.8 },
    
    // URL patterns
    { pattern: /url|link|website|site/i, type: 'url', confidence: 0.8 },
    
    // Percentage patterns
    { pattern: /percent|percentage|rate|ratio|coefficient/i, type: 'percentage', confidence: 0.7 },
    
    // Number patterns
    { pattern: /quantity|count|number|amount|hours|thickness|diameter|pressure|temperature|weight/i, type: 'number', confidence: 0.7 },
    
    // Textarea patterns
    { pattern: /description|desc|comment|note|text|message/i, type: 'textarea', confidence: 0.6 },
    
    // Boolean patterns
    { pattern: /is_|has_|enabled|disabled|active|confirmed/i, type: 'boolean', confidence: 0.8 },
  ];

  // Field-specific overrides based on exact field IDs
  private readonly fieldOverrides: Map<string, FieldType> = new Map([
    // Supply sheet currency fields
    ['sup_D8_flowPartMaterialPricePerKg', 'currency'],
    ['sup_E8_flowPartMaterialPrice', 'currency'],
    ['sup_D10_columnCoverMaterialPrice', 'currency'],
    ['sup_D11_panelMaterialPrice', 'currency'],
    ['sup_P13_internalLogistics', 'currency'],
    ['sup_E20_coverCuttingPrice', 'currency'],
    ['sup_E21_coverProcessingCost', 'currency'],
    ['sup_E26_panelCuttingPrice', 'currency'],
    ['sup_E27_panelProcessingCost', 'currency'],
    
    // Text description fields
    ['sup_I44_otherMaterialsDesc1', 'textarea'],
    ['sup_I45_otherMaterialsDesc2', 'textarea'],
    ['sup_I46_otherMaterialsDesc3', 'textarea'],
    
    // Project identifier
    ['sup_F2_projectNumber', 'text'],
    
    // Technical specifications
    ['tech_D27_type', 'text'],
    ['tech_E27_weightType', 'text'],
    ['tech_G27_sizeTypeK4', 'text'],
  ]);

  /**
   * Detect field type based on field ID and metadata
   */
  public detectFieldType(
    fieldId: string, 
    currentValue?: any,
    enumValues?: string[]
  ): FieldTypeInfo {
    // Check if field has enum values
    if (enumValues && enumValues.length > 0) {
      return {
        type: 'enum',
        confidence: 1.0,
        enumValues
      };
    }

    // Check field-specific overrides
    if (this.fieldOverrides.has(fieldId)) {
      return {
        type: this.fieldOverrides.get(fieldId)!,
        confidence: 1.0,
        validation: this.getDefaultValidation(this.fieldOverrides.get(fieldId)!)
      };
    }

    // Pattern-based detection
    let bestMatch: { type: FieldType; confidence: number } | null = null;
    
    for (const rule of this.typePatterns) {
      if (rule.pattern.test(fieldId)) {
        if (!bestMatch || rule.confidence > bestMatch.confidence) {
          bestMatch = { type: rule.type, confidence: rule.confidence };
        }
      }
    }

    // Value-based detection
    if (currentValue !== undefined && currentValue !== null && currentValue !== '') {
      const valueType = this.detectTypeFromValue(currentValue);
      if (valueType) {
        // Combine with pattern-based confidence
        const combinedConfidence = bestMatch 
          ? (bestMatch.confidence + valueType.confidence) / 2
          : valueType.confidence;
        
        return {
          type: valueType.type,
          confidence: combinedConfidence,
          validation: this.getDefaultValidation(valueType.type)
        };
      }
    }

    // Return best match or default to text
    if (bestMatch) {
      return {
        type: bestMatch.type,
        confidence: bestMatch.confidence,
        validation: this.getDefaultValidation(bestMatch.type)
      };
    }

    // Default to text type
    return {
      type: 'text',
      confidence: 0.3,
      validation: { maxLength: 1000 }
    };
  }

  /**
   * Detect type from value
   */
  private detectTypeFromValue(value: any): { type: FieldType; confidence: number } | null {
    const stringValue = String(value);

    // Email pattern
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
      return { type: 'email', confidence: 0.9 };
    }

    // URL pattern
    if (/^https?:\/\/[^\s]+$/.test(stringValue)) {
      return { type: 'url', confidence: 0.9 };
    }

    // Date patterns
    if (/^\d{4}-\d{2}-\d{2}/.test(stringValue) || /^\d{2}\/\d{2}\/\d{4}/.test(stringValue)) {
      return { type: 'date', confidence: 0.8 };
    }

    // Currency pattern (with currency symbol)
    if (/^[₽$€£¥]\s*[\d,]+\.?\d*$/.test(stringValue) || /^[\d,]+\.?\d*\s*[₽$€£¥]$/.test(stringValue)) {
      return { type: 'currency', confidence: 0.8 };
    }

    // Percentage pattern
    if (/^\d+\.?\d*%$/.test(stringValue)) {
      return { type: 'percentage', confidence: 0.9 };
    }

    // Number check
    if (!isNaN(Number(stringValue)) && stringValue.trim() !== '') {
      // Check if it looks like currency (large numbers)
      if (Number(stringValue) > 100 && stringValue.includes('.') && stringValue.split('.')[1].length === 2) {
        return { type: 'currency', confidence: 0.6 };
      }
      return { type: 'number', confidence: 0.7 };
    }

    // Boolean patterns
    if (/^(true|false|yes|no|да|нет|1|0)$/i.test(stringValue)) {
      return { type: 'boolean', confidence: 0.8 };
    }

    // Long text suggests textarea
    if (stringValue.length > 100 || stringValue.includes('\n')) {
      return { type: 'textarea', confidence: 0.7 };
    }

    return null;
  }

  /**
   * Get default validation rules for a field type
   */
  private getDefaultValidation(type: FieldType): any {
    switch (type) {
      case 'currency':
        return {
          min: 0,
          decimalPlaces: 2,
          pattern: '^\\d+(\\.\\d{1,2})?$'
        };
      
      case 'percentage':
        return {
          min: 0,
          max: 100,
          pattern: '^\\d+(\\.\\d+)?$'
        };
      
      case 'number':
        return {
          min: 0,
          pattern: '^-?\\d+(\\.\\d+)?$'
        };
      
      case 'email':
        return {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          maxLength: 255
        };
      
      case 'url':
        return {
          pattern: '^https?:\\/\\/.+$',
          maxLength: 2000
        };
      
      case 'date':
        return {
          pattern: '^\\d{4}-\\d{2}-\\d{2}',
          format: 'YYYY-MM-DD'
        };
      
      case 'textarea':
        return {
          maxLength: 5000
        };
      
      case 'text':
        return {
          maxLength: 1000
        };
      
      case 'boolean':
        return {
          pattern: '^(true|false|yes|no|да|нет|1|0)$'
        };
      
      default:
        return {};
    }
  }

  /**
   * Get all fields with their detected types
   */
  public async detectAllFieldTypes(
    fields: Array<{ id: string; value?: any }>,
    enumFields: { [field: string]: string[] }
  ): Promise<Map<string, FieldTypeInfo>> {
    const fieldTypes = new Map<string, FieldTypeInfo>();

    for (const field of fields) {
      const enumValues = enumFields[field.id];
      const typeInfo = this.detectFieldType(field.id, field.value, enumValues);
      fieldTypes.set(field.id, typeInfo);
    }

    return fieldTypes;
  }

  /**
   * Validate value against detected type
   */
  public validateValue(value: any, typeInfo: FieldTypeInfo): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (value === null || value === undefined || value === '') {
      if (typeInfo.validation?.required) {
        errors.push('Field is required');
      }
      return { valid: errors.length === 0, errors };
    }

    const stringValue = String(value);

    switch (typeInfo.type) {
      case 'enum':
        if (typeInfo.enumValues && !typeInfo.enumValues.includes(stringValue)) {
          errors.push(`Value must be one of: ${typeInfo.enumValues.join(', ')}`);
        }
        break;

      case 'email':
        if (typeInfo.validation?.pattern && !new RegExp(typeInfo.validation.pattern).test(stringValue)) {
          errors.push('Invalid email format');
        }
        break;

      case 'url':
        if (typeInfo.validation?.pattern && !new RegExp(typeInfo.validation.pattern).test(stringValue)) {
          errors.push('Invalid URL format');
        }
        break;

      case 'date':
        if (typeInfo.validation?.pattern && !new RegExp(typeInfo.validation.pattern).test(stringValue)) {
          errors.push(`Invalid date format. Expected: ${typeInfo.format || 'YYYY-MM-DD'}`);
        }
        break;

      case 'number':
      case 'currency':
      case 'percentage':
        const numValue = Number(stringValue);
        if (isNaN(numValue)) {
          errors.push('Value must be a number');
        } else {
          if (typeInfo.validation?.min !== undefined && numValue < typeInfo.validation.min) {
            errors.push(`Value must be at least ${typeInfo.validation.min}`);
          }
          if (typeInfo.validation?.max !== undefined && numValue > typeInfo.validation.max) {
            errors.push(`Value must be at most ${typeInfo.validation.max}`);
          }
          if (typeInfo.validation?.decimalPlaces !== undefined) {
            const decimals = stringValue.split('.')[1]?.length || 0;
            if (decimals > typeInfo.validation.decimalPlaces) {
              errors.push(`Maximum ${typeInfo.validation.decimalPlaces} decimal places allowed`);
            }
          }
        }
        break;

      case 'text':
      case 'textarea':
        if (typeInfo.validation?.maxLength && stringValue.length > typeInfo.validation.maxLength) {
          errors.push(`Maximum length is ${typeInfo.validation.maxLength} characters`);
        }
        if (typeInfo.validation?.pattern && !new RegExp(typeInfo.validation.pattern).test(stringValue)) {
          errors.push('Value does not match required pattern');
        }
        break;

      case 'boolean':
        if (typeInfo.validation?.pattern && !new RegExp(typeInfo.validation.pattern, 'i').test(stringValue)) {
          errors.push('Value must be true/false, yes/no, or 1/0');
        }
        break;
    }

    return { valid: errors.length === 0, errors };
  }
}