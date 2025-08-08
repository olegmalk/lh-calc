import React from 'react';
import { Grid, NumberInput, Switch, Paper, Title, Group } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';

export const DocumentationSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconFile size={20} />
        <Title order={4}>{t('form.sections.documentation')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Switch
            label={t('form.fields.drawingsIncluded')}
            description={t('form.descriptions.drawingsIncluded')}
            checked={inputs.drawingsIncluded || false}
            onChange={(event) => updateInput('drawingsIncluded', event.currentTarget.checked)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Switch
            label={t('form.fields.manualsIncluded')}
            description={t('form.descriptions.manualsIncluded')}
            checked={inputs.manualsIncluded || false}
            onChange={(event) => updateInput('manualsIncluded', event.currentTarget.checked)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Switch
            label={t('form.fields.certificatesIncluded')}
            description={t('form.descriptions.certificatesIncluded')}
            checked={inputs.certificatesIncluded || false}
            onChange={(event) => updateInput('certificatesIncluded', event.currentTarget.checked)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.warrantyPeriod')}
            description={t('form.descriptions.warrantyPeriodMonths')}
            placeholder={t('form.placeholders.enterMonths')}
            value={inputs.warrantyPeriod || 0}
            onChange={(value) => updateInput('warrantyPeriod', Number(value) || 0)}
            suffix=" мес"
            min={0}
            max={120}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 12 }}>
          <Switch
            label={t('form.fields.serviceContract')}
            description={t('form.descriptions.serviceContract')}
            checked={inputs.serviceContract || false}
            onChange={(event) => updateInput('serviceContract', event.currentTarget.checked)}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};