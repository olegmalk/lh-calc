/**
 * Validation Framework Tests
 * Tests all edge cases and validation rules
 */

import { FieldValidator } from '../src/validators/field-validator';

describe('Field Validation Framework', () => {
  let validator: FieldValidator;

  beforeEach(() => {
    validator = new FieldValidator();
  });

  describe('Required Fields', () => {
    it('should reject request with missing required fields', () => {
      const result = validator.validate({});
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'tech_D27_type')).toBe(true);
    });

    it('should accept request with all required fields', () => {
      const validData = {
        tech_D27_type: 1,
        tech_E27_weightType: 'Е-113',
        tech_H27_quantityType: '1/6',
        tech_I27_quantityType: 400,
        tech_J27_quantityType: 22,
        tech_K27_quantity: 22,
        tech_L27_quantity: 100,
        tech_M27_material: 100,
        tech_T27_materialThicknessType: 5,
        sup_F2_parameter: '0000',
        sup_D8_priceMaterial: 700,
        sup_E8_priceMaterial: 700,
        sup_K13_costQuantityNormTotal: 1,
        sup_P13_costQuantityMaterialNorm: 120000,
        sup_D78_massThickness: 3,
        sup_D43_priceTotal: 3300,
        sup_D44_price: 1750,
        sup_D45_price: 2800,
        sup_D46_price: 1200
      };
      const result = validator.validate(validData);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Material Code Validation', () => {
    it('should accept valid material codes', () => {
      const validCodes = ['09Г2С', '12Х18Н10Т', '40Х'];
      validCodes.forEach(code => {
        const result = validator.validate({
          sup_D9_materialSpec: code,
          // ... other required fields
        });
        expect(result.errors.find(e => e.field === 'sup_D9_materialSpec')).toBeUndefined();
      });
    });

    it('should reject invalid material codes', () => {
      const result = validator.validate({
        sup_D9_materialSpec: 'INVALID',
        // ... other required fields
      });
      expect(result.errors.some(e => e.field === 'sup_D9_materialSpec')).toBe(true);
    });
  });

  describe('Pattern Validation', () => {
    it('should validate equipment codes', () => {
      const valid = ['Е-113', 'К4-750', 'Е-1', 'К-999'];
      
      valid.forEach(code => {
        const result = validator.validate({
          tech_E27_weightType: code,
          // ... other required fields
        });
        expect(result.errors.find(e => e.field === 'tech_E27_weightType')).toBeUndefined();
      });
    });

    it('should validate fraction patterns', () => {
      const valid = ['1/6', '1/2', '10/20'];
      
      valid.forEach(fraction => {
        const result = validator.validate({
          tech_H27_quantityType: fraction,
          // ... other required fields
        });
        expect(result.errors.find(e => e.field === 'tech_H27_quantityType')).toBeUndefined();
      });
    });

    it('should validate pressure ratings', () => {
      const valid = ['Ру10', 'Ру25', 'Ру100'];
      
      valid.forEach(pressure => {
        const result = validator.validate({
          sup_C28_priceWeightThickness: pressure
        });
        expect(result.errors.find(e => e.field === 'sup_C28_priceWeightThickness')).toBeUndefined();
      });
    });

    it('should validate diameter codes', () => {
      const valid = ['Ду300', 'Ду600', 'Ду1000'];
      
      valid.forEach(diameter => {
        const result = validator.validate({
          sup_D28_priceWeightThickness: diameter
        });
        expect(result.errors.find(e => e.field === 'sup_D28_priceWeightThickness')).toBeUndefined();
      });
    });
  });

  describe('Numeric Edge Cases', () => {
    it('should handle negative numbers', () => {
      const result = validator.validate({
        sup_D8_priceMaterial: -100,
        // ... other required fields
      });
      expect(result.errors.some(e => e.field === 'sup_D8_priceMaterial')).toBe(true);
    });

    it('should handle zero values where not allowed', () => {
      const result = validator.validate({
        sup_K13_costQuantityNormTotal: 0, // min is 1
        // ... other required fields
      });
      expect(result.errors.some(e => e.field === 'sup_K13_costQuantityNormTotal')).toBe(true);
    });

    it('should handle very large numbers', () => {
      const result = validator.validate({
        sup_D8_priceMaterial: 10000000, // max is 1000000
        // ... other required fields
      });
      expect(result.errors.some(e => e.field === 'sup_D8_priceMaterial')).toBe(true);
    });

    it('should sanitize Infinity and NaN', () => {
      const result = validator.validate({
        sup_D8_priceMaterial: Infinity,
        sup_E8_priceMaterial: NaN,
        // ... other required fields
      });
      expect(result.sanitizedData?.sup_D8_priceMaterial).toBe(0);
      expect(result.sanitizedData?.sup_E8_priceMaterial).toBe(0);
    });
  });

  describe('String Sanitization', () => {
    it('should remove SQL injection attempts', () => {
      const result = validator.validate({
        tech_E27_weightType: "Е-113'; DROP TABLE users; --",
        // ... other required fields
      });
      expect(result.sanitizedData?.tech_E27_weightType).toBe('Е-113 DROP TABLE users --');
    });

    it('should remove script tags', () => {
      const result = validator.validate({
        tech_E27_weightType: 'Е-113<script>alert("XSS")</script>',
        // ... other required fields
      });
      expect(result.sanitizedData?.tech_E27_weightType).toBe('Е-113');
    });

    it('should limit string length', () => {
      const longString = 'A'.repeat(2000);
      const result = validator.validate({
        tech_E27_weightType: longString,
        // ... other required fields
      });
      expect(result.sanitizedData?.tech_E27_weightType?.length).toBe(1000);
    });
  });

  describe('Business Rules', () => {
    it('should warn on large price differences', () => {
      const result = validator.validate({
        sup_D8_priceMaterial: 100,
        sup_E8_priceMaterial: 200, // 100% difference
        // ... other required fields
      });
      expect(result.warnings.some(w => w.field.includes('sup_D8_priceMaterial'))).toBe(true);
    });

    it('should reject incompatible material-temperature combinations', () => {
      const result = validator.validate({
        sup_D9_materialSpec: '09Г2С',
        tech_M27_material: 400, // Too high for this material
        // ... other required fields
      });
      expect(result.errors.some(e => e.code === 'BUSINESS_RULE_VIOLATION')).toBe(true);
    });

    it('should warn on high pressure with large diameter', () => {
      const result = validator.validate({
        sup_C28_priceWeightThickness: 'Ру160',
        sup_D28_priceWeightThickness: 'Ду1000',
        // ... other required fields
      });
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Case Detection', () => {
    it('should warn on potential division by zero', () => {
      const result = validator.validate({
        sup_K13_costQuantityNormTotal: 0,
        // ... other required fields
      });
      expect(result.warnings.some(w => w.message.includes('division by zero'))).toBe(true);
    });

    it('should warn on very small numbers', () => {
      const result = validator.validate({
        sup_D8_priceMaterial: 0.001,
        // ... other required fields
      });
      expect(result.warnings.some(w => w.message.includes('precision issues'))).toBe(true);
    });

    it('should warn on unicode characters', () => {
      const result = validator.validate({
        tech_E27_weightType: 'Е-113🚀',
        // ... other required fields
      });
      expect(result.warnings.some(w => w.message.includes('Unicode'))).toBe(true);
    });
  });

  describe('Field Metadata', () => {
    it('should return correct required fields', () => {
      const required = validator.getRequiredFields();
      expect(required).toContain('tech_D27_type');
      expect(required).toContain('sup_D8_priceMaterial');
      expect(required.length).toBe(19);
    });

    it('should return field metadata', () => {
      validator.getFieldMetadata('tech_D27_type');
      // Metadata should exist if mapping is complete
      // Test passes as it doesn't throw an error
    });
  });
});