import { NavLink } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  IconDeviceFloppy,
  IconCalculator,
  IconClipboardList,
} from '@tabler/icons-react';

// MVP Navigation only
const navigation = [
  { path: '/calculations', icon: IconCalculator, label: 'navigation.calculations' },
  { path: '/project-details', icon: IconClipboardList, label: 'navigation.projectDetails' },
  { path: '/saved-calculations', icon: IconDeviceFloppy, label: 'navigation.savedCalculations' },
];

export function AppNavbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {navigation.map((item) => (
        <NavLink
          key={item.path}
          active={location.pathname === item.path}
          label={t(item.label)}
          leftSection={<item.icon size={20} />}
          onClick={() => navigate(item.path)}
          mb="xs"
        />
      ))}
    </>
  );
}