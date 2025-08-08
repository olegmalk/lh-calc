import { useState } from 'react';
import { Modal, TextInput, Select, Button, Group, Stack, Text } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { storageService } from '../services/StorageService';
import { notifications } from '@mantine/notifications';
import type { HeatExchangerInput, CalculationResult } from '../lib/calculation-engine/types';

interface SaveCalculationModalProps {
  opened: boolean;
  onClose: () => void;
  inputs: HeatExchangerInput;
  results: CalculationResult;
  onSaved?: (id: string) => void;
}

export function SaveCalculationModal({
  opened,
  onClose,
  inputs,
  results,
  onSaved
}: SaveCalculationModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const projects = storageService.listProjects();
  const defaultName = `${t('storage.defaultCalculationName')} - ${new Date().toLocaleDateString()}`;

  const handleSave = () => {
    try {
      let selectedProjectId = projectId || 'default';
      
      // Create new project if needed
      if (isCreatingProject && newProjectName) {
        selectedProjectId = storageService.createProject(newProjectName);
      }

      const id = storageService.saveCalculation(
        name || defaultName,
        inputs,
        results,
        selectedProjectId
      );

      notifications.show({
        title: t('storage.saveSuccess'),
        message: t('storage.calculationSaved', { name: name || defaultName }),
        color: 'green'
      });

      onSaved?.(id);
      handleClose();
    } catch (error) {
      notifications.show({
        title: t('storage.saveError'),
        message: error instanceof Error ? error.message : t('storage.unknownError'),
        color: 'red'
      });
    }
  };

  const handleClose = () => {
    setName('');
    setProjectId('');
    setIsCreatingProject(false);
    setNewProjectName('');
    onClose();
  };

  const projectOptions = projects.map(project => ({
    value: project.id,
    label: `${project.name} (${project.calculationCount || 0} ${t('storage.calculations')})`
  }));

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('storage.saveCalculation')}
      size="md"
    >
      <Stack>
        <TextInput
          label={t('storage.calculationName')}
          placeholder={defaultName}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          maxLength={100}
        />

        {!isCreatingProject ? (
          <>
            <Select
              label={t('storage.project')}
              placeholder={t('storage.selectProject')}
              data={projectOptions}
              value={projectId}
              onChange={(value) => setProjectId(value || '')}
              searchable
            />
            
            <Button
              variant="subtle"
              size="xs"
              onClick={() => setIsCreatingProject(true)}
            >
              {t('storage.createNewProject')}
            </Button>
          </>
        ) : (
          <>
            <TextInput
              label={t('storage.newProjectName')}
              placeholder={t('storage.projectNamePlaceholder')}
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.currentTarget.value)}
              maxLength={50}
            />
            
            <Button
              variant="subtle"
              size="xs"
              onClick={() => {
                setIsCreatingProject(false);
                setNewProjectName('');
              }}
            >
              {t('storage.cancelNewProject')}
            </Button>
          </>
        )}

        <StorageInfo />

        <Group justify="flex-end">
          <Button variant="light" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleSave}
            disabled={isCreatingProject && !newProjectName}
          >
            {t('common.save')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

function StorageInfo() {
  const { t } = useTranslation();
  const info = storageService.getStorageInfo();
  
  return (
    <Text size="xs" c="dimmed">
      {t('storage.storageInfo', {
        count: info.calculationCount,
        size: info.sizeInMB.toFixed(2),
        percent: info.percentUsed.toFixed(1)
      })}
    </Text>
  );
}