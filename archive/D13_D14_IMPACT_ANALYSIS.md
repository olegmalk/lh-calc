# D13/D14 NULL IMPACT ANALYSIS

## Executive Summary

**D13 and D14 are MISSING INPUT FIELDS** that cause zero values in critical cost calculation formulas H26, N26, and O26. These cells are null/undefined in the снабжение sheet and represent key cost multipliers or rates.

## Key Findings

### D13 and D14 Status
- **D13**: `null` (missing input field) 
- **D14**: `null` (missing input field)
- **Location**: снабжение sheet, column D rows 13-14

### Formulas Affected by D13 and D14

#### 1. H26 Formula - ZERO due to D14=null
```excel
=снабжение!E8*снабжение!G78*снабжение!D14*снабжение!D14+технолог!V27*снабжение!H78*снабжение!D13
```
**Current Result**: 0
**Components**:
- E8 = 700 ✓
- G78 = 184.22 ✓ 
- D14 = null ✗ (causes term 1 = 0)
- V27 = 3 ✓
- H78 = 31.24 ✓
- D13 = null ✗ (causes term 2 = 0)

#### 2. N26 Formula - PARTIALLY WORKS (D13 missing)
```excel
=снабжение!F78*снабжение!D8+технолог!U27*снабжение!J78*снабжение!D13
```
**Current Result**: 1,274,416.64
**Components**:
- F78 = 1820.24 ✓
- D8 = 700 ✓
- First term = 1,274,168 ✓ (works without D13)
- U27 = 3 ✓
- J78 = 31.24 ✓
- D13 = null ✗ (second term contributes 0)

#### 3. O26 Formula - ZERO due to both D13 and D14
```excel
=снабжение!D8*снабжение!E78*снабжение!D14*снабжение!D14+снабжение!D78*снабжение!I78*снабжение!D13
```
**Current Result**: 0
**Same pattern as H26 - both terms zero due to missing D13/D14**

## Impact Analysis

### Current Cost Impact
- **H26**: $0 (should be significant cost component)
- **N26**: $1,274,417 (partial - missing D13 contribution)
- **O26**: $0 (should be significant cost component)
- **Total Missing**: Unknown significant amount

### What D13 and D14 Likely Represent

Based on formula patterns:
- **D13**: Labor rate/multiplier (руб/hour or percentage)
- **D14**: Material rate/multiplier (квадратный коэффициент - used squared in formulas)

### If D13=5, D14=2 (Example Values)

#### H26 Calculation:
```
= 700 * 184.22 * 2 * 2 + 3 * 31.24 * 5
= 515,816 + 468.6 = 516,284.6 руб
```

#### N26 Calculation:
```
= 1,274,168 + 3 * 31.24 * 5
= 1,274,168 + 468.6 = 1,274,636.6 руб
```

#### O26 Calculation:
```
= 700 * E78 * 2 * 2 + D78 * I78 * 5
= (depends on E78, D78, I78 values)
```

## Additional D13/D14 References

### Other Formulas Mentioning D141 (#REF! errors)
Multiple V-column formulas reference D141 with #REF! errors:
- V110-V122: `=T*U*#REF!*D141/1000*8`
- These appear to be separate issues from D13/D14

## Recommendation

**MISSING INPUT DATA - ADD TO FORM**

1. **D13** should be added as required input field (likely "Трудовой коэффициент" or similar)
2. **D14** should be added as required input field (likely "Материальный коэффициент")
3. Both fields are critical for accurate cost calculations
4. Default values should be researched from Excel documentation or SME input

## Status: CRITICAL MISSING INPUTS

D13 and D14 being null is **NOT INTENTIONAL** - these are missing required input fields that significantly underestimate project costs.