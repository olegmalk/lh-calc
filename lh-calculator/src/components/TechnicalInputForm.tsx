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
import { useTranslation } from 'react-i18next';
import { useInputStore } from '../stores/inputStore';
import { useCalculationStore } from '../stores/calculationStore';
import { useMaterialStore } from '../stores/materialStore';
import { NAMED_RANGES, EQUIPMENT_SPECS } from '../lib/calculation-engine/constants';
import { HeatExchangerInput } from '../lib/calculation-engine/types';

export const TechnicalInputForm: React.FC = () => {
  const { t } = useTranslation();
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
  
  // Sync form with store
  useEffect(() => {
    form.setValues(inputs);
  }, [inputs]);
  
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
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <Group position="apart">
            <Title order={3}>Technical Specifications (Технолог)</Title>
            {isDirty && <Badge color="yellow">Unsaved changes</Badge>}
          </Group>
          
          <Divider label="Equipment Configuration" />
          
          <Grid>
            <Grid.Col xs={12} sm={6} md={4}>
              <Select
                label="Equipment Type (Типоразмер)"
                placeholder="Select type"
                data={NAMED_RANGES.типоразмеры_К4}
                {...form.getInputProps('equipmentType')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={4}>
              <TextInput
                label="Model Code"
                placeholder="К4-750"
                {...form.getInputProps('modelCode')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={4}>
              <Select
                label="Plate Configuration"
                placeholder="1/6"
                data={['1/6', '1/4', '1/3', '1/2', '2/3', '3/4']}
                {...form.getInputProps('plateConfiguration')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={4}>
              <NumberInput
                label="Plate Count (Количество пластин)"
                placeholder="400"
                min={10}
                max={1000}
                step={10}
                {...form.getInputProps('plateCount')}
                required
              />
            </Grid.Col>
          </Grid>
          
          <Divider label="Operating Parameters" />
          
          <Grid>
            <Grid.Col xs={12} sm={6} md={3}>
              <NumberInput
                label="Pressure A (bar)"
                placeholder="100"
                min={0}
                max={400}
                precision={1}
                step={10}
                {...form.getInputProps('pressureA')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={3}>
              <NumberInput
                label="Pressure B (bar)"
                placeholder="100"
                min={0}
                max={400}
                precision={1}
                step={10}
                {...form.getInputProps('pressureB')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={3}>
              <NumberInput
                label="Temperature A (°C)"
                placeholder="80"
                min={-40}
                max={200}
                step={5}
                {...form.getInputProps('temperatureA')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={3}>
              <NumberInput
                label="Temperature B (°C)"
                placeholder="60"
                min={-40}
                max={200}
                step={5}
                {...form.getInputProps('temperatureB')}
                required
              />
            </Grid.Col>
          </Grid>
          
          <Divider label="Materials" />
          
          <Grid>
            <Grid.Col xs={12} sm={6} md={4}>
              <Select
                label="Plate Material (Материал пластин)"
                placeholder="Select material"
                data={availableMaterials.plate}
                {...form.getInputProps('materialPlate')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={4}>
              <Select
                label="Body Material (Материал корпуса)"
                placeholder="Select material"
                data={availableMaterials.body}
                {...form.getInputProps('materialBody')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={4}>
              <Select
                label="Surface Type (Тип поверхности)"
                placeholder="Select type"
                data={NAMED_RANGES.тип_поверхности}
                {...form.getInputProps('surfaceType')}
                required
              />
            </Grid.Col>
          </Grid>
          
          <Divider label="Additional Parameters" />
          
          <Grid>
            <Grid.Col xs={12} sm={6} md={4}>
              <NumberInput
                label="Components A"
                placeholder="5"
                min={0}
                max={20}
                {...form.getInputProps('componentsA')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={4}>
              <NumberInput
                label="Components B"
                placeholder="1"
                min={0}
                max={20}
                {...form.getInputProps('componentsB')}
                required
              />
            </Grid.Col>
            
            <Grid.Col xs={12} sm={6} md={4}>
              <NumberInput
                label="Plate Thickness (mm)"
                placeholder="3"
                min={0.4}
                max={10}
                precision={1}
                step={0.1}
                {...form.getInputProps('plateThickness')}
                required
              />
            </Grid.Col>
          </Grid>
          
          <Group position="right" mt="md">
            <Button 
              variant="light" 
              onClick={handleReset}
              disabled={!isDirty}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              loading={isCalculating}
              disabled={!form.isValid()}
            >
              Calculate
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
};