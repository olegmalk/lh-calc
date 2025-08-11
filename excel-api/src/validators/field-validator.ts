/**
 * Simplified Field Validation
 * Basic validation for Excel API
 */

import Joi from 'joi';

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
  private schema: Joi.ObjectSchema;

  constructor() {
    this.schema = this.buildJoiSchema();
  }

  /**
   * Build Joi schema from validation rules
   */
  private buildJoiSchema(): Joi.ObjectSchema {
    const schemaObj: any = {};

    // Engineering fields (технолог) - GREEN cells (user inputs)
    schemaObj.tech_D27_type = Joi.number().min(0).required();
    schemaObj.tech_E27_weightType = Joi.string().required(); // Equipment code like "Е-113", "К4-750"
    schemaObj.tech_F27_quantityType = Joi.string().valid('Целый ТА', 'ШОТ-БЛОК', 'РЕИНЖ').required(); // DeliveryType enum
    schemaObj.tech_G27_quantityType = Joi.string().required(); // Equipment size like "К4-750"
    schemaObj.tech_H27_quantityType = Joi.string().pattern(/^\d+\/\d+$/).required(); // Fraction like "1/6"
    schemaObj.tech_I27_quantityType = Joi.number().min(0).required();
    schemaObj.tech_J27_quantityType = Joi.number().min(0).required();
    schemaObj.tech_K27_quantity = Joi.number().min(0).required();
    schemaObj.tech_L27_quantity = Joi.number().min(0).required();
    schemaObj.tech_M27_material = Joi.number().min(0).required();
    // Computed fields - should accept but not validate strictly (they're calculated by Excel)
    schemaObj.tech_N27_pressureTestHot = Joi.number().optional();
    schemaObj.tech_O27_pressureTestCold = Joi.number().optional();
    schemaObj.tech_P27_materialType = Joi.string().valid('AISI 316L', 'SMO 254', 'Hast-C276', 'Titanium', 'AISI 304', 'AISI316Ti', '904L').required();
    schemaObj.tech_Q27_materialType = Joi.string().optional(); // Computed from P27
    schemaObj.tech_R27_materialThicknessType = Joi.string().valid('ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti').required();
    schemaObj.tech_S27_materialThicknessType = Joi.string().valid('гофра', 'дв. лунка', 'од. лунка', 'шпилька', 'шпилька-лунка').required();
    schemaObj.tech_T27_materialThicknessType = Joi.number().min(0).required();
    schemaObj.tech_U27_materialThicknessType = Joi.number().valid(0.8, 1, 1.2, 1.5, 2, 3, 5).required();
    schemaObj.tech_V27_thicknessType = Joi.number().valid(0.8, 1, 1.2, 1.5, 2, 3, 5).required();

    // Supply fields (снабжение) - Material specifications
    schemaObj.sup_D9_priceMaterial = Joi.string()
      .valid('ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti')
      .optional();

    // Supply fields - Prices (required numbers)
    schemaObj.sup_D8_priceMaterial = Joi.number().min(0).max(1000000).required();
    schemaObj.sup_E8_priceMaterial = Joi.number().min(0).max(1000000).required();
    schemaObj.sup_K13_costQuantityNormTotal = Joi.number().min(0).max(10000).required();
    schemaObj.sup_P13_costQuantityMaterialNorm = Joi.number().min(0).max(10000000).required();
    schemaObj.sup_D78_massThickness = Joi.number().min(0).max(100).required();

    // Supply fields - Component costs
    schemaObj.sup_D43_priceTotal = Joi.number().min(0).required();
    schemaObj.sup_D44_price = Joi.number().min(0).required();
    schemaObj.sup_D45_price = Joi.number().min(0).required();
    schemaObj.sup_D46_price = Joi.number().min(0).required();

    // Project number
    schemaObj.sup_F2_projectNumber = Joi.string().required(); // Project number - no validation

    // Pressure ratings (optional)
    schemaObj.sup_C28_priceWeightThickness = Joi.string()
      .valid('Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160')
      .optional();
    schemaObj.sup_C29_priceWeightPipeThickness = Joi.string()
      .valid('Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160')
      .optional();

    // Diameter codes (optional)
    schemaObj.sup_D28_priceWeightThickness = Joi.string()
      .valid('Ду25', 'Ду32', 'Ду40', 'Ду50', 'Ду65', 'Ду80', 'Ду100', 'Ду125', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду600', 'Ду800', 'Ду1000')
      .optional();
    schemaObj.sup_D29_priceWeightPipe = Joi.string()
      .valid('Ду25', 'Ду32', 'Ду40', 'Ду50', 'Ду65', 'Ду80', 'Ду100', 'Ду125', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду600', 'Ду800', 'Ду1000')
      .optional();

    // These are actually numeric fields that can be null/empty
    schemaObj.sup_P22_priceQuantityMaterialTotal = Joi.number().allow(null).optional();
    schemaObj.sup_P29_priceMaterialTotal = Joi.number().allow(null).optional();
    schemaObj.sup_P21_priceQuantityMaterial = Joi.number().allow(null).optional();

    // These fields are actually numbers that can be null/empty - from contract analysis
    const optionalNumberFields = [
      'sup_D10_priceCostMaterial',
      'sup_D11_priceCostMaterial',
      'sup_D17_priceWeightThickness',
      'sup_D38_priceQuantityTotal',
      'sup_E20_priceWeightThicknessTotal',
      'sup_E21_priceWeightThicknessTotal',
      'sup_E26_priceWeightThickness',
      'sup_E27_priceWeightThickness',
      'sup_F28_priceWeightThicknessTotal',
      'sup_F29_priceWeightPipeTotal',
      'sup_F30_priceWeightPipeTotal',
      'sup_F31_priceWeightPipeTotal',
      'sup_F32_priceWeightPipeTotal',
      'sup_F33_priceWeightPipeTotal',
      'sup_K20_priceWeightThicknessTotal',
      'sup_K21_priceWeightThicknessTotal',
      'sup_K26_priceWeightThickness',
      'sup_K27_priceWeightThickness',
      'sup_L28_priceWeightThicknessTotalType',
      'sup_L29_priceWeightPipeTotalType',
      'sup_L30_priceWeightPipeTotalType',
      'sup_L31_priceWeightPipeTotalType',
      'sup_L32_priceWeightPipeTotalType',
      'sup_L33_priceWeightPipeTotalType',
      'sup_E19_priceWeightThicknessTotal',
      'sup_E25_priceWeightThicknessTotal',
      'sup_K19_priceWeightThicknessTotal',
      'sup_K25_priceWeightThicknessTotal',
      'sup_P19_priceQuantityMaterialThickness',
      'sup_P20_priceQuantityWeightMaterial',
      'sup_P33_priceMaterialPipeTotal',
      'sup_P37_priceMaterialTotal',
      'sup_P41_priceMaterialTotal',
      'sup_Q29_priceThickness',
      'sup_Q33_pricePipeThickness',
      'sup_Q37_priceThickness',
      'sup_Q41_priceThicknessTotal',
      'sup_R29_price',
      'sup_R33_pricePipe',
      'sup_R37_price',
      'sup_R41_priceTotal',
      'sup_I44_priceMaterialThicknessInsulationTotalType',
      'sup_I45_priceMaterialThicknessInsulationTotalType',
      'sup_I46_priceQuantityMaterialThicknessInsulationTotalSumType',
      'sup_Q22_priceQuantityMaterialThicknessTotal',
      'sup_Q23_priceMaterialThicknessTotal',
      'sup_Q24_priceThicknessTotal',
      'sup_T29_priceMaterial',
      'sup_T30_priceMaterial',
      'sup_T31_priceMaterial',
      'sup_T33_priceMaterialPipe',
      'sup_T34_priceMaterialTotal',
      'sup_T35_priceMaterialTotal',
      'sup_T37_price',
      'sup_T38_price',
      'sup_T39_priceQuantity',
      'sup_T41_priceTotal',
      'sup_T42_priceMaterialInsulationTotal',
      'sup_T43_priceTotal'
    ];

    optionalNumberFields.forEach(field => {
      schemaObj[field] = Joi.number().allow(null).optional();
    });

    // Orange cells - Engineering parameters (some are strings for flange/pressure ratings)
    schemaObj.sup_C28_priceWeightThickness = Joi.string()
      .valid('Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160')
      .optional();
    schemaObj.sup_C29_priceWeightPipeThickness = Joi.string()
      .valid('Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160')
      .optional();
    schemaObj.sup_D28_priceWeightThickness = Joi.string()
      .pattern(/^Ду\d+$/)
      .optional();
    schemaObj.sup_D29_priceWeightPipe = Joi.string()
      .pattern(/^Ду\d+$/)
      .optional();
    schemaObj.sup_I28_priceWeightThicknessType = Joi.number().allow(null).optional();
    schemaObj.sup_I29_priceWeightPipeThicknessType = Joi.number().allow(null).optional();
    schemaObj.sup_J28_priceQuantityWeightThicknessNormTotal = Joi.number().allow(null).optional();
    schemaObj.sup_J29_priceQuantityWeightPipeNormTotal = Joi.number().allow(null).optional();

    // Additional required numeric fields
    const additionalRequiredNumbers = [
      'sup_G43_priceMaterialInsulationTotal',
      'sup_G44_priceMaterialInsulation',
      'sup_G45_priceMaterialInsulation',
      'sup_H54_priceTotal',
      'sup_H55_priceTotal',
      'sup_H56_priceTotal',
      'sup_H57_priceTotal',
      'sup_I38_priceThicknessTotalType',
      'sup_I39_priceQuantityMaterialThicknessInsulationTotalType',
      'sup_I50_priceQuantityMaterialThicknessInsulationTotalSumType',
      'sup_I51_priceQuantityMaterialThicknessInsulationTotalSumType',
      'sup_I52_priceQuantityMaterialThicknessInsulationTotalSumType',
      'sup_I54_priceQuantityMaterialThicknessInsulationTotalType',
      'sup_I55_priceQuantityMaterialThicknessInsulationTotalType',
      'sup_I56_priceQuantityMaterialThicknessInsulationTotalType',
      'sup_I57_priceQuantityMaterialThicknessInsulationTotalType',
      'sup_K38_pricePipeTotal',
      'sup_K39_priceQuantityMaterialPipeInsulationTotal',
      'sup_M38_priceMaterialTotal',
      'sup_M39_quantityMaterialTotal',
      'sup_M44_priceMaterial',
      'sup_M45_priceMaterial',
      'sup_M46_priceQuantityMaterialSum',
      'sup_M51_priceQuantityMaterialTotalSum',
      'sup_M52_priceQuantityMaterialTotalSum',
      'sup_N50_priceQuantityWeightThicknessTotalSum',
      'sup_N51_priceQuantityWeightThicknessTotalSum',
      'sup_N52_priceQuantityWeightThicknessTotalSum',
      'sup_N54_quantityWeightThicknessTotal',
      'sup_N55_quantityWeightThicknessTotal',
      'sup_N56_quantityWeightThicknessTotal',
      'sup_N57_quantityWeightThicknessTotal',
      'sup_P45_priceMaterialTotal',
      'sup_F39_priceQuantityWeightMaterialInsulationTotal'
    ];

    additionalRequiredNumbers.forEach(field => {
      schemaObj[field] = Joi.number().min(0).required();
    });

    return Joi.object(schemaObj).unknown(true); // Allow additional fields
  }

  /**
   * Validate request data
   */
  public validate(data: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Sanitize input first
    const sanitized = this.sanitizeInput(data);

    // Validate with Joi
    const { error, value } = this.schema.validate(sanitized, {
      abortEarly: false,
      stripUnknown: false
    });

    if (error) {
      error.details.forEach(detail => {
        errors.push({
          field: detail.path.join('.'),
          value: detail.context?.value,
          message: detail.message,
          code: detail.type  // Preserve original Joi error type
        });
      });
    }

    // Additional business logic validation
    this.validateBusinessRules(value, errors, warnings);

    // Check for edge cases
    this.checkEdgeCases(value, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedData: value
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
   * Validate business rules
   */
  private validateBusinessRules(
    data: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    // Rule: Material price consistency
    if (data.sup_D8_priceMaterial && data.sup_E8_priceMaterial) {
      const priceDiff = Math.abs(data.sup_D8_priceMaterial - data.sup_E8_priceMaterial);
      if (priceDiff > data.sup_D8_priceMaterial * 0.5) {
        warnings.push({
          field: 'sup_D8_priceMaterial,sup_E8_priceMaterial',
          message: 'Material prices differ by more than 50%'
        });
      }
    }

    // Rule: Pressure-Diameter compatibility
    if (data.sup_C28_priceWeightThickness && data.sup_D28_priceWeightThickness) {
      const pressure = parseInt(data.sup_C28_priceWeightThickness.replace('Ру', ''));
      const diameter = parseInt(data.sup_D28_priceWeightThickness.replace('Ду', ''));
      
      if (pressure > 100 && diameter > 600) {
        warnings.push({
          field: 'sup_C28_priceWeightThickness',
          message: 'High pressure with large diameter may require special materials'
        });
      }
    }

    // Rule: Material-Temperature compatibility
    if (data.sup_D9_priceMaterial === '09Г2С' && data.tech_M27_material > 350) {
      errors.push({
        field: 'sup_D9_priceMaterial',
        value: data.sup_D9_priceMaterial,
        message: 'Material 09Г2С not suitable for temperatures above 350°C',
        code: 'BUSINESS_RULE_VIOLATION'
      });
    }

    // Rule: Quantity validation
    if (data.sup_K13_costQuantityNormTotal && data.sup_K13_costQuantityNormTotal > 100) {
      warnings.push({
        field: 'sup_K13_costQuantityNormTotal',
        message: 'Large quantity may require special pricing'
      });
    }
  }

  /**
   * Check for edge cases
   */
  private checkEdgeCases(data: any, warnings: ValidationWarning[]): void {
    // Check for potential division by zero
    if (data.sup_K13_costQuantityNormTotal === 0) {
      warnings.push({
        field: 'sup_K13_costQuantityNormTotal',
        message: 'Zero quantity may cause division by zero in calculations'
      });
    }

    // Check for very small numbers that might cause underflow
    const smallNumberFields = ['sup_D8_priceMaterial', 'sup_E8_priceMaterial'];
    smallNumberFields.forEach(field => {
      if (data[field] && data[field] < 0.01) {
        warnings.push({
          field,
          message: 'Very small value may cause calculation precision issues'
        });
      }
    });

    // Check for missing critical combinations
    if (data.sup_D9_priceMaterial && !data.sup_D8_priceMaterial) {
      warnings.push({
        field: 'sup_D8_priceMaterial',
        message: 'Material specified but price is missing'
      });
    }

    // Check for unicode in critical fields
    const criticalTextFields = ['tech_E27_weightType', 'sup_D9_priceMaterial'];
    criticalTextFields.forEach(field => {
      if (data[field] && /[^\u0000-\u007F\u0400-\u04FF]/.test(data[field])) {
        warnings.push({
          field,
          message: 'Contains non-standard Unicode characters'
        });
      }
    });
  }

  /**
   * Get required fields list
   */
  public getRequiredFields(): string[] {
    return [
      'tech_D27_type',
      'tech_E27_weightType',
      'tech_F27_quantityType',
      'tech_G27_quantityType',
      'tech_H27_quantityType',
      'tech_I27_quantityType',
      'tech_J27_quantityType',
      'tech_K27_quantity',
      'tech_L27_quantity',
      'tech_M27_material',
      'tech_P27_materialType',
      'tech_R27_materialThicknessType',
      'tech_S27_materialThicknessType',
      'tech_T27_materialThicknessType',
      'tech_U27_materialThicknessType',
      'tech_V27_thicknessType',
      'sup_F2_projectNumber',
      'sup_D8_priceMaterial',
      'sup_E8_priceMaterial',
      'sup_K13_costQuantityNormTotal',
      'sup_P13_costQuantityMaterialNorm',
      'sup_D78_massThickness',
      'sup_D43_priceTotal',
      'sup_D44_price',
      'sup_D45_price',
      'sup_D46_price'
    ];
  }

  /**
   * Get field metadata
   */
  public getFieldMetadata(_fieldName: string): any {
    // TODO: Implement field metadata lookup when needed
    return null;
  }
}