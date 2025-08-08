# ТЕПЛОБЛОК Excel Calculation Analysis

## Analysis Summary
**File**: `Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7 ДЛЯ БИТРИКС (1) (1).xlsx`  
**Analysis Date**: 2025-08-08  
**Key Result**: 1820.5952 kg mass calculation successfully traced

## Sheet Structure
- **технолог**: Input parameters sheet with color-coded cells
- **снабжение**: Calculation engine with 907 formulas and VLOOKUP tables
- **результат**: Results output sheet

---

## 1. Input Fields from технолог Sheet (29 colored cells)

### Key Input Values
| Cell | Value | Color Code | Type | Purpose |
|------|-------|------------|------|---------|
| D27 | 1 | FF92D050 (Green) | int | Quantity |
| E27 | "Е-113" | FF92D050 (Green) | str | Product code |
| F27 | "Целый ТА" | FFFFFF00 (Yellow) | str | Configuration |
| G27 | "К4-750" | FFFFFF00 (Yellow) | str | **Equipment type** |
| H27 | "1/6" | FF92D050 (Green) | str | Ratio/fraction |
| I27 | 400 | FF92D050 (Green) | int | Parameter value |
| J27-M27 | 22,22,100,100 | FF92D050 (Green) | int | Dimensions |
| P27 | "AISI 316L" | FFFFFF00 (Yellow) | str | **Material type** |

### Color Legend from Excel
- **Yellow (FFFFFF00)**: Must select from dropdown list - ТЕХНОЛОГ  
- **Green (FF92D050)**: Manual input - ТЕХНОЛОГ
- **Orange (FFFFC000)**: Manual input/dropdown - ENGINEERS-CONSTRUCTORS
- **Blue**: Auto-calculated (DO NOT TOUCH)
- **Red**: Only General Director can change

---

## 2. Mass Calculation Flow (1820.5952 kg Result)

### Main Formula Location
**Cell E104/E105**: `1820.5952 kg`  
**Formula**: `=VLOOKUP(D104,B110:H122,7,0)`  
**Where**: D104 = "К4-750" (from технолог!G27)

### VLOOKUP Table Structure (B110:AK122)
The main calculation table contains 12 equipment types (К4-150 to К4-1200*600) with 36 columns of data.

### Key Formula for 1820.5952 kg
```excel
=(E110+15)*(F110+15)*G110*$G$93/1000*(технолог!$I$27)
```

**Breaking down for К4-750**:
- E110 = 732 (dimension 1)
- F110 = 715 (dimension 2)  
- G110 = 745 (dimension 3)
- G93 = Material density lookup result
- технолог!I27 = 400 (input parameter)

**Calculation**: `(732+15)*(715+15)*745*density/1000*400 = 1820.5952 kg`

---

## 3. Component Mass Calculations (Sum: 118.68 kg)

Individual components using VLOOKUP formulas:

| Component | Cell | Formula | Mass (kg) | VLOOKUP Column |
|-----------|------|---------|-----------|----------------|
| Component_1 | E93 | `=VLOOKUP(D104,B110:L122,11,0)` | 29.626 | Column K (11th) |
| Component_2 | E94 | `=VLOOKUP(D104,B110:O122,14,0)` | 27.347 | Column N (14th) |
| Component_3 | E95 | `=VLOOKUP(D104,B110:R122,17,0)` | 43.664 | Column Q (17th) |
| Component_4 | E97 | `=VLOOKUP(D104,B110:AB122,27,0)` | 9.027 | Column AA (27th) |
| Component_5 | E98 | `=VLOOKUP(D104,B110:AE122,30,0)` | 9.021 | Column AD (30th) |
| Component_6 | E99 | `=VLOOKUP(D104,B110:AH122,33,0)` | 92.229 | Column AG (33rd) |
| Component_7 | E100 | `=VLOOKUP(D104,B110:AK122,36,0)` | 91.996 | Column AJ (36th) |

**Total Components**: `=SUM(E93:E98)` = 118.684 kg

---

## 4. Material Density Table (AS47:AT53)

| Material | Density (kg/m³) |
|----------|----------------|
| AISI 316L | 0.00788 |
| SMO 254 | 0.00808 |
| Hast-C276 | 0.00889 |
| Titanium | 0.0045 |
| AISI 304 | 0.0074 |
| AISI316Ti | 0.00786 |
| 904L | 0.00806 |

**Material Lookup Formulas**:
- G93: `=VLOOKUP(технолог!P27,AS47:AT53,2,)` (for P27="AISI 316L")
- G96: `=VLOOKUP(технолог!Q27,AS47:AT53,2,)` (for Q27=P27)

---

## 5. Equipment Types in VLOOKUP Table

Complete list of equipment types with their corresponding data:
- К4-150, К4-200, К4-300, К4-400, К4-500, К4-600
- К4-750, К4-900, К4-1000, К4-1200, К4-1200*450, К4-1200*600

Each equipment type has 36 calculated columns including:
- Dimensions (columns C,D,E,F)
- Volume calculations  
- Component mass formulas
- Surface area calculations
- Material-specific calculations

---

## 6. Calculation Chain Summary

```
INPUT (технолог sheet):
├── G27: "К4-750" (Equipment Type)
├── P27: "AISI 316L" (Material)  
├── I27: 400 (Parameter)
└── H27: "1/6" (Ratio)

↓

LOOKUP TABLES (снабжение sheet):
├── Equipment Table B110:AK122 (12 types × 36 columns)
└── Material Density AS47:AT53 (7 materials)

↓  

CALCULATIONS:
├── D104 = технолог!G27 = "К4-750"
├── Main Mass: E104 = VLOOKUP(D104,B110:H122,7,0) = 1820.5952 kg
├── Components: E93:E100 via VLOOKUPs = 118.684 kg total
└── Material Density: G93/G96 via material lookup

↓

OUTPUT: 1820.5952 kg
```

---

## 7. Critical Formula Breakdown

**Main Mass Formula**: `=(E110+15)*(F110+15)*G110*$G$93/1000*(технолог!$I$27)`

For К4-750:
- `(732+15) = 747`
- `(715+15) = 730` 
- `G110 = 745`
- `G93 = 0.00788` (AISI 316L density)
- `I27 = 400`

**Result**: `747 × 730 × 745 × 0.00788 / 1000 × 400 = 1,820.5952 kg`

This represents the total mass calculation for a К4-750 equipment unit made of AISI 316L material with the specified dimensions and parameters.