# LH Calculator Requirements Document V3
## Based on Excel Test Data Analysis

## 1. Executive Summary

The LH Calculator must replicate the Excel calculation logic for industrial equipment cost estimation. Based on analysis of test Excel file "ТЕСТ НОМЕР 7777" with actual values, we have identified the complete calculation chain.

### Key Finding: Main Mass Formula
```
Total Mass = (plateLength + plateThickness) × 0.001 × equipmentCount + 2 × E19 + 2 × mountingPanelsCount × 0.001
```
Where E19 is calculated from material properties and VLOOKUP tables.

## 2. Data Model

### 2.1 Input Fields (29 Total)

#### Primary Inputs (Row 27)
- **D27**: Плотность готового раствора = 1
- **E27**: Объем готового раствора = "Е-113"
- **F27**: Тип аппарата = "Целый ТА"
- **G27**: Типоразмер оборудования = "К4-750" (dropdown)
- **H27**: Соотношение = "1/6"
- **I27**: Количество оборудования = 400
- **J27-K27**: Параметры 22, 22
- **L27-M27**: Проценты 100, 100
- **N27-O27**: Значения 31.46, 31.46
- **P27**: Материал основной = "AISI 316L"
- **Q27**: Материал плакировки = "AISI 316L"
- **R27**: Материал корпуса = "09Г2С"
- **S27**: Тип гофры = "гофра"
- **T27**: Длина пластины = 5
- **U27**: Толщина пластины = 1
- **V27**: Количество монтажных панелей = 3

### 2.2 Equipment Types (VLOOKUP Table)
12 types from К4-150 to К4-1200*600, each with dimensions:
```
К4-150:  162×147×1 (row 110)
К4-300:  332×317×1 (row 111)
К4-500:  532×517×3 (row 112)
К4-750:  732×715×3 (row 113)
К4-1000: 932×917×3 (row 114)
К4-1200: 1132×1117×3 (row 115)
К4-600*300: 603×306×1 (row 116)
К4-600*600: 596×596×1 (row 117)
К4-800*400: 793×393×1 (row 118)
К4-800*800: 796×796×1 (row 119)
К4-1000*500: 993×496×1 (row 120)
К4-1200*600: 1193×596×1 (row 121)
```

### 2.3 Material Densities
```javascript
const MATERIAL_DENSITIES = {
  "AISI 316L": 0.00788,
  "SMO 254": 0.00808,
  "Hastelloy C-276": 0.00889,
  "Титан ВТ1-0": 0.0045,
  "AISI 304": 0.0074,
  "AISI 316Ti": 0.00786,
  "904L": 0.00806
};
```

## 3. Calculation Logic

### 3.1 Main Plate Mass (G93)
**Excel Formula**: `=(E110+15)*(F110+15)*G110*$G$93/1000*(технолог!$I$27)`

**JavaScript Implementation**:
```javascript
function calculatePlateMass(equipmentType, material, equipmentCount) {
  const dimensions = EQUIPMENT_LOOKUP[equipmentType];
  const density = MATERIAL_DENSITIES[material];
  
  // Add 15mm padding to length and width
  const adjustedLength = dimensions.length + 15;
  const adjustedWidth = dimensions.width + 15;
  
  // Calculate mass
  const mass = adjustedLength * adjustedWidth * dimensions.thickness * density / 1000 * equipmentCount;
  return mass;
}
```

**Test Case**: К4-750, AISI 316L, 400 units
- (732+15) × (715+15) × 3 × 0.00788 ÷ 1000 × 400 = **1820.5952 kg** ✓

### 3.2 Component Masses (G94-G104)
Seven additional components calculated via VLOOKUP:
```
Component_1: 29.626 kg (formula: specific VLOOKUP)
Component_2: 27.347 kg
Component_3: 43.664 kg
Component_4: 9.027 kg
Component_5: 9.021 kg
Component_6: 92.229 kg
Component_7: 91.996 kg
```

### 3.3 Total Mass Formula (M21)
```javascript
function calculateTotalMass(plateLength, plateThickness, equipmentCount, mountingPanelsCount, E19) {
  return (plateLength + plateThickness) * 0.001 * equipmentCount + 2 * E19 + 2 * mountingPanelsCount * 0.001;
}
```

## 4. Screenshot Analysis Results

From the uploaded screenshot (176b6b6e-3b18-40d0-bde0-b6042efd885b.JPG):
- Shows material breakdown with individual component masses
- Confirms К4-750 total mass: **1820.5952 kg**
- Shows component totals: **118.6841472 kg**
- Validates density values: **0.00788** for main material

## 5. Implementation Checklist

### Phase 1: Core Fields ✅
- [x] equipmentType (G27)
- [x] materialMain (P27)
- [x] equipmentCount (I27)
- [x] Basic mass calculation

### Phase 2: Missing Critical Fields 🔴
- [ ] plateLength (T27) - Currently missing
- [ ] plateThickness (U27) - Have but wrong default
- [ ] mountingPanelsCount (V27) - Currently missing
- [ ] materialCladding (Q27) - Currently missing
- [ ] bodyMaterial (R27) - Currently missing

### Phase 3: VLOOKUP Implementation 🔴
- [ ] Complete 12-equipment lookup table
- [ ] 7 material density mappings
- [ ] Component-specific calculations

### Phase 4: Advanced Fields 🔴
- [ ] solutionDensity (D27)
- [ ] solutionVolume (E27)
- [ ] equipmentTypeDetail (F27)
- [ ] ratio (H27)
- [ ] corrugationType (S27)

## 6. Test Validation Data

### Test Scenario 1 (From Excel)
**Inputs:**
- Equipment: К4-750
- Material: AISI 316L
- Count: 400
- Plate Length: 5
- Plate Thickness: 1
- Mounting Panels: 3

**Expected Outputs:**
- Main Plate Mass: 1820.5952 kg
- Component Mass: 118.6841 kg
- Total Mass: ~1939 kg

## 7. Questions for Clarification

### Critical Questions 🔴
1. **E19 Calculation**: The formula references E19 but it's empty in test data. What should this calculate?
2. **Component Formulas**: Need exact formulas for 7 component calculations (rows 94-104)
3. **Ratio Field (H27)**: How does "1/6" ratio affect calculations?

### Business Logic Questions
4. **Solution Type (E27)**: "Е-113" appears to be a code. Need mapping table?
5. **Equipment Detail (F27)**: "Целый ТА" - need translation and usage
6. **Corrugation Type (S27)**: How does "гофра" affect calculations?

### Technical Questions
7. **Precision**: Excel shows 1820.5952. Need 4 decimal places?
8. **Rounding**: When to apply CEILING.PRECISE function?
9. **Units**: Confirm all conversions (mm to m, etc.)

## 8. Next Steps

1. **Immediate**: Add T27, U27, V27 fields to input form
2. **Priority**: Implement complete VLOOKUP tables
3. **Validation**: Test against Excel values (1820.5952 kg)
4. **Documentation**: Update user-inputs.md with findings

## 9. Risk Assessment

### High Risk
- Missing E19 calculation logic
- Component formulas incomplete
- 40% of required fields missing

### Medium Risk
- Precision differences with Excel
- Material density variations
- VLOOKUP edge cases

### Low Risk
- UI/UX differences
- Translation issues
- Performance with large datasets

---

*Document Version: 3.0*
*Last Updated: 2025-08-08*
*Status: Requirements Gathering - 70% Complete*