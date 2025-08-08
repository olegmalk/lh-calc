# User Stories: Phase 1 & 2 Completed Work

## Story LH-001: Fix Pressure/Temperature Field Mapping

**Story ID**: LH-001  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: COMPLETED  
**Priority**: CRITICAL  
**Story Points**: 1  
**Assignee**: Development Team  
**Completed**: 2025-08-07

### User Story

As a **technologist**, I want **pressure and temperature fields to map to correct Excel cells** so that **calculations use the right input values**.

### Business Context

Field mapping comments were incorrect, causing systematic calculation errors. PressureA was mapped to temperature cells and vice versa.

### Acceptance Criteria

#### AC1: Pressure Field Mapping

- [x] pressureA field maps to Excel cell J27
- [x] pressureB field maps to Excel cell K27
- [x] Code comments reflect correct mapping
- [x] No hardcoded cell references in wrong locations

#### AC2: Temperature Field Mapping

- [x] temperatureA field maps to Excel cell L27
- [x] temperatureB field maps to Excel cell M27
- [x] Code comments reflect correct mapping
- [x] Field labels match Excel column headers

#### AC3: Documentation

- [x] Field mapping verification script created
- [x] Comments updated in types.ts interface
- [x] Mapping errors documented in completion report

### Definition of Done

- [x] Code changes committed
- [x] Field mapping verified against Excel
- [x] Comments corrected in codebase
- [x] No calculation errors from field mapping
- [x] Verification script created and run

### Test Cases Required

- [ ] Unit test: Verify pressureA maps to J27
- [ ] Unit test: Verify pressureB maps to K27
- [ ] Unit test: Verify temperatureA maps to L27
- [ ] Unit test: Verify temperatureB maps to M27
- [ ] Integration test: End-to-end calculation with correct mapping

---

## Story LH-002: Verify Missing Technologist Fields Implementation

**Story ID**: LH-002  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: COMPLETED  
**Priority**: HIGH  
**Story Points**: 2  
**Assignee**: Development Team  
**Completed**: 2025-08-07

### User Story

As a **technologist**, I want **all 6 missing critical fields available in the interface** so that **I can provide complete equipment specifications**.

### Business Context

Gap analysis revealed 6 critical technologist fields were missing, but they were already implemented in previous commits. Verification needed.

### Acceptance Criteria

#### AC1: Position Number Field

- [x] positionNumber field exists in HeatExchangerInput interface (D27)
- [x] Field accessible via TechnicalInputForm
- [x] Russian label: "номер позиции"
- [x] Data persists in localStorage

#### AC2: Customer Order Number Field

- [x] customerOrderNumber field exists (E27)
- [x] Field accessible via form interface
- [x] Russian label: "номер в ОЛ заказчика"
- [x] Prepared for Bitrix24 integration

#### AC3: Delivery Type Field

- [x] deliveryType field exists (F27)
- [x] Field accessible via form interface
- [x] Russian label: "тип поставки"
- [x] Affects pricing calculations

#### AC4: Housing Material Field

- [x] housingMaterial field exists (R27)
- [x] Field accessible via form interface
- [x] Russian label: "материал корпуса"
- [x] Distinct from legacy materialBody field

#### AC5: Draw Depth Field

- [x] drawDepth field exists (T27)
- [x] Field accessible via form interface
- [x] Russian label: "глубина вытяжки"
- [x] Units displayed as mm

#### AC6: Cladding Thickness Field

- [x] claddingThickness field exists (V27)
- [x] Field accessible via form interface
- [x] Russian label: "толщина плакировки"
- [x] Units displayed as mm

### Definition of Done

- [x] All 6 fields verified in interface
- [x] Field mapping documented
- [x] Excel cell references confirmed
- [x] Field coverage report generated
- [x] No missing critical fields

### Test Cases Required

