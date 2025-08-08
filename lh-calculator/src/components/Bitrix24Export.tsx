import React, { useState } from 'react';
import {
  Button,
  Modal,
  Stack,
  TextInput,
  Select,
  Group,
  Text,
  Alert,
  Badge,
  Card,
  Timeline,
  ActionIcon,
  Tooltip,
  Loader
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconBrandMatrix,
  IconSettings,
  IconCheck,
  IconX,
  IconTrash,
  IconExternalLink,
  IconRefresh,
  IconAlertCircle
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useBitrix24Store, getBitrix24ExportStats, type ExportHistory } from '../stores/bitrix24Store';
interface Bitrix24ExportProps {
  result: {
    totalCost: number;
    pressureTestHot?: number;
    pressureTestCold?: number;
    materialRequirements?: Map<string, number>;
    componentCosts?: {
      covers: number;
      columns: number;
      panelsA: number;
      panelsB: number;
      fasteners: number;
      flanges: number;
      gaskets: number;
      materials: number;
      total: number;
    };
  };
  projectName?: string;
  onExportStart?: () => void;
  onExportComplete?: (dealId: number) => void;
  onExportError?: (error: string) => void;
}

export const Bitrix24Export: React.FC<Bitrix24ExportProps> = ({
  result,
  projectName = 'Heat Exchanger Project',
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const { t } = useTranslation();
  const [configModalOpened, { open: openConfig, close: closeConfig }] = useDisclosure(false);
  const [historyModalOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false);
  const [testingConnection, setTestingConnection] = useState(false);
  
  const {
    config,
    isConfigured,
    isConnected,
    isExporting,
    exportHistory,
    connectionError,
    lastConnectionTest,
    updateConfig,
    testConnection,
    exportToBitrix24,
    clearHistory,
    removeHistoryItem
  } = useBitrix24Store();

  const handleExport = async () => {
    if (!isConfigured) {
      openConfig();
      return;
    }

    try {
      onExportStart?.();
      const deal = await exportToBitrix24(result, projectName);
      
      notifications.show({
        title: t('bitrix24.export.success'),
        message: t('bitrix24.export.dealCreated', { id: deal.id, title: deal.title }),
        color: 'green',
        icon: <IconCheck size={16} />
      });
      
      onExportComplete?.(deal.id!);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('bitrix24.export.unknownError');
      
      notifications.show({
        title: t('bitrix24.export.error'),
        message: errorMessage,
        color: 'red',
        icon: <IconX size={16} />
      });
      
      onExportError?.(errorMessage);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const connected = await testConnection();
      
      notifications.show({
        title: connected ? t('bitrix24.connection.success') : t('bitrix24.connection.failed'),
        message: connected ? t('bitrix24.connection.successMessage') : t('bitrix24.connection.failedMessage'),
        color: connected ? 'green' : 'red',
        icon: connected ? <IconCheck size={16} /> : <IconX size={16} />
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleConfigSave = () => {
    closeConfig();
    if (isConfigured) {
      handleTestConnection();
    }
  };

  const stats = getBitrix24ExportStats();

  return (
    <>
      {/* Main Export Button */}
      <Button
        leftSection={<IconBrandMatrix size={16} />}
        variant={isConfigured ? (isConnected ? 'filled' : 'light') : 'outline'}
        color={isConnected ? 'green' : 'blue'}
        loading={isExporting}
        onClick={handleExport}
        size="sm"
      >
        {t('bitrix24.exportToBitrix24')}
      </Button>

      {/* Configuration Button */}
      <Tooltip label={t('bitrix24.configure')}>
        <ActionIcon
          variant="subtle"
          onClick={openConfig}
          color={isConfigured ? 'green' : 'gray'}
        >
          <IconSettings size={16} />
        </ActionIcon>
      </Tooltip>

      {/* History Button */}
      {exportHistory.length > 0 && (
        <Tooltip label={t('bitrix24.viewHistory')}>
          <ActionIcon variant="subtle" onClick={openHistory}>
            <Badge size="sm" variant="light" color="blue">
              {stats.total}
            </Badge>
          </ActionIcon>
        </Tooltip>
      )}

      {/* Configuration Modal */}
      <Modal
        opened={configModalOpened}
        onClose={closeConfig}
        title={
          <Group>
            <IconBrandMatrix size={20} />
            <Text fw={500}>{t('bitrix24.configuration.title')}</Text>
          </Group>
        }
        size="lg"
      >
        <Stack gap="md">
          {/* Connection Status */}
          {isConfigured && (
            <Alert
              icon={isConnected ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
              color={isConnected ? 'green' : 'red'}
              title={isConnected ? t('bitrix24.connection.connected') : t('bitrix24.connection.disconnected')}
            >
              {connectionError || t('bitrix24.connection.lastTest', {
                time: lastConnectionTest?.toLocaleTimeString() || t('common.never')
              })}
            </Alert>
          )}

          {/* Method Selection */}
          <Select
            label={t('bitrix24.configuration.method')}
            description={t('bitrix24.configuration.methodDescription')}
            value={config.method}
            onChange={(value) => updateConfig({ method: value as 'webhook' | 'oauth2' })}
            data={[
              { value: 'webhook', label: t('bitrix24.configuration.webhook') },
              { value: 'oauth2', label: t('bitrix24.configuration.oauth2') }
            ]}
          />

          {/* Webhook Configuration */}
          {config.method === 'webhook' && (
            <Stack gap="sm">
              <TextInput
                label={t('bitrix24.configuration.webhookUrl')}
                description={t('bitrix24.configuration.webhookUrlDescription')}
                placeholder="https://yourcompany.bitrix24.ru/rest/1/xxxxx/"
                value={config.webhookUrl || ''}
                onChange={(e) => updateConfig({ webhookUrl: e.target.value })}
                required
              />
            </Stack>
          )}

          {/* OAuth2 Configuration */}
          {config.method === 'oauth2' && (
            <Stack gap="sm">
              <TextInput
                label={t('bitrix24.configuration.portalUrl')}
                description={t('bitrix24.configuration.portalUrlDescription')}
                placeholder="https://yourcompany.bitrix24.ru"
                value={config.portalUrl || ''}
                onChange={(e) => updateConfig({ portalUrl: e.target.value })}
                required
              />
              
              <Group grow>
                <TextInput
                  label={t('bitrix24.configuration.clientId')}
                  value={config.clientId || ''}
                  onChange={(e) => updateConfig({ clientId: e.target.value })}
                  required
                />
                <TextInput
                  label={t('bitrix24.configuration.clientSecret')}
                  type="password"
                  value={config.clientSecret || ''}
                  onChange={(e) => updateConfig({ clientSecret: e.target.value })}
                  required
                />
              </Group>
              
              <TextInput
                label={t('bitrix24.configuration.accessToken')}
                description={t('bitrix24.configuration.accessTokenDescription')}
                type="password"
                value={config.accessToken || ''}
                onChange={(e) => updateConfig({ accessToken: e.target.value })}
                required
              />
            </Stack>
          )}

          {/* Action Buttons */}
          <Group justify="space-between" mt="md">
            <Group>
              <Button
                variant="light"
                leftSection={testingConnection ? <Loader size={16} /> : <IconRefresh size={16} />}
                onClick={handleTestConnection}
                disabled={!isConfigured || testingConnection}
                loading={testingConnection}
              >
                {t('bitrix24.configuration.testConnection')}
              </Button>
            </Group>
            
            <Group>
              <Button variant="subtle" onClick={closeConfig}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleConfigSave} disabled={!isConfigured}>
                {t('common.save')}
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>

      {/* History Modal */}
      <Modal
        opened={historyModalOpened}
        onClose={closeHistory}
        title={
          <Group justify="space-between" style={{ width: '100%' }}>
            <Text fw={500}>{t('bitrix24.history.title')}</Text>
            <Group gap="xs">
              <Badge variant="light">{t('bitrix24.history.total', { count: stats.total })}</Badge>
              <Badge variant="light" color="green">{t('bitrix24.history.successful', { count: stats.successful })}</Badge>
              {stats.failed > 0 && (
                <Badge variant="light" color="red">{t('bitrix24.history.failed', { count: stats.failed })}</Badge>
              )}
            </Group>
          </Group>
        }
        size="xl"
      >
        <Stack gap="md">
          {/* Statistics */}
          <Card withBorder p="sm">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">{t('bitrix24.history.statistics')}</Text>
              <Group gap="xs">
                <Text size="sm">{t('bitrix24.history.last24h', { count: stats.last24h })}</Text>
                <Button
                  size="xs"
                  variant="subtle"
                  color="red"
                  onClick={clearHistory}
                  leftSection={<IconTrash size={12} />}
                >
                  {t('bitrix24.history.clearAll')}
                </Button>
              </Group>
            </Group>
          </Card>

          {/* Export History Timeline */}
          {exportHistory.length > 0 ? (
            <Timeline bulletSize={24} lineWidth={2}>
              {exportHistory.slice(0, 20).map((item: ExportHistory) => (
                <Timeline.Item
                  key={item.id}
                  bullet={
                    item.status === 'success' ? (
                      <IconCheck size={12} />
                    ) : item.status === 'error' ? (
                      <IconX size={12} />
                    ) : (
                      <Loader size={12} />
                    )
                  }
                  color={item.status === 'success' ? 'green' : item.status === 'error' ? 'red' : 'blue'}
                >
                  <Card withBorder p="sm">
                    <Group justify="space-between" mb="xs">
                      <Group>
                        <Text fw={500}>{item.dealTitle}</Text>
                        {item.dealId && (
                          <Tooltip label={t('bitrix24.history.openInBitrix24')}>
                            <ActionIcon size="sm" variant="subtle">
                              <IconExternalLink size={12} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Group>
                      
                      <Group gap="xs">
                        <Badge
                          size="sm"
                          color={item.status === 'success' ? 'green' : item.status === 'error' ? 'red' : 'blue'}
                        >
                          {t(`bitrix24.history.status.${item.status}`)}
                        </Badge>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="red"
                          onClick={() => removeHistoryItem(item.id)}
                        >
                          <IconX size={12} />
                        </ActionIcon>
                      </Group>
                    </Group>
                    
                    <Text size="xs" c="dimmed" mb="xs">
                      {item.timestamp.toLocaleString()} • {item.projectName}
                    </Text>
                    
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        {item.totalCost.toLocaleString('ru-RU')} ₽
                      </Text>
                      {item.dealId && (
                        <Text size="xs" c="dimmed">
                          Deal #{item.dealId}
                        </Text>
                      )}
                    </Group>
                    
                    {item.error && (
                      <Alert
                        icon={<IconAlertCircle size={14} />}
                        color="red"
                        mt="xs"
                      >
                        <Text size="xs">{item.error}</Text>
                      </Alert>
                    )}
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Text ta="center" c="dimmed" py="xl">
              {t('bitrix24.history.empty')}
            </Text>
          )}
        </Stack>
      </Modal>
    </>
  );
};

export default Bitrix24Export;