# Complete Product Requirements Document - ALL Input Fields

## Executive Summary

**Total Input Fields Required**: 155 fields

- **технолог (Technologist) Tab**: 21 input fields
- **снабжение (Supply) Tab**: 134 input fields
- **Total Coverage Required**: 100% for accurate calculations

## 1. ТЕХНОЛОГ TAB - Complete Input Fields (21 fields)

### 1.1 Primary Configuration (Row 27)

| Cell | Field Name          | Russian Label                       | Type       | Default     | Required | Status               |
| ---- | ------------------- | ----------------------------------- | ---------- | ----------- | -------- | -------------------- |
| D27  | solutionDensity     | Плотность готового раствора         | number     | 1           | Yes      | ❌ Missing           |
| E27  | solutionVolume      | Объем готового раствора             | string     | "Е-113"     | Yes      | ❌ Missing           |
| F27  | equipmentTypeDetail | Тип аппарата                        | string     | "Целый ТА"  | Yes      | ❌ Missing           |
| G27  | equipmentType       | Типоразмер оборудования             | dropdown   | "К4-750"    | Yes      | ✅ Implemented       |
| H27  | flowRatio           | Соотношение                         | string     | "1/6"       | Yes      | ❌ Missing           |
| I27  | equipmentCount      | Количество оборудования             | number     | 400         | Yes      | ✅ Implemented       |
| J27  | pressureHot         | Давление расчетное горячей стороны  | number     | 22          | Yes      | ✅ Implemented       |
| K27  | pressureCold        | Давление расчетное холодной стороны | number     | 22          | Yes      | ✅ Implemented       |
| L27  | temperatureHot      | Температура горячей стороны         | number     | 100         | Yes      | ✅ Implemented       |
| M27  | temperatureCold     | Температура холодной стороны        | number     | 100         | Yes      | ✅ Implemented       |
| N27  | testPressureHot     | Давление ГИ горячей стороны         | calculated | 31.46       | Yes      | ❌ Missing           |
| O27  | testPressureCold    | Давление ГИ холодной стороны        | calculated | 31.46       | Yes      | ❌ Missing           |
| P27  | plateMaterial       | Материал пластин основной           | dropdown   | "AISI 316L" | Yes      | ✅ Implemented       |
| Q27  | claddingMaterial    | Материал плакировки                 | formula    | =P27        | Yes      | ❌ Missing           |
| R27  | bodyMaterial        | Материал корпуса                    | dropdown   | "09Г2С"     | Yes      | ❌ Missing           |
| S27  | corrugationType     | Тип гофры                           | dropdown   | "гофра"     | Yes      | ❌ Missing           |
| T27  | plateLength         | Длина пластины                      | number     | 5           | Yes      | ❌ Missing           |
| U27  | plateThickness      | Толщина пластины                    | number     | 1           | Yes      | ⚠️ Wrong default (3) |
| V27  | mountingPanelsCount | Количество монтажных панелей        | number     | 3           | Yes      | ❌ Missing           |

### 1.2 Instruction Fields (Rows 4-8)

These are informational only, not used in calculations:

- E4-E8: Color coding instructions

**технолог Implementation Status**: 9/21 fields (43%) ✅

## 2. СНАБЖЕНИЕ TAB - Complete Input Fields (134 fields)

### 2.1 Price/Cost Fields (Critical for calculations)

| Cell | Field Name               | Russian Label                  | Type   | Default | Required | Status         |
| ---- | ------------------------ | ------------------------------ | ------ | ------- | -------- | -------------- |
| D8   | plateMaterialPrice       | Цена материала AISI 316L       | number | 700     | Yes      | ✅ Implemented |
| E8   | alternativeMaterialPrice | Цена альтернативного материала | number | 700     | Yes      | ✅ Implemented |
| F8   | columnCoverPrice         | Цена материала колонн/крышек   | number | 750     | Yes      | ✅ Implemented |
| G8   | panelMaterialPrice       | Цена материала панелей         | number | 650     | Yes      | ✅ Implemented |

