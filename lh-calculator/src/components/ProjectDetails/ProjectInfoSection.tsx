import React from 'react';
import { Grid, TextInput, Paper, Title, Group } from '@mantine/core';
import { IconCalendar, IconUser, IconId, IconNumbers } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../../stores/inputStore';

export const ProjectInfoSection: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();

  return (
    <Paper shadow="sm" p="lg" radius="md">
      <Group gap="xs" mb="md">
        <IconId size={20} />
        <Title order={3}>{t('projectDetails.sections.projectInfo')}</Title>
      </Group>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label={t('form.fields.projectName')}
            placeholder={t('form.placeholders.projectName')}
            value={inputs.projectName || ''}
            onChange={(event) => updateInput('projectName', event.currentTarget.value, true)}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label={t('form.fields.orderNumber')}
            placeholder={t('form.placeholders.orderNumber')}
            value={inputs.orderNumber || ''}
            onChange={(event) => updateInput('orderNumber', event.currentTarget.value, true)}
            leftSection={<IconNumbers size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label={t('form.fields.clientName')}
            placeholder={t('form.placeholders.clientName')}
            value={inputs.clientName || ''}
            onChange={(event) => updateInput('clientName', event.currentTarget.value, true)}
            leftSection={<IconUser size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            type="date"
            label={t('form.fields.deliveryDate')}
            value={inputs.deliveryDate || ''}
            onChange={(event) => updateInput('deliveryDate', event.currentTarget.value, true)}
            leftSection={<IconCalendar size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label={t('form.fields.projectManager')}
            placeholder={t('form.placeholders.projectManager')}
            value={inputs.projectManager || ''}
            onChange={(event) => updateInput('projectManager', event.currentTarget.value, true)}
            leftSection={<IconUser size={16} />}
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label={t('form.fields.salesManager')}
            placeholder={t('form.placeholders.salesManager')}
            value={inputs.salesManager || ''}
            onChange={(event) => updateInput('salesManager', event.currentTarget.value, true)}
            leftSection={<IconUser size={16} />}
          />
        </Grid.Col>
      </Grid>
    </Paper>
  );
};