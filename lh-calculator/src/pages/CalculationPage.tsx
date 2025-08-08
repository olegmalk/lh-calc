import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack,
  Paper,
  Badge,
  Grid
} from '@mantine/core';
import { IconCalculator, IconDeviceFloppy, IconRefresh } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { useCurrentRole, useRoleDefinition } from '../stores/roleStore';
import { useInputStore } from '../stores/inputStore';
import { TechnicalSection } from '../components/Calculation/TechnicalSection';
import { EngineeringSection } from '../components/Calculation/EngineeringSection';
import { SupplySection } from '../components/Calculation/SupplySection';
import { ExecutiveSection } from '../components/Calculation/ExecutiveSection';
import { CalculationResults } from '../components/CalculationResults';

export function CalculationPage() {
  const { t } = useTranslation();
  const currentRole = useCurrentRole();
  const roleDefinition = useRoleDefinition();
  const { inputs, reset } = useInputStore();

  // Section expansion state - expand user's primary section by default
  const [expandedSections, setExpandedSections] = useState({
    technical: currentRole === 'technologist',
    engineering: currentRole === 'engineer', 
    supply: currentRole === 'supply-manager',
    executive: currentRole === 'director'
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = () => {
    try {
      const calculationData = {
        inputs,
        timestamp: new Date().toISOString(),
        role: currentRole,
        calculationName: `${t('calculation.calculation')} - ${new Date().toLocaleDateString()}`
      };
      
      // Save to localStorage (in production, this would be an API call)
      const existingSaved = JSON.parse(localStorage.getItem('lh-calculator-saved') || '[]');
      existingSaved.push(calculationData);
      localStorage.setItem('lh-calculator-saved', JSON.stringify(existingSaved));
      
      notifications.show({
        title: t('common.success'),
        message: t('calculation.saveSuccess'),
        color: 'green',
      });
    } catch {
      notifications.show({
        title: t('common.error'),
        message: t('calculation.saveFailed'),
        color: 'red',
      });
    }
  };

  const handleReset = () => {
    reset();
    notifications.show({
      title: t('common.info'),
      message: t('calculation.resetSuccess'),
      color: 'blue',
    });
  };

  // Determine which sections to show based on role permissions
  const shouldShowSection = (section: string) => {
    switch (section) {
      case 'technical':
        return ['technologist', 'supply-manager', 'director', 'viewer'].includes(currentRole);
      case 'engineering':
        return ['engineer', 'director', 'viewer'].includes(currentRole);
      case 'supply':
        return ['supply-manager', 'director', 'viewer'].includes(currentRole);
      case 'executive':
        return ['director', 'viewer'].includes(currentRole);
      default:
        return false;
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Page Header */}
        <Paper p="lg" withBorder>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2} mb="xs">{t('pages.calculation')}</Title>
              <Text c="dimmed" size="sm" mb="md">
                {t('calculation.description')}
              </Text>
              <Group gap="xs">
                <Badge variant="light" color="blue">
                  {roleDefinition.name}
                </Badge>
                <Badge variant="light" color="gray" size="sm">
                  {t('calculation.hierarchyLevel', { level: roleDefinition.hierarchy })}
                </Badge>
              </Group>
            </div>
            
            <Group gap="sm">
              <Button
                variant="light"
                leftSection={<IconRefresh size="1rem" />}
                onClick={handleReset}
                color="gray"
              >
                {t('common.reset')}
              </Button>
              <Button
                variant="light"
                leftSection={<IconDeviceFloppy size="1rem" />}
                onClick={handleSave}
                color="blue"
              >
                {t('common.save')}
              </Button>
            </Group>
          </Group>
        </Paper>

        <Grid>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="md">
              {/* Technical Section */}
              {shouldShowSection('technical') && (
                <TechnicalSection
                  expanded={expandedSections.technical}
                  onToggle={() => toggleSection('technical')}
                />
              )}

              {/* Engineering Section */}
              {shouldShowSection('engineering') && (
                <EngineeringSection
                  expanded={expandedSections.engineering}
                  onToggle={() => toggleSection('engineering')}
                />
              )}

              {/* Supply Section */}
              {shouldShowSection('supply') && (
                <SupplySection
                  expanded={expandedSections.supply}
                  onToggle={() => toggleSection('supply')}
                />
              )}

              {/* Executive Section */}
              {shouldShowSection('executive') && (
                <ExecutiveSection
                  expanded={expandedSections.executive}
                  onToggle={() => toggleSection('executive')}
                />
              )}
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            {/* Calculation Results */}
            <Paper p="lg" withBorder h="fit-content" pos="sticky" top="1rem">
              <Group mb="md" justify="space-between">
                <Title order={3}>{t('calculation.results')}</Title>
                <IconCalculator size={20} />
              </Group>
              <CalculationResults />
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Role-based Tips */}
        <Paper p="md" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
          <Text size="sm" fw={500} mb="xs">{t('calculation.tips.title')}</Text>
          <Text size="sm" c="dimmed">
            {t(`calculation.tips.${currentRole}`)}
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}