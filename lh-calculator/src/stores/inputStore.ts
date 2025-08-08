import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';
import type { UserRole } from '../types/roles.types';
import { useRoleStore } from './roleStore';
import { 
  canEditField, 
  canViewField,
  filterEditableInputs,
  filterViewableInputs,
  validateFieldAccess
} from '../utils/role-permissions';

interface InputState {
  inputs: HeatExchangerInput;
  isDirty: boolean;
  
  // Core input methods
  updateInput: <K extends keyof HeatExchangerInput>(
    field: K, 
    value: HeatExchangerInput[K],
    bypassRoleCheck?: boolean
  ) => void;
  updateMultiple: (updates: Partial<HeatExchangerInput>, bypassRoleCheck?: boolean) => void;
  reset: () => void;
  loadFromTemplate: (template: HeatExchangerInput) => void;
  
  // Role-based computed properties
  getEditableInputs: (role?: UserRole) => Partial<HeatExchangerInput>;
  getViewableInputs: (role?: UserRole) => Partial<HeatExchangerInput>;
  canEditField: (field: keyof HeatExchangerInput, role?: UserRole) => boolean;
  canViewField: (field: keyof HeatExchangerInput, role?: UserRole) => boolean;
  
  // Validation helpers
  validateUpdate: (field: keyof HeatExchangerInput, role?: UserRole) => { allowed: boolean; reason?: string };
  getFieldsForRole: (role?: UserRole) => {
    editable: (keyof HeatExchangerInput)[];
    viewable: (keyof HeatExchangerInput)[];
    hidden: (keyof HeatExchangerInput)[];
  };
}

