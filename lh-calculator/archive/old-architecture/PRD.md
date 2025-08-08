# Product Requirements Document

## LH Heat Exchanger Cost Calculator

**Version**: 1.0  
**Date**: 2025-08-06  
**Document Type**: Technical Specification

---

## Executive Summary

The LH Heat Exchanger Cost Calculator is a web-based application that replaces a complex Excel calculator containing 962 formulas across 3 sheets. The system calculates manufacturing costs for heat exchangers based on technical specifications, material properties, and component requirements.

### Key Metrics

- **Input Parameters**: 25+ technical specifications
- **Calculation Complexity**: 962 Excel formulas → 200+ calculation functions
- **Material Types**: AISI 316L, 09Г2С, various densities
- **Component Categories**: 8 major types (covers, columns, panels, flanges, etc.)

---

## Business Requirements

### BR-001: Cost Calculation Accuracy

Replace Excel calculator with 100% mathematical equivalence for all 962 formulas.

### BR-002: Multi-Sheet Logic

Implement three-layer calculation flow:

1. **Input Layer** (технолог): Technical specifications
2. **Processing Layer** (снабжение): Component calculations
3. **Results Layer** (результат): Cost aggregation

### BR-003: Material Database

Support material specifications with temperature-pressure matrices:

- 09Г2С stress values by temperature (20°C-400°C)
- AISI 316L properties
- Density calculations

### BR-004: Bitrix24 Integration

Export calculated results to Bitrix24 CRM system.

---

## Functional Requirements

### F-001: Input Management System

#### F-001.1: Technical Parameters Input

**Fields**:

- Position number (`E27`: "Е-113")
- Supply type (`F27`: "Целый ТА")
- Heat exchanger size (`G27`: "К4-750")
- Flow configuration (`H27`: "1/6")
- Plate count (`I27`: 400)
- Pressures: Hot side (`J27`: 22 bar), Cold side (`K27`: 22 bar)
- Temperatures: Hot side (`L27`: 100°C), Cold side (`M27`: 100°C)
- Test pressures: Hot side (`N27`), Cold side (`O27`)

#### F-001.2: Material Selection

**Named Range Lookups**:

- Plate materials (`материал_пластин`: AS47:AS54)
- Housing materials (`материал_корпуса`: AU47:AU54)
- Plate thickness (`толщина_пластины`: AL47:AL53)
- Heat exchanger types (`типоразмеры_К4`: AM45:AM52)

#### F-001.3: Validation Rules

- Temperature range: 20°C - 400°C
- Pressure limits based on material specifications
- Plate count limits by heat exchanger type

### F-002: Pressure Calculation Engine

#### F-002.1: Test Pressure Calculation

**Formula Implementation**:

```
AI73 = CEILING.PRECISE(1.25 * AG73 * AA60 / AE73, 0.01)
AJ73 = CEILING.PRECISE(1.25 * AH73 * AA60 / AF73, 0.01)
```

#### F-002.2: Material Stress Lookup

**Temperature-Stress Matrix**:

- Temperature lookup: `MATCH(temperature, Z60:Z68)`
- Stress value: `VLOOKUP(temp, Z60:AA68, 2)`
- Safety factor: 1.25x base calculation

### F-003: Component Cost Calculator

#### F-003.1: Panel Cost Calculation

**Complex Conditional Logic**:

```javascript
// Formula G22 equivalent
if (heatExchangerType === "К4-750") {
  return plateArea * density + baseWeight + additionalWeight;
} else {
  return plateArea * density * factor + baseWeight + additionalWeight;
}
```

#### F-003.2: Housing Cost Calculation

**Formula M22 Implementation**:

```javascript
if (heatExchangerType === "К4-750") {
  return housingMass * density * (factor + 0.03) + baseCost + extras;
} else {
  return housingMass * density * factor + baseCost + extras;
}
```

#### F-003.3: Total Cost Aggregation

**Results Sheet Logic** (`результат`):

- Plate costs: `N26 = F78*D8 + U27*J78*D13`
- Housing costs: `O26 = D8*E78*D14*D14 + D78*I78*D13`
- Component costs: Variable by heat exchanger type (P26 complex IF chain)

### F-004: Results Export System

#### F-004.1: Cost Breakdown Display

**Output Categories**:

