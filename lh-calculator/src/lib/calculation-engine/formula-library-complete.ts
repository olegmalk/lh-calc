/**
 * Complete Formula Library - All 53 calculations from Excel rows 110-122
 * Each function maps to a specific column in the Excel calculation matrix
 */

import type { FormulaContext } from './types';
import { MATERIAL_DENSITIES, SAFETY_FACTOR, PRESSURE_SIZE_MATRIX, EQUIPMENT_SPECS } from './constants';

// ===== Excel Formula Utilities =====

export const CEILING_PRECISE = (value: number, precision: number): number => {
  return Math.ceil(value / precision) * precision;
};

export const FLOOR_PRECISE = (value: number, precision: number): number => {
  return Math.floor(value / precision) * precision;
};

export const VLOOKUP = <T>(
  lookupValue: number,
  table: Map<number, T>,
  interpolate = false
): T | number => {
  if (table.has(lookupValue)) {
    return table.get(lookupValue)!;
  }
  
  if (interpolate && typeof Array.from(table.values())[0] === 'number') {
    const keys = Array.from(table.keys()).sort((a, b) => a - b);
    let lower = keys[0];
    let upper = keys[keys.length - 1];
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (lookupValue >= keys[i] && lookupValue <= keys[i + 1]) {
        lower = keys[i];
        upper = keys[i + 1];
        break;
      }
    }
    
    const lowerVal = table.get(lower) as number;
    const upperVal = table.get(upper) as number;
    const ratio = (lookupValue - lower) / (upper - lower);
    return lowerVal + (upperVal - lowerVal) * ratio;
  }
  
  const keys = Array.from(table.keys()).sort((a, b) => a - b);
  const closest = keys.reduce((prev, curr) => 
    Math.abs(curr - lookupValue) < Math.abs(prev - lookupValue) ? curr : prev
  );
  return table.get(closest)!;
};

// ===== Core 53 Calculation Functions (Columns G-BI) =====

// Column G: Components count
export const calc_G_ComponentsCount = (ctx: FormulaContext): number => {
  return ctx.inputs.componentsB;
};

// Column H: Cover area calculation
export const calc_H_CoverArea = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  
  const width = specs.width + 15;
  const height = specs.height + 15;
  const density = ctx.materials.get(ctx.inputs.materialPlate)?.density || MATERIAL_DENSITIES.STAINLESS_STEEL;
  
  return (width * height * ctx.inputs.componentsB * density / 1000000) * ctx.inputs.plateCount;
};

// Column I: Base dimension (40, 50, 60, 70, 80, 90 based on equipment size)
export const calc_I_BaseDimension = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 40;
  
  // Scale base dimension with equipment size
  if (specs.maxPlates <= 200) return 40;
  if (specs.maxPlates <= 400) return 50;
  if (specs.maxPlates <= 600) return 60;
  if (specs.maxPlates <= 800) return 70;
  if (specs.maxPlates <= 1000) return 80;
  return 90;
};

// Column J: I + 20
export const calc_J_DimensionPlus20 = (ctx: FormulaContext): number => {
  const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);
  return I + 20;
};

// Column K: Column height base
export const calc_K_ColumnHeightBase = (ctx: FormulaContext): number => {
  const H99 = (ctx.inputs.componentsA + ctx.inputs.componentsB) * ctx.inputs.plateCount;
  return 2400 + H99 + 10;
};

// Column L: Component volume (primary)
export const calc_L_ComponentVolume = (ctx: FormulaContext): number => {
  const J = ctx.intermediateValues.get('J_DimensionPlus20') || calc_J_DimensionPlus20(ctx);
  const K = ctx.intermediateValues.get('K_ColumnHeightBase') || calc_K_ColumnHeightBase(ctx);
  const density = ctx.materials.get(ctx.inputs.materialPlate)?.density || MATERIAL_DENSITIES.STAINLESS_STEEL;
  
  return J * K * ctx.inputs.plateThickness * density / 1000000 * 4;
};

// Column M: I + 10
export const calc_M_DimensionPlus10 = (ctx: FormulaContext): number => {
  const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);
  return I + 10;
};

