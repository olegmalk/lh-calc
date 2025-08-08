/**
 * Role Permissions Hook
 * Epic 1, Story 1.3: Custom hook for component access to role-based permissions
 */

import { useMemo } from 'react';
import type { UserRole, FieldColor, PermissionLevel } from '../types/roles.types';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';
import { useRoleStore, useCurrentRole, useRoleDefinition, useFieldFilters } from '../stores/roleStore';
import { getFieldColor, getFieldSection } from '../config/field-permissions';

export interface FieldPermissionInfo {
  field: keyof HeatExchangerInput;
  color: FieldColor;
  section: string;
  permission: PermissionLevel;
  canEdit: boolean;
  canView: boolean;
  isHidden: boolean;
}

export interface RolePermissionHookReturn {
  // Current role info
  currentRole: UserRole;
  roleDefinition: ReturnType<typeof useRoleDefinition>;
  
  // Field permission checkers
  canEdit: (field: keyof HeatExchangerInput) => boolean;
  canView: (field: keyof HeatExchangerInput) => boolean;
  isHidden: (field: keyof HeatExchangerInput) => boolean;
  getPermission: (field: keyof HeatExchangerInput) => PermissionLevel;
  
  // Field information
  getFieldInfo: (field: keyof HeatExchangerInput) => FieldPermissionInfo;
  
  // Field lists
  editableFields: (keyof HeatExchangerInput)[];
  viewableFields: (keyof HeatExchangerInput)[];
  hiddenFields: (keyof HeatExchangerInput)[];
  
  // Data filtering
  filterForEdit: (inputs: Partial<HeatExchangerInput>) => Partial<HeatExchangerInput>;
  filterForView: (inputs: Partial<HeatExchangerInput>) => Partial<HeatExchangerInput>;
  
  // Color-based permissions
  canEditColor: (color: FieldColor) => boolean;
  canViewColor: (color: FieldColor) => boolean;
  getColorPermission: (color: FieldColor) => PermissionLevel;
  
  // Section-based permissions
  getSectionPermissions: (section: string) => {
    canEdit: boolean;
    canView: boolean;
    editableCount: number;
    viewableCount: number;
    totalCount: number;
  };
  
  // Validation helpers
  validateFieldUpdate: (field: keyof HeatExchangerInput) => { allowed: boolean; reason?: string };
  validateBatchUpdate: (fields: (keyof HeatExchangerInput)[]) => {
    allowed: (keyof HeatExchangerInput)[];
    blocked: (keyof HeatExchangerInput)[];
    warnings: string[];
  };
}

/**
 * Main hook for role-based permissions
 */
