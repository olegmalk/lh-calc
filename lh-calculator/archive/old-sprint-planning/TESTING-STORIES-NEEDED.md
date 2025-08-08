# Testing Stories Required for Critical Field Gap Resolution

**Epic**: EPIC-001 Critical Field Gap Resolution  
**Created**: 2025-08-07  
**Priority**: HIGH  
**Status**: READY FOR SPRINT PLANNING

## Overview

The completed Phase 1 & 2 work lacks comprehensive test coverage. These stories define the testing work needed to validate that all acceptance criteria are met and the system works correctly.

## Testing Story Summary

| Story ID | Title                               | Priority | Story Points | Status |
| -------- | ----------------------------------- | -------- | ------------ | ------ |
| LH-008   | Write Comprehensive Test Suite      | HIGH     | 8            | TODO   |
| LH-009   | Validate Calculation Accuracy       | CRITICAL | 5            | TODO   |
| LH-010   | Performance and Load Testing        | MEDIUM   | 3            | TODO   |
| LH-011   | Cross-Browser Compatibility Testing | LOW      | 2            | TODO   |
| LH-012   | Accessibility Testing               | LOW      | 2            | TODO   |

**Total Story Points**: 20  
**Estimated Effort**: 2.5 developer days

---

## Story LH-008: Write Comprehensive Test Suite

**Story ID**: LH-008  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: TODO  
**Priority**: HIGH  
**Story Points**: 8  
**Assignee**: TBD  
**Dependencies**: Phase 1 & 2 completion

### User Story

As a **QA engineer**, I want **comprehensive automated test coverage for all completed functionality** so that **we can validate field gap resolution works correctly and prevent regressions**.

### Business Context

Completed work (7 stories) lacks proper test coverage. Need comprehensive test suite covering unit, integration, and E2E tests to validate:

- Field mapping corrections (LH-001)
- Missing field implementation (LH-002)
- Supply form functionality (LH-003)
- Role-based access (LH-004)
- Type integration (LH-005)
- Page functionality (LH-006)
- Navigation & translations (LH-007)

### Acceptance Criteria

#### AC1: Unit Tests for Field Mapping (LH-001)

- [ ] Test `pressureA` correctly maps to Excel cell J27
- [ ] Test `pressureB` correctly maps to Excel cell K27
- [ ] Test `temperatureA` correctly maps to Excel cell L27
- [ ] Test `temperatureB` correctly maps to Excel cell M27
- [ ] Test field comments are corrected in codebase
- [ ] Test no incorrect mappings remain in types interface

#### AC2: Unit Tests for Missing Fields (LH-002)

- [ ] Test all 6 fields exist in `HeatExchangerInput` interface
- [ ] Test `positionNumber` field (D27) renders and persists
- [ ] Test `customerOrderNumber` field (E27) renders and persists
- [ ] Test `deliveryType` field (F27) renders and persists
- [ ] Test `housingMaterial` field (R27) renders and persists
- [ ] Test `drawDepth` field (T27) renders and persists
- [ ] Test `claddingThickness` field (V27) renders and persists
- [ ] Test field data persistence in localStorage

#### AC3: Unit Tests for SupplyInputForm Component (LH-003)

- [ ] Test component renders without errors
- [ ] Test all 13 supply fields render correctly
- [ ] Test default values match Excel analysis specifications
- [ ] Test input validation (min/max/step values)
- [ ] Test onChange callbacks for all fields
- [ ] Test currency and unit formatting (₽/kg, ₽/час, etc.)
- [ ] Test form sections render (Pricing, Logistics, Corrections)

#### AC4: Unit Tests for Role-Based Access (LH-004)

- [ ] Test director role: can edit pricing, cannot edit logistics/corrections
- [ ] Test supply role: can edit logistics/corrections, cannot edit pricing
- [ ] Test admin role: can edit all fields
- [ ] Test read-only field styling and behavior
- [ ] Test "(Read Only)" indicators display correctly
- [ ] Test disabled field interaction prevention

#### AC5: Integration Tests