- [ ] Unit test: All 6 fields exist in types interface
- [ ] UI test: All 6 fields render in TechnicalInputForm
- [ ] Integration test: All 6 fields save/load correctly
- [ ] E2E test: Complete technologist workflow with all fields

---

## Story LH-003: Create SupplyInputForm Component

**Story ID**: LH-003  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: COMPLETED  
**Priority**: HIGH  
**Story Points**: 5  
**Assignee**: Development Team  
**Completed**: 2025-08-07

### User Story

As a **supply manager**, I want **a dedicated form to configure pricing and logistics parameters** so that **calculations reflect current market rates**.

### Business Context

Supply parameters were hardcoded in calculation engine. Need configurable UI for pricing policy, logistics, and correction factors.

### Acceptance Criteria

#### AC1: Component Structure

- [x] SupplyInputForm.tsx component created (370 lines)
- [x] SupplyInputData interface defined with 13 fields
- [x] Component uses Mantine UI components
- [x] Responsive design with Grid layout
- [x] Three logical sections: Pricing, Logistics, Corrections

#### AC2: Pricing Policy Section (Director Access)

- [x] plateMaterialPricePerKg field (D8) with default 700 ₽/kg
- [x] claddingMaterialPricePerKg field (E8) with default 700 ₽/kg
- [x] columnCoverMaterialPricePerKg field (F8) with default 750 ₽/kg
- [x] panelMaterialPricePerKg field (G8) with default 650 ₽/kg
- [x] laborRatePerHour field (A12) with default 2500 ₽/hour
- [x] cuttingCostPerMeter field (A13) with default 150 ₽/m

#### AC3: Logistics Section (Supply Access)

- [x] internalLogisticsCost field (P13) with default 120,000 ₽
- [x] standardLaborHours field (K13) with default 1 hour
- [x] panelFastenerQuantity field (P19) with default 88 pieces

#### AC4: Correction Factors Section (Supply Access)

- [x] claddingCuttingCorrection field (A14) with default 1.05
- [x] columnCuttingCorrection field (A15) with default 1.03
- [x] coverCuttingCorrection field (A16) with default 1.02
- [x] panelCuttingCorrection field (A17) with default 1.04

#### AC5: Input Validation

- [x] All numeric inputs with appropriate min/max/step values
- [x] Currency fields show ₽ suffix
- [x] Unit labels displayed (кг, час, м, шт, коэфф)
- [x] Form validation prevents invalid values

### Definition of Done

- [x] Component renders without errors
- [x] All 13 fields functional with correct defaults
- [x] Input validation working
- [x] Excel cell references documented
- [x] Component integrated with parent forms

### Test Cases Required

- [ ] Unit test: Component renders with all fields
- [ ] Unit test: Default values match Excel analysis
- [ ] Unit test: Input validation works correctly
- [ ] Unit test: onChange callbacks function properly
- [ ] Integration test: Form data persists correctly

---

## Story LH-004: Implement Role-Based Field Access

**Story ID**: LH-004  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: COMPLETED  
**Priority**: MEDIUM  
**Story Points**: 3  
**Assignee**: Development Team  
**Completed**: 2025-08-07

### User Story

As a **system administrator**, I want **role-based access control for supply fields** so that **users only edit parameters they're authorized to change**.

### Business Context

Different departments should have access to different fields. Directors control pricing, supply manages logistics, technologists handle equipment specs.

### Acceptance Criteria

#### AC1: Role Definition

- [x] User roles defined: 'director', 'supply', 'technologist', 'admin'
- [x] Role prop added to SupplyInputForm interface
- [x] Default role set to 'admin' for development
- [x] Role-based permission logic implemented

#### AC2: Director Access Controls

- [x] Director can edit all pricing policy fields
- [x] Director cannot edit logistics fields
- [x] Director cannot edit correction factors
- [x] Non-director users see pricing fields as read-only

#### AC3: Supply Access Controls

