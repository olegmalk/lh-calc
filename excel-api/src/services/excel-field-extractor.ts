/**
 * Excel Field Extractor Service
 * Extracts field values from uploaded Excel files for form prefilling
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';

export interface ExtractedFields {
  fields: Record<string, any>;
  warnings: string[];
  metadata: {
    sheetsFound: string[];
    fieldsExtracted: number;
    processingTimeMs: number;
  };
}

export class ExcelFieldExtractor {
  // Complete field mapping configuration
  private readonly FIELD_MAPPINGS = {
    'технолог': {
      'D27': 'tech_D27_sequenceNumber',
      'E27': 'tech_E27_customerOrderPosition',
      'F27': 'tech_F27_deliveryType',
      'G27': 'tech_G27_sizeTypeK4',
      'H27': 'tech_H27_passes',
      'I27': 'tech_I27_plateQuantity',
      'J27': 'tech_J27_calcPressureHotSide',
      'K27': 'tech_K27_calcPressureColdSide',
      'L27': 'tech_L27_calcTempHotSide',
      'M27': 'tech_M27_calcTempColdSide',
      'P27': 'tech_P27_plateMaterial',
      'Q27': 'tech_Q27_materialType',
      'R27': 'tech_R27_bodyMaterial',
      'S27': 'tech_S27_plateSurfaceType',
      'T27': 'tech_T27_drawDepth',
      'U27': 'tech_U27_plateThickness',
      'V27': 'tech_V27_claddingThickness'
    },
    'снабжение': {
      // Main parameters
      'F2': 'sup_F2_projectNumber',
      'D8': 'sup_D8_flowPartMaterialPricePerKg',
      'E8': 'sup_E8_flowPartMaterialPrice',
      'D9': 'sup_D9_bodyMaterial',
      'D10': 'sup_D10_columnCoverMaterialPrice',
      'D11': 'sup_D11_panelMaterialPrice',
      'K13': 'sup_K13_normHoursPerUnit',
      'P13': 'sup_P13_internalLogistics',
      'D17': 'sup_D17_panelCuttingCoefficient',
      'D78': 'sup_D78_stainlessSteelThickness',
      
      // Cover and Column
      'E19': 'sup_E19_coverRolledThickness',
      'E20': 'sup_E20_coverCuttingPrice',
      'E21': 'sup_E21_coverProcessingCost',
      'K19': 'sup_K19_columnRolledThickness',
      'K20': 'sup_K20_columnCuttingPrice',
      'K21': 'sup_K21_columnProcessingCost',
      
      // Panel A
      'E25': 'sup_E25_panelRolledThickness',
      'E26': 'sup_E26_panelCuttingPrice',
      'E27': 'sup_E27_panelProcessingCost',
      'F28': 'sup_F28_flange1PanelAPrice',
      'F29': 'sup_F29_flange2PanelAPrice',
      'F30': 'sup_F30_pipeBilletFlange1Price',
      'F31': 'sup_F31_pipeBilletFlange2Price',
      'F32': 'sup_F32_drainageNozzlePrice',
      'F33': 'sup_F33_ventilationNozzlePrice',
      'C28': 'sup_C28_panelAFlange1Pressure',
      'C29': 'sup_C29_panelAFlange2Pressure',
      'D28': 'sup_D28_panelAFlange1Diameter',
      'D29': 'sup_D29_panelAFlange2Diameter',
      
      // Panel B
      'K25': 'sup_K25_panelBRolledThickness',
      'K26': 'sup_K26_panelBCuttingPrice',
      'K27': 'sup_K27_panelBProcessingCost',
      'L28': 'sup_L28_panelBFlange3Price',
      'L29': 'sup_L29_panelBFlange4Price',
      'L30': 'sup_L30_panelBPipeBilletFlange3Price',
      'L31': 'sup_L31_panelBPipeBilletFlange4Price',
      'L32': 'sup_L32_panelBDrainageNozzlePrice',
      'L33': 'sup_L33_panelBVentilationNozzlePrice',
      'I28': 'sup_I28_panelBFlange3Pressure',
      'I29': 'sup_I29_panelBFlange4Pressure',
      'J28': 'sup_J28_panelBFlange3Diameter',
      'J29': 'sup_J29_panelBFlange4Diameter',
      
      // Gaskets and Studs
      'F39': 'sup_F39_spareKitsPressureReserve',
      'D38': 'sup_D38_panelGasketsPrice',
      'D43': 'sup_D43_studM24x2000Price',
      'D44': 'sup_D44_studM24x1000Price',
      'D45': 'sup_D45_studM20x2000Price',
      'D46': 'sup_D46_studM20M16x1000Price',
      'G43': 'sup_G43_nutM24DIN6330Price',
      'G44': 'sup_G44_nutM24DIN933Price',
      'G45': 'sup_G45_nutM20M16DIN933Price',
      
      // Spare parts
      'H54': 'sup_H54_spareFlangeFlange1Price',
      'H55': 'sup_H55_spareFlangeFlange2Price',
      'H56': 'sup_H56_spareFlangeFlange3Price',
      'H57': 'sup_H57_spareFlangeFlange4Price',
      'I50': 'sup_I50_sparePanelStudQuantity',
      'I51': 'sup_I51_sparePanelNutQuantity',
      'I52': 'sup_I52_sparePanelWasherQuantity',
      'I54': 'sup_I54_flangeFastenersFlange1Quantity',
      'I55': 'sup_I55_flangeFastenersFlange2Quantity',
      'I56': 'sup_I56_flangeFastenersFlange3Quantity',
      'I57': 'sup_I57_flangeFastenersFlange4Quantity',
      'M51': 'sup_M51_spareAnchorBoltsCost',
      'M52': 'sup_M52_spareOtherCost',
      'N50': 'sup_N50_sparePanelGasketsQuantity',
      'N51': 'sup_N51_spareAnchorBoltsQuantity',
      'N52': 'sup_N52_spareOtherQuantity',
      'N54': 'sup_N54_spareFlangeGasketsFlange1Quantity',
      'N55': 'sup_N55_spareFlangeGasketsFlange2Quantity',
      'N56': 'sup_N56_spareFlangeGasketsFlange3Quantity',
      'N57': 'sup_N57_spareFlangeGasketsFlange4Quantity',
      
      // Supports and Braces
      'I38': 'sup_I38_eyeboltKitMaterialCost',
      'I39': 'sup_I39_eyeboltKitProcessingCost',
      'K38': 'sup_K38_supportsKitMaterialCost',
      'K39': 'sup_K39_supportsKitProcessingCost',
      'M38': 'sup_M38_bracesKitMaterialCost',
      'M39': 'sup_M39_bracesKitProcessingCost',
      
      // Other materials
      'I44': 'sup_I44_otherMaterialsDesc1',
      'I45': 'sup_I45_otherMaterialsDesc2',
      'I46': 'sup_I46_otherMaterialsDesc3',
      'M44': 'sup_M44_otherMaterialsCost1',
      'M45': 'sup_M45_otherMaterialsCost2',
      'M46': 'sup_M46_otherMaterialsCost3',
      
      // Panel fasteners
      'P19': 'sup_P19_panelFastenersQuantity',
      'P20': 'sup_P20_panelFastenersMaterial',
      'P21': 'sup_P21_panelFastenersCoating',
      'P22': 'sup_P22_panelFastenersStudSize',
      'Q22': 'sup_Q22_panelFastenersStudCost',
      'Q23': 'sup_Q23_panelFastenersNutCost',
      'Q24': 'sup_Q24_panelFastenersWasherCost',
      'P45': 'sup_P45_unaccountedCost',
      
      // COF fasteners
      'P29': 'sup_P29_cofFastenersFlange1Size',
      'P33': 'sup_P33_cofFastenersFlange2Size',
      'P37': 'sup_P37_cofFastenersFlange3Size',
      'P41': 'sup_P41_cofFastenersFlange4Size',
      'Q29': 'sup_Q29_cofFastenersFlange1Material',
      'Q33': 'sup_Q33_cofFastenersFlange2Material',
      'Q37': 'sup_Q37_cofFastenersFlange3Material',
      'Q41': 'sup_Q41_cofFastenersFlange4Material',
      'R29': 'sup_R29_cofFastenersFlange1Coating',
      'R33': 'sup_R33_cofFastenersFlange2Coating',
      'R37': 'sup_R37_cofFastenersFlange3Coating',
      'R41': 'sup_R41_cofFastenersFlange4Coating',
      'T29': 'sup_T29_cofFastenersFlange1KitPrice',
      'T30': 'sup_T30_cofGasketFlange1Price',
      'T31': 'sup_T31_cofObturatorFlange1Price',
      'T33': 'sup_T33_cofFastenersFlange2KitPrice',
      'T34': 'sup_T34_cofGasketFlange2Price',
      'T35': 'sup_T35_cofObturatorFlange2Price',
      'T37': 'sup_T37_cofFastenersFlange3KitPrice',
      'T38': 'sup_T38_cofGasketFlange3Price',
      'T39': 'sup_T39_cofObturatorFlange3Price',
      'T41': 'sup_T41_cofFastenersFlange4KitPrice',
      'T42': 'sup_T42_cofGasketFlange4Price',
      'T43': 'sup_T43_cofObturatorFlange4Price'
    }
  };

  async extractFields(filePath: string): Promise<ExtractedFields> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const extractedFields: Record<string, any> = {};
    const sheetsFound: string[] = [];

    try {
      // Read the Excel file
      const fileBuffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(fileBuffer, { 
        type: 'buffer',
        cellDates: false,
        cellNF: false,
        cellText: false
      });

      // Process each sheet
      for (const [sheetName, cellMappings] of Object.entries(this.FIELD_MAPPINGS)) {
        if (!workbook.Sheets[sheetName]) {
          warnings.push(`Sheet "${sheetName}" not found in uploaded file`);
          continue;
        }

        sheetsFound.push(sheetName);
        const sheet = workbook.Sheets[sheetName];

        // Extract values from mapped cells
        for (const [cellRef, fieldId] of Object.entries(cellMappings)) {
          const cell = sheet[cellRef];
          if (cell && cell.v !== undefined && cell.v !== null && cell.v !== '') {
            // Convert value based on expected type
            let value = cell.v;
            
            // Handle numeric fields
            if (fieldId.includes('Price') || fieldId.includes('Cost') || 
                fieldId.includes('Quantity') || fieldId.includes('Thickness') ||
                fieldId.includes('Temperature') || fieldId.includes('Pressure') ||
                fieldId.includes('Hours') || fieldId.includes('Coefficient')) {
              value = this.parseNumericValue(value);
            } else {
              // Keep as string for text fields
              value = String(value).trim();
            }
            
            extractedFields[fieldId] = value;
          }
        }
      }

      const fieldsExtracted = Object.keys(extractedFields).length;
      
      if (fieldsExtracted === 0) {
        warnings.push('No fields could be extracted from the uploaded file');
      }

      return {
        fields: extractedFields,
        warnings,
        metadata: {
          sheetsFound,
          fieldsExtracted,
          processingTimeMs: Date.now() - startTime
        }
      };
    } catch (error) {
      throw new Error(`Failed to extract fields from Excel: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private parseNumericValue(value: any): number {
    if (typeof value === 'number') {
      return value;
    }
    
    const parsed = parseFloat(String(value).replace(',', '.').replace(/[^\d.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }

  validateFile(filePath: string): { valid: boolean; error?: string } {
    try {
      // Check file exists
      if (!fs.existsSync(filePath)) {
        return { valid: false, error: 'File not found' };
      }

      // For temporary uploaded files, we trust multer's validation
      // Just check if file exists and is not too large

      // Check file size (max 10MB)
      const stats = fs.statSync(filePath);
      if (stats.size > 10 * 1024 * 1024) {
        return { valid: false, error: 'File size exceeds 10MB limit' };
      }

      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: `Validation failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }
}