const defaultInputs: HeatExchangerInput = {
  equipmentType: 'К4-750',
  modelCode: 'К4-750',
  plateConfiguration: '1/6',
  plateCount: 400,
  pressureA: 100,
  pressureB: 100,
  temperatureA: 80,
  temperatureB: 60,
  materialPlate: 'AISI 316L',
  claddingMaterial: 'AISI 316L', // Q27 - auto-synced with materialPlate
  bodyMaterial: '09Г2С', // R27 - body material
  corrugationType: 'гофра', // S27 - corrugation type
  materialBody: 'AISI 316L',
  surfaceType: 'гофра',
  plateThickness: 1.0, // Changed from 3 to 1.0mm to match Excel U27 default
  
  // Missing critical input fields - Story 1
  laborRate: 2500, // D12 - Labor rate ₽/hour
  laborCoefficient: 1, // D13 - Labor multiplier
  materialCoefficient: 1, // D14 - Material factor (squared in formulas)
  plateLength: 5, // T27 - Plate length in mm
  mountingPanelsCount: 3, // V27 - Number of mounting panels
  
  // Story 3: Configuration parameters - default values from TEST_SCENARIO_DATA.md
  solutionDensity: 1.0, // solution density
  solutionVolume: "Е-113", // solution volume identifier
  equipmentTypeDetail: "Целый ТА", // equipment type details
  flowRatio: "1/6", // flow ratio configuration
  
  // Story 4: Flange System - default values from TEST_SCENARIO_DATA.md
  flangeHotPressure1: "Ру10", // C28
  flangeHotDiameter1: "Ду600", // D28
  flangeHotPressure2: "Ру40", // C29
  flangeHotDiameter2: "Ду600", // D29
  flangeColdPressure1: "Ру25", // I28
  flangeColdDiameter1: "Ду450", // J28
  flangeColdPressure2: "Ру63", // I29
  flangeColdDiameter2: "Ду300", // J29
  
  // Stories 5, 6, 7: Cost Structure Implementation - Default Values
  // Story 5: Component Cost Structure
  componentCost1: 3300, // D43
  componentCost2: 1750, // D44
  componentCost3: 2800, // D45
  componentCost4: 1200, // D46
  additionalCost1: 600, // G43
  additionalCost2: 87,  // G44
  additionalCost3: 50,  // G45
  
  // Story 6: Manufacturing Process Costs
  processCost1: 100,    // H54
  processCost2: 100,    // H55
  processCost3: 200,    // H56
  processCost4: 150,    // H57
  assemblyWork1: 1000,  // I38
  assemblyWork2: 1000,  // I39
  additionalWork1: 1500, // K38
  additionalWork2: 1200, // K39
  
  // Story 7: Material and Special Costs
  materialCost1: 50000, // M44
  materialCost2: 0,     // M45
  materialCost3: 0,     // M46
  extraCost: 20000,     // P45
  specialCost1: 5000,   // M51
  specialCost2: 7000,   // M52
  specialCost3: 15000,  // M55
  specialCost4: 30000,  // M57

  // =====================================================
  // SPRINT 3: REMAINING 94 FIELDS - DEFAULT VALUES
  // =====================================================

  // Group 1: Project & Order Tracking (6 fields)
  projectName: '',
  orderNumber: '',
  clientName: '',
  deliveryDate: '',
  projectManager: '',
  salesManager: '',

  // Group 2: Equipment Extended Specs (7 fields)
  plateArea: 0,                   // calculated field
  channelHeight: 0,
  channelWidth: 0,
  frameThickness: 10,             // typical frame thickness in mm
  frameMaterial: 'Ст3',           // standard frame material
  insulationThickness: 0,
  insulationType: '',

  // Group 3: Process Parameters (8 fields)
  operatingPressureA: 0,
  operatingPressureB: 0,
  designTemperatureA: 0,
  designTemperatureB: 0,
  flowRateA: 0,
  flowRateB: 0,
  pressureDropA: 0,
  pressureDropB: 0,

  // Group 4: Fastener Specifications (8 fields)
  boltType: 'М16',                // standard metric bolt
  boltMaterial: 'Ст3',
  boltQuantity: 0,
  nutType: 'М16',                 // matching nut
  nutMaterial: 'Ст3',
  nutQuantity: 0,
  washerType: 'A16',              // standard washer
  washerQuantity: 0,

  // Group 5: Manufacturing Details (8 fields)
  weldingMethod: '',
  weldingMaterial: '',
  surfaceTreatment: '',
  paintType: '',
  paintThickness: 0,
  qualityControl: '',
  certificationRequired: false,
  inspectionLevel: '',

  // Group 6: Logistics & Packaging (7 fields)
  packagingType: '',
  packagingMaterial: '',
  crateRequired: false,
  shippingMethod: '',
  deliveryTerms: '',
  insuranceRequired: false,
  customsClearance: false,

  // Group 7: Documentation (5 fields)
  drawingsIncluded: false,
  manualsIncluded: false,
  certificatesIncluded: false,
  warrantyPeriod: 12,             // 12 months default warranty
  serviceContract: false,

  // Group 8: Spare Parts (5 fields)
  sparePlates: 0,
  spareGaskets: 0,
  spareBolts: 0,
  spareNuts: 0,
  spareKit: false,

  // Group 9: Financial (5 fields)
  paymentTerms: '',
  discountPercent: 0,
  taxRate: 20,                    // 20% VAT in Russia
  currencyType: 'RUB',            // Russian Rubles
  exchangeRate: 1,                // 1:1 for RUB

  // Group 10: Additional Costs Arrays (18 fields)
  // Additional Materials (6 fields)
  additionalMaterial1: '',
  additionalMaterialCost1: 0,
  additionalMaterial2: '',
  additionalMaterialCost2: 0,
  additionalMaterial3: '',
  additionalMaterialCost3: 0,

  // Additional Labor (6 fields)
  additionalLabor1: '',
  additionalLaborCost1: 0,
  additionalLabor2: '',
  additionalLaborCost2: 0,
  additionalLabor3: '',
  additionalLaborCost3: 0,

  // Additional Services (6 fields)
  additionalService1: '',
  additionalServiceCost1: 0,
  additionalService2: '',
  additionalServiceCost2: 0,
  additionalService3: '',
  additionalServiceCost3: 0,
};

