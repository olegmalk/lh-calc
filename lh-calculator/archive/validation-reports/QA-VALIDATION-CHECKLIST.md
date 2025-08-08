# QA Validation Checklist: Critical Field Gap Resolution

**Epic**: EPIC-001 Critical Field Gap Resolution  
**QA Lead**: TBD  
**Created**: 2025-08-07  
**Status**: READY FOR TESTING

## Overview

This checklist provides comprehensive validation criteria for QA to verify that all completed work for Phase 1 & 2 meets acceptance criteria and functions correctly.

## Test Environment Setup

### Prerequisites

- [ ] LH Calculator application deployed to staging
- [ ] Test data prepared with known Excel calculations
- [ ] Different user roles configured (director/supply/admin)
- [ ] Browser testing environment set up (Chrome, Firefox, Safari)
- [ ] Mobile/tablet devices available for responsive testing

### Test Data Requirements

- [ ] Sample equipment specifications (K4-750, etc.)
- [ ] Known correct pressure/temperature values
- [ ] Supply parameter test values
- [ ] Expected calculation results from Excel
- [ ] Multi-language test cases (Russian/English)

## Story LH-001: Pressure/Temperature Field Mapping

### Test Cases

#### TC001: Pressure Field Mapping Validation

**Priority**: CRITICAL  
**Steps**:

1. Open technical input form
2. Enter test value in Pressure A field (e.g., 10 bar)
3. Enter test value in Pressure B field (e.g., 8 bar)
4. Verify values appear in correct Excel cell positions
5. Run calculation and verify pressure values used correctly

**Expected Result**:

- [ ] Pressure A maps to Excel cell J27
- [ ] Pressure B maps to Excel cell K27
- [ ] Calculation uses pressure values (not temperature)
- [ ] No field mapping errors in console

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC002: Temperature Field Mapping Validation

**Priority**: CRITICAL  
**Steps**:

1. Open technical input form
2. Enter test value in Temperature A field (e.g., 85°C)
3. Enter test value in Temperature B field (e.g., 25°C)
4. Verify values appear in correct Excel cell positions
5. Run calculation and verify temperature values used correctly

**Expected Result**:

- [ ] Temperature A maps to Excel cell L27
- [ ] Temperature B maps to Excel cell M27
- [ ] Calculation uses temperature values (not pressure)
- [ ] Field labels match expected values

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

## Story LH-002: Missing Technologist Fields

### Test Cases

#### TC003: Six Missing Fields Verification

**Priority**: HIGH  
**Steps**:

1. Open technical input form
2. Locate all 6 previously missing fields
3. Enter test data in each field
4. Save form and reload page
5. Verify data persistence

**Fields to Verify**:

- [ ] Position Number (номер позиции) - D27
- [ ] Customer Order Number (номер в ОЛ заказчика) - E27
- [ ] Delivery Type (тип поставки) - F27
- [ ] Housing Material (материал корпуса) - R27
- [ ] Draw Depth (глубина вытяжки) - T27
- [ ] Cladding Thickness (толщина плакировки) - V27

**Expected Result**:

- [ ] All 6 fields visible in form
- [ ] Russian labels display correctly
- [ ] Data persists after save/reload
- [ ] Fields map to correct Excel cells

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

## Story LH-003: SupplyInputForm Component

### Test Cases

#### TC004: Supply Form Rendering

**Priority**: HIGH  
**Steps**:

1. Navigate to Supply Parameters page
2. Verify all three sections render
3. Count total number of input fields
4. Check default values match specifications

**Expected Result**:

- [ ] Pricing Policy section with 6 fields
- [ ] Logistics section with 3 fields
- [ ] Correction Factors section with 4 fields
- [ ] Total 13 fields present
- [ ] Default values match Excel analysis

**Default Values to Verify**:

- [ ] Plate Material Price: 700 ₽/kg
- [ ] Cladding Material Price: 700 ₽/kg
- [ ] Column/Cover Material Price: 750 ₽/kg
- [ ] Panel Material Price: 650 ₽/kg
- [ ] Labor Rate: 2500 ₽/hour
- [ ] Cutting Cost: 150 ₽/m
- [ ] Internal Logistics Cost: 120,000 ₽
- [ ] Standard Labor Hours: 1 hour
- [ ] Panel Fastener Quantity: 88 pieces
- [ ] Cladding Cutting Correction: 1.05
- [ ] Column Cutting Correction: 1.03
- [ ] Cover Cutting Correction: 1.02
- [ ] Panel Cutting Correction: 1.04

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC005: Supply Form Input Validation

**Priority**: MEDIUM  
**Steps**:

