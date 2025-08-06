import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalculationEngineV2 } from './engine-v2';
import type { HeatExchangerInput } from './types';

// Mock file system operations for export testing
global.Blob = vi.fn((content, options) => ({
  content,
  type: options?.type,
  size: content[0]?.length || 0,
})) as any;

global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('Export Functionality End-to-End Tests', () => {
  let engine: CalculationEngineV2;
  
  beforeEach(() => {
    engine = new CalculationEngineV2();
    vi.clearAllMocks();
  });

  describe('Export Data Structure', () => {
    it('should generate complete export data for Bitrix24', () => {
      const input: HeatExchangerInput = {
        equipmentType: 'К4-750',
        modelCode: 'К4-750',
        plateConfiguration: '1/6',
        plateCount: 400,
        pressureA: 100,
        pressureB: 100,
        temperatureA: 80,
        temperatureB: 60,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 304',
        surfaceType: 'Гладкая',
        componentsA: 5,
        componentsB: 1,
        plateThickness: 3,
      };
      
      const result = engine.calculate(input);
      
      // Verify export data structure
      expect(result.exportData).toBeDefined();
      expect(result.exportData.equipment).toEqual({
        type: 'К4-750',
        plateCount: 400,
        configuration: '1/6',
      });
      
      expect(result.exportData.materials).toEqual({
        plate: 'AISI 316L',
        body: 'AISI 304',
        surface: 'Гладкая',
      });
      
      expect(result.exportData.parameters).toEqual({
        pressureA: 100,
        pressureB: 100,
        temperatureA: 80,
        temperatureB: 60,
      });
      
      expect(result.exportData.costs).toBeDefined();
      expect(result.exportData.totalCost).toBe(result.totalCost);
      expect(result.exportData.version).toBe('2.0.0');
      expect(result.exportData.calculatedAt).toBeDefined();
      expect(result.exportData.excelRow).toBe(118); // Row for К4-750
    });

    it('should include all 53 calculations in export', () => {
      const input: HeatExchangerInput = {
        equipmentType: 'К4-500',
        modelCode: 'К4-500',
        plateConfiguration: '1/4',
        plateCount: 300,
        pressureA: 75,
        pressureB: 75,
        temperatureA: 70,
        temperatureB: 50,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 304',
        surfaceType: 'Гладкая',
        componentsA: 4,
        componentsB: 1,
        plateThickness: 2.5,
      };
      
      const result = engine.calculate(input);
      
      // Should have all calculations
      const calculations = result.exportData.calculations;
      expect(Object.keys(calculations).length).toBeGreaterThanOrEqual(53);
      
      // Verify key calculations are present
      expect(calculations.G_ComponentsCount).toBeDefined();
      expect(calculations.H_CoverArea).toBeDefined();
      expect(calculations.BI_TotalComponents).toBeDefined();
      
      // All values should be numbers
      Object.values(calculations).forEach(value => {
        expect(typeof value).toBe('number');
        expect(isFinite(value)).toBe(true);
      });
    });
  });

  describe('Excel Export Format', () => {
    it('should format data for Excel export', () => {
      const input: HeatExchangerInput = {
        equipmentType: 'К4-150',
        modelCode: 'К4-150',
        plateConfiguration: '1/6',
        plateCount: 100,
        pressureA: 50,
        pressureB: 50,
        temperatureA: 60,
        temperatureB: 40,
        materialPlate: 'AISI 304',
        materialBody: 'AISI 304',
        surfaceType: 'Гладкая',
        componentsA: 3,
        componentsB: 1,
        plateThickness: 2,
      };
      
      const result = engine.calculate(input);
      const exportData = result.exportData;
      
      // Create Excel-like structure
      const excelData = {
        'Технолог': {
          'Типоразмер': exportData.equipment.type,
          'Количество пластин': exportData.equipment.plateCount,
          'Конфигурация': exportData.equipment.configuration,
          'Давление A': exportData.parameters.pressureA,
          'Давление B': exportData.parameters.pressureB,
          'Температура A': exportData.parameters.temperatureA,
          'Температура B': exportData.parameters.temperatureB,
          'Материал пластин': exportData.materials.plate,
          'Материал корпуса': exportData.materials.body,
        },
        'Снабжение': exportData.calculations,
        'Результат': {
          'Итоговая стоимость': exportData.totalCost,
          'Стоимость крышек': exportData.costs.covers,
          'Стоимость колонн': exportData.costs.columns,
          'Стоимость панелей A': exportData.costs.panelsA,
          'Стоимость панелей B': exportData.costs.panelsB,
          'Стоимость крепежа': exportData.costs.fasteners,
          'Стоимость фланцев': exportData.costs.flanges,
          'Стоимость прокладок': exportData.costs.gaskets,
          'Стоимость материалов': exportData.costs.materials,
          'Итого компоненты': exportData.costs.total,
        },
      };
      
      // Verify structure matches Excel format
      expect(excelData['Технолог']['Типоразмер']).toBe('К4-150');
      expect(excelData['Результат']['Итоговая стоимость']).toBeGreaterThan(0);
      expect(Object.keys(excelData['Снабжение']).length).toBeGreaterThanOrEqual(53);
    });

    it('should handle different equipment types for Excel mapping', () => {
      const equipmentTypes = [
        { type: 'К4-150', row: 110 },
        { type: 'К4-300', row: 112 },
        { type: 'К4-500', row: 114 },
        { type: 'К4-750', row: 118 },
        { type: 'К4-1200', row: 121 },
      ];
      
      equipmentTypes.forEach(({ type, row }) => {
        const input: HeatExchangerInput = {
          equipmentType: type,
          modelCode: type,
          plateConfiguration: '1/6',
          plateCount: 200,
          pressureA: 60,
          pressureB: 60,
          temperatureA: 70,
          temperatureB: 50,
          materialPlate: 'AISI 316L',
          materialBody: 'AISI 304',
          surfaceType: 'Гладкая',
          componentsA: 4,
          componentsB: 1,
          plateThickness: 2.5,
        };
        
        const result = engine.calculate(input);
        
        // Verify correct Excel row mapping
        expect(result.exportData.excelRow).toBe(row);
        expect(result.exportData.equipment.type).toBe(type);
      });
    });
  });

  describe('JSON Export Format', () => {
    it('should serialize to valid JSON', () => {
      const input: HeatExchangerInput = {
        equipmentType: 'К4-500',
        modelCode: 'К4-500',
        plateConfiguration: '2/3',
        plateCount: 350,
        pressureA: 90,
        pressureB: 85,
        temperatureA: 75,
        temperatureB: 55,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 316L',
        surfaceType: 'Рифленая',
        componentsA: 5,
        componentsB: 2,
        plateThickness: 3.5,
      };
      
      const result = engine.calculate(input);
      
      // Convert to JSON and back
      const jsonString = JSON.stringify(result.exportData);
      const parsed = JSON.parse(jsonString);
      
      // Verify data integrity after serialization
      expect(parsed.equipment.type).toBe('К4-500');
      expect(parsed.totalCost).toBe(result.totalCost);
      expect(parsed.calculations.G_ComponentsCount).toBe(2);
      expect(parsed.version).toBe('2.0.0');
      
      // Check date is ISO string
      expect(new Date(parsed.calculatedAt).toISOString()).toBe(parsed.calculatedAt);
    });

    it('should handle special characters in JSON export', () => {
      const input: HeatExchangerInput = {
        equipmentType: 'К4-1200*600',
        modelCode: 'К4-1200*600',
        plateConfiguration: '3/4',
        plateCount: 600,
        pressureA: 150,
        pressureB: 140,
        temperatureA: 110,
        temperatureB: 90,
        materialPlate: '12Х18Н10Т',
        materialBody: '09Г2С',
        surfaceType: 'Шеврон',
        componentsA: 7,
        componentsB: 2,
        plateThickness: 4,
      };
      
      const result = engine.calculate(input);
      const jsonString = JSON.stringify(result.exportData);
      
      // Verify special characters are preserved
      expect(jsonString).toContain('К4-1200*600');
      expect(jsonString).toContain('12Х18Н10Т');
      expect(jsonString).toContain('09Г2С');
      
      // Parse and verify
      const parsed = JSON.parse(jsonString);
      expect(parsed.equipment.type).toBe('К4-1200*600');
      expect(parsed.materials.plate).toBe('12Х18Н10Т');
      expect(parsed.materials.body).toBe('09Г2С');
    });
  });

  describe('CSV Export Format', () => {
    it('should generate CSV-compatible data', () => {
      const input: HeatExchangerInput = {
        equipmentType: 'К4-300',
        modelCode: 'К4-300',
        plateConfiguration: '1/3',
        plateCount: 150,
        pressureA: 55,
        pressureB: 55,
        temperatureA: 65,
        temperatureB: 45,
        materialPlate: 'AISI 304',
        materialBody: 'Ст3',
        surfaceType: 'Гладкая',
        componentsA: 3,
        componentsB: 1,
        plateThickness: 2,
      };
      
      const result = engine.calculate(input);
      const exportData = result.exportData;
      
      // Create CSV rows
      const csvRows = [
        ['Parameter', 'Value'],
        ['Equipment Type', exportData.equipment.type],
        ['Plate Count', exportData.equipment.plateCount.toString()],
        ['Configuration', exportData.equipment.configuration],
        ['Pressure A (bar)', exportData.parameters.pressureA.toString()],
        ['Pressure B (bar)', exportData.parameters.pressureB.toString()],
        ['Temperature A (°C)', exportData.parameters.temperatureA.toString()],
        ['Temperature B (°C)', exportData.parameters.temperatureB.toString()],
        ['Plate Material', exportData.materials.plate],
        ['Body Material', exportData.materials.body],
        ['Surface Type', exportData.materials.surface],
        ['Total Cost (RUB)', exportData.totalCost.toString()],
        ['Calculated At', exportData.calculatedAt],
      ];
      
      // Convert to CSV string
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      // Verify CSV content
      expect(csvContent).toContain('Equipment Type,К4-300');
      expect(csvContent).toContain('Plate Count,150');
      expect(csvContent).toContain('Total Cost (RUB)');
      expect(csvContent.split('\n').length).toBe(13);
    });

    it('should escape special characters in CSV', () => {
      const input: HeatExchangerInput = {
        equipmentType: 'К4-500*250',
        modelCode: 'К4-500*250',
        plateConfiguration: '1/2',
        plateCount: 250,
        pressureA: 70,
        pressureB: 70,
        temperatureA: 72,
        temperatureB: 52,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 304',
        surfaceType: 'Гофра, микс',
        componentsA: 4,
        componentsB: 1,
        plateThickness: 2.8,
      };
      
      const result = engine.calculate(input);
      const exportData = result.exportData;
      
      // Escape values with commas
      const escapeCSV = (value: string) => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };
      
      const csvRows = [
        ['Surface Type', escapeCSV(exportData.materials.surface)],
      ];
      
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      
      // Verify escaped value
      expect(csvContent).toContain('"Гофра, микс"');
    });
  });

  describe('Bitrix24 Integration Format', () => {
    it('should format data for Bitrix24 API', () => {
      const input: HeatExchangerInput = {
        equipmentType: 'К4-600',
        modelCode: 'К4-600',
        plateConfiguration: '1/4',
        plateCount: 320,
        pressureA: 85,
        pressureB: 80,
        temperatureA: 78,
        temperatureB: 58,
        materialPlate: 'AISI 316L',
        materialBody: 'AISI 316L',
        surfaceType: 'Турбулизатор',
        componentsA: 5,
        componentsB: 1,
        plateThickness: 3.2,
      };
      
      const result = engine.calculate(input);
      
      // Format for Bitrix24 smart process
      const bitrix24Data = {
        fields: {
          TITLE: `Расчет ${result.exportData.equipment.type} - ${new Date().toLocaleDateString('ru-RU')}`,
          UF_EQUIPMENT_TYPE: result.exportData.equipment.type,
          UF_PLATE_COUNT: result.exportData.equipment.plateCount,
          UF_CONFIGURATION: result.exportData.equipment.configuration,
          UF_PRESSURE_A: result.exportData.parameters.pressureA,
          UF_PRESSURE_B: result.exportData.parameters.pressureB,
          UF_TEMPERATURE_A: result.exportData.parameters.temperatureA,
          UF_TEMPERATURE_B: result.exportData.parameters.temperatureB,
          UF_MATERIAL_PLATE: result.exportData.materials.plate,
          UF_MATERIAL_BODY: result.exportData.materials.body,
          UF_SURFACE_TYPE: result.exportData.materials.surface,
          UF_TOTAL_COST: result.exportData.totalCost,
          UF_CALCULATION_DATA: JSON.stringify(result.exportData.calculations),
          UF_COST_BREAKDOWN: JSON.stringify(result.exportData.costs),
          UF_CALCULATED_AT: result.exportData.calculatedAt,
        },
      };
      
      // Verify Bitrix24 format
      expect(bitrix24Data.fields.TITLE).toContain('К4-600');
      expect(bitrix24Data.fields.UF_EQUIPMENT_TYPE).toBe('К4-600');
      expect(bitrix24Data.fields.UF_TOTAL_COST).toBeGreaterThan(0);
      expect(typeof bitrix24Data.fields.UF_CALCULATION_DATA).toBe('string');
      expect(typeof bitrix24Data.fields.UF_COST_BREAKDOWN).toBe('string');
      
      // Verify JSON fields are parseable
      const calculations = JSON.parse(bitrix24Data.fields.UF_CALCULATION_DATA);
      expect(calculations.G_ComponentsCount).toBeDefined();
      
      const costs = JSON.parse(bitrix24Data.fields.UF_COST_BREAKDOWN);
      expect(costs.total).toBeDefined();
    });

    it('should handle all equipment variants for Bitrix24', () => {
      const allEquipmentTypes = [
        'К4-150', 'К4-200', 'К4-300', 'К4-400', 'К4-500',
        'К4-500*250', 'К4-600', 'К4-600*300', 'К4-750',
        'К4-1000*500', 'К4-1000', 'К4-1200', 'К4-1200*600',
      ];
      
      allEquipmentTypes.forEach(type => {
        const input: HeatExchangerInput = {
          equipmentType: type,
          modelCode: type,
          plateConfiguration: '1/6',
          plateCount: 200,
          pressureA: 60,
          pressureB: 60,
          temperatureA: 70,
          temperatureB: 50,
          materialPlate: 'AISI 316L',
          materialBody: 'AISI 304',
          surfaceType: 'Гладкая',
          componentsA: 4,
          componentsB: 1,
          plateThickness: 2.5,
        };
        
        const result = engine.calculate(input);
        
        // Verify export data is complete for each type
        expect(result.exportData).toBeDefined();
        expect(result.exportData.equipment.type).toBe(type);
        expect(result.exportData.totalCost).toBeGreaterThan(0);
        expect(result.exportData.calculations).toBeDefined();
        expect(Object.keys(result.exportData.calculations).length).toBeGreaterThanOrEqual(53);
      });
    });
  });
});