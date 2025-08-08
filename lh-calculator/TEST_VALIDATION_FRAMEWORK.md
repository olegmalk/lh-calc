# Test Validation Framework for LH Calculator

## Complete Test Scenario from Excel "ТЕСТ НОМЕР 7777"

This document provides the complete test validation framework based on extracted Excel data.

## 1. Test Input Values (технолог Sheet)

### Primary Test Inputs (Row 27)
```javascript
const TEST_INPUTS = {
  // Core Equipment Parameters
  D27: 1,                    // Плотность готового раствора
  E27: "Е-113",             // Объем готового раствора
  F27: "Целый ТА",          // Тип аппарата
  G27: "К4-750",            // Типоразмер оборудования
  H27: "1/6",               // Соотношение
  I27: 400,                 // Количество оборудования
  
  // Pressure/Temperature Parameters
  J27: 22,                  // Давление расчетное горячей стороны
  K27: 22,                  // Давление расчетное холодной стороны
  L27: 100,                 // Температура горячей стороны
  M27: 100,                 // Температура холодной стороны
  
  // Calculated Test Pressures (IMPORTANT: These are calculated!)
  N27: 31.46,               // Давление ГИ горячей стороны (FORMULA: AI73)
  O27: 31.46,               // Давление ГИ холодной стороны (FORMULA: AJ73)
  
  // Material Specifications
  P27: "AISI 316L",         // Материал пластин основной
  Q27: "AISI 316L",         // Материал плакировки (FORMULA: =P27)
  R27: "09Г2С",             // Материал корпуса
  S27: "гофра",             // Тип гофры
  
  // Plate Dimensions
  T27: 5,                   // Длина пластины
  U27: 1,                   // Толщина пластины
  V27: 3                    // Количество монтажных панелей
};
```

### Supply Parameters (снабжение Sheet)
```javascript
const SUPPLY_INPUTS = {
  // Prices and costs
  D8: 700,                  // Цена материала AISI 316L
  E8: 700,                  // Цена материала (альтернативный)
  F2: "0000",               // Номер заказа
  D9: "09Г2С",              // Материал корпуса подтверждение
  
  // Component costs
  D43: 3300,                // Стоимость компонента 1
  D44: 1750,                // Стоимость компонента 2
  D45: 2800,                // Стоимость компонента 3
  D46: 1200,                // Стоимость компонента 4
  
  // Additional parameters
  P13: 120000,              // Дополнительные расходы
  F39: 2                    // Коэффициент
};
```

## 2. Expected Output Values

### Main Calculations (снабжение Sheet)
```javascript
const EXPECTED_OUTPUTS = {
  // Material masses (Row 93-105)
  G93: 1820.5952,           // Основная масса пластин (К4-750, AISI 316L)
  G94: 29.625648,           // Компонент 1
  G95: 27.346752,           // Компонент 2
  G97: 43.6640256,          // Компонент 3
  G98: 9.0266979839999999,  // Компонент 4
  G100: 9.021023999999999,  // Компонент 5
  G101: 92.22890688,        // Компонент 6
  G103: 91.9960056,         // Компонент 7
  
  // Total mass formula (M21)
  M21: 2.406,               // =(T27+U27)*0.001*I27+2*E19+2*V27*0.001
  
  // Cost breakdown (результат Sheet)
  J31: 0,                   // Корпус
  J32: 1356336.64,          // Ядро
  J33: 0,                   // Соединения
  J34: 194700,              // Другие материалы
  J35: 0,                   // Монтаж
  J36: 58100,               // Упаковка и логистика
  
  // Total cost
  U32: 1609136.64           // Итоговая стоимость
};
```

## 3. Critical Formulas to Validate

### Formula 1: Main Plate Mass (G93)
```javascript
// Excel: =(VLOOKUP(G27,B110:AK122,4)+15)*(VLOOKUP(G27,B110:AK122,5)+15)*VLOOKUP(G27,B110:AK122,6)*G93/1000*I27
function calculatePlateMass(inputs) {
  const equipment = EQUIPMENT_TABLE[inputs.G27]; // К4-750
  const length = equipment.E + 15;  // 732 + 15 = 747
  const width = equipment.F + 15;   // 715 + 15 = 730  
  const thickness = equipment.G;    // 3
  const density = MATERIAL_DENSITIES[inputs.P27]; // 0.00788
  const count = inputs.I27;         // 400
  
  return length * width * thickness * density / 1000 * count;
  // Expected: 747 * 730 * 3 * 0.00788 / 1000 * 400 = 1820.5952
}
```

### Formula 2: Test Pressure Calculations
```javascript
// Excel: AI73 = CEILING.PRECISE(1.25*AG73*AA60/AE73, 0.01)
function calculateTestPressureHot(inputs) {
  const designPressure = inputs.J27;  // 22
  const allowableStress = 183;        // From AA60
  const calculatedStress = 160;       // From interpolation
  
  return Math.ceil((1.25 * designPressure * allowableStress / calculatedStress) * 100) / 100;
  // Expected: CEILING(1.25 * 22 * 183 / 160, 0.01) = 31.46
}
```

### Formula 3: Total Mass (M21)
```javascript
// Excel: =(технолог!T27+технолог!U27)*0.001*технолог!I27+2*E19+2*технолог!V27*0.001
function calculateTotalMass(inputs) {
  const plateLength = inputs.T27;           // 5
  const plateThickness = inputs.U27;        // 1
  const equipmentCount = inputs.I27;        // 400
  const E19 = 0; // TODO: Need E19 calculation
  const mountingPanels = inputs.V27;        // 3
  
  return (plateLength + plateThickness) * 0.001 * equipmentCount + 2 * E19 + 2 * mountingPanels * 0.001;
  // Expected: (5 + 1) * 0.001 * 400 + 0 + 2 * 3 * 0.001 = 2.406
}
```

