import React from 'react';
import { 
  TextInput, 
  NumberInput, 
  Group, 
  Text, 
  Badge, 
  Collapse,
  ActionIcon
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconCurrency } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../../stores/inputStore';
// import { useRolePermissions, useCurrentRole } from '../../stores/roleStore';
import { FIELD_GROUPS } from '../../config/field-permissions';
import type { HeatExchangerInput } from '../../lib/calculation-engine/types';
import './CalculationSection.css';

interface SupplySectionProps {
  expanded?: boolean;
  onToggle?: () => void;
}

export const SupplySection: React.FC<SupplySectionProps> = ({ 
  expanded = false, 
  onToggle 
}) => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();
  // Temporarily disabled to fix infinite loop
  const canEdit = (_field: string) => true;
  const canView = (_field: string) => true;
  const currentRole = 'supply-manager';

  // Get supply fields from field permissions
  const greenSupplyFields = FIELD_GROUPS.supply.green;

  const isLocked = currentRole !== 'supply-manager';
  
  const handleInputChange = (field: keyof HeatExchangerInput, value: string | number | boolean | null) => {
    if (canEdit(field)) {
      updateInput(field, value || undefined);
    }
  };

  const renderField = (fieldConfig: { field: string; color: string }) => {
    const fieldName = fieldConfig.field as keyof HeatExchangerInput;
    const canEditField = canEdit(fieldName);
    const canViewField = canView(fieldName);
    
    if (!canViewField) return null;

    const colorClass = `field-${fieldConfig.color}`;

    // All supply fields are numeric or text inputs
    switch (fieldName) {
      case 'laborRate':
      case 'laborCoefficient':
      case 'materialCoefficient':
      case 'componentCost1':
      case 'componentCost2':
      case 'componentCost3':
      case 'componentCost4':
      case 'additionalCost1':
      case 'additionalCost2':
      case 'additionalCost3':
      case 'processCost1':
      case 'processCost2':
      case 'processCost3':
      case 'processCost4':
      case 'assemblyWork1':
      case 'assemblyWork2':
      case 'additionalWork1':
      case 'additionalWork2':
      case 'materialCost1':
      case 'materialCost2':
      case 'materialCost3':
      case 'extraCost':
      case 'plateMaterialPricePerKg':
      case 'claddingMaterialPricePerKg':
      case 'columnCoverMaterialPricePerKg':
      case 'panelMaterialPricePerKg':
      case 'laborRatePerHour':
      case 'cuttingCostPerMeter':
      case 'internalLogisticsCost':
      case 'standardLaborHours':
      case 'panelFastenerQuantity':
      case 'claddingCuttingCorrection':
      case 'columnCuttingCorrection':
      case 'coverCuttingCorrection':
      case 'panelCuttingCorrection':
      case 'additionalMaterialCost1':
      case 'additionalMaterialCost2':
      case 'additionalMaterialCost3':
      case 'additionalLaborCost1':
      case 'additionalLaborCost2':
      case 'additionalLaborCost3':
      case 'additionalServiceCost1':
      case 'additionalServiceCost2':
      case 'additionalServiceCost3':
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`supply.${fieldName}`)}
            placeholder={t(`supply.${fieldName}Placeholder`)}
            value={inputs[fieldName] || 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
            step={fieldName.includes('coefficient') || fieldName.includes('correction') ? 0.01 : 1}
            precision={fieldName.includes('coefficient') || fieldName.includes('correction') ? 3 : 0}
            leftSection={fieldName.includes('cost') || fieldName.includes('price') || fieldName.includes('rate') ? '₽' : undefined}
          />
        );

      case 'additionalMaterial1':
      case 'additionalMaterial2':
      case 'additionalMaterial3':
      case 'additionalLabor1':
      case 'additionalLabor2':
      case 'additionalLabor3':
      case 'additionalService1':
      case 'additionalService2':
      case 'additionalService3':
        return (
          <TextInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`supply.${fieldName}`)}
            placeholder={t(`supply.${fieldName}Placeholder`)}
            value={inputs[fieldName] || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            disabled={!canEditField}
          />
        );

      default:
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`supply.${fieldName}`)}
            placeholder={t(`supply.${fieldName}Placeholder`)}
            value={inputs[fieldName] || 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
          />
        );
    }
  };

  // Group fields by category for better organization
  const coreRateFields = greenSupplyFields.filter(field => 
    ['laborRate', 'laborCoefficient', 'materialCoefficient'].includes(field.field)
  );

  const materialPriceFields = greenSupplyFields.filter(field =>
    field.field.includes('PricePerKg')
  );

  const componentCostFields = greenSupplyFields.filter(field =>
    field.field.startsWith('componentCost')
  );

  const processCostFields = greenSupplyFields.filter(field =>
    field.field.startsWith('processCost') || field.field.includes('Work')
  );

  const materialCostFields = greenSupplyFields.filter(field =>
    field.field.startsWith('materialCost') || field.field === 'extraCost'
  );

  const logisticFields = greenSupplyFields.filter(field =>
    ['internalLogisticsCost', 'standardLaborHours', 'cuttingCostPerMeter', 'panelFastenerQuantity'].includes(field.field)
  );

  const correctionFields = greenSupplyFields.filter(field =>
    field.field.includes('Correction')
  );

  const additionalFields = greenSupplyFields.filter(field =>
    field.field.includes('additional')
  );

  return (
    <div className={`calculation-section ${isLocked ? 'section-locked' : ''}`}>
      <div className="section-header">
        <Group gap="sm">
          <IconCurrency size={20} />
          <Text className="section-title">{t('sections.supplyCosts')}</Text>
          <Badge 
            size="sm" 
            variant="light" 
            color={isLocked ? 'gray' : 'green'}
            className="role-badge"
          >
            {t('roles.supplyManager')}
          </Badge>
        </Group>
        
        <ActionIcon
          variant="subtle"
          onClick={onToggle}
          size="sm"
        >
          {expanded ? <IconChevronUp /> : <IconChevronDown />}
        </ActionIcon>
      </div>

      <Collapse in={expanded}>
        {/* Core Rate Parameters */}
        <Text size="sm" fw={500} mb="sm" c="dimmed">
          {t('supply.coreRates')}
        </Text>
        <div className="field-group">
          {coreRateFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Material Prices */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('supply.materialPrices')}
        </Text>
        <div className="field-group">
          {materialPriceFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Component Costs */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('supply.componentCosts')}
        </Text>
        <div className="field-group">
          {componentCostFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Process & Assembly Costs */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('supply.processCosts')}
        </Text>
        <div className="field-group">
          {processCostFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Material Additional Costs */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('supply.materialCosts')}
        </Text>
        <div className="field-group">
          {materialCostFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Logistics Parameters */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('supply.logistics')}
        </Text>
        <div className="field-group">
          {logisticFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Cutting Corrections */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('supply.cuttingCorrections')}
        </Text>
        <div className="field-group">
          {correctionFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Additional Costs */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('supply.additionalCosts')}
        </Text>
        <div className="field-group">
          {additionalFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Color Legend */}
        <div className="color-legend">
          <div className="legend-item">
            <div className="legend-color legend-green"></div>
            <Text size="xs">{t('legend.supplyCostFields')}</Text>
          </div>
        </div>
      </Collapse>
    </div>
  );
};