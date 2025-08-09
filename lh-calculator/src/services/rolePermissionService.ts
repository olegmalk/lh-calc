/**
 * Role Permission Service
 * Clean service layer for role-based permission logic
 * Breaks circular dependency between roleStore and inputStore
 */

import type { 
  UserRole, 
  FieldColor, 
  PermissionLevel 
} from '../types/roles.types';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';
import { ROLE_DEFINITIONS } from '../types/roles.types';
import { getFieldColor, getFieldSection } from '../config/field-permissions';

export interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

export interface FieldAccessInfo {
  field: keyof HeatExchangerInput;
  canEdit: boolean;
  canView: boolean;
  permission: PermissionLevel;
  color: FieldColor;
  section: string;
}

/**
 * Pure permission validation - no store dependencies
 */
export class RolePermissionService {
  /**
   * Validate if a role can perform an action on a field
   */
  validateFieldAccess(
    role: UserRole,
    field: keyof HeatExchangerInput,
    action: 'read' | 'write'
  ): ValidationResult {
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
  }

  /**
   * Check if role can edit a specific field
   */
  canEditField(role: UserRole, field: keyof HeatExchangerInput): boolean {
    const fieldColor = getFieldColor(field);
    const roleDefinition = ROLE_DEFINITIONS[role];
    const permission = roleDefinition.permissions[fieldColor];
    return permission === 'full';
  }

  /**
   * Check if role can view a specific field
   */
  canViewField(role: UserRole, field: keyof HeatExchangerInput): boolean {
    const fieldColor = getFieldColor(field);
    const roleDefinition = ROLE_DEFINITIONS[role];
    const permission = roleDefinition.permissions[fieldColor];
    return permission === 'full' || permission === 'readonly';
  }

  /**
   * Get permission level for a role and field
   */
  getFieldPermission(role: UserRole, field: keyof HeatExchangerInput): PermissionLevel {
    const fieldColor = getFieldColor(field);
    const roleDefinition = ROLE_DEFINITIONS[role];
    return roleDefinition.permissions[fieldColor];
  }

  /**
   * Filter input object to only include fields a role can edit
   */
  filterEditableInputs(
    role: UserRole, 
    inputs: Partial<HeatExchangerInput>
  ): Partial<HeatExchangerInput> {
    const filtered: Partial<HeatExchangerInput> = {};
    
    Object.entries(inputs).forEach(([field, value]) => {
      if (this.canEditField(role, field as keyof HeatExchangerInput)) {
        (filtered as Record<string, unknown>)[field] = value;
      }
    });
    
    return filtered;
  }

  /**
   * Filter input object to only include fields a role can view
   */
  filterViewableInputs(
    role: UserRole, 
    inputs: Partial<HeatExchangerInput>
  ): Partial<HeatExchangerInput> {
    const filtered: Partial<HeatExchangerInput> = {};
    
    Object.entries(inputs).forEach(([field, value]) => {
      if (this.canViewField(role, field as keyof HeatExchangerInput)) {
        (filtered as Record<string, unknown>)[field] = value;
      }
    });
    
    return filtered;
  }

  /**
   * Get all fields that a role can edit
   */
  getEditableFields(role: UserRole, allFields: (keyof HeatExchangerInput)[]): (keyof HeatExchangerInput)[] {
    return allFields.filter(field => this.canEditField(role, field));
  }

  /**
   * Get all fields that a role can view
   */
  getViewableFields(role: UserRole, allFields: (keyof HeatExchangerInput)[]): (keyof HeatExchangerInput)[] {
    return allFields.filter(field => this.canViewField(role, field));
  }

  /**
   * Get all hidden fields for a role
   */
  getHiddenFields(role: UserRole, allFields: (keyof HeatExchangerInput)[]): (keyof HeatExchangerInput)[] {
    return allFields.filter(field => {
      const permission = this.getFieldPermission(role, field);
      return permission === 'hidden';
    });
  }

  /**
   * Get field access information
   */
  getFieldAccessInfo(role: UserRole, field: keyof HeatExchangerInput): FieldAccessInfo {
    const color = getFieldColor(field);
    const section = getFieldSection(field);
    const permission = this.getFieldPermission(role, field);

    return {
      field,
      canEdit: permission === 'full',
      canView: permission !== 'hidden',
      permission,
      color,
      section
    };
  }

  /**
   * Check if role switching is allowed
   */
  canSwitchToRole(currentRole: UserRole, targetRole: UserRole): boolean {
    const currentHierarchy = ROLE_DEFINITIONS[currentRole].hierarchy;
    const targetHierarchy = ROLE_DEFINITIONS[targetRole].hierarchy;
    
    // Can switch to same or lower privilege (higher hierarchy number)
    return currentHierarchy <= targetHierarchy;
  }

  /**
   * Get available roles that current role can switch to
   */
  getAvailableRoles(currentRole: UserRole): UserRole[] {
    return Object.keys(ROLE_DEFINITIONS).filter(role => 
      this.canSwitchToRole(currentRole, role as UserRole)
    ) as UserRole[];
  }

  /**
   * Validate form data against role permissions
   */
  validateFormData(
    role: UserRole,
    formData: Partial<HeatExchangerInput>
  ): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    Object.keys(formData).forEach(field => {
      const fieldKey = field as keyof HeatExchangerInput;
      const access = this.validateFieldAccess(role, fieldKey, 'write');

      if (!access.allowed) {
        errors.push(`Cannot edit field "${field}": ${access.reason}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get fields organized by section for a role
   */
  getFieldsBySection(role: UserRole, allFields: (keyof HeatExchangerInput)[]): {
    [section: string]: {
      editable: (keyof HeatExchangerInput)[];
      viewable: (keyof HeatExchangerInput)[];
      hidden: (keyof HeatExchangerInput)[];
    };
  } {
    const sections: { [section: string]: { editable: (keyof HeatExchangerInput)[]; viewable: (keyof HeatExchangerInput)[]; hidden: (keyof HeatExchangerInput)[] } } = {};

    allFields.forEach(field => {
      const section = getFieldSection(field);
      const accessInfo = this.getFieldAccessInfo(role, field);

      if (!sections[section]) {
        sections[section] = { editable: [], viewable: [], hidden: [] };
      }

      if (accessInfo.canEdit) {
        sections[section].editable.push(field);
      } else if (accessInfo.canView) {
        sections[section].viewable.push(field);
      } else {
        sections[section].hidden.push(field);
      }
    });

    return sections;
  }
}

// Create singleton instance for the app
export const rolePermissionService = new RolePermissionService();