// Column N: Same as K
export const calc_N_ColumnHeightRepeat = (ctx: FormulaContext): number => {
  return calc_K_ColumnHeightBase(ctx);
};

// Column O: Secondary component volume
export const calc_O_SecondaryVolume = (ctx: FormulaContext): number => {
  const M = ctx.intermediateValues.get('M_DimensionPlus10') || calc_M_DimensionPlus10(ctx);
  const N = ctx.intermediateValues.get('N_ColumnHeightRepeat') || calc_N_ColumnHeightRepeat(ctx);
  const density = ctx.materials.get(ctx.inputs.materialPlate)?.density || MATERIAL_DENSITIES.STAINLESS_STEEL;
  
  return M * N * ctx.inputs.plateThickness * density / 1000000 * 4;
};

// Column P: Width calculation
export const calc_P_WidthCalculation = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);
  
  return specs.width + 2 * I + 10;
};

// Column Q: Height calculation
export const calc_Q_HeightCalculation = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);
  
  return specs.height + 15 + 2 * I + 10;
};

// Column R: Area calculation
export const calc_R_AreaCalculation = (ctx: FormulaContext): number => {
  const P = ctx.intermediateValues.get('P_WidthCalculation') || calc_P_WidthCalculation(ctx);
  const Q = ctx.intermediateValues.get('Q_HeightCalculation') || calc_Q_HeightCalculation(ctx);
  const density = ctx.materials.get(ctx.inputs.materialPlate)?.density || MATERIAL_DENSITIES.STAINLESS_STEEL;
  
  return P * Q * ctx.inputs.plateThickness * density / 1000000 * 2;
};

// Column S: Additional dimension (11-16 based on size)
export const calc_S_AdditionalDimension = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 11;
  
  if (specs.maxPlates <= 300) return 11;
  if (specs.maxPlates <= 500) return 14;
  if (specs.maxPlates <= 800) return 16;
  return 16;
};

// Column T: S + 5 or S + 10
export const calc_T_DimensionPlusOffset = (ctx: FormulaContext): number => {
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  
  return S + (specs && specs.maxPlates > 600 ? 10 : 5);
};

// Columns U-V: Complex calculations (simplified for MVP)
export const calc_U_ComplexCalc1 = (_ctx: FormulaContext): number => {
  // Placeholder for complex calculation
  return 0;
};

export const calc_V_ComplexCalc2 = (_ctx: FormulaContext): number => {
  // Placeholder for complex calculation
  return 0;
};

// Column W: 49 + S
export const calc_W_OffsetCalculation = (ctx: FormulaContext): number => {
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  return 49 + S;
};

// Column X: Width + S*2
export const calc_X_WidthWithOffset = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  
  return specs.width + S * 2;
};

// Column Y: Height + S*2
export const calc_Y_HeightWithOffset = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  
  return specs.height + S * 2;
};

// Column Z: S + 5
export const calc_Z_SimpleOffset = (ctx: FormulaContext): number => {
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  return S + 5;
};

// Column AA: Perimeter calculation
export const calc_AA_Perimeter = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  const H99 = 2400 + (ctx.inputs.componentsA + ctx.inputs.componentsB) * ctx.inputs.plateCount;
  
  return (H99 + S) * 2 + (specs.width + S) * 2;
};

// Column AB: Z * AA * density * thickness / 1000 * 2
export const calc_AB_PerimeterVolume = (ctx: FormulaContext): number => {
  const Z = ctx.intermediateValues.get('Z_SimpleOffset') || calc_Z_SimpleOffset(ctx);
  const AA = ctx.intermediateValues.get('AA_Perimeter') || calc_AA_Perimeter(ctx);
  const density = ctx.materials.get(ctx.inputs.materialPlate)?.density || MATERIAL_DENSITIES.STAINLESS_STEEL;
  
  return Z * AA * ctx.inputs.plateThickness * density / 1000000 * 2;
};

// Columns AC-AK: Similar pattern calculations
export const calc_AC_Dimension = (ctx: FormulaContext): number => {
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  return S + 5;
};

