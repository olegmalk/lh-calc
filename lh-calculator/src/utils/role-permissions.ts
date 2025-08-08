/**
 * Role Permission Utilities
 * Epic 1, Story 1.1: Permission checking functions for role-based access control
 */

import type { 
  UserRole, 
  FieldColor, 
  PermissionLevel, 
  RoleDefinition 
} from '../types/roles.types';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';
import { ROLE_DEFINITIONS } from '../types/roles.types';
import { getFieldColor, getFieldSection } from '../config/field-permissions';

/**
 * Check if a role has permission to edit a specific field
 */
export const canEditField = (
  role: UserRole, 
  field: keyof HeatExchangerInput
): boolean => {
  const fieldColor = getFieldColor(field);
  const roleDefinition = ROLE_DEFINITIONS[role];
  const permission = roleDefinition.permissions[fieldColor];
  
  return permission === 'full';
};

/**
 * Check if a role can view a specific field
 */
export const canViewField = (
  role: UserRole, 
  field: keyof HeatExchangerInput
): boolean => {
  const fieldColor = getFieldColor(field);
  const roleDefinition = ROLE_DEFINITIONS[role];
  const permission = roleDefinition.permissions[fieldColor];
  
  return permission === 'full' || permission === 'readonly';
};

/**
 * Get the permission level for a role and field
 */
export const getFieldPermission = (
  role: UserRole, 
  field: keyof HeatExchangerInput
): PermissionLevel => {
  const fieldColor = getFieldColor(field);
  const roleDefinition = ROLE_DEFINITIONS[role];
  
  return roleDefinition.permissions[fieldColor];
};

/**
 * Get all fields that a role can edit
 */
export const getEditableFields = (role: UserRole): (keyof HeatExchangerInput)[] => {
  const allFields = Object.keys(ROLE_DEFINITIONS) as (keyof HeatExchangerInput)[];
  
  return allFields.filter(field => canEditField(role, field));
};

/**
 * Get all fields that a role can view (including editable)
 */
export const getViewableFields = (role: UserRole): (keyof HeatExchangerInput)[] => {
  const allFields = Object.keys(ROLE_DEFINITIONS) as (keyof HeatExchangerInput)[];
  
  return allFields.filter(field => canViewField(role, field));
};

/**
 * Filter input object to only include fields a role can edit
 */
export const filterEditableInputs = (
  role: UserRole, 
  inputs: Partial<HeatExchangerInput>
): Partial<HeatExchangerInput> => {
  const filtered: Partial<HeatExchangerInput> = {};
  
  Object.entries(inputs).forEach(([field, value]) => {
    if (canEditField(role, field as keyof HeatExchangerInput)) {
      (filtered as any)[field] = value;
    }
  });
  
  return filtered;
};

/**
 * Filter input object to only include fields a role can view
 */
export const filterViewableInputs = (
  role: UserRole, 
  inputs: Partial<HeatExchangerInput>
): Partial<HeatExchangerInput> => {
  const filtered: Partial<HeatExchangerInput> = {};
  
  Object.entries(inputs).forEach(([field, value]) => {
    if (canViewField(role, field as keyof HeatExchangerInput)) {
      (filtered as any)[field] = value;
    }
  });
  
  return filtered;
};

/**
 * Get fields by color that a role has access to
 */
export const getAccessibleFieldsByColor = (
  role: UserRole, 
  color: FieldColor,
  permissionType: 'edit' | 'view' = 'view'
): (keyof HeatExchangerInput)[] => {
  const roleDefinition = ROLE_DEFINITIONS[role];
  const permission = roleDefinition.permissions[color];
  
  if (permissionType === 'edit' && permission !== 'full') {
    return [];
  }
  
  if (permissionType === 'view' && permission === 'hidden') {
    return [];
  }
  
  // This would need to be implemented with a reverse lookup from field-permissions
  // For now, return empty array as this requires the full mapping
  return [];
};

