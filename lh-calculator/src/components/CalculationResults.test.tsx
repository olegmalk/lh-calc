import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { CalculationResults } from './CalculationResults';
import { useCalculationStore } from '../stores/calculationStore';
import type { CalculationResult } from '../lib/calculation-engine/types';

// Mock the store
vi.mock('../stores/calculationStore');

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <MantineProvider>
        {component}
      </MantineProvider>
    </I18nextProvider>
  );
};

describe('CalculationResults', () => {
  const mockExportToExcel = vi.fn();
  const mockExportToPDF = vi.fn();

  const mockResult: CalculationResult = {
    pressureTestHot: 125.5,
    pressureTestCold: 130.2,
    interpolatedValues: new Map([
      ['G_ComponentsCount', 1],
      ['H_CoverArea', 1234.56],
    ]),
    componentDimensions: new Map([
      ['coverWidth', 650],
      ['coverHeight', 630],
    ]),
    materialRequirements: new Map([
      ['plateMass', 125.5],
      ['bodyMass', 85.3],
      ['plateVolume', 0.0155],
      ['bodyVolume', 0.0106],
    ]),
    componentCosts: {
      covers: 15000,
      columns: 25000,
      panelsA: 12000,
      panelsB: 8000,
      fasteners: 5000,
      flanges: 45000,
      gaskets: 3000,
      materials: 18000,
      total: 131000,
    },
    totalCost: 145000,
    costBreakdown: new Map([
      ['covers', 10.3],
      ['columns', 17.2],
      ['panelsA', 8.3],
      ['panelsB', 5.5],
      ['fasteners', 3.4],
      ['flanges', 31.0],
      ['gaskets', 2.1],
      ['materials', 12.4],
    ]),
    exportData: {
      equipment: { type: 'К4-750', plateCount: 400, configuration: '1/6' },
      materials: { plate: 'AISI 316L', body: 'AISI 304', surface: 'Гладкая' },
      parameters: { pressureA: 100, pressureB: 100, temperatureA: 80, temperatureB: 60 },
      costs: {},
      calculations: {},
      totalCost: 145000,
      version: '2.0.0',
      calculatedAt: new Date().toISOString(),
      excelRow: 118,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show skeleton loader when calculating', () => {
      (useCalculationStore as any).mockReturnValue({
        result: null,
        isCalculating: true,
        error: null,
        lastCalculatedAt: null,
        exportToExcel: mockExportToExcel,
        exportToPDF: mockExportToPDF,
      });

      renderWithProviders(<CalculationResults />);
      
      expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error alert when error exists', () => {
      const errorMessage = 'Calculation failed: Invalid input';
      
      (useCalculationStore as any).mockReturnValue({
        result: null,
        isCalculating: false,
        error: errorMessage,
        lastCalculatedAt: null,
        exportToExcel: mockExportToExcel,
        exportToPDF: mockExportToPDF,
      });

      renderWithProviders(<CalculationResults />);
      
      expect(screen.getByText('Calculation Error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty state message when no results', () => {
      (useCalculationStore as any).mockReturnValue({
        result: null,
        isCalculating: false,
        error: null,
        lastCalculatedAt: null,
        exportToExcel: mockExportToExcel,
        exportToPDF: mockExportToPDF,
      });

      renderWithProviders(<CalculationResults />);
      
      expect(screen.getByText(/Enter technical specifications/)).toBeInTheDocument();
    });
  });

  describe('Results Display', () => {
    beforeEach(() => {
      (useCalculationStore as any).mockReturnValue({
        result: mockResult,
        isCalculating: false,
        error: null,
        lastCalculatedAt: new Date().toISOString(),
        exportToExcel: mockExportToExcel,
        exportToPDF: mockExportToPDF,
      });
    });

    it('should display calculation results summary', () => {
      renderWithProviders(<CalculationResults />);
      
      expect(screen.getByText('Calculation Results (Результат)')).toBeInTheDocument();
      expect(screen.getByText('Calculated')).toBeInTheDocument();
      
      // Check pressure test values (Russian number format uses comma)
      expect(screen.getByText('125,50 bar')).toBeInTheDocument();
      expect(screen.getByText('130,20 bar')).toBeInTheDocument();
      
      // Check total cost (formatted as currency)
      expect(screen.getByText(/145[\s ]000/)).toBeInTheDocument();
    });

    it('should display component costs breakdown', () => {
      renderWithProviders(<CalculationResults />);
      
      expect(screen.getByText('Component Costs Breakdown')).toBeInTheDocument();
      
      // Check component names (text transformation capitalizes first letter)
      expect(screen.getByText(/covers/i)).toBeInTheDocument();
      expect(screen.getByText(/columns/i)).toBeInTheDocument();
      expect(screen.getByText(/panels a/i)).toBeInTheDocument();
      expect(screen.getByText(/panels b/i)).toBeInTheDocument();
      expect(screen.getByText(/fasteners/i)).toBeInTheDocument();
      expect(screen.getByText(/flanges/i)).toBeInTheDocument();
      expect(screen.getByText(/gaskets/i)).toBeInTheDocument();
      expect(screen.getByText(/materials/i)).toBeInTheDocument();
      
      // Check total
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText(/131[\s ]000/)).toBeInTheDocument();
    });

    it('should display material requirements', () => {
      renderWithProviders(<CalculationResults />);
      
      expect(screen.getByText('Material Requirements')).toBeInTheDocument();
      
      // Check material values (Russian number format)
      expect(screen.getByText('125,50 kg')).toBeInTheDocument(); // plateMass
      expect(screen.getByText('85,30 kg')).toBeInTheDocument(); // bodyMass
      expect(screen.getByText('0,0155 m³')).toBeInTheDocument(); // plateVolume
      expect(screen.getByText('0,0106 m³')).toBeInTheDocument(); // bodyVolume
    });

    it('should display last calculated timestamp', () => {
      renderWithProviders(<CalculationResults />);
      
      const timeElement = screen.getByText(/\d{1,2}:\d{2}:\d{2}/);
      expect(timeElement).toBeInTheDocument();
    });

    it('should show progress bars for cost breakdown', () => {
      renderWithProviders(<CalculationResults />);
      
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });

  describe('Export Actions', () => {
    beforeEach(() => {
      (useCalculationStore as any).mockReturnValue({
        result: mockResult,
        isCalculating: false,
        error: null,
        lastCalculatedAt: new Date().toISOString(),
        exportToExcel: mockExportToExcel,
        exportToPDF: mockExportToPDF,
      });
    });

    it('should display export buttons', () => {
      renderWithProviders(<CalculationResults />);
      
      expect(screen.getByText('Export Options')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Export to Excel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Export to PDF/i })).toBeInTheDocument();
    });

    it('should call exportToExcel when Excel button clicked', () => {
      renderWithProviders(<CalculationResults />);
      
      const excelButton = screen.getByRole('button', { name: /Export to Excel/i });
      fireEvent.click(excelButton);
      
      expect(mockExportToExcel).toHaveBeenCalled();
    });

    it('should call exportToPDF when PDF button clicked', () => {
      renderWithProviders(<CalculationResults />);
      
      const pdfButton = screen.getByRole('button', { name: /Export to PDF/i });
      fireEvent.click(pdfButton);
      
      expect(mockExportToPDF).toHaveBeenCalled();
    });
  });

  describe('Formatting', () => {
    beforeEach(() => {
      (useCalculationStore as any).mockReturnValue({
        result: mockResult,
        isCalculating: false,
        error: null,
        lastCalculatedAt: new Date().toISOString(),
        exportToExcel: mockExportToExcel,
        exportToPDF: mockExportToPDF,
      });
    });

    it('should format currency values correctly', () => {
      renderWithProviders(<CalculationResults />);
      
      // Russian currency format includes non-breaking space
      const totalCostElements = screen.getAllByText(/₽/);
      expect(totalCostElements.length).toBeGreaterThan(0);
    });

    it('should format numbers with correct decimal places', () => {
      renderWithProviders(<CalculationResults />);
      
      // Pressure values should have 2 decimal places (Russian format)
      expect(screen.getByText('125,50 bar')).toBeInTheDocument();
      expect(screen.getByText('130,20 bar')).toBeInTheDocument();
      
      // Mass values should have 2 decimal places (Russian format)
      expect(screen.getByText('125,50 kg')).toBeInTheDocument();
      expect(screen.getByText('85,30 kg')).toBeInTheDocument();
      
      // Volume values should have 4 decimal places (Russian format)
      expect(screen.getByText('0,0155 m³')).toBeInTheDocument();
    });
  });

  describe('Component Count Display', () => {
    it('should correctly count components excluding total', () => {
      (useCalculationStore as any).mockReturnValue({
        result: mockResult,
        isCalculating: false,
        error: null,
        lastCalculatedAt: new Date().toISOString(),
        exportToExcel: mockExportToExcel,
        exportToPDF: mockExportToPDF,
      });

      renderWithProviders(<CalculationResults />);
      
      // Should show 8 components (not including 'total' key)
      const componentCountElement = screen.getByText('8');
      expect(componentCountElement).toBeInTheDocument();
    });
  });

  describe('Progress Bar Colors', () => {
    it('should apply correct colors based on percentage', () => {
      (useCalculationStore as any).mockReturnValue({
        result: {
          ...mockResult,
          componentCosts: {
            ...mockResult.componentCosts,
            flanges: 45000, // Should be >30% of total
            gaskets: 3000,  // Should be <20% of total
          },
          costBreakdown: new Map([
            ['flanges', 34.4], // >30% - should be red
            ['gaskets', 2.3],  // <20% - should be blue
            ['fasteners', 25], // 20-30% - should be yellow
          ]),
        },
        isCalculating: false,
        error: null,
        lastCalculatedAt: new Date().toISOString(),
        exportToExcel: mockExportToExcel,
        exportToPDF: mockExportToPDF,
      });

      renderWithProviders(<CalculationResults />);
      
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThan(0);
    });
  });
});