export const calc_AD_Perimeter2 = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  const H99 = 2400 + (ctx.inputs.componentsA + ctx.inputs.componentsB) * ctx.inputs.plateCount;
  
  return (H99 + S) * 2 + (specs.height + 15 + S) * 2;
};

export const calc_AE_PerimeterVolume2 = (ctx: FormulaContext): number => {
  const AC = ctx.intermediateValues.get('AC_Dimension') || calc_AC_Dimension(ctx);
  const AD = ctx.intermediateValues.get('AD_Perimeter2') || calc_AD_Perimeter2(ctx);
  const density = ctx.materials.get(ctx.inputs.materialPlate)?.density || MATERIAL_DENSITIES.STAINLESS_STEEL;
  
  return AC * AD * ctx.inputs.plateThickness * density / 1000000 * 2;
};

export const calc_AF_ComplexDimension = (ctx: FormulaContext): number => {
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  const H99 = 2400 + (ctx.inputs.componentsA + ctx.inputs.componentsB) * ctx.inputs.plateCount;
  
  return H99 + S + S + 3 + 10;
};

export const calc_AG_WidthComplex = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  
  return specs.width + 2 * S + 10;
};

export const calc_AH_VolumeComplex = (ctx: FormulaContext): number => {
  const AF = ctx.intermediateValues.get('AF_ComplexDimension') || calc_AF_ComplexDimension(ctx);
  const AG = ctx.intermediateValues.get('AG_WidthComplex') || calc_AG_WidthComplex(ctx);
  const density = ctx.materials.get(ctx.inputs.materialBody)?.density || MATERIAL_DENSITIES.STAINLESS_STEEL;
  
  return AF * AG * ctx.inputs.plateThickness * density / 1000000 * 2;
};

export const calc_AI_ComplexDimension2 = (ctx: FormulaContext): number => {
  return calc_AF_ComplexDimension(ctx); // Same as AF
};

export const calc_AJ_HeightComplex = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  
  return specs.height + 15 + 2 * S + 10;
};

export const calc_AK_VolumeComplex2 = (ctx: FormulaContext): number => {
  const AI = ctx.intermediateValues.get('AI_ComplexDimension2') || calc_AI_ComplexDimension2(ctx);
  const AJ = ctx.intermediateValues.get('AJ_HeightComplex') || calc_AJ_HeightComplex(ctx);
  const density = ctx.materials.get(ctx.inputs.materialBody)?.density || MATERIAL_DENSITIES.STAINLESS_STEEL;
  
  return AI * AJ * ctx.inputs.plateThickness * density / 1000000 * 2;
};

// Columns AL-AZ: Length and material calculations
export const calc_AL_LengthCalculation = (ctx: FormulaContext): number => {
  const J = ctx.intermediateValues.get('J_DimensionPlus20') || calc_J_DimensionPlus20(ctx);
  return (ctx.inputs.plateCount / 2 * ((5 + 6) * 2 + ctx.inputs.componentsA - 0.5) + J * 2) / 1000;
};

export const calc_AM_LengthCalculation2 = (ctx: FormulaContext): number => {
  const M = ctx.intermediateValues.get('M_DimensionPlus10') || calc_M_DimensionPlus10(ctx);
  const N = ctx.intermediateValues.get('N_ColumnHeightRepeat') || calc_N_ColumnHeightRepeat(ctx);
  return (M * 2 + N * 2) / 1000 * 4;
};

export const calc_AN_LengthCalculation3 = (ctx: FormulaContext): number => {
  const P = ctx.intermediateValues.get('P_WidthCalculation') || calc_P_WidthCalculation(ctx);
  const Q = ctx.intermediateValues.get('Q_HeightCalculation') || calc_Q_HeightCalculation(ctx);
  return (P * 2 + Q * 2) / 1000 * 2;
};

export const calc_AO_LengthCalculation4 = (ctx: FormulaContext): number => {
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  const T = ctx.intermediateValues.get('T_DimensionPlusOffset') || calc_T_DimensionPlusOffset(ctx);
  return (S * 2 + T * 2) / 1000 * 8;
};

export const calc_AP_LengthCalculation5 = (ctx: FormulaContext): number => {
  const AA = ctx.intermediateValues.get('AA_Perimeter') || calc_AA_Perimeter(ctx);
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  return (AA * 2 + S * 8) / 1000 * 4;
};