- Material costs by component type
- Manufacturing costs
- Total project cost
- Component specifications

#### F-004.2: Bitrix24 Integration

- Export calculated results via API
- Map Excel outputs to Bitrix24 fields
- Maintain calculation audit trail

---

## Data Model

### Core Entities

#### HeatExchanger

```typescript
interface HeatExchanger {
  positionNumber: string; // E27
  supplyType: string; // F27
  heatExchangerType: string; // G27 (К4-750, К4-1200, etc.)
  flowConfig: string; // H27
  plateCount: number; // I27
  hotSidePressure: number; // J27
  coldSidePressure: number; // K27
  hotSideTemp: number; // L27
  coldSideTemp: number; // M27
  testPressureHot: number; // N27 (calculated)
  testPressureCold: number; // O27 (calculated)
}
```

#### MaterialSpec

```typescript
interface MaterialSpec {
  plateMaterial: string; // P27 (AISI 316L)
  housingMaterial: string; // R27 (09Г2С)
  surfaceType: string; // S27
  drawDepth: number; // T27
  plateThickness: number; // U27
  claddingThickness: number; // V27
}
```

#### ComponentCosts

```typescript
interface ComponentCosts {
  plateCost: number; // N26 calculation
  housingCost: number; // O26 calculation
  componentCost: number; // P26 calculation
  manufacturingCost: number; // Aggregated
  totalCost: number; // Final sum
}
```

### Reference Data Tables

#### TemperatureStressMatrix

```typescript
interface TempStressData {
  temperature: number; // Z60:Z68 range
  stress09G2S: number; // AA60:AA68 range
  materialFactor: number; // Lookup coefficient
}
```

#### HeatExchangerTypes

```typescript
interface HETypeData {
  typeName: string; // AM45:AM52 (К4-750, К4-1200, etc.)
  plateAreaFactor: number; // AO45:AO52
  housingMassFactor: number; // AP45:AP52
  costMultiplier: number; // Calculation modifier
}
```

---

## Calculation Requirements

### CR-001: Critical Formula Implementations

#### Pressure Test Calculations

**Priority**: Critical

```javascript
// AI73 equivalent - Hot side test pressure
function calculateHotTestPressure(calcStress, allowableStress, safetyFactor) {
  return (
    Math.ceil(((1.25 * calcStress * safetyFactor) / allowableStress) * 100) /
    100
  );
}

// AJ73 equivalent - Cold side test pressure
function calculateColdTestPressure(calcStress, allowableStress, safetyFactor) {
  return (
    Math.ceil(((1.25 * calcStress * safetyFactor) / allowableStress) * 100) /
    100
  );
}
```

#### Component Cost Calculations

**Priority**: Critical

```javascript
// G22 equivalent - Panel cost calculation
function calculatePanelCost(
  heatExchangerType,
  plateArea,
  density,
  baseWeight,
  additionalWeight,
  factor,
) {
  if (heatExchangerType === lookupValue("К4-750")) {
    return plateArea * density + baseWeight + additionalWeight;
  } else {
    return plateArea * density * factor + baseWeight + additionalWeight;
  }
}

// M22 equivalent - Housing cost calculation
function calculateHousingCost(
  heatExchangerType,
  housingMass,
  density,
  factor,
  baseCost,
  extras,
) {
  if (heatExchangerType === lookupValue("К4-750")) {
    return housingMass * density * (factor + 0.03) + baseCost + extras;
  } else {
    return housingMass * density * factor + baseCost + extras;
  }
}
```

#### Material Property Lookups

**Priority**: High

```javascript
// Temperature-stress lookup (VLOOKUP equivalent)
function getStressByTemperature(temperature) {
  const tempIndex = temperatureStressMatrix.findIndex(
    (row) => row.temperature >= temperature,
  );
  return temperatureStressMatrix[tempIndex]?.stress || defaultStress;
}

// Heat exchanger type lookup
function getHETypeFactors(heatExchangerType) {
  return heatExchangerTypeMatrix.find(
    (type) => type.typeName === heatExchangerType,
  );
}
```

### CR-002: Cross-Sheet Reference Resolution

#### Input → Processing Flow

- Map all `технолог` sheet inputs to calculation variables
- Maintain exact cell reference equivalents (e.g., `технолог!P27` → `input.plateMaterial`)

