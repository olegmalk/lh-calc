import React, { useState } from 'react';
import { Container, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconDeviceFloppy, IconCalculator } from '@tabler/icons-react';
import { SupplyInputForm, type SupplyInputData } from '../components/SupplyInputForm';
import { notifications } from '@mantine/notifications';

// Default supply parameters
const DEFAULT_SUPPLY_DATA: SupplyInputData = {
  // Pricing Policy (Director)
  plateMaterialPricePerKg: 700,
  claddingMaterialPricePerKg: 700,
  columnCoverMaterialPricePerKg: 750,
  panelMaterialPricePerKg: 650,
  laborRatePerHour: 2500,
  cuttingCostPerMeter: 150,
  laborRate: 2500, // D12 - стоимость работы ₽/час  
  laborCoefficient: 1.2, // D13 - коэффициент труда
  materialCoefficient: 1.05, // D14 - коэффициент материала
  
  // Logistics (Supply)
  internalLogisticsCost: 120000,
  standardLaborHours: 1,
  panelFastenerQuantity: 88,
  
  // Correction Factors (Supply)
  claddingCuttingCorrection: 1.05,
  columnCuttingCorrection: 1.03,
  coverCuttingCorrection: 1.02,
  panelCuttingCorrection: 1.04,
};

const SupplyParameters: React.FC = () => {
  const { t } = useTranslation();
  const [supplyData, setSupplyData] = useState<SupplyInputData>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('lh-calculator-supply-params');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        console.error('Failed to load supply parameters from localStorage');
      }
    }
    return DEFAULT_SUPPLY_DATA;
  });
  
  // For demo, we'll use 'admin' role. In production, this would come from auth context
  const userRole = 'admin'; // or 'director' | 'supply' | 'technologist'
  
  const handleSave = () => {
    try {
      localStorage.setItem('lh-calculator-supply-params', JSON.stringify(supplyData));
      notifications.show({
        title: t('common.success'),
        message: t('supply.saveSuccess'),
        color: 'green',
      });
    } catch {
      notifications.show({
        title: t('common.error'),
        message: t('supply.saveFailed'),
        color: 'red',
      });
    }
  };
  
  const handleReset = () => {
    setSupplyData(DEFAULT_SUPPLY_DATA);
    notifications.show({
      title: t('common.info'),
      message: t('supply.resetSuccess'),
      color: 'blue',
    });
  };
  
  return (
    <Container size="xl" py="md">
      <SupplyInputForm
        data={supplyData}
        onChange={setSupplyData}
        userRole={userRole}
      />
      
      <Group justify="space-between" mt="xl">
        <Button
          variant="default"
          onClick={handleReset}
        >
          {t('common.reset')}
        </Button>
        
        <Group>
          <Button
            leftSection={<IconDeviceFloppy size="1rem" />}
            onClick={handleSave}
            color="blue"
          >
            {t('common.save')}
          </Button>
          
          <Button
            leftSection={<IconCalculator size="1rem" />}
            onClick={() => {
              handleSave();
              // Navigate to calculations page
              window.location.href = '/dashboard';
            }}
            color="green"
          >
            {t('supply.saveAndCalculate')}
          </Button>
        </Group>
      </Group>
    </Container>
  );
};

export default SupplyParameters;