- [ ] Test supply data flows correctly through `HeatExchangerInput` interface
- [ ] Test SupplyParameters page loads and saves data correctly
- [ ] Test navigation to supply parameters page works
- [ ] Test language switching updates all supply text
- [ ] Test supply form data persists across browser sessions
- [ ] Test role changes update field access appropriately

#### AC6: End-to-End Tests

- [ ] Test complete technologist workflow with all fields
- [ ] Test complete supply workflow with role restrictions
- [ ] Test data flows from forms to calculation engine
- [ ] Test cross-language functionality (Russian/English)
- [ ] Test supply parameter configuration saves and loads
- [ ] Test supply parameters affect calculations (when integrated)

### Test Coverage Requirements

- [ ] Unit test coverage >85% for all new components
- [ ] Integration test coverage >70% for critical user flows
- [ ] E2E test coverage for primary user workflows
- [ ] All new TypeScript interfaces covered by type tests

### Test Files to Create

```
src/components/SupplyInputForm.test.tsx
src/pages/SupplyParameters.test.tsx
src/lib/calculation-engine/types.test.ts
src/lib/calculation-engine/field-mapping.test.ts
e2e/tests/supply-workflow.spec.ts
e2e/tests/technologist-workflow.spec.ts
e2e/tests/role-based-access.spec.ts
e2e/tests/translations-supply.spec.ts
```

### Definition of Done

- [ ] All unit tests written and passing
- [ ] All integration tests written and passing
- [ ] All E2E tests written and passing
- [ ] Test coverage targets met
- [ ] CI/CD pipeline includes all new tests
- [ ] Test documentation updated
- [ ] No console errors in test runs

---

## Story LH-009: Validate Calculation Accuracy

**Story ID**: LH-009  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: TODO  
**Priority**: CRITICAL  
**Story Points**: 5  
**Assignee**: TBD  
**Dependencies**: Calculation engine integration with supply parameters

### User Story

As a **business stakeholder**, I want **validation that field gap resolution improved calculation accuracy to 90%+** so that **the system produces reliable cost estimates and justifies the development investment**.

### Business Context

Primary business goal of field gap resolution is improving calculation accuracy from 20-60% to 90%+. Need systematic validation with real data to prove improvement and identify any remaining gaps.

### Acceptance Criteria

#### AC1: Test Data Preparation

- [ ] Obtain 5+ real equipment specifications from Excel files
- [ ] Get expected calculation results from original Excel formulas
- [ ] Prepare test cases covering different equipment types (К4-750, etc.)
- [ ] Include edge cases and boundary conditions
- [ ] Document test data sources and validation criteria

#### AC2: Calculation Engine Integration Testing

- [ ] Update calculation engine to use supply parameters instead of hardcoded values
- [ ] Test that all 13 supply fields affect calculations appropriately
- [ ] Verify supply parameters override hardcoded pricing
- [ ] Test calculation with different supply configurations
- [ ] Validate calculation speed not degraded

#### AC3: Accuracy Validation Testing

- [ ] Run calculations with same inputs as Excel reference
- [ ] Compare results for accuracy within 5% tolerance (target 95%+ accuracy)
- [ ] Test accuracy across different equipment configurations
- [ ] Document accuracy improvements from Phase 1 & 2 changes
- [ ] Identify and document any remaining discrepancies

#### AC4: Field Coverage Validation

- [ ] Verify all 6 missing technologist fields affect calculations
- [ ] Verify all 13 supply fields affect calculations appropriately
- [ ] Test that pressure/temperature field corrections improved accuracy
- [ ] Validate field mapping changes eliminated systematic errors
- [ ] Confirm no critical fields remain unmapped

#### AC5: Regression Testing

- [ ] Verify existing functionality not broken by new fields
- [ ] Test that original working calculations still work
- [ ] Validate no performance regression from additional fields
- [ ] Confirm UI responsiveness maintained with new fields

### Test Scenarios to Validate

#### Scenario 1: Basic Equipment Configuration