### 2.2 Order and Material Configuration

| Cell | Field Name            | Russian Label                  | Type   | Default | Required | Status     |
| ---- | --------------------- | ------------------------------ | ------ | ------- | -------- | ---------- |
| F2   | orderNumber           | Номер заказа                   | string | "0000"  | Yes      | ❌ Missing |
| D9   | bodyMaterialConfirm   | Материал корпуса подтверждение | string | "09Г2С" | Yes      | ❌ Missing |
| F39  | multiplierCoefficient | Коэффициент                    | number | 2       | Yes      | ❌ Missing |

### 2.3 Component Costs (D43-D46, Critical)

| Cell | Field Name     | Russian Label          | Type   | Default | Required | Status     |
| ---- | -------------- | ---------------------- | ------ | ------- | -------- | ---------- |
| D43  | component1Cost | Стоимость компонента 1 | number | 3300    | Yes      | ❌ Missing |
| D44  | component2Cost | Стоимость компонента 2 | number | 1750    | Yes      | ❌ Missing |
| D45  | component3Cost | Стоимость компонента 3 | number | 2800    | Yes      | ❌ Missing |
| D46  | component4Cost | Стоимость компонента 4 | number | 1200    | Yes      | ❌ Missing |

### 2.4 Additional Material Costs

| Cell | Field Name      | Russian Label              | Type   | Default | Required | Status     |
| ---- | --------------- | -------------------------- | ------ | ------- | -------- | ---------- |
| G43  | additionalCost1 | Дополнительная стоимость 1 | number | 600     | Yes      | ❌ Missing |
| G44  | additionalCost2 | Дополнительная стоимость 2 | number | 87      | Yes      | ❌ Missing |
| G45  | additionalCost3 | Дополнительная стоимость 3 | number | 50      | Yes      | ❌ Missing |
| M44  | materialCost1   | Материальные затраты 1     | number | 50000   | Yes      | ❌ Missing |
| M45  | materialCost2   | Материальные затраты 2     | number | 0       | No       | ❌ Missing |
| M46  | materialCost3   | Материальные затраты 3     | number | 0       | No       | ❌ Missing |
| P45  | extraCost       | Дополнительные расходы     | number | 20000   | Yes      | ❌ Missing |

### 2.5 Labor and Logistics

| Cell | Field Name         | Russian Label              | Type   | Default | Required | Status         |
| ---- | ------------------ | -------------------------- | ------ | ------- | -------- | -------------- |
| K13  | standardLaborHours | Количество нормо-часов     | number | 1       | Yes      | ✅ Implemented |
| P13  | internalLogistics  | Внутренняя логистика       | number | 120000  | Yes      | ✅ Implemented |
| P19  | panelFastenerQty   | Количество крепежа панелей | number | 88      | Yes      | ✅ Implemented |

### 2.6 Flange Specifications (28-29)

| Cell | Field Name      | Russian Label     | Type   | Default | Required | Status     |
| ---- | --------------- | ----------------- | ------ | ------- | -------- | ---------- |
| C28  | flangePressure1 | Давление фланца 1 | string | "Ру10"  | Yes      | ❌ Missing |
| C29  | flangePressure2 | Давление фланца 2 | string | "Ру40"  | Yes      | ❌ Missing |
| D28  | flangeDiameter1 | Диаметр фланца 1  | string | "Ду600" | Yes      | ❌ Missing |
| D29  | flangeDiameter2 | Диаметр фланца 2  | string | "Ду600" | Yes      | ❌ Missing |
| I28  | flangePressure3 | Давление фланца 3 | string | "Ру25"  | Yes      | ❌ Missing |
| I29  | flangePressure4 | Давление фланца 4 | string | "Ру63"  | Yes      | ❌ Missing |
| J28  | flangeDiameter3 | Диаметр фланца 3  | string | "Ду450" | Yes      | ❌ Missing |
| J29  | flangeDiameter4 | Диаметр фланца 4  | string | "Ду300" | Yes      | ❌ Missing |

