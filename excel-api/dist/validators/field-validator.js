"use strict";
/**
 * Enhanced Field Validation Framework
 * Comprehensive validation for all Excel API edge cases
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldValidator = void 0;
const joi_1 = __importDefault(require("joi"));
class FieldValidator {
    constructor() {
        this.validationRules = VALIDATION_RULES;
        this.schema = this.buildJoiSchema();
    }
    /**
     * Build Joi schema from validation rules
     */
    buildJoiSchema() {
        const schemaObj = {};
        // Engineering fields (технолог)
        schemaObj.tech_D27_type = joi_1.default.number().min(0).required();
        schemaObj.tech_E27_weightType = joi_1.default.string().pattern(/^[ЕК][-0-9А-Я*]*$/).required();
        schemaObj.tech_H27_quantityType = joi_1.default.string().pattern(/^\d+\/\d+$/).required();
        schemaObj.tech_I27_quantityType = joi_1.default.number().min(0).required();
        schemaObj.tech_J27_quantityType = joi_1.default.number().min(0).required();
        schemaObj.tech_K27_quantity = joi_1.default.number().min(0).required();
        schemaObj.tech_L27_quantity = joi_1.default.number().min(0).required();
        schemaObj.tech_M27_material = joi_1.default.number().min(0).required();
        schemaObj.tech_T27_materialThicknessType = joi_1.default.number().min(0).required();
        schemaObj.tech_V27_thicknessType = joi_1.default.number().min(0).optional();
        // Supply fields (снабжение) - Material specifications
        schemaObj.sup_D9_materialSpec = joi_1.default.string()
            .valid('06ХН28МДТ', '09Г2С', '12Х18Н10Т', '20ХН3А', '30ХМА', '40Х')
            .optional();
        // Supply fields - Prices (required numbers)
        schemaObj.sup_D8_priceMaterial = joi_1.default.number().min(0).max(1000000).required();
        schemaObj.sup_E8_priceMaterial = joi_1.default.number().min(0).max(1000000).required();
        schemaObj.sup_K13_costQuantityNormTotal = joi_1.default.number().min(1).max(10000).required();
        schemaObj.sup_P13_costQuantityMaterialNorm = joi_1.default.number().min(0).max(10000000).required();
        schemaObj.sup_D78_massThickness = joi_1.default.number().min(0).max(100).required();
        // Supply fields - Component costs
        schemaObj.sup_D43_priceTotal = joi_1.default.number().min(0).required();
        schemaObj.sup_D44_price = joi_1.default.number().min(0).required();
        schemaObj.sup_D45_price = joi_1.default.number().min(0).required();
        schemaObj.sup_D46_price = joi_1.default.number().min(0).required();
        // Material codes
        schemaObj.sup_F2_parameter = joi_1.default.string()
            .valid('0000', '06ХН28МДТ', '09Г2С', '12Х18Н10Т', '20ХН3А', '30ХМА', '40Х')
            .required();
        // Pressure ratings (optional)
        schemaObj.sup_C28_priceWeightThickness = joi_1.default.string()
            .pattern(/^Ру[0-9]+$/)
            .optional();
        schemaObj.sup_C29_priceWeightPipeThickness = joi_1.default.string()
            .pattern(/^Ру[0-9]+$/)
            .optional();
        // Diameter codes (optional)
        schemaObj.sup_D28_priceWeightThickness = joi_1.default.string()
            .pattern(/^Ду[0-9]+$/)
            .optional();
        schemaObj.sup_D29_priceWeightPipe = joi_1.default.string()
            .pattern(/^Ду[0-9]+$/)
            .optional();
        // Thread specifications (optional)
        schemaObj.sup_P22_priceQuantityMaterialTotal = joi_1.default.string()
            .pattern(/^М[0-9]+$/)
            .optional();
        schemaObj.sup_P29_priceMaterialTotal = joi_1.default.string()
            .pattern(/^М[0-9]+$/)
            .optional();
        // Surface treatments (optional)
        schemaObj.sup_P21_priceQuantityMaterial = joi_1.default.string()
            .valid('Zn-Cr 9мкм', 'ст40Х')
            .optional();
        // Add remaining fields as optional strings or numbers
        // These are less critical and can accept any valid input
        const optionalStringFields = [
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
            'sup_L33_priceWeightPipeTotalType'
        ];
        optionalStringFields.forEach(field => {
            schemaObj[field] = joi_1.default.string().allow('').optional();
        });
        const optionalNumberFields = [
            'sup_G43_priceMaterialInsulationTotal',
            'sup_G44_priceMaterialInsulation',
            'sup_G45_priceMaterialInsulation',
            'sup_H54_priceTotal',
            'sup_H55_priceTotal',
            'sup_H56_priceTotal',
            'sup_H57_priceTotal',
            'sup_I38_priceThicknessTotalType',
            'sup_I39_priceQuantityMaterialThicknessInsulationTotalType',
            'sup_K38_pricePipeTotal',
            'sup_K39_priceQuantityMaterialPipeInsulationTotal',
            'sup_M38_priceMaterialTotal',
            'sup_M39_quantityMaterialTotal',
            'sup_M44_priceMaterial',
            'sup_M45_priceMaterial',
            'sup_M46_priceQuantityMaterialSum',
            'sup_M51_priceQuantityMaterialTotalSum',
            'sup_M52_priceQuantityMaterialTotalSum'
        ];
        optionalNumberFields.forEach(field => {
            schemaObj[field] = joi_1.default.number().min(0).optional();
        });
        return joi_1.default.object(schemaObj).unknown(true); // Allow additional fields
    }
    /**
     * Validate request data
     */
    validate(data) {
        const errors = [];
        const warnings = [];
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
                    code: 'VALIDATION_ERROR'
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
    sanitizeInput(data) {
        const sanitized = {};
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
                }
                else {
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
    validateBusinessRules(data, errors, warnings) {
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
        if (data.sup_D9_materialSpec === '09Г2С' && data.tech_M27_material > 350) {
            errors.push({
                field: 'sup_D9_materialSpec',
                value: data.sup_D9_materialSpec,
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
    checkEdgeCases(data, warnings) {
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
        if (data.sup_D9_materialSpec && !data.sup_D8_priceMaterial) {
            warnings.push({
                field: 'sup_D8_priceMaterial',
                message: 'Material specified but price is missing'
            });
        }
        // Check for unicode in critical fields
        const criticalTextFields = ['tech_E27_weightType', 'sup_D9_materialSpec'];
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
    getRequiredFields() {
        return [
            'tech_D27_type',
            'tech_E27_weightType',
            'tech_H27_quantityType',
            'tech_I27_quantityType',
            'tech_J27_quantityType',
            'tech_K27_quantity',
            'tech_L27_quantity',
            'tech_M27_material',
            'tech_T27_materialThicknessType',
            'sup_F2_parameter',
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
    getFieldMetadata(fieldName) {
        // Map field names to validation rules
        const mappings = {
            'tech_D27_type': 'технолог_D27',
            'tech_E27_weightType': 'технолог_E27',
            'tech_H27_quantityType': 'технолог_H27',
            // ... add more mappings
        };
        const ruleKey = mappings[fieldName];
        return ruleKey ? this.validationRules[ruleKey] : null;
    }
}
exports.FieldValidator = FieldValidator;
//# sourceMappingURL=field-validator.js.map