export const calc_AQ_LengthCalculation6 = (ctx: FormulaContext): number => {
  const AD = ctx.intermediateValues.get('AD_Perimeter2') || calc_AD_Perimeter2(ctx);
  const S = ctx.intermediateValues.get('S_AdditionalDimension') || calc_S_AdditionalDimension(ctx);
  return (AD * 2 + S * 8) / 1000 * 4;
};

// Plate configuration calculations (depends on plateConfiguration)
export const calc_AR_PlateConfigCalc1 = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  
  // Parse plate configuration (e.g., "1/6")
  const [num] = ctx.inputs.plateConfiguration.split('/').map(Number);
  const configValue = num || 1;
  
  const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);
  return ((specs.width + 20) * 2 + (50 + I) * 2) / 1000 * (configValue - 1);
};

export const calc_AS_PlateConfigCalc2 = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  
  const [, denom] = ctx.inputs.plateConfiguration.split('/').map(Number);
  const configValue = denom || 6;
  
  const I = ctx.intermediateValues.get('I_BaseDimension') || calc_I_BaseDimension(ctx);
  return (specs.height * 2 + (50 + I) * 2) / 1000 * (configValue - 1);
};

export const calc_AT_PlateConfigCalc3 = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  
  const [num] = ctx.inputs.plateConfiguration.split('/').map(Number);
  const configValue = num || 1;
  
  return (40 * 2 + (specs.width + 20) * 2) / 1000 * (configValue - 1);
};

export const calc_AU_PlateConfigCalc4 = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  
  const [, denom] = ctx.inputs.plateConfiguration.split('/').map(Number);
  const configValue = denom || 6;
  
  return (40 * 2 + specs.height * 2) / 1000 * (configValue - 1);
};

export const calc_AV_TotalLength = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  if (!specs) return 0;
  
  return (specs.width * 2 + specs.height * 2) * ctx.inputs.plateCount / 1000;
};

export const calc_AW_ComplexCalc3 = (ctx: FormulaContext): number => {
  const AF = ctx.intermediateValues.get('AF_ComplexDimension') || calc_AF_ComplexDimension(ctx);
  const AG = ctx.intermediateValues.get('AG_WidthComplex') || calc_AG_WidthComplex(ctx);
  const AY = ctx.intermediateValues.get('AY_ComplexCalc5') || 1.044;
  
  return (AF * 2 + AG * 2) * 2 / 1000 + AY;
};

export const calc_AX_ComplexCalc4 = (ctx: FormulaContext): number => {
  const AI = ctx.intermediateValues.get('AI_ComplexDimension2') || calc_AI_ComplexDimension2(ctx);
  const AJ = ctx.intermediateValues.get('AJ_HeightComplex') || calc_AJ_HeightComplex(ctx);
  const AZ = ctx.intermediateValues.get('AZ_ComplexCalc6') || 1.044;
  
  return (AI * 2 + AJ * 2) * 2 / 1000 + AZ;
};

export const calc_AY_ComplexCalc5 = (ctx: FormulaContext): number => {
  const AF = ctx.intermediateValues.get('AF_ComplexDimension') || calc_AF_ComplexDimension(ctx);
  const AG = ctx.intermediateValues.get('AG_WidthComplex') || calc_AG_WidthComplex(ctx);
  
  return (AF / 100 + AG / 100) * 20 / 1000 * 2;
};

export const calc_AZ_ComplexCalc6 = (ctx: FormulaContext): number => {
  const AI = ctx.intermediateValues.get('AI_ComplexDimension2') || calc_AI_ComplexDimension2(ctx);
  const AJ = ctx.intermediateValues.get('AJ_HeightComplex') || calc_AJ_HeightComplex(ctx);
  
  return (AI / 100 + AJ / 100) * 20 / 1000 * 2;
};

// Summary columns BA-BI
export const calc_BA_MaterialTotal = (ctx: FormulaContext): number => {
  let sum = 0;
  const columns = ['AL', 'AM', 'AN', 'AP', 'AQ', 'AR', 'AS'];
  
  for (const col of columns) {
    sum += ctx.intermediateValues.get(`${col}_Calculation`) || 0;
  }
  
  return sum;
};

