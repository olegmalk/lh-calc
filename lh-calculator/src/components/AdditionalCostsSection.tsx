import React from 'react';
import { Grid, NumberInput, TextInput, Paper, Title, Group, Divider, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';

export const AdditionalCostsSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  // const formatCurrency = (value: number) => {
  //   return new Intl.NumberFormat('ru-RU', {
  //     style: 'currency',
  //     currency: 'RUB',
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0
  //   }).format(value);
  // };

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconPlus size={20} />
        <Title order={4}>{t('form.sections.additionalCosts')}</Title>
      </Group>
      
      <Stack gap="lg">
        {/* Additional Materials */}
        <div>
          <Title order={5} mb="md" c="blue">
            {t('form.subsections.additionalMaterials')}
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={t('form.fields.additionalMaterial1')}
                placeholder={t('form.placeholders.materialName')}
                value={inputs.additionalMaterial1 || ''}
                onChange={(event) => updateInput('additionalMaterial1', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.additionalMaterialCost1')}
                placeholder={t('form.placeholders.enterCost')}
                value={inputs.additionalMaterialCost1 || 0}
                onChange={(value) => updateInput('additionalMaterialCost1', Number(value) || 0)}
                suffix=" ₽"
                min={0}
                max={1000000}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={t('form.fields.additionalMaterial2')}
                placeholder={t('form.placeholders.materialName')}
                value={inputs.additionalMaterial2 || ''}
                onChange={(event) => updateInput('additionalMaterial2', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.additionalMaterialCost2')}
                placeholder={t('form.placeholders.enterCost')}
                value={inputs.additionalMaterialCost2 || 0}
                onChange={(value) => updateInput('additionalMaterialCost2', Number(value) || 0)}
                suffix=" ₽"
                min={0}
                max={1000000}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={t('form.fields.additionalMaterial3')}
                placeholder={t('form.placeholders.materialName')}
                value={inputs.additionalMaterial3 || ''}
                onChange={(event) => updateInput('additionalMaterial3', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.additionalMaterialCost3')}
                placeholder={t('form.placeholders.enterCost')}
                value={inputs.additionalMaterialCost3 || 0}
                onChange={(value) => updateInput('additionalMaterialCost3', Number(value) || 0)}
                suffix=" ₽"
                min={0}
                max={1000000}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Divider />

        {/* Additional Labor */}
        <div>
          <Title order={5} mb="md" c="orange">
            {t('form.subsections.additionalLabor')}
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={t('form.fields.additionalLabor1')}
                placeholder={t('form.placeholders.laborDescription')}
                value={inputs.additionalLabor1 || ''}
                onChange={(event) => updateInput('additionalLabor1', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.additionalLaborCost1')}
                placeholder={t('form.placeholders.enterCost')}
                value={inputs.additionalLaborCost1 || 0}
                onChange={(value) => updateInput('additionalLaborCost1', Number(value) || 0)}
                suffix=" ₽"
                min={0}
                max={1000000}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={t('form.fields.additionalLabor2')}
                placeholder={t('form.placeholders.laborDescription')}
                value={inputs.additionalLabor2 || ''}
                onChange={(event) => updateInput('additionalLabor2', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.additionalLaborCost2')}
                placeholder={t('form.placeholders.enterCost')}
                value={inputs.additionalLaborCost2 || 0}
                onChange={(value) => updateInput('additionalLaborCost2', Number(value) || 0)}
                suffix=" ₽"
                min={0}
                max={1000000}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={t('form.fields.additionalLabor3')}
                placeholder={t('form.placeholders.laborDescription')}
                value={inputs.additionalLabor3 || ''}
                onChange={(event) => updateInput('additionalLabor3', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.additionalLaborCost3')}
                placeholder={t('form.placeholders.enterCost')}
                value={inputs.additionalLaborCost3 || 0}
                onChange={(value) => updateInput('additionalLaborCost3', Number(value) || 0)}
                suffix=" ₽"
                min={0}
                max={1000000}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Divider />

        {/* Additional Services */}
        <div>
          <Title order={5} mb="md" c="green">
            {t('form.subsections.additionalServices')}
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={t('form.fields.additionalService1')}
                placeholder={t('form.placeholders.serviceDescription')}
                value={inputs.additionalService1 || ''}
                onChange={(event) => updateInput('additionalService1', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.additionalServiceCost1')}
                placeholder={t('form.placeholders.enterCost')}
                value={inputs.additionalServiceCost1 || 0}
                onChange={(value) => updateInput('additionalServiceCost1', Number(value) || 0)}
                suffix=" ₽"
                min={0}
                max={1000000}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={t('form.fields.additionalService2')}
                placeholder={t('form.placeholders.serviceDescription')}
                value={inputs.additionalService2 || ''}
                onChange={(event) => updateInput('additionalService2', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.additionalServiceCost2')}
                placeholder={t('form.placeholders.enterCost')}
                value={inputs.additionalServiceCost2 || 0}
                onChange={(value) => updateInput('additionalServiceCost2', Number(value) || 0)}
                suffix=" ₽"
                min={0}
                max={1000000}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={t('form.fields.additionalService3')}
                placeholder={t('form.placeholders.serviceDescription')}
                value={inputs.additionalService3 || ''}
                onChange={(event) => updateInput('additionalService3', event.currentTarget.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.additionalServiceCost3')}
                placeholder={t('form.placeholders.enterCost')}
                value={inputs.additionalServiceCost3 || 0}
                onChange={(value) => updateInput('additionalServiceCost3', Number(value) || 0)}
                suffix=" ₽"
                min={0}
                max={1000000}
              />
            </Grid.Col>
          </Grid>
        </div>
      </Stack>
    </Paper>
  );
};