1. Test each field with invalid inputs (negative, text, etc.)
2. Test boundary values (min/max)
3. Verify step increments work correctly
4. Check currency/unit labels display

**Expected Result**:

- [ ] Negative values rejected where inappropriate
- [ ] Text input rejected in number fields
- [ ] Min/max values enforced
- [ ] Step increments work (10, 50, 0.01, etc.)
- [ ] Unit labels display correctly (₽/kg, ₽/час, etc.)

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

## Story LH-004: Role-Based Field Access

### Test Cases

#### TC006: Director Role Access

**Priority**: MEDIUM  
**Steps**:

1. Set userRole to 'director'
2. Open Supply Parameters page
3. Verify pricing fields are editable
4. Verify logistics fields are read-only
5. Verify correction fields are read-only

**Expected Result**:

- [ ] All 6 pricing policy fields editable
- [ ] All 3 logistics fields read-only with disabled styling
- [ ] All 4 correction factor fields read-only
- [ ] "(Read Only)" indicators shown for restricted sections
- [ ] Disabled fields have appropriate visual styling

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC007: Supply Role Access

**Priority**: MEDIUM  
**Steps**:

1. Set userRole to 'supply'
2. Open Supply Parameters page
3. Verify pricing fields are read-only
4. Verify logistics fields are editable
5. Verify correction fields are editable

**Expected Result**:

- [ ] All 6 pricing policy fields read-only
- [ ] All 3 logistics fields editable
- [ ] All 4 correction factor fields editable
- [ ] "(Read Only)" indicators shown for pricing section
- [ ] Editable fields have normal styling

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC008: Admin Role Access

**Priority**: LOW  
**Steps**:

1. Set userRole to 'admin' (default)
2. Open Supply Parameters page
3. Verify all fields are editable
4. Test editing all sections

**Expected Result**:

- [ ] All 13 fields editable
- [ ] No read-only restrictions
- [ ] No "(Read Only)" indicators
- [ ] All sections fully functional

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

## Story LH-005: Supply Parameters Type Integration

### Test Cases

#### TC009: Type Interface Validation

**Priority**: MEDIUM  
**Steps**:

1. Inspect HeatExchangerInput interface
2. Verify all 13 supply fields present
3. Check optional field markings
4. Validate type definitions

**Expected Result**:

- [ ] All 13 supply fields in interface
- [ ] All supply fields marked as optional (?)
- [ ] Type definitions are 'number'
- [ ] Excel cell references documented in comments
- [ ] Interface compiles without TypeScript errors

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

## Story LH-006: SupplyParameters Page

### Test Cases

#### TC010: Page Navigation and Loading

**Priority**: HIGH  
**Steps**:

1. Navigate to /supply-parameters URL directly
2. Click Supply menu item in navigation
3. Verify page loads correctly
4. Test data persistence

**Expected Result**:

- [ ] Page loads without errors
- [ ] Supply form renders correctly
- [ ] Navigation menu highlights correctly
- [ ] Data loads from localStorage if available
- [ ] Default values shown if no saved data

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC011: Data Persistence

**Priority**: HIGH  
**Steps**:

1. Open Supply Parameters page
2. Modify several field values
3. Navigate away from page
4. Return to Supply Parameters page
5. Verify changes were saved

**Expected Result**:

- [ ] Modified values persist across navigation
- [ ] Data saved to localStorage automatically
- [ ] Page loads saved values on return
- [ ] No data loss during session

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

## Story LH-007: Navigation and Translations

### Test Cases

#### TC012: Navigation Integration

**Priority**: MEDIUM  
**Steps**:

1. Open main application
2. Locate Supply menu item
3. Click Supply menu item
4. Verify navigation works correctly

**Expected Result**:

- [ ] Supply menu item visible in navigation
- [ ] Menu item shows "Снабжение" in Russian
- [ ] Menu item shows "Supply" in English
- [ ] Click navigates to supply parameters page
- [ ] Menu styling matches other items

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC013: Russian Translations

**Priority**: MEDIUM  
**Steps**:

1. Set application language to Russian
2. Navigate to Supply Parameters page
3. Verify all text displays in Russian

**Russian Text to Verify**:

- [ ] Page title: "Параметры снабжения"
- [ ] Pricing section: "Ценовая политика"
- [ ] Logistics section: "Логистика"
- [ ] Corrections section: "Поправочные коэффициенты"
- [ ] All field labels in Russian
- [ ] Currency units: ₽/кг, ₽/час, ₽/м
- [ ] Unit labels: час, шт, коэфф

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC014: English Translations

**Priority**: MEDIUM  
**Steps**:

