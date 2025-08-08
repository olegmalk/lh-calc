/**
 * Unit Tests for Role Permission System
 * Comprehensive testing of role-based field access control
 */

import { describe, expect, test } from 'vitest';
import {
  canEditField,
  canViewField,
  getFieldPermission,
  filterEditableInputs,
  validateFieldAccess,
  canSwitchToRole,
  getAvailableRoles,
  validateRoleBasedForm,
  createFieldDescriptor
} from './role-permissions';
import type { UserRole } from '../types/roles.types';
import { ROLE_DEFINITIONS } from '../types/roles.types';

describe('Role Permission System', () => {
  // Test basic field access permissions
  describe('Field Access Permissions', () => {
    test('Technologist can edit yellow and green fields', () => {
      expect(canEditField('technologist', 'equipmentType')).toBe(true); // yellow
      expect(canEditField('technologist', 'plateCount')).toBe(true); // green
      expect(canEditField('technologist', 'flangeHotPressure1')).toBe(false); // orange
      expect(canEditField('technologist', 'discountPercent')).toBe(false); // red
    });

    test('Engineer can edit orange fields only', () => {
      expect(canEditField('engineer', 'flangeHotPressure1')).toBe(true); // orange
      expect(canEditField('engineer', 'equipmentType')).toBe(false); // yellow
      expect(canEditField('engineer', 'plateCount')).toBe(false); // green
      expect(canEditField('engineer', 'discountPercent')).toBe(false); // red
    });

    test('Supply Manager can edit green fields only', () => {
      expect(canEditField('supply-manager', 'plateCount')).toBe(true); // green
      expect(canEditField('supply-manager', 'laborRate')).toBe(true); // green
      expect(canEditField('supply-manager', 'equipmentType')).toBe(false); // yellow
      expect(canEditField('supply-manager', 'flangeHotPressure1')).toBe(false); // orange
      expect(canEditField('supply-manager', 'discountPercent')).toBe(false); // red
    });

    test('Director can edit red fields only', () => {
      expect(canEditField('director', 'discountPercent')).toBe(true); // red
      expect(canEditField('director', 'specialCost1')).toBe(true); // red
      expect(canEditField('director', 'equipmentType')).toBe(false); // yellow
      expect(canEditField('director', 'plateCount')).toBe(false); // green
      expect(canEditField('director', 'flangeHotPressure1')).toBe(false); // orange
    });

    test('Viewer cannot edit any fields', () => {
      expect(canEditField('viewer', 'equipmentType')).toBe(false);
      expect(canEditField('viewer', 'plateCount')).toBe(false);
      expect(canEditField('viewer', 'flangeHotPressure1')).toBe(false);
      expect(canEditField('viewer', 'discountPercent')).toBe(false);
    });
  });

  describe('Field View Permissions', () => {
    test('All roles can view all fields except viewer with hidden permissions', () => {
      const roles: UserRole[] = ['technologist', 'engineer', 'supply-manager', 'director'];
      
      roles.forEach(role => {
        expect(canViewField(role, 'equipmentType')).toBe(true);
        expect(canViewField(role, 'plateCount')).toBe(true);
        expect(canViewField(role, 'flangeHotPressure1')).toBe(true);
        expect(canViewField(role, 'discountPercent')).toBe(true);
      });
    });

    test('Viewer can view all fields (readonly mode)', () => {
      expect(canViewField('viewer', 'equipmentType')).toBe(true);
      expect(canViewField('viewer', 'plateCount')).toBe(true);
      expect(canViewField('viewer', 'flangeHotPressure1')).toBe(true);
      expect(canViewField('viewer', 'discountPercent')).toBe(true);
    });
  });

  describe('Input Filtering', () => {
    const sampleInputs = {
      equipmentType: 'К4-750', // yellow
      plateCount: 400, // green
      flangeHotPressure1: 'Ру10', // orange
      discountPercent: 5 // red
    };

    test('Filter editable inputs for technologist', () => {
      const filtered = filterEditableInputs('technologist', sampleInputs);
      expect(filtered).toHaveProperty('equipmentType');
      expect(filtered).toHaveProperty('plateCount');
      expect(filtered).not.toHaveProperty('flangeHotPressure1');
      expect(filtered).not.toHaveProperty('discountPercent');
    });

    test('Filter editable inputs for engineer', () => {
      const filtered = filterEditableInputs('engineer', sampleInputs);
      expect(filtered).toHaveProperty('flangeHotPressure1');
      expect(filtered).not.toHaveProperty('equipmentType');
      expect(filtered).not.toHaveProperty('plateCount');
      expect(filtered).not.toHaveProperty('discountPercent');
    });

    test('Filter editable inputs for supply manager', () => {
      const filtered = filterEditableInputs('supply-manager', sampleInputs);
      expect(filtered).toHaveProperty('plateCount');
      expect(filtered).not.toHaveProperty('equipmentType');
      expect(filtered).not.toHaveProperty('flangeHotPressure1');
      expect(filtered).not.toHaveProperty('discountPercent');
    });

    test('Filter editable inputs for director', () => {
      const filtered = filterEditableInputs('director', sampleInputs);
      expect(filtered).toHaveProperty('discountPercent');
      expect(filtered).not.toHaveProperty('equipmentType');
      expect(filtered).not.toHaveProperty('plateCount');
      expect(filtered).not.toHaveProperty('flangeHotPressure1');
    });
  });

  describe('Role Hierarchy and Switching', () => {
    test('Director can switch to any role', () => {
      expect(canSwitchToRole('director', 'technologist')).toBe(true);
      expect(canSwitchToRole('director', 'engineer')).toBe(true);
      expect(canSwitchToRole('director', 'supply-manager')).toBe(true);
      expect(canSwitchToRole('director', 'viewer')).toBe(true);
    });

    test('Supply manager can switch to technologist, engineer, and viewer but not director', () => {
      expect(canSwitchToRole('supply-manager', 'technologist')).toBe(true);
      expect(canSwitchToRole('supply-manager', 'engineer')).toBe(true);
      expect(canSwitchToRole('supply-manager', 'viewer')).toBe(true);
      expect(canSwitchToRole('supply-manager', 'director')).toBe(false);
    });

    test('Technologist and Engineer cannot switch to higher privilege roles', () => {
      expect(canSwitchToRole('technologist', 'director')).toBe(false);
      expect(canSwitchToRole('technologist', 'supply-manager')).toBe(false);
      expect(canSwitchToRole('engineer', 'director')).toBe(false);
      expect(canSwitchToRole('engineer', 'supply-manager')).toBe(false);
    });

    test('Get available roles for each role type', () => {
      const directorRoles = getAvailableRoles('director');
      expect(directorRoles).toContain('technologist');
      expect(directorRoles).toContain('engineer');
      expect(directorRoles).toContain('supply-manager');
      expect(directorRoles).toContain('viewer');
      expect(directorRoles).toContain('director');

      const techRoles = getAvailableRoles('technologist');
      expect(techRoles).toContain('technologist');
      expect(techRoles).toContain('engineer');
      expect(techRoles).toContain('viewer');
      expect(techRoles).not.toContain('director');
      expect(techRoles).not.toContain('supply-manager');
    });
  });

  describe('Form Validation', () => {
    test('Validate technologist form data', () => {
      const formData = {
        equipmentType: 'К4-750', // allowed
        plateCount: 400, // allowed
        flangeHotPressure1: 'Ру10' // not allowed
      };

      const result = validateRoleBasedForm('technologist', formData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('flangeHotPressure1');
    });

    test('Validate director form data', () => {
      const formData = {
        discountPercent: 5, // allowed
        specialCost1: 1000 // allowed
      };

      const result = validateRoleBasedForm('director', formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Field Descriptors', () => {
    test('Create field descriptor for technologist', () => {
      const descriptor = createFieldDescriptor('technologist', 'equipmentType');
      expect(descriptor.field).toBe('equipmentType');
      expect(descriptor.color).toBe('yellow');
      expect(descriptor.section).toBe('technical');
      expect(descriptor.isEditable).toBe(true);
      expect(descriptor.isVisible).toBe(true);
    });

    test('Create field descriptor for viewer', () => {
      const descriptor = createFieldDescriptor('viewer', 'discountPercent');
      expect(descriptor.field).toBe('discountPercent');
      expect(descriptor.color).toBe('red');
      expect(descriptor.section).toBe('executive');
      expect(descriptor.isEditable).toBe(false);
      expect(descriptor.isVisible).toBe(true);
    });
  });

  describe('Permission Level Testing', () => {
    test('Get correct permission levels for each role', () => {
      // Technologist permissions
      expect(getFieldPermission('technologist', 'equipmentType')).toBe('full');
      expect(getFieldPermission('technologist', 'plateCount')).toBe('full');
      expect(getFieldPermission('technologist', 'flangeHotPressure1')).toBe('readonly');
      expect(getFieldPermission('technologist', 'discountPercent')).toBe('readonly');

      // Director permissions
      expect(getFieldPermission('director', 'discountPercent')).toBe('full');
      expect(getFieldPermission('director', 'equipmentType')).toBe('readonly');
    });
  });

  describe('Access Validation', () => {
    test('Validate read access', () => {
      const readAccess = validateFieldAccess('technologist', 'equipmentType', 'read');
      expect(readAccess.allowed).toBe(true);
      expect(readAccess.reason).toBeUndefined();
    });

    test('Validate write access - allowed', () => {
      const writeAccess = validateFieldAccess('technologist', 'equipmentType', 'write');
      expect(writeAccess.allowed).toBe(true);
      expect(writeAccess.reason).toBeUndefined();
    });

    test('Validate write access - denied', () => {
      const writeAccess = validateFieldAccess('technologist', 'discountPercent', 'write');
      expect(writeAccess.allowed).toBe(false);
      expect(writeAccess.reason).toContain('cannot edit');
    });
  });

  describe('Role Definitions Integrity', () => {
    test('All roles have required properties', () => {
      Object.entries(ROLE_DEFINITIONS).forEach(([roleId, definition]) => {
        expect(definition).toHaveProperty('id');
        expect(definition).toHaveProperty('name');
        expect(definition).toHaveProperty('description');
        expect(definition).toHaveProperty('hierarchy');
        expect(definition).toHaveProperty('permissions');
        expect(definition.id).toBe(roleId);
        expect(typeof definition.hierarchy).toBe('number');
      });
    });

    test('Role hierarchies are properly ordered', () => {
      expect(ROLE_DEFINITIONS.director.hierarchy).toBe(1); // Highest
      expect(ROLE_DEFINITIONS['supply-manager'].hierarchy).toBe(2);
      expect(ROLE_DEFINITIONS.technologist.hierarchy).toBe(3);
      expect(ROLE_DEFINITIONS.engineer.hierarchy).toBe(3);
      expect(ROLE_DEFINITIONS.viewer.hierarchy).toBe(4); // Lowest
    });
  });
});