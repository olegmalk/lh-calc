import React from 'react';
import {
  Card,
  Grid,
  Stack,
  Title,
  Text,
  Badge,
  Group,
  Divider,
  Progress,
  Paper,
  Button,
  Alert,
  Skeleton,
} from '@mantine/core';
import { IconAlertCircle, IconDownload, IconFileSpreadsheet } from '@tabler/icons-react';
import { useCalculationStore } from '../stores/calculationStore';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const CalculationResults: React.FC = () => {
  const { result, isCalculating, error, lastCalculatedAt, exportToExcel, exportToPDF } = useCalculationStore();
  
  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Calculation Error" color="red">
        {error}
      </Alert>
    );
  }
  
  if (isCalculating) {
    return (
      <Card shadow="sm" padding="lg" radius="md">
        <Stack gap="md">
          <Skeleton height={30} />
          <Skeleton height={200} />
          <Skeleton height={100} />
        </Stack>
      </Card>
    );
  }
  
  if (!result) {
    return (
      <Card shadow="sm" padding="lg" radius="md">
        <Text c="dimmed" ta="center" py="xl">
          Enter technical specifications and click Calculate to see results
        </Text>
      </Card>
    );
  }
  
  return (
    <Stack gap="md">
      {/* Summary Card */}
      <Card shadow="sm" padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={3}>Calculation Results (Результат)</Title>
          <Group gap="xs">
            <Badge color="green">Calculated</Badge>
            {lastCalculatedAt && (
              <Text size="xs" color="dimmed">
                {new Date(lastCalculatedAt).toLocaleTimeString()}
              </Text>
            )}
          </Group>
        </Group>
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb="xs">Total Cost</Text>
              <Text size="xl" fw={700} c="blue">
                {formatCurrency(result.totalCost)}
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb="xs">Pressure Test A</Text>
              <Text size="xl" fw={700}>
                {formatNumber(result.pressureTestA)} bar
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb="xs">Pressure Test B</Text>
              <Text size="xl" fw={700}>
                {formatNumber(result.pressureTestB)} bar
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb="xs">Components</Text>
              <Text size="xl" fw={700}>
                {Object.keys(result.componentCosts).length - 1}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </Card>
      
      {/* Component Costs Breakdown */}
      <Card shadow="sm" padding="lg" radius="md">
        <Title order={4} mb="md">Component Costs Breakdown</Title>
        
        <Stack gap="sm">
          {Object.entries(result.componentCosts).map(([key, value]) => {
            if (key === 'total') return null;
            const percentage = (value / result.componentCosts.total) * 100;
            
            return (
              <div key={key}>
                <Group justify="space-between" mb={4}>
                  <Text size="sm" tt="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <Text size="sm" fw={500}>
                    {formatCurrency(value)}
                  </Text>
                </Group>
                <Progress 
                  value={percentage} 
                  size="sm" 
                  color={percentage > 30 ? 'red' : percentage > 20 ? 'yellow' : 'blue'}
                />
              </div>
            );
          })}
        </Stack>
        
        <Divider my="md" />
        
        <Group justify="space-between">
          <Text fw={600}>Total</Text>
          <Text fw={700} size="lg" c="blue">
            {formatCurrency(result.componentCosts.total)}
          </Text>
        </Group>
      </Card>
      
      {/* Material Requirements */}
      <Card shadow="sm" padding="lg" radius="md">
        <Title order={4} mb="md">Material Requirements</Title>
        
        <Grid>
          {Array.from(result.materialRequirements.entries()).map(([key, value]) => (
            <Grid.Col span={{ base: 12, sm: 6 }} key={key}>
              <Paper p="sm" withBorder>
                <Text size="xs" c="dimmed" tt="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text fw={500}>
                  {formatNumber(value, key.includes('Mass') ? 2 : 4)} 
                  {key.includes('Mass') ? ' kg' : ' m³'}
                </Text>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Card>
      
      {/* Export Actions */}
      <Card shadow="sm" padding="lg" radius="md">
        <Group justify="space-between">
          <Title order={4}>Export Options</Title>
          <Group>
            <Button 
              leftSection={<IconFileSpreadsheet size={16} />}
              variant="light"
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>
            <Button 
              leftSection={<IconDownload size={16} />}
              variant="light"
              onClick={exportToPDF}
            >
              Export to PDF
            </Button>
          </Group>
        </Group>
      </Card>
    </Stack>
  );
};