- Equipment: К4-750 with standard configuration
- Test pressure/temperature field corrections
- Verify 6 missing technologist fields contribute to calculation
- Compare result accuracy vs. Excel

#### Scenario 2: Custom Supply Parameters

- Configure non-default supply parameters
- Test pricing policy changes affect total cost
- Test logistics parameters affect calculation
- Test correction factors affect material calculations

#### Scenario 3: Role-Based Supply Configuration

- Test director configuring pricing policy
- Test supply manager configuring logistics
- Verify role restrictions don't break calculations
- Test admin accessing all supply parameters

#### Scenario 4: Multi-Language Calculation

- Test calculations work in Russian interface
- Test calculations work in English interface
- Verify language switching doesn't affect accuracy
- Test field labels don't impact calculations

### Success Metrics

- [ ] **Primary**: Calculation accuracy ≥90% vs Excel reference
- [ ] **Secondary**: All 19 new fields (6 technologist + 13 supply) affect calculations
- [ ] **Tertiary**: Performance impact <10% calculation speed degradation
- [ ] **Quality**: Zero critical calculation bugs found

### Deliverables

- [ ] Accuracy validation report with test results
- [ ] Performance benchmark comparison report
- [ ] Field coverage analysis document
- [ ] Recommendations for any remaining accuracy gaps

### Definition of Done

- [ ] Calculation accuracy validated at ≥90%
- [ ] All supply parameters integrated in calculation engine
- [ ] Performance benchmarks met (<10% degradation)
- [ ] Accuracy validation report completed
- [ ] Any remaining issues documented with priorities
- [ ] Business stakeholder sign-off on accuracy improvement

---

## Story LH-010: Performance and Load Testing

**Story ID**: LH-010  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: TODO  
**Priority**: MEDIUM  
**Story Points**: 3  
**Assignee**: TBD

### User Story

As a **system administrator**, I want **performance validation that new fields don't degrade system performance** so that **the application remains responsive under normal and peak load conditions**.

### Business Context

Added 19 new fields (6 technologist + 13 supply) plus role-based access logic. Need to ensure performance impact is acceptable and system scales appropriately.

### Acceptance Criteria

#### AC1: Calculation Performance Testing

- [ ] Measure calculation time with all new fields populated
- [ ] Compare calculation speed vs. baseline (before new fields)
- [ ] Test calculation performance with maximum field values
- [ ] Verify calculation time scales linearly with complexity
- [ ] Performance degradation <10% acceptable

#### AC2: Form Rendering Performance

- [ ] Measure SupplyInputForm rendering time with all 13 fields
- [ ] Test form interaction responsiveness (typing, clicking)
- [ ] Measure technical form rendering with 6 additional fields
- [ ] Test form submission and data persistence speed
- [ ] All form interactions <100ms response time

#### AC3: Memory Usage Testing

- [ ] Measure memory usage with all forms loaded
- [ ] Test memory usage during extended sessions
- [ ] Verify no memory leaks with form interactions
- [ ] Test memory usage with multiple tabs/windows
- [ ] Memory increase <20% vs. baseline acceptable

#### AC4: Load Testing

- [ ] Test 10 concurrent users using supply forms
- [ ] Test 50 concurrent calculations with new fields
- [ ] Measure response time under load
- [ ] Test database/localStorage performance under load
- [ ] System remains responsive under 2x normal load

### Performance Benchmarks

| Metric           | Target | Baseline | With New Fields | Status |
| ---------------- | ------ | -------- | --------------- | ------ |
| Calculation Time | <2s    | TBD      | TBD             | ⬜     |
| Form Render Time | <500ms | TBD      | TBD             | ⬜     |
| Memory Usage     | +<20%  | TBD      | TBD             | ⬜     |
| Response Time    | <100ms | TBD      | TBD             | ⬜     |

### Definition of Done

- [ ] All performance benchmarks meet targets
- [ ] Load testing completed successfully
- [ ] Performance report documented
- [ ] Any performance issues identified and prioritized
- [ ] System performs acceptably under expected load

---

## Story LH-011: Cross-Browser Compatibility Testing

