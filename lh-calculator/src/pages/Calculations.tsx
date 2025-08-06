import { Title, Paper, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function CalculationsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Title order={2} mb="xl">{t('navigation.calculations')}</Title>
      <Paper p="md" radius="md" withBorder>
        <Text c="dimmed">{t('common.noData')}</Text>
      </Paper>
    </>
  );
}