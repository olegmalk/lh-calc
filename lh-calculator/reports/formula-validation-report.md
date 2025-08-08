# Formula Validation Report - Heat Exchanger Calculator

**Date:** 2025-08-07  
**Analysis:** Excel Formulas vs TypeScript Implementation

## Executive Summary

This report identifies critical unit conversion errors in the heat exchanger cost calculator that are producing incorrect calculation results, potentially inflating costs by factors of thousands.

### Key Findings

1. **CRITICAL: Missing Unit Conversions** - Multiple formulas are missing proper unit scaling factors
2. **Division by 1,000,000 Issues** - Inconsistent application of volume-to-mass conversions
3. **Material Cost Calculation Errors** - Price per kg multipliers applied incorrectly
4. **Expected vs Actual Cost Range** - Results should be 100K-10M rubles, not billions/trillions

## Detailed Analysis

### 1. CRITICAL DISCOVERY: Wrong Density Values

#### Excel vs TypeScript Density Comparison

**Excel Formula Analysis:**

- **G93**: `=VLOOKUP(технолог!P27,AS47:AT53,2,)` - looks up material density
- **AT47**: `=7880/10^6` = **0.007880** (Ст3)
- **AT48**: `=8080/10^6` = **0.008080** (AISI 316L)
- **AT49**: **0.00889**, **AT50**: **0.0045**, **AT51**: **0.0074**, etc.

**TypeScript Implementation:**

```typescript
// constants.ts - WRONG VALUES
MATERIAL_DENSITIES = {
  'AISI 316L': 8080,  // Should be 0.008080
  'AISI 304': 8030,   // Should be 0.008030
  'Ст3': 7880,       // Should be 0.007880
}

// engine-v2.ts - WRONG VALUES
{ name: 'AISI 316L', density: 8080, pricePerKg: 850 },
{ name: 'AISI 304', density: 8030, pricePerKg: 750 },
{ name: 'Ст3', density: 7880, pricePerKg: 120 },
```

**THE CRITICAL ERROR:**

- **Excel uses density × 10⁻⁶** (e.g., 0.008080 for AISI 316L)
- **TypeScript uses raw density** (e.g., 8080 for AISI 316L)
- **This creates a 1,000,000× scaling error!**

### 2. Excel Formula Pattern Analysis

**Actual Excel Formulas (rows 110-122):**

```excel
H110: =(E110+15)*(F110+15)*G110*$G$93/1000*(технолог!$I$27)
L110: =J110*K110*$D$78*$G$93/1000*4
O110: =M110*N110*$D$78*$G$93/1000*4
R110: =P110*Q110*$D$78*$G$93/1000*2
```

**Where:**

- **$G$93** = density × 10⁻⁶ (e.g., 0.008080)
- **$D$78** = thickness (e.g., 3mm)
- **Division by 1000** = additional scaling factor
- **Final calculation:** `volume × density_scaled × thickness / 1000`

### 3. TypeScript Formula Errors

**Current Implementation Issues:**

```typescript
// Lines 70, 105, 125, 152 - WRONG SCALING
return (
  ((width * height * ctx.inputs.componentsB * density) / 1000000) *
  ctx.inputs.plateCount
);
return ((J * K * ctx.inputs.plateThickness * density) / 1000000) * 4;
return ((M * N * ctx.inputs.plateThickness * density) / 1000000) * 4;
return ((P * Q * ctx.inputs.plateThickness * density) / 1000000) * 2;
```

**Problems:**

1. **Wrong density values** (8080 instead of 0.008080)
2. **Missing `/1000` scaling** that Excel applies
3. **Incorrect unit chain:** dimensions × wrong_density / 1000000

### 2. Material Cost Calculation Issues

#### Problem: Incorrect Price Application

**Location:** `/src/lib/calculation-engine/engine-v2.ts` lines 149-157

```typescript
// Current Implementation - POTENTIALLY INCORRECT UNITS
const costs: ComponentCosts = {
  covers: (calculations.get("H_CoverArea") || 0) * pricePerKg,
  columns: (calculations.get("L_ComponentVolume") || 0) * pricePerKg * 1.2,
  panelsA: (calculations.get("O_SecondaryVolume") || 0) * pricePerKg,
  panelsB: (calculations.get("R_AreaCalculation") || 0) * pricePerKg,
  // ...
};
```

**Issue:** If the calculation functions return mass in kg, then multiplying by pricePerKg (850₽/kg) is correct. However, if they return volume or other units, this creates incorrect scaling.

### 3. Suspected Formula Mismatches

#### Excel vs TypeScript Comparison

| Formula           | Excel Expected | TypeScript Result    | Issue                    |
| ----------------- | -------------- | -------------------- | ------------------------ |
| H_CoverArea       | Volume in m³?  | Mass × plateCount    | Unit mismatch            |
| L_ComponentVolume | Volume × 4     | Mass × 4             | Missing price conversion |
| Material costs    | ~100K-10M ₽    | Potentially billions | Scale factor error       |

### 4. Evidence from Constants

**Material Prices (engine-v2.ts:42-47):**

```typescript
{ name: 'AISI 316L', density: 8080, pricePerKg: 850 },
{ name: 'AISI 304', density: 8030, pricePerKg: 750 },
{ name: 'Ст3', density: 7880, pricePerKg: 120 },
```

**Equipment Dimensions (constants.ts:48):**

```typescript
'К4-750': { width: 600, height: 580, maxPlates: 750, row: 118 },
```

**Expected Result for К4-750:**

- Width: 600mm, Height: 580mm
- 750 max plates, typical order: 400 plates
- Material: AISI 316L at 850₽/kg
- **Expected total cost:** 100,000 - 10,000,000 ₽

