export interface ContractFieldNames {
  // Green cells - Supply inputs (user provided values)
  sup_D10_priceCostMaterial: number | null;  // Numeric price input, can be empty
  sup_D11_priceCostMaterial: number | null;  // Numeric price input, can be empty
  sup_D17_priceWeightThickness: number | null;  // Numeric price input, can be empty
  sup_D38_priceQuantityTotal: number | null;  // Numeric price input, can be empty
  sup_D43_priceTotal: number;  // Numeric price (e.g., 3300)
  sup_D44_price: number;  // Numeric price (e.g., 1750)
  sup_D45_price: number;  // Numeric price (e.g., 2800)
  sup_D46_price: number;  // Numeric price (e.g., 1200)
  sup_D78_massThickness: number;  // Numeric thickness in mm (e.g., 3)
  sup_D8_priceMaterial: number;  // Numeric price per kg (e.g., 700)
  sup_E20_priceWeightThicknessTotal: number | null;  // Numeric price, can be empty
  sup_E21_priceWeightThicknessTotal: number | null;  // Numeric price, can be empty
  sup_E26_priceWeightThickness: number | null;  // Numeric price, can be empty
  sup_E27_priceWeightThickness: number | null;  // Numeric price, can be empty
  sup_E8_priceMaterial: number;  // Numeric price per kg (e.g., 700)
  sup_F28_priceWeightThicknessTotal: number | null;  // Numeric price, can be empty
  sup_F29_priceWeightPipeTotal: number | null;  // Numeric price, can be empty
  sup_F2_parameter: string;  // Material code or "0000" for none
  sup_F30_priceWeightPipeTotal: number | null;  // Numeric price, can be empty
  sup_F31_priceWeightPipeTotal: number | null;  // Numeric price, can be empty
  sup_F32_priceWeightPipeTotal: number | null;  // Numeric price, can be empty
  sup_F33_priceWeightPipeTotal: number | null;  // Numeric price, can be empty
  sup_G43_priceMaterialInsulationTotal: number;  // Numeric price
  sup_G44_priceMaterialInsulation: number;  // Numeric price
  sup_G45_priceMaterialInsulation: number;  // Numeric price
  sup_H54_priceTotal: number;  // Numeric total price
  sup_H55_priceTotal: number;  // Numeric total price
  sup_H56_priceTotal: number;  // Numeric total price
  sup_H57_priceTotal: number;  // Numeric total price
  sup_I38_priceThicknessTotalType: number;  // Numeric price
  sup_I39_priceQuantityMaterialThicknessInsulationTotalType: number;  // Numeric price
  sup_I44_priceMaterialThicknessInsulationTotalType: number | null;  // Numeric price, can be empty
  sup_I45_priceMaterialThicknessInsulationTotalType: number | null;  // Numeric price, can be empty
  sup_I46_priceQuantityMaterialThicknessInsulationTotalSumType: number | null;  // Numeric price, can be empty
  sup_I50_priceQuantityMaterialThicknessInsulationTotalSumType: number;  // Numeric price
  sup_I51_priceQuantityMaterialThicknessInsulationTotalSumType: number;  // Numeric price
  sup_I52_priceQuantityMaterialThicknessInsulationTotalSumType: number;  // Numeric price
  sup_I54_priceQuantityMaterialThicknessInsulationTotalType: number;  // Numeric price
  sup_I55_priceQuantityMaterialThicknessInsulationTotalType: number;  // Numeric price
  sup_I56_priceQuantityMaterialThicknessInsulationTotalType: number;  // Numeric price
  sup_I57_priceQuantityMaterialThicknessInsulationTotalType: number;  // Numeric price
  sup_K13_costQuantityNormTotal: number;  // Numeric cost (e.g., 1)
  sup_K20_priceWeightThicknessTotal: number | null;  // Numeric price, can be empty
  sup_K21_priceWeightThicknessTotal: number | null;  // Numeric price, can be empty
  sup_K26_priceWeightThickness: number | null;  // Numeric price, can be empty
  sup_K27_priceWeightThickness: number | null;  // Numeric price, can be empty
  sup_K38_pricePipeTotal: number;  // Numeric price
  sup_K39_priceQuantityMaterialPipeInsulationTotal: number;  // Numeric price
  sup_L28_priceWeightThicknessTotalType: number | null;  // Numeric price, can be empty
  sup_L29_priceWeightPipeTotalType: number | null;  // Numeric price, can be empty
  sup_L30_priceWeightPipeTotalType: number | null;  // Numeric price, can be empty
  sup_L31_priceWeightPipeTotalType: number | null;  // Numeric price, can be empty
  sup_L32_priceWeightPipeTotalType: number | null;  // Numeric price, can be empty
  sup_L33_priceWeightPipeTotalType: number | null;  // Numeric price, can be empty
  sup_M38_priceMaterialTotal: number;  // Numeric price
  sup_M39_quantityMaterialTotal: number;  // Numeric quantity
  sup_M44_priceMaterial: number;  // Numeric price
  sup_M45_priceMaterial: number;  // Numeric price
  sup_M46_priceQuantityMaterialSum: number;  // Numeric price
  sup_M51_priceQuantityMaterialTotalSum: number;  // Numeric price
  sup_M52_priceQuantityMaterialTotalSum: number;  // Numeric price
  sup_N50_priceQuantityWeightThicknessTotalSum: number;  // Numeric price
  sup_N51_priceQuantityWeightThicknessTotalSum: number;  // Numeric price
  sup_N52_priceQuantityWeightThicknessTotalSum: number;  // Numeric price
  sup_N54_quantityWeightThicknessTotal: number;  // Numeric quantity
  sup_N55_quantityWeightThicknessTotal: number;  // Numeric quantity
  sup_N56_quantityWeightThicknessTotal: number;  // Numeric quantity
  sup_N57_quantityWeightThicknessTotal: number;  // Numeric quantity
  sup_P13_costQuantityMaterialNorm: number;  // Numeric cost (e.g., 120000)
  sup_P45_priceMaterialTotal: number;  // Numeric price
  sup_Q22_priceQuantityMaterialThicknessTotal: number | null;  // Numeric price, can be empty
  sup_Q23_priceMaterialThicknessTotal: number | null;  // Numeric price, can be empty
  sup_Q24_priceThicknessTotal: number | null;  // Numeric price, can be empty
  sup_T29_priceMaterial: number | null;  // Numeric price, can be empty
  sup_T30_priceMaterial: number | null;  // Numeric price, can be empty
  sup_T31_priceMaterial: number | null;  // Numeric price, can be empty
  sup_T33_priceMaterialPipe: number | null;  // Numeric price, can be empty
  sup_T34_priceMaterialTotal: number | null;  // Numeric price, can be empty
  sup_T35_priceMaterialTotal: number | null;  // Numeric price, can be empty
  sup_T37_price: number | null;  // Numeric price, can be empty
  sup_T38_price: number | null;  // Numeric price, can be empty
  sup_T39_priceQuantity: number | null;  // Numeric price, can be empty
  sup_T41_priceTotal: number | null;  // Numeric price, can be empty
  sup_T42_priceMaterialInsulationTotal: number | null;  // Numeric price, can be empty
  sup_T43_priceTotal: number | null;  // Numeric price, can be empty
  tech_D27_type: number;  // Equipment type number (e.g., 1, 750)
  tech_E27_weightType: string;  // Equipment code (e.g., "Е-113", "К4-750")
  tech_H27_quantityType: string;  // Fraction string (e.g., "1/6", "1/3")
  tech_I27_quantityType: number;  // Plate count (e.g., 400)
  tech_J27_quantityType: number;  // Pressure in bar (e.g., 22)
  tech_K27_quantity: number;  // Pressure in bar (e.g., 22)
  tech_L27_quantity: number;  // Temperature in °C (e.g., 100)
  tech_M27_material: number;  // Temperature in °C (e.g., 100)
  tech_T27_materialThicknessType: number;  // Groove depth in mm (e.g., 5)

