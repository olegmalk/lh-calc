/**
 * Role Permission Hooks
 * Clean presentation layer for role-based UI logic
 */

import { useMemo } from 'react';
import type { UserRole } from '../types/roles.types';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';
import { useCurrentRole } from '../stores/roleStore';
import { rolePermissionService } from '../services/rolePermissionService';
import { FIELD_PERMISSIONS } from '../config/field-permissions';

/**
 * Get role-based field permissions for current role
 */
export const useRolePermissions = () => {
  const currentRole = useCurrentRole();

  return useMemo(() => ({
    canEditField: (field: keyof HeatExchangerInput) => 
      rolePermissionService.canEditField(currentRole, field),
    
    canViewField: (field: keyof HeatExchangerInput) => 
      rolePermissionService.canViewField(currentRole, field),
    
    validateFieldAccess: (field: keyof HeatExchangerInput, action: 'read' | 'write') =>
      rolePermissionService.validateFieldAccess(currentRole, field, action),
    
    getFieldPermission: (field: keyof HeatExchangerInput) =>
      rolePermissionService.getFieldPermission(currentRole, field),
    
    getFieldAccessInfo: (field: keyof HeatExchangerInput) =>
      rolePermissionService.getFieldAccessInfo(currentRole, field)
  }), [currentRole]);
};

/**
 * Get field lists organized by permission level
 */
export const useRoleFieldLists = () => {
  const currentRole = useCurrentRole();
  
  return useMemo(() => {
    const allFields = Object.keys(FIELD_PERMISSIONS) as (keyof HeatExchangerInput)[];
    
    return {
      editableFields: rolePermissionService.getEditableFields(currentRole, allFields),
      viewableFields: rolePermissionService.getViewableFields(currentRole, allFields),
      hiddenFields: rolePermissionService.getHiddenFields(currentRole, allFields),
      fieldsBySection: rolePermissionService.getFieldsBySection(currentRole, allFields)
    };
  }, [currentRole]);
};

/**
 * Get input filtering functions
 */
export const useInputFilters = () => {
  const currentRole = useCurrentRole();

  return useMemo(() => ({
    filterEditableInputs: (inputs: Partial<HeatExchangerInput>) =>
      rolePermissionService.filterEditableInputs(currentRole, inputs),
    
    filterViewableInputs: (inputs: Partial<HeatExchangerInput>) =>
      rolePermissionService.filterViewableInputs(currentRole, inputs)
  }), [currentRole]);
};

/**
 * Get role switching capabilities
 */
export const useRoleSwitching = () => {
  const currentRole = useCurrentRole();

  return useMemo(() => ({
    canSwitchToRole: (targetRole: UserRole) =>
      rolePermissionService.canSwitchToRole(currentRole, targetRole),
    
    getAvailableRoles: () =>
      rolePermissionService.getAvailableRoles(currentRole)
  }), [currentRole]);
};

/**
 * Form validation hook
 */
export const useRoleBasedValidation = () => {
  const currentRole = useCurrentRole();

  return useMemo(() => ({
    validateFormData: (formData: Partial<HeatExchangerInput>) =>
      rolePermissionService.validateFormData(currentRole, formData)
  }), [currentRole]);
};


