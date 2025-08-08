import React from 'react';
import { Grid, Paper, Title, Group, Select, NumberInput } from '@mantine/core';
import { IconCurrencyDollar, IconPercentage, IconCreditCard } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../../stores/inputStore';

export const FinancialTermsSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  const paymentTermsOptions = [
    { value: 'prepayment_100', label: t('financial.paymentTerms.prepayment_100') },
    { value: 'prepayment_50_delivery_50', label: t('financial.paymentTerms.prepayment_50_delivery_50') },
    { value: 'prepayment_30_delivery_70', label: t('financial.paymentTerms.prepayment_30_delivery_70') },
    { value: 'delivery_100', label: t('financial.paymentTerms.delivery_100') },
    { value: 'net_30', label: t('financial.paymentTerms.net_30') },
    { value: 'net_60', label: t('financial.paymentTerms.net_60') },
    { value: 'custom', label: t('financial.paymentTerms.custom') },
  ];

  const currencyOptions = [
    { value: 'RUB', label: 'RUB - Russian Ruble' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' },
    { value: 'KZT', label: 'KZT - Kazakhstani Tenge' },
  ];

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconCurrencyDollar size={20} />
        <Title order={3}>{t('projectDetails.sections.financialTerms')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.paymentTerms')}
            placeholder={t('form.placeholders.paymentTerms')}
            data={paymentTermsOptions}
            value={inputs.paymentTerms || ''}
            onChange={(value) => updateInput('paymentTerms', value || '', true)}
            leftSection={<IconCreditCard size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.currencyType')}
            placeholder={t('form.placeholders.currencyType')}
            data={currencyOptions}
            value={inputs.currencyType || 'RUB'}
            onChange={(value) => updateInput('currencyType', value || 'RUB', true)}
            leftSection={<IconCurrencyDollar size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.exchangeRate')}
            placeholder={t('form.placeholders.exchangeRate')}
            value={inputs.exchangeRate || 1}
            onChange={(value) => updateInput('exchangeRate', Number(value) || 1, true)}
            min={0.01}
            max={1000}
            decimalScale={4}
            leftSection={<IconPercentage size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.taxRate')}
            placeholder={t('form.placeholders.taxRate')}
            value={inputs.taxRate || 20}
            onChange={(value) => updateInput('taxRate', Number(value) || 20, true)}
            min={0}
            max={50}
            suffix="%"
            leftSection={<IconPercentage size={16} />}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};