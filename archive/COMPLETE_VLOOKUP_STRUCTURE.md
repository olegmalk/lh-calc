# COMPLETE VLOOKUP TABLE STRUCTURE (B110:BI122)

## Table Overview
- **Range**: B110:BI122 (13 rows × 60 columns)
- **Sheet**: снабжение
- **Purpose**: Equipment specifications lookup table for heat exchanger calculations
- **Equipment Types**: К4-150 through К4-1200*600 (12 different models)

## Complete Column Structure

### Basic Identification & Dimensions (B-G)
| Column | Header | Purpose | К4-750 Value |
|--------|--------|---------|--------------|
| B | Пластины | Equipment Type | К4-750 |
| C | Длина | Length | 732 |
| D | Ширина | Width | 715 |
| E | Длина заготовки | Blank Length | 745 |
| F | Ширина заготовки | Blank Width | 745 |
| G | Высота | Height | 1 |

### Component Specifications & Masses (H-AK)
| Column | Header | Purpose | К4-750 Value | Formula Usage |
|--------|--------|---------|--------------|---------------|
| **H** | масса заготовок | **Blank Mass** | **1820.5952** | ✓ Used in E104 |
| I | Колонны | Columns | 110 | |
| J | Гребенка | Ribs | 130 | |
| K | - | Calculation Value | 2410 | |
| **L** | - | **Rib Mass Calculation** | **29.625648** | ✓ Used in E93 |
| M | Полоса гребенки | Rib Strips | 120 | |
| N | - | Calculation Value | 2410 | |
| **O** | - | **Rib Strip Mass Calc** | **27.346752** | ✓ Used in E94 |
| P | Лист концевой | End Sheets | 962 | |
| Q | - | Calculation Value | 960 | |
| **R** | - | **End Sheet Mass Calc** | **43.6640256** | ✓ Used in E95 |
| S | Зеркало лист без прибавки на резку | Mirror Sheet (no cut allowance) | 25 | |
| T | Зеркало лист | Mirror Sheet | 35 | |
| U | - | Adjustment Value | -92 | |
| V | - | Error Reference | #REF! | |
| W | Зеркало 1шт без прибавки на резку | Single Mirror (no cut allowance) | 74 | |
| X | - | Calculation Value | 782 | |
| Y | - | Calculation Value | 765 | |
| Z | Зеркало А 2шт | Mirror A (2 pieces) | 30 | |
| AA | - | Calculation Value | 6364 | |
| **AB** | - | **Mass Calculation** | **9.0266976** | ✓ Used in E97 |
| AC | Зеркало Б 2шт | Mirror B (2 pieces) | 30 | |
| AD | - | Calculation Value | 6360 | |
| **AE** | - | **Mass Calculation** | **9.021024** | ✓ Used in E98 |
| AF | Лист плакирующий А | Cladding Sheet A | 2463 | |
| AG | - | Calculation Value | 792 | |
| **AH** | - | **Cladding A Mass** | **92.22890688** | ✓ Used in E99 |
| AI | Лист плакирующий Б | Cladding Sheet B | 2463 | |
| AJ | - | Calculation Value | 790 | |
| **AK** | - | **Cladding B Mass** | **91.9960056** | ✓ Used in E100 |

### Final Calculations & Assembly Parameters (AL-BI)
| Column | Header | Purpose | К4-750 Value | Formula Usage |
|--------|--------|---------|--------------|---------------|
| AL | Длина Гребенки | Rib Length | 31.88 | |
| AM | Длина полосы гребенки | Rib Strip Length | 20.24 | |
| AN | Длина лист концевой | End Sheet Length | 7.688 | |
| AO | Зеркало лист | Mirror Sheet Calc | 0.96 | |
| AP | Зеркало А | Mirror A Calc | 51.712 | |
| AQ | Зеркало Б | Mirror B Calc | 51.68 | |
| AR | Дефлектор А | Deflector A | 0 | |
| AS | Дефлектор Б | Deflector B | 8.75 | |
| AT | Ласточка A | Swallow Tail A | 0 | |
| AU | Ласточка Б | Swallow Tail B | 7.55 | |
| AV | Пластина | Plate | 1157.6 | |
| AW | Лист плакирующий А | Cladding Sheet A Final | 14.322 | |
| AX | Лист Плакирующий Б | Cladding Sheet B Final | 14.3132 | |
| AY | отверстия листа плак А | Cladding A Holes | 1.302 | |
| AZ | отверстия листа плак Б | Cladding B Holes | 1.3012 | |
| **BA** | **Сумма 3мм Теплоблок (пакет)** | **Total 3mm Heat Block (package)** | **171.95** | ✓ Used in I78 |
| **BB** | **Сумма 3мм Теплоблок (плакировка)** | **Total 3mm Heat Block (cladding)** | **31.2384** | ✓ Used in H78 |
| **BC** | **Сумма 3мм реинж** | **Total 3mm Reinforcement** | **171.95** | ✓ Used in K78 |
| **BD** | **Сумма 1мм** | **Total 1mm Components** | **1165.15** | ✓ Used in J78, L78 |
| **BE** | **Распорка горизонтальная А** | **Horizontal Spacer A** | **14** | ✓ Used in BA147, BD147 |
| BF | Распорка горизонтальная Б | Horizontal Spacer B | 8 | |
| **BG** | **Длина горизонтальной А** | **Horizontal A Length** | **732** | ✓ Used in BC147 |
| **BH** | **Длина горизонтальной Б** | **Horizontal B Length** | **730** | ✓ Used in BE147 |
| **BI** | **Гайка DIN933** | **DIN933 Nut** | **44** | ✓ Used in O78 |

## Critical Formula Dependencies

### Most Used Columns
1. **BD** (Сумма 1мм) - 2 formula references
2. **BE** (Распорка горизонтальная А) - 2 formula references
3. **BA, BB, BC** - Mass totals for different thicknesses
4. **H, L, O, R** - Component mass calculations
5. **AB, AE, AH, AK** - Intermediate mass calculations

### Key Formula Locations
- **E93-E100**: Component mass calculations (columns L, O, R, AB, AE, AH, AK, H)
- **E104**: Blank mass lookup (column H)
- **H78-O78**: Final mass summaries (columns BB, BA, BC, BD, BI)
- **BA147-BE147**: Spacer and dimension calculations (columns BE, BG, BH)

## Missing Data Analysis
The following columns have NO headers in row 109 but contain calculation data:
- **K, L, N, O** - Intermediate mass calculations
- **Q, R** - End sheet calculations  
- **AA, AB, AD, AE** - Mirror component calculations
- **AG, AH, AJ, AK** - Cladding calculations

## Data Validation
- Total columns extracted: **60** (B through BI)
- Columns with headers: **42**
- Columns used in formulas: **16**
- Unused columns: **44** (potential optimization targets)

## К4-750 Complete Specification
The К4-750 heat exchanger (row 118) has:
- Dimensions: 732×715×745×745×1
- Blank mass: 1820.5952 kg
- Key component masses calculated in columns L, O, R, AB, AE, AH, AK
- Final totals: BA=171.95, BB=31.24, BC=171.95, BD=1165.15

## Usage Recommendations
1. **Critical columns**: H, L, O, R, AB, AE, AH, AK, BA, BB, BC, BD, BE, BG, BH, BI
2. **Optimization opportunity**: 44 columns are unused in current formulas
3. **Component calculation flow**: Basic dimensions → Component masses → Final totals
4. **VLOOKUP pattern**: Most formulas reference specific equipment type in D104 or технолог!G27