## Critical Issues Found

### Issue #1: DENSITY VALUES - 1,000,000× ERROR

**Severity:** CRITICAL  
**Files:** `constants.ts`, `engine-v2.ts`, `materialStore.ts`

**Excel uses:** `density/10^6` (e.g., AISI 316L = 0.008080)  
**TypeScript uses:** `density` (e.g., AISI 316L = 8080)

**Impact:** All volume×density calculations are off by factor of 1,000,000!

**Fix Required:**

```typescript
// constants.ts - MUST CHANGE
MATERIAL_DENSITIES = {
  "AISI 316L": 0.00808, // NOT 8080
  "AISI 304": 0.00803, // NOT 8030
  Ст3: 0.00788, // NOT 7880
};
```

### Issue #2: MISSING /1000 SCALING FACTOR

**Severity:** HIGH
**Files:** All volume calculation functions

**Excel pattern:** `volume × density_scaled / 1000`  
**TypeScript pattern:** `volume × density / 1000000`

**The TypeScript `/1000000` partially compensates for wrong density, but creates new errors.**

### Issue #3: INCORRECT FORMULA STRUCTURE

**Severity:** HIGH
**Files:** `formula-library-complete.ts`

**Excel:** `=J110*K110*$D$78*$G$93/1000*4`  
**TypeScript:** `J * K * thickness * density / 1000000 * 4`

**Problems:**

- Excel uses separate thickness ($D$78) and density ($G$93) references
- TypeScript conflates these into a single density calculation
- Missing proper unit management

## Recommendations

### Immediate Actions (Priority 1)

1. **URGENT: Fix Density Values**

   ```typescript
   // Update ALL files with density definitions:
   // constants.ts, engine-v2.ts, materialStore.ts

   MATERIAL_DENSITIES = {
     "AISI 316L": 0.00808, // Excel: =8080/10^6
     "AISI 304": 0.00803, // Excel: =8030/10^6
     Ст3: 0.00788, // Excel: =7880/10^6
     "09Г2С": 0.00788, // Same as Ст3
     "12Х18Н10Т": 0.00808, // Same as AISI 316L
   };
   ```

2. **Update Formula Structure**

   ```typescript
   // Change from: volume * density / 1000000
   // Change to:   volume * thickness * density / 1000
   // To match Excel: J110*K110*$D$78*$G$93/1000*4
   ```

3. **Add Excel-Exact Test Cases**
   - Test К4-750 with exact Excel inputs
   - Validate intermediate calculations (not just final result)
   - Expected: total cost around 145K₽ should remain similar

### Medium-term Actions (Priority 2)

1. **Excel Formula Deep-Dive**
   - Compare exact Excel formulas for rows 110-122
   - Validate all intermediate calculations
   - Document unit conversions in Excel

2. **Add Unit Type Safety**
   ```typescript
   type VolumeM3 = number;
   type MassKg = number;
   type CostRubles = number;
   ```

### Long-term Actions (Priority 3)

1. **Complete Formula Library Audit**
   - Review all 53 calculations
   - Add comprehensive documentation
   - Create Excel-to-TypeScript mapping table

## Test Cases for Validation

### Test Case 1: К4-750 Standard Configuration

```typescript
const inputs = {
  equipmentType: "К4-750",
  plateCount: 400,
  materialPlate: "AISI 316L",
  materialBody: "09Г2С",
  // ... other defaults
};

// Expected results:
// Total cost: ~145,000 ₽ (confirmed by current tests)
// Should NOT exceed 10,000,000 ₽
// Should NOT be less than 50,000 ₽
```

### Test Case 2: Large Equipment Configuration

```typescript
const inputs = {
  equipmentType: "К4-1200",
  plateCount: 1000,
  materialPlate: "AISI 316L",
  // ... other inputs
};

// Expected: 5-50 million ₽ range
// If result > 100 million ₽ → unit error
```

## Conclusion

**CRITICAL FINDING:** The calculator has a systematic density scaling error of 1,000,000× magnitude. However, the `/1000000` division in the TypeScript implementation partially compensates, which explains why current test results show reasonable costs (~145K₽).

**This is a "lucky accident" - two errors are canceling each other out, but this makes the calculations unstable and incorrect.**

## Priority Fix List

### URGENT (Fix Immediately)

1. **Density values** - Change 8080 → 0.008080 in all files
2. **Formula scaling** - Change `/1000000` → `/1000` to match Excel
3. **Test validation** - Ensure results remain in 100K-10M₽ range

### HIGH PRIORITY

4. **Separate thickness handling** - Match Excel's $D$78 reference pattern
5. **Unit type safety** - Add TypeScript types for volumes, masses, costs
6. **Excel comparison tests** - Test each intermediate calculation value

### MEDIUM PRIORITY

7. **Complete formula audit** - Review all 53 calculations systematically
8. **Documentation** - Add unit conversion comments to all formulas
9. **Error monitoring** - Add validation for unrealistic cost results

## Files Requiring Changes

1. **`/src/lib/calculation-engine/constants.ts`** - Fix MATERIAL_DENSITIES
2. **`/src/lib/calculation-engine/engine-v2.ts`** - Fix material definitions
3. **`/src/stores/materialStore.ts`** - Fix density values
4. **`/src/lib/calculation-engine/formula-library-complete.ts`** - Fix all volume calculations

## Expected Impact

- **Current results:** ~145K₽ for К4-750 (reasonable)
- **After fix:** Should remain in similar range (100K-10M₽)
- **Risk:** Formula changes could break current "accidental correctness"
- **Mitigation:** Test every change with known good configurations

**Risk Level:** HIGH - Critical systematic error found, but current results appear reasonable due to offsetting errors.