  // Orange cells - Engineering parameters
  sup_C28_priceWeightThickness: string;  // Flange type, enum: Ду values
  sup_C29_priceWeightPipeThickness: string;  // Flange type, enum: Ду values
  sup_D28_priceWeightThickness: string;  // Flange type, enum: Ду values (e.g., "Ду600")
  sup_D29_priceWeightPipe: string;  // Flange type, enum: Ду values (e.g., "Ду600")
  sup_D9_priceMaterial: MaterialCode;  // Material dropdown, validated enum
  sup_E19_priceWeightThicknessTotal: number | null;  // Numeric price, can be empty
  sup_E25_priceWeightThicknessTotal: number | null;  // Numeric price, can be empty
  sup_F39_priceQuantityWeightMaterialInsulationTotal: number;  // Numeric price
  sup_I28_priceWeightThicknessType: number | null;  // Numeric price, can be empty
  sup_I29_priceWeightPipeThicknessType: number | null;  // Numeric price, can be empty
  sup_J28_priceQuantityWeightThicknessNormTotal: number | null;  // Numeric price, can be empty
  sup_J29_priceQuantityWeightPipeNormTotal: number | null;  // Numeric price, can be empty
  sup_K19_priceWeightThicknessTotal: number | null;  // Numeric price, can be empty
  sup_K25_priceWeightThicknessTotal: number | null;  // Numeric price, can be empty
  sup_P19_priceQuantityMaterialThickness: number;  // Numeric price
  sup_P20_priceQuantityWeightMaterial: number | null;  // Numeric price, can be empty
  sup_P21_priceQuantityMaterial: number | null;  // Numeric price, can be empty
  sup_P22_priceQuantityMaterialTotal: number | null;  // Numeric price, can be empty
  sup_P29_priceMaterialTotal: number | null;  // Numeric price, can be empty
  sup_P33_priceMaterialPipeTotal: number | null;  // Numeric price, can be empty
  sup_P37_priceMaterialTotal: number | null;  // Numeric price, can be empty
  sup_P41_priceMaterialTotal: number | null;  // Numeric price, can be empty
  sup_Q29_priceThickness: number | null;  // Numeric price, can be empty
  sup_Q33_pricePipeThickness: number | null;  // Numeric price, can be empty
  sup_Q37_priceThickness: number | null;  // Numeric price, can be empty
  sup_Q41_priceThicknessTotal: number | null;  // Numeric price, can be empty
  sup_R29_price: number | null;  // Numeric price, can be empty
  sup_R33_pricePipe: number | null;  // Numeric price, can be empty
  sup_R37_price: number | null;  // Numeric price, can be empty
  sup_R41_priceTotal: number | null;  // Numeric price, can be empty
  tech_V27_thicknessType: number;  // Cladding thickness in mm, dropdown enum: 0.8, 1, 1.2, 1.5, 2, 3, 5

