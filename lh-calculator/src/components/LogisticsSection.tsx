import React from 'react';
import { Grid, Select, Switch, Paper, Title, Group } from '@mantine/core';
import { IconTruck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';

export const LogisticsSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  const packagingTypes = [
    { value: 'стандарт', label: t('packaging.standard') },
    { value: 'усиленная', label: t('packaging.reinforced') },
    { value: 'морская', label: t('packaging.marine') },
    { value: 'воздушная', label: t('packaging.air') }
  ];

  const packagingMaterials = [
    { value: 'картон', label: t('materials.cardboard') },
    { value: 'фанера', label: t('materials.plywood') },
    { value: 'деревянный_ящик', label: t('materials.woodenCrate') },
    { value: 'металлический_контейнер', label: t('materials.metalContainer') }
  ];

  const shippingMethods = [
    { value: 'автодоставка', label: t('shipping.truck') },
    { value: 'жд_транспорт', label: t('shipping.rail') },
    { value: 'авиадоставка', label: t('shipping.air') },
    { value: 'морская_доставка', label: t('shipping.sea') },
    { value: 'самовывоз', label: t('shipping.pickup') }
  ];

  const deliveryTerms = [
    { value: 'EXW', label: 'EXW - Ex Works' },
    { value: 'FCA', label: 'FCA - Free Carrier' },
    { value: 'CPT', label: 'CPT - Carriage Paid To' },
    { value: 'CIP', label: 'CIP - Carriage and Insurance Paid' },
    { value: 'DAP', label: 'DAP - Delivered at Place' },
    { value: 'DPU', label: 'DPU - Delivered at Place Unloaded' },
    { value: 'DDP', label: 'DDP - Delivered Duty Paid' }
  ];

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconTruck size={20} />
        <Title order={4}>{t('form.sections.logistics')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.packagingType')}
            placeholder={t('form.placeholders.selectPackagingType')}
            data={packagingTypes}
            value={inputs.packagingType || ''}
            onChange={(value) => updateInput('packagingType', value || '')}
            clearable
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.packagingMaterial')}
            placeholder={t('form.placeholders.selectPackagingMaterial')}
            data={packagingMaterials}
            value={inputs.packagingMaterial || ''}
            onChange={(value) => updateInput('packagingMaterial', value || '')}
            clearable
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Switch
            label={t('form.fields.crateRequired')}
            description={t('form.descriptions.crateRequired')}
            checked={inputs.crateRequired || false}
            onChange={(event) => updateInput('crateRequired', event.currentTarget.checked)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.shippingMethod')}
            placeholder={t('form.placeholders.selectShippingMethod')}
            data={shippingMethods}
            value={inputs.shippingMethod || ''}
            onChange={(value) => updateInput('shippingMethod', value || '')}
            clearable
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.deliveryTerms')}
            placeholder={t('form.placeholders.selectDeliveryTerms')}
            data={deliveryTerms}
            value={inputs.deliveryTerms || ''}
            onChange={(value) => updateInput('deliveryTerms', value || '')}
            clearable
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Switch
            label={t('form.fields.insuranceRequired')}
            description={t('form.descriptions.insuranceRequired')}
            checked={inputs.insuranceRequired || false}
            onChange={(event) => updateInput('insuranceRequired', event.currentTarget.checked)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 12 }}>
          <Switch
            label={t('form.fields.customsClearance')}
            description={t('form.descriptions.customsClearance')}
            checked={inputs.customsClearance || false}
            onChange={(event) => updateInput('customsClearance', event.currentTarget.checked)}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};