#### Processing → Results Flow

- Implement all `снабжение` sheet calculations
- Aggregate component costs into final results
- Maintain calculation audit trail

### CR-003: Named Range Implementation

#### Material Selection Lists

```javascript
const materialPlates = ["AISI 316L", "AISI 304", "AISI 321"]; // AS47:AS54
const materialHousing = ["09Г2С", "Ст3", "20К"]; // AU47:AU54
const heatExchangerTypes = ["К4-750", "К4-1200", "К4-1000*500"]; // AM45:AM52
```

#### Validation Ranges

- Plate thickness: 0.5-3.0mm (AL47:AL53)
- Surface types: 4 options (AZ36:AZ40)
- Supply types: 3 options (AL39:AL41)

---

## User Stories

### Epic 1: Technical Input Management

**As a** process engineer  
**I want to** input heat exchanger specifications  
**So that** I can generate accurate cost calculations

**Acceptance Criteria**:

- Input validation for all 25+ parameters
- Material selection from predefined lists
- Real-time parameter validation
- Save/load input configurations

### Epic 2: Cost Calculation Engine

**As a** cost analyst  
**I want to** execute complex calculations automatically  
**So that** I get consistent, accurate pricing

**Acceptance Criteria**:

- 100% formula equivalence with Excel
- Sub-second calculation performance
- Detailed cost breakdown by component
- Calculation audit trail

### Epic 3: Results Export & Integration

**As a** sales manager  
**I want to** export results to Bitrix24  
**So that** I can create customer quotes efficiently

**Acceptance Criteria**:

- One-click export to Bitrix24
- Formatted cost breakdown reports
- Integration with existing CRM workflows
- Quote generation templates

### Epic 4: Material Database Management

**As a** technical administrator  
**I want to** maintain material specifications  
**So that** calculations remain current with supplier data

**Acceptance Criteria**:

- CRUD operations for material properties
- Temperature-stress matrix updates
- Material cost updates
- Data validation and backup

---

## Success Criteria

### SC-001: Calculation Accuracy

- **Target**: 100% equivalence with Excel results
- **Measurement**: Automated test suite comparing 100+ calculation scenarios
- **Timeline**: Achieved before production release

### SC-002: Performance

- **Target**: Calculations complete within 2 seconds
- **Measurement**: 95th percentile response time
- **Timeline**: Maintained in production

### SC-003: User Adoption

- **Target**: 90% of quotes generated via web app within 3 months
- **Measurement**: Usage analytics vs Excel usage
- **Timeline**: 3 months post-deployment

### SC-004: Integration Success

- **Target**: 100% successful exports to Bitrix24
- **Measurement**: Export success rate monitoring
- **Timeline**: Operational requirement

---

## Technical Constraints

### TC-001: Formula Precision

All calculations must maintain Excel's floating-point precision and rounding behavior.

### TC-002: Named Range Support

System must support Excel named range equivalents for material lookups and validation.

### TC-003: Cross-Sheet Dependencies

Maintain the three-sheet calculation flow with proper dependency management.

### TC-004: Bitrix24 API Compatibility

Export format must match Bitrix24's expected data structure and field mappings.

---

## Risk Assessment

### High-Risk Items

1. **Complex Formula Translation**: 962 formulas require exact mathematical equivalence
2. **Material Property Accuracy**: Temperature-stress matrices must be precisely implemented
3. **Cross-Sheet Reference Resolution**: Complex inter-sheet dependencies

### Mitigation Strategies

1. **Comprehensive Test Suite**: Compare outputs for 100+ input combinations
2. **Incremental Implementation**: Build and validate formula groups iteratively
3. **Excel Parallel Testing**: Maintain Excel version for validation during development

---

## Appendices

### A. Critical Formula Reference

- AI73/AJ73: Test pressure calculations
- G22/M22: Component cost conditionals
- N26/O26/P26: Final cost aggregations
- Temperature-stress VLOOKUP matrices

### B. Named Range Mappings

- материал_пластин → plateMaterialOptions
- материал_корпуса → housingMaterialOptions
- типоразмеры_К4 → heatExchangerTypes
- толщина_пластины → plateThicknessOptions

### C. Integration Requirements

- Bitrix24 API endpoints and authentication
- CRM field mappings for cost data
- Quote template requirements
