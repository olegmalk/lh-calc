# QA Validation Checklist - EPIC-001

**Date**: 2025-08-07  
**Tester**: ******\_\_\_******  
**Environment**: Development  
**Build**: Latest master

## Pre-Test Setup

- [ ] Latest code pulled from repository
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Test data prepared
- [ ] Browser console open for errors

## Test Cases

### TC-001: Pressure/Temperature Field Mapping

**Story**: LH-001  
**Priority**: P0

1. [ ] Navigate to Technical Parts form
2. [ ] Enter Pressure A = 22 bar
3. [ ] Enter Temperature A = 100°C
4. [ ] Submit calculation
5. [ ] Verify calculation uses correct values
6. [ ] Check no console errors

**Expected**: Calculations use 22 for pressure, 100 for temperature  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-002: Position Number Field

**Story**: LH-002  
**Priority**: P0

1. [ ] Navigate to Technical Parts form
2. [ ] Locate "Номер позиции" field
3. [ ] Enter test value "POS-001"
4. [ ] Submit form
5. [ ] Verify value persists

**Expected**: Field accepts and saves value  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-003: Customer Order Number Field

**Story**: LH-002  
**Priority**: P0

1. [ ] Locate "Номер в ОЛ заказчика" field
2. [ ] Enter "CUST-12345"
3. [ ] Submit form
4. [ ] Verify value saved

**Expected**: Field present and functional  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-004: Delivery Type Selection

**Story**: LH-002  
**Priority**: P1

1. [ ] Locate "Тип поставки" dropdown
2. [ ] Select each option
3. [ ] Verify selection saved

**Options**: Standard, Express, Custom  
**Expected**: All options selectable  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-005: Supply Form Rendering

**Story**: LH-003  
**Priority**: P0

1. [ ] Navigate to Supply page (/supply)
2. [ ] Verify all 13 fields present
3. [ ] Check field grouping (3 sections)
4. [ ] Verify default values populated

**Expected**: All fields visible with defaults  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-006: Pricing Fields (Director Role)

**Story**: LH-004  
**Priority**: P0

1. [ ] Set role to "director"
2. [ ] Navigate to Supply page
3. [ ] Verify pricing fields editable
4. [ ] Verify logistics fields read-only
5. [ ] Enter new prices
6. [ ] Save and verify persistence

**Expected**: Only pricing editable  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-007: Logistics Fields (Supply Role)

**Story**: LH-004  
**Priority**: P0

1. [ ] Set role to "supply"
2. [ ] Navigate to Supply page
3. [ ] Verify pricing fields read-only
4. [ ] Verify logistics fields editable
5. [ ] Modify logistics values
6. [ ] Save and verify

**Expected**: Only logistics/corrections editable  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-008: Admin Role Access

**Story**: LH-004  
**Priority**: P1

1. [ ] Set role to "admin"
2. [ ] Navigate to Supply page
3. [ ] Verify all fields editable
4. [ ] Modify various fields
5. [ ] Save changes

**Expected**: Full access to all fields  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-009: Supply Parameters Save

**Story**: LH-006  
**Priority**: P0

1. [ ] Navigate to Supply page
2. [ ] Modify multiple fields
3. [ ] Click Save button
4. [ ] Check success notification
5. [ ] Refresh page
6. [ ] Verify values persist

**Expected**: Values saved to localStorage  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-010: Supply Parameters Reset

**Story**: LH-006  
**Priority**: P1

1. [ ] Modify supply fields
2. [ ] Click Reset button
3. [ ] Verify defaults restored
4. [ ] Check notification shown

**Expected**: All fields reset to defaults  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-011: Russian Translation

**Story**: LH-007  
**Priority**: P1

1. [ ] Set language to Russian
2. [ ] Navigate to Supply page
3. [ ] Verify all labels in Russian
4. [ ] Check no missing translations
5. [ ] Verify number formatting

**Expected**: Complete Russian UI  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-012: English Translation

**Story**: LH-007  
**Priority**: P2

1. [ ] Set language to English
2. [ ] Navigate to Supply page
3. [ ] Verify all labels in English
4. [ ] Check no missing translations

**Expected**: Complete English UI  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-013: Navigation Integration

**Story**: LH-007  
**Priority**: P1

1. [ ] Check Supply in navigation menu
2. [ ] Click Supply menu item
3. [ ] Verify navigation to /supply
4. [ ] Check active state styling

**Expected**: Navigation works correctly  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-014: Calculation with Supply Parameters

**Story**: Integration  
**Priority**: P0

1. [ ] Set custom supply parameters
2. [ ] Save parameters
3. [ ] Navigate to calculations
4. [ ] Run calculation
5. [ ] Verify supply params used
6. [ ] Check cost reflects new prices

**Expected**: Calculations use supply values  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-015: Field Validation

**Story**: LH-003  
**Priority**: P1

1. [ ] Enter negative prices
2. [ ] Enter text in number fields
3. [ ] Leave required fields empty
4. [ ] Enter out-of-range values
5. [ ] Verify validation messages

**Expected**: Proper validation and error messages  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-016: Correction Factor Limits

**Story**: LH-003  
**Priority**: P2

1. [ ] Set correction factor < 1.0
2. [ ] Set correction factor > 2.0
3. [ ] Verify range limits enforced

**Expected**: Factors limited to 1.0-2.0  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-017: localStorage Quota

**Story**: LH-006  
**Priority**: P2

1. [ ] Save many calculations
2. [ ] Check storage usage
3. [ ] Verify quota warnings
4. [ ] Test cleanup mechanism

**Expected**: Graceful handling of storage limits  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-018: Cross-Browser Testing

**Story**: General  
**Priority**: P1

1. [ ] Test in Chrome
2. [ ] Test in Firefox
3. [ ] Test in Safari
4. [ ] Test in Edge

**Expected**: Works in all modern browsers  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

### TC-019: Mobile Responsiveness

**Story**: General  
**Priority**: P2

1. [ ] Test on mobile viewport
2. [ ] Check form layout
3. [ ] Verify navigation menu
4. [ ] Test input interactions

**Expected**: Responsive and usable on mobile  
**Actual**: ******\_\_\_******  
**Pass/Fail**: ******\_\_\_******

---

## Bugs Found

| ID  | Description | Severity | Status |
| --- | ----------- | -------- | ------ |
|     |             |          |        |
|     |             |          |        |
|     |             |          |        |

## Performance Metrics

- Page Load Time: **\_** ms
- Form Submit Time: **\_** ms
- Calculation Time: **\_** ms
- Memory Usage: **\_** MB

## Summary

- **Total Tests**: 19
- **Passed**: **\_**
- **Failed**: **\_**
- **Blocked**: **\_**
- **Pass Rate**: **\_**%

## QA Sign-off

- [ ] All P0 tests passed
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Ready for production

**QA Engineer**: ******\_\_\_******  
**Date**: ******\_\_\_******  
**Signature**: ******\_\_\_******
