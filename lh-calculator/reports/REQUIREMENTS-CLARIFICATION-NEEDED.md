# 📋 REQUIREMENTS CLARIFICATION DOCUMENT

## LH Calculator - Critical Gaps and Uncertainties

**Date**: 2025-08-07  
**Status**: 🔴 URGENT - Awaiting Client Clarification  
**Prepared By**: BMAD Team

---

## EXECUTIVE SUMMARY

After thorough analysis of user feedback and Excel source files, we've discovered that our current implementation covers only **~30%** of required functionality. We need immediate clarification on requirements to proceed.

### Coverage Status:

- **Технолог Tab**: 60% implemented (6/10 critical fields missing)
- **Снабжение Tab**: 0% implemented (ALL fields missing)
- **Результат Tab**: 100% implemented (calculations work)

---

## PART 1: WHAT WE KNOW FOR CERTAIN ✅

### 1.1 CONFIRMED MISSING FIELDS (Технолог Tab)

These fields MUST be added based on Excel analysis:

| Field                | Excel Cell | Current Status | Impact                      |
| -------------------- | ---------- | -------------- | --------------------------- |
| Номер позиции        | D27        | ❌ Missing     | Required for identification |
| Номер в ОЛ заказчика | E27        | ❌ Missing     | Required for Bitrix24       |
| Тип поставки         | F27        | ❌ Missing     | Affects pricing             |
| Материал корпуса     | R27        | ❌ Missing     | Major cost component        |
| Глубина вытяжки      | T27        | ❌ Missing     | Geometry calculations       |
| Толщина плакировки   | V27        | ❌ Missing     | Material costs              |

### 1.2 CONFIRMED FIELD MAPPING ERRORS

**CRITICAL BUG**: Pressure and Temperature fields are SWAPPED:

- `pressureA` currently maps to Temperature (WRONG)
- `temperatureA` currently maps to Pressure (WRONG)

### 1.3 CONFIRMED MISSING SUPPLY INPUTS

The entire снабжение (supply) tab is missing. Currently hardcoded values that SHOULD be user inputs:

**Material Prices** (Currently hardcoded, should be editable):

```javascript
// CURRENT (WRONG - Hardcoded)
'AISI 316L': { pricePerKg: 850 }  // Should be user input
'AISI 304': { pricePerKg: 750 }   // Should be user input
```

**Excel Shows These Are Inputs**:

- D8: Plate material price/kg = 700 ₽
- E8: Cladding material price/kg = 700 ₽
- F8: Column material price/kg = User input
- G8: Cover material price/kg = User input

### 1.4 CONFIRMED CALCULATION DEPENDENCIES

**147 formulas** depend on missing технолог fields  
**89 formulas** depend on missing снабжение inputs  
**Result**: Cost calculations are 40-80% inaccurate

---

## PART 2: WHAT WE NEED CLARIFICATION ON ❓

### 2.1 USER ROLES AND ACCESS LEVELS

**QUESTION 1**: Who should have access to which inputs?

We identified 3 potential user roles from Excel structure:

1. **Технолог (Technologist)** - Equipment configuration
2. **Снабжение (Supply/Procurement)** - Prices and materials
3. **Директор (Director)** - Pricing policy and margins

**Do you need**:

- [ ] Single user with access to everything?
- [ ] Role-based access with different permissions?
- [ ] Separate interfaces for each department?

### 2.2 PRICING CONFIGURATION

**QUESTION 2**: How should pricing be managed?

Currently we hardcode all prices. Excel shows these as inputs:

**Option A**: All prices editable by any user  
**Option B**: Prices locked, changed only by admin  
**Option C**: Prices pulled from Bitrix24 CRM  
**Option D**: Different price lists for different projects

**Which approach do you prefer?** ******\_\_\_******

### 2.3 SUPPLY TAB INPUTS

**QUESTION 3**: Which снабжение fields should users edit?

Excel снабжение tab has 50+ potential inputs. Should users edit:

**Essential** (Must have?):

- [ ] Material prices per kg (6 fields)
- [ ] Labor rates per hour
- [ ] Logistics costs
- [ ] Markup percentages

**Component Prices** (Need these?):

- [ ] Flange prices (30+ combinations)
- [ ] Fastener prices
- [ ] Gasket prices
- [ ] Other component costs