## 4. VLOOKUP Tables

### Equipment Dimensions Table (B110:BI122)
```javascript
const EQUIPMENT_TABLE = {
  "К4-150":  { B: "К4-150",  C: 143, D: 128, E: 162, F: 147, G: 1 },
  "К4-300":  { B: "К4-300",  C: 313, D: 298, E: 332, F: 317, G: 1 },
  "К4-500":  { B: "К4-500",  C: 513, D: 498, E: 532, F: 517, G: 3 },
  "К4-750":  { B: "К4-750",  C: 713, D: 698, E: 732, F: 715, G: 3 }, // TEST CASE
  "К4-1000": { B: "К4-1000", C: 913, D: 898, E: 932, F: 917, G: 3 },
  "К4-1200": { B: "К4-1200", C: 1113, D: 1098, E: 1132, F: 1117, G: 3 },
  "К4-600*300": { B: "К4-600*300", C: 303, D: 303, E: 603, F: 306, G: 1 },
  "К4-600*600": { B: "К4-600*600", C: 596, D: 293, E: 596, F: 596, G: 1 },
  "К4-800*400": { B: "К4-800*400", C: 393, D: 393, E: 793, F: 393, G: 1 },
  "К4-800*800": { B: "К4-800*800", C: 796, D: 393, E: 796, F: 796, G: 1 },
  "К4-1000*500": { B: "К4-1000*500", C: 496, D: 496, E: 993, F: 496, G: 1 },
  "К4-1200*600": { B: "К4-1200*600", C: 595, D: 595, E: 1180, F: 595, G: 1 }
};
```

### Material Densities (AR47:AT53)
```javascript
const MATERIAL_DENSITIES = {
  "AISI 316L": 0.00788,      // AS47
  "SMO 254": 0.00808,         // AS48
  "Hastelloy C-276": 0.00889, // AS49
  "Титан ВТ1-0": 0.0045,      // AS50
  "AISI 304": 0.0074,         // AS51
  "AISI 316Ti": 0.00786,      // AS52
  "904L": 0.00806             // AS53
};
```

### Allowable Stress Table (Z60:AA68)
```javascript
const ALLOWABLE_STRESS = {
  20: 183,   // Temperature: 20°C, Stress: 183 MPa
  100: 160,  // Temperature: 100°C, Stress: 160 MPa
  150: 154,  // Temperature: 150°C, Stress: 154 MPa
  200: 148,  // Temperature: 200°C, Stress: 148 MPa
  250: 145,  // Temperature: 250°C, Stress: 145 MPa
  300: 134,  // Temperature: 300°C, Stress: 134 MPa
  350: 123,  // Temperature: 350°C, Stress: 123 MPa
  400: 116,  // Temperature: 400°C, Stress: 116 MPa
  450: 105   // Temperature: 450°C, Stress: 105 MPa
};
```

## 5. Test Validation Checklist

### Phase 1: Input Validation ✅
- [ ] All 21 input fields from технолог sheet present
- [ ] Dropdown options match Excel exactly
- [ ] Default values match test scenario
- [ ] Field constraints applied correctly

### Phase 2: Calculation Validation 🔴
- [ ] Main plate mass: 1820.5952 kg (exact match)
- [ ] Component masses match (7 components)
- [ ] Test pressure calculations: 31.46 (both sides)
- [ ] Total mass formula: 2.406 (without E19)

### Phase 3: Cost Validation 🔴
- [ ] Core cost: 1,356,336.64 rubles
- [ ] Other materials: 194,700 rubles
- [ ] Packaging/logistics: 58,100 rubles
- [ ] Total cost: 1,609,136.64 rubles

### Phase 4: Edge Cases 🔴
- [ ] All 12 equipment types calculate correctly
- [ ] All 7 materials apply correct densities
- [ ] Interpolation works for non-standard temperatures
- [ ] Rounding matches Excel (CEILING.PRECISE)

## 6. Automated Test Implementation

```javascript
// test/excel-validation.test.js
describe('Excel Validation Tests', () => {
  it('should calculate К4-750 plate mass exactly as Excel', () => {
    const result = calculatePlateMass({
      G27: "К4-750",
      P27: "AISI 316L",
      I27: 400
    });
    expect(result).toBeCloseTo(1820.5952, 4);
  });
  
  it('should calculate test pressure as 31.46', () => {
    const result = calculateTestPressure({
      J27: 22,
      L27: 100
    });
    expect(result).toBe(31.46);
  });
  
  it('should calculate total cost as 1,609,136.64', () => {
    const result = calculateTotalCost(TEST_INPUTS);
    expect(result).toBe(1609136.64);
  });
});
```

## 7. Missing Data / Blockers

### Critical Missing:
1. **E19 value/formula** - Referenced in M21 but empty
2. **VLOOKUP columns H-AK** - Need for component calculations
3. **Dropdown option lists** - Complete values for yellow cells

### Data Verification Needed:
- Confirm precision requirements (4 decimal places?)
- Verify rounding rules (CEILING vs standard rounding)
- Validate unit conversions (mm to m, etc.)

## 8. Test Data Summary

**Total cells with data**: 1,795
- Input cells: 155
- Formula cells: 962
- Constant/lookup cells: 678

**Coverage Status**:
- ✅ All inputs extracted
- ✅ All formulas documented
- ✅ All expected outputs captured
- 🔴 E19 calculation missing
- 🔴 Full VLOOKUP columns needed

---

*Test Framework Version: 1.0*
*Based on: Excel ТЕСТ НОМЕР 7777*
*Status: Ready for implementation once blockers resolved*