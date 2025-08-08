/**
 * Role State Management Store
 * Epic 1, Story 1.3: Zustand store for role-based access control
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  UserRole, 
  PermissionLevel,
  RoleDefinition 
} from '../types/roles.types';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';
import { ROLE_DEFINITIONS } from '../types/roles.types';
import { 
  canEditField, 
  canViewField, 
  getFieldPermission,
  validateFieldAccess,
  filterEditableInputs,
  filterViewableInputs
} from '../utils/role-permissions';

interface RoleState {
  // Current role state
  currentRole: UserRole;
  
  // Permission cache to avoid repeated lookups
  permissionCache: Map<string, PermissionLevel>;
  
  // Field visibility cache
  fieldVisibilityCache: Map<string, boolean>;
  
  // Actions
  setRole: (role: UserRole) => void;
  resetPermissions: () => void;
  
  // Permission checking methods
  canEdit: (field: keyof HeatExchangerInput) => boolean;
  canView: (field: keyof HeatExchangerInput) => boolean;
  getPermission: (field: keyof HeatExchangerInput) => PermissionLevel;
  
  // Computed field lists
  getEditableFields: () => (keyof HeatExchangerInput)[];
  getViewableFields: () => (keyof HeatExchangerInput)[];
  getHiddenFields: () => (keyof HeatExchangerInput)[];
  
  // Field filtering for input data
  filterForEdit: (inputs: Partial<HeatExchangerInput>) => Partial<HeatExchangerInput>;
  filterForView: (inputs: Partial<HeatExchangerInput>) => Partial<HeatExchangerInput>;
  
  // Role metadata
  getRoleDefinition: () => RoleDefinition;
  canSwitchToRole: (targetRole: UserRole) => boolean;
  
  // Field validation
  validateFieldAccess: (field: keyof HeatExchangerInput, action: 'read' | 'write') => { allowed: boolean; reason?: string };
}

// Get all field keys from HeatExchangerInput type
const getAllInputFields = (): (keyof HeatExchangerInput)[] => {
  // This is a workaround since we can't dynamically get type keys at runtime
  // We'll use the keys from the field permissions configuration
  return Object.keys({
    // Core technical fields
    equipmentType: '', modelCode: '', plateConfiguration: '', plateCount: 0,
    pressureA: 0, pressureB: 0, temperatureA: 0, temperatureB: 0,
    materialPlate: '', claddingMaterial: '', bodyMaterial: '',
    corrugationType: '', materialBody: '', surfaceType: '', plateThickness: 0,
    
    // Critical missing fields
    laborRate: 0, laborCoefficient: 0, materialCoefficient: 0,
    plateLength: 0, mountingPanelsCount: 0,
    
    // Configuration parameters
    solutionDensity: 0, solutionVolume: '', equipmentTypeDetail: '', flowRatio: '',
    additionalPlatesFactor: 0, panelCountFactor: 0, componentsA: '', componentsB: '',
    
    // Flange specifications
    flangeHotPressure1: '', flangeHotDiameter1: '', flangeHotPressure2: '', flangeHotDiameter2: '',
    flangeColdPressure1: '', flangeColdDiameter1: '', flangeColdPressure2: '', flangeColdDiameter2: '',
    
    // Engineering specs
    plateArea: 0, channelHeight: 0, channelWidth: 0, frameThickness: 0,
    frameMaterial: '', insulationThickness: 0, insulationType: '',
    
    // Process parameters
    operatingPressureA: 0, operatingPressureB: 0, designTemperatureA: 0, designTemperatureB: 0,
    flowRateA: 0, flowRateB: 0, pressureDropA: 0, pressureDropB: 0,
    testPressureHot: 0, testPressureCold: 0,
    
    // Fastener specifications
    boltType: '', boltMaterial: '', boltQuantity: 0,
    nutType: '', nutMaterial: '', nutQuantity: 0,
    washerType: '', washerQuantity: 0,
    
    // Manufacturing details
    weldingMethod: '', weldingMaterial: '', surfaceTreatment: '',
    paintType: '', paintThickness: 0, qualityControl: '',
    certificationRequired: false, inspectionLevel: '',
    
    // Cost structure
    componentCost1: 0, componentCost2: 0, componentCost3: 0, componentCost4: 0,
    additionalCost1: 0, additionalCost2: 0, additionalCost3: 0,
    processCost1: 0, processCost2: 0, processCost3: 0, processCost4: 0,
    assemblyWork1: 0, assemblyWork2: 0, additionalWork1: 0, additionalWork2: 0,
    materialCost1: 0, materialCost2: 0, materialCost3: 0, extraCost: 0,
    specialCost1: 0, specialCost2: 0, specialCost3: 0, specialCost4: 0,
    
    // Supply parameters
    plateMaterialPricePerKg: 0, claddingMaterialPricePerKg: 0,
    columnCoverMaterialPricePerKg: 0, panelMaterialPricePerKg: 0,
    laborRatePerHour: 0, cuttingCostPerMeter: 0, internalLogisticsCost: 0,
    standardLaborHours: 0, panelFastenerQuantity: 0,
    claddingCuttingCorrection: 0, columnCuttingCorrection: 0,
    coverCuttingCorrection: 0, panelCuttingCorrection: 0,
    
    // Additional cost arrays
    additionalMaterial1: '', additionalMaterialCost1: 0,
    additionalMaterial2: '', additionalMaterialCost2: 0,
    additionalMaterial3: '', additionalMaterialCost3: 0,
    additionalLabor1: '', additionalLaborCost1: 0,
    additionalLabor2: '', additionalLaborCost2: 0,
    additionalLabor3: '', additionalLaborCost3: 0,
    additionalService1: '', additionalServiceCost1: 0,
    additionalService2: '', additionalServiceCost2: 0,
    additionalService3: '', additionalServiceCost3: 0,
    
    // Project fields
    projectName: '', orderNumber: '', clientName: '', deliveryDate: '',
    projectManager: '', salesManager: '', positionNumber: '',
    customerOrderNumber: '', deliveryType: '',
    
    // Logistics
    packagingType: '', packagingMaterial: '', crateRequired: false,
    shippingMethod: '', deliveryTerms: '', insuranceRequired: false,
    customsClearance: false,
    
    // Documentation
    drawingsIncluded: false, manualsIncluded: false,
    certificatesIncluded: false, warrantyPeriod: 0, serviceContract: false,
    
    // Spare parts
    sparePlates: 0, spareGaskets: 0, spareBolts: 0, spareNuts: 0, spareKit: false,
    
    // Financial
    paymentTerms: '', discountPercent: 0, taxRate: 0,
    currencyType: '', exchangeRate: 0,
    
    drawDepth: 0,
    claddingThickness: 0
  }) as (keyof HeatExchangerInput)[];
};

export const useRoleStore = create<RoleState>()(
  devtools(
    persist(
      (set, get) => ({
        currentRole: 'technologist',
        permissionCache: new Map<string, PermissionLevel>(),
        fieldVisibilityCache: new Map<string, boolean>(),
        
        setRole: (role: UserRole) => 
          set(() => {
            // Clear caches when role changes
            const newPermissionCache = new Map<string, PermissionLevel>();
            const newFieldVisibilityCache = new Map<string, boolean>();
            
            return {
              currentRole: role,
              permissionCache: newPermissionCache,
              fieldVisibilityCache: newFieldVisibilityCache,
            };
          }, false, 'setRole'),
        
        resetPermissions: () =>
          set(() => ({
            permissionCache: new Map<string, PermissionLevel>(),
            fieldVisibilityCache: new Map<string, boolean>(),
          }), false, 'resetPermissions'),
        
        canEdit: (field: keyof HeatExchangerInput): boolean => {
          const { currentRole } = get();
          return canEditField(currentRole, field);
        },
        
        canView: (field: keyof HeatExchangerInput): boolean => {
          const { currentRole } = get();
          return canViewField(currentRole, field);
        },
        
        getPermission: (field: keyof HeatExchangerInput): PermissionLevel => {
          const { currentRole, permissionCache } = get();
          const cacheKey = `${currentRole}-${field}`;
          
          if (permissionCache.has(cacheKey)) {
            return permissionCache.get(cacheKey)!;
          }
          
          const permission = getFieldPermission(currentRole, field);
          
          // Update cache
          set((state) => {
            const newCache = new Map(state.permissionCache);
            newCache.set(cacheKey, permission);
            return { permissionCache: newCache };
          });
          
          return permission;
        },
        
        getEditableFields: (): (keyof HeatExchangerInput)[] => {
          const { currentRole } = get();
          const allFields = getAllInputFields();
          
          return allFields.filter(field => canEditField(currentRole, field));
        },
        
        getViewableFields: (): (keyof HeatExchangerInput)[] => {
          const { currentRole } = get();
          const allFields = getAllInputFields();
          
          return allFields.filter(field => canViewField(currentRole, field));
        },
        
        getHiddenFields: (): (keyof HeatExchangerInput)[] => {
          const { currentRole } = get();
          const allFields = getAllInputFields();
          
          return allFields.filter(field => {
            const permission = getFieldPermission(currentRole, field);
            return permission === 'hidden';
          });
        },
        
        filterForEdit: (inputs: Partial<HeatExchangerInput>): Partial<HeatExchangerInput> => {
          const { currentRole } = get();
          return filterEditableInputs(currentRole, inputs);
        },
        
        filterForView: (inputs: Partial<HeatExchangerInput>): Partial<HeatExchangerInput> => {
          const { currentRole } = get();
          return filterViewableInputs(currentRole, inputs);
        },
        
        getRoleDefinition: (): RoleDefinition => {
          const { currentRole } = get();
          return ROLE_DEFINITIONS[currentRole];
        },
        
        canSwitchToRole: (targetRole: UserRole): boolean => {
          const { currentRole } = get();
          const currentHierarchy = ROLE_DEFINITIONS[currentRole].hierarchy;
          const targetHierarchy = ROLE_DEFINITIONS[targetRole].hierarchy;
          
          // Can switch to same or lower privilege (higher hierarchy number)
          return currentHierarchy <= targetHierarchy;
        },
        
        validateFieldAccess: (
          field: keyof HeatExchangerInput, 
          action: 'read' | 'write'
        ): { allowed: boolean; reason?: string } => {
          const { currentRole } = get();
          return validateFieldAccess(currentRole, field, action);
        },
      }),
      {
        name: 'lh-calculator-role-store',
        // Only persist the current role, not the caches
        partialize: (state) => ({ currentRole: state.currentRole }),
      }
    )
  )
);

// Selector hooks for specific use cases
export const useCurrentRole = () => useRoleStore((state) => state.currentRole);
export const useRoleDefinition = () => useRoleStore((state) => state.getRoleDefinition());
export const useRolePermissions = () => useRoleStore((state) => ({
  canEdit: state.canEdit,
  canView: state.canView,
  getPermission: state.getPermission,
}));
export const useFieldFilters = () => useRoleStore((state) => ({
  filterForEdit: state.filterForEdit,
  filterForView: state.filterForView,
  getEditableFields: state.getEditableFields,
  getViewableFields: state.getViewableFields,
  getHiddenFields: state.getHiddenFields,
}));