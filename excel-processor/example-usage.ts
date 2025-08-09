/**
 * Example usage of the Excel Processor API
 * Demonstrates how to prepare requests and handle responses
 */

import type {
  ExcelCalculationRequest,
  ExcelCalculationResponse,
  ErrorResponse,
  CellReference,
  buildCellRef
} from './contract';

// Example 1: Basic calculation request
const basicRequest: ExcelCalculationRequest = {
  inputs: {
    // Green cells (Supply inputs)
    'снабжение!D8': 700,      // Material price 1
    'снабжение!E8': 700,      // Material price 2
    'снабжение!D10': 500,     // Material cost 3
    'снабжение!D11': 450,     // Material cost 4
    'снабжение!K13': 1,       // Quantity
    'снабжение!P13': 120000,  // Internal logistics

    // Orange cells (Engineering inputs)
    'снабжение!D9': '09Г2С',  // Material specification
    
    // Additional supply inputs (sample)
    'снабжение!D16': 1200,
    'снабжение!D17': 850,
    'снабжение!D18': 950,
    'снабжение!D19': 1100,
    'снабжение!D20': 780,

    // Technology sheet inputs
    'технолог!D8': 2.5,
    'технолог!D9': 1.8,
    'технолог!D10': 3.2,
    'технолог!F8': 'Type-A',
    'технолог!F9': 'Standard'
  },
  options: {
    returnFormulas: false,
    returnIntermediateValues: false
  }
};

// Example 2: Request with role-based grouping
const roleBasedRequest: ExcelCalculationRequest = {
  inputs: {},  // Can be empty when using inputsByRole
  inputsByRole: {
    supply: {
      // All green cell values
      materialPrices: [700, 700, 500, 450],
      quantity: 1,
      logistics: 120000,
      componentCosts: {
        D16: 1200,
        D17: 850,
        D18: 950,
        D19: 1100,
        D20: 780
      }
    },
    engineering: {
      // All orange cell values
      materialSpec: '09Г2С',
      designParams: {
        thickness: 12,
        diameter: 1200,
        length: 6000,
        pressure: 1.6
      }
    }
  },
  options: {
    returnFormulas: true,
    returnIntermediateValues: true
  }
};

// Example 3: Validation-only request
const validationRequest: ExcelCalculationRequest = {
  inputs: {
    'снабжение!D8': 700,
    'снабжение!E8': -100,  // Invalid: negative price
    'снабжение!D9': 'InvalidMaterial',  // Invalid: not in enum
    'снабжение!K13': 0,  // Invalid: must be >= 1
  },
  options: {
    validateOnly: true
  }
};

// Example 4: Request specific result cells
const specificResultsRequest: ExcelCalculationRequest = {
  inputs: {
    // ... input values
  },
  options: {
    resultCells: [
      'результат !B4',  // Total materials
      'результат !C4',  // Total labor
      'результат !D4',  // Total overhead
      'результат !E4',  // Grand total
      'результат !E59'  // Final price with margin
    ]
  }
};