**Story ID**: LH-011  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: TODO  
**Priority**: LOW  
**Story Points**: 2  
**Assignee**: TBD

### User Story

As a **end user**, I want **supply parameters and technologist fields to work correctly in all supported browsers** so that **I can use the system regardless of my browser choice**.

### Acceptance Criteria

#### AC1: Chrome Testing

- [ ] All supply form fields render correctly
- [ ] Role-based access works properly
- [ ] Data persistence functions correctly
- [ ] Language switching works
- [ ] No console errors

#### AC2: Firefox Testing

- [ ] All supply form fields render correctly
- [ ] Role-based access works properly
- [ ] Data persistence functions correctly
- [ ] Language switching works
- [ ] No console errors

#### AC3: Safari Testing

- [ ] All supply form fields render correctly
- [ ] Role-based access works properly
- [ ] Data persistence functions correctly
- [ ] Language switching works
- [ ] No console errors

#### AC4: Edge Testing (if required)

- [ ] All supply form fields render correctly
- [ ] Role-based access works properly
- [ ] Data persistence functions correctly
- [ ] Language switching works
- [ ] No console errors

### Definition of Done

- [ ] All targeted browsers pass compatibility tests
- [ ] Any browser-specific issues documented
- [ ] Critical functionality works across all browsers
- [ ] Minor browser differences acceptable

---

## Story LH-012: Accessibility Testing

**Story ID**: LH-012  
**Epic**: EPIC-001 Critical Field Gap Resolution  
**Status**: TODO  
**Priority**: LOW  
**Story Points**: 2  
**Assignee**: TBD

### User Story

As a **user with accessibility needs**, I want **supply parameters and technologist fields to be accessible via screen readers and keyboard navigation** so that **I can use the system effectively**.

### Acceptance Criteria

#### AC1: Screen Reader Testing

- [ ] All supply form fields have proper labels
- [ ] Field descriptions read correctly
- [ ] Section headings properly structured
- [ ] Error messages announced appropriately
- [ ] Form validation messages accessible

#### AC2: Keyboard Navigation

- [ ] All supply fields accessible via Tab key
- [ ] Tab order logical and consistent
- [ ] Enter/Space keys activate buttons properly
- [ ] Form can be completed without mouse
- [ ] Focus indicators visible

#### AC3: WCAG Compliance

- [ ] Color contrast meets WCAG AA standards
- [ ] Form labels meet accessibility requirements
- [ ] Alt text provided where needed
- [ ] No accessibility warnings in browser tools
- [ ] Automated accessibility tests pass

### Definition of Done

- [ ] All accessibility tests pass
- [ ] WCAG AA compliance verified
- [ ] Screen reader testing completed
- [ ] Keyboard navigation functional
- [ ] Any accessibility issues documented

## Testing Sprint Planning

### Sprint Capacity

- **Available Developers**: 2
- **Sprint Length**: 2 weeks
- **Velocity**: 20 story points per developer
- **Total Capacity**: 40 story points

### Recommended Sprint Structure

#### Sprint Focus: Core Testing (20 points)

- **LH-008**: Write Comprehensive Test Suite (8 points)
- **LH-009**: Validate Calculation Accuracy (5 points)
- **LH-010**: Performance and Load Testing (3 points)
- Buffer: 4 points for bug fixes

#### Optional Additional Work (if capacity allows)

- **LH-011**: Cross-Browser Compatibility (2 points)
- **LH-012**: Accessibility Testing (2 points)

### Testing Dependencies

#### Blocked Until Complete

- Calculation engine integration with supply parameters
- Real test data from client
- Test environment setup

#### Can Start Immediately

- Unit tests for existing components
- UI/form testing
- Integration tests for data persistence

### Risk Mitigation

- **Risk**: Test data unavailable from client
- **Mitigation**: Create synthetic test data based on Excel analysis

- **Risk**: Calculation engine integration delays testing
- **Mitigation**: Prioritize component/UI testing first

- **Risk**: Performance issues discovered late
- **Mitigation**: Start performance testing early in sprint
