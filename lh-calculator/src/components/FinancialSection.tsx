import React from 'react';
import { Grid, NumberInput, Select, Paper, Title, Group } from '@mantine/core';
import { IconCurrencyDollar } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';

export const FinancialSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  const paymentTermsOptions = [
    { value: 'предоплата_100', label: t('payment.prepayment100') },
    { value: 'предоплата_50_отгрузка_50', label: t('payment.prepayment50') },
    { value: 'предоплата_30_отгрузка_70', label: t('payment.prepayment30') },
    { value: 'отсрочка_30', label: t('payment.deferred30') },
    { value: 'отсрочка_60', label: t('payment.deferred60') },
    { value: 'отсрочка_90', label: t('payment.deferred90') }
  ];

  const currencyOptions = [
    { value: 'RUB', label: 'RUB - Российский рубль' },
    { value: 'USD', label: 'USD - Доллар США' },
    { value: 'EUR', label: 'EUR - Евро' },
    { value: 'CNY', label: 'CNY - Китайский юань' }
  ];

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconCurrencyDollar size={20} />
        <Title order={4}>{t('form.sections.financial')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 12 }}>
          <Select
            label={t('form.fields.paymentTerms')}
            placeholder={t('form.placeholders.selectPaymentTerms')}
            data={paymentTermsOptions}
            value={inputs.paymentTerms || ''}
            onChange={(value) => updateInput('paymentTerms', value || '')}
            clearable
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.discountPercent')}
            description={t('form.descriptions.discountPercent')}
            placeholder={t('form.placeholders.enterPercent')}
            value={inputs.discountPercent || 0}
            onChange={(value) => updateInput('discountPercent', Number(value) || 0)}
            suffix="%"
            min={0}
            max={50}
            decimalScale={2}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.taxRate')}
            description={t('form.descriptions.vatRate')}
            placeholder={t('form.placeholders.enterPercent')}
            value={inputs.taxRate || 0}
            onChange={(value) => updateInput('taxRate', Number(value) || 0)}
            suffix="%"
            min={0}
            max={30}
            decimalScale={2}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.currencyType')}
            placeholder={t('form.placeholders.selectCurrency')}
            data={currencyOptions}
            value={inputs.currencyType || ''}
            onChange={(value) => updateInput('currencyType', value || '')}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.exchangeRate')}
            description={t('form.descriptions.exchangeRateToRub')}
            placeholder={t('form.placeholders.enterRate')}
            value={inputs.exchangeRate || 0}
            onChange={(value) => updateInput('exchangeRate', Number(value) || 0)}
            min={0}
            decimalScale={4}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};