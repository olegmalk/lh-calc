import React from 'react';
import { Grid, NumberInput, Paper, Title, Group, Divider, Stack } from '@mantine/core';
import { IconGauge, IconDroplet, IconTemperature } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';

export const ProcessParametersSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconGauge size={20} />
        <Title order={4}>{t('form.sections.processParameters')}</Title>
      </Group>
      
      <Stack gap="lg">
        <div>
          <Title order={5} mb="md" c="blue">
            {t('form.subsections.sideA')}
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.operatingPressureA')}
                placeholder={t('form.placeholders.enterPressure')}
                value={inputs.operatingPressureA || 0}
                onChange={(value) => updateInput('operatingPressureA', Number(value) || 0)}
                suffix=" бар"
                min={0}
                max={400}
                leftSection={<IconGauge size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.designTemperatureA')}
                placeholder={t('form.placeholders.enterTemperature')}
                value={inputs.designTemperatureA || 0}
                onChange={(value) => updateInput('designTemperatureA', Number(value) || 0)}
                suffix=" °C"
                min={-50}
                max={300}
                leftSection={<IconTemperature size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.flowRateA')}
                placeholder={t('form.placeholders.enterFlowRate')}
                value={inputs.flowRateA || 0}
                onChange={(value) => updateInput('flowRateA', Number(value) || 0)}
                suffix=" л/мин"
                min={0}
                max={10000}
                leftSection={<IconDroplet size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.pressureDropA')}
                placeholder={t('form.placeholders.enterPressure')}
                value={inputs.pressureDropA || 0}
                onChange={(value) => updateInput('pressureDropA', Number(value) || 0)}
                suffix=" кПа"
                min={0}
                max={1000}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Divider />

        <div>
          <Title order={5} mb="md" c="red">
            {t('form.subsections.sideB')}
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.operatingPressureB')}
                placeholder={t('form.placeholders.enterPressure')}
                value={inputs.operatingPressureB || 0}
                onChange={(value) => updateInput('operatingPressureB', Number(value) || 0)}
                suffix=" бар"
                min={0}
                max={400}
                leftSection={<IconGauge size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.designTemperatureB')}
                placeholder={t('form.placeholders.enterTemperature')}
                value={inputs.designTemperatureB || 0}
                onChange={(value) => updateInput('designTemperatureB', Number(value) || 0)}
                suffix=" °C"
                min={-50}
                max={300}
                leftSection={<IconTemperature size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.flowRateB')}
                placeholder={t('form.placeholders.enterFlowRate')}
                value={inputs.flowRateB || 0}
                onChange={(value) => updateInput('flowRateB', Number(value) || 0)}
                suffix=" л/мин"
                min={0}
                max={10000}
                leftSection={<IconDroplet size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.pressureDropB')}
                placeholder={t('form.placeholders.enterPressure')}
                value={inputs.pressureDropB || 0}
                onChange={(value) => updateInput('pressureDropB', Number(value) || 0)}
                suffix=" кПа"
                min={0}
                max={1000}
              />
            </Grid.Col>
          </Grid>
        </div>
      </Stack>
    </Paper>
  );
};