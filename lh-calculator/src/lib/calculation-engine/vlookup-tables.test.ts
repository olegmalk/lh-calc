import { describe, it, expect } from 'vitest';
import { 
  EQUIPMENT_TABLE, 
  MATERIAL_DENSITIES, 
  vlookup, 
  getMaterialDensity,
  isValidEquipmentType,
  isValidMaterial,
  ALL_EQUIPMENT_TYPES,
  ALL_MATERIALS 
} from './vlookup-tables';

describe('VLOOKUP Tables', () => {
  describe('Equipment Table', () => {
    it('should contain all 12 equipment types', () => {
      expect(ALL_EQUIPMENT_TYPES).toHaveLength(12);
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-150');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-300');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-500');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-750');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-1000');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-1200');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-600*300');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-600*600');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-800*400');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-800*800');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-1000*500');
      expect(ALL_EQUIPMENT_TYPES).toContain('К4-1200*600');
    });

    it('should have correct К4-750 data from research', () => {
      const k4_750 = EQUIPMENT_TABLE['К4-750'];
      
      // Basic dimensions
      expect(k4_750.type).toBe('К4-750');
      expect(k4_750.baseLength).toBe(713);
      expect(k4_750.baseWidth).toBe(698);
      expect(k4_750.length).toBe(732);
      expect(k4_750.width).toBe(715);
      expect(k4_750.thickness).toBe(3);
      
      // Component masses (from COMPLETE_VLOOKUP_STRUCTURE.md)
      expect(k4_750.componentL).toBe(29.625648);    // Column L
      expect(k4_750.componentO).toBe(27.346752);    // Column O  
      expect(k4_750.componentR).toBe(43.6640256);   // Column R
      expect(k4_750.componentAB).toBe(9.0266976);   // Column AB
      expect(k4_750.componentAE).toBe(9.021024);    // Column AE
      expect(k4_750.componentAH).toBe(92.22890688); // Column AH
      expect(k4_750.componentAK).toBe(91.9960056);  // Column AK
      
      // Mass totals
      expect(k4_750.totalBA).toBe(171.95);     // BA: Total 3mm package
      expect(k4_750.totalBB).toBe(31.2384);    // BB: Total 3mm cladding
      expect(k4_750.totalBC).toBe(171.95);     // BC: Total 3mm reinforcement
      expect(k4_750.totalBD).toBe(1165.15);    // BD: Total 1mm components
      
      // Cost factors
      expect(k4_750.factorM78).toBe(26);
      expect(k4_750.factorN78).toBe(8);
      expect(k4_750.factorO78).toBe(60);
      expect(k4_750.factorP78).toBe(8);
      
      // Spacer specifications
      expect(k4_750.spacerBE).toBe(14);        // BE: Распорка горизонтальная А
      expect(k4_750.lengthBG).toBe(732);       // BG: Длина горизонтальной А
      expect(k4_750.lengthBH).toBe(730);       // BH: Длина горизонтальной Б
      expect(k4_750.nutBI).toBe(44);           // BI: Гайка DIN933
    });
  });

  describe('Material Densities', () => {
    it('should contain all 7 materials from research', () => {
      expect(ALL_MATERIALS).toHaveLength(7);
      expect(ALL_MATERIALS).toContain('AISI 316L');
      expect(ALL_MATERIALS).toContain('SMO 254');
      expect(ALL_MATERIALS).toContain('Hastelloy C-276');
      expect(ALL_MATERIALS).toContain('Титан ВТ1-0');
      expect(ALL_MATERIALS).toContain('AISI 304');
      expect(ALL_MATERIALS).toContain('AISI 316Ti');
      expect(ALL_MATERIALS).toContain('904L');
    });

    it('should have correct density values from research', () => {
      expect(MATERIAL_DENSITIES['AISI 316L']).toBe(0.00788);
      expect(MATERIAL_DENSITIES['SMO 254']).toBe(0.00808);
      expect(MATERIAL_DENSITIES['Hastelloy C-276']).toBe(0.00889);
      expect(MATERIAL_DENSITIES['Титан ВТ1-0']).toBe(0.0045);
      expect(MATERIAL_DENSITIES['AISI 304']).toBe(0.0074);
      expect(MATERIAL_DENSITIES['AISI 316Ti']).toBe(0.00786);
      expect(MATERIAL_DENSITIES['904L']).toBe(0.00806);
    });
  });

  describe('VLOOKUP Helper Function', () => {
    it('should return correct values for К4-750', () => {
      expect(vlookup('К4-750', 'type')).toBe('К4-750');
      expect(vlookup('К4-750', 'length')).toBe(732);
      expect(vlookup('К4-750', 'width')).toBe(715);
      expect(vlookup('К4-750', 'thickness')).toBe(3);
      expect(vlookup('К4-750', 'componentL')).toBe(29.625648);
      expect(vlookup('К4-750', 'totalBA')).toBe(171.95);
      expect(vlookup('К4-750', 'totalBD')).toBe(1165.15);
    });

    it('should throw error for invalid equipment type', () => {
      expect(() => vlookup('К4-INVALID', 'length')).toThrow('Equipment type К4-INVALID not found');
    });
  });

  describe('Material Density Helper', () => {
    it('should return correct density for valid materials', () => {
      expect(getMaterialDensity('AISI 316L')).toBe(0.00788);
      expect(getMaterialDensity('AISI 304')).toBe(0.0074);
      expect(getMaterialDensity('Титан ВТ1-0')).toBe(0.0045);
    });

    it('should throw error for invalid material', () => {
      expect(() => getMaterialDensity('INVALID-MATERIAL')).toThrow('Material density for INVALID-MATERIAL not found');
    });
  });

  describe('Validation Helpers', () => {
    it('should validate equipment types correctly', () => {
      expect(isValidEquipmentType('К4-750')).toBe(true);
      expect(isValidEquipmentType('К4-150')).toBe(true);
      expect(isValidEquipmentType('К4-INVALID')).toBe(false);
    });

    it('should validate materials correctly', () => {
      expect(isValidMaterial('AISI 316L')).toBe(true);
      expect(isValidMaterial('904L')).toBe(true);
      expect(isValidMaterial('INVALID-MATERIAL')).toBe(false);
    });
  });

  describe('Data Integrity', () => {
    it('should have all equipment with complete data structure', () => {
      Object.entries(EQUIPMENT_TABLE).forEach(([type, equipment]) => {
        expect(equipment.type).toBe(type);
        expect(typeof equipment.baseLength).toBe('number');
        expect(typeof equipment.baseWidth).toBe('number');
        expect(typeof equipment.length).toBe('number');
        expect(typeof equipment.width).toBe('number');
        expect(typeof equipment.thickness).toBe('number');
        expect(typeof equipment.componentL).toBe('number');
        expect(typeof equipment.componentO).toBe('number');
        expect(typeof equipment.componentR).toBe('number');
        expect(typeof equipment.componentAB).toBe('number');
        expect(typeof equipment.componentAE).toBe('number');
        expect(typeof equipment.componentAH).toBe('number');
        expect(typeof equipment.componentAK).toBe('number');
        expect(typeof equipment.totalBA).toBe('number');
        expect(typeof equipment.totalBB).toBe('number');
        expect(typeof equipment.totalBC).toBe('number');
        expect(typeof equipment.totalBD).toBe('number');
        expect(typeof equipment.factorM78).toBe('number');
        expect(typeof equipment.factorN78).toBe('number');
        expect(typeof equipment.factorO78).toBe('number');
        expect(typeof equipment.factorP78).toBe('number');
        expect(typeof equipment.spacerBE).toBe('number');
        expect(typeof equipment.spacerBF).toBe('number');
        expect(typeof equipment.lengthBG).toBe('number');
        expect(typeof equipment.lengthBH).toBe('number');
        expect(typeof equipment.nutBI).toBe('number');
      });
    });

    it('should have all materials with positive density values', () => {
      Object.entries(MATERIAL_DENSITIES).forEach(([_material, density]) => {
        expect(density).toBeGreaterThan(0);
        expect(density).toBeLessThan(0.01); // Reasonable upper bound for metal densities in this scale
      });
    });
  });
});