import { useState } from 'react';
import { Title, Button, Group, TextInput, Table, ActionIcon, Paper } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconPlus, IconSearch, IconEdit, IconTrash, IconCalculator } from '@tabler/icons-react';

export function TechnicalPartsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  // Mock data - heat exchanger specifications
  const data = [
    {
      id: 1,
      number: 'HX-001',
      position: 'POS-001',
      deliveryType: 'Целый ТА',
      model: 'M6-FG',
      plateCount: 150,
      pressureA: 16,
      pressureB: 16,
      tempA: 95,
      tempB: 70,
    },
    {
      id: 2,
      number: 'HX-002',
      position: 'POS-002',
      deliveryType: 'ШОТ-БЛОК',
      model: 'NT100X',
      plateCount: 200,
      pressureA: 25,
      pressureB: 25,
      tempA: 150,
      tempB: 120,
    },
  ];

  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>{t('technicalPart.title')}</Title>
        <Button leftSection={<IconPlus size={16} />}>
          {t('common.create')}
        </Button>
      </Group>

      <Paper p="md" radius="md" withBorder>
        <Group mb="md">
          <TextInput
            placeholder={t('common.search')}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('technicalPart.number')}</Table.Th>
              <Table.Th>{t('technicalPart.position')}</Table.Th>
              <Table.Th>{t('technicalPart.deliveryType')}</Table.Th>
              <Table.Th>{t('technicalPart.model')}</Table.Th>
              <Table.Th>{t('technicalPart.plateCount')}</Table.Th>
              <Table.Th>{t('technicalPart.pressure')} A (bar)</Table.Th>
              <Table.Th>{t('technicalPart.pressure')} B (bar)</Table.Th>
              <Table.Th>{t('technicalPart.temperature')} A (°C)</Table.Th>
              <Table.Th>{t('technicalPart.temperature')} B (°C)</Table.Th>
              <Table.Th style={{ width: 120 }}></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td>{row.number}</Table.Td>
                <Table.Td>{row.position}</Table.Td>
                <Table.Td>{row.deliveryType}</Table.Td>
                <Table.Td>{row.model}</Table.Td>
                <Table.Td>{row.plateCount}</Table.Td>
                <Table.Td>{row.pressureA}</Table.Td>
                <Table.Td>{row.pressureB}</Table.Td>
                <Table.Td>{row.tempA}</Table.Td>
                <Table.Td>{row.tempB}</Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ActionIcon variant="subtle" color="blue">
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="green">
                      <IconCalculator size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red">
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </>
  );
}