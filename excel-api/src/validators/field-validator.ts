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
    schemaObj.tech_D27_sequenceNumber = Joi.number().min(0).required();
    schemaObj.tech_E27_customerOrderPosition = Joi.string().required(); // Equipment code like "Е-113", "К4-750"
    schemaObj.tech_F27_deliveryType = Joi.string().valid('Целый ТА', 'ШОТ-БЛОК', 'РЕИНЖ').required(); // DeliveryType enum
    schemaObj.tech_G27_sizeTypeK4 = Joi.string().required(); // Equipment size like "К4-750"
    schemaObj.tech_H27_passes = Joi.string().pattern(/^\d+\/\d+$/).required(); // Fraction like "1/6"
    schemaObj.tech_I27_plateQuantity = Joi.number().min(0).required();
    schemaObj.tech_J27_calcPressureHotSide = Joi.number().min(0).required();
    schemaObj.tech_K27_calcPressureColdSide = Joi.number().min(0).required();
    schemaObj.tech_L27_calcTempHotSide = Joi.number().min(0).required();
    schemaObj.tech_M27_calcTempColdSide = Joi.number().min(0).required();
    // Computed fields - should accept but not validate strictly (they're calculated by Excel)
    schemaObj.tech_N27_pressureTestHot = Joi.number().optional();
    schemaObj.tech_O27_pressureTestCold = Joi.number().optional();
    schemaObj.tech_P27_plateMaterial = Joi.string().valid('AISI 316L', 'SMO 254', 'Hast-C276', 'Titanium', 'AISI 304', 'AISI316Ti', '904L').required();
    schemaObj.tech_Q27_materialType = Joi.string().optional(); // Computed from P27
    schemaObj.tech_R27_bodyMaterial = Joi.string().valid('ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti').required();
    schemaObj.tech_S27_plateSurfaceType = Joi.string().valid('гофра', 'дв. лунка', 'од. лунка', 'шпилька', 'шпилька-лунка').required();
    schemaObj.tech_T27_drawDepth = Joi.number().min(0).required();
    schemaObj.tech_U27_plateThickness = Joi.number().valid(0.8, 1, 1.2, 1.5, 2, 3, 5).required();
    schemaObj.tech_V27_claddingThickness = Joi.number().valid(0.8, 1, 1.2, 1.5, 2, 3, 5).required();

    // Supply fields (снабжение) - Material specifications
    schemaObj.sup_D9_bodyMaterial = Joi.string()
      .valid('ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti')
      .optional();

    // Supply fields - Prices (required numbers)
    schemaObj.sup_D8_flowPartMaterialPricePerKg = Joi.number().min(0).max(1000000).required();
    schemaObj.sup_E8_flowPartMaterialPrice = Joi.number().min(0).max(1000000).required();
    schemaObj.sup_K13_normHoursPerUnit = Joi.number().min(0).max(10000).required();
    schemaObj.sup_P13_internalLogistics = Joi.number().min(0).max(10000000).required();
    schemaObj.sup_D78_stainlessSteelThickness = Joi.number().min(0).max(100).required();

    // Supply fields - Component costs
    schemaObj.sup_D43_studM24x2000Price = Joi.number().min(0).required();
    schemaObj.sup_D44_studM24x1000Price = Joi.number().min(0).required();
    schemaObj.sup_D45_studM20x2000Price = Joi.number().min(0).required();
    schemaObj.sup_D46_studM20M16x1000Price = Joi.number().min(0).required();

    // Project number
    schemaObj.sup_F2_projectNumber = Joi.string().required(); // Project number - no validation

    // Pressure ratings (optional)
    schemaObj.sup_C28_panelAFlange1Pressure = Joi.string()
      .valid('Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160')
      .optional();
    schemaObj.sup_C29_panelAFlange2Pressure = Joi.string()
      .valid('Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160')
      .optional();

    // Diameter codes (optional)
    schemaObj.sup_D28_panelAFlange1Diameter = Joi.string()
      .valid('Ду25', 'Ду32', 'Ду40', 'Ду50', 'Ду65', 'Ду80', 'Ду100', 'Ду125', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду600', 'Ду800', 'Ду1000')
      .optional();
    schemaObj.sup_D29_panelAFlange2Diameter = Joi.string()
      .valid('Ду25', 'Ду32', 'Ду40', 'Ду50', 'Ду65', 'Ду80', 'Ду100', 'Ду125', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду600', 'Ду800', 'Ду1000')
      .optional();

    // These are actually numeric fields that can be null/empty
    schemaObj.sup_P22_panelFastenersStudSize = Joi.number().allow(null).optional();
    schemaObj.sup_P29_cofFastenersFlange1Size = Joi.number().allow(null).optional();
    schemaObj.sup_P21_panelFastenersCoating = Joi.number().allow(null).optional();

    // These fields are actually numbers that can be null/empty - from contract analysis
    const optionalNumberFields = [
      'sup_D10_columnCoverMaterialPrice',
      'sup_D11_panelMaterialPrice',
      'sup_D17_panelCuttingCoefficient',
      'sup_D38_panelGasketsPrice',
      'sup_E20_coverCuttingPrice',
      'sup_E21_coverProcessingCost',
      'sup_E26_panelCuttingPrice',
      'sup_E27_panelProcessingCost',
      'sup_F28_flange1PanelAPrice',
      'sup_F29_flange2PanelAPrice',
      'sup_F30_pipeBilletFlange1Price',
      'sup_F31_pipeBilletFlange2Price',
      'sup_F32_drainageNozzlePrice',
      'sup_F33_ventilationNozzlePrice',
      'sup_K20_columnCuttingPrice',
      'sup_K21_columnProcessingCost',
      'sup_K26_panelBCuttingPrice',
      'sup_K27_panelBProcessingCost',
      'sup_L28_panelBFlange3Price',
      'sup_L29_panelBFlange4Price',
      'sup_L30_panelBPipeBilletFlange3Price',
      'sup_L31_panelBPipeBilletFlange4Price',
      'sup_L32_panelBDrainageNozzlePrice',
      'sup_L33_panelBVentilationNozzlePrice',
      'sup_E19_coverRolledThickness',
      'sup_E25_panelRolledThickness',
      'sup_K19_columnRolledThickness',
      'sup_K25_panelBRolledThickness',
      'sup_P19_panelFastenersQuantity',
      'sup_P20_panelFastenersMaterial',
      'sup_P33_cofFastenersFlange2Size',
      'sup_P37_cofFastenersFlange3Size',
      'sup_P41_cofFastenersFlange4Size',
      'sup_Q29_cofFastenersFlange1Material',
      'sup_Q33_cofFastenersFlange2Material',
      'sup_Q37_cofFastenersFlange3Material',
      'sup_Q41_cofFastenersFlange4Material',
      'sup_R29_cofFastenersFlange1Coating',
      'sup_R33_cofFastenersFlange2Coating',
      'sup_R37_cofFastenersFlange3Coating',
      'sup_R41_cofFastenersFlange4Coating',
      'sup_I44_otherMaterialsDesc1',
      'sup_I45_otherMaterialsDesc2',
      'sup_I46_otherMaterialsDesc3',
      'sup_Q22_panelFastenersStudCost',
      'sup_Q23_panelFastenersNutCost',
      'sup_Q24_panelFastenersWasherCost',
      'sup_T29_cofFastenersFlange1KitPrice',
      'sup_T30_cofGasketFlange1Price',
      'sup_T31_cofObturatorFlange1Price',
      'sup_T33_cofFastenersFlange2KitPrice',
      'sup_T34_cofGasketFlange2Price',
      'sup_T35_cofObturatorFlange2Price',
      'sup_T37_cofFastenersFlange3KitPrice',
      'sup_T38_cofGasketFlange3Price',
      'sup_T39_cofObturatorFlange3Price',
      'sup_T41_cofFastenersFlange4KitPrice',
      'sup_T42_cofGasketFlange4Price',
      'sup_T43_cofObturatorFlange4Price'
    ];

    optionalNumberFields.forEach(field => {
      schemaObj[field] = Joi.number().allow(null).optional();
    });

    // Orange cells - Engineering parameters (some are strings for flange/pressure ratings)
    schemaObj.sup_C28_panelAFlange1Pressure = Joi.string()
      .valid('Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160')
      .optional();
    schemaObj.sup_C29_panelAFlange2Pressure = Joi.string()
      .valid('Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160')
      .optional();
    schemaObj.sup_D28_panelAFlange1Diameter = Joi.string()
      .pattern(/^Ду\d+$/)
      .optional();
    schemaObj.sup_D29_panelAFlange2Diameter = Joi.string()
      .pattern(/^Ду\d+$/)
      .optional();
    schemaObj.sup_I28_panelBFlange3Pressure = Joi.number().allow(null).optional();
    schemaObj.sup_I29_panelBFlange4Pressure = Joi.number().allow(null).optional();
    schemaObj.sup_J28_panelBFlange3Diameter = Joi.number().allow(null).optional();
    schemaObj.sup_J29_panelBFlange4Diameter = Joi.number().allow(null).optional();

    // Additional required numeric fields
    const additionalRequiredNumbers = [
      'sup_G43_nutM24DIN6330Price',
      'sup_G44_nutM24DIN933Price',
      'sup_G45_nutM20M16DIN933Price',
      'sup_H54_spareFlangeFlange1Price',
      'sup_H55_spareFlangeFlange2Price',
      'sup_H56_spareFlangeFlange3Price',
      'sup_H57_spareFlangeFlange4Price',
      'sup_I38_eyeboltKitMaterialCost',
      'sup_I39_eyeboltKitProcessingCost',
      'sup_I50_sparePanelStudQuantity',
      'sup_I51_sparePanelNutQuantity',
      'sup_I52_sparePanelWasherQuantity',
      'sup_I54_flangeFastenersFlange1Quantity',
      'sup_I55_flangeFastenersFlange2Quantity',
      'sup_I56_flangeFastenersFlange3Quantity',
      'sup_I57_flangeFastenersFlange4Quantity',
      'sup_K38_supportsKitMaterialCost',
      'sup_K39_supportsKitProcessingCost',
      'sup_M38_bracesKitMaterialCost',
      'sup_M39_bracesKitProcessingCost',
      'sup_M44_otherMaterialsCost1',
      'sup_M45_otherMaterialsCost2',
      'sup_M46_otherMaterialsCost3',
      'sup_M51_spareAnchorBoltsCost',
      'sup_M52_spareOtherCost',
      'sup_N50_sparePanelGasketsQuantity',
      'sup_N51_spareAnchorBoltsQuantity',
      'sup_N52_spareOtherQuantity',
      'sup_N54_spareFlangeGasketsFlange1Quantity',
      'sup_N55_spareFlangeGasketsFlange2Quantity',
      'sup_N56_spareFlangeGasketsFlange3Quantity',
      'sup_N57_spareFlangeGasketsFlange4Quantity',
      'sup_P45_unaccountedCost',
      'sup_F39_spareKitsPressureReserve'
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
    if (data.sup_D8_flowPartMaterialPricePerKg && data.sup_E8_flowPartMaterialPrice) {
      const priceDiff = Math.abs(data.sup_D8_flowPartMaterialPricePerKg - data.sup_E8_flowPartMaterialPrice);
      if (priceDiff > data.sup_D8_flowPartMaterialPricePerKg * 0.5) {
        warnings.push({
          field: 'sup_D8_priceMaterial,sup_E8_priceMaterial',
          message: 'Material prices differ by more than 50%'
        });
      }
    }

    // Rule: Pressure-Diameter compatibility
    if (data.sup_C28_panelAFlange1Pressure && data.sup_D28_panelAFlange1Diameter) {
      const pressure = parseInt(data.sup_C28_panelAFlange1Pressure.replace('Ру', ''));
      const diameter = parseInt(data.sup_D28_panelAFlange1Diameter.replace('Ду', ''));
      
      if (pressure > 100 && diameter > 600) {
        warnings.push({
          field: 'sup_C28_panelAFlange1Pressure',
          message: 'High pressure with large diameter may require special materials'
        });
      }
    }

    // Rule: Material-Temperature compatibility
    if (data.sup_D9_bodyMaterial === '09Г2С' && data.tech_M27_calcTempColdSide > 350) {
      errors.push({
        field: 'sup_D9_bodyMaterial',
        value: data.sup_D9_bodyMaterial,
        message: 'Material 09Г2С not suitable for temperatures above 350°C',
        code: 'BUSINESS_RULE_VIOLATION'
      });
    }

    // Rule: Quantity validation
    if (data.sup_K13_normHoursPerUnit && data.sup_K13_normHoursPerUnit > 100) {
      warnings.push({
        field: 'sup_K13_normHoursPerUnit',
        message: 'Large quantity may require special pricing'
      });
    }
  }

  /**
   * Check for edge cases
   */
  private checkEdgeCases(data: any, warnings: ValidationWarning[]): void {
    // Check for potential division by zero
    if (data.sup_K13_normHoursPerUnit === 0) {
      warnings.push({
        field: 'sup_K13_normHoursPerUnit',
        message: 'Zero quantity may cause division by zero in calculations'
      });
    }

    // Check for very small numbers that might cause underflow
    const smallNumberFields = ['sup_D8_flowPartMaterialPricePerKg', 'sup_E8_flowPartMaterialPrice'];
    smallNumberFields.forEach(field => {
      if (data[field] && data[field] < 0.01) {
        warnings.push({
          field,
          message: 'Very small value may cause calculation precision issues'
        });
      }
    });

    // Check for missing critical combinations
    if (data.sup_D9_bodyMaterial && !data.sup_D8_flowPartMaterialPricePerKg) {
      warnings.push({
        field: 'sup_D8_flowPartMaterialPricePerKg',
        message: 'Material specified but price is missing'
      });
    }

    // Check for unicode in critical fields
    const criticalTextFields = ['tech_E27_customerOrderPosition', 'sup_D9_bodyMaterial'];
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
      'tech_D27_sequenceNumber',
      'tech_E27_customerOrderPosition',
      'tech_F27_deliveryType',
      'tech_G27_sizeTypeK4',
      'tech_H27_passes',
      'tech_I27_plateQuantity',
      'tech_J27_calcPressureHotSide',
      'tech_K27_calcPressureColdSide',
      'tech_L27_calcTempHotSide',
      'tech_M27_calcTempColdSide',
      'tech_P27_plateMaterial',
      'tech_R27_bodyMaterial',
      'tech_S27_plateSurfaceType',
      'tech_T27_drawDepth',
      'tech_U27_plateThickness',
      'tech_V27_claddingThickness',
      'sup_F2_projectNumber',
      'sup_D8_flowPartMaterialPricePerKg',
      'sup_E8_flowPartMaterialPrice',
      'sup_K13_normHoursPerUnit',
      'sup_P13_internalLogistics',
      'sup_D78_stainlessSteelThickness',
      'sup_D43_studM24x2000Price',
      'sup_D44_studM24x1000Price',
      'sup_D45_studM20x2000Price',
      'sup_D46_studM20M16x1000Price'
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