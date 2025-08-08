import React from 'react';
import { Grid, Paper, Title, Group, Switch, TextInput, NumberInput } from '@mantine/core';
import { IconFileText, IconCertificate, IconBook } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../../stores/inputStore';

export const DocumentationSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconFileText size={20} />
        <Title order={3}>{t('projectDetails.sections.documentation')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Switch
            label={t('form.fields.drawingsIncluded')}
            checked={inputs.drawingsIncluded || false}
            onChange={(event) => updateInput('drawingsIncluded', event.currentTarget.checked, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Switch
            label={t('form.fields.manualsIncluded')}
            checked={inputs.manualsIncluded || false}
            onChange={(event) => updateInput('manualsIncluded', event.currentTarget.checked, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Switch
            label={t('form.fields.certificatesIncluded')}
            checked={inputs.certificatesIncluded || false}
            onChange={(event) => updateInput('certificatesIncluded', event.currentTarget.checked, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label={t('form.fields.warrantyPeriod')}
            placeholder={t('form.placeholders.warrantyPeriod')}
            value={inputs.warrantyPeriod || 12}
            onChange={(value) => updateInput('warrantyPeriod', Number(value) || 12, true)}
            min={0}
            max={60}
            suffix=" months"
            leftSection={<IconCertificate size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Switch
            label={t('form.fields.serviceContract')}
            checked={inputs.serviceContract || false}
            onChange={(event) => updateInput('serviceContract', event.currentTarget.checked, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Switch
            label={t('form.fields.certificationRequired')}
            checked={inputs.certificationRequired || false}
            onChange={(event) => updateInput('certificationRequired', event.currentTarget.checked, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            label={t('form.fields.inspectionLevel')}
            placeholder={t('form.placeholders.inspectionLevel')}
            value={inputs.inspectionLevel || ''}
            onChange={(event) => updateInput('inspectionLevel', event.currentTarget.value, true)}
            leftSection={<IconBook size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 4 }}>
          <TextInput
            label={t('form.fields.qualityControl')}
            placeholder={t('form.placeholders.qualityControl')}
            value={inputs.qualityControl || ''}
            onChange={(event) => updateInput('qualityControl', event.currentTarget.value, true)}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};