export function useRolePermissions(): RolePermissionHookReturn {
  const currentRole = useCurrentRole();
  const roleDefinition = useRoleDefinition();
  const fieldFilters = useFieldFilters();
  
  const roleStore = useRoleStore();
  
  // Memoized field lists to avoid recalculation
  const fieldLists = useMemo(() => ({
    editable: fieldFilters.getEditableFields(),
    viewable: fieldFilters.getViewableFields(),
    hidden: fieldFilters.getHiddenFields(),
  }), [currentRole, fieldFilters]);
  
  // Color-based permission helpers
  const canEditColor = (color: FieldColor): boolean => {
    return roleDefinition.permissions[color] === 'full';
  };
  
  const canViewColor = (color: FieldColor): boolean => {
    const permission = roleDefinition.permissions[color];
    return permission === 'full' || permission === 'readonly';
  };
  
  const getColorPermission = (color: FieldColor): PermissionLevel => {
    return roleDefinition.permissions[color];
  };
  
  // Section-based permission analysis
  const getSectionPermissions = (section: string) => {
    // This would require iterating through all fields in the section
    // For now, provide a basic structure
    const allFields = fieldLists.editable.concat(fieldLists.viewable).concat(fieldLists.hidden);
    const sectionFields = allFields.filter(field => getFieldSection(field) === section);
    const editableInSection = fieldLists.editable.filter(field => getFieldSection(field) === section);
    const viewableInSection = fieldLists.viewable.filter(field => getFieldSection(field) === section);
    
    return {
      canEdit: editableInSection.length > 0,
      canView: viewableInSection.length > 0,
      editableCount: editableInSection.length,
      viewableCount: viewableInSection.length,
      totalCount: sectionFields.length,
    };
  };
  
  // Field information creator
  const getFieldInfo = (field: keyof HeatExchangerInput): FieldPermissionInfo => {
    const color = getFieldColor(field);
    const section = getFieldSection(field);
    const permission = roleStore.getPermission(field);
    
    return {
      field,
      color,
      section,
      permission,
      canEdit: permission === 'full',
      canView: permission !== 'hidden',
      isHidden: permission === 'hidden',
    };
  };
  
  // Validation helpers
  const validateFieldUpdate = (field: keyof HeatExchangerInput) => {
    return roleStore.validateFieldAccess(field, 'write');
  };
  
  const validateBatchUpdate = (fields: (keyof HeatExchangerInput)[]) => {
    const allowed: (keyof HeatExchangerInput)[] = [];
    const blocked: (keyof HeatExchangerInput)[] = [];
    const warnings: string[] = [];
    
    fields.forEach(field => {
      const validation = validateFieldUpdate(field);
      if (validation.allowed) {
        allowed.push(field);
      } else {
        blocked.push(field);
        if (validation.reason) {
          warnings.push(validation.reason);
        }
      }
    });
    
    return { allowed, blocked, warnings };
  };
  
  return {
    currentRole,
    roleDefinition,
    
    // Field permission checkers
    canEdit: roleStore.canEdit,
    canView: roleStore.canView,
    isHidden: (field) => roleStore.getPermission(field) === 'hidden',
    getPermission: roleStore.getPermission,
    
    // Field information
    getFieldInfo,
    
    // Field lists
    editableFields: fieldLists.editable,
    viewableFields: fieldLists.viewable,
    hiddenFields: fieldLists.hidden,
    
    // Data filtering
    filterForEdit: fieldFilters.filterForEdit,
    filterForView: fieldFilters.filterForView,
    
    // Color-based permissions
    canEditColor,
    canViewColor,
    getColorPermission,
    
    // Section-based permissions
    getSectionPermissions,
    
    // Validation helpers
    validateFieldUpdate,
    validateBatchUpdate,
  };
}

/**
 * Simplified hook for quick permission checks
 */
export function useFieldPermission(field: keyof HeatExchangerInput) {
  const { canEdit, canView, getPermission, getFieldInfo } = useRolePermissions();
  
  return useMemo(() => ({
    canEdit: canEdit(field),
    canView: canView(field),
    isHidden: getPermission(field) === 'hidden',
    permission: getPermission(field),
    fieldInfo: getFieldInfo(field),
  }), [field, canEdit, canView, getPermission, getFieldInfo]);
}

/**
 * Hook for color-based permission checking
 */
export function useColorPermissions(color: FieldColor) {
  const { canEditColor, canViewColor, getColorPermission } = useRolePermissions();
  
  return useMemo(() => ({
    canEdit: canEditColor(color),
    canView: canViewColor(color),
    permission: getColorPermission(color),
    isHidden: getColorPermission(color) === 'hidden',
  }), [color, canEditColor, canViewColor, getColorPermission]);
}

/**
 * Hook for section-based permissions
 */
export function useSectionPermissions(section: string) {
  const { getSectionPermissions } = useRolePermissions();
  
  return useMemo(() => getSectionPermissions(section), [section, getSectionPermissions]);
}

/**
 * Hook for form component integration
 */
export function useFormPermissions() {
  const {
    canEdit,
    canView,
    editableFields,
    viewableFields,
    filterForEdit,
    validateBatchUpdate,
  } = useRolePermissions();
  
  return {
    // Field state helpers
    isFieldDisabled: (field: keyof HeatExchangerInput) => !canEdit(field),
    isFieldVisible: (field: keyof HeatExchangerInput) => canView(field),
    
    // Form data filtering
    filterFormData: filterForEdit,
    
    // Bulk operations
    getEditableFieldsInForm: (formFields: (keyof HeatExchangerInput)[]) => 
      formFields.filter(field => canEdit(field)),
    
    getVisibleFieldsInForm: (formFields: (keyof HeatExchangerInput)[]) => 
      formFields.filter(field => canView(field)),
    
    // Validation
    validateFormSubmission: (formFields: (keyof HeatExchangerInput)[]) =>
      validateBatchUpdate(formFields),
    
    // Field lists for form construction
    editableFields,
    viewableFields,
  };
}

/**
 * Hook for role switching validation
 */
export function useRoleSwitching() {
  const roleStore = useRoleStore();
  const currentRole = useCurrentRole();
  
  return {
    currentRole,
    canSwitchTo: roleStore.canSwitchToRole,
    switchRole: roleStore.setRole,
  };
}