import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Stack, 
  TextInput, 
  Select, 
  Group, 
  Button, 
  Card, 
  Text,
  Badge,
  Grid,
  ActionIcon,
  Modal,
  Center,
  Loader
} from '@mantine/core';
import { 
  IconSearch, 
  IconTrash, 
  IconFileExport, 
  IconSend,
  IconCalculator,
  IconCalendar,
  IconFolder,
  IconRefresh
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { storageService, type SavedCalculation } from '../services/StorageService';
import { useInputStore } from '../stores/inputStore';
import { useCalculationStore } from '../stores/calculationStore';

export function SavedCalculationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [filteredCalculations, setFilteredCalculations] = useState<SavedCalculation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [calculationToDelete, setCalculationToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const updateInput = useInputStore(state => state.updateMultiple);
  const calculate = useCalculationStore(state => state.calculate);

  useEffect(() => {
    loadCalculations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterCalculations();
  }, [searchQuery, selectedProject, calculations]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCalculations = () => {
    setLoading(true);
    try {
      const allCalculations = storageService.listCalculations();
      setCalculations(allCalculations);
      setFilteredCalculations(allCalculations);
    } catch (error) {
      console.error('Error loading calculations:', error);
      notifications.show({
        title: t('storage.loadError'),
        message: t('storage.corruptedData'),
        color: 'red'
      });
      // Reset to empty state
      setCalculations([]);
      setFilteredCalculations([]);
    }
    setLoading(false);
  };
  
  const handleClearStorage = () => {
    const confirmed = window.confirm(t('storage.clearAllConfirm'));
    if (!confirmed) return;
    
    storageService.clearAll();
    loadCalculations();
    
    notifications.show({
      title: t('storage.cleared'),
      message: t('storage.allDataCleared'),
      color: 'green'
    });
  };

  const filterCalculations = () => {
    let filtered = calculations;

    if (selectedProject) {
      filtered = filtered.filter(calc => calc.projectId === selectedProject);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(calc => 
        calc.name.toLowerCase().includes(query) ||
        calc.inputs.equipmentType?.toLowerCase().includes(query)
      );
    }

    setFilteredCalculations(filtered);
  };

  const handleLoad = async (calculation: SavedCalculation) => {
    // Confirm before loading
    const confirmed = window.confirm(t('storage.loadConfirm'));
    if (!confirmed) return;

    // Update inputs in store
    updateInput(calculation.inputs);
    
    // Navigate to dashboard and trigger calculation
    navigate('/dashboard');
    
    // Trigger calculation after navigation
    setTimeout(() => {
      calculate(calculation.inputs);
    }, 100);

    notifications.show({
      title: t('storage.loadCalculation'),
      message: t('storage.calculationLoaded', { name: calculation.name }),
      color: 'green'
    });
  };

  const handleDelete = (id: string) => {
    setCalculationToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!calculationToDelete) return;

    const success = storageService.deleteCalculation(calculationToDelete);
    
    if (success) {
      notifications.show({
        title: t('common.delete'),
        message: t('storage.calculationDeleted'),
        color: 'green'
      });
      loadCalculations();
    } else {
      notifications.show({
        title: t('storage.deleteError'),
        message: t('storage.unknownError'),
        color: 'red'
      });
    }

    setDeleteModalOpen(false);
    setCalculationToDelete(null);
  };

  const projects = storageService.listProjects();
  const projectOptions = [
    { value: '', label: t('storage.allProjects') },
    ...projects.map(project => ({
      value: project.id,
      label: `${project.name} (${project.calculationCount || 0})`
    }))
  ];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return dateString;
    }
  };

  const formatCost = (cost: number) => {
    const rounded = Math.round(cost);
    const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formatted} ₽`;
  };

  if (loading) {
    return (
      <Container size="xl">
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Title order={2}>{t('storage.savedCalculations')}</Title>

        {/* Search and Filter */}
        <Group>
          <TextInput
            leftSection={<IconSearch size={16} />}
            placeholder={t('storage.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder={t('storage.selectProject')}
            data={projectOptions}
            value={selectedProject}
            onChange={(value) => setSelectedProject(value || '')}
            clearable
            w={250}
          />
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={handleClearStorage}
            title={t('storage.clearAll')}
          >
            <IconRefresh size={20} />
          </ActionIcon>
        </Group>

        {/* Storage Info - temporarily disabled due to locale error */}
        {/* <Card padding="xs" withBorder>
          <StorageInfoBar />
        </Card> */}

        {/* Calculations List */}
        {filteredCalculations.length === 0 ? (
          <Card padding="xl" withBorder>
            <Center>
              <Text c="dimmed">{t('storage.noCalculations')}</Text>
            </Center>
          </Card>
        ) : (
          <Grid>
            {filteredCalculations.map(calculation => (
              <Grid.Col key={calculation.id} span={{ base: 12, md: 6, lg: 4 }}>
                <Card padding="lg" withBorder h="100%">
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text fw={600} size="lg" lineClamp={1}>
                        {calculation.name}
                      </Text>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => handleDelete(calculation.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>

                    <Group gap="xs">
                      <Badge leftSection={<IconCalculator size={12} />} variant="light">
                        {calculation.inputs.equipmentType}
                      </Badge>
                      <Badge leftSection={<IconFolder size={12} />} variant="light" color="orange">
                        {projects.find(p => p.id === calculation.projectId)?.name || t('storage.mainProject')}
                      </Badge>
                    </Group>

                    <Stack gap={4}>
                      <Group gap="xs">
                        <Text size="sm" c="dimmed">{t('form.fields.plateCount')}:</Text>
                        <Text size="sm" fw={500}>{calculation.inputs.plateCount}</Text>
                      </Group>
                      <Group gap="xs">
                        <Text size="sm" c="dimmed">{t('results.totalCost')}:</Text>
                        <Text size="sm" fw={600} c="green">
                          {formatCost(calculation.results.totalCost)}
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <IconCalendar size={14} />
                        <Text size="xs" c="dimmed">
                          {formatDate(calculation.savedAt)}
                        </Text>
                      </Group>
                    </Stack>

                    <Group mt="sm">
                      <Button
                        variant="filled"
                        size="sm"
                        onClick={() => handleLoad(calculation)}
                        fullWidth
                      >
                        {t('storage.loadCalculation')}
                      </Button>
                    </Group>

                    <Group gap="xs">
                      <Button
                        leftSection={<IconFileExport size={14} />}
                        variant="subtle"
                        size="xs"
                        disabled
                        style={{ flex: 1 }}
                      >
                        Excel
                      </Button>
                      <Button
                        leftSection={<IconSend size={14} />}
                        variant="subtle"
                        size="xs"
                        color="orange"
                        disabled
                        style={{ flex: 1 }}
                      >
                        CRM
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title={t('common.delete')}
          size="sm"
        >
          <Stack>
            <Text>{t('storage.deleteConfirm')}</Text>
            <Group justify="flex-end">
              <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button color="red" onClick={confirmDelete}>
                {t('common.delete')}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}

// StorageInfoBar temporarily removed due to locale issues
// Will be re-enabled once locale configuration is fixed