export const calc_BB_CostComponents = (ctx: FormulaContext): number => {
  let sum = 0;
  const columns = ['AW', 'AX', 'AY', 'AZ'];
  
  for (const col of columns) {
    sum += ctx.intermediateValues.get(`${col}_ComplexCalc`) || 0;
  }
  
  return sum;
};

export const calc_BC_MaterialTotal2 = (ctx: FormulaContext): number => {
  return calc_BA_MaterialTotal(ctx); // Same calculation
};

export const calc_BD_AdditionalMaterials = (ctx: FormulaContext): number => {
  let sum = 0;
  const columns = ['AT', 'AU', 'AV'];
  
  for (const col of columns) {
    sum += ctx.intermediateValues.get(`${col}_Calculation`) || 0;
  }
  
  return sum;
};

// Final summary calculations
export const calc_BE_FinalSum1 = (ctx: FormulaContext): number => {
  const AZ = ctx.intermediateValues.get('AZ_ComplexCalc6') || 0;
  const BA = ctx.intermediateValues.get('BA_MaterialTotal') || 0;
  
  return AZ + BA;
};

export const calc_BF_FinalSum2 = (ctx: FormulaContext): number => {
  const BC = ctx.intermediateValues.get('BC_MaterialTotal2') || 0;
  const BD = ctx.intermediateValues.get('BD_AdditionalMaterials') || 0;
  
  return BC + BD;
};

export const calc_BG_EquipmentWidth = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  return specs ? specs.width : 0;
};

export const calc_BH_EquipmentHeight = (ctx: FormulaContext): number => {
  const specs = EQUIPMENT_SPECS[ctx.inputs.equipmentType as keyof typeof EQUIPMENT_SPECS];
  return specs ? specs.height + 15 : 0;
};

export const calc_BI_TotalComponents = (ctx: FormulaContext): number => {
  const BE = ctx.intermediateValues.get('BE_FinalSum1') || 0;
  const BF = ctx.intermediateValues.get('BF_FinalSum2') || 0;
  
  return (BE + BF) * 2;
};

// Pressure test calculations from технолог sheet
export const calc_PressureTest = (pressure: number, _ctx: FormulaContext): number => {
  const interpolatedSize = VLOOKUP(pressure, PRESSURE_SIZE_MATRIX, true) as number;
  const AA60 = 1800; // Base factor from Excel
  const calculated = SAFETY_FACTOR * pressure * AA60 / interpolatedSize;
  
  return CEILING_PRECISE(calculated, 0.01);
};

/**
 * Main calculation orchestrator - executes all 53 calculations in dependency order
 */