- [x] Supply can edit logistics fields
- [x] Supply can edit correction factors
- [x] Supply cannot edit pricing policy fields
- [x] Non-supply users see supply fields as read-only

#### AC4: Admin Override

- [x] Admin role can edit all fields
- [x] Admin serves as development/testing role
- [x] Admin access clearly documented

#### AC5: UI Feedback

- [x] Read-only fields have disabled styling
- [x] Read-only sections show "(Read Only)" indicator
- [x] User can see access level for each section
- [x] Disabled fields have appropriate visual cues

### Definition of Done

- [x] Role-based access logic implemented
- [x] UI correctly reflects access permissions
- [x] All roles tested with appropriate field access
- [x] Visual feedback for disabled fields
- [x] Permission logic documented

### Test Cases Required

- [ ] Unit test: Director can edit pricing fields only
- [ ] Unit test: Supply can edit logistics/corrections only
- [ ] Unit test: Admin can edit all fields
- [ ] Unit test: Read-only fields prevent changes
- [ ] UI test: Visual feedback correct for each role

---

## Story LH-005: Add Supply Parameters to Types Interface

**Story ID**: LH-005  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: COMPLETED  
**Priority**: HIGH  
**Story Points**: 2  
**Assignee**: Development Team  
**Completed**: 2025-08-07

### User Story

As a **developer**, I want **supply parameters integrated into the main types interface** so that **calculation engine can access pricing data**.

### Business Context

HeatExchangerInput interface needs supply fields to support configurable pricing instead of hardcoded values.

### Acceptance Criteria

#### AC1: Interface Extension

- [x] HeatExchangerInput interface extended with supply fields
- [x] All 13 supply fields added as optional properties
- [x] Excel cell references documented in comments
- [x] Field groupings maintained (pricing, logistics, corrections)

#### AC2: Pricing Policy Fields

- [x] plateMaterialPricePerKg field added (D8)
- [x] claddingMaterialPricePerKg field added (E8)
- [x] columnCoverMaterialPricePerKg field added (F8)
- [x] panelMaterialPricePerKg field added (G8)
- [x] laborRatePerHour field added (A12)
- [x] cuttingCostPerMeter field added (A13)

#### AC3: Logistics Fields

- [x] internalLogisticsCost field added (P13)
- [x] standardLaborHours field added (K13)
- [x] panelFastenerQuantity field added (P19)

#### AC4: Correction Factor Fields

- [x] claddingCuttingCorrection field added (A14)
- [x] columnCuttingCorrection field added (A15)
- [x] coverCuttingCorrection field added (A16)
- [x] panelCuttingCorrection field added (A17)

#### AC5: Type Safety

- [x] All fields properly typed (number)
- [x] Optional fields marked with ? operator
- [x] Comments include Russian field names
- [x] Interface compiles without errors

### Definition of Done

- [x] Types interface updated and compiles
- [x] All supply fields accessible via interface
- [x] Excel mapping documented
- [x] No breaking changes to existing code
- [x] Type safety maintained

### Test Cases Required

- [ ] Unit test: Interface includes all 13 supply fields
- [ ] Unit test: All supply fields are optional
- [ ] Unit test: Type checking works correctly
- [ ] Integration test: Supply data flows through interface

---

## Story LH-006: Create SupplyParameters Page

**Story ID**: LH-006  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: COMPLETED  
**Priority**: MEDIUM  
**Story Points**: 3  
**Assignee**: Development Team  
**Completed**: 2025-08-07

### User Story

As a **supply manager**, I want **a dedicated page for configuring supply parameters** so that **I have a focused workspace for pricing management**.

### Business Context

Supply parameters need dedicated UI separate from technical parameters. Users need clear workspace for pricing and logistics configuration.

### Acceptance Criteria

#### AC1: Page Creation

- [x] SupplyParameters.tsx page created (100 lines)
- [x] Page uses SupplyInputForm component
- [x] Page handles data loading/saving
- [x] Page integrated with routing system

