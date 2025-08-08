# Heat Exchanger Cost Calculator - Comprehensive Excel Structure Analysis

## Overview

**File**: Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7 ДЛЯ БИТРИКС (1) (1).xlsx

A Russian cost calculation template for heat exchangers with 3 interconnected sheets:

- **технолог** (Technologist) - Technical input parameters
- **снабжение** (Supply) - Cost calculations and component sizing
- **результат** (Result) - Final cost summary and results

**Total Statistics**:

- Sheets: 3
- Formulas: 962
- Named Ranges: 9
- Cross-sheet references: 142

## Color-Coded Input System

The Excel file uses a sophisticated color-coding system to indicate who should input data and the input method:

### Color Legend

| Color Code | RGB     | Meaning                   | User Role        |
| ---------- | ------- | ------------------------- | ---------------- |
| `FFFFFF00` | Yellow  | Select from dropdown list | Technologist     |
| `FF92D050` | Green   | Manual input required     | Technologist     |
| `FFFFC000` | Orange  | Manual input/dropdown     | Design Engineers |
| `FFFF0000` | Red     | General Director only     | Management       |
| No color   | Default | Calculated/Display only   | System           |

## Sheet 1: технолог (Technologist Input)

**Purpose**: Technical specifications and equipment parameters input

### Input Fields by Color Category

#### Yellow Fields (Dropdown Selection - Technologist)

| Cell | Field                  | Value/Options | Purpose                  |
| ---- | ---------------------- | ------------- | ------------------------ |
| F27  | тип поставки           | "Целый ТА"    | Delivery type            |
| G27  | типоразмер К4          | "К4-750"      | Heat exchanger size type |
| P27  | материал пластин       | "AISI 316L"   | Plate material           |
| Q27  | материал пластин дубль | =P27          | Duplicate plate material |
| R27  | материал корпуса       | "09Г2С"       | Housing material         |
| S27  | тип поверхности        | "гофра"       | Surface type             |
| U27  | толщина пластины       | 1             | Plate thickness          |

#### Green Fields (Manual Input - Technologist)

| Cell | Field                    | Value   | Purpose                               |
| ---- | ------------------------ | ------- | ------------------------------------- |
| D27  | номер у технолога        | 1       | Internal technologist number          |
| E27  | Номер позиции в ОЛ       | "Е-113" | Position number in customer order     |
| H27  | ходы                     | "1/6"   | Flow passes configuration             |
| I27  | Количество пластин       | 400     | Number of plates                      |
| J27  | Расч Давл по Гор Ст      | 22      | Calculated pressure hot side (bar)    |
| K27  | Расч Давл по хол ст      | 22      | Calculated pressure cold side (bar)   |
| L27  | Расч Темп по Гор Стороне | 100     | Calculated temperature hot side (°C)  |
| M27  | Расч Темп по Хол Стороне | 100     | Calculated temperature cold side (°C) |
| T27  | толщина пластины дубль   | 5       | Duplicate plate thickness             |

#### Orange Fields (Design Engineers)

| Cell | Field                        | Value | Purpose                   |
| ---- | ---------------------------- | ----- | ------------------------- |
| V27  | количество крепежных панелей | 3     | Number of mounting panels |

### Key Calculations

- **N27, O27**: Reference dimension calculations from AI73, AJ73
- **AI73, AJ73**: Ceiling-precise calculations with 1.25 safety factor
- **Lookup tables**: Z60:AA68 range for material/size specifications

## Sheet 2: снабжение (Supply Calculations)

**Purpose**: Main calculation engine for component sizing, material quantities, and costs

### Input Fields by Category

#### Green Fields (Supply Department)

| Cell | Field                   | Value  | Purpose                       |
| ---- | ----------------------- | ------ | ----------------------------- |
| F2   | номер проекта           | "0000" | Project number                |
| D8   | диаметр подключения гор | 700    | Hot side connection diameter  |
| E8   | диаметр подключения хол | 700    | Cold side connection diameter |
| K13  | количество аппаратов    | 1      | Number of units               |
| P13  | цена за кг стали        | 120000 | Steel price per kg            |

#### Orange Fields (Design Engineers)

| Cell    | Field                 | Value   | Purpose                 |
| ------- | --------------------- | ------- | ----------------------- |
| D9      | материал подключений  | "09Г2С" | Connection material     |
| P19-P22 | крепеж specifications | Various | Fastener specifications |
| C28-J29 | фланцы specifications | Various | Flange specifications   |

### Calculation Categories

#### 1. Lookup/Reference Formulas (30 formulas)

- **VLOOKUP operations**: Material and size specifications from master tables
- **INDEX/MATCH**: Dynamic lookups based on input parameters
- **Range**: B110:BB122 (master specification table)

