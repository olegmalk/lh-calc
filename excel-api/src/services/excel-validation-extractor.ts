/**
 * Excel Validation Rule Extractor
 * Extracts dropdown validation rules from Excel template at runtime
 */

import * as fs from 'fs/promises';
import AdmZip from 'adm-zip';
import { parseStringPromise } from 'xml2js';

export interface ValidationRule {
  cells: string[];
  values: string[];
  fieldName: string;
}

export interface ExtractedValidationRules {
  [key: string]: string[] | string;
  extractedAt: string;
  templatePath: string;
}

export class ExcelValidationExtractor {
  private cache: ExtractedValidationRules | null = null;
  private readonly cacheFilePath: string;
  private readonly templatePath: string;

  constructor(
    templatePath: string = '/home/vmuser/dev/lh_calc/calc.xlsx',
    cacheFilePath: string = '/home/vmuser/dev/lh_calc/excel-api/validation-rules.json'
  ) {
    this.templatePath = templatePath;
    this.cacheFilePath = cacheFilePath;
  }

  /**
   * Get validation rules - from cache if available, otherwise extract
   */
  public async getValidationRules(): Promise<ExtractedValidationRules> {
    // Return cache if available
    if (this.cache) {
      return this.cache;
    }

    // Try to load from file
    try {
      const fileContent = await fs.readFile(this.cacheFilePath, 'utf-8');
      this.cache = JSON.parse(fileContent);
      console.log('[ValidationExtractor] Loaded validation rules from cache file');
      return this.cache!;
    } catch (error) {
      console.log('[ValidationExtractor] Cache file not found, extracting from Excel');
    }

    // Extract from Excel
    return await this.extractAndCache();
  }

  /**
   * Force extraction from Excel and update cache
   */
  public async extractAndCache(): Promise<ExtractedValidationRules> {
    console.log('[ValidationExtractor] Extracting validation rules from Excel template');
    
    try {
      const rules = await this.extractFromExcel();
      
      // Save to file
      await fs.writeFile(this.cacheFilePath, JSON.stringify(rules, null, 2));
      console.log('[ValidationExtractor] Saved validation rules to cache file');
      
      // Update memory cache
      this.cache = rules;
      
      return rules;
    } catch (error) {
      console.error('[ValidationExtractor] Failed to extract validation rules:', error);
      
      // Return empty rules as fallback
      return {
        extractedAt: new Date().toISOString(),
        templatePath: this.templatePath
      };
    }
  }

  /**
   * Extract validation rules from Excel file
   */
  private async extractFromExcel(): Promise<ExtractedValidationRules> {
    const zip = new AdmZip(this.templatePath);
    const rules: ExtractedValidationRules = {
      extractedAt: new Date().toISOString(),
      templatePath: this.templatePath
    };

    // First, extract named ranges from workbook.xml
    const namedRanges: Map<string, string> = new Map();
    const workbookEntry = zip.getEntry('xl/workbook.xml');
    
    if (workbookEntry) {
      const workbookXml = workbookEntry.getData().toString('utf8');
      const workbookData = await parseStringPromise(workbookXml, { 
        explicitArray: false,
        ignoreAttrs: false 
      });
      
      if (workbookData?.workbook?.definedNames?.definedName) {
        const names = Array.isArray(workbookData.workbook.definedNames.definedName) 
          ? workbookData.workbook.definedNames.definedName 
          : [workbookData.workbook.definedNames.definedName];
        
        for (const name of names) {
          if (name['$']?.name && name['_']) {
            namedRanges.set(name['$'].name, name['_']);
          }
        }
      }
    }

    // Map worksheet names to their indices
    const sheetMap: Map<string, string> = new Map([
      ['технолог', 'sheet1.xml'],
      ['снабжение', 'sheet2.xml']
    ]);

    // Process each worksheet for validation rules
    for (const [sheetName, sheetFile] of sheetMap) {
      const sheetEntry = zip.getEntry(`xl/worksheets/${sheetFile}`);
      if (!sheetEntry) continue;

      const sheetXml = sheetEntry.getData().toString('utf8');
      const sheetData = await parseStringPromise(sheetXml, { 
        explicitArray: false,
        ignoreAttrs: false 
      });

      // Extract data validations
      const validations = sheetData?.worksheet?.dataValidations?.dataValidation;
      if (!validations) continue;

      const validationArray = Array.isArray(validations) ? validations : [validations];

      for (const validation of validationArray) {
        if (validation['$']?.type !== 'list') continue;

        const sqref = validation['$']?.sqref || '';
        const formula1 = validation.formula1;
        
        if (!formula1) continue;

        // Get the cells this validation applies to
        const cells = this.parseCellReferences(sqref);
        
        // Get the validation values
        let values: string[] = [];
        
        if (formula1.startsWith('"') && formula1.endsWith('"')) {
          // Direct list like "1,2,3,4"
          values = formula1.slice(1, -1).split(',');
        } else if (namedRanges.has(formula1)) {
          // Named range reference
          const rangeRef = namedRanges.get(formula1)!;
          values = await this.extractRangeValues(zip, rangeRef, sheetName);
        } else if (formula1.includes('!') || formula1.includes(':')) {
          // Direct range reference like "снабжение!$AU$47:$AU$54" or just "$AU$47:$AU$54"
          values = await this.extractRangeValues(zip, formula1, sheetName);
        }

        // Map cells to field names and store rules
        for (const cell of cells) {
          const fieldName = this.mapCellToFieldName(sheetName, cell);
          if (fieldName && values.length > 0) {
            rules[fieldName] = values;
          }
        }
      }
    }

    return rules;
  }

