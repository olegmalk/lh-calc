import React from 'react';
import { Grid, Paper, Title, Group, Switch, NumberInput } from '@mantine/core';
import { IconTool, IconSettings, IconBolt } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../../stores/inputStore';

export const SparePartsSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconTool size={20} />
        <Title order={3}>{t('projectDetails.sections.spareParts')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.sparePlates')}
            placeholder={t('form.placeholders.sparePlates')}
            value={inputs.sparePlates || 0}
            onChange={(value) => updateInput('sparePlates', Number(value) || 0, true)}
            min={0}
            max={100}
            leftSection={<IconSettings size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.spareGaskets')}
            placeholder={t('form.placeholders.spareGaskets')}
            value={inputs.spareGaskets || 0}
            onChange={(value) => updateInput('spareGaskets', Number(value) || 0, true)}
            min={0}
            max={100}
            leftSection={<IconSettings size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.spareBolts')}
            placeholder={t('form.placeholders.spareBolts')}
            value={inputs.spareBolts || 0}
            onChange={(value) => updateInput('spareBolts', Number(value) || 0, true)}
            min={0}
            max={200}
            leftSection={<IconBolt size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.spareNuts')}
            placeholder={t('form.placeholders.spareNuts')}
            value={inputs.spareNuts || 0}
            onChange={(value) => updateInput('spareNuts', Number(value) || 0, true)}
            min={0}
            max={200}
            leftSection={<IconBolt size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 12 }}>
          <Switch
            label={t('form.fields.spareKit')}
            description={t('form.descriptions.spareKit')}
            checked={inputs.spareKit || false}
            onChange={(event) => updateInput('spareKit', event.currentTarget.checked, true)}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};