#### AC2: Data Management

- [x] Supply parameters load from localStorage
- [x] Supply parameters save on form changes
- [x] Default values used when no saved data exists
- [x] Form state managed properly

#### AC3: User Experience

- [x] Page has clear title "Supply Parameters"
- [x] Form sections organized logically
- [x] Save/load operations transparent to user
- [x] Responsive design works on all devices

#### AC4: Role Integration

- [x] Page respects user role permissions
- [x] Role-based field access implemented
- [x] Read-only fields handled correctly
- [x] Admin role defaults for development

### Definition of Done

- [x] Page renders correctly
- [x] Data persistence working
- [x] Form integration complete
- [x] Role-based access functional
- [x] Page accessible via navigation

### Test Cases Required

- [ ] E2E test: Navigate to supply parameters page
- [ ] E2E test: Edit supply parameters and verify save
- [ ] E2E test: Reload page and verify data persistence
- [ ] Unit test: Page loads default values correctly
- [ ] Unit test: Role-based access enforced

---

## Story LH-007: Add Supply Navigation and Translations

**Story ID**: LH-007  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: COMPLETED  
**Priority**: LOW  
**Story Points**: 2  
**Assignee**: Development Team  
**Completed**: 2025-08-07

### User Story

As a **supply manager**, I want **supply parameters accessible from main navigation** and **all text in Russian/English** so that **I can efficiently access my workspace**.

### Business Context

Supply functionality needs proper navigation integration and full localization for Russian/English users.

### Acceptance Criteria

#### AC1: Navigation Integration

- [x] "Supply Parameters" menu item added to main navigation
- [x] Route `/supply-parameters` configured in router
- [x] Menu item shows "Снабжение" in Russian
- [x] Menu item shows "Supply" in English
- [x] Navigation link properly styled

#### AC2: Russian Translations

- [x] supply.title = "Параметры снабжения"
- [x] supply.sections.pricingPolicy = "Ценовая политика"
- [x] supply.sections.logistics = "Логистика"
- [x] supply.sections.corrections = "Поправочные коэффициенты"
- [x] All 13 field labels translated
- [x] Unit labels translated (₽/кг, ₽/час, etc.)

#### AC3: English Translations

- [x] supply.title = "Supply Parameters"
- [x] supply.sections.pricingPolicy = "Pricing Policy"
- [x] supply.sections.logistics = "Logistics"
- [x] supply.sections.corrections = "Correction Factors"
- [x] All 13 field labels translated
- [x] Unit labels in English

#### AC4: Translation Integration

- [x] All text uses useTranslation hook
- [x] Language switching works correctly
- [x] No hardcoded strings in components
- [x] Translation keys follow consistent naming

### Definition of Done

- [x] Navigation menu includes supply link
- [x] Supply page accessible via menu
- [x] All text properly localized
- [x] Language switching functional
- [x] Translation coverage complete

### Test Cases Required

- [ ] E2E test: Click supply link in navigation
- [ ] E2E test: Switch language and verify translations
- [ ] Unit test: All translation keys exist
- [ ] Unit test: Translation hook integration works
- [ ] Visual test: UI layout works in both languages

---

## Stories Needed for Testing & Validation

## Story LH-008: Write Comprehensive Test Suite

**Story ID**: LH-008  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: TODO  
**Priority**: HIGH  
**Story Points**: 8  
**Assignee**: TBD

### User Story

As a **QA engineer**, I want **comprehensive test coverage for all completed functionality** so that **we can validate field gap resolution works correctly**.

### Business Context

Completed work lacks test coverage. Need comprehensive test suite to validate:

- Field mapping corrections
- Supply form functionality
- Role-based access
- Data persistence
- Translation coverage

### Acceptance Criteria

#### AC1: Unit Tests for Field Mapping (LH-001)

