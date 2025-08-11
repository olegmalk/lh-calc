export interface ContractFieldNames {
  // Green cells - Supply inputs (user provided values)
  sup_D10_columnCoverMaterialPrice: number | null;  // Numeric price input, can be empty
  sup_D11_panelMaterialPrice: number | null;  // Numeric price input, can be empty
  sup_D17_panelCuttingCoefficient: number | null;  // Numeric price input, can be empty
  sup_D38_panelGasketsPrice: number | null;  // Numeric price input, can be empty
  sup_D43_studM24x2000Price: number;  // Numeric price (e.g., 3300)
  sup_D44_studM24x1000Price: number;  // Numeric price (e.g., 1750)
  sup_D45_studM20x2000Price: number;  // Numeric price (e.g., 2800)
  sup_D46_studM20M16x1000Price: number;  // Numeric price (e.g., 1200)
  sup_D78_stainlessSteelThickness: number;  // Numeric thickness in mm (e.g., 3)
  sup_D8_flowPartMaterialPricePerKg: number;  // Numeric price per kg (e.g., 700)
  sup_E20_coverCuttingPrice: number | null;  // Numeric price, can be empty
  sup_E21_coverProcessingCost: number | null;  // Numeric price, can be empty
  sup_E26_panelCuttingPrice: number | null;  // Numeric price, can be empty
  sup_E27_panelProcessingCost: number | null;  // Numeric price, can be empty
  sup_E8_flowPartMaterialPrice: number;  // Numeric price per kg (e.g., 700)
  sup_F28_flange1PanelAPrice: number | null;  // Numeric price, can be empty
  sup_F29_flange2PanelAPrice: number | null;  // Numeric price, can be empty
  sup_F2_projectNumber: string;  // Material code or "0000" for none
  sup_F30_pipeBilletFlange1Price: number | null;  // Numeric price, can be empty
  sup_F31_pipeBilletFlange2Price: number | null;  // Numeric price, can be empty
  sup_F32_drainageNozzlePrice: number | null;  // Numeric price, can be empty
  sup_F33_ventilationNozzlePrice: number | null;  // Numeric price, can be empty
  sup_G43_nutM24DIN6330Price: number;  // Numeric price
  sup_G44_nutM24DIN933Price: number;  // Numeric price
  sup_G45_nutM20M16DIN933Price: number;  // Numeric price
  sup_H54_spareFlangeFlange1Price: number;  // Numeric total price
  sup_H55_spareFlangeFlange2Price: number;  // Numeric total price
  sup_H56_spareFlangeFlange3Price: number;  // Numeric total price
  sup_H57_spareFlangeFlange4Price: number;  // Numeric total price
  sup_I38_eyeboltKitMaterialCost: number;  // Numeric price
  sup_I39_eyeboltKitProcessingCost: number;  // Numeric price
  sup_I44_otherMaterialsDesc1: number | null;  // Numeric price, can be empty
  sup_I45_otherMaterialsDesc2: number | null;  // Numeric price, can be empty
  sup_I46_otherMaterialsDesc3: number | null;  // Numeric price, can be empty
  sup_I50_sparePanelStudQuantity: number;  // Numeric price
  sup_I51_sparePanelNutQuantity: number;  // Numeric price
  sup_I52_sparePanelWasherQuantity: number;  // Numeric price
  sup_I54_flangeFastenersFlange1Quantity: number;  // Numeric price
  sup_I55_flangeFastenersFlange2Quantity: number;  // Numeric price
  sup_I56_flangeFastenersFlange3Quantity: number;  // Numeric price
  sup_I57_flangeFastenersFlange4Quantity: number;  // Numeric price
  sup_K13_normHoursPerUnit: number;  // Numeric cost (e.g., 1)
  sup_K20_columnCuttingPrice: number | null;  // Numeric price, can be empty
  sup_K21_columnProcessingCost: number | null;  // Numeric price, can be empty
  sup_K26_panelBCuttingPrice: number | null;  // Numeric price, can be empty
  sup_K27_panelBProcessingCost: number | null;  // Numeric price, can be empty
  sup_K38_supportsKitMaterialCost: number;  // Numeric price
  sup_K39_supportsKitProcessingCost: number;  // Numeric price
  sup_L28_panelBFlange3Price: number | null;  // Numeric price, can be empty
  sup_L29_panelBFlange4Price: number | null;  // Numeric price, can be empty
  sup_L30_panelBPipeBilletFlange3Price: number | null;  // Numeric price, can be empty
  sup_L31_panelBPipeBilletFlange4Price: number | null;  // Numeric price, can be empty
  sup_L32_panelBDrainageNozzlePrice: number | null;  // Numeric price, can be empty
  sup_L33_panelBVentilationNozzlePrice: number | null;  // Numeric price, can be empty
  sup_M38_bracesKitMaterialCost: number;  // Numeric price
  sup_M39_bracesKitProcessingCost: number;  // Numeric quantity
  sup_M44_otherMaterialsCost1: number;  // Numeric price
  sup_M45_otherMaterialsCost2: number;  // Numeric price
  sup_M46_otherMaterialsCost3: number;  // Numeric price
  sup_M51_spareAnchorBoltsCost: number;  // Numeric price
  sup_M52_spareOtherCost: number;  // Numeric price
  sup_N50_sparePanelGasketsQuantity: number;  // Numeric price
  sup_N51_spareAnchorBoltsQuantity: number;  // Numeric price
  sup_N52_spareOtherQuantity: number;  // Numeric price
  sup_N54_spareFlangeGasketsFlange1Quantity: number;  // Numeric quantity
  sup_N55_spareFlangeGasketsFlange2Quantity: number;  // Numeric quantity
  sup_N56_spareFlangeGasketsFlange3Quantity: number;  // Numeric quantity
  sup_N57_spareFlangeGasketsFlange4Quantity: number;  // Numeric quantity
  sup_P13_internalLogistics: number;  // Numeric cost (e.g., 120000)
  sup_P45_unaccountedCost: number;  // Numeric price
  sup_Q22_panelFastenersStudCost: number | null;  // Numeric price, can be empty
  sup_Q23_panelFastenersNutCost: number | null;  // Numeric price, can be empty
  sup_Q24_panelFastenersWasherCost: number | null;  // Numeric price, can be empty
  sup_T29_cofFastenersFlange1KitPrice: number | null;  // Numeric price, can be empty
  sup_T30_cofGasketFlange1Price: number | null;  // Numeric price, can be empty
  sup_T31_cofObturatorFlange1Price: number | null;  // Numeric price, can be empty
  sup_T33_cofFastenersFlange2KitPrice: number | null;  // Numeric price, can be empty
  sup_T34_cofGasketFlange2Price: number | null;  // Numeric price, can be empty
  sup_T35_cofObturatorFlange2Price: number | null;  // Numeric price, can be empty
  sup_T37_cofFastenersFlange3KitPrice: number | null;  // Numeric price, can be empty
  sup_T38_cofGasketFlange3Price: number | null;  // Numeric price, can be empty
  sup_T39_cofObturatorFlange3Price: number | null;  // Numeric price, can be empty
  sup_T41_cofFastenersFlange4KitPrice: number | null;  // Numeric price, can be empty
  sup_T42_cofGasketFlange4Price: number | null;  // Numeric price, can be empty
  sup_T43_cofObturatorFlange4Price: number | null;  // Numeric price, can be empty
  tech_D27_sequenceNumber: number;  // Equipment type number (e.g., 1, 750)
  tech_E27_customerOrderPosition: string;  // Equipment code (e.g., "Е-113", "К4-750")
  tech_H27_passes: string;  // Fraction string (e.g., "1/6", "1/3")
  tech_I27_plateQuantity: number;  // Plate count (e.g., 400)
  tech_J27_calcPressureHotSide: number;  // Pressure in bar (e.g., 22)
  tech_K27_calcPressureColdSide: number;  // Pressure in bar (e.g., 22)
  tech_L27_calcTempHotSide: number;  // Temperature in °C (e.g., 100)
  tech_M27_calcTempColdSide: number;  // Temperature in °C (e.g., 100)
  tech_T27_drawDepth: number;  // Groove depth in mm (e.g., 5)

  // Orange cells - Engineering parameters
  sup_C28_panelAFlange1Pressure: string;  // Flange type, enum: Ду values
  sup_C29_panelAFlange2Pressure: string;  // Flange type, enum: Ду values
  sup_D28_panelAFlange1Diameter: string;  // Flange type, enum: Ду values (e.g., "Ду600")
  sup_D29_panelAFlange2Diameter: string;  // Flange type, enum: Ду values (e.g., "Ду600")
  sup_D9_bodyMaterial: MaterialCode;  // Material dropdown, validated enum
  sup_E19_coverRolledThickness: number | null;  // Numeric price, can be empty
  sup_E25_panelRolledThickness: number | null;  // Numeric price, can be empty
  sup_F39_spareKitsPressureReserve: number;  // Numeric price
  sup_I28_panelBFlange3Pressure: number | null;  // Numeric price, can be empty
  sup_I29_panelBFlange4Pressure: number | null;  // Numeric price, can be empty
  sup_J28_panelBFlange3Diameter: number | null;  // Numeric price, can be empty
  sup_J29_panelBFlange4Diameter: number | null;  // Numeric price, can be empty
  sup_K19_columnRolledThickness: number | null;  // Numeric price, can be empty
  sup_K25_panelBRolledThickness: number | null;  // Numeric price, can be empty
  sup_P19_panelFastenersQuantity: number;  // Numeric price
  sup_P20_panelFastenersMaterial: number | null;  // Numeric price, can be empty
  sup_P21_panelFastenersCoating: number | null;  // Numeric price, can be empty
  sup_P22_panelFastenersStudSize: number | null;  // Numeric price, can be empty
  sup_P29_cofFastenersFlange1Size: number | null;  // Numeric price, can be empty
  sup_P33_cofFastenersFlange2Size: number | null;  // Numeric price, can be empty
  sup_P37_cofFastenersFlange3Size: number | null;  // Numeric price, can be empty
  sup_P41_cofFastenersFlange4Size: number | null;  // Numeric price, can be empty
  sup_Q29_cofFastenersFlange1Material: number | null;  // Numeric price, can be empty
  sup_Q33_cofFastenersFlange2Material: number | null;  // Numeric price, can be empty
  sup_Q37_cofFastenersFlange3Material: number | null;  // Numeric price, can be empty
  sup_Q41_cofFastenersFlange4Material: number | null;  // Numeric price, can be empty
  sup_R29_cofFastenersFlange1Coating: number | null;  // Numeric price, can be empty
  sup_R33_cofFastenersFlange2Coating: number | null;  // Numeric price, can be empty
  sup_R37_cofFastenersFlange3Coating: number | null;  // Numeric price, can be empty
  sup_R41_cofFastenersFlange4Coating: number | null;  // Numeric price, can be empty
  tech_V27_claddingThickness: number;  // Cladding thickness in mm, dropdown enum: 0.8, 1, 1.2, 1.5, 2, 3, 5

  // Yellow cells - Additional user inputs (not computed, despite yellow background)
  tech_F27_deliveryType: DeliveryType;  // Delivery type dropdown, validated enum
  tech_G27_sizeTypeK4: string;  // Equipment size (e.g., "К4-750")
  tech_P27_plateMaterial: PlateMaterial;  // Plate material dropdown, validated enum
  tech_R27_bodyMaterial: FrameMaterial;  // Frame material dropdown, validated enum
  tech_S27_plateSurfaceType: GrooveType;  // Groove type dropdown, validated enum
  tech_U27_plateThickness: number;  // Plate thickness in mm, dropdown enum: 0.8, 1, 1.2, 1.5, 2, 3, 5
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
  sup_C28_panelAFlange1Pressure: 'снабжение!C28',
  sup_C29_panelAFlange2Pressure: 'снабжение!C29',
  sup_D10_columnCoverMaterialPrice: 'снабжение!D10',
  sup_D11_panelMaterialPrice: 'снабжение!D11',
  sup_D17_panelCuttingCoefficient: 'снабжение!D17',
  sup_D28_panelAFlange1Diameter: 'снабжение!D28',
  sup_D29_panelAFlange2Diameter: 'снабжение!D29',
  sup_D38_panelGasketsPrice: 'снабжение!D38',
  sup_D43_studM24x2000Price: 'снабжение!D43',
  sup_D44_studM24x1000Price: 'снабжение!D44',
  sup_D45_studM20x2000Price: 'снабжение!D45',
  sup_D46_studM20M16x1000Price: 'снабжение!D46',
  sup_D78_stainlessSteelThickness: 'снабжение!D78',
  sup_D8_flowPartMaterialPricePerKg: 'снабжение!D8',
  sup_D9_bodyMaterial: 'снабжение!D9',
  sup_E19_coverRolledThickness: 'снабжение!E19',
  sup_E20_coverCuttingPrice: 'снабжение!E20',
  sup_E21_coverProcessingCost: 'снабжение!E21',
  sup_E25_panelRolledThickness: 'снабжение!E25',
  sup_E26_panelCuttingPrice: 'снабжение!E26',
  sup_E27_panelProcessingCost: 'снабжение!E27',
  sup_E8_flowPartMaterialPrice: 'снабжение!E8',
  sup_F28_flange1PanelAPrice: 'снабжение!F28',
  sup_F29_flange2PanelAPrice: 'снабжение!F29',
  sup_F2_projectNumber: 'снабжение!F2',
  sup_F30_pipeBilletFlange1Price: 'снабжение!F30',
  sup_F31_pipeBilletFlange2Price: 'снабжение!F31',
  sup_F32_drainageNozzlePrice: 'снабжение!F32',
  sup_F33_ventilationNozzlePrice: 'снабжение!F33',
  sup_F39_spareKitsPressureReserve: 'снабжение!F39',
  sup_G43_nutM24DIN6330Price: 'снабжение!G43',
  sup_G44_nutM24DIN933Price: 'снабжение!G44',
  sup_G45_nutM20M16DIN933Price: 'снабжение!G45',
  sup_H54_spareFlangeFlange1Price: 'снабжение!H54',
  sup_H55_spareFlangeFlange2Price: 'снабжение!H55',
  sup_H56_spareFlangeFlange3Price: 'снабжение!H56',
  sup_H57_spareFlangeFlange4Price: 'снабжение!H57',
  sup_I28_panelBFlange3Pressure: 'снабжение!I28',
  sup_I29_panelBFlange4Pressure: 'снабжение!I29',
  sup_I38_eyeboltKitMaterialCost: 'снабжение!I38',
  sup_I39_eyeboltKitProcessingCost: 'снабжение!I39',
  sup_I44_otherMaterialsDesc1: 'снабжение!I44',
  sup_I45_otherMaterialsDesc2: 'снабжение!I45',
  sup_I46_otherMaterialsDesc3: 'снабжение!I46',
  sup_I50_sparePanelStudQuantity: 'снабжение!I50',
  sup_I51_sparePanelNutQuantity: 'снабжение!I51',
  sup_I52_sparePanelWasherQuantity: 'снабжение!I52',
  sup_I54_flangeFastenersFlange1Quantity: 'снабжение!I54',
  sup_I55_flangeFastenersFlange2Quantity: 'снабжение!I55',
  sup_I56_flangeFastenersFlange3Quantity: 'снабжение!I56',
  sup_I57_flangeFastenersFlange4Quantity: 'снабжение!I57',
  sup_J28_panelBFlange3Diameter: 'снабжение!J28',
  sup_J29_panelBFlange4Diameter: 'снабжение!J29',
  sup_K13_normHoursPerUnit: 'снабжение!K13',
  sup_K19_columnRolledThickness: 'снабжение!K19',
  sup_K20_columnCuttingPrice: 'снабжение!K20',
  sup_K21_columnProcessingCost: 'снабжение!K21',
  sup_K25_panelBRolledThickness: 'снабжение!K25',
  sup_K26_panelBCuttingPrice: 'снабжение!K26',
  sup_K27_panelBProcessingCost: 'снабжение!K27',
  sup_K38_supportsKitMaterialCost: 'снабжение!K38',
  sup_K39_supportsKitProcessingCost: 'снабжение!K39',
  sup_L28_panelBFlange3Price: 'снабжение!L28',
  sup_L29_panelBFlange4Price: 'снабжение!L29',
  sup_L30_panelBPipeBilletFlange3Price: 'снабжение!L30',
  sup_L31_panelBPipeBilletFlange4Price: 'снабжение!L31',
  sup_L32_panelBDrainageNozzlePrice: 'снабжение!L32',
  sup_L33_panelBVentilationNozzlePrice: 'снабжение!L33',
  sup_M38_bracesKitMaterialCost: 'снабжение!M38',
  sup_M39_bracesKitProcessingCost: 'снабжение!M39',
  sup_M44_otherMaterialsCost1: 'снабжение!M44',
  sup_M45_otherMaterialsCost2: 'снабжение!M45',
  sup_M46_otherMaterialsCost3: 'снабжение!M46',
  sup_M51_spareAnchorBoltsCost: 'снабжение!M51',
  sup_M52_spareOtherCost: 'снабжение!M52',
  sup_N50_sparePanelGasketsQuantity: 'снабжение!N50',
  sup_N51_spareAnchorBoltsQuantity: 'снабжение!N51',
  sup_N52_spareOtherQuantity: 'снабжение!N52',
  sup_N54_spareFlangeGasketsFlange1Quantity: 'снабжение!N54',
  sup_N55_spareFlangeGasketsFlange2Quantity: 'снабжение!N55',
  sup_N56_spareFlangeGasketsFlange3Quantity: 'снабжение!N56',
  sup_N57_spareFlangeGasketsFlange4Quantity: 'снабжение!N57',
  sup_P13_internalLogistics: 'снабжение!P13',
  sup_P19_panelFastenersQuantity: 'снабжение!P19',
  sup_P20_panelFastenersMaterial: 'снабжение!P20',
  sup_P21_panelFastenersCoating: 'снабжение!P21',
  sup_P22_panelFastenersStudSize: 'снабжение!P22',
  sup_P29_cofFastenersFlange1Size: 'снабжение!P29',
  sup_P33_cofFastenersFlange2Size: 'снабжение!P33',
  sup_P37_cofFastenersFlange3Size: 'снабжение!P37',
  sup_P41_cofFastenersFlange4Size: 'снабжение!P41',
  sup_P45_unaccountedCost: 'снабжение!P45',
  sup_Q22_panelFastenersStudCost: 'снабжение!Q22',
  sup_Q23_panelFastenersNutCost: 'снабжение!Q23',
  sup_Q24_panelFastenersWasherCost: 'снабжение!Q24',
  sup_Q29_cofFastenersFlange1Material: 'снабжение!Q29',
  sup_Q33_cofFastenersFlange2Material: 'снабжение!Q33',
  sup_Q37_cofFastenersFlange3Material: 'снабжение!Q37',
  sup_Q41_cofFastenersFlange4Material: 'снабжение!Q41',
  sup_R29_cofFastenersFlange1Coating: 'снабжение!R29',
  sup_R33_cofFastenersFlange2Coating: 'снабжение!R33',
  sup_R37_cofFastenersFlange3Coating: 'снабжение!R37',
  sup_R41_cofFastenersFlange4Coating: 'снабжение!R41',
  sup_T29_cofFastenersFlange1KitPrice: 'снабжение!T29',
  sup_T30_cofGasketFlange1Price: 'снабжение!T30',
  sup_T31_cofObturatorFlange1Price: 'снабжение!T31',
  sup_T33_cofFastenersFlange2KitPrice: 'снабжение!T33',
  sup_T34_cofGasketFlange2Price: 'снабжение!T34',
  sup_T35_cofObturatorFlange2Price: 'снабжение!T35',
  sup_T37_cofFastenersFlange3KitPrice: 'снабжение!T37',
  sup_T38_cofGasketFlange3Price: 'снабжение!T38',
  sup_T39_cofObturatorFlange3Price: 'снабжение!T39',
  sup_T41_cofFastenersFlange4KitPrice: 'снабжение!T41',
  sup_T42_cofGasketFlange4Price: 'снабжение!T42',
  sup_T43_cofObturatorFlange4Price: 'снабжение!T43',
  tech_D27_sequenceNumber: 'технолог!D27',
  tech_E27_customerOrderPosition: 'технолог!E27',
  tech_F27_deliveryType: 'технолог!F27',
  tech_G27_sizeTypeK4: 'технолог!G27',
  tech_H27_passes: 'технолог!H27',
  tech_I27_plateQuantity: 'технолог!I27',
  tech_J27_calcPressureHotSide: 'технолог!J27',
  tech_K27_calcPressureColdSide: 'технолог!K27',
  tech_L27_calcTempHotSide: 'технолог!L27',
  tech_M27_calcTempColdSide: 'технолог!M27',
  tech_P27_plateMaterial: 'технолог!P27',
  tech_Q27_materialType: 'технолог!Q27',
  tech_R27_bodyMaterial: 'технолог!R27',
  tech_S27_plateSurfaceType: 'технолог!S27',
  tech_T27_drawDepth: 'технолог!T27',
  tech_U27_plateThickness: 'технолог!U27',
  tech_V27_claddingThickness: 'технолог!V27',
} as const;
