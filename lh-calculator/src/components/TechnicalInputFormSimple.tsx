import React, { useState, useEffect } from 'react';
import { Card, Grid, Button, Group, Stack, Title, Divider, Badge, Alert, Collapse } from '@mantine/core';
import { IconAlertCircle, IconChevronDown } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';
import { useCalculationStore } from '../stores/calculationStore';
import { useMaterialStore } from '../stores/materialStore';
// import { useRoleStore } from '../stores/roleStore';
// import { useRolePermissions } from '../hooks/useRolePermissions';
import { NAMED_RANGES } from '../lib/calculation-engine/constants';
import { calc_AI73_TestPressureHot, calc_AJ73_TestPressureCold } from '../lib/calculation-engine/formula-library-complete';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';

// Import new sections
import { ProjectInfoSection } from './ProjectInfoSection';
import { ExtendedSpecsSection } from './ExtendedSpecsSection';
import { ProcessParametersSection } from './ProcessParametersSection';
import { FastenerSection } from './FastenerSection';
import { ManufacturingSection } from './ManufacturingSection';
import { LogisticsSection } from './LogisticsSection';
import { DocumentationSection } from './DocumentationSection';
import { SparePartsSection } from './SparePartsSection';
import { FinancialSection } from './FinancialSection';
import { AdditionalCostsSection } from './AdditionalCostsSection';