- [ ] Test pressure field mapping (J27/K27)
- [ ] Test temperature field mapping (L27/M27)
- [ ] Test field comment corrections
- [ ] Verify no incorrect mappings remain

#### AC2: Unit Tests for Missing Fields (LH-002)

- [ ] Test all 6 fields exist in interface
- [ ] Test field rendering in forms
- [ ] Test data persistence for all fields
- [ ] Validate Excel cell references

#### AC3: Unit Tests for SupplyInputForm (LH-003)

- [ ] Test component renders with all 13 fields
- [ ] Test default values match Excel analysis
- [ ] Test input validation (min/max/step)
- [ ] Test onChange callbacks
- [ ] Test currency/unit formatting

#### AC4: Unit Tests for Role-Based Access (LH-004)

- [ ] Test director role permissions
- [ ] Test supply role permissions
- [ ] Test admin role permissions
- [ ] Test read-only field behavior
- [ ] Test visual feedback for disabled fields

#### AC5: Integration Tests

- [ ] Test supply data flows through types interface
- [ ] Test localStorage persistence
- [ ] Test navigation to supply page
- [ ] Test language switching
- [ ] Test end-to-end supply workflow

#### AC6: E2E Tests

- [ ] Complete technologist workflow with all fields
- [ ] Complete supply workflow with role restrictions
- [ ] Cross-language functionality testing
- [ ] Data persistence across browser sessions

### Definition of Done

- [ ] Test coverage >80% for all new components
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Test documentation complete

---

## Story LH-009: Validate Calculation Accuracy

**Story ID**: LH-009  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: TODO  
**Priority**: CRITICAL  
**Story Points**: 5  
**Assignee**: TBD

### User Story

As a **business stakeholder**, I want **validation that field gap resolution improved calculation accuracy to 90%+** so that **the system produces reliable cost estimates**.

### Business Context

Primary goal of field gap resolution is improving calculation accuracy from 20-60% to 90%+. Need systematic validation with real data.

### Acceptance Criteria

#### AC1: Test Data Preparation

- [ ] Obtain real equipment specifications
- [ ] Get expected calculation results from Excel
- [ ] Prepare test cases covering different equipment types
- [ ] Include edge cases and boundary conditions

#### AC2: Calculation Engine Integration

- [ ] Update calculation engine to use supply parameters
- [ ] Replace hardcoded values with configurable inputs
- [ ] Verify all 13 supply fields affect calculations
- [ ] Test calculation with different supply configurations

#### AC3: Accuracy Validation

- [ ] Run calculations with same inputs as Excel
- [ ] Compare results for accuracy (target 90%+)
- [ ] Document accuracy improvements
- [ ] Identify any remaining discrepancies

#### AC4: Performance Testing

- [ ] Test calculation speed with all fields
- [ ] Verify no performance regression
- [ ] Test with multiple concurrent calculations
- [ ] Validate memory usage acceptable

### Definition of Done

- [ ] Calculation accuracy validated at 90%+
- [ ] All supply parameters integrated in engine
- [ ] Performance benchmarks met
- [ ] Accuracy report completed
- [ ] Any remaining issues documented

## Definition of Done (All Stories)

### Code Quality

- [ ] Code follows project standards
- [ ] All linting rules pass
- [ ] TypeScript types properly defined
- [ ] No console errors or warnings

### Testing

- [ ] Unit tests written for all new functions
- [ ] Integration tests cover component interactions
- [ ] E2E tests validate user workflows
- [ ] Test coverage targets met

### Documentation

- [ ] Code comments added where needed
- [ ] README updated if applicable
- [ ] API documentation current
- [ ] User documentation updated

### Deployment

- [ ] Changes deployed to staging
- [ ] QA validation complete
- [ ] Performance benchmarks met
- [ ] Ready for production deployment

### Client Acceptance

- [ ] Functionality demonstrated to client
- [ ] Client acceptance criteria met
- [ ] Any client feedback incorporated
- [ ] Sign-off received for story completion
