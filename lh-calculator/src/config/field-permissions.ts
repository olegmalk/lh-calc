/**
 * Field-to-Color Mapping Configuration
 * Epic 1, Story 1.1: Maps each input field to its role-based color category
 * Based on Excel color model from UX_FIELD_SEPARATION_ARCHITECTURE.md
 */

import type { FieldPermission, FieldColor } from '../types/roles.types';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';

// Field to color mapping based on Excel color model
export const FIELD_PERMISSIONS: Record<keyof HeatExchangerInput, FieldPermission> = {
  // ====================================
  // TECHNICAL SPECIFICATION (Technologist)
  // ====================================
  
  // Yellow fields: Technologist dropdowns (VLOOKUP drivers)
  'equipmentType': {
    field: 'equipmentType',
    color: 'yellow',
    section: 'technical',
    description: 'Equipment type selection (VLOOKUP driver)'
  },
  
  'materialPlate': {
    field: 'materialPlate',
    color: 'yellow',
    section: 'technical',
    description: 'Plate material (cost driver)'
  },
  
  'surfaceType': {
    field: 'surfaceType',
    color: 'yellow',
    section: 'technical',
    description: 'Surface configuration (manufacturing cost)'
  },
  
  'corrugationType': {
    field: 'corrugationType',
    color: 'yellow',
    section: 'technical',
    description: 'Corrugation type (performance factor)'
  },
  
  // Green fields: Manual entry (Technologist/Supply shared)
  'plateCount': {
    field: 'plateCount',
    color: 'green',
    section: 'technical',
    description: 'Number of plates (core calculation)'
  },
  
  'bodyMaterial': {
    field: 'bodyMaterial',
    color: 'green',
    section: 'technical',
    description: 'Housing material (cost factor)'
  },
  
  'materialBody': {
    field: 'materialBody',
    color: 'green',
    section: 'technical',
    description: 'Body material specification'
  },
  
  'plateThickness': {
    field: 'plateThickness',
    color: 'green',
    section: 'technical',
    description: 'Thickness in mm (mass calculation)'
  },
  
  'pressureA': {
    field: 'pressureA',
    color: 'green',
    section: 'technical',
    description: 'Operating pressure A (test pressure calc)'
  },
  
  'pressureB': {
    field: 'pressureB',
    color: 'green',
    section: 'technical',
    description: 'Operating pressure B (test pressure calc)'
  },
  
  'temperatureA': {
    field: 'temperatureA',
    color: 'green',
    section: 'technical',
    description: 'Operating temperature A (material selection)'
  },
  
  'temperatureB': {
    field: 'temperatureB',
    color: 'green',
    section: 'technical',
    description: 'Operating temperature B (material selection)'
  },
  
  // Supporting technical fields
  'modelCode': { field: 'modelCode', color: 'yellow', section: 'technical' },
  'plateConfiguration': { field: 'plateConfiguration', color: 'yellow', section: 'technical' },
  'claddingMaterial': { field: 'claddingMaterial', color: 'green', section: 'technical' },
  'drawDepth': { field: 'drawDepth', color: 'green', section: 'technical' },
  'claddingThickness': { field: 'claddingThickness', color: 'green', section: 'technical' },
  'plateLength': { field: 'plateLength', color: 'green', section: 'technical' },
  'testPressureHot': { field: 'testPressureHot', color: 'readonly', section: 'technical' },
  'testPressureCold': { field: 'testPressureCold', color: 'readonly', section: 'technical' },
  
  // Configuration parameters
  'solutionDensity': { field: 'solutionDensity', color: 'green', section: 'technical' },
  'solutionVolume': { field: 'solutionVolume', color: 'yellow', section: 'technical' },
  'equipmentTypeDetail': { field: 'equipmentTypeDetail', color: 'yellow', section: 'technical' },
  'flowRatio': { field: 'flowRatio', color: 'yellow', section: 'technical' },
  'additionalPlatesFactor': { field: 'additionalPlatesFactor', color: 'green', section: 'technical' },
  'panelCountFactor': { field: 'panelCountFactor', color: 'green', section: 'technical' },
  'componentsA': { field: 'componentsA', color: 'green', section: 'technical' },
  'componentsB': { field: 'componentsB', color: 'green', section: 'technical' },
  
  // ====================================
  // ENGINEERING DESIGN (Design Engineer)
  // ====================================
  
  // Orange fields: Engineering specifications
  'flangeHotPressure1': {
    field: 'flangeHotPressure1',
    color: 'orange',
    section: 'engineering',
    description: 'Flange pressure rating (component cost)'
  },
  
  'flangeHotDiameter1': {
    field: 'flangeHotDiameter1',
    color: 'orange',
    section: 'engineering',
    description: 'Flange size (component cost)'
  },
  
  'flangeHotPressure2': { field: 'flangeHotPressure2', color: 'orange', section: 'engineering' },
  'flangeHotDiameter2': { field: 'flangeHotDiameter2', color: 'orange', section: 'engineering' },
  'flangeColdPressure1': { field: 'flangeColdPressure1', color: 'orange', section: 'engineering' },
  'flangeColdDiameter1': { field: 'flangeColdDiameter1', color: 'orange', section: 'engineering' },
  'flangeColdPressure2': { field: 'flangeColdPressure2', color: 'orange', section: 'engineering' },
  'flangeColdDiameter2': { field: 'flangeColdDiameter2', color: 'orange', section: 'engineering' },
  
  'mountingPanelsCount': {
    field: 'mountingPanelsCount',
    color: 'orange',
    section: 'engineering',
    description: 'Mounting panels (material cost)'
  },
  
  // Extended engineering specs
  'plateArea': { field: 'plateArea', color: 'readonly', section: 'engineering' },
  'channelHeight': { field: 'channelHeight', color: 'orange', section: 'engineering' },
  'channelWidth': { field: 'channelWidth', color: 'orange', section: 'engineering' },
  'frameThickness': { field: 'frameThickness', color: 'orange', section: 'engineering' },
  'frameMaterial': { field: 'frameMaterial', color: 'orange', section: 'engineering' },
  'insulationThickness': { field: 'insulationThickness', color: 'orange', section: 'engineering' },
  'insulationType': { field: 'insulationType', color: 'orange', section: 'engineering' },
  
  // Process parameters (engineering related)
  'operatingPressureA': { field: 'operatingPressureA', color: 'orange', section: 'engineering' },
  'operatingPressureB': { field: 'operatingPressureB', color: 'orange', section: 'engineering' },
  'designTemperatureA': { field: 'designTemperatureA', color: 'orange', section: 'engineering' },
  'designTemperatureB': { field: 'designTemperatureB', color: 'orange', section: 'engineering' },
  'flowRateA': { field: 'flowRateA', color: 'orange', section: 'engineering' },
  'flowRateB': { field: 'flowRateB', color: 'orange', section: 'engineering' },
  'pressureDropA': { field: 'pressureDropA', color: 'orange', section: 'engineering' },
  'pressureDropB': { field: 'pressureDropB', color: 'orange', section: 'engineering' },
  
  // Fastener specifications (engineering)
  'boltType': { field: 'boltType', color: 'orange', section: 'engineering' },
  'boltMaterial': { field: 'boltMaterial', color: 'orange', section: 'engineering' },
  'boltQuantity': { field: 'boltQuantity', color: 'orange', section: 'engineering' },
  'nutType': { field: 'nutType', color: 'orange', section: 'engineering' },
  'nutMaterial': { field: 'nutMaterial', color: 'orange', section: 'engineering' },
  'nutQuantity': { field: 'nutQuantity', color: 'orange', section: 'engineering' },
  'washerType': { field: 'washerType', color: 'orange', section: 'engineering' },
  'washerQuantity': { field: 'washerQuantity', color: 'orange', section: 'engineering' },
  
  // Manufacturing details (engineering)
  'weldingMethod': { field: 'weldingMethod', color: 'orange', section: 'engineering' },
  'weldingMaterial': { field: 'weldingMaterial', color: 'orange', section: 'engineering' },
  'surfaceTreatment': { field: 'surfaceTreatment', color: 'orange', section: 'engineering' },
  'paintType': { field: 'paintType', color: 'orange', section: 'engineering' },
  'paintThickness': { field: 'paintThickness', color: 'orange', section: 'engineering' },
  'qualityControl': { field: 'qualityControl', color: 'orange', section: 'engineering' },
  'certificationRequired': { field: 'certificationRequired', color: 'orange', section: 'engineering' },
  'inspectionLevel': { field: 'inspectionLevel', color: 'orange', section: 'engineering' },
  
  // ====================================
  // SUPPLY/PROCUREMENT (Supply Manager)
  // ====================================
  
  // Green fields: Supply cost parameters (direct cost factors)
  
  'laborCoefficient': {
    field: 'laborCoefficient',
    color: 'green',
    section: 'supply',
    description: 'Labor coefficient (cost multiplier)'
  },
  
  'materialCoefficient': {
    field: 'materialCoefficient',
    color: 'green',
    section: 'supply',
    description: 'Material coefficient (cost multiplier)'
  },
  
  // Component costs (direct cost additions)
  'componentCost1': { field: 'componentCost1', color: 'green', section: 'supply' },
  'componentCost2': { field: 'componentCost2', color: 'green', section: 'supply' },
  'componentCost3': { field: 'componentCost3', color: 'green', section: 'supply' },
  'componentCost4': { field: 'componentCost4', color: 'green', section: 'supply' },
  'additionalCost1': { field: 'additionalCost1', color: 'green', section: 'supply' },
  'additionalCost2': { field: 'additionalCost2', color: 'green', section: 'supply' },
  'additionalCost3': { field: 'additionalCost3', color: 'green', section: 'supply' },
  
  // Process costs (manufacturing costs)
  'processCost1': { field: 'processCost1', color: 'green', section: 'supply' },
  'processCost2': { field: 'processCost2', color: 'green', section: 'supply' },
  'processCost3': { field: 'processCost3', color: 'green', section: 'supply' },
  'processCost4': { field: 'processCost4', color: 'green', section: 'supply' },
  'assemblyWork1': { field: 'assemblyWork1', color: 'green', section: 'supply' },
  'assemblyWork2': { field: 'assemblyWork2', color: 'green', section: 'supply' },
  'additionalWork1': { field: 'additionalWork1', color: 'green', section: 'supply' },
  'additionalWork2': { field: 'additionalWork2', color: 'green', section: 'supply' },
  
  // Material costs (material additions)
  'materialCost1': { field: 'materialCost1', color: 'green', section: 'supply' },
  'materialCost2': { field: 'materialCost2', color: 'green', section: 'supply' },
  'materialCost3': { field: 'materialCost3', color: 'green', section: 'supply' },
  'extraCost': { field: 'extraCost', color: 'green', section: 'supply' },
  
  // Supply parameters
  'plateMaterialPricePerKg': { field: 'plateMaterialPricePerKg', color: 'green', section: 'supply' },
  'claddingMaterialPricePerKg': { field: 'claddingMaterialPricePerKg', color: 'green', section: 'supply' },
  'columnCoverMaterialPricePerKg': { field: 'columnCoverMaterialPricePerKg', color: 'green', section: 'supply' },
  'panelMaterialPricePerKg': { field: 'panelMaterialPricePerKg', color: 'green', section: 'supply' },
  'laborRatePerHour': { field: 'laborRatePerHour', color: 'green', section: 'supply' },
  'cuttingCostPerMeter': { field: 'cuttingCostPerMeter', color: 'green', section: 'supply' },
  'internalLogisticsCost': { field: 'internalLogisticsCost', color: 'green', section: 'supply' },
  'standardLaborHours': { field: 'standardLaborHours', color: 'green', section: 'supply' },
  'panelFastenerQuantity': { field: 'panelFastenerQuantity', color: 'green', section: 'supply' },
  'claddingCuttingCorrection': { field: 'claddingCuttingCorrection', color: 'green', section: 'supply' },
  'columnCuttingCorrection': { field: 'columnCuttingCorrection', color: 'green', section: 'supply' },
  'coverCuttingCorrection': { field: 'coverCuttingCorrection', color: 'green', section: 'supply' },
  'panelCuttingCorrection': { field: 'panelCuttingCorrection', color: 'green', section: 'supply' },
  
  // Additional cost arrays
  'additionalMaterial1': { field: 'additionalMaterial1', color: 'green', section: 'supply' },
  'additionalMaterialCost1': { field: 'additionalMaterialCost1', color: 'green', section: 'supply' },
  'additionalMaterial2': { field: 'additionalMaterial2', color: 'green', section: 'supply' },
  'additionalMaterialCost2': { field: 'additionalMaterialCost2', color: 'green', section: 'supply' },
  'additionalMaterial3': { field: 'additionalMaterial3', color: 'green', section: 'supply' },
  'additionalMaterialCost3': { field: 'additionalMaterialCost3', color: 'green', section: 'supply' },
  'additionalLabor1': { field: 'additionalLabor1', color: 'green', section: 'supply' },
  'additionalLaborCost1': { field: 'additionalLaborCost1', color: 'green', section: 'supply' },
  'additionalLabor2': { field: 'additionalLabor2', color: 'green', section: 'supply' },
  'additionalLaborCost2': { field: 'additionalLaborCost2', color: 'green', section: 'supply' },
  'additionalLabor3': { field: 'additionalLabor3', color: 'green', section: 'supply' },
  'additionalLaborCost3': { field: 'additionalLaborCost3', color: 'green', section: 'supply' },
  'additionalService1': { field: 'additionalService1', color: 'green', section: 'supply' },
  'additionalServiceCost1': { field: 'additionalServiceCost1', color: 'green', section: 'supply' },
  'additionalService2': { field: 'additionalService2', color: 'green', section: 'supply' },
  'additionalServiceCost2': { field: 'additionalServiceCost2', color: 'green', section: 'supply' },
  'additionalService3': { field: 'additionalService3', color: 'green', section: 'supply' },
  'additionalServiceCost3': { field: 'additionalServiceCost3', color: 'green', section: 'supply' },
  
  // ====================================
  // EXECUTIVE CONTROLS (Director)
  // ====================================
  
  // Red fields: Executive/Director final cost modifiers
  'laborRate': {
    field: 'laborRate',
    color: 'red',
    section: 'executive',
    description: 'Labor rate per hour (executive pricing control)'
  },

  'specialCost1': {
    field: 'specialCost1',
    color: 'red',
    section: 'executive',
    description: 'Management adjustment (final cost modifier)'
  },
  
  'specialCost2': { field: 'specialCost2', color: 'red', section: 'executive' },
  'specialCost3': { field: 'specialCost3', color: 'red', section: 'executive' },
  'specialCost4': { field: 'specialCost4', color: 'red', section: 'executive' },
  
  'discountPercent': {
    field: 'discountPercent',
    color: 'red',
    section: 'executive',
    description: 'Discount percentage (price adjustment)'
  },

  'managementCoefficient': {
    field: 'managementCoefficient',
    color: 'red',
    section: 'executive',
    description: 'Management coefficient (коэффициент управления) - G93'
  },

  'directorReserve': {
    field: 'directorReserve',
    color: 'red',
    section: 'executive',
    description: 'Director\'s Reserve (резерв директора) - G96'
  },
  
  // ====================================
  // PROJECT METADATA (Non-calculation)
  // ====================================
  
  // Project information (all roles can access)
  'projectName': { field: 'projectName', color: 'green', section: 'project' },
  'orderNumber': { field: 'orderNumber', color: 'green', section: 'project' },
  'clientName': { field: 'clientName', color: 'green', section: 'project' },
  'deliveryDate': { field: 'deliveryDate', color: 'green', section: 'project' },
  'projectManager': { field: 'projectManager', color: 'green', section: 'project' },
  'salesManager': { field: 'salesManager', color: 'green', section: 'project' },
  'positionNumber': { field: 'positionNumber', color: 'green', section: 'project' },
  'customerOrderNumber': { field: 'customerOrderNumber', color: 'green', section: 'project' },
  'deliveryType': { field: 'deliveryType', color: 'green', section: 'project' },
  
  // Logistics & packaging
  'packagingType': { field: 'packagingType', color: 'green', section: 'project' },
  'packagingMaterial': { field: 'packagingMaterial', color: 'green', section: 'project' },
  'crateRequired': { field: 'crateRequired', color: 'green', section: 'project' },
  'shippingMethod': { field: 'shippingMethod', color: 'green', section: 'project' },
  'deliveryTerms': { field: 'deliveryTerms', color: 'green', section: 'project' },
  'insuranceRequired': { field: 'insuranceRequired', color: 'green', section: 'project' },
  'customsClearance': { field: 'customsClearance', color: 'green', section: 'project' },
  
  // Documentation
  'drawingsIncluded': { field: 'drawingsIncluded', color: 'green', section: 'project' },
  'manualsIncluded': { field: 'manualsIncluded', color: 'green', section: 'project' },
  'certificatesIncluded': { field: 'certificatesIncluded', color: 'green', section: 'project' },
  'warrantyPeriod': { field: 'warrantyPeriod', color: 'green', section: 'project' },
  'serviceContract': { field: 'serviceContract', color: 'green', section: 'project' },
  
  // Spare parts
  'sparePlates': { field: 'sparePlates', color: 'green', section: 'project' },
  'spareGaskets': { field: 'spareGaskets', color: 'green', section: 'project' },
  'spareBolts': { field: 'spareBolts', color: 'green', section: 'project' },
  'spareNuts': { field: 'spareNuts', color: 'green', section: 'project' },
  'spareKit': { field: 'spareKit', color: 'green', section: 'project' },
  
  // Financial terms (non-calculation)
  'paymentTerms': { field: 'paymentTerms', color: 'green', section: 'project' },
  'currencyType': { field: 'currencyType', color: 'green', section: 'project' },
  'exchangeRate': { field: 'exchangeRate', color: 'green', section: 'project' },
  'taxRate': { field: 'taxRate', color: 'green', section: 'project' }
};

// Utility functions for field classification
export const getFieldsByColor = (color: FieldColor): FieldPermission[] => {
  return Object.values(FIELD_PERMISSIONS).filter(fp => fp.color === color);
};

export const getFieldsBySection = (section: string): FieldPermission[] => {
  return Object.values(FIELD_PERMISSIONS).filter(fp => fp.section === section);
};

export const getFieldColor = (field: keyof HeatExchangerInput): FieldColor => {
  return FIELD_PERMISSIONS[field]?.color || 'readonly';
};

export const getFieldSection = (field: keyof HeatExchangerInput): string => {
  return FIELD_PERMISSIONS[field]?.section || 'project';
};

// Field groups for UI organization
export const FIELD_GROUPS = {
  technical: {
    yellow: getFieldsByColor('yellow').filter(f => f.section === 'technical'),
    green: getFieldsByColor('green').filter(f => f.section === 'technical')
  },
  engineering: {
    orange: getFieldsByColor('orange')
  },
  supply: {
    green: getFieldsByColor('green').filter(f => f.section === 'supply')
  },
  executive: {
    red: getFieldsByColor('red')
  },
  project: {
    green: getFieldsByColor('green').filter(f => f.section === 'project')
  }
};