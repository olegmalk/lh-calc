import React from 'react';
import { 
  NumberInput, 
  Group, 
  Text, 
  Badge, 
  Collapse,
  ActionIcon
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconCrown } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../../stores/inputStore';
import { useCurrentRole } from '../../stores/roleStore';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { FIELD_GROUPS } from '../../config/field-permissions';
import type { HeatExchangerInput } from '../../lib/calculation-engine/types';
import './CalculationSection.css';

interface ExecutiveSectionProps {
  expanded?: boolean;
  onToggle?: () => void;
}

export const ExecutiveSection: React.FC<ExecutiveSectionProps> = ({ 
  expanded = false, 
  onToggle 
}) => {
  const { t } = useTranslation();
  const { inputs, updateInput } = useInputStore();
  const { canEditField, canViewField } = useRolePermissions();
  const currentRole = useCurrentRole();
  const canEdit = canEditField;
  const canView = canViewField;

  // Get executive fields from field permissions
  const redFields = FIELD_GROUPS.executive.red;

  const isLocked = currentRole !== 'director';
  
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

    switch (fieldName) {
      case 'discountPercent':
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`executive.${fieldName}`)}
            placeholder={t(`executive.${fieldName}Placeholder`)}
            description={t(`executive.${fieldName}Description`)}
            value={inputs[fieldName] || 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
            max={100}
            step={0.1}
            decimalScale={1}
            suffix="%"
          />
        );

      case 'laborRate':
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`executive.${fieldName}`)}
            placeholder={t(`executive.${fieldName}Placeholder`)}
            description={t(`executive.${fieldName}Description`)}
            value={inputs[fieldName] || 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
            step={10}
            leftSection="₽"
          />
        );

      case 'specialCost1':
      case 'specialCost2':
      case 'specialCost3':
      case 'specialCost4':
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`executive.${fieldName}`)}
            placeholder={t(`executive.${fieldName}Placeholder`)}
            description={t(`executive.${fieldName}Description`)}
            value={inputs[fieldName] || 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
            step={1}
            leftSection="₽"
          />
        );

      case 'managementCoefficient':
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`executive.${fieldName}`)}
            placeholder={t(`executive.${fieldName}Placeholder`)}
            description={t(`executive.${fieldName}Description`)}
            value={inputs[fieldName] || 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
            step={0.01}
            decimalScale={2}
          />
        );

      case 'directorReserve':
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`executive.${fieldName}`)}
            placeholder={t(`executive.${fieldName}Placeholder`)}
            description={t(`executive.${fieldName}Description`)}
            value={inputs[fieldName] || 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
            step={100}
            leftSection="₽"
          />
        );

      default:
        return (
          <NumberInput
            key={fieldName}
            className={`field-container ${colorClass}`}
            label={t(`executive.${fieldName}`)}
            placeholder={t(`executive.${fieldName}Placeholder`)}
            value={typeof inputs[fieldName] === 'number' ? inputs[fieldName] : 0}
            onChange={(value) => handleInputChange(fieldName, value)}
            disabled={!canEditField}
            min={0}
          />
        );
    }
  };

  return (
    <div className={`calculation-section ${isLocked ? 'section-locked' : ''}`}>
      <div className="section-header">
        <Group gap="sm">
          <IconCrown size={20} />
          <Text className="section-title">{t('sections.executiveControls')}</Text>
          <Badge 
            size="sm" 
            variant="light" 
            color={isLocked ? 'gray' : 'red'}
            className="role-badge"
          >
            {t('roles.director')}
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
        {/* Executive Cost Adjustments */}
        <Text size="sm" fw={500} mb="sm" c="dimmed">
          {t('executive.costAdjustments')}
        </Text>
        <div className="field-group">
          {redFields
            .filter(field => field.field.startsWith('specialCost'))
            .map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Pricing Controls */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('executive.pricingControls')}
        </Text>
        <div className="field-group">
          {redFields
            .filter(field => ['laborRate', 'discountPercent'].includes(field.field))
            .map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Strategic Controls */}
        <Text size="sm" fw={500} mb="sm" c="dimmed" mt="lg">
          {t('executive.strategicControls')}
        </Text>
        <div className="field-group">
          {redFields
            .filter(field => ['managementCoefficient', 'directorReserve'].includes(field.field))
            .map(fieldConfig => renderField(fieldConfig))}
        </div>

        {/* Executive Notes */}
        <div style={{ 
          marginTop: 'var(--mantine-spacing-lg)',
          padding: 'var(--mantine-spacing-sm)',
          background: 'var(--mantine-color-red-0)',
          border: '1px solid var(--mantine-color-red-2)',
          borderRadius: 'var(--mantine-radius-sm)'
        }}>
          <Text size="sm" c="dimmed">
            <strong>{t('executive.noteTitle')}</strong>
            <br />
            {t('executive.noteDescription')}
          </Text>
        </div>

        {/* Color Legend */}
        <div className="color-legend">
          <div className="legend-item">
            <div className="legend-color legend-red"></div>
            <Text size="xs">{t('legend.executiveControls')}</Text>
          </div>
        </div>
      </Collapse>
    </div>
  );
};