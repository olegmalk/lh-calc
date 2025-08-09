# Excel Processor API for Bitrix24

RESTful API service for processing heat exchanger cost calculations from Bitrix24 using Excel templates.

## Overview

This API accepts engineering and supply parameters from Bitrix24, processes them through Excel calculations, and returns detailed cost breakdowns. It handles 134+ input fields and provides comprehensive validation and error handling.

## API Specification

- **OpenAPI Spec**: `openapi.yaml`
- **TypeScript Types**: `src/types/api-contract.ts`
- **Base URL**: `http://localhost:3000` (development)

## Single Endpoint

### POST /api/calculate

Processes cost calculation with engineering and supply parameters.

**Request Body**: All 134 fields from Excel template
**Response**: Calculated costs and component breakdowns

## Field Categories

### Required Engineering Parameters (технолог sheet)
- `tech_D27_type`: Equipment type number
- `tech_E27_weightType`: Equipment position (e.g., "Е-113")
- `tech_H27_quantityType`: Process specification (e.g., "1/6")
- `tech_I27_quantityType`: Quantity of plates
- `tech_J27_quantityType`: Pressure hot side (bar)
- `tech_K27_quantity`: Pressure cold side (bar) 
- `tech_L27_quantity`: Temperature hot side (°C)
- `tech_M27_material`: Temperature cold side (°C)
- `tech_T27_materialThicknessType`: Drawing depth (mm)

### Required Supply Parameters (снабжение sheet)
- `sup_F2_parameter`: Material code selection
- `sup_D8_priceMaterial`: Flow part material price per kg
- `sup_E8_priceMaterial`: Cladding material price per kg
- `sup_K13_costQuantityNormTotal`: Standard hours count
- `sup_P13_costQuantityMaterialNorm`: Internal logistics cost
- `sup_D78_massThickness`: Stainless steel thickness

### Price Input Fields (Green cells)
134 string and number fields for material costs, processing costs, hardware prices, etc.

### Calculated Results (Yellow cells)
- `tech_F27_quantityType`: Calculated quantity
- `tech_G27_quantityType`: Calculated quantity 2
- `tech_P27_materialType`: Calculated material
- `tech_Q27_materialType`: Calculated material 2
- `tech_R27_materialThicknessType`: Calculated thickness
- `tech_S27_materialThicknessType`: Calculated thickness 2
- `tech_U27_materialThicknessType`: Calculated thickness numeric

## Example Request

```json
{
  "tech_D27_type": 1,
  "tech_E27_weightType": "Е-113", 
  "tech_H27_quantityType": "1/6",
  "tech_I27_quantityType": 400,
  "tech_J27_quantityType": 22,
  "tech_K27_quantity": 22,
  "tech_L27_quantity": 100,
  "tech_M27_material": 100,
  "tech_T27_materialThicknessType": 5,
  "tech_V27_thicknessType": 3,
  
  "sup_F2_parameter": "0000",
  "sup_D8_priceMaterial": 700,
  "sup_E8_priceMaterial": 700,
  "sup_K13_costQuantityNormTotal": 1,
  "sup_P13_costQuantityMaterialNorm": 120000,
  "sup_D78_massThickness": 3,
  
  "sup_D43_priceTotal": 3300,
  "sup_D44_price": 1750,
  "sup_D45_price": 2800,
  "sup_D46_price": 1200
}
```

## Example Response

```json
{
  "success": true,
  "results": {
    "calculated_values": {
      "tech_F27_quantityType": "calculated_quantity",
      "tech_G27_quantityType": "calculated_quantity_2",
      "tech_P27_materialType": "calculated_material", 
      "tech_Q27_materialType": "calculated_material_2",
      "tech_R27_materialThicknessType": "calculated_thickness",
      "tech_S27_materialThicknessType": "calculated_thickness_2",
      "tech_U27_materialThicknessType": 123.45
    },
    "total_cost": 245680.50,
    "component_costs": {
      "materials": 156780.25,
      "processing": 45890.15, 
      "hardware": 23010.10,
      "other": 20000.00
    }
  },
  "request_id": "req_20250809_12345",
  "processing_time_ms": 1250
}
```

## Error Responses

### Validation Errors (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field_errors": {
      "tech_D27_type": "This field is required",
      "sup_D8_priceMaterial": "Must be a valid number"
    },
    "missing_required_fields": ["tech_E27_weightType"]
  },
  "request_id": "req_20250809_12346"
}
```

### Excel Processing Errors (422)
```json
{
  "success": false,
  "error": "Excel calculation failed", 
  "details": {
    "excel_errors": ["Division by zero in cell D45"],
    "failed_cells": ["снабжение!D45", "технолог!F27"]
  },
  "request_id": "req_20250809_12347"
}
```

## CORS Configuration

Configured for Bitrix24 integration:
- **Allowed Origins**: `*.bitrix24.com`, `localhost`
- **Allowed Methods**: `GET`, `POST`, `OPTIONS`
- **Allowed Headers**: `Content-Type`, `Authorization`, `X-Requested-With`
- **Credentials**: Enabled
- **Max Age**: 3600 seconds

## Validation Rules

### Material Codes
`["0000", "06ХН28МДТ", "09Г2С", "12Х18Н10Т", "20ХН3А", "30ХМА", "40Х"]`

### Pressure Ratings
`["Ру6", "Ру10", "Ру16", "Ру25", "Ру40", "Ру63", "Ру100", "Ру160"]`

### Diameter Codes  
`["Ду25", "Ду32", "Ду40", "Ду50", "Ду65", "Ду80", "Ду100", "Ду125", "Ду150", "Ду200", "Ду250", "Ду300", "Ду350", "Ду400", "Ду450", "Ду600", "Ду800", "Ду1000"]`

### Thread Specifications
`["М16", "М18", "М20", "М22", "М24", "М27", "М30", "М33", "М36", "М39", "М42", "М48"]`

## Field Patterns

- **Equipment Code**: `^[ЕК][-0-9А-Я*]*$` (e.g., "Е-113", "К4-750")
- **Fraction**: `^\d+\/\d+$` (e.g., "1/6", "2/8")  
- **Numbers**: Positive numbers with minimum 0
- **Strings**: Variable length text fields

## Implementation Notes

1. All numeric fields must be >= 0
2. Required fields will fail validation if null/undefined/empty
3. Optional fields can be omitted or null
4. Enum fields are validated against allowed values
5. Pattern fields are validated with regex
6. Excel cells are mapped via field-names-contract.ts
7. Request IDs are auto-generated for tracking
8. Processing time is measured in milliseconds

## Usage in Bitrix24

1. Create webhook or REST API call to `/api/calculate`
2. Map Bitrix24 form fields to API contract fields
3. Handle success/error responses appropriately
4. Display calculated costs to users
5. Store request_id for debugging/tracking