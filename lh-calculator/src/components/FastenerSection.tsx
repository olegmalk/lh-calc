import React from 'react';
import { Grid, NumberInput, Select, Paper, Title, Group, Divider, Stack } from '@mantine/core';
import { IconTool, IconNut, IconCircleDot } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';

export const FastenerSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  const boltTypes = [
    { value: 'М6', label: 'М6' },
    { value: 'М8', label: 'М8' },
    { value: 'М10', label: 'М10' },
    { value: 'М12', label: 'М12' },
    { value: 'М16', label: 'М16' },
    { value: 'М20', label: 'М20' },
    { value: 'М24', label: 'М24' },
    { value: 'М30', label: 'М30' }
  ];

  const materials = [
    { value: 'Ст3', label: t('materials.steel3') },
    { value: 'Ст20', label: t('materials.steel20') },
    { value: '09Г2С', label: t('materials.steel09G2S') },
    { value: 'AISI 316L', label: 'AISI 316L' },
    { value: '12Х18Н10Т', label: '12Х18Н10Т' }
  ];

  const washerTypes = [
    { value: 'A6', label: 'A6 (под М6)' },
    { value: 'A8', label: 'A8 (под М8)' },
    { value: 'A10', label: 'A10 (под М10)' },
    { value: 'A12', label: 'A12 (под М12)' },
    { value: 'A16', label: 'A16 (под М16)' },
    { value: 'A20', label: 'A20 (под М20)' },
    { value: 'A24', label: 'A24 (под М24)' },
    { value: 'A30', label: 'A30 (под М30)' }
  ];

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconTool size={20} />
        <Title order={4}>{t('form.sections.fasteners')}</Title>
      </Group>
      
      <Stack gap="lg">
        <div>
          <Title order={5} mb="md" c="blue">
            <Group gap="xs">
              <IconTool size={16} />
              {t('form.subsections.bolts')}
            </Group>
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label={t('form.fields.boltType')}
                placeholder={t('form.placeholders.selectBoltType')}
                data={boltTypes}
                value={inputs.boltType || ''}
                onChange={(value) => updateInput('boltType', value || '')}
                searchable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label={t('form.fields.boltMaterial')}
                placeholder={t('form.placeholders.selectMaterial')}
                data={materials}
                value={inputs.boltMaterial || ''}
                onChange={(value) => updateInput('boltMaterial', value || '')}
                searchable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 12 }}>
              <NumberInput
                label={t('form.fields.boltQuantity')}
                placeholder={t('form.placeholders.enterQuantity')}
                value={inputs.boltQuantity || 0}
                onChange={(value) => updateInput('boltQuantity', Number(value) || 0)}
                suffix=" шт"
                min={0}
                max={1000}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Divider />

        <div>
          <Title order={5} mb="md" c="orange">
            <Group gap="xs">
              <IconNut size={16} />
              {t('form.subsections.nuts')}
            </Group>
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label={t('form.fields.nutType')}
                placeholder={t('form.placeholders.selectNutType')}
                data={boltTypes}
                value={inputs.nutType || ''}
                onChange={(value) => updateInput('nutType', value || '')}
                searchable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label={t('form.fields.nutMaterial')}
                placeholder={t('form.placeholders.selectMaterial')}
                data={materials}
                value={inputs.nutMaterial || ''}
                onChange={(value) => updateInput('nutMaterial', value || '')}
                searchable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 12 }}>
              <NumberInput
                label={t('form.fields.nutQuantity')}
                placeholder={t('form.placeholders.enterQuantity')}
                value={inputs.nutQuantity || 0}
                onChange={(value) => updateInput('nutQuantity', Number(value) || 0)}
                suffix=" шт"
                min={0}
                max={1000}
              />
            </Grid.Col>
          </Grid>
        </div>

        <Divider />

        <div>
          <Title order={5} mb="md" c="green">
            <Group gap="xs">
              <IconCircleDot size={16} />
              {t('form.subsections.washers')}
            </Group>
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label={t('form.fields.washerType')}
                placeholder={t('form.placeholders.selectWasherType')}
                data={washerTypes}
                value={inputs.washerType || ''}
                onChange={(value) => updateInput('washerType', value || '')}
                searchable
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label={t('form.fields.washerQuantity')}
                placeholder={t('form.placeholders.enterQuantity')}
                value={inputs.washerQuantity || 0}
                onChange={(value) => updateInput('washerQuantity', Number(value) || 0)}
                suffix=" шт"
                min={0}
                max={2000}
              />
            </Grid.Col>
          </Grid>
        </div>
      </Stack>
    </Paper>
  );
};