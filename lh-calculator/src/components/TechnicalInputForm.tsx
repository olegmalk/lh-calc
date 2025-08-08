import React, { useEffect } from 'react';
import {
  Card,
  Grid,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  Stack,
  Title,
  Divider,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInputStore } from '../stores/inputStore';
import { useCalculationStore } from '../stores/calculationStore';
import { useMaterialStore } from '../stores/materialStore';
import { NAMED_RANGES } from '../lib/calculation-engine/constants';
import type { HeatExchangerInput } from '../lib/calculation-engine/types';

export const TechnicalInputForm: React.FC = () => {
  const { inputs, updateMultiple, isDirty } = useInputStore();
  const { calculate, isCalculating } = useCalculationStore();
  const { availableMaterials } = useMaterialStore();
  
  const form = useForm<HeatExchangerInput>({
    initialValues: inputs,
    validate: {
      plateCount: (value) => {
        if (value < 10) return 'Minimum 10 plates required';
        if (value > 1000) return 'Maximum 1000 plates allowed';
        return null;
      },
      pressureA: (value) => {
        if (value < 0) return 'Pressure must be positive';
        if (value > 400) return 'Maximum pressure 400 bar';
        return null;
      },
      pressureB: (value) => {
        if (value < 0) return 'Pressure must be positive';
        if (value > 400) return 'Maximum pressure 400 bar';
        return null;
      },
      temperatureA: (value) => {
        if (value < -40) return 'Minimum temperature -40°C';
        if (value > 200) return 'Maximum temperature 200°C';
        return null;
      },
      temperatureB: (value) => {
        if (value < -40) return 'Minimum temperature -40°C';
        if (value > 200) return 'Maximum temperature 200°C';
        return null;
      },
      plateThickness: (value) => {
        if (value < 0.4) return 'Minimum thickness 0.4mm';
        if (value > 10) return 'Maximum thickness 10mm';
        return null;
      },
    },
  });
  
  // Sync form with store - only update when inputs actually change
  useEffect(() => {
    form.setValues(inputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]); // Don't include form in deps to avoid infinite loop
  
  // Update store when form changes
  const handleFieldChange = (field: keyof HeatExchangerInput, value: string | number | null | undefined) => {
    form.setFieldValue(field, value ?? undefined);
    // Update store to trigger isDirty
    useInputStore.getState().updateInput(field, value ?? undefined);
  };
  
  const handleSubmit = async (values: HeatExchangerInput) => {
    updateMultiple(values);
    await calculate(values);
  };
  
  const handleReset = () => {
    form.reset();
    useInputStore.getState().reset();
  };
  
  return (
    <Card shadow="sm" padding="lg" radius="md">
      <Stack gap="md">
          <Group justify="space-between">
            <Title order={3}>Technical Specifications (Технолог)</Title>
            {isDirty && <Badge color="yellow">Unsaved changes</Badge>}
          </Group>
          
          <Divider label="Equipment Configuration" />
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Select
                label="Equipment Type (Типоразмер)"
                placeholder="Select type"
                data={NAMED_RANGES.типоразмеры_К4}
                value={form.values.equipmentType}
                onChange={(value) => handleFieldChange('equipmentType', value || '')}
                error={form.errors.equipmentType}
                required
                searchable={false}
                data-testid="equipment-type-select"
                comboboxProps={{ withinPortal: false }}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <TextInput
                label="Model Code"
                placeholder="К4-750"
                value={form.values.modelCode}
                onChange={(event) => handleFieldChange('modelCode', event.currentTarget.value)}
                error={form.errors.modelCode}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Select
                label="Plate Configuration"
                placeholder="1/6"
                data={['1/6', '1/4', '1/3', '1/2', '2/3', '3/4']}
                value={form.values.plateConfiguration}
                onChange={(value) => handleFieldChange('plateConfiguration', value || '')}
                error={form.errors.plateConfiguration}
                required
                searchable={false}
                data-testid="plate-config-select"
                comboboxProps={{ withinPortal: false }}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <NumberInput
                label="Plate Count (Количество пластин)"
                placeholder="400"
                min={10}
                max={1000}
                step={10}
                value={form.values.plateCount}
                onChange={(value) => handleFieldChange('plateCount', value)}
                error={form.errors.plateCount}
                required
              />
            </Grid.Col>
          </Grid>
          
          <Divider label="Operating Parameters" />
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <NumberInput
                label="Pressure A (bar)"
                placeholder="100"
                min={0}
                max={400}
                decimalScale={1}
                step={10}
                value={form.values.pressureA}
                onChange={(value) => handleFieldChange('pressureA', value)}
                error={form.errors.pressureA}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <NumberInput
                label="Pressure B (bar)"
                placeholder="100"
                min={0}
                max={400}
                decimalScale={1}
                step={10}
                value={form.values.pressureB}
                onChange={(value) => handleFieldChange('pressureB', value)}
                error={form.errors.pressureB}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <NumberInput
                label="Temperature A (°C)"
                placeholder="80"
                min={-40}
                max={200}
                step={5}
                value={form.values.temperatureA}
                onChange={(value) => handleFieldChange('temperatureA', value)}
                error={form.errors.temperatureA}
                required
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <NumberInput
                label="Temperature B (°C)"
                placeholder="60"
                min={-40}
                max={200}
                step={5}
                value={form.values.temperatureB}
                onChange={(value) => handleFieldChange('temperatureB', value)}
                error={form.errors.temperatureB}
                required
              />
            </Grid.Col>
          </Grid>
          
          <Divider label="Materials" />
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Select
                label="Plate Material (Материал пластин)"
                placeholder="Select material"
                data={availableMaterials.plate}
                value={form.values.materialPlate}
                onChange={(value) => handleFieldChange('materialPlate', value || '')}
                error={form.errors.materialPlate}
                required
                searchable={false}
                data-testid="plate-material-select"
                comboboxProps={{ withinPortal: false }}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Select
                label="Body Material (Материал корпуса)"
                placeholder="Select material"
                data={availableMaterials.body}
                value={form.values.materialBody}
                onChange={(value) => handleFieldChange('materialBody', value || '')}
                error={form.errors.materialBody}
                required
                searchable={false}
                data-testid="body-material-select"
                comboboxProps={{ withinPortal: false }}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <Select
                label="Surface Type (Тип поверхности)"
                placeholder="Select type"
                data={NAMED_RANGES.тип_поверхности}
                value={form.values.surfaceType}
                onChange={(value) => handleFieldChange('surfaceType', value || '')}
                error={form.errors.surfaceType}
                required
                searchable={false}
                data-testid="surface-type-select"
                comboboxProps={{ withinPortal: false }}
              />
            </Grid.Col>
          </Grid>
          
          <Divider label="Additional Parameters" />
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
              <NumberInput
                label="Plate Thickness (mm)"
                placeholder="3"
                min={0.4}
                max={10}
                decimalScale={1}
                step={0.1}
                value={form.values.plateThickness}
                onChange={(value) => handleFieldChange('plateThickness', value)}
                error={form.errors.plateThickness}
                required
              />
            </Grid.Col>
          </Grid>
          
          <Group justify="flex-end" mt="md">
            <Button 
              variant="light" 
              onClick={handleReset}
              disabled={!isDirty}
            >
              Reset
            </Button>
            <Button 
              onClick={() => form.onSubmit(handleSubmit)()}
              loading={isCalculating}
              disabled={!form.isValid()}
            >
              Calculate
            </Button>
          </Group>
        </Stack>
    </Card>
  );
};