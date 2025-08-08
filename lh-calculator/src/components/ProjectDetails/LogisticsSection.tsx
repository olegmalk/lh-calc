import React from 'react';
import { Grid, Paper, Title, Group, Switch, TextInput, Select } from '@mantine/core';
import { IconTruck, IconPackage, IconWorld } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../../stores/inputStore';

export const LogisticsSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  const packagingTypes = [
    { value: 'standard', label: t('logistics.packagingTypes.standard') },
    { value: 'reinforced', label: t('logistics.packagingTypes.reinforced') },
    { value: 'export', label: t('logistics.packagingTypes.export') },
    { value: 'custom', label: t('logistics.packagingTypes.custom') },
  ];

  const shippingMethods = [
    { value: 'road', label: t('logistics.shippingMethods.road') },
    { value: 'rail', label: t('logistics.shippingMethods.rail') },
    { value: 'sea', label: t('logistics.shippingMethods.sea') },
    { value: 'air', label: t('logistics.shippingMethods.air') },
    { value: 'combined', label: t('logistics.shippingMethods.combined') },
  ];

  const deliveryTerms = [
    { value: 'EXW', label: 'EXW - Ex Works' },
    { value: 'FCA', label: 'FCA - Free Carrier' },
    { value: 'CPT', label: 'CPT - Carriage Paid To' },
    { value: 'CIP', label: 'CIP - Carriage and Insurance Paid To' },
    { value: 'DAP', label: 'DAP - Delivered At Place' },
    { value: 'DPU', label: 'DPU - Delivered At Place Unloaded' },
    { value: 'DDP', label: 'DDP - Delivered Duty Paid' },
  ];

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconTruck size={20} />
        <Title order={3}>{t('projectDetails.sections.logistics')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.packagingType')}
            placeholder={t('form.placeholders.packagingType')}
            data={packagingTypes}
            value={inputs.packagingType || ''}
            onChange={(value) => updateInput('packagingType', value || '', true)}
            leftSection={<IconPackage size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label={t('form.fields.packagingMaterial')}
            placeholder={t('form.placeholders.packagingMaterial')}
            value={inputs.packagingMaterial || ''}
            onChange={(event) => updateInput('packagingMaterial', event.currentTarget.value, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Switch
            label={t('form.fields.crateRequired')}
            checked={inputs.crateRequired || false}
            onChange={(event) => updateInput('crateRequired', event.currentTarget.checked, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Switch
            label={t('form.fields.insuranceRequired')}
            checked={inputs.insuranceRequired || false}
            onChange={(event) => updateInput('insuranceRequired', event.currentTarget.checked, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Switch
            label={t('form.fields.customsClearance')}
            checked={inputs.customsClearance || false}
            onChange={(event) => updateInput('customsClearance', event.currentTarget.checked, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.shippingMethod')}
            placeholder={t('form.placeholders.shippingMethod')}
            data={shippingMethods}
            value={inputs.shippingMethod || ''}
            onChange={(value) => updateInput('shippingMethod', value || '', true)}
            leftSection={<IconTruck size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.deliveryTerms')}
            placeholder={t('form.placeholders.deliveryTerms')}
            data={deliveryTerms}
            value={inputs.deliveryTerms || ''}
            onChange={(value) => updateInput('deliveryTerms', value || '', true)}
            leftSection={<IconWorld size={16} />}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};