```excel
H78: =VLOOKUP(технолог!G27,B110:BB122,53,0)  # Material factor lookup
```

#### 2. Conditional Logic (49 formulas)

- **Size-based calculations**: Different formulas for different equipment sizes
- **Material-dependent pricing**: Cost varies by material selection

```excel
G22: =IF(технолог!G27=снабжение!AM46,G20*D10+E20+E21,G20*D10*D16+E20+E21)
```

#### 3. Arithmetic/Summation (581 formulas)

- **Component calculations**: Plate quantities, dimensions, weights
- **Cost aggregations**: Material costs, labor costs, overhead

```excel
M21: =(технолог!T27+технолог!U27)*0.001*технолог!I27+2*E19+2*технолог!V27*0.001
```

#### 4. Cross-Sheet References (257 formulas)

- **From технолог**: Technical parameters feed into calculations
- **To результат**: Calculated values feed to results summary

### Key Calculation Sections

- **Rows 18-40**: Component dimensioning and quantities
- **Rows 40-60**: Material quantity calculations
- **Rows 78+**: Cost calculations and pricing
- **Rows 110-122**: Master specification lookup table

### Named Ranges (Configuration)

- `материал_корпуса`: AU47:AU54 - Housing materials
- `материал_пластин`: AS47:AS54 - Plate materials
- `тип_поверхности`: AZ36:AZ40 - Surface types
- `типоразмеры_К4`: AM45:AM52 - Size specifications

## Sheet 3: результат (Results Summary)

**Purpose**: Final cost summary and key results aggregation

### Key Output Fields

| Cell | Formula                          | Purpose                       |
| ---- | -------------------------------- | ----------------------------- |
| E26  | Complex IF/AND                   | Material selection validation |
| F26  | =снабжение!K14                   | Equipment quantity            |
| G26  | =снабжение!G35+снабжение!M35     | Total component costs         |
| H26  | Complex calculation              | Main equipment cost           |
| M25  | =снабжение!F39                   | Unit price factor             |
| N26  | =снабжение!F78\*снабжение!D8+... | Total equipment cost          |

### Cross-Sheet Dependencies

- **From снабжение**: 51 references (primary cost data)
- **From технолог**: 10 references (key technical parameters)

## Data Flow Architecture

```
технолог (Technical Input)
    ↓
    Technical parameters (P27, G27, I27, etc.)
    ↓
снабжение (Calculations)
    ↓
    Component sizing → Material quantities → Cost calculations
    ↓
результат (Results)
    ↓
    Final cost summary and validation
```

### Critical Data Paths

1. **Equipment Type Flow**:
   - технолог!G27 (size type) → снабжение lookup tables → cost factors
2. **Material Flow**:
   - технолог!P27 (plate material) → снабжение material calculations → результат cost
3. **Quantity Flow**:
   - технолог!I27 (plate count) → снабжение quantity calculations → результат totals

## Formula Complexity Analysis

| Formula Type           | Count | Complexity | Purpose                        |
| ---------------------- | ----- | ---------- | ------------------------------ |
| Cross-sheet References | 282   | Low        | Data transfer between sheets   |
| Arithmetic/Summation   | 596   | Medium     | Quantity and cost calculations |
| Conditional Logic      | 51    | High       | Size/material-dependent logic  |
| Lookup/Reference       | 30    | Medium     | Specification table lookups    |
| Rounding/Precision     | 3     | Low        | Final value formatting         |

## Input Validation & Dependencies

### Required Inputs (Cannot be blank)

1. **технолог Sheet**: All green and yellow fields (D27-V27)
2. **снабжение Sheet**: Project number (F2), connection diameters (D8, E8), quantity (K13)

### Dependent Calculations

- Equipment sizing depends on G27 (типоразмер К4)
- Material costs depend on P27 (материал пластин)
- Connection sizing depends on D8, E8 (диаметры подключения)
- Total quantities depend on I27 (количество пластин) and K13 (количество аппаратов)

## Error Handling & Validation

The Excel file includes sophisticated validation:

- **VLOOKUP with exact match**: Ensures valid material/size selections
- **IF/AND conditions**: Validates input combinations
- **Named ranges**: Restricts dropdown selections to valid options
- **Ceiling/Floor functions**: Ensures realistic engineering values

## Usage Workflow

1. **Technologist** fills yellow (dropdown) and green (manual) fields in технолог sheet
2. **Design Engineers** complete orange fields in both технолог and снабжение sheets
3. **Supply Department** adds project details and pricing in снабжение sheet
4. **Management** reviews red fields if any adjustments needed
5. **System** automatically calculates all results in результат sheet

This structure ensures proper role-based data entry while maintaining calculation integrity across all cost components.
