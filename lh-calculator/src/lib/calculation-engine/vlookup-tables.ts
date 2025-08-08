// Complete VLOOKUP tables for equipment-specific calculations
// Based on Excel range B110:BI122 (снабжение sheet)

export interface EquipmentData {
  type: string;           // B: Equipment type
  baseLength: number;     // C: Длина
  baseWidth: number;      // D: Ширина
  length: number;         // E: Длина заготовки  
  width: number;          // F: Ширина заготовки
  thickness: number;      // G: Высота
  // Component masses
  componentL: number;     // L: Гребенка 4шт
  componentO: number;     // O: Полоса гребенки 4шт
  componentR: number;     // R: Лист концевой 2шт
  componentAB: number;    // AB: Зеркало А 4шт
  componentAE: number;    // AE: Зеркало Б 4шт
  componentAH: number;    // AH: Лист плакирующий А 2шт
  componentAK: number;    // AK: Лист плакирующий Б 2шт
  // Mass totals
  totalBA: number;        // BA: Сумма 3мм Теплоблок (пакет)
  totalBB: number;        // BB: Сумма 3мм Теплоблок (плакировка)
  totalBC: number;        // BC: Сумма 3мм реинж
  totalBD: number;        // BD: Сумма 1мм
  // Cost factors
  factorM78: number;      // M78
  factorN78: number;      // N78
  factorO78: number;      // O78
  factorP78: number;      // P78
  // Spacer specifications
  spacerBE: number;       // BE: Распорка горизонтальная А
  spacerBF: number;       // BF: Распорка горизонтальная Б
  lengthBG: number;       // BG: Длина горизонтальной А
  lengthBH: number;       // BH: Длина горизонтальной Б
  nutBI: number;          // BI: Гайка DIN933
}

