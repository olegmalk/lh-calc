import React, { useState, useEffect } from 'react';
import { Menu, Button, Group, Text, Tooltip } from '@mantine/core';
import { IconChevronDown, IconUser, IconSettings, IconPackage, IconEye, IconTie } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { UserRole } from '@/types/roles.types';
import { ROLE_DEFINITIONS } from '@/types/roles.types';
import './RoleSelector.css';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  'technologist': <IconUser size={16} />,
  'engineer': <IconSettings size={16} />,
  'supply-manager': <IconPackage size={16} />,
  'director': <IconTie size={16} />,
  'viewer': <IconEye size={16} />,
};

const ROLE_COLORS: Record<UserRole, string> = {
  'technologist': 'var(--role-technologist)',
  'engineer': 'var(--role-engineer)',
  'supply-manager': 'var(--role-supply)',
  'director': 'var(--role-director)',
  'viewer': 'var(--role-viewer)',
};

export interface RoleChangeEvent {
  role: UserRole;
  previous: UserRole | null;
}

export interface RoleSelectorProps {
  onRoleChange?: (event: RoleChangeEvent) => void;
  defaultRole?: UserRole;
}

export function RoleSelector({ onRoleChange, defaultRole = 'technologist' }: RoleSelectorProps) {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    // Load from localStorage or use default
    const stored = localStorage.getItem('selected-role');
    return (stored as UserRole) || defaultRole;
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Save to localStorage whenever role changes
    localStorage.setItem('selected-role', selectedRole);
  }, [selectedRole]);

  const handleRoleChange = (role: UserRole) => {
    const previousRole = selectedRole;
    setSelectedRole(role);
    setIsOpen(false);

    // Emit role change event
    if (onRoleChange) {
      onRoleChange({
        role,
        previous: previousRole !== role ? previousRole : null,
      });
    }

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('roleChanged', {
      detail: { role, previous: previousRole !== role ? previousRole : null }
    }));
  };

  const currentRoleDefinition = ROLE_DEFINITIONS[selectedRole];

  return (
    <Menu
      opened={isOpen}
      onChange={setIsOpen}
      position="bottom-end"
      width={300}
      shadow="md"
      classNames={{
        dropdown: 'role-selector-dropdown'
      }}
    >
      <Menu.Target>
        <Tooltip
          label={t(`roles.descriptions.${selectedRole}`)}
          position="bottom"
          multiline
          w={250}
          withArrow
        >
          <Button
            variant="subtle"
            size="sm"
            rightSection={<IconChevronDown size={14} />}
            leftSection={ROLE_ICONS[selectedRole]}
            className={`role-selector-button role-${selectedRole}`}
            style={{
              '--role-color': ROLE_COLORS[selectedRole]
            } as React.CSSProperties}
          >
            <Text size="sm" fw={500}>
              {t(`roles.names.${selectedRole}`)}
            </Text>
          </Button>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {t('roles.selectRole')}
          </Text>
        </Menu.Label>

        {Object.entries(ROLE_DEFINITIONS).map(([roleId, definition]) => {
          const role = roleId as UserRole;
          const isSelected = role === selectedRole;

          return (
            <Menu.Item
              key={role}
              onClick={() => handleRoleChange(role)}
              leftSection={
                <div 
                  className={`role-icon role-${role}`}
                  style={{
                    '--role-color': ROLE_COLORS[role]
                  } as React.CSSProperties}
                >
                  {ROLE_ICONS[role]}
                </div>
              }
              className={`role-menu-item ${isSelected ? 'selected' : ''} role-${role}`}
            >
              <div>
                <Text size="sm" fw={isSelected ? 600 : 500}>
                  {t(`roles.names.${role}`)}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {t(`roles.descriptions.${role}`)}
                </Text>
                <Group gap={4} mt={4}>
                  <Text size="xs" c="dimmed">
                    {t('roles.hierarchy')}: {definition.hierarchy}
                  </Text>
                  <Text size="xs" c="dimmed">
                    • {t('roles.permissions')}: {Object.values(definition.permissions).filter(p => p === 'full').length}
                  </Text>
                </Group>
              </div>
            </Menu.Item>
          );
        })}

        <Menu.Divider />
        
        <Menu.Item disabled className="role-info">
          <Text size="xs" c="dimmed">
            {t('roles.currentPermissions')}:
          </Text>
          <Group gap={6} mt={2}>
            {Object.entries(currentRoleDefinition.permissions).map(([color, level]) => (
              level === 'full' && (
                <div
                  key={color}
                  className={`permission-indicator ${color}`}
                  title={t(`roles.permissions.${color}`)}
                />
              )
            ))}
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

// Hook for other components to listen to role changes
export function useRoleSelector() {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('selected-role') as UserRole) || 'technologist';
  });

  useEffect(() => {
    const handleRoleChange = (event: CustomEvent<RoleChangeEvent>) => {
      setCurrentRole(event.detail.role);
    };

    window.addEventListener('roleChanged', handleRoleChange as EventListener);
    return () => {
      window.removeEventListener('roleChanged', handleRoleChange as EventListener);
    };
  }, []);

  return {
    role: currentRole,
    roleDefinition: ROLE_DEFINITIONS[currentRole],
    canEdit: (fieldColor: string) => ROLE_DEFINITIONS[currentRole].permissions[fieldColor as keyof typeof ROLE_DEFINITIONS[typeof currentRole]['permissions']] === 'full',
    isReadonly: (fieldColor: string) => ROLE_DEFINITIONS[currentRole].permissions[fieldColor as keyof typeof ROLE_DEFINITIONS[typeof currentRole]['permissions']] === 'readonly',
    isHidden: (fieldColor: string) => ROLE_DEFINITIONS[currentRole].permissions[fieldColor as keyof typeof ROLE_DEFINITIONS[typeof currentRole]['permissions']] === 'hidden',
  };
}