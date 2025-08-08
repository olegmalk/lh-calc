import { useEffect, useState } from 'react';
import { Container, Title, Stack, Alert, Group, SimpleGrid, Card, Text, Button } from '@mantine/core';
import { IconAlertCircle, IconFileText, IconClock, IconCheck, IconCalculator, IconDeviceFloppy, IconFileExport, IconSend } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { TechnicalInputFormSimple } from '../components/TechnicalInputFormSimple';
import { CalculationResults } from '../components/CalculationResults';
import { SaveCalculationModal } from '../components/SaveCalculationModal';
import { useInputStore } from '../stores/inputStore';
import { useCalculationStore } from '../stores/calculationStore';

export function DashboardPage() {
  const { t } = useTranslation();
  const [saveModalOpened, setSaveModalOpened] = useState(false);
  const { inputs } = useInputStore();
  const { result, error, lastCalculatedAt, calculate } = useCalculationStore();
  
  // Auto-calculate on first load if we have valid inputs
  useEffect(() => {
    if (!result && inputs.equipmentType) {
      calculate(inputs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Stats based on actual data
  const stats = [
    { 
      title: t('dashboard.stats.equipmentType'), 
      value: inputs.equipmentType || t('dashboard.stats.notSelected'), 
      icon: IconFileText, 
      color: 'blue' 
    },
    { 
      title: t('dashboard.stats.plateCount'), 
      value: inputs.plateCount?.toString() || '0', 
      icon: IconCalculator, 
      color: 'orange' 
    },
    { 
      title: t('dashboard.stats.lastCalculated'), 
      value: lastCalculatedAt ? new Date(lastCalculatedAt).toLocaleTimeString() : t('dashboard.stats.never'), 
      icon: IconClock, 
      color: lastCalculatedAt ? 'green' : 'gray' 
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Title order={2}>{t('dashboard.welcome')}</Title>
        
        {/* Quick Stats */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} padding="lg" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                      {stat.title}
                    </Text>
                    <Text fw={700} size="xl">
                      {stat.value}
                    </Text>
                  </div>
                  <Icon size={32} color={`var(--mantine-color-${stat.color}-6)`} />
                </Group>
              </Card>
            );
          })}
        </SimpleGrid>
        
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title={t('results.calculationError')} color="red">
            {error}
          </Alert>
        )}
        
        {/* Success message */}
        {result && !error && (
          <Alert icon={<IconCheck size={16} />} color="green" variant="light">
            {t('results.calculationSuccess', { equipmentType: inputs.equipmentType })}
          </Alert>
        )}
        
        {/* Action buttons */}
        {result && (
          <Group>
            <Button
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={() => setSaveModalOpened(true)}
            >
              {t('storage.saveCalculation')}
            </Button>
            <Button
              leftSection={<IconFileExport size={16} />}
              variant="light"
              disabled
            >
              {t('storage.exportToExcel')}
            </Button>
            <Button
              leftSection={<IconSend size={16} />}
              variant="light"
              color="orange"
              disabled
            >
              {t('storage.sendToCRM')}
            </Button>
          </Group>
        )}
        
        <TechnicalInputFormSimple />
        
        <CalculationResults />
        
        {/* Save Modal */}
        <SaveCalculationModal
          opened={saveModalOpened}
          onClose={() => setSaveModalOpened(false)}
          inputs={inputs}
          results={result!}
        />
      </Stack>
    </Container>
  );
}