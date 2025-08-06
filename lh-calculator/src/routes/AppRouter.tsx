import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppHeader } from '@components/layout/AppHeader';
import { AppNavbar } from '@components/layout/AppNavbar';

// Pages - MVP only
import { DashboardPage } from '@pages/Dashboard';
import { TechnicalPartsPage } from '@pages/TechnicalParts';
import { CalculationsPage } from '@pages/Calculations';

export function AppRouter() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <AppHeader />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppNavbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/technical-parts" element={<TechnicalPartsPage />} />
          <Route path="/calculations" element={<CalculationsPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}