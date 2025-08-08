import React from 'react';
import { Grid, Alert, Card, Title, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface SupplyInputData {
  // Ценовая политика (ДИРЕКТОР) - Pricing Policy
  plateMaterialPricePerKg: number; // D8 - цена материала пластин за кг
  claddingMaterialPricePerKg: number; // E8 - цена плакировки за кг
  columnCoverMaterialPricePerKg: number; // F8 - цена материала колонн/крышек за кг
  panelMaterialPricePerKg: number; // G8 - цена материала панелей за кг
  laborRatePerHour: number; // A12 - стоимость нормо-часа
  cuttingCostPerMeter: number; // A13 - стоимость раскроя за метр
  laborRate: number; // D12 - стоимость работы ₽/час
  laborCoefficient: number; // D13 - коэффициент труда
  materialCoefficient: number; // D14 - коэффициент материала
  
  // Логистика (СНАБЖЕНИЕ) - Logistics
  internalLogisticsCost: number; // P13 - внутренняя логистика
  standardLaborHours: number; // K13 - количество нормо-часов
  panelFastenerQuantity: number; // P19 - количество крепежа панелей
  
  // Поправочные коэффициенты (СНАБЖЕНИЕ) - Correction Factors
  claddingCuttingCorrection: number; // A14 - поправка на раскрой плакировки
  columnCuttingCorrection: number; // A15 - поправка на раскрой колонн
  coverCuttingCorrection: number; // A16 - поправка на раскрой крышек
  panelCuttingCorrection: number; // A17 - поправка на раскрой панелей
}

interface SupplyInputFormProps {
  data: SupplyInputData;
  onChange: (data: SupplyInputData) => void;
  userRole?: 'director' | 'supply' | 'technologist' | 'admin';
}

const DEFAULT_VALUES: SupplyInputData = {
  plateMaterialPricePerKg: 700,
  claddingMaterialPricePerKg: 700,
  columnCoverMaterialPricePerKg: 750,
  panelMaterialPricePerKg: 650,
  laborRatePerHour: 2500,
  cuttingCostPerMeter: 150,
  laborRate: 2500,
  laborCoefficient: 1,
  materialCoefficient: 1,
  internalLogisticsCost: 120000,
  standardLaborHours: 1,
  panelFastenerQuantity: 88,
  claddingCuttingCorrection: 1.05,
  columnCuttingCorrection: 1.03,
  coverCuttingCorrection: 1.02,
  panelCuttingCorrection: 1.04,
};

export const SupplyInputForm: React.FC<SupplyInputFormProps> = ({
  data = DEFAULT_VALUES,
  onChange,
  userRole = 'admin'
}) => {
  const { t } = useTranslation();
  
  const handleChange = (field: keyof SupplyInputData, value: number) => {
    onChange({
      ...data,
      [field]: value
    });
  };
  
  // Role-based field access
  const canEditPricing = userRole === 'director' || userRole === 'admin';
  const canEditLogistics = userRole === 'supply' || userRole === 'admin';
  const canEditCorrections = userRole === 'supply' || userRole === 'admin';
  
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    transition: 'border-color 0.15s ease-in-out',
  };
  
  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '4px',
    display: 'block',
    color: '#212529',
  };
  
  const disabledStyle: React.CSSProperties = {
    ...inputStyle,
    backgroundColor: '#f8f9fa',
    cursor: 'not-allowed',
    opacity: 0.7,
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title order={2} mb="md">{t('supply.title')}</Title>
      
      <Alert icon={<IconAlertCircle size="1rem" />} color="yellow" mb="lg">
        <Text size="sm">
          {t('supply.warning')}
        </Text>
      </Alert>
      
      {/* Ценовая политика - Pricing Policy */}
      <Card shadow="sm" p="lg" mb="lg">
        <Title order={4} mb="md">
          {t('supply.sections.pricingPolicy')} 
          {!canEditPricing && <Text size="xs" c="dimmed" component="span"> ({t('supply.readOnly')})</Text>}
        </Title>
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.plateMaterialPrice')}
              </label>
              <input
                type="number"
                style={canEditPricing ? inputStyle : disabledStyle}
                value={data.plateMaterialPricePerKg}
                onChange={(e) => handleChange('plateMaterialPricePerKg', parseFloat(e.target.value) || 0)}
                disabled={!canEditPricing}
                min="0"
                step="10"
              />
              <Text size="xs" c="dimmed">₽/кг</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.claddingMaterialPrice')}
              </label>
              <input
                type="number"
                style={canEditPricing ? inputStyle : disabledStyle}
                value={data.claddingMaterialPricePerKg}
                onChange={(e) => handleChange('claddingMaterialPricePerKg', parseFloat(e.target.value) || 0)}
                disabled={!canEditPricing}
                min="0"
                step="10"
              />
              <Text size="xs" c="dimmed">₽/кг</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.columnCoverMaterialPrice')}
              </label>
              <input
                type="number"
                style={canEditPricing ? inputStyle : disabledStyle}
                value={data.columnCoverMaterialPricePerKg}
                onChange={(e) => handleChange('columnCoverMaterialPricePerKg', parseFloat(e.target.value) || 0)}
                disabled={!canEditPricing}
                min="0"
                step="10"
              />
              <Text size="xs" c="dimmed">₽/кг</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.panelMaterialPrice')}
              </label>
              <input
                type="number"
                style={canEditPricing ? inputStyle : disabledStyle}
                value={data.panelMaterialPricePerKg}
                onChange={(e) => handleChange('panelMaterialPricePerKg', parseFloat(e.target.value) || 0)}
                disabled={!canEditPricing}
                min="0"
                step="10"
              />
              <Text size="xs" c="dimmed">₽/кг</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.laborRate')}
              </label>
              <input
                type="number"
                style={canEditPricing ? inputStyle : disabledStyle}
                value={data.laborRatePerHour}
                onChange={(e) => handleChange('laborRatePerHour', parseFloat(e.target.value) || 0)}
                disabled={!canEditPricing}
                min="0"
                step="50"
              />
              <Text size="xs" c="dimmed">₽/час</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.cuttingCost')}
              </label>
              <input
                type="number"
                style={canEditPricing ? inputStyle : disabledStyle}
                value={data.cuttingCostPerMeter}
                onChange={(e) => handleChange('cuttingCostPerMeter', parseFloat(e.target.value) || 0)}
                disabled={!canEditPricing}
                min="0"
                step="10"
              />
              <Text size="xs" c="dimmed">₽/м</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.laborRateD12')}
              </label>
              <input
                type="number"
                style={canEditPricing ? inputStyle : disabledStyle}
                value={data.laborRate}
                onChange={(e) => handleChange('laborRate', parseFloat(e.target.value) || 0)}
                disabled={!canEditPricing}
                min="0"
                step="50"
              />
              <Text size="xs" c="dimmed">₽/час</Text>
            </div>
          </Grid.Col>
        </Grid>
      </Card>
      
      {/* Логистика - Logistics */}
      <Card shadow="sm" p="lg" mb="lg">
        <Title order={4} mb="md">
          {t('supply.sections.logistics')}
          {!canEditLogistics && <Text size="xs" c="dimmed" component="span"> ({t('supply.readOnly')})</Text>}
        </Title>
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.internalLogistics')}
              </label>
              <input
                type="number"
                style={canEditLogistics ? inputStyle : disabledStyle}
                value={data.internalLogisticsCost}
                onChange={(e) => handleChange('internalLogisticsCost', parseFloat(e.target.value) || 0)}
                disabled={!canEditLogistics}
                min="0"
                step="1000"
              />
              <Text size="xs" c="dimmed">₽</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.standardLaborHours')}
              </label>
              <input
                type="number"
                style={canEditLogistics ? inputStyle : disabledStyle}
                value={data.standardLaborHours}
                onChange={(e) => handleChange('standardLaborHours', parseFloat(e.target.value) || 0)}
                disabled={!canEditLogistics}
                min="0"
                step="0.5"
              />
              <Text size="xs" c="dimmed">{t('supply.units.hours')}</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.panelFastenerQuantity')}
              </label>
              <input
                type="number"
                style={canEditLogistics ? inputStyle : disabledStyle}
                value={data.panelFastenerQuantity}
                onChange={(e) => handleChange('panelFastenerQuantity', parseInt(e.target.value) || 0)}
                disabled={!canEditLogistics}
                min="0"
                step="1"
              />
              <Text size="xs" c="dimmed">{t('supply.units.pieces')}</Text>
            </div>
          </Grid.Col>
        </Grid>
      </Card>
      
      {/* Поправочные коэффициенты - Correction Factors */}
      <Card shadow="sm" p="lg">
        <Title order={4} mb="md">
          {t('supply.sections.corrections')}
          {!canEditCorrections && <Text size="xs" c="dimmed" component="span"> ({t('supply.readOnly')})</Text>}
        </Title>
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.claddingCorrection')}
              </label>
              <input
                type="number"
                style={canEditCorrections ? inputStyle : disabledStyle}
                value={data.claddingCuttingCorrection}
                onChange={(e) => handleChange('claddingCuttingCorrection', parseFloat(e.target.value) || 1)}
                disabled={!canEditCorrections}
                min="1"
                max="2"
                step="0.01"
              />
              <Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.columnCorrection')}
              </label>
              <input
                type="number"
                style={canEditCorrections ? inputStyle : disabledStyle}
                value={data.columnCuttingCorrection}
                onChange={(e) => handleChange('columnCuttingCorrection', parseFloat(e.target.value) || 1)}
                disabled={!canEditCorrections}
                min="1"
                max="2"
                step="0.01"
              />
              <Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.coverCorrection')}
              </label>
              <input
                type="number"
                style={canEditCorrections ? inputStyle : disabledStyle}
                value={data.coverCuttingCorrection}
                onChange={(e) => handleChange('coverCuttingCorrection', parseFloat(e.target.value) || 1)}
                disabled={!canEditCorrections}
                min="1"
                max="2"
                step="0.01"
              />
              <Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.panelCorrection')}
              </label>
              <input
                type="number"
                style={canEditCorrections ? inputStyle : disabledStyle}
                value={data.panelCuttingCorrection}
                onChange={(e) => handleChange('panelCuttingCorrection', parseFloat(e.target.value) || 1)}
                disabled={!canEditCorrections}
                min="1"
                max="2"
                step="0.01"
              />
              <Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.laborCoefficientD13')}
              </label>
              <input
                type="number"
                style={canEditCorrections ? inputStyle : disabledStyle}
                value={data.laborCoefficient}
                onChange={(e) => handleChange('laborCoefficient', parseFloat(e.target.value) || 1)}
                disabled={!canEditCorrections}
                min="0.1"
                max="5"
                step="0.01"
              />
              <Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('supply.fields.materialCoefficientD14')}
              </label>
              <input
                type="number"
                style={canEditCorrections ? inputStyle : disabledStyle}
                value={data.materialCoefficient}
                onChange={(e) => handleChange('materialCoefficient', parseFloat(e.target.value) || 1)}
                disabled={!canEditCorrections}
                min="0.1"
                max="5"
                step="0.01"
              />
              <Text size="xs" c="dimmed">{t('supply.units.coefficient')}</Text>
            </div>
          </Grid.Col>
        </Grid>
      </Card>
    </div>
  );
};