  /**
   * Parse cell references like "P27:Q27" or "D28:D29 J28:J29"
   */
  private parseCellReferences(sqref: string): string[] {
    const cells: string[] = [];
    const ranges = sqref.split(' ');
    
    for (const range of ranges) {
      if (range.includes(':')) {
        // Range like P27:Q27
        const [start, end] = range.split(':');
        const startCol = start.match(/[A-Z]+/)?.[0] || '';
        const startRow = start.match(/\d+/)?.[0] || '';
        const endCol = end.match(/[A-Z]+/)?.[0] || '';
        const endRow = end.match(/\d+/)?.[0] || '';
        
        if (startCol === endCol) {
          // Same column range
          for (let row = parseInt(startRow); row <= parseInt(endRow); row++) {
            cells.push(`${startCol}${row}`);
          }
        } else if (startRow === endRow && endCol) {
          // Same row range
          const startColNum = this.columnToNumber(startCol);
          const endColNum = this.columnToNumber(endCol);
          for (let col = startColNum; col <= endColNum; col++) {
            cells.push(`${this.numberToColumn(col)}${startRow}`);
          }
        }
      } else {
        // Single cell
        cells.push(range);
      }
    }
    
    return cells;
  }

  /**
   * Extract values from a range reference
   */
  private async extractRangeValues(zip: AdmZip, rangeRef: string, currentSheetName?: string): Promise<string[]> {
    const values: string[] = [];
    
    // Parse range reference like "снабжение!$AU$47:$AU$54" or just "$AU$47:$AU$54"
    let match = rangeRef.match(/(.+)!\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)/);
    let sheetName: string;
    let startCol: string;
    let startRowStr: string;
    let endRowStr: string;
    
    if (match) {
      // Has sheet name
      const [, sheetNameMatch, startColMatch, startRowStrMatch, , endRowStrMatch] = match;
      sheetName = sheetNameMatch;
      startCol = startColMatch;
      startRowStr = startRowStrMatch;
      endRowStr = endRowStrMatch;
    } else {
      // No sheet name, try without it (use current sheet)
      match = rangeRef.match(/\$?([A-Z]+)\$?(\d+):\$?([A-Z]+)\$?(\d+)/);
      if (!match) return values;
      const [, startColMatch, startRowStrMatch, , endRowStrMatch] = match;
      startCol = startColMatch;
      startRowStr = startRowStrMatch;
      endRowStr = endRowStrMatch;
      sheetName = currentSheetName || 'снабжение'; // Default to снабжение for D9
    }
    
    const startRow = parseInt(startRowStr) - 1;
    const endRow = parseInt(endRowStr) - 1;
    const col = this.columnToNumber(startCol) - 1;
    
    // Map sheet names to files
    const sheetFile = sheetName === 'технолог' ? 'sheet1.xml' : 'sheet2.xml';
    
    // Get shared strings
    const sharedStrings = await this.getSharedStrings(zip);
    
    // Read sheet data
    const sheetEntry = zip.getEntry(`xl/worksheets/${sheetFile}`);
    if (!sheetEntry) return values;
    
    const sheetXml = sheetEntry.getData().toString('utf8');
    const sheetData = await parseStringPromise(sheetXml, { 
      explicitArray: false,
      ignoreAttrs: false 
    });
    
    // Extract cell values
    const rows = sheetData?.worksheet?.sheetData?.row;
    if (!rows) return values;
    
    const rowArray = Array.isArray(rows) ? rows : [rows];
    
