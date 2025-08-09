# Labor Calculation Dependencies and Complete Cost Chain

## Executive Summary

**Key Finding**: D12 is MISSING from the Excel data but is CRITICAL for labor calculations. This is why F26 = 0.

## 1. LABOR CALCULATION CHAIN DISCOVERED

### Core Labor Formula Chain
```
K13 (standardLaborHours) = 1
K14 = K13 * D12 = 1 * D12 = D12 (but D12 is missing!)
F26 = снабжение!K14 = 0 (because D12 is missing)
J30 = F26 = 0 (labor costs in результат)
```

### Labor Cost Flow to Final Total
```
РЕЗУЛЬТАТ SHEET COST FLOW:
F26 (Labor) = 0 ← снабжение!K14 ← K13 * D12 (MISSING)
    ↓
J30 (Work Total) = F26 = 0
    ↓
U32 (Final Total) = SUM(all cost components including F26)
```

## 2. LABOR-RELATED FIELD MAPPING

### A. Input Fields (снабжение sheet)
| Cell | Field Name | Current Value | Type | Purpose |
|------|------------|---------------|------|---------|
| **A12** | "Принятая цена нормочаса, руб" | ? | Labor Rate | ₽/hour rate |
| **K13** | количество нормо-часов | 1 | Standard Hours | Base labor hours |
| **D12** | **MISSING** | **?** | **Labor Multiplier** | **Critical missing field** |

### B. Calculation Fields
| Cell | Formula | Current Value | Purpose |
|------|---------|---------------|---------|
| **K14** | `=K13*D12` | 0 | Labor cost calculation |
| **F26** | `=снабжение!K14` | 0 | Labor cost in результат |
| **J30** | `=F26` | 0 | Work total |

## 3. MISSING D12 FIELD ANALYSIS

### What D12 Should Represent
Based on the formula `K14 = K13 * D12` and context analysis:

**D12 is likely the LABOR RATE PER HOUR (₽/hour)**

### Evidence for D12 = Labor Rate
1. **A12 = "Принятая цена нормочаса, руб"** - This is the labor rate field
2. **K13 = 1** - Standard labor hours
3. **K14 = K13 * D12** - Hours × Rate = Cost
4. **D12 is missing from Excel data** - Not implemented yet

### Expected Calculation Flow
```
If D12 = 2500 ₽/hour (matching current app default):
K14 = K13 * D12 = 1 * 2500 = 2500 ₽
F26 = снабжение!K14 = 2500 ₽
J30 = F26 = 2500 ₽
```

## 4. CURRENT APPLICATION VS EXCEL MAPPING

### Current App Implementation
```typescript
// SupplyInputForm.tsx
laborRatePerHour: number; // A12 - стоимость нормо-часа
standardLaborHours: number; // K13 - количество нормо-часов

// Default values
laborRatePerHour: 2500,
standardLaborHours: 1,
```

### Calculation Engine Current Implementation
```typescript
// formula-library-complete.ts
const laborRate = ctx.supply?.laborRate || 2500; // ₽/hour
const standardLaborHours = ctx.supply?.standardLaborHours || 8; // hours
```

**Issue**: App uses defaults, Excel expects D12 to exist for the calculation.

## 5. COMPLETE COST INTEGRATION FLOW

### How Labor Integrates into Final Cost

```
FINAL COST BREAKDOWN (U32 = 1,609,136.64):

Material Costs:
├── E26 = 700 (material selection)
├── N26 = 1,274,416.64 (plate package cost)
├── O26 = 0 (additional components)
└── P26 = 81,920 (equipment-specific cost)

Labor & Operations:
├── F26 = 0 ← LABOR (MISSING D12)
├── G26 = 0 (assembly costs)
├── H26 = 0 (complex assembly)
└── Other operation costs = 0

Logistics & Final:
├── X26 = 120,000 (internal logistics)
├── Other costs = 132,000
└── U32 = SUM(all components) = 1,609,136.64
```

**Impact**: Labor costs are completely missing from final calculation due to D12.

## 6. LABOR COST MULTIPLIERS AND COMPLEXITY

### Current Enhanced Labor Implementation
The app has complex labor calculations that aren't reflected in the simple Excel formula:

```typescript
// Enhanced labor with complexity factors
baseLaborCost = standardLaborHours × complexityFactor × laborRate
assemblyLaborCost = plateCount × 0.1 × laborRate  
testingLaborCost = testingHours × laborRate
totalLaborCost = baseLaborCost + assemblyLaborCost + testingLaborCost
```

### Excel Simple Labor Calculation
```
K14 = K13 × D12
Where: K13=1, D12=laborRate
```

## 7. SOLUTION REQUIREMENTS

### A. Fix Missing D12 Field
1. **Add D12 to Excel data** with labor rate value (2500 ₽/hour)
2. **Map D12 to app's laborRatePerHour field**
3. **Update calculation engine** to use D12 properly

### B. Labor Calculation Options

**Option 1: Match Excel Exactly**
```typescript
// Simple Excel matching
laborCost = standardLaborHours × laborRatePerHour
```

**Option 2: Keep Enhanced Logic**
```typescript
// Use D12 as base rate but keep complexity factors
baseLaborRate = D12 || 2500
// Apply existing enhanced calculations
```

### C. Field Mapping Updates
```typescript
// Update interface to properly map D12
interface SupplyParams {
  laborRatePerHour: number;    // D12 (not A12!)
  standardLaborHours: number;  // K13
  // ... other fields
}
```

## 8. DEFAULT VALUES RECOMMENDATIONS

### For D12 (Labor Rate)
- **Recommended**: 2500 ₽/hour
- **Source**: Current app default
- **Range**: 800-5000 ₽/hour (industry standard)

### For Labor Hours Calculation
**Test Scenario**: К4-750 equipment
- K13 = 1 hour (standard)
- D12 = 2500 ₽/hour
- Expected K14 = 2500 ₽
- Expected F26 = 2500 ₽

## 9. IMPACT ON TOTAL COST

### Current Situation (D12 missing)
- Labor cost = 0 ₽
- Total cost = 1,609,136.64 ₽
- **0%** labor component

### With D12 = 2500 ₽/hour
- Labor cost = 2500 ₽  
- Total cost = 1,611,636.64 ₽
- **0.15%** labor component

### With Enhanced Labor (typical project)
- Labor cost = 15,000-50,000 ₽
- **1-3%** of total cost (more realistic)

## 10. NEXT STEPS

1. **CRITICAL**: Add D12 field with 2500 ₽/hour value
2. Update calculation engine to use D12 properly
3. Test labor cost flow: D12 → K14 → F26 → J30 → U32
4. Validate against Excel expected output
5. Consider enhanced vs simple labor calculation approach

## CONCLUSION

The labor calculation chain is well-understood but broken due to missing D12 field. This is a critical issue that makes labor costs zero in all calculations. The fix is straightforward but essential for accurate costing.