# Excel Formula Analysis - The REAL Story

## Total Formula Count: 962

### By Sheet:

- **технолог**: 26 formulas (input parameters & lookups)
- **снабжение**: 907 formulas (bulk calculations for 13 equipment types)
- **результат**: 29 formulas (summary results)

## Pattern Analysis: The 962 Formula Breakdown

### Repetitive Formulas (Same Pattern, Different Rows)

The majority of formulas are **repetitive calculations for 13 equipment types**:

**Most Common Patterns:**

- **65x**: `=CELL*CELL*$CELL$*$CELL$/1000*2` (Weight calculations)
- **29x**: `=SUM(CELL:CELL)` (Aggregations)
- **27x**: `=технолог!CELL` (Cross-sheet references)
- **26x**: Various dimension calculations (`=CELL+5`, `=CELL*2+CELL+10`, etc.)
- **19x**: `='результат '!F26` (Result sheet data transfer)

**Equipment Type Calculations (13x each):**

- Material weight: `=(E110+15)*(F110+15)*G110*factor/1000*plates`
- Volume: `=M110*N110*density*factor/1000*4`
- Dimensions: `=C110+2*S110+10`, `=D110+15+2*S110+10`
- Costs: `=(AI110*2+AJ110*2)*2/1000+AZ110`

### Unique Formula Types:

1. **Simple References** (86 formulas)
   - Basic cell copies: `=A1`, `=B2`
2. **Mathematical Calculations** (678 formulas)
   - Weight, volume, dimension calculations
   - Most repeat 13x for equipment types
3. **Lookups** (27 formulas)
   - `VLOOKUP`, `INDEX`, `MATCH` for parameter tables
   - Equipment specification lookups
4. **Conditionals** (52 formulas)
   - Equipment type selection: `IF(технолог!G27=AM45,AN45*E19*G19,IF(...))`
   - Conditional calculations based on equipment type
5. **Aggregates** (55 formulas)
   - `SUM` formulas for totaling costs, weights, materials
   - Cross-category summations

6. **Cross-Sheet References** (64 formulas)
   - Data flow between sheets
   - Parameter passing from технолог to снабжение to результат

## The REAL Implementation Need

### Repetitive vs Unique:

- **Repetitive formulas**: 482 (patterns that repeat for 13 equipment types)
- **Unique formulas**: 480 (single-use calculations and references)
- **Unique patterns**: 37 core calculation types

### Core Business Logic Patterns:

1. **Equipment Type Processing** (13 variations each):
   - Material weight calculations
   - Volume calculations
   - Dimension calculations
   - Cost calculations
   - ~30 calculations per equipment type

2. **Parameter Lookups**:
   - Equipment specifications by type
   - Material properties
   - Pricing factors

3. **Data Flow**:
   - технолог → снабжение (input parameters)
   - снабжение → результат (calculated results)
   - Cross-sheet validation and references

4. **Aggregations**:
   - Total costs across equipment types
   - Total weights and volumes
   - Summary calculations

## Example of Repetition:

**Pattern**: Material weight calculation

```excel
Row 110: =(E110+15)*(F110+15)*G110*$G$93/1000*(технолог!$I$27)
Row 111: =(E111+15)*(F111+15)*G111*$G$93/1000*(технолог!$I$27)
Row 112: =(E112+15)*(F112+15)*G112*$G$93/1000*(технолог!$I$27)
...
Row 122: =(E122+15)*(F122+15)*G122*$G$93/1000*(технолог!$I$27)
```

This single pattern repeats 13 times (once per equipment type).

## Implementation Summary:

- **Unique calculation patterns**: ~40-50
- **Repetitive instances**: 13 equipment types × 30+ calculations each
- **Total unique logic to implement**: 40-50 core formulas
- **Data structures needed**: Equipment type arrays, parameter tables
- **Cross-references**: 3-sheet data flow system

**Bottom Line**: The 962 formulas represent about 40-50 unique business calculations that repeat across 13 equipment types, plus aggregations and data transfers. The bulk of implementation work is creating the core calculation engine, not 962 individual formulas.
