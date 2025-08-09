/**
 * Role Selector Component
 * UI component for role switching with validation
 */

import React from 'react';
import type { UserRole } from '../types/roles.types';
import { ROLE_DEFINITIONS } from '../types/roles.types';
import { useCurrentRole } from '../stores/roleStore';
import { useRoleStore } from '../stores/roleStore';
import { useRoleSwitching } from '../hooks/useRolePermissions';

interface RoleSelectorProps {
  showDescription?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  showDescription = true
}) => {
  const currentRole = useCurrentRole();
  const { setRole } = useRoleStore();
  const { getAvailableRoles } = useRoleSwitching();

  const availableRoles = getAvailableRoles();
  const currentRoleDefinition = ROLE_DEFINITIONS[currentRole];

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as UserRole;
    setRole(newRole);
  };

  return (
    <div style={{ minWidth: 200 }}>
      <label htmlFor="role-selector" style={{ display: 'block', marginBottom: 8 }}>
        Current Role
      </label>
      <select
        id="role-selector"
        value={currentRole}
        onChange={handleRoleChange}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      >
        {availableRoles.map((roleId) => {
          const role = ROLE_DEFINITIONS[roleId];
          return (
            <option key={roleId} value={roleId}>
              {role.name}
            </option>
          );
        })}
      </select>
      
      {showDescription && (
        <div style={{ marginTop: 4, fontSize: '0.75rem', color: '#666' }}>
          {currentRoleDefinition.description}
        </div>
      )}
    </div>
  );
};