    for (const row of rowArray) {
      const rowNum = parseInt(row['$']?.r) - 1;
      if (rowNum < startRow || rowNum > endRow) continue;
      
      const cells = Array.isArray(row.c) ? row.c : [row.c];
      if (!cells) continue;
      
      for (const cell of cells || []) {
        const cellRef = cell['$']?.r;
        if (!cellRef) continue;
        
        const cellCol = this.columnToNumber(cellRef.match(/[A-Z]+/)?.[0] || '') - 1;
        if (cellCol !== col) continue;
        
        // Get cell value
        if (cell.v) {
          if (cell['$']?.t === 's') {
            // Shared string
            const idx = parseInt(cell.v);
            if (sharedStrings[idx]) {
              values.push(sharedStrings[idx]);
            }
          } else {
            // Direct value
            values.push(cell.v);
          }
        }
      }
    }
    
    return values.filter(v => v !== '');
  }

  /**
   * Get shared strings from Excel file
   */
  private async getSharedStrings(zip: AdmZip): Promise<string[]> {
    const strings: string[] = [];
    const stringsEntry = zip.getEntry('xl/sharedStrings.xml');
    
    if (!stringsEntry) return strings;
    
    const stringsXml = stringsEntry.getData().toString('utf8');
    const stringsData = await parseStringPromise(stringsXml, { 
      explicitArray: false,
      ignoreAttrs: false 
    });
    
    const sst = stringsData?.sst?.si;
    if (!sst) return strings;
    
    const siArray = Array.isArray(sst) ? sst : [sst];
    for (const si of siArray) {
      strings.push(si.t || '');
    }
    
    return strings;
  }

  /**
   * Convert column letter to number (A=1, B=2, etc.)
   */
  private columnToNumber(col: string): number {
    let num = 0;
    for (let i = 0; i < col.length; i++) {
      num = num * 26 + col.charCodeAt(i) - 64;
    }
    return num;
  }

  /**
   * Convert number to column letter (1=A, 2=B, etc.)
   */
  private numberToColumn(num: number): string {
    let col = '';
    while (num > 0) {
      const rem = (num - 1) % 26;
      col = String.fromCharCode(65 + rem) + col;
      num = Math.floor((num - 1) / 26);
    }
    return col;
  }

  /**
   * Map cell reference to API field name
   */
  private mapCellToFieldName(sheetName: string, cell: string): string | null {
    const cellMap: { [key: string]: string } = {
      // технолог sheet
      'технолог!F27': 'tech_F27_deliveryType',
      'технолог!P27': 'tech_P27_plateMaterial',
      'технолог!Q27': 'tech_Q27_materialType',
      'технолог!R27': 'tech_R27_bodyMaterial',
      'технолог!S27': 'tech_S27_plateSurfaceType',
      'технолог!U27': 'tech_U27_plateThickness',
      'технолог!V27': 'tech_V27_claddingThickness',
      
      // снабжение sheet
      'снабжение!C28': 'sup_C28_panelAFlange1Pressure',
      'снабжение!C29': 'sup_C29_panelAFlange2Pressure',
      'снабжение!D28': 'sup_D28_panelAFlange1Diameter',
      'снабжение!D29': 'sup_D29_panelAFlange2Diameter',
      'снабжение!D9': 'sup_D9_bodyMaterial',
      'снабжение!E9': 'sup_D9_bodyMaterial', // E9 also maps to body material
      'снабжение!F39': 'sup_F39_spareKitsPressureReserve',
      'снабжение!I28': 'sup_I28_panelBFlange3Pressure',
      'снабжение!I29': 'sup_I29_panelBFlange4Pressure',
      'снабжение!J28': 'sup_J28_panelBFlange3Diameter',
      'снабжение!J29': 'sup_J29_panelBFlange4Diameter',
      'снабжение!P20': 'sup_P20_panelFastenersMaterial',
      'снабжение!P21': 'sup_P21_panelFastenersCoating',
      'снабжение!P22': 'sup_P22_panelFastenersStudSize',
      'снабжение!P29': 'sup_P29_cofFastenersFlange1Size',
      'снабжение!P33': 'sup_P33_cofFastenersFlange2Size',
      'снабжение!P37': 'sup_P37_cofFastenersFlange3Size',
      'снабжение!P41': 'sup_P41_cofFastenersFlange4Size',
      'снабжение!Q29': 'sup_Q29_cofFastenersFlange1Material',
      'снабжение!Q33': 'sup_Q33_cofFastenersFlange2Material',
      'снабжение!Q37': 'sup_Q37_cofFastenersFlange3Material',
      'снабжение!Q41': 'sup_Q41_cofFastenersFlange4Material',
      'снабжение!R29': 'sup_R29_cofFastenersFlange1Coating',
      'снабжение!R33': 'sup_R33_cofFastenersFlange2Coating',
      'снабжение!R37': 'sup_R37_cofFastenersFlange3Coating',
      'снабжение!R41': 'sup_R41_cofFastenersFlange4Coating',
    };
    
    const key = `${sheetName}!${cell}`;
    return cellMap[key] || null;
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache = null;
    console.log('[ValidationExtractor] Cache cleared');
  }
}