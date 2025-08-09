# Excel Processor API Contract

## Overview
Node.js service for processing LH Calculator Excel file with colored cell inputs and formula calculations.

## Endpoint: POST /api/excel/calculate

### Request Structure

```typescript
interface ExcelCalculationRequest {
  // Green cells (FF92D050) - Supply/Technologist inputs
  green: {
    [cellRef: string]: number | string | null;
  };
  
  // Orange cells (FFFFC000) - Engineering inputs
  orange: {
    [cellRef: string]: number | string | null;
  };
  
  // Yellow cells (FFFFFF00) - Dropdown/selection values
  yellow: {
    [cellRef: string]: string | null;
  };
  
  // Optional: specify which results to extract
  resultCells?: string[];
}
```

### Input Fields Metadata

#### Green Cells (Supply Team - 99 fields)
Primary input fields for material costs and specifications:

| Cell | Field | Type | Description | Validation |
|------|-------|------|-------------|------------|
| снабжение!D8 | material_price_1 | number | Material price 1 | min: 0 |
| снабжение!E8 | material_price_2 | number | Material price 2 | min: 0 |
| снабжение!D10 | material_cost_3 | number | Material cost 3 | min: 0 |
| снабжение!D11 | material_cost_4 | number | Material cost 4 | min: 0 |
| снабжение!K13 | quantity | number | Quantity | min: 1 |
| снабжение!P13 | logistics_cost | number | Internal logistics | min: 0 |
| снабжение!D16-D150 | component_costs | number | Various component costs | min: 0 |
| технолог!D8-D27 | tech_params | number | Technical parameters | varies |

#### Orange Cells (Engineering Team - 33 fields)
Engineering specifications and parameters:

| Cell | Field | Type | Description | Validation |
|------|-------|------|-------------|------------|
| снабжение!D9 | material_spec | string | Material specification | enum: ["09Г2С", "Ст3", ...] |
| снабжение!F16-F150 | engineering_specs | mixed | Engineering parameters | varies |
| технолог!F8-F27 | tech_specs | mixed | Technical specifications | varies |

#### Yellow Cells (Computed/Reference - 11 fields)
Intermediate calculations and lookups:

| Cell | Field | Type | Description |
|------|-------|------|-------------|
| снабжение!E16-E26 | vlookup_results | formula | VLOOKUP computed values |
| технолог!E8-E11 | computed_values | formula | Calculated parameters |

### Response Structure

```typescript
interface ExcelCalculationResponse {
  success: boolean;
  
  // Results from "результат " sheet
  results: {
    // Cost breakdown
    totalCost: number;
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    
    // Component costs
    corpus: {
      materials: number;
      labor: number;
      total: number;
    };
    core: {
      materials: number;
      labor: number;
      total: number;
    };
    connections: {
      materials: number;
      labor: number;
      total: number;
    };
    
    // Additional results
    [key: string]: any;
  };
  
  // All calculated cells with formulas
  calculatedCells: {
    [cellRef: string]: {
      value: any;
      formula: string;
      sheet: string;
    };
  };
  
  // Validation results
  validation: {
    valid: boolean;
    errors: Array<{
      cell: string;
      message: string;
      expectedType: string;
      receivedValue: any;
    }>;
    warnings: Array<{
      cell: string;
      message: string;
    }>;
  };
  
  // Metadata
  meta: {
    processedAt: string;
    excelVersion: string;
    formulasEvaluated: number;
    processingTimeMs: number;
  };
}
```

### Result Cells from "результат " Sheet

Key output cells to extract:

| Cell Range | Content | Type |
|------------|---------|------|
| B3:E3 | Header labels | string |
| B4:E4 | Main cost categories | number |
| B7:E15 | Corpus breakdown | number |
| B18:E26 | Core breakdown | number |
| B29:E37 | Connections breakdown | number |
| B40:E48 | Additional components | number |
| B51:E59 | Summary totals | number |

### Error Responses

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Error codes
enum ErrorCode {
  INVALID_INPUT = "INVALID_INPUT",
  EXCEL_PROCESSING_ERROR = "EXCEL_PROCESSING_ERROR",
  FORMULA_EVALUATION_ERROR = "FORMULA_EVALUATION_ERROR",
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
  TIMEOUT = "TIMEOUT"
}
```

### Example Request

```json
{
  "green": {
    "снабжение!D8": 700,
    "снабжение!E8": 700,
    "снабжение!D10": 500,
    "снабжение!D11": 450,
    "снабжение!K13": 1,
    "снабжение!P13": 120000
  },
  "orange": {
    "снабжение!D9": "09Г2С",
    "снабжение!F16": "Type-A"
  },
  "yellow": {},
  "resultCells": ["результат !B4", "результат !C4", "результат !D4", "результат !E4"]
}
```

### Example Response

```json
{
  "success": true,
  "results": {
    "totalCost": 2500000,
    "materialCost": 1500000,
    "laborCost": 800000,
    "overheadCost": 200000,
    "corpus": {
      "materials": 500000,
      "labor": 300000,
      "total": 800000
    },
    "core": {
      "materials": 700000,
      "labor": 400000,
      "total": 1100000
    },
    "connections": {
      "materials": 300000,
      "labor": 100000,
      "total": 400000
    }
  },
  "calculatedCells": {
    "снабжение!H26": {
      "value": 15000,
      "formula": "=D26*E26*F26",
      "sheet": "снабжение"
    }
  },
  "validation": {
    "valid": true,
    "errors": [],
    "warnings": [
      {
        "cell": "снабжение!D12",
        "message": "No value provided, using default 0"
      }
    ]
  },
  "meta": {
    "processedAt": "2024-01-15T10:30:00Z",
    "excelVersion": "calc.xlsx v7",
    "formulasEvaluated": 450,
    "processingTimeMs": 250
  }
}
```

## Implementation Notes

### Excel Processing Strategy

1. **Copy Template**: Create temporary copy of `calc.xlsx`
2. **Set Values**: Write colored cell values maintaining types
3. **Force Recalculation**: Trigger Excel formula recalculation
4. **Extract Results**: Read computed values from результат sheet
5. **Cleanup**: Delete temporary file

### Libraries Required

- `exceljs` or `xlsx-populate` - Excel manipulation with formula support
- `express` - REST API framework
- `joi` or `zod` - Input validation
- `winston` - Logging

### Performance Considerations

- Cache Excel template in memory
- Use worker threads for parallel processing
- Implement request queuing for high load
- Target < 500ms response time

### Security

- Validate all inputs against schema
- Sanitize cell references
- Prevent formula injection
- Rate limiting per client
- File system isolation for temp files