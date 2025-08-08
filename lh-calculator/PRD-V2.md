# Product Requirements Document (PRD) - Version 2.0

## LH Calculator - Heat Exchanger Cost Calculation System

---

## 📋 Executive Summary

### Product Name

**LH Calculator** (Калькулятор себестоимости теплообменников)

### Purpose

Web-based cost calculation system for heat exchanger manufacturing that exactly replicates Excel formula logic from "Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7 ДЛЯ БИТРИКС"

### Current Status

- ✅ Core calculation engine implemented (60% field coverage)
- ✅ Basic UI with Russian/English localization
- ⚠️ Missing 40% of required input fields
- ⚠️ Some calculation discrepancies vs Excel
- 🔴 Bitrix24 integration not started

---

## 🎯 Core Requirements

### 1. EXACT Excel Replication

The web application MUST produce **identical results** to the Excel file for all test scenarios.

### 2. Complete Field Coverage

ALL colored cells from Excel MUST be input fields in the application:

- 🟨 Yellow cells = Dropdown selections
- 🟩 Green cells = Manual input fields
- 🟧 Orange cells = Engineering input
- 🔴 Red cells = Management override

### 3. Three-Sheet Structure

Maintain Excel's logical flow:

- **технолог** (Technologist) - Technical specifications input
- **снабжение** (Supply) - Material and cost calculations
- **результат** (Result) - Final cost summary

---

## 📊 Data Model Requirements

### 1. Technical Specifications (технолог)

#### Currently Implemented ✅

- D27: positionNumber (номер у технолога)
- E27: customerOrderNumber (Номер позиции в ОЛ)
- F27: deliveryType (тип поставки)
- G27: equipmentType (типоразмер К4)
- H27: plateConfiguration (ходы)
- I27: plateCount (количество пластин)
- J27: pressureA (Расч Давл по Гор Ст)
- K27: pressureB (Расч Давл по хол ст)
- L27: temperatureA (Расч Темп по Гор Стороне)
- M27: temperatureB (Расч Темп по Хол Стороне)
- P27: materialPlate (материал пластин)
- R27: materialBody (материал корпуса)
- S27: surfaceType (тип поверхности)
- U27: plateThickness (толщина пластины)

#### MISSING - MUST ADD 🔴

- **T27**: plateThicknessDuplicate (толщина пластины дубль) = 5mm
- **V27**: mountingPanelsCount (количество крепежных панелей) = 3
- **N27**: testPressureHot (давление испытания Г) - calculated
- **O27**: testPressureCold (давление испытания Х) - calculated

### 2. Supply Parameters (снабжение)

#### MISSING - MUST ADD 🔴

- **F2**: projectNumber (номер проекта) = "0000"
- **D8**: connectionDiameterHot (диаметр подключения гор) = 700mm
- **E8**: connectionDiameterCold (диаметр подключения хол) = 700mm
- **D9**: connectionMaterial (материал подключений) = "09Г2С"
- **K13**: unitsQuantity (количество аппаратов) = 1
- **P13**: steelPricePerKg (цена за кг стали) = 120000₽
- **G93**: managementFactor (коэффициент управления) - Red/Director
- **G96**: directorsReserve (резерв директора) - Red/Director

### 3. Results (результат)

#### Required Outputs

- F23: Quantity (Количество)
- G23: Component costs (Стоимость компонентов)
- K23: Base equipment cost (Базовая стоимость оборудования)
- N23: Total cost (Итоговая стоимость)
- O23: Labor costs (Стоимость труда)

#### Category Breakdown (J31-J36)

- J31: Corpus/Housing (Корпус)
- J32: Core/Plates (Сердцевина)
- J33: Supports (Опоры)
- J34: Other (Прочее)
- J35: Flanges/Fittings (Фланцы и фитинги)
- J36: Internal Logistics (Внутренняя логистика)

---

## 🔧 Calculation Requirements

### Critical Formulas to Implement

#### 1. Assembly Thickness (M21)

```excel
M21 = (технолог!T27+технолог!U27)*0.001*технолог!I27+2*E19+2*технолог!V27*0.001
```

#### 2. Test Pressures

```excel
N27 = CEILING.PRECISE(J27*1.25, 1)  // Hot test pressure
O27 = CEILING.PRECISE(K27*1.25, 1)  // Cold test pressure
```

#### 3. Material Mass Calculations

Must match Excel exactly:

- К4-750 with 400 plates @ 1mm = 1820.59 kg plate mass
- Component parts total = 118.68 kg
- Use density 0.00788 kg/mm³ for calculations

#### 4. VLOOKUP Operations

Implement 13 equipment type configurations (К4-150 through К4-1200\*600)
with specific dimensions and cost factors.

---

## 🎨 User Interface Requirements

### 1. Form Organization

- Group fields by role (color-coded)
- Show calculated fields as read-only
- Validation messages in Russian/English

### 2. Input Validation

- Plate count: 10-1000
- Plate thickness: 0.4-1.2mm
- Pressure: 0-400 bar
- Temperature: -40 to 200°C

### 3. Localization

- Primary: Russian
- Secondary: English
- All field labels from Excel

---

## 🔄 Integration Requirements

### 1. Bitrix24 CRM

- Export calculations to Bitrix24
- Create deals/quotes
- Attach PDF reports

### 2. Data Persistence

- Save calculations locally
- Load previous calculations
- Export to Excel format

### 3. Export Formats

- PDF report generation
- Excel file with formulas
- CSV data export

---

## ✅ Acceptance Criteria

### 1. Calculation Accuracy

- [ ] ALL test scenarios match Excel ±0.01%
- [ ] Material masses match exactly
- [ ] Cost breakdowns match Excel categories
- [ ] Formula logic identical to Excel

### 2. Field Completeness

- [ ] 100% of colored Excel cells have input fields
- [ ] All dropdowns have correct options
- [ ] Calculated fields show correct values
- [ ] Validation rules match Excel

### 3. User Experience

- [ ] Forms load in <1 second
- [ ] Calculations complete in <2 seconds
- [ ] Clear error messages
- [ ] Responsive design

---

## 📁 Test Data Requirements

### Required Test Scenarios

1. **К4-750 Standard**: 400 plates, 1mm thickness, AISI 316L
2. **К4-150 Minimum**: 10 plates, 0.4mm thickness
3. **К4-1200 Maximum**: 1000 plates, 1.2mm thickness
4. **Multi-unit**: K13 > 1 for batch calculations

### Validation Data Needed

- Excel files with filled test scenarios
- Screenshots of each sheet with test data
- Expected results for each scenario
- Formula trace showing calculations

---

## 🚫 Out of Scope

1. Creating new calculation methods
2. Optimizing Excel formulas
3. Adding features not in Excel
4. Complex user management
5. Real-time collaboration

---

## 📅 Implementation Priority

### Sprint 1 (Immediate)

1. Add missing critical fields (T27, V27, D8, E8, K13, P13)
2. Fix calculation discrepancies
3. Validate against test data

### Sprint 2 (Next)

1. Add remaining fields (F2, D9, G93, G96)
2. Implement VLOOKUP tables
3. Complete validation

### Sprint 3 (Future)

1. Bitrix24 integration
2. Advanced export features
3. Performance optimization

---

## 📝 Notes

- Excel file version: "версия 7 ДЛЯ БИТРИКС"
- 962 formulas across 3 sheets
- 13 equipment type variants
- Color coding is critical for user roles
- Must maintain Excel's calculation precision

---

**Document Version**: 2.0
**Last Updated**: 2025-08-08
**Status**: Ready for Implementation
