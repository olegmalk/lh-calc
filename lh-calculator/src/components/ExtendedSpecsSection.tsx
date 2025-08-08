import React from 'react';
import { Grid, NumberInput, Select, Paper, Title, Group } from '@mantine/core';
import { IconSettings, IconLock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';

export const ExtendedSpecsSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  const materialOptions = [
    { value: 'Ст3', label: t('materials.steel3') },
    { value: 'Ст20', label: t('materials.steel20') },
    { value: '09Г2С', label: t('materials.steel09G2S') },
    { value: 'AISI 316L', label: 'AISI 316L' },
    { value: '12Х18Н10Т', label: '12Х18Н10Т' }
  ];

  const insulationOptions = [
    { value: 'минеральная_вата', label: t('insulation.mineralWool') },
    { value: 'пенополиуретан', label: t('insulation.polyurethane') },
    { value: 'пенополистирол', label: t('insulation.polystyrene') },
    { value: 'без_изоляции', label: t('insulation.none') }
  ];

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconSettings size={20} />
        <Title order={4}>{t('form.sections.extendedSpecs')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.plateArea')}
            description={t('form.descriptions.calculatedField')}
            value={inputs.plateArea || 0}
            readOnly
            suffix=" м²"
            decimalScale={4}
            leftSection={<IconLock size={16} />}
            styles={(theme) => ({
              input: {
                backgroundColor: theme.colors.gray[0],
                color: theme.colors.gray[6]
              }
            })}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.channelHeight')}
            placeholder={t('form.placeholders.enterValue')}
            value={inputs.channelHeight || 0}
            onChange={(value) => updateInput('channelHeight', Number(value) || 0)}
            suffix=" мм"
            min={0}
            max={500}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.channelWidth')}
            placeholder={t('form.placeholders.enterValue')}
            value={inputs.channelWidth || 0}
            onChange={(value) => updateInput('channelWidth', Number(value) || 0)}
            suffix=" мм"
            min={0}
            max={1000}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.frameThickness')}
            placeholder={t('form.placeholders.enterValue')}
            value={inputs.frameThickness || 0}
            onChange={(value) => updateInput('frameThickness', Number(value) || 0)}
            suffix=" мм"
            min={0}
            max={100}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.frameMaterial')}
            placeholder={t('form.placeholders.selectMaterial')}
            data={materialOptions}
            value={inputs.frameMaterial || ''}
            onChange={(value) => updateInput('frameMaterial', value || '')}
            searchable
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.insulationThickness')}
            placeholder={t('form.placeholders.enterValue')}
            value={inputs.insulationThickness || 0}
            onChange={(value) => updateInput('insulationThickness', Number(value) || 0)}
            suffix=" мм"
            min={0}
            max={200}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 12 }}>
          <Select
            label={t('form.fields.insulationType')}
            placeholder={t('form.placeholders.selectInsulation')}
            data={insulationOptions}
            value={inputs.insulationType || ''}
            onChange={(value) => updateInput('insulationType', value || '')}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};