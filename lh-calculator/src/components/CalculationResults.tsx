import React, { useState } from 'react';
import {
  Card,
  Grid,
  Stack,
  Title,
  Text,
  Badge,
  Group,
  Divider,
  Progress,
  Paper,
  Button,
  Alert,
  Skeleton,
} from '@mantine/core';
import { IconAlertCircle, IconDownload, IconFileSpreadsheet } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useCalculationStore } from '../stores/calculationStore';
import { Bitrix24Export } from './Bitrix24Export';
import { useInputStore } from '../stores/inputStore';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number, decimals = 2): string => {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const CalculationResults: React.FC = () => {
  const { t } = useTranslation();
  const { result, isCalculating, error, lastCalculatedAt, exportToExcel, exportToPDF } = useCalculationStore();
  const { inputs } = useInputStore();
  const [bitrixDealId, setBitrixDealId] = useState<number | null>(null);
  
  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title={t('results.calculationError')} color="red">
        {error}
      </Alert>
    );
  }
  
  if (isCalculating) {
    return (
      <Card shadow="sm" padding="lg" radius="md">
        <Stack gap="md" data-testid="skeleton-loader">
          <Skeleton height={30} />
          <Skeleton height={200} />
          <Skeleton height={100} />
        </Stack>
      </Card>
    );
  }
  
  if (!result) {
    return (
      <Card shadow="sm" padding="lg" radius="md">
        <Text c="dimmed" ta="center" py="xl">
          {t('results.noResults')}
        </Text>
      </Card>
    );
  }
  
  return (
    <Stack gap="md">
      {/* Summary Card */}
      <Card shadow="sm" padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={3}>{t('results.titleWithNote')}</Title>
          <Group gap="xs">
            <Badge color="green">{t('results.calculated')}</Badge>
            {lastCalculatedAt && (
              <Text size="xs" color="dimmed">
                {new Date(lastCalculatedAt).toLocaleTimeString()}
              </Text>
            )}
          </Group>
        </Group>
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb="xs">{t('results.sections.totalCost')}</Text>
              <Text size="xl" fw={700} c="blue">
                {formatCurrency(result.finalCostBreakdown?.U32_GrandTotal || result.totalCost)}
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb="xs">{t('results.sections.pressureTestA')}</Text>
              <Text size="xl" fw={700}>
                {formatNumber(result.pressureTestHot)} {t('supply.units.bar')}
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb="xs">{t('results.sections.pressureTestB')}</Text>
              <Text size="xl" fw={700}>
                {formatNumber(result.pressureTestCold)} {t('supply.units.bar')}
              </Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Paper p="md" withBorder>
              <Text size="xs" color="dimmed" mb="xs">{t('results.sections.components')}</Text>
              <Text size="xl" fw={700}>
                {Object.keys(result.componentCosts).length - 1}
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </Card>
      
      {/* Cost Breakdown - Use finalCostBreakdown if available, otherwise componentCosts */}
      <Card shadow="sm" padding="lg" radius="md">
        <Title order={4} mb="md">{t('results.sections.costBreakdown')}</Title>
        
        {result.finalCostBreakdown ? (
          <Stack gap="sm">
            {/* Corpus Category J31 = G26 + H26 + I26 + J26 */}
            <div>
              <Group justify="space-between">
                <Text size="sm" fw={600}>{t('results.sections.corpusCategory')}</Text>
                <Text size="sm" fw={600}>
                  {formatCurrency(result.finalCostBreakdown.J31_CorpusCategory)}
                </Text>
              </Group>
              {result.finalCostBreakdown.J31_CorpusCategory > 0 && (
                <Stack gap={4} ml="md" mt={4}>
                  {result.finalCostBreakdown.I26_Covers > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.covers')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.I26_Covers)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.J26_Columns > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.columns')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.J26_Columns)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.H26_PanelMaterial > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.panels')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.H26_PanelMaterial)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.G26_CorpusTotal > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.corpusBase')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.G26_CorpusTotal)}</Text>
                    </Group>
                  )}
                </Stack>
              )}
            </div>

            {/* Core Category J32 = N26 + O26 + P26 */}
            <div>
              <Group justify="space-between">
                <Text size="sm" fw={600}>{t('results.sections.coreCategory')}</Text>
                <Text size="sm" fw={600}>
                  {formatCurrency(result.finalCostBreakdown.J32_CoreCategory)}
                </Text>
              </Group>
              {result.finalCostBreakdown.J32_CoreCategory > 0 && (
                <Stack gap={4} ml="md" mt={4}>
                  {result.finalCostBreakdown.N26_PlatePackage > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.platePackage')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.N26_PlatePackage)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.O26_CladMaterial > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.cladding')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.O26_CladMaterial)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.P26_InternalSupports > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.internalSupports')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.P26_InternalSupports)}</Text>
                    </Group>
                  )}
                </Stack>
              )}
            </div>

            {/* Connections Category J33 = K26 + L26 + M26 */}
            <div>
              <Group justify="space-between">
                <Text size="sm" fw={600}>{t('results.sections.connections')}</Text>
                <Text size="sm" fw={600}>
                  {formatCurrency(result.finalCostBreakdown.J33_ConnectionsCategory)}
                </Text>
              </Group>
              {result.finalCostBreakdown.J33_ConnectionsCategory > 0 && (
                <Stack gap={4} ml="md" mt={4}>
                  {result.finalCostBreakdown.K26_Connections > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.fasteners')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.K26_Connections)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.L26_Gaskets > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.gaskets')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.L26_Gaskets)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.M26_GasketSets > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.gasketSets')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.M26_GasketSets)}</Text>
                    </Group>
                  )}
                </Stack>
              )}
            </div>

            {/* Other Category J34 = R26 + S26 + T26 + U26 + V26 + X26 */}
            <div>
              <Group justify="space-between">
                <Text size="sm" fw={600}>{t('results.sections.otherCategory')}</Text>
                <Text size="sm" fw={600}>
                  {formatCurrency(result.finalCostBreakdown.J34_OtherCategory)}
                </Text>
              </Group>
              {result.finalCostBreakdown.J34_OtherCategory > 0 && (
                <Stack gap={4} ml="md" mt={4}>
                  {result.finalCostBreakdown.R26_Attachment > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.attachments')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.R26_Attachment)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.S26_Legs > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.legs')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.S26_Legs)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.T26_OtherMaterials > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.otherMaterials')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.T26_OtherMaterials)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.U26_ShotBlock > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.shotBlock')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.U26_ShotBlock)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.V26_Uncounted > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.uncounted')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.V26_Uncounted)}</Text>
                    </Group>
                  )}
                  {result.finalCostBreakdown.X26_InternalLogistics > 0 && (
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">• {t('results.sections.internalLogistics')}</Text>
                      <Text size="xs" c="dimmed">{formatCurrency(result.finalCostBreakdown.X26_InternalLogistics)}</Text>
                    </Group>
                  )}
                </Stack>
              )}
            </div>

            {/* COF Category J35 = Q26 */}
            {result.finalCostBreakdown.J35_COFCategory > 0 && (
              <Group justify="space-between">
                <Text size="sm" fw={600}>{t('results.sections.cofCategory')}</Text>
                <Text size="sm" fw={600}>
                  {formatCurrency(result.finalCostBreakdown.J35_COFCategory)}
                </Text>
              </Group>
            )}

            {/* Labor J30 = F26 */}
            <Group justify="space-between">
              <Text size="sm" fw={600}>{t('results.sections.labor')}</Text>
              <Text size="sm" fw={600}>
                {formatCurrency(result.finalCostBreakdown.J30_WorkTotal)}
              </Text>
            </Group>

            {/* Spare Kit J36 = W26 */}
            {result.finalCostBreakdown.J36_SpareCategory > 0 && (
              <Group justify="space-between">
                <Text size="sm" fw={600}>{t('results.sections.spareKit')}</Text>
                <Text size="sm" fw={600}>
                  {formatCurrency(result.finalCostBreakdown.J36_SpareCategory)}
                </Text>
              </Group>
            )}
            
            <Divider my="sm" />
            <Group justify="space-between">
              <Text fw={700}>{t('results.sections.grandTotal')}</Text>
              <Text fw={700} size="lg" c="green">
                {formatCurrency(result.finalCostBreakdown.U32_GrandTotal)}
              </Text>
            </Group>
          </Stack>
        ) : (
          // Fallback to componentCosts if finalCostBreakdown not available
          <Stack gap="sm">
            {Object.entries(result.componentCosts).map(([key, value]) => {
              if (key === 'total') return null;
              const percentage = (value / result.componentCosts.total) * 100;
              
              return (
                <div key={key}>
                  <Group justify="space-between" mb={4}>
                    <Text size="sm">
                      {t(`results.sections.${key}`)}
                    </Text>
                    <Text size="sm" fw={500}>
                      {formatCurrency(value)}
                    </Text>
                  </Group>
                  <Progress 
                    value={percentage} 
                    size="sm" 
                    color={percentage > 30 ? 'red' : percentage > 20 ? 'yellow' : 'blue'}
                  />
                </div>
              );
            })}
            <Divider my="md" />
            <Group justify="space-between">
              <Text fw={600}>{t('common.total')}</Text>
              <Text fw={700} size="lg" c="blue">
                {formatCurrency(result.componentCosts.total)}
              </Text>
            </Group>
          </Stack>
        )}
      </Card>
      
      {/* Material Requirements */}
      <Card shadow="sm" padding="lg" radius="md">
        <Title order={4} mb="md">{t('results.sections.materialRequirements')}</Title>
        
        <Grid>
          {Array.from(result.materialRequirements.entries()).map(([key, value]) => (
            <Grid.Col span={{ base: 12, sm: 6 }} key={key}>
              <Paper p="sm" withBorder>
                <Text size="xs" c="dimmed">
                  {t(`results.sections.${key}`, { defaultValue: key.replace(/([A-Z])/g, ' $1').trim() })}
                </Text>
                <Text fw={500}>
                  {formatNumber(value, key.includes('Mass') ? 2 : 4)} 
                  {key.includes('Mass') ? t('supply.units.kg') : t('supply.units.cubicMeter')}
                </Text>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Card>
      
      {/* Export Actions */}
      <Card shadow="sm" padding="lg" radius="md">
        <Group justify="space-between">
          <Title order={4}>{t('results.sections.exportOptions')}</Title>
          <Group>
            <Button 
              leftSection={<IconFileSpreadsheet size={16} />}
              variant="light"
              onClick={exportToExcel}
            >
              {t('results.exportToExcel')}
            </Button>
            <Button 
              leftSection={<IconDownload size={16} />}
              variant="light"
              onClick={exportToPDF}
            >
              {t('results.exportToPDF')}
            </Button>
            <Bitrix24Export
              result={result}
              projectName={inputs.projectName || t('common.defaultProject')}
              onExportComplete={(dealId) => setBitrixDealId(dealId)}
            />
          </Group>
        </Group>
        
        {/* Show Bitrix24 Deal Link if exported */}
        {bitrixDealId && (
          <Alert
            color="green"
            title={t('bitrix24.export.dealCreatedTitle')}
            mt="md"
          >
            <Text size="sm">
              {t('bitrix24.export.dealCreatedMessage', { id: bitrixDealId })}
            </Text>
          </Alert>
        )}
      </Card>
    </Stack>
  );
};