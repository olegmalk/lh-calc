/**
 * Pure Role State Store
 * Clean state management without business logic dependencies
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { UserRole, RoleDefinition } from '../types/roles.types';
import { ROLE_DEFINITIONS } from '../types/roles.types';

interface RoleState {
  // Pure state
  currentRole: UserRole;
  
  // Simple actions
  setRole: (role: UserRole) => void;
  
  // Role metadata (static lookups only)
  getRoleDefinition: () => RoleDefinition;
}


export const useRoleStore = create<RoleState>()(
  devtools(
    persist(
      (set, get) => ({
        currentRole: 'technologist' as UserRole,
        
        setRole: (role: UserRole) => 
          set(() => ({
            currentRole: role
          }), false, 'setRole'),
        
        getRoleDefinition: (): RoleDefinition => {
          const { currentRole } = get();
          return ROLE_DEFINITIONS[currentRole];
        },
      }),
      {
        name: 'lh-calculator-role-store',
        partialize: (state) => ({ currentRole: state.currentRole }),
      }
    )
  )
);

// Simple selector hooks
export const useCurrentRole = () => useRoleStore((state) => state.currentRole);
export const useRoleDefinition = () => useRoleStore((state) => state.getRoleDefinition());