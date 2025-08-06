import { useEffect } from 'react';
import { Container, Title, Stack, Alert, Group, Button, SimpleGrid, Card, Text } from '@mantine/core';
import { IconAlertCircle, IconCalculator, IconFileText, IconClock, IconCheck } from '@tabler/icons-react';
import { TechnicalInputForm } from '../components/TechnicalInputForm';
import { CalculationResults } from '../components/CalculationResults';
import { useInputStore } from '../stores/inputStore';
import { useCalculationStore } from '../stores/calculationStore';

export function DashboardPage() {
  const { inputs } = useInputStore();
  const { calculate, result, error, isCalculating, lastCalculatedAt } = useCalculationStore();
  
  // Auto-calculate on first load if we have valid inputs
  useEffect(() => {
    if (!result && inputs.equipmentType) {
      calculate(inputs);
    }
  }, []);

  // Stats based on actual data
  const stats = [
    { 
      title: 'Equipment Type', 
      value: inputs.equipmentType || 'Not Selected', 
      icon: IconFileText, 
      color: 'blue' 
    },
    { 
      title: 'Plate Count', 
      value: inputs.plateCount?.toString() || '0', 
      icon: IconCalculator, 
      color: 'orange' 
    },
    { 
      title: 'Last Calculated', 
      value: lastCalculatedAt ? new Date(lastCalculatedAt).toLocaleTimeString() : 'Never', 
      icon: IconClock, 
      color: lastCalculatedAt ? 'green' : 'gray' 
    },
  ];

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>LH Calculator - Heat Exchanger Cost Analysis</Title>
          <Button 
            leftSection={<IconCalculator size={16} />}
            onClick={() => calculate(inputs)}
            loading={isCalculating}
            variant="filled"
            disabled={!inputs.equipmentType}
          >
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </Button>
        </Group>
        
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
          <Alert icon={<IconAlertCircle size={16} />} title="Calculation Error" color="red">
            {error}
          </Alert>
        )}
        
        {/* Success message */}
        {result && !error && (
          <Alert icon={<IconCheck size={16} />} color="green" variant="light">
            Calculations completed successfully using {inputs.equipmentType} configuration
          </Alert>
        )}
        
        <TechnicalInputForm />
        
        <CalculationResults />
      </Stack>
    </Container>
  );
}