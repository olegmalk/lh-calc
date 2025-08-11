/**
 * Integration tests for number field validation
 */

import request from 'supertest';
import app from '../../src/index';

describe('Number Field Validation Integration Tests', () => {
  const server = app;

  describe('POST /api/calculate - Number validation', () => {
    test('should reject non-numeric values in number fields', async () => {
      const response = await request(server)
        .post('/api/calculate')
        .send({
          tech_I27_plateQuantity: 'not_a_number',
          tech_J27_calcPressureHotSide: 'abc123',
          tech_K27_calcPressureColdSide: 'xyz'
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_FAILED');
      
      const fieldErrors = response.body.error.details.field_errors;
      expect(fieldErrors).toBeDefined();
      expect(fieldErrors.tech_I27_plateQuantity).toContain('Value must be a number');
      expect(fieldErrors.tech_J27_calcPressureHotSide).toContain('Value must be a number');
      expect(fieldErrors.tech_K27_calcPressureColdSide).toContain('Value must be a number');
    });

    test('should reject negative numbers when min validation is set', async () => {
      const response = await request(server)
        .post('/api/calculate')
        .send({
          tech_J27_calcPressureHotSide: '-50',
          tech_K27_calcPressureColdSide: '-100',
          sup_D8_flowPartMaterialPricePerKg: '-25.50'
        });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      
      const fieldErrors = response.body.error.details.field_errors;
      expect(fieldErrors.tech_J27_calcPressureHotSide).toContain('Value must be at least 0');
      expect(fieldErrors.tech_K27_calcPressureColdSide).toContain('Value must be at least 0');
      expect(fieldErrors.sup_D8_flowPartMaterialPricePerKg).toContain('Value must be at least 0');
    });

    test('should accept valid numeric strings', async () => {
      const response = await request(server)
        .post('/api/calculate')
        .send({
          tech_I27_plateQuantity: '100',
          tech_J27_calcPressureHotSide: '25',
          tech_K27_calcPressureColdSide: '30.5'
        });

      expect(response.status).toBe(422); // Will still fail due to missing required fields
      
      // But should not have validation errors for these specific fields
      const fieldErrors = response.body.error.details.field_errors || {};
      expect(fieldErrors.tech_I27_plateQuantity).toBeUndefined();
      expect(fieldErrors.tech_J27_calcPressureHotSide).toBeUndefined();
      expect(fieldErrors.tech_K27_calcPressureColdSide).toBeUndefined();
    });

    test('should validate currency fields with decimal places', async () => {
      const response = await request(server)
        .post('/api/calculate')
        .send({
          sup_D8_flowPartMaterialPricePerKg: '123.456', // Too many decimal places for currency
          sup_E8_flowPartMaterialPrice: '456.78' // Valid currency format
        });

      expect(response.status).toBe(422);
      
      const fieldErrors = response.body.error.details.field_errors || {};
      // Currency allows up to 2 decimal places
      expect(fieldErrors.sup_D8_flowPartMaterialPricePerKg).toContain('Maximum 2 decimal places allowed');
      expect(fieldErrors.sup_E8_flowPartMaterialPrice).toBeUndefined();
    });

    test('should handle empty/null/undefined values correctly', async () => {
      const response = await request(server)
        .post('/api/calculate')
        .send({
          tech_I27_plateQuantity: '',
          tech_J27_calcPressureHotSide: null,
          tech_K27_calcPressureColdSide: undefined
        });

      expect(response.status).toBe(422);
      
      // Empty values should not trigger number validation errors unless required
      const fieldErrors = response.body.error.details.field_errors || {};
      
      // These fields are optional, so empty values should be allowed
      expect(fieldErrors.tech_I27_plateQuantity).toBeUndefined();
      expect(fieldErrors.tech_J27_calcPressureHotSide).toBeUndefined();
      expect(fieldErrors.tech_K27_calcPressureColdSide).toBeUndefined();
    });

    test('should handle special numeric edge cases', async () => {
      const response = await request(server)
        .post('/api/calculate')
        .send({
          tech_I27_plateQuantity: 'Infinity',
          tech_J27_calcPressureHotSide: 'NaN',
          tech_K27_calcPressureColdSide: '1e10',
          sup_D8_flowPartMaterialPricePerKg: '0.00000001'
        });

      expect(response.status).toBe(422);
      
      const fieldErrors = response.body.error.details.field_errors || {};
      
      // Infinity and NaN should be rejected
      expect(fieldErrors.tech_I27_plateQuantity).toContain('Value must be a number');
      expect(fieldErrors.tech_J27_calcPressureHotSide).toContain('Value must be a number');
      
      // Scientific notation should be accepted
      expect(fieldErrors.tech_K27_calcPressureColdSide).toBeUndefined();
      
      // Very small decimals should trigger decimal place validation for currency
      expect(fieldErrors.sup_D8_flowPartMaterialPricePerKg).toContain('Maximum 2 decimal places allowed');
    });

    test('should validate percentage fields (0-100 range)', async () => {
      const response = await request(server)
        .post('/api/calculate')
        .send({
          sup_D17_panelCuttingCoefficient: '150', // Over 100
        });

      expect(response.status).toBe(422);
      
      const fieldErrors = response.body.error.details.field_errors || {};
      expect(fieldErrors.sup_D17_panelCuttingCoefficient).toContain('Value must be at most 100');
    });

    test('should handle mixed valid and invalid values', async () => {
      const response = await request(server)
        .post('/api/calculate')
        .send({
          // Valid values
          tech_I27_plateQuantity: '100',
          sup_E8_flowPartMaterialPrice: '250.50',
          
          // Invalid values
          tech_J27_calcPressureHotSide: 'not_a_number',
          tech_K27_calcPressureColdSide: '-50',
          sup_D8_flowPartMaterialPricePerKg: '123.456789'
        });

      expect(response.status).toBe(422);
      
      const fieldErrors = response.body.error.details.field_errors || {};
      
      // Valid fields should not have errors
      expect(fieldErrors.tech_I27_plateQuantity).toBeUndefined();
      expect(fieldErrors.sup_E8_flowPartMaterialPrice).toBeUndefined();
      
      // Invalid fields should have appropriate errors
      expect(fieldErrors.tech_J27_calcPressureHotSide).toContain('Value must be a number');
      expect(fieldErrors.tech_K27_calcPressureColdSide).toContain('Value must be at least 0');
      expect(fieldErrors.sup_D8_flowPartMaterialPricePerKg).toContain('Maximum 2 decimal places allowed');
    });

    test('should provide clear error messages for common mistakes', async () => {
      const testCases = [
        { value: '1,000', field: 'tech_I27_plateQuantity', expectedError: 'Value must be a number' }, // Comma separator
        { value: '$100', field: 'sup_D8_flowPartMaterialPricePerKg', expectedError: 'Value must be a number' }, // Currency symbol
        { value: '100%', field: 'tech_J27_calcPressureHotSide', expectedError: 'Value must be a number' }, // Percentage symbol
        { value: '10..5', field: 'tech_K27_calcPressureColdSide', expectedError: 'Value must be a number' }, // Double decimal
        { value: '10-20', field: 'tech_I27_plateQuantity', expectedError: 'Value must be a number' }, // Range
        { value: '1 000', field: 'tech_J27_calcPressureHotSide', expectedError: 'Value must be a number' }, // Space separator
      ];

      for (const testCase of testCases) {
        const response = await request(server)
          .post('/api/calculate')
          .send({
            [testCase.field]: testCase.value
          });

        expect(response.status).toBe(422);
        const fieldErrors = response.body.error.details.field_errors || {};
        expect(fieldErrors[testCase.field]).toContain(testCase.expectedError);
      }
    });
  });

  describe('GET /api/fields/metadata - Field type information', () => {
    test('should correctly identify number fields', async () => {
      const response = await request(server)
        .get('/api/fields/metadata');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const fields = response.body.fields;
      
      // Check that quantity fields are detected as numbers
      const plateQuantityField = fields.find((f: any) => f.id === 'tech_I27_plateQuantity');
      expect(plateQuantityField).toBeDefined();
      expect(plateQuantityField.type).toBe('number');
      expect(plateQuantityField.validation.min).toBe(0);
      
      // Check that price fields are detected as currency
      const priceField = fields.find((f: any) => f.id === 'sup_D8_flowPartMaterialPricePerKg');
      expect(priceField).toBeDefined();
      expect(priceField.type).toBe('currency');
      expect(priceField.validation.min).toBe(0);
      expect(priceField.validation.decimalPlaces).toBe(2);
      
      // Check that coefficient fields are detected as percentage
      const coefficientField = fields.find((f: any) => f.id === 'sup_D17_panelCuttingCoefficient');
      expect(coefficientField).toBeDefined();
      expect(coefficientField.type).toBe('percentage');
      expect(coefficientField.validation.min).toBe(0);
      expect(coefficientField.validation.max).toBe(100);
    });
  });
});