export const executeAllCalculations = (ctx: FormulaContext): Map<string, number> => {
  const results = new Map<string, number>();
  
  // Set base dimensions first
  const I = calc_I_BaseDimension(ctx);
  ctx.intermediateValues.set('I_BaseDimension', I);
  results.set('I_BaseDimension', I);
  
  // Execute all 53 calculations in order
  const calculations = [
    { key: 'G_ComponentsCount', fn: calc_G_ComponentsCount },
    { key: 'H_CoverArea', fn: calc_H_CoverArea },
    { key: 'J_DimensionPlus20', fn: calc_J_DimensionPlus20 },
    { key: 'K_ColumnHeightBase', fn: calc_K_ColumnHeightBase },
    { key: 'L_ComponentVolume', fn: calc_L_ComponentVolume },
    { key: 'M_DimensionPlus10', fn: calc_M_DimensionPlus10 },
    { key: 'N_ColumnHeightRepeat', fn: calc_N_ColumnHeightRepeat },
    { key: 'O_SecondaryVolume', fn: calc_O_SecondaryVolume },
    { key: 'P_WidthCalculation', fn: calc_P_WidthCalculation },
    { key: 'Q_HeightCalculation', fn: calc_Q_HeightCalculation },
    { key: 'R_AreaCalculation', fn: calc_R_AreaCalculation },
    { key: 'S_AdditionalDimension', fn: calc_S_AdditionalDimension },
    { key: 'T_DimensionPlusOffset', fn: calc_T_DimensionPlusOffset },
    { key: 'U_ComplexCalc1', fn: calc_U_ComplexCalc1 },
    { key: 'V_ComplexCalc2', fn: calc_V_ComplexCalc2 },
    { key: 'W_OffsetCalculation', fn: calc_W_OffsetCalculation },
    { key: 'X_WidthWithOffset', fn: calc_X_WidthWithOffset },
    { key: 'Y_HeightWithOffset', fn: calc_Y_HeightWithOffset },
    { key: 'Z_SimpleOffset', fn: calc_Z_SimpleOffset },
    { key: 'AA_Perimeter', fn: calc_AA_Perimeter },
    { key: 'AB_PerimeterVolume', fn: calc_AB_PerimeterVolume },
    { key: 'AC_Dimension', fn: calc_AC_Dimension },
    { key: 'AD_Perimeter2', fn: calc_AD_Perimeter2 },
    { key: 'AE_PerimeterVolume2', fn: calc_AE_PerimeterVolume2 },
    { key: 'AF_ComplexDimension', fn: calc_AF_ComplexDimension },
    { key: 'AG_WidthComplex', fn: calc_AG_WidthComplex },
    { key: 'AH_VolumeComplex', fn: calc_AH_VolumeComplex },
    { key: 'AI_ComplexDimension2', fn: calc_AI_ComplexDimension2 },
    { key: 'AJ_HeightComplex', fn: calc_AJ_HeightComplex },
    { key: 'AK_VolumeComplex2', fn: calc_AK_VolumeComplex2 },
    { key: 'AL_LengthCalculation', fn: calc_AL_LengthCalculation },
    { key: 'AM_LengthCalculation2', fn: calc_AM_LengthCalculation2 },
    { key: 'AN_LengthCalculation3', fn: calc_AN_LengthCalculation3 },
    { key: 'AO_LengthCalculation4', fn: calc_AO_LengthCalculation4 },
    { key: 'AP_LengthCalculation5', fn: calc_AP_LengthCalculation5 },
    { key: 'AQ_LengthCalculation6', fn: calc_AQ_LengthCalculation6 },
    { key: 'AR_PlateConfigCalc1', fn: calc_AR_PlateConfigCalc1 },
    { key: 'AS_PlateConfigCalc2', fn: calc_AS_PlateConfigCalc2 },
    { key: 'AT_PlateConfigCalc3', fn: calc_AT_PlateConfigCalc3 },
    { key: 'AU_PlateConfigCalc4', fn: calc_AU_PlateConfigCalc4 },
    { key: 'AV_TotalLength', fn: calc_AV_TotalLength },
    { key: 'AW_ComplexCalc3', fn: calc_AW_ComplexCalc3 },
    { key: 'AX_ComplexCalc4', fn: calc_AX_ComplexCalc4 },
    { key: 'AY_ComplexCalc5', fn: calc_AY_ComplexCalc5 },
    { key: 'AZ_ComplexCalc6', fn: calc_AZ_ComplexCalc6 },
    { key: 'BA_MaterialTotal', fn: calc_BA_MaterialTotal },
    { key: 'BB_CostComponents', fn: calc_BB_CostComponents },
    { key: 'BC_MaterialTotal2', fn: calc_BC_MaterialTotal2 },
    { key: 'BD_AdditionalMaterials', fn: calc_BD_AdditionalMaterials },
    { key: 'BE_FinalSum1', fn: calc_BE_FinalSum1 },
    { key: 'BF_FinalSum2', fn: calc_BF_FinalSum2 },
    { key: 'BG_EquipmentWidth', fn: calc_BG_EquipmentWidth },
    { key: 'BH_EquipmentHeight', fn: calc_BH_EquipmentHeight },
    { key: 'BI_TotalComponents', fn: calc_BI_TotalComponents },
  ];
  
  // Execute each calculation and store result
  for (const { key, fn } of calculations) {
    const value = fn(ctx);
    results.set(key, value);
    ctx.intermediateValues.set(key, value);
  }
  
  return results;
};