export const TechnicalInputFormSimple: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput, updateMultiple, isDirty, reset } = useInputStore();
  const { calculate, isCalculating } = useCalculationStore();
  const { availableMaterials } = useMaterialStore();
  
  // Role-based permissions
  // const { currentRole } = useRoleStore();
  const currentRole = 'technologist'; // Temporary default
  // const formPermissions = useFormPermissions(); // Kept for future role-based form validation
  
  // const { 
  //   canEdit, 
  //   getFieldInfo 
  // } = useRolePermissions();
  
  // Temporary mock functions to fix infinite loop
  const canEdit = (_field: string) => true;
  const getFieldInfo = (_field: string) => ({ color: 'green', section: 'technical' });
  
  // Local form state
  const [formData, setFormData] = useState<HeatExchangerInput>(inputs);
  const [errors, setErrors] = useState<Partial<Record<keyof HeatExchangerInput, string>>>({});
  const [calculatedTestPressures, setCalculatedTestPressures] = useState({ hot: 0, cold: 0 });
  
  // Collapsible section states
  const [projectInfoOpened, { toggle: toggleProjectInfo }] = useDisclosure(false);
  const [extendedSpecsOpened, { toggle: toggleExtendedSpecs }] = useDisclosure(false);
  const [processParamsOpened, { toggle: toggleProcessParams }] = useDisclosure(false);
  const [fastenersOpened, { toggle: toggleFasteners }] = useDisclosure(false);
  const [manufacturingOpened, { toggle: toggleManufacturing }] = useDisclosure(false);
  const [logisticsOpened, { toggle: toggleLogistics }] = useDisclosure(false);
  const [documentationOpened, { toggle: toggleDocumentation }] = useDisclosure(false);
  const [sparePartsOpened, { toggle: toggleSpareParts }] = useDisclosure(false);
  const [financialOpened, { toggle: toggleFinancial }] = useDisclosure(false);
  const [additionalCostsOpened, { toggle: toggleAdditionalCosts }] = useDisclosure(false);
  
  // Sync with store
  useEffect(() => {
    setFormData(inputs);
  }, [inputs]);
  
  // Calculate test pressures when relevant fields change
  const calculateTestPressures = (data: HeatExchangerInput) => {
    try {
      if (data.pressureA > 0 && data.pressureB > 0 && data.temperatureA && data.temperatureB && data.materialPlate) {
        const context = {
          inputs: data,
          materials: new Map(),
          namedRanges: new Map(),
          intermediateValues: new Map(),
          dependencies: new Map(),
        };
        
        const hotPressure = calc_AI73_TestPressureHot(context);
        const coldPressure = calc_AJ73_TestPressureCold(context);
        
        setCalculatedTestPressures({ hot: hotPressure, cold: coldPressure });
      }
    } catch (error) {
      console.warn('Failed to calculate test pressures:', error);
      setCalculatedTestPressures({ hot: 0, cold: 0 });
    }
  };
  
  // Recalculate test pressures when inputs change
  useEffect(() => {
    calculateTestPressures(formData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.pressureA, formData.pressureB, formData.temperatureA, formData.temperatureB, formData.materialPlate]);
  
  // Handle field changes with role-based validation
  const handleChange = (field: keyof HeatExchangerInput, value: string | number) => {
    // Check if current role can edit this field
    if (!canEdit(field)) {
      console.warn(`Role ${currentRole} cannot edit field ${field}`);
      return;
    }
    
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    updateInput(field, value);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  // Validate form
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof HeatExchangerInput, string>> = {};
    
    if (!formData.equipmentType) newErrors.equipmentType = t('form.validation.equipmentTypeRequired');
    if (!formData.modelCode) newErrors.modelCode = t('form.validation.modelCodeRequired');
    if (!formData.plateConfiguration) newErrors.plateConfiguration = t('form.validation.plateConfigRequired');
    
    if (formData.plateCount < 10) newErrors.plateCount = t('form.validation.plateCountMin');
    if (formData.plateCount > 1000) newErrors.plateCount = t('form.validation.plateCountMax');
    
    if (formData.pressureA < 0) newErrors.pressureA = t('form.validation.pressurePositive');
    if (formData.pressureA > 400) newErrors.pressureA = t('form.validation.pressureMax');
    if (formData.pressureB < 0) newErrors.pressureB = t('form.validation.pressurePositive');
    if (formData.pressureB > 400) newErrors.pressureB = t('form.validation.pressureMax');
    
    if (formData.temperatureA < -40) newErrors.temperatureA = t('form.validation.temperatureMin');
    if (formData.temperatureA > 200) newErrors.temperatureA = t('form.validation.temperatureMax');
    if (formData.temperatureB < -40) newErrors.temperatureB = t('form.validation.temperatureMin');
    if (formData.temperatureB > 200) newErrors.temperatureB = t('form.validation.temperatureMax');
    
    if (formData.plateThickness < 0.4) newErrors.plateThickness = t('form.validation.thicknessMin');
    if (formData.plateThickness > 1.2) newErrors.plateThickness = t('form.validation.thicknessMax');
    
    // T27 validation - Plate length (1-50 mm)
    if (formData.plateLength && (formData.plateLength < 1 || formData.plateLength > 50)) {
      newErrors.plateLength = t('form.validation.plateLengthRange');
    }
    
    // V27 validation - Mounting panels count (1-10)
    if (formData.mountingPanelsCount && (formData.mountingPanelsCount < 1 || formData.mountingPanelsCount > 10)) {
      newErrors.mountingPanelsCount = t('form.validation.mountingPanelsRange');
    }
    
    // Story 3: Configuration parameters validation
    if (formData.solutionDensity && (formData.solutionDensity < 0.5 || formData.solutionDensity > 2.0)) {
      newErrors.solutionDensity = t('form.validation.solutionDensityRange');
    }
    
    if (formData.flowRatio && !formData.flowRatio.match(/^\d+\/\d+$/)) {
      newErrors.flowRatio = t('form.validation.flowRatioPattern');
    }
    
    if (!formData.materialPlate) newErrors.materialPlate = t('form.validation.plateMaterialRequired');
    if (!formData.materialBody) newErrors.materialBody = t('form.validation.bodyMaterialRequired');
    if (!formData.surfaceType) newErrors.surfaceType = t('form.validation.surfaceTypeRequired');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle submit
  const handleSubmit = async () => {
    const isValid = validate();
    console.log('Form validation result:', isValid);
    console.log('Errors after validation:', errors);
    if (isValid) {
      updateMultiple(formData);
      await calculate(formData);
    }
  };
  
  // Handle reset
  const handleReset = () => {
    reset();
    setFormData(inputs);
    setErrors({});
  };
  
  // Simple input style
  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '20px',
    transition: 'border-color 0.15s ease-in-out',
  };
  
  const errorStyle = {
    borderColor: '#fa5252',
  };
  
  const readonlyStyle = {
    backgroundColor: '#f8f9fa',
    cursor: 'not-allowed',
    color: '#6c757d',
  };
  
  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 500,
  };
  
  // Role-based styling helper
  const getFieldStyles = (field: keyof HeatExchangerInput) => {
    const fieldInfo = getFieldInfo(field);
    const hasError = !!errors[field];
    const isEditable = fieldInfo.canEdit;
    const isVisible = fieldInfo.canView;
    
    if (!isVisible) {
      return {
        container: { display: 'none' },
        input: inputStyle,
        label: labelStyle
      };
    }
    
    const baseInputStyle = {
      ...inputStyle,
      ...(hasError ? errorStyle : {}),
      ...(isEditable ? {} : readonlyStyle)
    };
    
    return {
      container: { 
        opacity: isEditable ? 1 : 0.7,
        position: 'relative' as const
      },
      input: baseInputStyle,
      label: {
        ...labelStyle,
        color: isEditable ? '#212529' : '#6c757d'
      }
    };
  };
  
  const errorTextStyle = {
    color: '#fa5252',
    fontSize: '12px',
    marginTop: '5px',
  };
  
  return (
    <Card shadow="sm" padding="lg" radius="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>{t('form.titleWithNote')}</Title>
          {isDirty && <Badge color="yellow">{t('form.unsavedChanges')}</Badge>}
        </Group>
        
        <Divider label={t('form.sections.identification')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.positionNumber')}
              </label>
              <input
                type="text"
                style={inputStyle}
                value={formData.positionNumber || ''}
                onChange={(e) => handleChange('positionNumber', e.target.value)}
                placeholder={t('form.placeholders.positionNumber')}
              />
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.customerOrderNumber')}
              </label>
              <input
                type="text"
                style={inputStyle}
                value={formData.customerOrderNumber || ''}
                onChange={(e) => handleChange('customerOrderNumber', e.target.value)}
                placeholder={t('form.placeholders.customerOrderNumber')}
              />
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.deliveryType')}
              </label>
              <select
                style={inputStyle}
                value={formData.deliveryType || ''}
                onChange={(e) => handleChange('deliveryType', e.target.value)}
              >
                <option value="">{t('common.placeholder.selectDeliveryType')}</option>
                <option value="Целый ТА">Целый ТА</option>
                <option value="ШОТ-БЛОК">ШОТ-БЛОК</option>
                <option value="РЕИНЖ">РЕИНЖ</option>
              </select>
            </div>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.equipmentConfig')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div style={getFieldStyles('equipmentType').container}>
              <label style={getFieldStyles('equipmentType').label}>
                {t('form.fields.equipmentTypeWithNote')} <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                data-testid="equipment-type-select"
                style={getFieldStyles('equipmentType').input}
                value={formData.equipmentType}
                onChange={(e) => handleChange('equipmentType', e.target.value)}
                disabled={!canEdit('equipmentType')}
              >
                <option value="">{t('common.placeholder.selectType')}</option>
                {NAMED_RANGES.типоразмеры_К4.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.equipmentType && <div style={errorTextStyle}>{errors.equipmentType}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.modelCode')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                style={{ ...inputStyle, ...(errors.modelCode ? errorStyle : {}) }}
                value={formData.modelCode}
                onChange={(e) => handleChange('modelCode', e.target.value)}
                placeholder={t('form.placeholders.modelCode')}
              />
              {errors.modelCode && <div style={errorTextStyle}>{errors.modelCode}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.plateConfiguration')} <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                data-testid="plate-config-select"
                style={{ ...inputStyle, ...(errors.plateConfiguration ? errorStyle : {}) }}
                value={formData.plateConfiguration}
                onChange={(e) => handleChange('plateConfiguration', e.target.value)}
              >
                <option value="">{t('common.placeholder.selectConfiguration')}</option>
                {['1/6', '1/4', '1/3', '1/2', '2/3', '3/4'].map(config => (
                  <option key={config} value={config}>{config}</option>
                ))}
              </select>
              {errors.plateConfiguration && <div style={errorTextStyle}>{errors.plateConfiguration}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.plateCountWithNote')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                style={{ ...inputStyle, ...(errors.plateCount ? errorStyle : {}) }}
                value={formData.plateCount}
                onChange={(e) => handleChange('plateCount', parseInt(e.target.value) || 0)}
                placeholder={t('form.placeholders.plateCount')}
                min="10"
                max="1000"
              />
              {errors.plateCount && <div style={errorTextStyle}>{errors.plateCount}</div>}
            </div>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.operatingParams')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.pressureA')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                style={{ ...inputStyle, ...(errors.pressureA ? errorStyle : {}) }}
                value={formData.pressureA}
                onChange={(e) => handleChange('pressureA', parseFloat(e.target.value) || 0)}
                placeholder={t('form.placeholders.pressure')}
                min="0"
                max="400"
                step="0.1"
              />
              {errors.pressureA && <div style={errorTextStyle}>{errors.pressureA}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.pressureB')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                style={{ ...inputStyle, ...(errors.pressureB ? errorStyle : {}) }}
                value={formData.pressureB}
                onChange={(e) => handleChange('pressureB', parseFloat(e.target.value) || 0)}
                placeholder={t('form.placeholders.pressure')}
                min="0"
                max="400"
                step="0.1"
              />
              {errors.pressureB && <div style={errorTextStyle}>{errors.pressureB}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.temperatureA')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                style={{ ...inputStyle, ...(errors.temperatureA ? errorStyle : {}) }}
                value={formData.temperatureA}
                onChange={(e) => handleChange('temperatureA', parseFloat(e.target.value) || 0)}
                placeholder={t('form.placeholders.temperatureHot')}
                min="-40"
                max="200"
              />
              {errors.temperatureA && <div style={errorTextStyle}>{errors.temperatureA}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.temperatureB')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                style={{ ...inputStyle, ...(errors.temperatureB ? errorStyle : {}) }}
                value={formData.temperatureB}
                onChange={(e) => handleChange('temperatureB', parseFloat(e.target.value) || 0)}
                placeholder={t('form.placeholders.temperatureCold')}
                min="-40"
                max="200"
              />
              {errors.temperatureB && <div style={errorTextStyle}>{errors.temperatureB}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '5px', color: '#d63384', fontWeight: 600}}>
                <IconAlertCircle size={14} color="#d63384" />
                {t('form.fields.testPressureHot')}
                <Badge color="red" size="xs">SAFETY</Badge>
              </label>
              <input
                type="number"
                style={{
                  ...inputStyle, 
                  backgroundColor: '#fdf2f2', 
                  cursor: 'not-allowed',
                  border: '2px solid #d63384',
                  fontWeight: 'bold'
                }}
                value={calculatedTestPressures.hot.toFixed(2)}
                readOnly
                placeholder="Авто-расчет"
              />
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '5px', color: '#d63384', fontWeight: 600}}>
                <IconAlertCircle size={14} color="#d63384" />
                {t('form.fields.testPressureCold')}
                <Badge color="red" size="xs">SAFETY</Badge>
              </label>
              <input
                type="number"
                style={{
                  ...inputStyle, 
                  backgroundColor: '#fdf2f2', 
                  cursor: 'not-allowed',
                  border: '2px solid #d63384',
                  fontWeight: 'bold'
                }}
                value={calculatedTestPressures.cold.toFixed(2)}
                readOnly
                placeholder="Авто-расчет"
              />
            </div>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.materials')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.plateMaterialWithNote')} <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                data-testid="plate-material-select"
                style={{ ...inputStyle, ...(errors.materialPlate ? errorStyle : {}) }}
                value={formData.materialPlate}
                onChange={(e) => handleChange('materialPlate', e.target.value)}
              >
                <option value="">{t('common.placeholder.selectMaterial')}</option>
                {availableMaterials.plate.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
              {errors.materialPlate && <div style={errorTextStyle}>{errors.materialPlate}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.claddingMaterial')}
              </label>
              <input
                type="text"
                style={{
                  ...inputStyle,
                  backgroundColor: '#f8f9fa',
                  cursor: 'not-allowed',
                  color: '#6c757d'
                }}
                value={formData.claddingMaterial || ''}
                readOnly
                placeholder="Auto-synced with plate material"
              />
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.bodyMaterial')}
              </label>
              <select
                data-testid="body-material-select"
                style={inputStyle}
                value={formData.bodyMaterial || ''}
                onChange={(e) => handleChange('bodyMaterial', e.target.value)}
              >
                <option value="">{t('common.placeholder.selectMaterial')}</option>
                <option value="09Г2С">09Г2С</option>
                <option value="Ст3">Ст3</option>
                <option value="Ст20">Ст20</option>
                <option value="12Х18Н10Т">12Х18Н10Т</option>
              </select>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.corrugationType')}
              </label>
              <select
                data-testid="corrugation-type-select"
                style={inputStyle}
                value={formData.corrugationType || ''}
                onChange={(e) => handleChange('corrugationType', e.target.value)}
              >
                <option value="">{t('common.placeholder.selectType')}</option>
                <option value="гофра">гофра</option>
                <option value="плоская">плоская</option>
                <option value="специальная">специальная</option>
              </select>
            </div>
          </Grid.Col>
        </Grid>
        
        {/* Legacy fields for backward compatibility */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.bodyMaterialWithNote')} <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                data-testid="legacy-body-material-select"
                style={{ ...inputStyle, ...(errors.materialBody ? errorStyle : {}) }}
                value={formData.materialBody}
                onChange={(e) => handleChange('materialBody', e.target.value)}
              >
                <option value="">{t('common.placeholder.selectMaterial')}</option>
                {availableMaterials.body.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
              {errors.materialBody && <div style={errorTextStyle}>{errors.materialBody}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.surfaceTypeWithNote')} <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                data-testid="surface-type-select"
                style={{ ...inputStyle, ...(errors.surfaceType ? errorStyle : {}) }}
                value={formData.surfaceType}
                onChange={(e) => handleChange('surfaceType', e.target.value)}
              >
                <option value="">{t('common.placeholder.selectType')}</option>
                {NAMED_RANGES.тип_поверхности.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.surfaceType && <div style={errorTextStyle}>{errors.surfaceType}</div>}
            </div>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.configurationParameters')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.solutionDensity')}
              </label>
              <input
                type="number"
                style={{ ...inputStyle, ...(errors.solutionDensity ? errorStyle : {}) }}
                value={formData.solutionDensity || 1.0}
                onChange={(e) => handleChange('solutionDensity', parseFloat(e.target.value) || 1.0)}
                placeholder={t('form.placeholders.solutionDensity')}
                min="0.5"
                max="2.0"
                step="0.01"
              />
              {errors.solutionDensity && <div style={errorTextStyle}>{errors.solutionDensity}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.solutionVolume')}
              </label>
              <input
                type="text"
                style={inputStyle}
                value={formData.solutionVolume || ''}
                onChange={(e) => handleChange('solutionVolume', e.target.value)}
                placeholder={t('form.placeholders.solutionVolume')}
                maxLength={50}
              />
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.equipmentTypeDetail')}
              </label>
              <input
                type="text"
                style={inputStyle}
                value={formData.equipmentTypeDetail || ''}
                onChange={(e) => handleChange('equipmentTypeDetail', e.target.value)}
                placeholder={t('form.placeholders.equipmentTypeDetail')}
                maxLength={100}
              />
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.flowRatio')}
              </label>
              <input
                type="text"
                style={{ ...inputStyle, ...(errors.flowRatio ? errorStyle : {}) }}
                value={formData.flowRatio || ''}
                onChange={(e) => handleChange('flowRatio', e.target.value)}
                placeholder={t('form.placeholders.flowRatio')}
                pattern="^\d+\/\d+$"
              />
              {errors.flowRatio && <div style={errorTextStyle}>{errors.flowRatio}</div>}
            </div>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.flangeSystem')} />
        
        <Grid>
          <Grid.Col span={12}>
            <Title order={5} mb="sm">{t('form.sections.hotSideFlanges')}</Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <div>
                  <label style={labelStyle}>
                    {t('form.fields.pressure')} 1
                  </label>
                  <select
                    style={inputStyle}
                    value={formData.flangeHotPressure1 || ''}
                    onChange={(e) => handleChange('flangeHotPressure1', e.target.value)}
                  >
                    <option value="">{t('common.placeholder.select')}</option>
                    {['Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100'].map(pressure => (
                      <option key={pressure} value={pressure}>{pressure}</option>
                    ))}
                  </select>
                </div>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <div>
                  <label style={labelStyle}>
                    {t('form.fields.diameter')} 1
                  </label>
                  <select
                    style={inputStyle}
                    value={formData.flangeHotDiameter1 || ''}
                    onChange={(e) => handleChange('flangeHotDiameter1', e.target.value)}
                  >
                    <option value="">{t('common.placeholder.select')}</option>
                    {['Ду25', 'Ду50', 'Ду100', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду500', 'Ду600', 'Ду700', 'Ду800', 'Ду900', 'Ду1000'].map(diameter => (
                      <option key={diameter} value={diameter}>{diameter}</option>
                    ))}
                  </select>
                </div>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <div>
                  <label style={labelStyle}>
                    {t('form.fields.pressure')} 2
                  </label>
                  <select
                    style={inputStyle}
                    value={formData.flangeHotPressure2 || ''}
                    onChange={(e) => handleChange('flangeHotPressure2', e.target.value)}
                  >
                    <option value="">{t('common.placeholder.select')}</option>
                    {['Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100'].map(pressure => (
                      <option key={pressure} value={pressure}>{pressure}</option>
                    ))}
                  </select>
                </div>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <div>
                  <label style={labelStyle}>
                    {t('form.fields.diameter')} 2
                  </label>
                  <select
                    style={inputStyle}
                    value={formData.flangeHotDiameter2 || ''}
                    onChange={(e) => handleChange('flangeHotDiameter2', e.target.value)}
                  >
                    <option value="">{t('common.placeholder.select')}</option>
                    {['Ду25', 'Ду50', 'Ду100', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду500', 'Ду600', 'Ду700', 'Ду800', 'Ду900', 'Ду1000'].map(diameter => (
                      <option key={diameter} value={diameter}>{diameter}</option>
                    ))}
                  </select>
                </div>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          
          <Grid.Col span={12}>
            <Title order={5} mb="sm">{t('form.sections.coldSideFlanges')}</Title>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <div>
                  <label style={labelStyle}>
                    {t('form.fields.pressure')} 1
                  </label>
                  <select
                    style={inputStyle}
                    value={formData.flangeColdPressure1 || ''}
                    onChange={(e) => handleChange('flangeColdPressure1', e.target.value)}
                  >
                    <option value="">{t('common.placeholder.select')}</option>
                    {['Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100'].map(pressure => (
                      <option key={pressure} value={pressure}>{pressure}</option>
                    ))}
                  </select>
                </div>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <div>
                  <label style={labelStyle}>
                    {t('form.fields.diameter')} 1
                  </label>
                  <select
                    style={inputStyle}
                    value={formData.flangeColdDiameter1 || ''}
                    onChange={(e) => handleChange('flangeColdDiameter1', e.target.value)}
                  >
                    <option value="">{t('common.placeholder.select')}</option>
                    {['Ду25', 'Ду50', 'Ду100', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду500', 'Ду600', 'Ду700', 'Ду800', 'Ду900', 'Ду1000'].map(diameter => (
                      <option key={diameter} value={diameter}>{diameter}</option>
                    ))}
                  </select>
                </div>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <div>
                  <label style={labelStyle}>
                    {t('form.fields.pressure')} 2
                  </label>
                  <select
                    style={inputStyle}
                    value={formData.flangeColdPressure2 || ''}
                    onChange={(e) => handleChange('flangeColdPressure2', e.target.value)}
                  >
                    <option value="">{t('common.placeholder.select')}</option>
                    {['Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100'].map(pressure => (
                      <option key={pressure} value={pressure}>{pressure}</option>
                    ))}
                  </select>
                </div>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <div>
                  <label style={labelStyle}>
                    {t('form.fields.diameter')} 2
                  </label>
                  <select
                    style={inputStyle}
                    value={formData.flangeColdDiameter2 || ''}
                    onChange={(e) => handleChange('flangeColdDiameter2', e.target.value)}
                  >
                    <option value="">{t('common.placeholder.select')}</option>
                    {['Ду25', 'Ду50', 'Ду100', 'Ду150', 'Ду200', 'Ду250', 'Ду300', 'Ду350', 'Ду400', 'Ду450', 'Ду500', 'Ду600', 'Ду700', 'Ду800', 'Ду900', 'Ду1000'].map(diameter => (
                      <option key={diameter} value={diameter}>{diameter}</option>
                    ))}
                  </select>
                </div>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.additionalParams')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.plateThickness')} <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                style={{ ...inputStyle, ...(errors.plateThickness ? errorStyle : {}) }}
                value={formData.plateThickness}
                onChange={(e) => handleChange('plateThickness', parseFloat(e.target.value) || 0)}
                placeholder={t('form.placeholders.plateThickness')}
                min="0.4"
                max="10"
                step="0.1"
              />
              {errors.plateThickness && <div style={errorTextStyle}>{errors.plateThickness}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.claddingThickness')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.claddingThickness || 0}
                onChange={(e) => handleChange('claddingThickness', parseFloat(e.target.value) || 0)}
                placeholder={t('form.placeholders.claddingThickness')}
                min="0"
                max="10"
                step="0.1"
              />
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.drawDepth')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.drawDepth || 0}
                onChange={(e) => handleChange('drawDepth', parseFloat(e.target.value) || 0)}
                placeholder={t('form.placeholders.drawDepth')}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.plateLength')}
              </label>
              <input
                type="number"
                style={{ ...inputStyle, ...(errors.plateLength ? errorStyle : {}) }}
                value={formData.plateLength || 5}
                onChange={(e) => handleChange('plateLength', parseFloat(e.target.value) || 5)}
                placeholder={t('form.placeholders.plateLength')}
                min="1"
                max="50"
                step="0.1"
              />
              {errors.plateLength && <div style={errorTextStyle}>{errors.plateLength}</div>}
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.mountingPanelsCount')}
              </label>
              <input
                type="number"
                style={{ ...inputStyle, ...(errors.mountingPanelsCount ? errorStyle : {}) }}
                value={formData.mountingPanelsCount || 3}
                onChange={(e) => handleChange('mountingPanelsCount', parseInt(e.target.value) || 3)}
                placeholder={t('form.placeholders.mountingPanelsCount')}
                min="1"
                max="10"
                step="1"
              />
              {errors.mountingPanelsCount && <div style={errorTextStyle}>{errors.mountingPanelsCount}</div>}
            </div>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.componentCosts')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.componentCost1')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.componentCost1 || 3300}
                onChange={(e) => handleChange('componentCost1', parseFloat(e.target.value) || 0)}
                placeholder="3300"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.componentCost2')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.componentCost2 || 1750}
                onChange={(e) => handleChange('componentCost2', parseFloat(e.target.value) || 0)}
                placeholder="1750"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.componentCost3')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.componentCost3 || 2800}
                onChange={(e) => handleChange('componentCost3', parseFloat(e.target.value) || 0)}
                placeholder="2800"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.componentCost4')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.componentCost4 || 1200}
                onChange={(e) => handleChange('componentCost4', parseFloat(e.target.value) || 0)}
                placeholder="1200"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.additionalCost1')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.additionalCost1 || 600}
                onChange={(e) => handleChange('additionalCost1', parseFloat(e.target.value) || 0)}
                placeholder="600"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.additionalCost2')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.additionalCost2 || 87}
                onChange={(e) => handleChange('additionalCost2', parseFloat(e.target.value) || 0)}
                placeholder="87"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.additionalCost3')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.additionalCost3 || 50}
                onChange={(e) => handleChange('additionalCost3', parseFloat(e.target.value) || 0)}
                placeholder="50"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.manufacturingCosts')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.processCost1')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.processCost1 || 100}
                onChange={(e) => handleChange('processCost1', parseFloat(e.target.value) || 0)}
                placeholder="100"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.processCost2')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.processCost2 || 100}
                onChange={(e) => handleChange('processCost2', parseFloat(e.target.value) || 0)}
                placeholder="100"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.processCost3')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.processCost3 || 200}
                onChange={(e) => handleChange('processCost3', parseFloat(e.target.value) || 0)}
                placeholder="200"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.processCost4')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.processCost4 || 150}
                onChange={(e) => handleChange('processCost4', parseFloat(e.target.value) || 0)}
                placeholder="150"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.assemblyWork1')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.assemblyWork1 || 1000}
                onChange={(e) => handleChange('assemblyWork1', parseFloat(e.target.value) || 0)}
                placeholder="1000"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.assemblyWork2')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.assemblyWork2 || 1000}
                onChange={(e) => handleChange('assemblyWork2', parseFloat(e.target.value) || 0)}
                placeholder="1000"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.additionalWork1')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.additionalWork1 || 1500}
                onChange={(e) => handleChange('additionalWork1', parseFloat(e.target.value) || 0)}
                placeholder="1500"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.additionalWork2')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.additionalWork2 || 1200}
                onChange={(e) => handleChange('additionalWork2', parseFloat(e.target.value) || 0)}
                placeholder="1200"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.materialSpecialCosts')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.materialCost1')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.materialCost1 || 50000}
                onChange={(e) => handleChange('materialCost1', parseFloat(e.target.value) || 0)}
                placeholder="50000"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.materialCost2')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.materialCost2 || 0}
                onChange={(e) => handleChange('materialCost2', parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.materialCost3')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.materialCost3 || 0}
                onChange={(e) => handleChange('materialCost3', parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.extraCost')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.extraCost || 20000}
                onChange={(e) => handleChange('extraCost', parseFloat(e.target.value) || 0)}
                placeholder="20000"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.specialCost1')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.specialCost1 || 5000}
                onChange={(e) => handleChange('specialCost1', parseFloat(e.target.value) || 0)}
                placeholder="5000"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.specialCost2')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.specialCost2 || 7000}
                onChange={(e) => handleChange('specialCost2', parseFloat(e.target.value) || 0)}
                placeholder="7000"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.specialCost3')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.specialCost3 || 15000}
                onChange={(e) => handleChange('specialCost3', parseFloat(e.target.value) || 0)}
                placeholder="15000"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.specialCost4')}
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.specialCost4 || 30000}
                onChange={(e) => handleChange('specialCost4', parseFloat(e.target.value) || 0)}
                placeholder="30000"
                min="0"
                max="1000000"
                step="1"
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>₽</span>
            </div>
          </Grid.Col>
        </Grid>
        
        {/* ============= SPRINT 3: NEW SECTIONS ============= */}
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleProjectInfo}
            rightSection={<IconChevronDown style={{ transform: projectInfoOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.projectInfo')}
          </Button>
        } />
        <Collapse in={projectInfoOpened}>
          <ProjectInfoSection />
        </Collapse>
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleExtendedSpecs}
            rightSection={<IconChevronDown style={{ transform: extendedSpecsOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.extendedSpecs')}
          </Button>
        } />
        <Collapse in={extendedSpecsOpened}>
          <ExtendedSpecsSection />
        </Collapse>
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleProcessParams}
            rightSection={<IconChevronDown style={{ transform: processParamsOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.processParameters')}
          </Button>
        } />
        <Collapse in={processParamsOpened}>
          <ProcessParametersSection />
        </Collapse>
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleFasteners}
            rightSection={<IconChevronDown style={{ transform: fastenersOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.fasteners')}
          </Button>
        } />
        <Collapse in={fastenersOpened}>
          <FastenerSection />
        </Collapse>
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleManufacturing}
            rightSection={<IconChevronDown style={{ transform: manufacturingOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.manufacturing')}
          </Button>
        } />
        <Collapse in={manufacturingOpened}>
          <ManufacturingSection />
        </Collapse>
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleLogistics}
            rightSection={<IconChevronDown style={{ transform: logisticsOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.logistics')}
          </Button>
        } />
        <Collapse in={logisticsOpened}>
          <LogisticsSection />
        </Collapse>
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleDocumentation}
            rightSection={<IconChevronDown style={{ transform: documentationOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.documentation')}
          </Button>
        } />
        <Collapse in={documentationOpened}>
          <DocumentationSection />
        </Collapse>
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleSpareParts}
            rightSection={<IconChevronDown style={{ transform: sparePartsOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.spareParts')}
          </Button>
        } />
        <Collapse in={sparePartsOpened}>
          <SparePartsSection />
        </Collapse>
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleFinancial}
            rightSection={<IconChevronDown style={{ transform: financialOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.financial')}
          </Button>
        } />
        <Collapse in={financialOpened}>
          <FinancialSection />
        </Collapse>
        
        <Divider label={
          <Button 
            variant="subtle" 
            size="sm"
            onClick={toggleAdditionalCosts}
            rightSection={<IconChevronDown style={{ transform: additionalCostsOpened ? 'rotate(180deg)' : 'none' }} />}
          >
            {t('form.sections.additionalCosts')}
          </Button>
        } />
        <Collapse in={additionalCostsOpened}>
          <AdditionalCostsSection />
        </Collapse>
        
        {Object.keys(errors).length > 0 && (
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            {t('form.fixErrors')}
          </Alert>
        )}
        
        <Group justify="flex-end" mt="md">
          <Button 
            variant="light" 
            onClick={handleReset}
            disabled={!isDirty}
          >
            {t('common.reset')}
          </Button>
          <Button 
            onClick={handleSubmit}
            loading={isCalculating}
          >
            {t('common.calculate')}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};