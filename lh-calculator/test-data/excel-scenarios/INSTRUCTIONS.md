# Excel Test Scenario Instructions

## 📋 What to Provide

### For Each Test Scenario

1. **Fill the Excel file** with test data:
   - технолог sheet: Fill cells D27-V27
   - снабжение sheet: Fill F2, D8-E8, D9, K13, P13, G93, G96
   - Let Excel calculate результат sheet

2. **Export or Save Values**:
   - Save the filled Excel file
   - Take screenshots of each sheet
   - Note all input values
   - Note all calculated results

3. **Create Value List**:

```
SCENARIO: К4-750 Standard
========================

INPUTS (технолог):
D27 = 1
E27 = E-113
F27 = Целый ТА
G27 = К4-750
H27 = 1/6
I27 = 400
J27 = 22
K27 = 22
L27 = 100
M27 = 100
N27 = [calculated value]
O27 = [calculated value]
P27 = AISI 316L
Q27 = AISI 316L
R27 = 09Г2С
S27 = гофра
T27 = 5
U27 = 1
V27 = 3

SUPPLY (снабжение):
F2 = 0000
D8 = 700
E8 = 700
D9 = 09Г2С
K13 = 1
P13 = 120000
G93 = [if used]
G96 = [if used]

RESULTS (результат):
F23 = [value]
G23 = [value]
K23 = [value]
N23 = [value]
O23 = [value]
J31 = [value]
J32 = [value]
J33 = [value]
J34 = [value]
J35 = [value]
J36 = [value]

Material Requirements:
Plate Volume = [value] m³
Body Volume = [value] m³
Plate Mass = [value] kg
Body Mass = [value] kg
Total Mass = [value] kg
```

## 🎯 Priority Scenarios

### 1. К4-750 Standard Configuration

- Equipment: К4-750
- Plates: 400
- Thickness: 1.0mm
- Material: AISI 316L / 09Г2С
- This is our baseline comparison

### 2. К4-150 Minimum Configuration

- Equipment: К4-150
- Plates: 10-50
- Thickness: 0.4mm
- Tests minimum boundaries

### 3. К4-1200 Maximum Configuration

- Equipment: К4-1200
- Plates: 800-1000
- Thickness: 1.2mm
- Tests maximum boundaries

### 4. Multi-Unit Order

- Any configuration
- K13 = 2 or more
- Tests quantity multiplication

### 5. Different Materials

- Try different combinations:
  - AISI 304 plates
  - Ст3 body
  - Different surface types

## 📸 Screenshots Needed

1. **технолог sheet** showing:
   - All filled cells (D27-V27)
   - Color coding visible
   - Formula bar for calculated cells

2. **снабжение sheet** showing:
   - Top section with F2
   - Connection section (D8-E8, D9)
   - Quantity/pricing (K13, P13)
   - Any intermediate calculations

3. **результат sheet** showing:
   - Main results (F23-O23)
   - Category breakdown (J31-J36)
   - Material requirements
   - Total costs

## ✅ Validation Points

For each scenario, we will verify:

1. **Input Processing**
   - All fields correctly captured
   - Dropdowns have right options
   - Validation rules work

2. **Calculations**
   - Test pressures (N27, O27) = pressure × 1.25 rounded up
   - Material masses match
   - Component costs match
   - Total costs match

3. **Business Logic**
   - Equipment type affects dimensions
   - Material compatibility
   - Quantity multiplication (K13)
   - Management factors (G93, G96)

## 📁 File Naming

Please name files as:

- `scenario-01-k4-750-standard.xlsx`
- `scenario-02-k4-150-minimum.xlsx`
- `scenario-03-k4-1200-maximum.xlsx`
- `screenshot-01-technolog.png`
- `screenshot-01-supply.png`
- `screenshot-01-result.png`

## 🔍 Special Attention

Please highlight or note:

- Any cells with special formulas
- Any validation errors Excel shows
- Any cells that change color based on values
- Any cells with comments/notes
- Any unusual business rules

This data will be used to ensure our web calculator produces EXACTLY the same results as Excel.