1. Set application language to English
2. Navigate to Supply Parameters page
3. Verify all text displays in English

**English Text to Verify**:

- [ ] Page title: "Supply Parameters"
- [ ] Pricing section: "Pricing Policy"
- [ ] Logistics section: "Logistics"
- [ ] Corrections section: "Correction Factors"
- [ ] All field labels in English
- [ ] Unit labels: hours, pieces, coefficient

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC015: Language Switching

**Priority**: LOW  
**Steps**:

1. Open Supply Parameters page in Russian
2. Switch language to English
3. Verify all text updates
4. Switch back to Russian
5. Verify text updates again

**Expected Result**:

- [ ] All text updates immediately on language change
- [ ] No untranslated strings remain
- [ ] Page layout remains consistent
- [ ] Form data preserved during language switch

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

## Cross-Story Integration Tests

### Test Cases

#### TC016: End-to-End Technologist Workflow

**Priority**: CRITICAL  
**Steps**:

1. Open technical input form
2. Fill all 6 previously missing fields
3. Enter pressure/temperature values
4. Fill remaining technical fields
5. Run calculation
6. Verify results use all input data

**Expected Result**:

- [ ] All technologist fields accessible
- [ ] Data flows correctly to calculation engine
- [ ] Pressure/temperature mapping works correctly
- [ ] Calculation completes without errors
- [ ] Results reflect all input parameters

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC017: End-to-End Supply Workflow

**Priority**: CRITICAL  
**Steps**:

1. Configure supply parameters with test values
2. Set different user role
3. Verify appropriate field access
4. Save supply configuration
5. Run calculation with custom supply parameters

**Expected Result**:

- [ ] Supply parameters save correctly
- [ ] Role-based access enforced
- [ ] Parameters available to calculation engine
- [ ] Calculation uses supply values (not hardcoded)
- [ ] Results reflect custom supply configuration

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

## Performance and Compatibility Tests

### Test Cases

#### TC018: Responsive Design Validation

**Priority**: MEDIUM  
**Steps**:

1. Test Supply Parameters page on desktop (1920x1080)
2. Test on tablet (768x1024)
3. Test on mobile (375x667)
4. Verify all fields accessible and usable

**Expected Result**:

- [ ] All fields visible on all screen sizes
- [ ] Form layout adapts appropriately
- [ ] No horizontal scrolling required
- [ ] Fields remain usable on mobile
- [ ] Grid system works correctly

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

#### TC019: Browser Compatibility

**Priority**: LOW  
**Steps**:

1. Test all functionality in Chrome
2. Test all functionality in Firefox
3. Test all functionality in Safari
4. Note any browser-specific issues

**Expected Result**:

- [ ] Chrome: All tests pass
- [ ] Firefox: All tests pass
- [ ] Safari: All tests pass
- [ ] No major browser-specific issues

**Status**: ⬜ Not Started | ✅ Pass | ❌ Fail  
**Comments**: **\*\***\_\_\_\_**\*\***

## Bug Tracking

### Critical Issues Found

| Issue ID | Description | Status | Assigned To |
| -------- | ----------- | ------ | ----------- |
|          |             |        |             |

### Medium Priority Issues

| Issue ID | Description | Status | Assigned To |
| -------- | ----------- | ------ | ----------- |
|          |             |        |             |

### Low Priority Issues

| Issue ID | Description | Status | Assigned To |
| -------- | ----------- | ------ | ----------- |
|          |             |        |             |

## QA Sign-Off

### Phase 1 (Critical Technologist Fixes)

- **LH-001**: Pressure/Temperature Field Mapping ⬜ PASS | ⬜ FAIL
- **LH-002**: Missing Technologist Fields ⬜ PASS | ⬜ FAIL

### Phase 2 (Supply Tab Implementation)

- **LH-003**: SupplyInputForm Component ⬜ PASS | ⬜ FAIL
- **LH-004**: Role-Based Field Access ⬜ PASS | ⬜ FAIL
- **LH-005**: Supply Parameters Type Integration ⬜ PASS | ⬜ FAIL
- **LH-006**: SupplyParameters Page ⬜ PASS | ⬜ FAIL
- **LH-007**: Navigation and Translations ⬜ PASS | ⬜ FAIL

### Overall Epic Status

- **EPIC-001**: Critical Field Gap Resolution ⬜ READY FOR PROD | ⬜ NEEDS WORK

**QA Lead Signature**: **\*\*\*\***\_**\*\*\*\***  
**Date**: **\*\*\*\***\_**\*\*\*\***  
**Comments**: **\*\*\*\***\_**\*\*\*\***