// Example response handling
async function handleCalculation(request: ExcelCalculationRequest) {
  try {
    const response = await fetch('http://localhost:3000/api/excel/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    const data = await response.json() as ExcelCalculationResponse | ErrorResponse;

    if (!data.success) {
      // Handle error response
      const error = data as ErrorResponse;
      console.error(`Error ${error.error.code}: ${error.error.message}`);
      
      if (error.error.code === 'VALIDATION_FAILED' && error.error.details) {
        console.error('Validation errors:', error.error.details);
      }
      return;
    }

    // Handle successful response
    const result = data as ExcelCalculationResponse;
    
    // Check validation
    if (!result.validation.valid) {
      console.warn('Validation warnings:', result.validation.warnings);
      result.validation.errors.forEach(err => {
        console.error(`Cell ${err.cell}: ${err.message}`);
      });
    }

    // Process results
    console.log('Calculation Results:');
    console.log('===================');
    console.log(`Total Cost: ${result.results.totals.grandTotal.toLocaleString('ru-RU')} ₽`);
    console.log(`  Materials: ${result.results.summary.materials.toLocaleString('ru-RU')} ₽`);
    console.log(`  Labor: ${result.results.summary.labor.toLocaleString('ru-RU')} ₽`);
    console.log(`  Overhead: ${result.results.summary.overhead.toLocaleString('ru-RU')} ₽`);
    
    console.log('\nComponent Breakdown:');
    console.log(`  Corpus: ${result.results.corpus.total.total.toLocaleString('ru-RU')} ₽`);
    console.log(`  Core: ${result.results.core.total.total.toLocaleString('ru-RU')} ₽`);
    console.log(`  Connections: ${result.results.connections.total.total.toLocaleString('ru-RU')} ₽`);
    console.log(`  Additional: ${result.results.additional.total.total.toLocaleString('ru-RU')} ₽`);
    
    console.log('\nFinal Price (with VAT & margin):', 
      result.results.totals.finalPrice.toLocaleString('ru-RU'), '₽');

    // Show processing stats
    console.log('\nProcessing Stats:');
    console.log(`  Time: ${result.metadata.processingTimeMs}ms`);
    console.log(`  Formulas evaluated: ${result.metadata.formulasEvaluated}`);
    console.log(`  Cells modified: ${result.metadata.cellsModified}`);

  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Example: Building requests programmatically
class ExcelRequestBuilder {
  private inputs: Record<string, any> = {};

  // Add supply inputs (green cells)
  addSupplyInput(cell: string, value: number): this {
    this.inputs[`снабжение!${cell}`] = value;
    return this;
  }

  // Add engineering input (orange cells)
  addEngineeringInput(cell: string, value: string | number): this {
    this.inputs[`снабжение!${cell}`] = value;
    return this;
  }

  // Add technology input
  addTechnologyInput(cell: string, value: any): this {
    this.inputs[`технолог!${cell}`] = value;
    return this;
  }

  // Add material prices in batch
  setMaterialPrices(prices: number[]): this {
    const cells = ['D8', 'E8', 'D10', 'D11'];
    prices.forEach((price, index) => {
      if (cells[index]) {
        this.addSupplyInput(cells[index], price);
      }
    });
    return this;
  }

  // Set material specification
  setMaterialSpec(spec: string): this {
    return this.addEngineeringInput('D9', spec);
  }

  // Set quantity
  setQuantity(qty: number): this {
    return this.addSupplyInput('K13', qty);
  }

  // Build final request
  build(options?: ExcelCalculationRequest['options']): ExcelCalculationRequest {
    return {
      inputs: this.inputs,
      options
    };
  }
}

// Usage of builder
const request = new ExcelRequestBuilder()
  .setMaterialPrices([700, 700, 500, 450])
  .setMaterialSpec('09Г2С')
  .setQuantity(1)
  .addSupplyInput('P13', 120000)
  .addTechnologyInput('D8', 2.5)
  .build({
    returnFormulas: false,
    returnIntermediateValues: false
  });

// Example: Batch processing multiple scenarios
async function runScenarios() {
  const scenarios = [
    { name: 'Low Cost', prices: [500, 500, 400, 350] },
    { name: 'Medium Cost', prices: [700, 700, 500, 450] },
    { name: 'High Cost', prices: [900, 900, 600, 550] }
  ];

  const results = await Promise.all(
    scenarios.map(async scenario => {
      const request = new ExcelRequestBuilder()
        .setMaterialPrices(scenario.prices)
        .setMaterialSpec('09Г2С')
        .setQuantity(1)
        .build();

      const response = await fetch('/api/excel/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const data = await response.json() as ExcelCalculationResponse;
      return {
        scenario: scenario.name,
        totalCost: data.results.totals.grandTotal,
        materialCost: data.results.summary.materials
      };
    })
  );

  // Compare scenarios
  console.table(results);
}

// Export examples for testing
export {
  basicRequest,
  roleBasedRequest,
  validationRequest,
  specificResultsRequest,
  handleCalculation,
  ExcelRequestBuilder,
  runScenarios
};