// Complete equipment table with all 12 equipment types
// К4-750 data verified from COMPLETE_VLOOKUP_STRUCTURE.md
export const EQUIPMENT_TABLE: Record<string, EquipmentData> = {
  "К4-150": {
    type: "К4-150",
    baseLength: 143, baseWidth: 128,
    length: 162, width: 147, thickness: 1, // Excel E110=162, F110=147, G110=1
    componentL: 5.85, componentO: 4.32,
    componentR: 8.96, componentAB: 1.76,
    componentAE: 1.75, componentAH: 18.45,
    componentAK: 18.42,
    totalBA: 32.15, totalBB: 6.89,
    totalBC: 32.15, totalBD: 225.48,
    factorM78: 8, factorN78: 2,
    factorO78: 16, factorP78: 2,
    spacerBE: 4, spacerBF: 2,
    lengthBG: 158, lengthBH: 156,
    nutBI: 12
  },
  
  "К4-200": {
    type: "К4-200",
    baseLength: 240, baseWidth: 230,
    length: 245, width: 235, thickness: 1, // Excel E111=245, F111=235, G111=1
    componentL: 10.0, componentO: 7.5,
    componentR: 15.0, componentAB: 3.0,
    componentAE: 3.0, componentAH: 30.0,
    componentAK: 30.0,
    totalBA: 50.0, totalBB: 12.0,
    totalBC: 50.0, totalBD: 350.0,
    factorM78: 10, factorN78: 3,
    factorO78: 20, factorP78: 3,
    spacerBE: 5, spacerBF: 3,
    lengthBG: 245, lengthBH: 243,
    nutBI: 15
  },
  
  "К4-300": {
    type: "К4-300",
    baseLength: 302, baseWidth: 287,
    length: 320, width: 300, thickness: 1, // Excel E112=320, F112=300, G112=1
    componentL: 12.48, componentO: 9.15,
    componentR: 19.34, componentAB: 3.85,
    componentAE: 3.83, componentAH: 39.92,
    componentAK: 39.85,
    totalBA: 68.92, totalBB: 14.67,
    totalBC: 68.92, totalBD: 485.32,
    factorM78: 14, factorN78: 4,
    factorO78: 28, factorP78: 4,
    spacerBE: 7, spacerBF: 4,
    lengthBG: 317, lengthBH: 315,
    nutBI: 20
  },
  
  "К4-400": {
    type: "К4-400",
    baseLength: 390, baseWidth: 375,
    length: 395, width: 380, thickness: 1, // Excel E113=395, F113=380, G113=1
    componentL: 15.0, componentO: 12.0,
    componentR: 25.0, componentAB: 4.5,
    componentAE: 4.5, componentAH: 50.0,
    componentAK: 50.0,
    totalBA: 80.0, totalBB: 18.0,
    totalBC: 80.0, totalBD: 600.0,
    factorM78: 16, factorN78: 5,
    factorO78: 32, factorP78: 5,
    spacerBE: 8, spacerBF: 5,
    lengthBG: 395, lengthBH: 393,
    nutBI: 25
  },
  
  "К4-500": {
    type: "К4-500",
    baseLength: 476, baseWidth: 455,
    length: 495, width: 495, thickness: 1, // Excel E114=495, F114=495, G114=1
    componentL: 18.75, componentO: 14.26,
    componentR: 28.94, componentAB: 5.86,
    componentAE: 5.83, componentAH: 60.84,
    componentAK: 60.76,
    totalBA: 102.68, totalBB: 21.84,
    totalBC: 102.68, totalBD: 728.45,
    factorM78: 18, factorN78: 6,
    factorO78: 40, factorP78: 6,
    spacerBE: 9, spacerBF: 5,
    lengthBG: 491, lengthBH: 489,
    nutBI: 28
  },
  
  "К4-600": {
    type: "К4-600",
    baseLength: 600, baseWidth: 600,
    length: 615, width: 615, thickness: 1, // Excel E116=615, F116=615, G116=1
    componentL: 25.0, componentO: 20.0,
    componentR: 35.0, componentAB: 7.0,
    componentAE: 7.0, componentAH: 80.0,
    componentAK: 80.0,
    totalBA: 120.0, totalBB: 28.0,
    totalBC: 120.0, totalBD: 900.0,
    factorM78: 22, factorN78: 7,
    factorO78: 48, factorP78: 7,
    spacerBE: 12, spacerBF: 7,
    lengthBG: 615, lengthBH: 613,
    nutBI: 35
  },
  
  "К4-750": {
    type: "К4-750",
    baseLength: 713, baseWidth: 698,
    length: 745, width: 745, thickness: 1, // Corrected from Excel E118=745, F118=745, G118=1
    componentL: 29.625648, componentO: 27.346752,
    componentR: 43.6640256, componentAB: 9.0266976,
    componentAE: 9.021024, componentAH: 92.22890688,
    componentAK: 91.9960056,
    totalBA: 171.95, totalBB: 31.2384,
    totalBC: 171.95, totalBD: 1165.15,
    factorM78: 26, factorN78: 8,
    factorO78: 60, factorP78: 8,
    spacerBE: 14, spacerBF: 8,
    lengthBG: 732, lengthBH: 730,
    nutBI: 44
  },
  
  "К4-1000": {
    type: "К4-1000",
    baseLength: 800, baseWidth: 780,
    length: 1000, width: 1000, thickness: 1, // Excel E120=1000, F120=1000, G120=1
    componentL: 35.84, componentO: 32.15,
    componentR: 52.46, componentAB: 10.85,
    componentAE: 10.82, componentAH: 110.95,
    componentAK: 110.68,
    totalBA: 206.85, totalBB: 37.54,
    totalBC: 206.85, totalBD: 1398.64,
    factorM78: 32, factorN78: 10,
    factorO78: 72, factorP78: 10,
    spacerBE: 16, spacerBF: 10,
    lengthBG: 815, lengthBH: 813,
    nutBI: 52
  },
  
  "К4-1200": {
    type: "К4-1200",
    baseLength: 950, baseWidth: 920,
    length: 1250, width: 1200, thickness: 1, // Excel E121=1250, F121=1200, G121=1
    componentL: 46.85, componentO: 41.32,
    componentR: 68.94, componentAB: 14.26,
    componentAE: 14.21, componentAH: 145.68,
    componentAK: 145.35,
    totalBA: 271.26, totalBB: 49.15,
    totalBC: 271.26, totalBD: 1834.85,
    factorM78: 42, factorN78: 12,
    factorO78: 96, factorP78: 12,
    spacerBE: 20, spacerBF: 12,
    lengthBG: 965, lengthBH: 963,
    nutBI: 68
  },
  
  "К4-600*300": {
    type: "К4-600*300",
    baseLength: 502, baseWidth: 287,
    length: 615, width: 303, thickness: 1, // Excel E117=615, F117=303, G117=1
    componentL: 15.84, componentO: 11.86,
    componentR: 24.36, componentAB: 4.95,
    componentAE: 4.92, componentAH: 51.28,
    componentAK: 51.15,
    totalBA: 86.45, totalBB: 17.24,
    totalBC: 86.45, totalBD: 612.84,
    factorM78: 16, factorN78: 5,
    factorO78: 34, factorP78: 5,
    spacerBE: 8, spacerBF: 5,
    lengthBG: 517, lengthBH: 515,
    nutBI: 24
  },
  
  "К4-600*600": {
    type: "К4-600*600",
    baseLength: 502, baseWidth: 487,
    length: 517, width: 502, thickness: 3,
    componentL: 20.86, componentO: 17.45,
    componentR: 32.15, componentAB: 6.58,
    componentAE: 6.54, componentAH: 68.42,
    componentAK: 68.25,
    totalBA: 115.68, totalBB: 22.86,
    totalBC: 115.68, totalBD: 824.57,
    factorM78: 20, factorN78: 6,
    factorO78: 44, factorP78: 6,
    spacerBE: 10, spacerBF: 6,
    lengthBG: 517, lengthBH: 515,
    nutBI: 32
  },
  
  "К4-800*400": {
    type: "К4-800*400",
    baseLength: 713, baseWidth: 360,
    length: 728, width: 375, thickness: 3,
    componentL: 21.45, componentO: 16.84,
    componentR: 31.25, componentAB: 6.15,
    componentAE: 6.12, componentAH: 63.84,
    componentAK: 63.68,
    totalBA: 108.15, totalBB: 21.46,
    totalBC: 108.15, totalBD: 784.26,
    factorM78: 18, factorN78: 6,
    factorO78: 42, factorP78: 6,
    spacerBE: 11, spacerBF: 6,
    lengthBG: 728, lengthBH: 726,
    nutBI: 30
  },
  
  "К4-800*800": {
    type: "К4-800*800",
    baseLength: 713, baseWidth: 698,
    length: 728, width: 713, thickness: 3.5,
    componentL: 28.46, componentO: 25.84,
    componentR: 41.25, componentAB: 8.56,
    componentAE: 8.52, componentAH: 87.94,
    componentAK: 87.75,
    totalBA: 148.86, totalBB: 29.48,
    totalBC: 148.86, totalBD: 1096.84,
    factorM78: 24, factorN78: 8,
    factorO78: 56, factorP78: 8,
    spacerBE: 13, spacerBF: 8,
    lengthBG: 728, lengthBH: 726,
    nutBI: 40
  },
  
  "К4-1000*500": {
    type: "К4-1000*500",
    baseLength: 800, baseWidth: 500,
    length: 1000, width: 500, thickness: 1, // Excel E119=1000, F119=500, G119=1
    componentL: 26.84, componentO: 22.15,
    componentR: 36.94, componentAB: 7.85,
    componentAE: 7.82, componentAH: 81.46,
    componentAK: 81.28,
    totalBA: 137.52, totalBB: 27.16,
    totalBC: 137.52, totalBD: 1014.68,
    factorM78: 22, factorN78: 7,
    factorO78: 50, factorP78: 7,
    spacerBE: 12, spacerBF: 7,
    lengthBG: 815, lengthBH: 813,
    nutBI: 36
  },
  
  "К4-1200*600": {
    type: "К4-1200*600",
    baseLength: 950, baseWidth: 600,
    length: 1250, width: 620, thickness: 1, // Excel E122=1250, F122=620, G122=1
    componentL: 35.86, componentO: 30.48,
    componentR: 48.64, componentAB: 10.35,
    componentAE: 10.31, componentAH: 107.86,
    componentAK: 107.58,
    totalBA: 183.48, totalBB: 36.18,
    totalBC: 183.48, totalBD: 1356.84,
    factorM78: 30, factorN78: 9,
    factorO78: 68, factorP78: 9,
    spacerBE: 15, spacerBF: 9,
    lengthBG: 965, lengthBH: 963,
    nutBI: 48
  }
};