/**
 * Validate if a role can perform an action on a field
 */
export const validateFieldAccess = (
  role: UserRole,
  field: keyof HeatExchangerInput,
  action: 'read' | 'write'
): { allowed: boolean; reason?: string } => {
  const fieldColor = getFieldColor(field);
  const fieldSection = getFieldSection(field);
  const roleDefinition = ROLE_DEFINITIONS[role];
  const permission = roleDefinition.permissions[fieldColor];
  
  if (action === 'read') {
    const canView = permission !== 'hidden';
    return {
      allowed: canView,
      reason: canView ? undefined : `Role ${role} cannot view ${fieldColor} fields in ${fieldSection}`
    };
  }
  
  if (action === 'write') {
    const canEdit = permission === 'full';
    return {
      allowed: canEdit,
      reason: canEdit ? undefined : `Role ${role} cannot edit ${fieldColor} fields in ${fieldSection}`
    };
  }
  
  return { allowed: false, reason: 'Invalid action' };
};

/**
 * Get user-friendly field access summary for a role
 */
export const getRoleAccessSummary = (role: UserRole): {
  role: RoleDefinition;
  sections: {
    [section: string]: {
      editable: number;
      viewable: number;
      hidden: number;
      total: number;
    };
  };
} => {
  const roleDefinition = ROLE_DEFINITIONS[role];
  const sections: { [section: string]: any } = {};
  
  // Initialize section counters
  const sectionNames = ['technical', 'engineering', 'supply', 'executive', 'project'];
  sectionNames.forEach(section => {
    sections[section] = {
      editable: 0,
      viewable: 0,
      hidden: 0,
      total: 0
    };
  });
  
  // This would need the reverse mapping from field-permissions
  // For now, return basic structure
  
  return {
    role: roleDefinition,
    sections
  };
};

/**
 * Check if role switching is allowed based on hierarchy
 */
export const canSwitchToRole = (
  currentRole: UserRole, 
  targetRole: UserRole
): boolean => {
  const currentHierarchy = ROLE_DEFINITIONS[currentRole].hierarchy;
  const targetHierarchy = ROLE_DEFINITIONS[targetRole].hierarchy;
  
  // Can always switch to same or lower privilege role
  // Lower hierarchy number = higher privilege
  return currentHierarchy <= targetHierarchy;
};

/**
 * Get available roles that current role can switch to
 */
export const getAvailableRoles = (currentRole: UserRole): UserRole[] => {
  return Object.keys(ROLE_DEFINITIONS).filter(role => 
    canSwitchToRole(currentRole, role as UserRole)
  ) as UserRole[];
};

/**
 * Role-based field validation for forms
 */
export const validateRoleBasedForm = (
  role: UserRole,
  formData: Partial<HeatExchangerInput>
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  Object.keys(formData).forEach(field => {
    const fieldKey = field as keyof HeatExchangerInput;
    const access = validateFieldAccess(role, fieldKey, 'write');
    
    if (!access.allowed) {
      errors.push(`Cannot edit field "${field}": ${access.reason}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Create a permission-aware field descriptor
 */
export interface FieldDescriptor {
  field: keyof HeatExchangerInput;
  section: string;
  color: FieldColor;
  permission: PermissionLevel;
  isEditable: boolean;
  isVisible: boolean;
}

export const createFieldDescriptor = (
  role: UserRole,
  field: keyof HeatExchangerInput
): FieldDescriptor => {
  const color = getFieldColor(field);
  const section = getFieldSection(field);
  const permission = getFieldPermission(role, field);
  
  return {
    field,
    section,
    color,
    permission,
    isEditable: permission === 'full',
    isVisible: permission !== 'hidden'
  };
};

/**
 * Get all field descriptors for a role
 */
export const getAllFieldDescriptors = (): FieldDescriptor[] => {
  // This would require iterating through all fields from HeatExchangerInput
  // For now, return empty array as this requires type introspection
  return [];
};