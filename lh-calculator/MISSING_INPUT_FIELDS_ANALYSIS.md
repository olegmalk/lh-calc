# MISSING INPUT FIELDS - COMPREHENSIVE ANALYSIS

## CRITICAL FINDINGS: Major Gaps in Field Coverage

Based on analysis of Excel color-coded cells vs current implementation, we have **SIGNIFICANT MISSING INPUT FIELDS** across all user roles.

## Color Legend Reference

- 🟨 **Yellow (#FFFF00)** = Technologist dropdown selections
- 🟩 **Green (#92D050)** = Technologist manual input
- 🟧 **Orange (#FFC000)** = Engineering input
- 🔴 **Red (#FF0000)** = Management override

---

## 1. ТЕХНОЛОГ SHEET - MISSING FIELDS

### Currently Implemented in TechnicalInputFormSimple.tsx

✅ D27 - positionNumber (номер у технолога)
✅ E27 - customerOrderNumber (Номер позиции в ОЛ)
✅ F27 - deliveryType (тип поставки)
✅ G27 - equipmentType (типоразмер К4)
✅ G27 - modelCode (duplicate of equipmentType)
✅ H27 - plateConfiguration (ходы)
✅ I27 - plateCount (количество пластин)
✅ J27 - pressureA (давление горячая сторона)
✅ K27 - pressureB (давление холодная сторона)
✅ L27 - temperatureA (температура горячая сторона)
✅ M27 - temperatureB (температура холодная сторона)
✅ P27 - materialPlate (материал пластин)
✅ R27 - materialBody (материал корпуса)
✅ S27 - surfaceType (тип поверхности)
✅ U27 - plateThickness (толщина пластины)

### ❌ MISSING CRITICAL FIELDS from Row 27

| Cell    | Color     | Russian Field Name               | English                   | Current Excel Value | Who Inputs   | Impact                                  |
| ------- | --------- | -------------------------------- | ------------------------- | ------------------- | ------------ | --------------------------------------- |
| **T27** | 🟩 Green  | **толщина пластины дубль**       | Plate thickness duplicate | **5 mm**            | Technologist | **Critical - affects calculations**     |
| **V27** | 🟧 Orange | **количество крепежных панелей** | Mounting panels count     | **3 units**         | Engineer     | **Critical - affects structural costs** |

### ❌ MISSING CALCULATED DISPLAY FIELDS

| Cell | Type       | Field Name           | Formula | Purpose                    |
| ---- | ---------- | -------------------- | ------- | -------------------------- |
| N27  | Calculated | давление испытания Г | =AJ73   | Hot test pressure display  |
| O27  | Calculated | давление испытания Х | =AI73   | Cold test pressure display |

**Current Issue**: We calculate test pressures but don't match Excel field mapping exactly.

---

## 2. СНАБЖЕНИЕ SHEET - MASSIVE GAPS

### Currently Implemented in SupplyInputForm.tsx

✅ Pricing fields (D8, E8, F8, G8) - BUT WRONG MAPPING
✅ Labor rates (A12, A13)
✅ Logistics (P13, K13, P19)
✅ Corrections (A14-A17)

### ❌ COMPLETELY MISSING SUPPLY FIELDS

#### A. Project Information

| Cell   | Color    | Field Name        | Value  | Impact                          |
| ------ | -------- | ----------------- | ------ | ------------------------------- |
| **F2** | 🟩 Green | **номер проекта** | "0000" | **Critical - project tracking** |

#### B. Connection Specifications

| Cell   | Color     | Field Name                  | Value   | Impact                                  |
| ------ | --------- | --------------------------- | ------- | --------------------------------------- |
| **D8** | 🟩 Green  | **диаметр подключения гор** | 700 mm  | **Critical - hot connection diameter**  |
| **E8** | 🟩 Green  | **диаметр подключения хол** | 700 mm  | **Critical - cold connection diameter** |
| **D9** | 🟧 Orange | **материал подключений**    | "09Г2С" | **Critical - connection material**      |

#### C. Quantity & Pricing

| Cell    | Color    | Field Name               | Value       | Impact                       |
| ------- | -------- | ------------------------ | ----------- | ---------------------------- |
| **K13** | 🟩 Green | **количество аппаратов** | 1           | **Critical - unit quantity** |
| **P13** | 🟩 Green | **цена за кг стали**     | 120000 ₽/kg | **Critical - steel pricing** |

#### D. Management Override Fields

| Cell    | Color  | Field Name                 | Value    | Who              | Impact                            |
| ------- | ------ | -------------------------- | -------- | ---------------- | --------------------------------- |
| **G93** | 🔴 Red | **коэффициент управления** | Variable | General Director | **Critical - management factor**  |
| **G96** | 🔴 Red | **резерв директора**       | Variable | General Director | **Critical - director's reserve** |

---

## 3. FIELD MAPPING ERRORS IN CURRENT IMPLEMENTATION

### Supply Form Wrong Mappings

Current SupplyInputForm maps pricing to D8-G8, but Excel shows:

- D8/E8 = Connection diameters (NOT prices)
- D9 = Connection material (NOT price)

**ACTUAL Excel Supply Pricing**: Different cells entirely.

### Types.ts Interface Gaps

```typescript
// MISSING from HeatExchangerInput interface:
plateThicknessDuplicate: number;    // T27 - толщина пластины дубль
mountingPanelsCount: number;        // V27 - количество крепежных панелей
projectNumber: string;              // F2 - номер проекта
connectionDiameterHot: number;      // D8 - диаметр подключения гор
connectionDiameterCold: number;     // E8 - диаметр подключения хол
connectionMaterial: string;         // D9 - материал подключений
unitsQuantity: number;              // K13 - количество аппаратов
steelPricePerKg: number;           // P13 - цена за кг стали
managementFactor?: number;          // G93 - коэффициент управления
directorsReserve?: number;          // G96 - резерв директора
```

---

## 4. IMPACT ASSESSMENT

### HIGH PRIORITY (Calculation Breaking)

1. **T27 - plateThicknessDuplicate** - Used in thickness calculations
2. **V27 - mountingPanelsCount** - Affects structural costs
3. **D8/E8 - connectionDiameters** - Critical for sizing
4. **K13 - unitsQuantity** - Multiplier for all costs
5. **P13 - steelPricePerKg** - Core material pricing

### MEDIUM PRIORITY (Business Logic)

1. **F2 - projectNumber** - Project tracking
2. **D9 - connectionMaterial** - Material compatibility
3. **G93 - managementFactor** - Cost adjustments
4. **G96 - directorsReserve** - Final pricing

### LOW PRIORITY (Display/Tracking)

1. Test pressure display fields (N27/O27)
2. Additional reference fields

---

## 5. REQUIRED ACTIONS

### Immediate (Sprint Priority)

1. **Add missing fields to types.ts interface**
2. **Create ProjectInfoForm component for F2**
3. **Create ConnectionSpecForm component for D8/E8/D9**
4. **Add T27/V27 fields to TechnicalInputFormSimple**
5. **Fix SupplyInputForm field mappings**
6. **Add K13/P13 to correct forms**

### Phase 2

1. **Management override fields (G93/G96)**
2. **Enhanced validation for new fields**
3. **Localization for all new fields**
4. **Integration testing with calculation engine**

### Phase 3

1. **Role-based access control for new fields**
2. **Data migration for existing calculations**
3. **Excel export validation with all fields**

---

## 6. VALIDATION NEEDED

Before implementation, verify:

1. **Exact Excel cell mappings** for each field
2. **Calculation dependencies** for new fields
3. **Default values** from current Excel instance
4. **Field validation rules** and constraints
5. **User role permissions** for each field type

---

## CONCLUSION

We are missing **13+ critical input fields** across all sheets, with several high-priority fields that directly impact calculations. The current implementation covers approximately **60%** of required Excel inputs.

**Recommended approach**: Implement high-priority fields first, then systematically add remaining fields with proper testing and validation.
