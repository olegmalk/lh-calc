# Excel Processor Service

Node.js service for processing LH Calculator Excel files with colored cell inputs and formula calculations.

## Overview

This service provides a REST API to:
1. Accept input values for colored cells (green, orange, yellow)
2. Process Excel formulas and VLOOKUPs
3. Return calculated results from the "результат" sheet
4. Validate inputs against business rules

## Files Structure

```
excel-processor/
├── contract.ts           # Complete TypeScript API contract
├── api-contract.md       # Human-readable API documentation
├── example-usage.ts      # Usage examples and client code
├── cell-analysis.json    # Raw cell metadata (143 colored cells)
├── api-contract.json     # Structured field definitions
└── README.md            # This file
```

## Colored Cells Mapping

### 🟢 Green Cells (99 fields) - Supply Team Inputs
- Material prices and costs
- Quantities and logistics
- Component costs
- Owned by Supply/Procurement team

### 🟠 Orange Cells (33 fields) - Engineering Inputs  
- Material specifications
- Technical parameters
- Design specifications
- Owned by Engineering team

### 🟡 Yellow Cells (11 fields) - Computed Values
- VLOOKUP results
- Intermediate calculations
- Auto-computed based on other inputs

## API Endpoint

```
POST /api/excel/calculate
```

### Request
```json
{
  "inputs": {
    "снабжение!D8": 700,
    "снабжение!E8": 700,
    "снабжение!D9": "09Г2С",
    "снабжение!K13": 1,
    "снабжение!P13": 120000
  }
}
```

### Response
```json
{
  "success": true,
  "results": {
    "totalCost": 2500000,
    "materialCost": 1500000,
    "laborCost": 800000,
    "corpus": { "total": 800000 },
    "core": { "total": 1100000 },
    "connections": { "total": 400000 }
  }
}
```

## Implementation Approach

### Option 1: Standalone Express Service
```bash
npm init
npm install express exceljs joi cors
npm install -D typescript @types/node @types/express
```

### Option 2: Next.js API Route
Integrate with existing React application at `/api/excel/calculate`

### Excel Processing Flow
1. Load template `calc.xlsx`
2. Create temporary copy
3. Set colored cell values
4. Force recalculation
5. Extract results from "результат " sheet
6. Return JSON response
7. Clean up temp file

## Key Design Decisions

### Why Use Excel as Calculation Engine?
- Preserves existing business logic
- Maintains VLOOKUP tables
- No risk of calculation discrepancies
- Gradual migration path available

### Performance Targets
- < 500ms response time
- Support 100 concurrent requests
- Cache template in memory
- Use worker threads for CPU-intensive operations

### Security Considerations
- Input validation against schema
- Cell reference sanitization
- Formula injection prevention
- Rate limiting per client
- Isolated temp file handling

## Next Steps

1. **Choose implementation approach** (Express vs Next.js)
2. **Set up project structure**
3. **Implement Excel processing logic**
4. **Add validation layer**
5. **Create test suite**
6. **Deploy service**
7. **Integrate with frontend**

## Cell Count Summary

- **Total colored cells**: 143
- **Green (Supply)**: 99
- **Orange (Engineering)**: 33  
- **Yellow (Computed)**: 11
- **Result cells**: ~150 (in "результат " sheet)

## Dependencies

### Required npm packages
- `exceljs` or `xlsx-populate` - Excel manipulation
- `express` - REST API framework (if standalone)
- `joi` or `zod` - Input validation
- `winston` - Logging
- `dotenv` - Environment configuration

### System Requirements
- Node.js 18+
- 512MB RAM minimum
- Write access to temp directory
- Excel file template (`calc.xlsx`)