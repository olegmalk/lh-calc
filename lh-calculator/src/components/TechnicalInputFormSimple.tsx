import React, { useState, useEffect } from 'react';
import { Card, Grid, Button, Group, Stack, Title, Divider, Badge, Alert } from '@mantine/core';
import { IconAlertCircle, IconCalculator } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';
import { useCalculationStore } from '../stores/calculationStore';
import { useMaterialStore } from '../stores/materialStore';
import { NAMED_RANGES } from '../lib/calculation-engine/constants';
import { calc_AI73_TestPressureHot, calc_AJ73_TestPressureCold } from '../lib/calculation-engine/formula-library-complete';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';

export const TechnicalInputFormSimple: React.FC = () => {
  const { t } = useTranslation();
  const { inputs, updateInput, updateMultiple, isDirty, reset } = useInputStore();
  const { calculate, isCalculating } = useCalculationStore();
  const { availableMaterials } = useMaterialStore();
  
  // Local form state
  const [formData, setFormData] = useState<HeatExchangerInput>(inputs);
  const [errors, setErrors] = useState<Partial<Record<keyof HeatExchangerInput, string>>>({});
  const [calculatedTestPressures, setCalculatedTestPressures] = useState({ hot: 0, cold: 0 });
  
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
  }, [formData.pressureA, formData.pressureB, formData.temperatureA, formData.temperatureB, formData.materialPlate]);
  
  // Handle field changes
  const handleChange = (field: keyof HeatExchangerInput, value: string | number) => {
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
  
  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: 500,
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
            <div>
              <label style={labelStyle}>
                {t('form.fields.equipmentTypeWithNote')} <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                data-testid="equipment-type-select"
                style={{ ...inputStyle, ...(errors.equipmentType ? errorStyle : {}) }}
                value={formData.equipmentType}
                onChange={(e) => handleChange('equipmentType', e.target.value)}
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
              <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '5px'}}>
                <IconCalculator size={14} />
                {t('form.fields.testPressureHot')}
              </label>
              <input
                type="number"
                style={{...inputStyle, backgroundColor: '#f8f9fa', cursor: 'not-allowed'}}
                value={calculatedTestPressures.hot.toFixed(2)}
                readOnly
                placeholder="Авто-расчет"
              />
            </div>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div>
              <label style={{...labelStyle, display: 'flex', alignItems: 'center', gap: '5px'}}>
                <IconCalculator size={14} />
                {t('form.fields.testPressureCold')}
              </label>
              <input
                type="number"
                style={{...inputStyle, backgroundColor: '#f8f9fa', cursor: 'not-allowed'}}
                value={calculatedTestPressures.cold.toFixed(2)}
                readOnly
                placeholder="Авто-расчет"
              />
            </div>
          </Grid.Col>
        </Grid>
        
        <Divider label={t('form.sections.materials')} />
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
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
          
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <div>
              <label style={labelStyle}>
                {t('form.fields.bodyMaterialWithNote')} <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                data-testid="body-material-select"
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
        </Grid>
        
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