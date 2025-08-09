/**
 * Field mapping from API field names to Excel cell addresses
 * Extracted from field-names-contract.ts for internal use
 */

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
  sup_E101_priceMassPipeTotal: 'снабжение!E101',
  sup_E105_priceMassPipeTotal: 'снабжение!E105',
  sup_E20_priceWeightThicknessTotal: 'снабжение!E20',
  sup_E21_priceWeightThicknessTotal: 'снабжение!E21',
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
  sup_G43_priceMaterialInsulationTotal: 'снабжение!G43',
  sup_G44_priceMaterialInsulation: 'снабжение!G44',
  sup_G45_priceMaterialInsulation: 'снабжение!G45',
  sup_H54_priceTotal: 'снабжение!H54',
  sup_H64_priceOther: 'снабжение!H64',
  sup_K13_costQuantityNormTotal: 'снабжение!K13',
  sup_P13_costQuantityMaterialNorm: 'снабжение!P13',
  
  // Tech sheet mappings
  tech_D27_type: 'технолог!D27',
  tech_E27_weightType: 'технолог!E27',
  tech_H27_quantityType: 'технолог!H27',
  tech_I27_quantityType: 'технолог!I27',
  tech_J27_quantityType: 'технолог!J27',
  tech_K27_quantity: 'технолог!K27',
  tech_L27_quantity: 'технолог!L27',
  tech_M27_material: 'технолог!M27',
  tech_T27_materialThicknessType: 'технолог!T27',
  tech_V27_thicknessType: 'технолог!V27'
} as const;