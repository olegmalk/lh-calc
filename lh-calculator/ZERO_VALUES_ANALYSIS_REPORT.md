# ZERO VALUES ANALYSIS REPORT

## Executive Summary

Analysis of TEST_SCENARIO_DATA.md reveals 11 zero-valued cost components in the результат sheet. The root cause is **missing input fields** in the снабжение sheet that are required for cost calculations but not present in the test data.

## Zero-Valued Cost Components

### F26: снабжение!K14 = 0

**Formula**: `K13 * D12`
**Issue**: D12 is missing from INPUT CELLS

- K13 = 1 (exists)
- D12 = undefined (missing input)
  **Status**: Missing input field

### G26: снабжение!G35 + снабжение!M35 = 0

**Chain**:

- G35 = `D34*2 + F34` = 0
- M35 = `J34*2 + L34` = 0

**Dependencies**:

- D34 = `G26*D17*D11` = 0 (D17, D11 missing)
- J34 = `M26*D17*D11` = 0 (D17, D11 missing)
- G26 = `E25*G27*M21*G25` = 0 (E25, G25 missing)
- M26 = `K25*M27*M21*M25` = 0 (K25, M25 missing)

**Status**: Multiple missing input fields (D17, D11, E25, G25, K25, M25)

### H26: Complex formula = 0

**Formula**: `снабжение!E8*снабжение!G78*снабжение!D14*снабжение!D14+технолог!V27*снабжение!H78*снабжение!D13`

**Analysis**:

- E8 = 700 (exists)
- G78 = 184.22 (calculated)
- D14 = undefined (missing)
- V27 = 3 (exists)
- H78 = 31.24 (calculated)
- D13 = undefined (missing)

**Status**: Missing D13, D14 input fields

### I26: снабжение!G22\*2 = 0

**Chain**: G22 = `IF(технолог!G27=снабжение!AM46,G20*D10+E20+E21,G20*D10*D16+E20+E21)` = 0

- G20 = 0 (complex lookup returns 0)
  **Status**: Calculation result (lookup dependencies)

### J26: снабжение!M22\*4 = 0

**Chain**: M22 = `IF(технолог!G27=снабжение!AM46,M20*D10*(D15+0.03)+K20+K21,M20*D10*D15+K20+K21)` = 0

- M20 = 0 (depends on M21, K19, M19)
  **Status**: Missing input dependencies

### K26: снабжение!Q25 = 0

**Status**: Q25 missing from INPUT CELLS

### L26: снабжение!F38 = 0

**Chain**: F38 = `D38*4` = 0

- D38 = undefined (missing input)
  **Status**: Missing D38 input field

### M26: L26\*M25 = 0

**Status**: Depends on L26 (zero) and M25 (missing)

### O26: Complex formula = 0

**Formula**: `снабжение!D8*снабжение!E78*снабжение!D14*снабжение!D14+снабжение!D78*снабжение!I78*снабжение!D13`

- Similar to H26, missing D13, D14
  **Status**: Missing D13, D14 input fields

### Q26: снабжение!T44 = 0

**Status**: T44 missing from INPUT CELLS

### U26: снабжение!M40 = 0

**Chain**: M40 = `M38+M39` = 0

- M38 = 0 (exists in INPUT CELLS)
- M39 = 0 (exists in INPUT CELLS)
  **Status**: Expected zero (intentionally set to 0 in inputs)

## Summary of Missing Input Fields

### Critical Missing Inputs:

1. **D11** - Referenced in cost calculations
2. **D12** - Referenced in K14 formula
3. **D13** - Referenced in complex cost formulas
4. **D14** - Referenced in complex cost formulas
5. **D15** - Referenced in M22 formula
6. **D16** - Referenced in G22 formula
7. **D17** - Referenced in D34, J34 formulas
8. **D38** - Referenced in F38 formula
9. **E19** - Referenced in G20, M20 formulas
10. **E20, E21** - Referenced in G22, M22 formulas
11. **E25** - Referenced in G26 formula
12. **G19** - Referenced in G20 formula
13. **G25** - Referenced in G26 formula
14. **K19** - Referenced in M20 formula
15. **K20, K21** - Referenced in M22 formula
16. **K25** - Referenced in M26 formula
17. **M19** - Referenced in M20 formula
18. **M25** - Referenced in M26 formula
19. **Q25** - Referenced in K26 formula
20. **T44** - Referenced in Q26 formula

## Recommendations

### Immediate Actions:

1. **Add missing input fields** to the TechnicalInputFormSimple component
2. **Update input validation** to require these fields
3. **Add appropriate labels** and field types for each missing input
4. **Map fields** to correct Excel cell references in calculation formulas

### Test Data Actions:

1. **Provide realistic values** for all missing inputs in test scenarios
2. **Validate calculation chain** after adding missing inputs
3. **Create comprehensive test cases** with non-zero values

### Expected Result:

After adding missing inputs with appropriate values, the zero-valued components should calculate to realistic cost values, providing complete cost breakdown in the результат sheet.
