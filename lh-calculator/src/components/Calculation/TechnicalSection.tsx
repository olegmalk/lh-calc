import React from 'react';
import { 
  TextInput, 
  NumberInput, 
  Select, 
  Group, 
  Text, 
  Badge, 
  Collapse,
  ActionIcon
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconCpu } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../../stores/inputStore';
import { useRolePermissions, useCurrentRole } from '../../stores/roleStore';
import { FIELD_GROUPS } from '../../config/field-permissions';
import type { HeatExchangerInput } from '../../lib/calculation-engine/types';
import './CalculationSection.css';

interface TechnicalSectionProps {
  expanded?: boolean;
  onToggle?: () => void;
}

export const TechnicalSection: React.FC<TechnicalSectionProps> = ({ 
  expanded = true, 
  onToggle 
}) => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();
  const { canEdit, canView } = useRolePermissions();
  const currentRole = useCurrentRole();

  // Get technical fields from field permissions
  const yellowFields = FIELD_GROUPS.technical.yellow;
  const greenFields = FIELD_GROUPS.technical.green;

  const isLocked = currentRole !== 'technologist';
  
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
    
    // Equipment type dropdown options
    const equipmentTypes = [
      { value: 'plate', label: t('technical.equipmentType.plate') },
      { value: 'shell', label: t('technical.equipmentType.shell') },
      { value: 'tube', label: t('technical.equipmentType.tube') }
    ];

    // Material options for dropdowns
    const materialOptions = [
      { value: 'stainless-steel', label: t('technical.materials.stainlessSteel') },
      { value: 'carbon-steel', label: t('technical.materials.carbonSteel') },
      { value: 'titanium', label: t('technical.materials.titanium') }
    ];

    const surfaceTypes = [
      { value: 'smooth', label: t('technical.surfaceType.smooth') },
      { value: 'corrugated', label: t('technical.surfaceType.corrugated') },
      { value: 'embossed', label: t('technical.surfaceType.embossed') }
    ];

    switch (fieldName) {
      case 'equipmentType':
        return (
          <Select
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`technical.${fieldName}`)}
            placeholder={t('technical.selectEquipmentType')}
            data={equipmentTypes}
            value={inputs[fieldName] as string || ''}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
          />
        );

      case 'materialPlate':
      case 'claddingMaterial':
      case 'bodyMaterial':
      case 'materialBody':
        return (
          <Select
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`technical.${fieldName}`)}
            placeholder={t('technical.selectMaterial')}
            data={materialOptions}
            value={inputs[fieldName] as string || ''}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
          />
        );

      case 'surfaceType':
        return (
          <Select
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`technical.${fieldName}`)}
            placeholder={t('technical.selectSurfaceType')}
            data={surfaceTypes}
            value={inputs[fieldName] as string || ''}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
          />
        );

      case 'plateCount':
      case 'plateThickness':
      case 'pressureA':
      case 'pressureB':
      case 'temperatureA':
      case 'temperatureB':
      case 'plateLength':
      case 'drawDepth':
      case 'claddingThickness':
      case 'solutionDensity':
      case 'additionalPlatesFactor':
      case 'panelCountFactor':
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`technical.${fieldName}`)}
            placeholder={t(`technical.${fieldName}Placeholder`)}
            value={inputs[fieldName] as number || 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
            step={fieldName.includes('temperature') ? 1 : 0.1}
          />
        );

      default:
        return (
          <TextInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`technical.${fieldName}`)}
            placeholder={t(`technical.${fieldName}Placeholder`)}
            value={inputs[fieldName] as string || ''}
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
          <IconCpu size={20} />
          <Text className="section-title">{t('sections.technicalSpecification')}</Text>
          <Badge 
            size="sm" 
            variant="light" 
            color={isLocked ? 'gray' : 'blue'}
            className="role-badge"
          >
            {t('roles.technologist')}
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
        {/* Yellow Fields - Technologist Dropdowns */}
        <Text size="sm" fw={500} mb="sm" c="dimmed">
          {t('technical.dropdownSelections')}
        </Text>
        <div className="field-group">
          {yellowFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Green Fields - Manual Entry */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('technical.manualParameters')}
        </Text>
        <div className="field-group">
          {greenFields.map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Color Legend */}
        <div className="color-legend">
          <div className="legend-item">
            <div className="legend-color legend-yellow"></div>
            <Text size="xs">{t('legend.technologistDropdowns')}</Text>
          </div>
          <div className="legend-item">
            <div className="legend-color legend-green"></div>
            <Text size="xs">{t('legend.manualEntry')}</Text>
          </div>
        </div>
      </Collapse>
    </div>
  );
};