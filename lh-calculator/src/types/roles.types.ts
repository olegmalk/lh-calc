/**
 * Role Type Definitions and Permissions
 * Epic 1, Story 1.1: Role-based access control for LH Calculator
 */

export type UserRole = 
  | 'technologist' 
  | 'engineer' 
  | 'supply-manager' 
  | 'director' 
  | 'viewer';

export type FieldColor = 
  | 'yellow'   // Technologist dropdowns
  | 'green'    // Manual entry (Technologist/Supply)
  | 'orange'   // Engineering
  | 'red'      // Executive/Director
  | 'readonly'; // View-only fields

export type PermissionLevel = 
  | 'full'     // Can edit field
  | 'readonly' // Can view but not edit
  | 'hidden';  // Field is hidden from user

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  hierarchy: number; // Lower number = higher authority
  permissions: {
    [key in FieldColor]: PermissionLevel;
  };
}

export interface FieldPermission {
  field: string;
  color: FieldColor;
  section: string;
  description?: string;
}

// Role definitions based on Excel color model
export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  'technologist': {
    id: 'technologist',
    name: 'Technologist',
    description: 'Technical specification and equipment configuration',
    hierarchy: 3,
    permissions: {
      yellow: 'full',     // Technologist dropdowns - full access
      green: 'full',      // Manual entry fields - full access
      orange: 'readonly', // Engineering fields - view only
      red: 'readonly',    // Executive fields - view only
      readonly: 'readonly' // System calculated fields - view only
    }
  },
  
  'engineer': {
    id: 'engineer',
    name: 'Design Engineer',
    description: 'Engineering design and component specifications',
    hierarchy: 3,
    permissions: {
      yellow: 'readonly', // Technologist fields - view only
      green: 'readonly',  // Supply fields - view only
      orange: 'full',     // Engineering fields - full access
      red: 'readonly',    // Executive fields - view only
      readonly: 'readonly' // System calculated fields - view only
    }
  },
  
  'supply-manager': {
    id: 'supply-manager',
    name: 'Supply Manager',
    description: 'Cost management and supply chain parameters',
    hierarchy: 2,
    permissions: {
      yellow: 'readonly', // Technologist fields - view only
      green: 'full',      // Supply fields - full access
      orange: 'readonly', // Engineering fields - view only
      red: 'readonly',    // Executive fields - view only
      readonly: 'readonly' // System calculated fields - view only
    }
  },
  
  'director': {
    id: 'director',
    name: 'Director',
    description: 'Executive decisions and final cost adjustments',
    hierarchy: 1,
    permissions: {
      yellow: 'readonly', // Technologist fields - view only
      green: 'readonly',  // Supply fields - view only
      orange: 'readonly', // Engineering fields - view only
      red: 'full',        // Executive fields - full access
      readonly: 'readonly' // System calculated fields - view only
    }
  },
  
  'viewer': {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to all calculations',
    hierarchy: 4,
    permissions: {
      yellow: 'readonly',
      green: 'readonly',
      orange: 'readonly',
      red: 'readonly',
      readonly: 'readonly'
    }
  }
};

// Field categories for organizational purposes
export interface FieldSection {
  id: string;
  name: string;
  description: string;
  primaryRole: UserRole;
  fields: string[];
}

export const FIELD_SECTIONS: Record<string, FieldSection> = {
  'technical': {
    id: 'technical',
    name: 'Technical Specification',
    description: 'Equipment type, materials, and basic parameters',
    primaryRole: 'technologist',
    fields: [] // Populated by field-permissions.ts
  },
  
  'engineering': {
    id: 'engineering',
    name: 'Engineering Design',
    description: 'Flange specifications and component design',
    primaryRole: 'engineer',
    fields: [] // Populated by field-permissions.ts
  },
  
  'supply': {
    id: 'supply',
    name: 'Supply & Costs',
    description: 'Cost parameters and supply chain factors',
    primaryRole: 'supply-manager',
    fields: [] // Populated by field-permissions.ts
  },
  
  'executive': {
    id: 'executive',
    name: 'Executive Controls',
    description: 'Final cost adjustments and management decisions',
    primaryRole: 'director',
    fields: [] // Populated by field-permissions.ts
  },
  
  'project': {
    id: 'project',
    name: 'Project Details',
    description: 'Non-calculation metadata and documentation',
    primaryRole: 'viewer', // All roles can access project details
    fields: [] // Populated by field-permissions.ts
  }
};

// Role hierarchy utilities
export const canRoleOverride = (currentRole: UserRole, targetRole: UserRole): boolean => {
  return ROLE_DEFINITIONS[currentRole].hierarchy <= ROLE_DEFINITIONS[targetRole].hierarchy;
};

export const getRolesByHierarchy = (): UserRole[] => {
  return Object.values(ROLE_DEFINITIONS)
    .sort((a, b) => a.hierarchy - b.hierarchy)
    .map(role => role.id);
};