  // Yellow cells - Additional user inputs (not computed, despite yellow background)
  tech_F27_quantityType: DeliveryType;  // Delivery type dropdown, validated enum
  tech_G27_quantityType: string;  // Equipment size (e.g., "К4-750")
  tech_P27_materialType: PlateMaterial;  // Plate material dropdown, validated enum
  tech_R27_materialThicknessType: FrameMaterial;  // Frame material dropdown, validated enum
  tech_S27_materialThicknessType: GrooveType;  // Groove type dropdown, validated enum
  tech_U27_materialThicknessType: number;  // Plate thickness in mm, dropdown enum: 0.8, 1, 1.2, 1.5, 2, 3, 5
}

// Type definitions for enums extracted from Excel validation lists

// Material codes from снабжение!D9 validation
export type MaterialCode = 
  | 'ст3' 
  | 'ст20' 
  | '09Г2С' 
  | '12Х18Н10Т' 
  | 'AISI 304' 
  | 'AISI 316L' 
  | 'AISI 321' 
  | 'AISI 316Ti';

// Delivery types from технолог!F27 validation
export type DeliveryType = 
  | 'Целый ТА'     // Complete heat exchanger
  | 'ШОТ-БЛОК'     // Shot block
  | 'РЕИНЖ';       // Re-engineering

