/**
 * Field Type Detection and Validation Tests
 */

import { FieldTypeDetector } from '../src/services/field-type-detector';
import { FieldValidator } from '../src/validators/field-validator';

describe('Field Type Detection', () => {
  let detector: FieldTypeDetector;

  beforeEach(() => {
    detector = new FieldTypeDetector();
  });

  describe('Type Detection from Field ID', () => {
    test('should detect currency fields', () => {
      const typeInfo = detector.detectFieldType('sup_D8_flowPartMaterialPricePerKg');
      expect(typeInfo.type).toBe('currency');
      expect(typeInfo.confidence).toBeGreaterThan(0.8);
    });

    test('should detect text fields', () => {
      const typeInfo = detector.detectFieldType('sup_F2_projectNumber');
      expect(typeInfo.type).toBe('text');
      expect(typeInfo.confidence).toBe(1.0);
    });

    test('should detect textarea fields', () => {
      const typeInfo = detector.detectFieldType('sup_I44_otherMaterialsDesc1');
      expect(typeInfo.type).toBe('textarea');
      expect(typeInfo.confidence).toBe(1.0);
    });

    test('should detect enum fields when values provided', () => {
      const enumValues = ['Option1', 'Option2', 'Option3'];
      const typeInfo = detector.detectFieldType('some_field', null, enumValues);
      expect(typeInfo.type).toBe('enum');
      expect(typeInfo.confidence).toBe(1.0);
      expect(typeInfo.enumValues).toEqual(enumValues);
    });

    test('should detect percentage fields', () => {
      const typeInfo = detector.detectFieldType('sup_D17_panelCuttingCoefficient');
      expect(typeInfo.type).toBe('percentage');
      expect(typeInfo.confidence).toBeGreaterThan(0.6);
    });

    test('should detect number fields', () => {
      const typeInfo = detector.detectFieldType('tech_I27_plateQuantity');
      expect(typeInfo.type).toBe('number');
      expect(typeInfo.confidence).toBeGreaterThan(0.6);
    });
  });

  describe('Type Detection from Value', () => {
    test('should detect email from value', () => {
      const typeInfo = detector.detectFieldType('contact_field', 'user@example.com');
      expect(typeInfo.type).toBe('email');
      expect(typeInfo.confidence).toBeGreaterThan(0.7);
    });

    test('should detect URL from value', () => {
      const typeInfo = detector.detectFieldType('website_field', 'https://example.com');
      expect(typeInfo.type).toBe('url');
      expect(typeInfo.confidence).toBeGreaterThan(0.7);
    });

    test('should detect date from value', () => {
      const typeInfo = detector.detectFieldType('created_field', '2024-01-15');
      expect(typeInfo.type).toBe('date');
      expect(typeInfo.confidence).toBeGreaterThan(0.7);
    });

    test('should detect currency from large decimal value', () => {
      const typeInfo = detector.detectFieldType('amount_field', '1234.56');
      expect(typeInfo.type).toBe('currency');
      expect(typeInfo.confidence).toBeGreaterThan(0.5);
    });

    test('should detect percentage from value with %', () => {
      const typeInfo = detector.detectFieldType('rate_field', '85%');
      expect(typeInfo.type).toBe('percentage');
      expect(typeInfo.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Value Validation', () => {
    test('should validate currency values', () => {
      const typeInfo = {
        type: 'currency' as const,
        confidence: 1,
        validation: {
          min: 0,
          decimalPlaces: 2,
          pattern: '^\\d+(\\.\\d{1,2})?$'
        }
      };

      let result = detector.validateValue('123.45', typeInfo);
      expect(result.valid).toBe(true);

      result = detector.validateValue('-50', typeInfo);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Value must be at least 0');

      result = detector.validateValue('123.456', typeInfo);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Maximum 2 decimal places allowed');
    });

    test('should validate email values', () => {
      const typeInfo = {
        type: 'email' as const,
        confidence: 1,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          maxLength: 255
        }
      };

      let result = detector.validateValue('valid@email.com', typeInfo);
      expect(result.valid).toBe(true);

      result = detector.validateValue('invalid-email', typeInfo);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid email format');
    });

    test('should validate percentage values', () => {
      const typeInfo = {
        type: 'percentage' as const,
        confidence: 1,
        validation: {
          min: 0,
          max: 100,
          pattern: '^\\d+(\\.\\d+)?$'
        }
      };

      let result = detector.validateValue('50', typeInfo);
      expect(result.valid).toBe(true);

      result = detector.validateValue('150', typeInfo);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Value must be at most 100');

      result = detector.validateValue('-10', typeInfo);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Value must be at least 0');
    });

    test('should validate enum values', () => {
      const typeInfo = {
        type: 'enum' as const,
        confidence: 1,
        enumValues: ['Option1', 'Option2', 'Option3']
      };

      let result = detector.validateValue('Option2', typeInfo);
      expect(result.valid).toBe(true);

      result = detector.validateValue('InvalidOption', typeInfo);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Value must be one of');
    });

    test('should validate text length', () => {
      const typeInfo = {
        type: 'text' as const,
        confidence: 1,
        validation: {
          maxLength: 10
        }
      };

      let result = detector.validateValue('short', typeInfo);
      expect(result.valid).toBe(true);

      result = detector.validateValue('this is a very long text', typeInfo);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Maximum length is 10 characters');
    });
  });
});

describe('Field Validator with Type Detection', () => {
  let validator: FieldValidator;

  beforeEach(() => {
    validator = new FieldValidator();
  });

  describe('Integrated Validation', () => {
    test('should validate with type detection', async () => {
      const data = {
        sup_D8_flowPartMaterialPricePerKg: '123.45',
        sup_F2_projectNumber: 'PROJ-2024',
        tech_I27_plateQuantity: '100',
        invalid_email: 'not-an-email'
      };

      const result = await validator.validate(data);
      
      expect(result.sanitizedData).toBeDefined();
      expect(result.fieldTypes).toBeDefined();
      expect(result.fieldTypes?.size).toBeGreaterThan(0);
    });

    test('should detect security issues', async () => {
      const data = {
        malicious_field: 'SELECT * FROM users; DROP TABLE users;',
        xss_field: '<script>alert("XSS")</script>'
      };

      const result = await validator.validate(data);
      
      expect(result.warnings).toHaveLength(2);
      expect(result.warnings[0].message).toContain('SQL-like keywords');
      expect(result.warnings[1].message).toContain('script injection');
    });

    test('should handle empty values correctly', async () => {
      const data = {
        empty_field: '',
        null_field: null,
        undefined_field: undefined
      };

      const result = await validator.validate(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Field Metadata', () => {
    test('should get field metadata', async () => {
      const metadata = await validator.getFieldsMetadata();
      
      expect(metadata).toBeInstanceOf(Array);
      expect(metadata.length).toBeGreaterThan(0);
      
      const currencyField = metadata.find(f => f.id === 'sup_D8_flowPartMaterialPricePerKg');
      expect(currencyField).toBeDefined();
      expect(currencyField?.type).toBe('currency');
      
      const textField = metadata.find(f => f.id === 'sup_F2_projectNumber');
      expect(textField).toBeDefined();
      expect(textField?.type).toBe('text');
    });

    test('should include validation rules in metadata', async () => {
      const metadata = await validator.getFieldsMetadata();
      
      const currencyField = metadata.find(f => f.type === 'currency');
      expect(currencyField?.validation).toBeDefined();
      expect(currencyField?.validation.min).toBe(0);
      expect(currencyField?.validation.decimalPlaces).toBe(2);
    });
  });
});