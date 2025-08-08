import React from 'react';
import { Grid, NumberInput, Switch, Paper, Title, Group } from '@mantine/core';
import { IconTools } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';

export const SparePartsSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconTools size={20} />
        <Title order={4}>{t('form.sections.spareParts')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.sparePlates')}
            description={t('form.descriptions.sparePlates')}
            placeholder={t('form.placeholders.enterQuantity')}
            value={inputs.sparePlates || 0}
            onChange={(value) => updateInput('sparePlates', Number(value) || 0)}
            suffix=" шт"
            min={0}
            max={100}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.spareGaskets')}
            description={t('form.descriptions.spareGaskets')}
            placeholder={t('form.placeholders.enterQuantity')}
            value={inputs.spareGaskets || 0}
            onChange={(value) => updateInput('spareGaskets', Number(value) || 0)}
            suffix=" шт"
            min={0}
            max={50}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.spareBolts')}
            description={t('form.descriptions.spareBolts')}
            placeholder={t('form.placeholders.enterQuantity')}
            value={inputs.spareBolts || 0}
            onChange={(value) => updateInput('spareBolts', Number(value) || 0)}
            suffix=" шт"
            min={0}
            max={200}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.spareNuts')}
            description={t('form.descriptions.spareNuts')}
            placeholder={t('form.placeholders.enterQuantity')}
            value={inputs.spareNuts || 0}
            onChange={(value) => updateInput('spareNuts', Number(value) || 0)}
            suffix=" шт"
            min={0}
            max={200}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 12 }}>
          <Switch
            label={t('form.fields.spareKit')}
            description={t('form.descriptions.spareKit')}
            checked={inputs.spareKit || false}
            onChange={(event) => updateInput('spareKit', event.currentTarget.checked)}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};