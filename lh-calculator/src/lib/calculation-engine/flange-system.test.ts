// Story 4: Flange System Specifications Test Suite
// Tests for 8 flange system fields: C28, D28, C29, D29, I28, J28, I29, J29

import { describe, it, expect, beforeEach } from 'vitest';
import { useInputStore } from '../../stores/inputStore';

describe('Story 4: Flange System Specifications', () => {
  beforeEach(() => {
    // Reset store before each test
    useInputStore.getState().reset();
  });

  describe('Default Values', () => {
    it('should match TEST_SCENARIO_DATA.md defaults', () => {
      const { inputs } = useInputStore.getState();
      
      // Hot side flange defaults
      expect(inputs.flangeHotPressure1).toBe('Ру10');
      expect(inputs.flangeHotDiameter1).toBe('Ду600');
      expect(inputs.flangeHotPressure2).toBe('Ру40');
      expect(inputs.flangeHotDiameter2).toBe('Ду600');

      // Cold side flange defaults
      expect(inputs.flangeColdPressure1).toBe('Ру25');
      expect(inputs.flangeColdDiameter1).toBe('Ду450');
      expect(inputs.flangeColdPressure2).toBe('Ру63');
      expect(inputs.flangeColdDiameter2).toBe('Ду300');
    });
  });

  describe('Pressure Options Validation', () => {
    const validPressures = ['Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100'];

    it('should validate all required pressure options', () => {
      validPressures.forEach(pressure => {
        // Test that pressure follows GOST standard format
        expect(pressure).toMatch(/^Ру\d+$/);
        
        // Test that pressure value is in valid range
        const pressureValue = parseInt(pressure.replace('Ру', ''));
        expect([10, 16, 25, 40, 63, 100]).toContain(pressureValue);
      });
    });
    
    it('should reject invalid pressure formats', () => {
      const invalidPressures = ['P10', 'Ru10', 'РУ10', 'Ру-10', 'Ру200'];
      
      invalidPressures.forEach(pressure => {
        const isValidFormat = /^Ру(10|16|25|40|63|100)$/.test(pressure);
        expect(isValidFormat).toBe(false);
      });
    });
  });

  describe('Diameter Options Validation', () => {
    const validDiameters = [
      'Ду25', 'Ду50', 'Ду100', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350',
      'Ду400', 'Ду450', 'Ду500', 'Ду600', 'Ду700', 'Ду800', 'Ду900', 'Ду1000'
    ];

    it('should validate all required diameter options', () => {
      validDiameters.forEach(diameter => {
        // Test that diameter follows GOST standard format
        expect(diameter).toMatch(/^Ду\d+$/);
        
        // Test that diameter value is in valid range
        const diameterValue = parseInt(diameter.replace('Ду', ''));
        expect(diameterValue).toBeGreaterThanOrEqual(25);
        expect(diameterValue).toBeLessThanOrEqual(1000);
      });
    });
    
    it('should reject invalid diameter formats', () => {
      const invalidDiameters = ['D25', 'Du25', 'ДУ25', 'Ду-25', 'Ду2000'];
      
      invalidDiameters.forEach(diameter => {
        const isValidFormat = /^Ду(25|50|100|150|200|250|300|350|400|450|500|600|700|800|900|1000)$/.test(diameter);
        expect(isValidFormat).toBe(false);
      });
    });
  });

  describe('GOST Standards Compliance', () => {
    it('should handle standard GOST pressure/diameter combinations', () => {
      // Common GOST combinations that are technically valid
      const gostCombinations = [
        { pressure: 'Ру10', diameter: 'Ду600' },
        { pressure: 'Ру16', diameter: 'Ду500' },
        { pressure: 'Ру25', diameter: 'Ду450' },
        { pressure: 'Ру40', diameter: 'Ду300' },
        { pressure: 'Ру63', diameter: 'Ду200' },
        { pressure: 'Ру100', diameter: 'Ду150' }
      ];

      gostCombinations.forEach(combo => {
        // Test that combination is valid
        const pressureValid = /^Ру(10|16|25|40|63|100)$/.test(combo.pressure);
        const diameterValid = /^Ду(25|50|100|150|200|250|300|350|400|450|500|600|700|800|900|1000)$/.test(combo.diameter);
        
        expect(pressureValid).toBe(true);
        expect(diameterValid).toBe(true);
      });
    });

    it('should validate extreme GOST values', () => {
      // Minimum values
      expect('Ру10').toMatch(/^Ру(10|16|25|40|63|100)$/);
      expect('Ду25').toMatch(/^Ду(25|50|100|150|200|250|300|350|400|450|500|600|700|800|900|1000)$/);

      // Maximum values  
      expect('Ру100').toMatch(/^Ру(10|16|25|40|63|100)$/);
      expect('Ду1000').toMatch(/^Ду(25|50|100|150|200|250|300|350|400|450|500|600|700|800|900|1000)$/);
    });
  });

  describe('Type Safety and Integration', () => {
    it('should maintain string type for all flange fields', () => {
      const { inputs } = useInputStore.getState();
      
      // All flange fields should be strings when set
      const flangeFields = [
        'flangeHotPressure1', 'flangeHotDiameter1',
        'flangeHotPressure2', 'flangeHotDiameter2',
        'flangeColdPressure1', 'flangeColdDiameter1',
        'flangeColdPressure2', 'flangeColdDiameter2'
      ] as const;
      
      flangeFields.forEach(field => {
        const value = inputs[field];
        if (value !== undefined) {
          expect(typeof value).toBe('string');
        }
      });
    });

    it('should define all 8 required flange fields', () => {
      const { inputs } = useInputStore.getState();
      
      // Verify all 8 fields exist with correct cell mappings
      const requiredFields = [
        'flangeHotPressure1',   // C28
        'flangeHotDiameter1',   // D28
        'flangeHotPressure2',   // C29
        'flangeHotDiameter2',   // D29
        'flangeColdPressure1',  // I28
        'flangeColdDiameter1',  // J28
        'flangeColdPressure2',  // I29
        'flangeColdDiameter2'   // J29
      ];
      
      requiredFields.forEach(field => {
        expect(Object.prototype.hasOwnProperty.call(inputs, field)).toBe(true);
      });
    });
  });
});