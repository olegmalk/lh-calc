import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { TechnicalInputForm } from './TechnicalInputForm';
import { useInputStore } from '../stores/inputStore';
import { useCalculationStore } from '../stores/calculationStore';
import { useMaterialStore } from '../stores/materialStore';

// Mock the stores
vi.mock('../stores/inputStore');
vi.mock('../stores/calculationStore');
vi.mock('../stores/materialStore');

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  );
};

describe('TechnicalInputForm', () => {
  const mockUpdateMultiple = vi.fn();
  const mockCalculate = vi.fn();
  const mockReset = vi.fn();

  const defaultInputs = {
    equipmentType: 'К4-750',
    modelCode: 'К4-750',
    plateConfiguration: '1/6',
    plateCount: 400,
    pressureA: 100,
    pressureB: 100,
    temperatureA: 80,
    temperatureB: 60,
    materialPlate: 'AISI 316L',
    materialBody: 'AISI 304',
    surfaceType: 'Гладкая',
    plateThickness: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup store mocks
    (useInputStore as any).mockReturnValue({
      inputs: defaultInputs,
      updateMultiple: mockUpdateMultiple,
      isDirty: false,
      reset: mockReset,
    });

    (useCalculationStore as any).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: false,
    });

    (useMaterialStore as any).mockReturnValue({
      availableMaterials: {
        plate: ['AISI 316L', 'AISI 304'],
        body: ['AISI 316L', 'AISI 304', 'Ст3'],
      },
    });

    // Reset the store's getState
    useInputStore.getState = vi.fn().mockReturnValue({
      reset: mockReset,
    });
  });

  describe('Rendering', () => {
    it('should render all form fields', () => {
      renderWithProviders(<TechnicalInputForm />);
      
      expect(screen.getByText('Technical Specifications (Технолог)')).toBeInTheDocument();
      expect(screen.getByLabelText(/Equipment Type/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Model Code/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Plate Configuration/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Plate Count/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Pressure A/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Pressure B/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Temperature A/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Temperature B/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Plate Material/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Body Material/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Surface Type/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Components A/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Components B/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Plate Thickness/)).toBeInTheDocument();
    });

    it('should display unsaved changes badge when dirty', () => {
      (useInputStore as any).mockReturnValue({
        inputs: defaultInputs,
        updateMultiple: mockUpdateMultiple,
        isDirty: true,
        reset: mockReset,
      });

      renderWithProviders(<TechnicalInputForm />);
      
      expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    });

    it('should render with correct initial values', () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const plateCountInput = screen.getByLabelText(/Plate Count/) as HTMLInputElement;
      expect(plateCountInput.value).toBe('400');
      
      const modelCodeInput = screen.getByLabelText(/Model Code/) as HTMLInputElement;
      expect(modelCodeInput.value).toBe('К4-750');
    });
  });

  describe('Form Submission', () => {
    it('should call calculate on form submission', async () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(mockUpdateMultiple).toHaveBeenCalledWith(defaultInputs);
        expect(mockCalculate).toHaveBeenCalledWith(defaultInputs);
      });
    });

    it('should show loading state during calculation', () => {
      (useCalculationStore as any).mockReturnValue({
        calculate: mockCalculate,
        isCalculating: true,
      });

      renderWithProviders(<TechnicalInputForm />);
      
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      expect(calculateButton).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Form Reset', () => {
    it('should reset form on reset button click', () => {
      (useInputStore as any).mockReturnValue({
        inputs: defaultInputs,
        updateMultiple: mockUpdateMultiple,
        isDirty: true,
        reset: mockReset,
      });

      renderWithProviders(<TechnicalInputForm />);
      
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      fireEvent.click(resetButton);
      
      expect(mockReset).toHaveBeenCalled();
    });

    it('should disable reset button when not dirty', () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const resetButton = screen.getByRole('button', { name: /Reset/i });
      expect(resetButton).toBeDisabled();
    });
  });

  describe('Validation', () => {
    it('should validate plate count minimum', async () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const plateCountInput = screen.getByLabelText(/Plate Count/) as HTMLInputElement;
      
      await userEvent.clear(plateCountInput);
      await userEvent.type(plateCountInput, '5');
      
      // Try to submit
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
      
      // Should not call calculate due to validation
      expect(mockCalculate).not.toHaveBeenCalled();
    });

    it('should validate pressure values', async () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const pressureAInput = screen.getByLabelText(/Pressure A/) as HTMLInputElement;
      
      await userEvent.clear(pressureAInput);
      await userEvent.type(pressureAInput, '-10');
      
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
      
      expect(mockCalculate).not.toHaveBeenCalled();
    });

    it('should validate temperature range', async () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const tempAInput = screen.getByLabelText(/Temperature A/) as HTMLInputElement;
      
      await userEvent.clear(tempAInput);
      await userEvent.type(tempAInput, '250'); // Above max
      
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
      
      expect(mockCalculate).not.toHaveBeenCalled();
    });

    it('should validate plate thickness', async () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const thicknessInput = screen.getByLabelText(/Plate Thickness/) as HTMLInputElement;
      
      await userEvent.clear(thicknessInput);
      await userEvent.type(thicknessInput, '0.3'); // Below min
      
      const calculateButton = screen.getByRole('button', { name: /Calculate/i });
      fireEvent.click(calculateButton);
      
      expect(mockCalculate).not.toHaveBeenCalled();
    });
  });

  describe('Input Changes', () => {
    it('should update form values when inputs change', async () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const plateCountInput = screen.getByLabelText(/Plate Count/) as HTMLInputElement;
      
      await userEvent.clear(plateCountInput);
      await userEvent.type(plateCountInput, '500');
      
      expect(plateCountInput.value).toBe('500');
    });

    it('should handle equipment type selection', async () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const equipmentSelect = screen.getByLabelText(/Equipment Type/);
      
      fireEvent.click(equipmentSelect);
      
      // Wait for dropdown to appear
      await waitFor(() => {
        const option = screen.getByText('К4-150');
        fireEvent.click(option);
      });
    });
  });

  describe('Material Selection', () => {
    it('should display available materials from store', () => {
      renderWithProviders(<TechnicalInputForm />);
      
      const plateMaterialSelect = screen.getByLabelText(/Plate Material/);
      fireEvent.click(plateMaterialSelect);
      
      expect(screen.getByText('AISI 316L')).toBeInTheDocument();
      expect(screen.getByText('AISI 304')).toBeInTheDocument();
    });
  });
});