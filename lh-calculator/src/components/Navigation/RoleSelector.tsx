import React, { useState, useEffect } from 'react';
import { Menu, Button, Group, Text, Tooltip } from '@mantine/core';
import { IconChevronDown, IconUser, IconSettings, IconPackage, IconEye, IconTie } from '@tabler/icons-react';
import { useSafeTranslation } from '@/hooks/useSafeTranslation';
import { type UserRole, ROLE_DEFINITIONS } from '../../types/roles.types';
import { useRoleStore } from '../../stores/roleStore';
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
  const { t, getRoleName, getRoleDescription } = useSafeTranslation();
  
  // Safe initialization with fallbacks
  const store = useRoleStore();
  const currentRole = store?.currentRole || defaultRole;
  const setRole = store?.setRole || (() => {});
  
  const [isOpen, setIsOpen] = useState(false);

  // Initialize role store if not set, with error handling
  useEffect(() => {
    try {
      if (!currentRole || currentRole === defaultRole) {
        const stored = localStorage.getItem('selected-role') as UserRole;
        const roleToSet = stored && ROLE_DEFINITIONS[stored] ? stored : defaultRole;
        setRole(roleToSet);
      }
    } catch (error) {
      console.warn('Error initializing role:', error);
      // Fallback to default role
      try {
        setRole(defaultRole);
      } catch (fallbackError) {
        console.error('Failed to set fallback role:', fallbackError);
      }
    }
  }, [currentRole, setRole, defaultRole]);

  const handleRoleChange = (role: UserRole) => {
    const previousRole = currentRole;
    setRole(role);
    setIsOpen(false);

    // Save to localStorage
    localStorage.setItem('selected-role', role);

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

  const currentRoleDefinition = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS[defaultRole];

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
          label={getRoleDescription(currentRole)}
          position="bottom"
          multiline
          w={250}
          withArrow
        >
          <Button
            variant="subtle"
            size="sm"
            rightSection={<IconChevronDown size={14} />}
            leftSection={ROLE_ICONS[currentRole]}
            className={`role-selector-button role-${currentRole}`}
            style={{
              '--role-color': ROLE_COLORS[currentRole]
            } as React.CSSProperties}
          >
            <Text size="sm" fw={500}>
              {getRoleName(currentRole)}
            </Text>
          </Button>
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {t('roles.selectRole', 'Select Role')}
          </Text>
        </Menu.Label>

        {Object.entries(ROLE_DEFINITIONS).map(([roleId, definition]) => {
          const role = roleId as UserRole;
          const isSelected = role === currentRole;

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
                  {getRoleName(role)}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {getRoleDescription(role)}
                </Text>
                <Group gap={4} mt={4}>
                  <Text size="xs" c="dimmed">
                    {t('roles.hierarchy', 'Level')}: {definition.hierarchy}
                  </Text>
                  <Text size="xs" c="dimmed">
                    • {t('roles.permissions', 'Editable Fields')}: {Object.values(definition.permissions).filter(p => p === 'full').length}
                  </Text>
                </Group>
              </div>
            </Menu.Item>
          );
        })}

        <Menu.Divider />
        
        <Menu.Item disabled className="role-info">
          <Text size="xs" c="dimmed">
            {t('roles.currentPermissions', 'Current Permissions')}:
          </Text>
          <Group gap={6} mt={2}>
            {Object.entries(currentRoleDefinition.permissions).map(([color, level]) => (
              level === 'full' && (
                <div
                  key={color}
                  className={`permission-indicator ${color}`}
                  title={t(`roles.permissions.${color}`, color)}
                />
              )
            ))}
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