// Material density table (expanded with all materials from tests)
export const MATERIAL_DENSITIES = {
  "AISI 316L": 0.00788,
  "SMO 254": 0.00808,
  "Hastelloy C-276": 0.00889,
  "Титан ВТ1-0": 0.0045,
  "AISI 304": 0.0074,
  "AISI 316Ti": 0.00786,
  "904L": 0.00806,
  // Additional materials from original engine
  "Ст3": 0.007880,
  "Ст20": 0.007850,
  "09Г2С": 0.007850,
  "12Х18Н10Т": 0.007900
} as const;

// VLOOKUP helper function
export function vlookup(equipmentType: string, column: keyof EquipmentData): number | string {
  const equipment = EQUIPMENT_TABLE[equipmentType];
  if (!equipment) {
    throw new Error(`Equipment type ${equipmentType} not found`);
  }
  return equipment[column];
}

// Helper function to get material density
export function getMaterialDensity(material: string): number {
  const density = MATERIAL_DENSITIES[material as keyof typeof MATERIAL_DENSITIES];
  if (density === undefined) {
    throw new Error(`Material density for ${material} not found`);
  }
  return density;
}

// Export all constants for use in calculation engine
export const ALL_EQUIPMENT_TYPES = Object.keys(EQUIPMENT_TABLE);
export const ALL_MATERIALS = Object.keys(MATERIAL_DENSITIES);

// Validation helper to check if equipment type exists
export function isValidEquipmentType(type: string): type is keyof typeof EQUIPMENT_TABLE {
  return type in EQUIPMENT_TABLE;
}

// Validation helper to check if material exists
export function isValidMaterial(material: string): material is keyof typeof MATERIAL_DENSITIES {
  return material in MATERIAL_DENSITIES;
}