// Plate materials from технолог!P27 validation
export type PlateMaterial = 
  | 'AISI 316L' 
  | 'SMO 254' 
  | 'Hast-C276' 
  | 'Titanium' 
  | 'AISI 304' 
  | 'AISI316Ti' 
  | '904L';

// Frame materials from технолог!R27 validation
export type FrameMaterial = 
  | 'ст3' 
  | 'ст20' 
  | '09Г2С' 
  | '12Х18Н10Т' 
  | 'AISI 304' 
  | 'AISI 316L' 
  | 'AISI 321' 
  | 'AISI 316Ti';

// Groove types from технолог!S27 validation
export type GrooveType = 
  | 'гофра'           // Corrugated
  | 'дв. лунка'       // Double dimple
  | 'од. лунка'       // Single dimple
  | 'шпилька'         // Stud
  | 'шпилька-лунка';  // Stud-dimple

// Thickness values from технолог!U27 and V27 validations
export type ThicknessValue = 0.8 | 1 | 1.2 | 1.5 | 2 | 3 | 5;

// Flange diameter values found in Excel
export type FlangeDiameter = 
  | 'Ду25' | 'Ду32' | 'Ду40' | 'Ду50' | 'Ду65' | 'Ду80' 
  | 'Ду100' | 'Ду125' | 'Ду150' | 'Ду200' | 'Ду250' 
  | 'Ду300' | 'Ду350' | 'Ду400' | 'Ду450' | 'Ду500' 
  | 'Ду600' | 'Ду800' | 'Ду1000';

// Pressure rating values found in Excel
export type PressureRating = 
  | 'Ру6' | 'Ру10' | 'Ру16' | 'Ру25' 
  | 'Ру40' | 'Ру63' | 'Ру100' | 'Ру160';

