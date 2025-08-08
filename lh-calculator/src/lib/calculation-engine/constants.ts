// Constants and named ranges from Excel

export const MATERIAL_DENSITIES = {
  STEEL: 0.007880, // Scaled density (kg/m³ × 10⁻⁶) - matches Excel
  STAINLESS_STEEL: 0.008080, // Scaled density (kg/m³ × 10⁻⁶) - matches Excel
  'AISI 316L': 0.008080, // Excel uses 8080/10^6 = 0.008080
  'AISI 304': 0.008030, // Excel uses 8030/10^6 = 0.008030
  'Ст3': 0.007880, // Excel uses 7880/10^6 = 0.007880
  'Ст20': 0.007850, // Excel uses 7850/10^6 = 0.007850
  '09Г2С': 0.007850, // Excel uses 7850/10^6 = 0.007850
  '12Х18Н10Т': 0.007900, // Excel uses 7900/10^6 = 0.007900
} as const;

export const SAFETY_FACTOR = 1.25;

export const NAMED_RANGES = {
  материал_корпуса: ['AISI 316L', 'AISI 304', 'Ст3', 'Ст20', '09Г2С', '12Х18Н10Т'],
  материал_пластин: ['AISI 316L', 'AISI 304', '0.4', '0.5', '0.6', '0.7'],
  размер_крепежа_панелей: ['М12', 'М16', 'М18', 'М20', 'М24', 'М30', 'М33'],
  тип_поверхности: ['гофра', 'гладкая', 'турбулизатор', 'шеврон', 'микс'],
  тип_поставки: ['Целый ТА', 'ШОТ-БЛОК', 'РЕИНЖ'],
  типоразмеры_К4: [
    'К4-150', 'К4-200', 'К4-300', 'К4-400', 
    'К4-500', 'К4-500*250', 'К4-600', 'К4-600*300',
    'К4-750', 'К4-1000*500', 'К4-1000', 'К4-1200', 'К4-1200*600'
  ],
  толщина_пластины: [0.4, 0.5, 0.6, 0.7, 0.8, 1.0, 1.2],
} as const;

// Pressure-size lookup table (from Excel Z60:AA68)
export const PRESSURE_SIZE_MATRIX = new Map([
  [50, 170],
  [100, 160],
  [150, 154],
  [200, 150],
  [250, 147],
  [300, 144],
  [350, 142],
  [400, 140],
]);

// Equipment type specifications - All 13+ variants from Excel
export const EQUIPMENT_SPECS = {
  // К1 Series - Small heat exchangers
  'К1-50': { width: 90, height: 80, maxPlates: 50, row: 101 },
  'К1-110': { width: 120, height: 110, maxPlates: 110, row: 102 },
  'К1-150': { width: 140, height: 130, maxPlates: 150, row: 103 },
  'К1-190': { width: 160, height: 150, maxPlates: 190, row: 104 },
  
  // К2 Series - Medium heat exchangers  
  'К2-250': { width: 200, height: 180, maxPlates: 250, row: 105 },
  
  // К3 Series - Special configurations
  'К3-440': { width: 350, height: 320, maxPlates: 440, row: 106 },
  
  // К4 Series - Standard configurations (existing)
  'К4-150': { width: 143, height: 128, maxPlates: 150, row: 110 },
  'К4-200': { width: 227, height: 212, maxPlates: 200, row: 111 },
  'К4-300': { width: 302, height: 287, maxPlates: 300, row: 112 },
  'К4-400': { width: 373, height: 360, maxPlates: 400, row: 113 },
  'К4-500': { width: 476, height: 455, maxPlates: 500, row: 114 },
  'К4-500*250': { width: 476, height: 255, maxPlates: 500, row: 115 },
  'К4-600': { width: 502, height: 487, maxPlates: 600, row: 116 },
  'К4-600*300': { width: 502, height: 287, maxPlates: 600, row: 117 },
  'К4-750': { width: 600, height: 580, maxPlates: 750, row: 118 },
  'К4-1000*500': { width: 800, height: 500, maxPlates: 1000, row: 119 },
  'К4-1000': { width: 800, height: 780, maxPlates: 1000, row: 120 },
  'К4-1200': { width: 950, height: 920, maxPlates: 1200, row: 121 },
  'К4-1200*600': { width: 950, height: 600, maxPlates: 1200, row: 122 },
} as const;

// Flange specifications (Ду/Ру combinations)
export const FLANGE_SPECS = [
  { dn: 'Ду50', pn: 'Ру10', price: 2000 },
  { dn: 'Ду50', pn: 'Ру16', price: 2200 },
  { dn: 'Ду50', pn: 'Ру25', price: 2500 },
  { dn: 'Ду100', pn: 'Ру10', price: 3500 },
  { dn: 'Ду100', pn: 'Ру16', price: 3800 },
  { dn: 'Ду100', pn: 'Ру25', price: 4200 },
  { dn: 'Ду150', pn: 'Ру10', price: 5000 },
  { dn: 'Ду150', pn: 'Ру16', price: 5500 },
  { dn: 'Ду150', pn: 'Ру25', price: 6000 },
  { dn: 'Ду200', pn: 'Ру10', price: 7500 },
  { dn: 'Ду200', pn: 'Ру16', price: 8200 },
  { dn: 'Ду200', pn: 'Ру25', price: 9000 },
  { dn: 'Ду300', pn: 'Ру10', price: 12000 },
  { dn: 'Ду300', pn: 'Ру16', price: 13500 },
  { dn: 'Ду300', pn: 'Ру25', price: 15000 },
  { dn: 'Ду300', pn: 'Ру40', price: 18000 },
  { dn: 'Ду300', pn: 'Ру63', price: 22000 },
  { dn: 'Ду450', pn: 'Ру10', price: 20000 },
  { dn: 'Ду450', pn: 'Ру16', price: 23000 },
  { dn: 'Ду450', pn: 'Ру25', price: 26000 },
  { dn: 'Ду600', pn: 'Ру10', price: 35000 },
  { dn: 'Ду600', pn: 'Ру16', price: 40000 },
  { dn: 'Ду600', pn: 'Ру25', price: 45000 },
  { dn: 'Ду600', pn: 'Ру40', price: 55000 },
];

// Equipment cost multipliers (G20 pattern from Excel)
export const EQUIPMENT_COST_MULTIPLIERS = {
  // К1 Series - Small heat exchangers (lower cost)
  'К1-50': 0.035,
  'К1-110': 0.055,
  'К1-150': 0.065,
  'К1-190': 0.075,
  
  // К2 Series - Medium heat exchangers
  'К2-250': 0.15,
  
  // К3 Series - Special configurations
  'К3-440': 0.35,
  
  // К4 Series - Standard configurations (existing)
  'К4-150': 0.068,
  'К4-200': 0.12,
  'К4-300': 0.19,
  'К4-400': 0.28,
  'К4-500*250': 0.27,
  'К4-500': 0.4624,
  'К4-600': 0.6,
  'К4-600*300': 0.37,
  'К4-750': 1.0, // Baseline
  'К4-1000*500': 1.01,
  'К4-1000': 1.63,
  'К4-1200': 2.43,
  'К4-1200*600': 1.53,
} as const;

// Manufacturing margins
export const MANUFACTURING_MARGINS = {
  PLATE_MARGIN: 15, // mm - added to width and height
  COVER_MARGIN: 15, // mm - added to cover dimensions
  PANEL_MARGIN: 10, // mm - added to panel dimensions
} as const;