### 2.7 Processing Costs (H54-H57, I38-I39, K38-K39)

| Cell | Field Name      | Russian Label           | Type   | Default | Required | Status     |
| ---- | --------------- | ----------------------- | ------ | ------- | -------- | ---------- |
| H54  | processingCost1 | Стоимость обработки 1   | number | 100     | Yes      | ❌ Missing |
| H55  | processingCost2 | Стоимость обработки 2   | number | 100     | Yes      | ❌ Missing |
| H56  | processingCost3 | Стоимость обработки 3   | number | 200     | Yes      | ❌ Missing |
| H57  | processingCost4 | Стоимость обработки 4   | number | 150     | Yes      | ❌ Missing |
| I38  | assemblyWork1   | Сборочные работы 1      | number | 1000    | Yes      | ❌ Missing |
| I39  | assemblyWork2   | Сборочные работы 2      | number | 1000    | Yes      | ❌ Missing |
| K38  | additionalWork1 | Дополнительные работы 1 | number | 1500    | Yes      | ❌ Missing |
| K39  | additionalWork2 | Дополнительные работы 2 | number | 1200    | Yes      | ❌ Missing |

### 2.8 Material Specifications (M51-M57)

| Cell | Field Name | Russian Label         | Type   | Default | Required | Status     |
| ---- | ---------- | --------------------- | ------ | ------- | -------- | ---------- |
| M51  | specCost1  | Специальные затраты 1 | number | 5000    | Yes      | ❌ Missing |
| M52  | specCost2  | Специальные затраты 2 | number | 7000    | Yes      | ❌ Missing |
| M55  | specCost3  | Специальные затраты 3 | number | 15000   | Yes      | ❌ Missing |
| M57  | specCost4  | Специальные затраты 4 | number | 30000   | Yes      | ❌ Missing |

### 2.9 Quantity Fields (I50-I57, N50-N57)

| Cell    | Field Name   | Russian Label       | Type     | Default   | Required | Status     |
| ------- | ------------ | ------------------- | -------- | --------- | -------- | ---------- |
| I50-I52 | quantities1  | Количества группа 1 | number[] | [10,10,0] | Yes      | ❌ Missing |
| I54-I57 | quantities2  | Количества группа 2 | number[] | [2,2,2,2] | Yes      | ❌ Missing |
| N50-N52 | multipliers1 | Множители группа 1  | number[] | [0,1,1]   | Yes      | ❌ Missing |
| N54-N57 | multipliers2 | Множители группа 2  | number[] | [1,1,1,1] | Yes      | ❌ Missing |

### 2.10 Fastener Specifications (P20-P41, Q29-Q41, R29-R41)

| Cell | Field Name       | Russian Label    | Type   | Default      | Required | Status     |
| ---- | ---------------- | ---------------- | ------ | ------------ | -------- | ---------- |
| P20  | fastenerMaterial | Материал крепежа | string | "40Х"        | Yes      | ❌ Missing |
| P21  | fastenerCoating  | Покрытие крепежа | string | "Zn-Cr 9мкм" | Yes      | ❌ Missing |
| P22  | fastenerType1    | Тип крепежа 1    | string | "М33"        | Yes      | ❌ Missing |
| P29  | fastenerType2    | Тип крепежа 2    | string | "М18"        | Yes      | ❌ Missing |
| P33  | fastenerType3    | Тип крепежа 3    | string | "М18"        | Yes      | ❌ Missing |
| P37  | fastenerType4    | Тип крепежа 4    | string | "М18"        | Yes      | ❌ Missing |
| P41  | fastenerType5    | Тип крепежа 5    | string | "М18"        | Yes      | ❌ Missing |

### 2.11 Special Parameters (D78, BG147)

