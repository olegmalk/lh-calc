import { useState, useEffect } from 'react';
import { Card, Text, Badge, Button, Stack, Group, Code } from '@mantine/core';
import { IconRefresh, IconCheck, IconX } from '@tabler/icons-react';
import { HealthMonitor, type HealthCheck } from '../utils/monitoring';

interface HealthCheckComponentProps {
  showDetails?: boolean;
}

export function HealthCheckComponent({ showDetails = false }: HealthCheckComponentProps) {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(false);

  const performCheck = async () => {
    setLoading(true);
    try {
      const result = await HealthMonitor.getInstance().performHealthCheck();
      setHealth(result);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performCheck();
  }, []);

  if (!health) {
    return null;
  }

  const getStatusColor = (status: string) => {
    return status === 'healthy' ? 'green' : 'red';
  };

  const getStatusIcon = (status: string) => {
    return status === 'healthy' ? <IconCheck size={16} /> : <IconX size={16} />;
  };

  return (
    <Card withBorder>
      <Stack gap="sm">
        <Group justify="space-between">
          <Text fw={500}>System Health</Text>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconRefresh size={14} />}
            loading={loading}
            onClick={performCheck}
          >
            Refresh
          </Button>
        </Group>

        <Group>
          <Badge 
            color={getStatusColor(health.status)}
            leftSection={getStatusIcon(health.status)}
          >
            {health.status.toUpperCase()}
          </Badge>
          <Text size="sm" c="dimmed">
            Last check: {new Date(health.timestamp).toLocaleTimeString()}
          </Text>
        </Group>

        {showDetails && (
          <>
            <Stack gap="xs">
              <Text size="sm" fw={500}>System Checks:</Text>
              {Object.entries(health.checks).map(([key, value]) => (
                <Group key={key} gap="xs">
                  {value ? <IconCheck size={16} color="green" /> : <IconX size={16} color="red" />}
                  <Text size="sm" tt="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                </Group>
              ))}
            </Stack>

            <Stack gap="xs">
              <Text size="sm" fw={500}>System Info:</Text>
              <Code block>
                Version: {health.version}{'\n'}
                Environment: {health.environment}{'\n'}
                Timestamp: {health.timestamp}
              </Code>
            </Stack>
          </>
        )}
      </Stack>
    </Card>
  );
}

export default HealthCheckComponent;