import React from 'react';
import { 
  TextInput, 
  NumberInput, 
  Select, 
  Group, 
  Text, 
  Badge, 
  Collapse,
  ActionIcon,
  Checkbox
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../../stores/inputStore';
import { useCurrentRole } from '../../stores/roleStore';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { FIELD_GROUPS } from '../../config/field-permissions';
import type { HeatExchangerInput } from '../../lib/calculation-engine/types';
import './CalculationSection.css';

interface EngineeringSectionProps {
  expanded?: boolean;
  onToggle?: () => void;
}

export const EngineeringSection: React.FC<EngineeringSectionProps> = ({ 
  expanded = false, 
  onToggle 
}) => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();
  const { canEditField, canViewField } = useRolePermissions();
  const currentRole = useCurrentRole();
  const canEdit = canEditField;
  const canView = canViewField;

  // Get engineering fields from field permissions
  const orangeFields = FIELD_GROUPS.engineering.orange;

  const isLocked = currentRole !== 'engineer';
  
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
    
    // Flange pressure options
    const pressureOptions = [
      { value: 'PN10', label: 'PN10 (10 bar)' },
      { value: 'PN16', label: 'PN16 (16 bar)' },
      { value: 'PN25', label: 'PN25 (25 bar)' },
      { value: 'PN40', label: 'PN40 (40 bar)' }
    ];

    // Flange diameter options
    const diameterOptions = [
      { value: 'DN50', label: 'DN50' },
      { value: 'DN80', label: 'DN80' },
      { value: 'DN100', label: 'DN100' },
      { value: 'DN150', label: 'DN150' },
      { value: 'DN200', label: 'DN200' }
    ];

    // Material options
    const materialOptions = [
      { value: 'stainless-steel-316', label: t('engineering.materials.stainlessSteel316') },
      { value: 'stainless-steel-304', label: t('engineering.materials.stainlessSteel304') },
      { value: 'carbon-steel', label: t('engineering.materials.carbonSteel') }
    ];

    // Engineering type options
    const boltTypes = [
      { value: 'hex-bolt', label: t('engineering.boltType.hexBolt') },
      { value: 'socket-head', label: t('engineering.boltType.socketHead') },
      { value: 'stud-bolt', label: t('engineering.boltType.studBolt') }
    ];

    const weldingMethods = [
      { value: 'tig', label: 'TIG' },
      { value: 'mig', label: 'MIG' },
      { value: 'manual-arc', label: t('engineering.welding.manualArc') }
    ];

    switch (fieldName) {
      case 'flangeHotPressure1':
      case 'flangeHotPressure2':
      case 'flangeColdPressure1':
      case 'flangeColdPressure2':
        return (
          <Select
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`engineering.${fieldName}`)}
            placeholder={t('engineering.selectPressure')}
            data={pressureOptions}
            value={inputs[fieldName] || ''}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
          />
        );

      case 'flangeHotDiameter1':
      case 'flangeHotDiameter2':
      case 'flangeColdDiameter1':
      case 'flangeColdDiameter2':
        return (
          <Select
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`engineering.${fieldName}`)}
            placeholder={t('engineering.selectDiameter')}
            data={diameterOptions}
            value={inputs[fieldName] || ''}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
          />
        );

      case 'frameMaterial':
      case 'boltMaterial':
      case 'nutMaterial':
      case 'weldingMaterial':
        return (
          <Select
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`engineering.${fieldName}`)}
            placeholder={t('engineering.selectMaterial')}
            data={materialOptions}
            value={inputs[fieldName] || ''}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
          />
        );

      case 'boltType':
      case 'nutType':
      case 'washerType':
        return (
          <Select
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`engineering.${fieldName}`)}
            placeholder={t('engineering.selectType')}
            data={boltTypes}
            value={inputs[fieldName] || ''}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
          />
        );

      case 'weldingMethod':
        return (
          <Select
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`engineering.${fieldName}`)}
            placeholder={t('engineering.selectWeldingMethod')}
            data={weldingMethods}
            value={inputs[fieldName] || ''}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
          />
        );

      case 'certificationRequired':
        return (
          <Checkbox
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`engineering.${fieldName}`)}
            checked={inputs[fieldName] || false}
            onChange={(e) => handleInputChange(fieldName, e.target.checked)}
            disabled={!canEditField}
          />
        );

      case 'mountingPanelsCount':
      case 'channelHeight':
      case 'channelWidth':
      case 'frameThickness':
      case 'insulationThickness':
      case 'operatingPressureA':
      case 'operatingPressureB':
      case 'designTemperatureA':
      case 'designTemperatureB':
      case 'flowRateA':
      case 'flowRateB':
      case 'pressureDropA':
      case 'pressureDropB':
      case 'boltQuantity':
      case 'nutQuantity':
      case 'washerQuantity':
      case 'paintThickness':
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`engineering.${fieldName}`)}
            placeholder={t(`engineering.${fieldName}Placeholder`)}
            value={inputs[fieldName] || 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
            step={fieldName.includes('temperature') || fieldName.includes('pressure') ? 1 : 0.1}
          />
        );

      default:
        return (
          <TextInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`engineering.${fieldName}`)}
            placeholder={t(`engineering.${fieldName}Placeholder`)}
            value={inputs[fieldName] || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            disabled={!canEditField}
          />
        );
    }
  };

  return (
    <div className={`calculation-section ${isLocked ? 'section-locked' : ''}`}>
      <div className="section-header">
        <Group gap="sm">
          <IconSettings size={20} />
          <Text className="section-title">{t('sections.engineeringDesign')}</Text>
          <Badge 
            size="sm" 
            variant="light" 
            color={isLocked ? 'gray' : 'orange'}
            className="role-badge"
          >
            {t('roles.engineer')}
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
        {/* Flange Specifications */}
        <Text size="sm" fw={500} mb="sm" c="dimmed">
          {t('engineering.flangeSpecifications')}
        </Text>
        <div className="field-group">
          {orangeFields
            .filter(field => field.field.includes('flange'))
            .map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Process Parameters */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('engineering.processParameters')}
        </Text>
        <div className="field-group">
          {orangeFields
            .filter(field => 
              field.field.includes('operating') || 
              field.field.includes('design') || 
              field.field.includes('flow') || 
              field.field.includes('pressure')
            )
            .map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Component Specifications */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('engineering.componentSpecifications')}
        </Text>
        <div className="field-group">
          {orangeFields
            .filter(field => 
              field.field.includes('mounting') ||
              field.field.includes('channel') ||
              field.field.includes('frame') ||
              field.field.includes('insulation')
            )
            .map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Fastener Details */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('engineering.fastenerDetails')}
        </Text>
        <div className="field-group">
          {orangeFields
            .filter(field => 
              field.field.includes('bolt') || 
              field.field.includes('nut') || 
              field.field.includes('washer')
            )
            .map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Manufacturing & Quality */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('engineering.manufacturingQuality')}
        </Text>
        <div className="field-group">
          {orangeFields
            .filter(field => 
              field.field.includes('welding') ||
              field.field.includes('surface') ||
              field.field.includes('paint') ||
              field.field.includes('quality') ||
              field.field.includes('certification') ||
              field.field.includes('inspection')
            )
            .map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Color Legend */}
        <div className="color-legend">
          <div className="legend-item">
            <div className="legend-color legend-orange"></div>
            <Text size="xs">{t('legend.engineeringFields')}</Text>
          </div>
        </div>
      </Collapse>
    </div>
  );
};