**Correction Factors** (Need these?):

- [ ] Cutting corrections
- [ ] Waste factors
- [ ] Processing multipliers

### 2.4 BITRIX24 FIELD MAPPING

**QUESTION 4**: Which fields must sync with Bitrix24?

We found "Номер в ОЛ заказчика" (E27) references Bitrix. What else needs to sync?

- [ ] Customer order number
- [ ] Position numbers
- [ ] Material prices
- [ ] Calculated costs
- [ ] Project metadata
- [ ] Other: ******\_\_\_******

### 2.5 HISTORICAL DATA

**QUESTION 5**: Do you have existing calculations that need migration?

- [ ] No, starting fresh
- [ ] Yes, need to import Excel files
- [ ] Yes, need to import from Bitrix24
- [ ] Other: ******\_\_\_******

---

## PART 3: CRITICAL DECISIONS NEEDED 🚨

### 3.1 IMMEDIATE BLOCKERS

Before we can continue, we MUST know:

1. **Should we add ALL missing технолог fields?** YES / NO
2. **Should supply prices be user-editable?** YES / NO
3. **Do you need role-based access?** YES / NO
4. **Should prices sync with Bitrix24?** YES / NO

### 3.2 SPRINT 2 IMPACT

Current Sprint 2 plan includes:

- localStorage save/load
- Excel export
- Bitrix24 integration
- Project grouping

**Should we**:

- [ ] Pause Sprint 2 and fix missing fields first
- [ ] Continue Sprint 2 with current (incomplete) fields
- [ ] Do both in parallel
- [ ] Other: ******\_\_\_******

### 3.3 VALIDATION APPROACH

**How should we validate our fixes?**

- [ ] You provide Excel file with test cases
- [ ] You test and provide feedback
- [ ] We create test cases for your approval
- [ ] Other: ******\_\_\_******

---

## PART 4: PROPOSED SOLUTION 💡

Based on our analysis, we recommend:

### Phase 1: Critical Fixes (2-3 days)

1. Fix pressure/temperature field swap
2. Add 6 missing технолог fields
3. Add density fix to production

### Phase 2: Supply Tab Implementation (3-4 days)

1. Create pricing configuration interface
2. Add supply input fields
3. Update calculation engine

### Phase 3: Role-Based Access (2-3 days)

1. Implement user roles
2. Create department-specific views
3. Add permission controls

### Phase 4: Original Sprint 2 (10 days)

1. Save/load functionality
2. Excel export
3. Bitrix24 integration
4. Project management

**Total Timeline**: ~3 weeks (vs original 2 weeks)

---

## PART 5: INFORMATION WE NEED 📨

Please provide:

1. **Confirmed field list** - Which fields are absolutely required?
2. **User roles description** - Who uses the system and for what?
3. **Bitrix24 field mapping** - Exact field IDs for integration
4. **Test data** - Sample calculations with expected results
5. **Pricing rules** - How prices should be managed
6. **Priority order** - What's most important to fix first?

### Example Format for Field Confirmation:

```
Field: Номер позиции
Required: YES
Editable by: Технолог
Validation: Required, alphanumeric
Syncs with Bitrix: YES, field ID: UF_POSITION_NUMBER
```

---

## NEXT STEPS

1. **Client reviews this document** and provides clarifications
2. **We update requirements** based on feedback
3. **Revise development plan** with accurate scope
4. **Begin implementation** of confirmed requirements

### Contact for Clarification:

- **Email**: olegmalkov2023@gmail.com
- **Project Demo**: http://34.88.248.65:10000/

---

## APPENDIX: Technical Details

### Current Implementation Files:

- Form: `/src/components/TechnicalInputFormSimple.tsx`
- Engine: `/src/lib/calculation-engine/engine-v2.ts`
- Constants: `/src/lib/calculation-engine/constants.ts`

### Gap Analysis Reports:

- Технолог analysis: `/reports/technolog-fields-gap-analysis.md`
- Снабжение analysis: `/reports/supply-tab-analysis.md`
- Density fix: `/reports/density-fix-summary.md`

### Excel Source:

- File: `Себестоимость ТЕПЛОБЛОК...ДЛЯ БИТРИКС.xlsx`
- Formulas extracted: `/excel_formulas.json`

---

**Please respond with clarifications as soon as possible to unblock development.**