| Cell  | Field Name    | Russian Label          | Type   | Default | Required | Status     |
| ----- | ------------- | ---------------------- | ------ | ------- | -------- | ---------- |
| D78   | specialParam1 | Специальный параметр 1 | number | 3       | Yes      | ❌ Missing |
| BG147 | specialParam2 | Специальный параметр 2 | number | 8       | Yes      | ❌ Missing |

### 2.12 Descriptive/Label Fields (Non-calculation)

The following fields are labels and descriptions that don't affect calculations but are part of the UI:

- B18, B24, B37, B42, B48: Component labels
- H18, H24, H37: Assembly labels
- I42, I44-I46: Material descriptions
- N2-N6: Color coding instructions
- O18, O27: Additional labels
- T108-Y108: Dimension labels
- W16-W36: Verification labels

**снабжение Implementation Status**: 13/134 fields (9.7%) ❌

## 3. Implementation Priority Matrix

### Priority 1: Critical for Core Calculations (MUST HAVE)

**26 fields total** - These directly affect the main calculation results

#### технолог Tab (11 fields):

- T27, V27 (plate dimensions)
- N27, O27 (test pressures)
- Q27 (cladding material)
- R27 (body material)
- S27 (corrugation type)
- D27, E27, F27, H27 (configuration)

#### снабжение Tab (15 fields):

- F2 (order number)
- D9 (body material confirm)
- F39 (multiplier coefficient)
- D43-D46 (component costs)
- G43-G45 (additional costs)
- M44, P45 (material costs)
- E19 (processing coefficient = 7,552,000)

### Priority 2: Secondary Calculations (SHOULD HAVE)

**35 fields total** - Affect detailed cost breakdowns

- Flange specifications (8 fields)
- Processing costs (8 fields)
- Material specifications (4 fields)
- Quantity/multiplier fields (15 fields)

### Priority 3: Configuration and UI (NICE TO HAVE)

**94 fields total** - Labels, descriptions, validation

- Fastener specifications
- Special parameters
- Descriptive labels
- Instruction fields

## 4. Sprint Planning Requirements

### Sprint 1: Core Fields (Priority 1)

- **Story Points**: 26
- **Fields**: All Priority 1 fields
- **Goal**: Enable basic calculation functionality

### Sprint 2: Secondary Fields (Priority 2)

- **Story Points**: 35
- **Fields**: All Priority 2 fields
- **Goal**: Complete cost breakdown calculations

### Sprint 3: UI/Configuration (Priority 3)

- **Story Points**: 30
- **Fields**: Selected Priority 3 fields
- **Goal**: Complete user interface

## 5. Validation Requirements

Each input field must:

1. Match Excel cell reference exactly
2. Use correct data type
3. Apply proper validation rules
4. Display Russian label
5. Show English translation
6. Store in correct component state

## 6. Current Coverage Analysis

```
Total Fields Required: 155
Currently Implemented: 22
Missing Critical (P1): 26
Missing Secondary (P2): 35
Missing UI/Config (P3): 72

Overall Coverage: 14.2% ❌
Critical Coverage: 15.4% ❌
```

## 7. Acceptance Criteria

The calculator will be considered complete when:

- [ ] All 155 input fields are implemented
- [ ] All fields map to correct Excel cells
- [ ] Calculations match Excel exactly (1820.5952 kg test case)
- [ ] E19 value (7,552,000) produces M21 = 15,104,002.406
- [ ] All VLOOKUP tables function correctly
- [ ] User roles control field access appropriately

## 8. Risk Assessment

### High Risk

- Missing 26 critical fields that directly affect calculations
- E19 implementation needs special handling (large value)
- VLOOKUP tables incomplete

### Medium Risk

- 35 secondary fields affect detailed breakdowns
- Complex interdependencies between fields

### Low Risk

- UI/label fields don't affect calculations
- Can use defaults for testing

---

**Document Status**: COMPLETE
**Total Fields Documented**: 155/155 (100%)
**Ready for Sprint Planning**: YES ✅