export const useInputStore = create<InputState>()(
  devtools(
    persist(
      (set) => ({
        inputs: defaultInputs,
        isDirty: false,
        
        updateInput: (field, value, bypassRoleCheck = false) => 
          set((state) => {
            // Role-based permission check (unless bypassed for system updates)
            if (!bypassRoleCheck) {
              const roleStore = useRoleStore.getState();
              const canEdit = roleStore.canEdit(field);
              
              if (!canEdit) {
                console.warn(`Role ${roleStore.currentRole} cannot edit field ${field}`);
                return state; // No update if permission denied
              }
            }
            
            const newInputs = {
              ...state.inputs,
              [field]: value,
            };
            
            // Auto-sync Q27 (claddingMaterial) with P27 (materialPlate)
            if (field === 'materialPlate') {
              newInputs.claddingMaterial = value as string;
            }
            
            return {
              inputs: newInputs,
              isDirty: true,
            };
          }, false, 'updateInput'),
        
        updateMultiple: (updates, bypassRoleCheck = false) =>
          set((state) => {
            let filteredUpdates = updates;
            
            // Role-based filtering (unless bypassed)
            if (!bypassRoleCheck) {
              const roleStore = useRoleStore.getState();
              filteredUpdates = roleStore.filterForEdit(updates);
              
              // Log any filtered fields
              const originalKeys = Object.keys(updates);
              const filteredKeys = Object.keys(filteredUpdates);
              const blockedFields = originalKeys.filter(key => !filteredKeys.includes(key));
              
              if (blockedFields.length > 0) {
                console.warn(`Role ${roleStore.currentRole} blocked from editing fields:`, blockedFields);
              }
            }
            
            return {
              inputs: {
                ...state.inputs,
                ...filteredUpdates,
              },
              isDirty: true,
            };
          }, false, 'updateMultiple'),
        
        reset: () =>
          set({
            inputs: defaultInputs,
            isDirty: false,
          }, false, 'reset'),
        
        loadFromTemplate: (template) =>
          set({
            inputs: template,
            isDirty: false,
          }, false, 'loadFromTemplate'),
        
        // Role-based computed properties  
        getEditableInputs: (role?: UserRole): Partial<HeatExchangerInput> => {
          const state = useInputStore.getState();
          const targetRole = role || useRoleStore.getState().currentRole;
          return filterEditableInputs(targetRole, state.inputs);
        },
        
        getViewableInputs: (role?: UserRole): Partial<HeatExchangerInput> => {
          const state = useInputStore.getState();
          const targetRole = role || useRoleStore.getState().currentRole;
          return filterViewableInputs(targetRole, state.inputs);
        },
        
        canEditField: (field: keyof HeatExchangerInput, role?: UserRole) => {
          const targetRole = role || useRoleStore.getState().currentRole;
          return canEditField(targetRole, field);
        },
        
        canViewField: (field: keyof HeatExchangerInput, role?: UserRole) => {
          const targetRole = role || useRoleStore.getState().currentRole;
          return canViewField(targetRole, field);
        },
        
        validateUpdate: (field: keyof HeatExchangerInput, role?: UserRole) => {
          const targetRole = role || useRoleStore.getState().currentRole;
          return validateFieldAccess(targetRole, field, 'write');
        },
        
        getFieldsForRole: (role?: UserRole) => {
          const targetRole = role || useRoleStore.getState().currentRole;
          const state = useInputStore.getState();
          const editableInputs = filterEditableInputs(targetRole, state.inputs);
          const viewableInputs = filterViewableInputs(targetRole, state.inputs);
          
          // Convert input objects to field key arrays
          const editableFields = Object.keys(editableInputs) as (keyof HeatExchangerInput)[];
          const viewableFields = Object.keys(viewableInputs) as (keyof HeatExchangerInput)[];
          const allFields = Object.keys(state.inputs) as (keyof HeatExchangerInput)[];
          const hiddenFields = allFields.filter(field => !viewableFields.includes(field));
          
          return {
            editable: editableFields,
            viewable: viewableFields,
            hidden: hiddenFields,
          };
        },
      }),
      {
        name: 'lh-calculator-inputs',
      }
    )
  )
);