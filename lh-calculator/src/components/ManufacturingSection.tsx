import React from 'react';
import { Grid, NumberInput, Select, TextInput, Switch, Paper, Title, Group } from '@mantine/core';
import { IconTool } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';

export const ManufacturingSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  const weldingMethods = [
    { value: 'tig', label: t('welding.tig') },
    { value: 'mig', label: t('welding.mig') },
    { value: 'arc', label: t('welding.arc') },
    { value: 'plasma', label: t('welding.plasma') }
  ];

  const surfaceTreatments = [
    { value: 'пескоструй', label: t('surface.sandblasting') },
    { value: 'грунтовка', label: t('surface.primer') },
    { value: 'фосфатирование', label: t('surface.phosphating') },
    { value: 'оксидирование', label: t('surface.oxidation') }
  ];

  const paintTypes = [
    { value: 'эмаль', label: t('paint.enamel') },
    { value: 'порошковая', label: t('paint.powder') },
    { value: 'эпоксидная', label: t('paint.epoxy') },
    { value: 'полиуретановая', label: t('paint.polyurethane') }
  ];

  const inspectionLevels = [
    { value: 'уровень_1', label: t('inspection.level1') },
    { value: 'уровень_2', label: t('inspection.level2') },
    { value: 'уровень_3', label: t('inspection.level3') }
  ];

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconTool size={20} />
        <Title order={4}>{t('form.sections.manufacturing')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.weldingMethod')}
            placeholder={t('form.placeholders.selectWeldingMethod')}
            data={weldingMethods}
            value={inputs.weldingMethod || ''}
            onChange={(value) => updateInput('weldingMethod', value || '')}
            clearable
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label={t('form.fields.weldingMaterial')}
            placeholder={t('form.placeholders.enterWeldingMaterial')}
            value={inputs.weldingMaterial || ''}
            onChange={(event) => updateInput('weldingMaterial', event.currentTarget.value)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.surfaceTreatment')}
            placeholder={t('form.placeholders.selectSurfaceTreatment')}
            data={surfaceTreatments}
            value={inputs.surfaceTreatment || ''}
            onChange={(value) => updateInput('surfaceTreatment', value || '')}
            clearable
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.paintType')}
            placeholder={t('form.placeholders.selectPaintType')}
            data={paintTypes}
            value={inputs.paintType || ''}
            onChange={(value) => updateInput('paintType', value || '')}
            clearable
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.paintThickness')}
            placeholder={t('form.placeholders.enterThickness')}
            value={inputs.paintThickness || 0}
            onChange={(value) => updateInput('paintThickness', Number(value) || 0)}
            suffix=" мкм"
            min={0}
            max={500}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label={t('form.fields.qualityControl')}
            placeholder={t('form.placeholders.enterQualityControl')}
            value={inputs.qualityControl || ''}
            onChange={(event) => updateInput('qualityControl', event.currentTarget.value)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Switch
            label={t('form.fields.certificationRequired')}
            description={t('form.descriptions.certificationRequired')}
            checked={inputs.certificationRequired || false}
            onChange={(event) => updateInput('certificationRequired', event.currentTarget.checked)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label={t('form.fields.inspectionLevel')}
            placeholder={t('form.placeholders.selectInspectionLevel')}
            data={inspectionLevels}
            value={inputs.inspectionLevel || ''}
            onChange={(value) => updateInput('inspectionLevel', value || '')}
            clearable
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};