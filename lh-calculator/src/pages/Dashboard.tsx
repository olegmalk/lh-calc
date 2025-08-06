import { Title, Paper, Text, SimpleGrid, Card, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconFileText, IconCalculator, IconClock } from '@tabler/icons-react';

const stats = [
  { title: 'dashboard.totalProjects', value: '0', icon: IconFileText, color: 'blue' },
  { title: 'dashboard.activeCalculations', value: '0', icon: IconCalculator, color: 'orange' },
  { title: 'dashboard.completedToday', value: '0', icon: IconClock, color: 'green' },
];

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title order={2} mb="xl">{t('dashboard.welcome')}</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mb="xl">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {t(stat.title)}
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

      <Paper p="md" radius="md" withBorder>
        <Title order={4} mb="md">{t('dashboard.recentCalculations')}</Title>
        <Text c="dimmed">{t('common.noData')}</Text>
      </Paper>
    </>
  );
}