export const FIELD_MAPPING = {
  // Maps field names to Excel cell addresses
  sup_C28_priceWeightThickness: 'снабжение!C28',
  sup_C29_priceWeightPipeThickness: 'снабжение!C29',
  sup_D10_priceCostMaterial: 'снабжение!D10',
  sup_D11_priceCostMaterial: 'снабжение!D11',
  sup_D17_priceWeightThickness: 'снабжение!D17',
  sup_D28_priceWeightThickness: 'снабжение!D28',
  sup_D29_priceWeightPipe: 'снабжение!D29',
  sup_D38_priceQuantityTotal: 'снабжение!D38',
  sup_D43_priceTotal: 'снабжение!D43',
  sup_D44_price: 'снабжение!D44',
  sup_D45_price: 'снабжение!D45',
  sup_D46_price: 'снабжение!D46',
  sup_D78_massThickness: 'снабжение!D78',
  sup_D8_priceMaterial: 'снабжение!D8',
  sup_D9_priceMaterial: 'снабжение!D9',
  sup_E19_priceWeightThicknessTotal: 'снабжение!E19',
  sup_E20_priceWeightThicknessTotal: 'снабжение!E20',
  sup_E21_priceWeightThicknessTotal: 'снабжение!E21',
  sup_E25_priceWeightThicknessTotal: 'снабжение!E25',
  sup_E26_priceWeightThickness: 'снабжение!E26',
  sup_E27_priceWeightThickness: 'снабжение!E27',
  sup_E8_priceMaterial: 'снабжение!E8',
  sup_F28_priceWeightThicknessTotal: 'снабжение!F28',
  sup_F29_priceWeightPipeTotal: 'снабжение!F29',
  sup_F2_parameter: 'снабжение!F2',
  sup_F30_priceWeightPipeTotal: 'снабжение!F30',
  sup_F31_priceWeightPipeTotal: 'снабжение!F31',
  sup_F32_priceWeightPipeTotal: 'снабжение!F32',
  sup_F33_priceWeightPipeTotal: 'снабжение!F33',
  sup_F39_priceQuantityWeightMaterialInsulationTotal: 'снабжение!F39',
  sup_G43_priceMaterialInsulationTotal: 'снабжение!G43',
  sup_G44_priceMaterialInsulation: 'снабжение!G44',
  sup_G45_priceMaterialInsulation: 'снабжение!G45',
  sup_H54_priceTotal: 'снабжение!H54',
  sup_H55_priceTotal: 'снабжение!H55',
  sup_H56_priceTotal: 'снабжение!H56',
  sup_H57_priceTotal: 'снабжение!H57',
  sup_I28_priceWeightThicknessType: 'снабжение!I28',
  sup_I29_priceWeightPipeThicknessType: 'снабжение!I29',
  sup_I38_priceThicknessTotalType: 'снабжение!I38',
  sup_I39_priceQuantityMaterialThicknessInsulationTotalType: 'снабжение!I39',
  sup_I44_priceMaterialThicknessInsulationTotalType: 'снабжение!I44',
  sup_I45_priceMaterialThicknessInsulationTotalType: 'снабжение!I45',
  sup_I46_priceQuantityMaterialThicknessInsulationTotalSumType: 'снабжение!I46',
  sup_I50_priceQuantityMaterialThicknessInsulationTotalSumType: 'снабжение!I50',
  sup_I51_priceQuantityMaterialThicknessInsulationTotalSumType: 'снабжение!I51',
  sup_I52_priceQuantityMaterialThicknessInsulationTotalSumType: 'снабжение!I52',
  sup_I54_priceQuantityMaterialThicknessInsulationTotalType: 'снабжение!I54',
  sup_I55_priceQuantityMaterialThicknessInsulationTotalType: 'снабжение!I55',
  sup_I56_priceQuantityMaterialThicknessInsulationTotalType: 'снабжение!I56',
  sup_I57_priceQuantityMaterialThicknessInsulationTotalType: 'снабжение!I57',
  sup_J28_priceQuantityWeightThicknessNormTotal: 'снабжение!J28',
  sup_J29_priceQuantityWeightPipeNormTotal: 'снабжение!J29',
  sup_K13_costQuantityNormTotal: 'снабжение!K13',
  sup_K19_priceWeightThicknessTotal: 'снабжение!K19',
  sup_K20_priceWeightThicknessTotal: 'снабжение!K20',
  sup_K21_priceWeightThicknessTotal: 'снабжение!K21',
  sup_K25_priceWeightThicknessTotal: 'снабжение!K25',
  sup_K26_priceWeightThickness: 'снабжение!K26',
  sup_K27_priceWeightThickness: 'снабжение!K27',
  sup_K38_pricePipeTotal: 'снабжение!K38',
  sup_K39_priceQuantityMaterialPipeInsulationTotal: 'снабжение!K39',
  sup_L28_priceWeightThicknessTotalType: 'снабжение!L28',
  sup_L29_priceWeightPipeTotalType: 'снабжение!L29',
  sup_L30_priceWeightPipeTotalType: 'снабжение!L30',
  sup_L31_priceWeightPipeTotalType: 'снабжение!L31',
  sup_L32_priceWeightPipeTotalType: 'снабжение!L32',
  sup_L33_priceWeightPipeTotalType: 'снабжение!L33',
  sup_M38_priceMaterialTotal: 'снабжение!M38',
  sup_M39_quantityMaterialTotal: 'снабжение!M39',
  sup_M44_priceMaterial: 'снабжение!M44',
  sup_M45_priceMaterial: 'снабжение!M45',
  sup_M46_priceQuantityMaterialSum: 'снабжение!M46',
  sup_M51_priceQuantityMaterialTotalSum: 'снабжение!M51',
  sup_M52_priceQuantityMaterialTotalSum: 'снабжение!M52',
  sup_N50_priceQuantityWeightThicknessTotalSum: 'снабжение!N50',
  sup_N51_priceQuantityWeightThicknessTotalSum: 'снабжение!N51',
  sup_N52_priceQuantityWeightThicknessTotalSum: 'снабжение!N52',
  sup_N54_quantityWeightThicknessTotal: 'снабжение!N54',
  sup_N55_quantityWeightThicknessTotal: 'снабжение!N55',
  sup_N56_quantityWeightThicknessTotal: 'снабжение!N56',
  sup_N57_quantityWeightThicknessTotal: 'снабжение!N57',
  sup_P13_costQuantityMaterialNorm: 'снабжение!P13',
  sup_P19_priceQuantityMaterialThickness: 'снабжение!P19',
  sup_P20_priceQuantityWeightMaterial: 'снабжение!P20',
  sup_P21_priceQuantityMaterial: 'снабжение!P21',
  sup_P22_priceQuantityMaterialTotal: 'снабжение!P22',
  sup_P29_priceMaterialTotal: 'снабжение!P29',
  sup_P33_priceMaterialPipeTotal: 'снабжение!P33',
  sup_P37_priceMaterialTotal: 'снабжение!P37',
  sup_P41_priceMaterialTotal: 'снабжение!P41',
  sup_P45_priceMaterialTotal: 'снабжение!P45',
  sup_Q22_priceQuantityMaterialThicknessTotal: 'снабжение!Q22',
  sup_Q23_priceMaterialThicknessTotal: 'снабжение!Q23',
  sup_Q24_priceThicknessTotal: 'снабжение!Q24',
  sup_Q29_priceThickness: 'снабжение!Q29',
  sup_Q33_pricePipeThickness: 'снабжение!Q33',
  sup_Q37_priceThickness: 'снабжение!Q37',
  sup_Q41_priceThicknessTotal: 'снабжение!Q41',
  sup_R29_price: 'снабжение!R29',
  sup_R33_pricePipe: 'снабжение!R33',
  sup_R37_price: 'снабжение!R37',
  sup_R41_priceTotal: 'снабжение!R41',
  sup_T29_priceMaterial: 'снабжение!T29',
  sup_T30_priceMaterial: 'снабжение!T30',
  sup_T31_priceMaterial: 'снабжение!T31',
  sup_T33_priceMaterialPipe: 'снабжение!T33',
  sup_T34_priceMaterialTotal: 'снабжение!T34',
  sup_T35_priceMaterialTotal: 'снабжение!T35',
  sup_T37_price: 'снабжение!T37',
  sup_T38_price: 'снабжение!T38',
  sup_T39_priceQuantity: 'снабжение!T39',
  sup_T41_priceTotal: 'снабжение!T41',
  sup_T42_priceMaterialInsulationTotal: 'снабжение!T42',
  sup_T43_priceTotal: 'снабжение!T43',
  tech_D27_type: 'технолог!D27',
  tech_E27_weightType: 'технолог!E27',
  tech_F27_quantityType: 'технолог!F27',
  tech_G27_quantityType: 'технолог!G27',
  tech_H27_quantityType: 'технолог!H27',
  tech_I27_quantityType: 'технолог!I27',
  tech_J27_quantityType: 'технолог!J27',
  tech_K27_quantity: 'технолог!K27',
  tech_L27_quantity: 'технолог!L27',
  tech_M27_material: 'технолог!M27',
  tech_P27_materialType: 'технолог!P27',
  tech_Q27_materialType: 'технолог!Q27',
  tech_R27_materialThicknessType: 'технолог!R27',
  tech_S27_materialThicknessType: 'технолог!S27',
  tech_T27_materialThicknessType: 'технолог!T27',
  tech_U27_materialThicknessType: 'технолог!U27',
  tech_V27_thicknessType: 'технолог!V27',
} as const;
