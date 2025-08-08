# Role-Based UX Sprint Plan
**Sprint Duration:** 2 weeks (August 8-22, 2025)  
**Team:** BMAD Development Team  
**Scrum Master:** Claude  
**Sprint Goal:** Implement client-side role-based UX system with unified calculation page and Excel color-coding

## Sprint Overview

Transform LH Calculator from standalone Supply page to unified role-based calculation workflow. Eliminate navigation complexity while maintaining clear separation between calculation fields (affecting cost) and project metadata (documentation only).

**Key Objectives:**
- Client-side role selector (no backend auth)
- Unified calculation page with role-based sections
- Eliminate standalone Supply page 
- Excel-based color coding for field types
- Clean calculation vs project metadata separation

## Epic Breakdown

### EPIC 1: Client-Side Role-Based Architecture
**Business Value:** Foundation for role-based permissions and UI customization
**Story Points:** 13
**Dependencies:** None

### EPIC 2: Unified Calculation Page  
**Business Value:** Streamlined workflow, reduced navigation complexity
**Story Points:** 21
**Dependencies:** Epic 1 (role system)

### EPIC 3: Project Metadata Separation
**Business Value:** Clear data separation, improved UX organization  
**Story Points:** 8
**Dependencies:** Epic 2 (page structure)

### EPIC 4: Excel-Based Color Coding
**Business Value:** Visual field classification, improved usability
**Story Points:** 5  
**Dependencies:** Epic 2 (unified page)

### EPIC 5: Testing & Deployment
**Business Value:** Production readiness, quality assurance
**Story Points:** 8
**Dependencies:** All epics

**Total Story Points:** 55

---

## User Stories with Acceptance Criteria

### EPIC 1: Client-Side Role-Based Architecture

#### Story 1.1: Role Type Definitions
**As a** system architect  
**I want** to define user role types with their permissions  
**So that** the system can enforce role-based field access  

**Story Points:** 3  
**Priority:** High  

**Acceptance Criteria:**
- [ ] Define UserRole enum: Technologist, Engineer, Supply, Director
- [ ] Create RolePermissions interface with field access rules
- [ ] Map each calculation field to appropriate roles
- [ ] Create role-to-color mapping (Yellow/Green/Orange/Red)
- [ ] Add role definitions to TypeScript types

**Definition of Done:**
- [ ] TypeScript interfaces created and exported
- [ ] Role permissions documented in code comments
- [ ] Unit tests for role validation functions
- [ ] No TypeScript compilation errors

#### Story 1.2: Role Selection Component
**As a** user  
**I want** to select my role from a dropdown in the header  
**So that** I can access fields relevant to my responsibilities  

**Story Points:** 5  
**Priority:** High  

**Acceptance Criteria:**
- [ ] Create RoleSelector component with Mantine Select
- [ ] Display current role in app header
- [ ] Persist selected role in localStorage
- [ ] Show role-appropriate icon and color
- [ ] Handle role switching with confirmation dialog

**Definition of Done:**
- [ ] Component renders in app header
- [ ] Role persists across page refreshes
- [ ] Switching role shows confirmation dialog
- [ ] Accessibility attributes included
- [ ] Component unit tests pass

#### Story 1.3: Role-Based State Management  
**As a** developer  
**I want** role state managed centrally  
**So that** components can react to role changes  

**Story Points:** 5  
**Priority:** High  

**Acceptance Criteria:**
- [ ] Create useRoleStore with Zustand
- [ ] Implement role persistence with localStorage
- [ ] Add role change event handlers
- [ ] Create role-based field access utilities
- [ ] Integrate with existing inputStore

**Definition of Done:**
- [ ] Zustand store created with TypeScript
- [ ] Role persists correctly in localStorage
- [ ] Store integrates with existing stores
- [ ] Utility functions for role validation
- [ ] Store unit tests pass

### EPIC 2: Unified Calculation Page

#### Story 2.1: Technical Section Component
**As a** Technologist  
**I want** my technical fields grouped in one section  
**So that** I can efficiently input equipment specifications  

**Story Points:** 8  
**Priority:** High  

**Acceptance Criteria:**
- [ ] Create TechnicalSection component
- [ ] Include all technical fields (Yellow/Green from architecture doc)
- [ ] Implement role-based edit/view permissions
- [ ] Add Excel-based color coding for field types
- [ ] Show field tooltips with Excel cell references

**Technical Fields:**
- equipmentType (Yellow - dropdown)
- plateCount (Green - manual)
- plateMaterial (Yellow - dropdown) 
- bodyMaterial (Yellow - dropdown)
- plateThickness (Green - manual)
- pressureA/B (Green - manual)
- temperatureA/B (Green - manual)
- surfaceType (Yellow - dropdown)
- corrugationType (Yellow - dropdown)

**Definition of Done:**
- [ ] Component renders all technical fields
- [ ] Fields show appropriate colors
- [ ] Role permissions enforced (edit vs view)
- [ ] Form validation integrated
- [ ] Component tests cover all scenarios

#### Story 2.2: Engineering Section Component
**As a** Design Engineer  
**I want** my engineering fields grouped separately  
**So that** I can focus on design specifications  

**Story Points:** 5  
**Priority:** High  

**Acceptance Criteria:**
- [ ] Create EngineeringSection component
- [ ] Include all engineering fields (Orange from architecture doc)
- [ ] Role-based permissions (Engineer edit, others view)
- [ ] Orange color coding for all fields
- [ ] Integration with calculation engine

**Engineering Fields:**
- flangeHotPressure1/2 (Orange)
- flangeHotDiameter1/2 (Orange)
- flangeColdPressure1/2 (Orange)
- flangeColdDiameter1/2 (Orange)
- mountingPanelsCount (Orange)

**Definition of Done:**
- [ ] Component renders with orange theme
- [ ] Only Engineer role can edit fields
- [ ] Other roles see read-only view
- [ ] Flange calculations work correctly
- [ ] Unit tests validate permissions

#### Story 2.3: Supply Section Component (Integrated)
**As a** Supply Manager  
**I want** cost fields integrated into main calculation page  
**So that** I don't need to navigate to separate Supply page  

**Story Points:** 8  
**Priority:** High  

**Acceptance Criteria:**
- [ ] Create integrated SupplySection component
- [ ] Include all cost-related fields (Green from architecture doc)
- [ ] Migrate existing SupplyInputForm logic
- [ ] Role-based permissions (Supply edit, others view)
- [ ] Real-time cost calculation updates

**Supply Fields:**
- laborRateD12 (Green)
- laborCoefficientD13 (Green)
- materialCoefficientD14 (Green)
- componentCost1-4 (Green)
- processCost1-4 (Green)
- materialCost1-3 (Green)

**Definition of Done:**
- [ ] All supply fields integrated
- [ ] Existing SupplyParameters logic preserved
- [ ] Calculations update in real-time
- [ ] Only Supply role can edit
- [ ] Migration tests pass

### EPIC 3: Project Metadata Separation

#### Story 3.1: Project Details Page Creation
**As a** user  
**I want** project metadata on a separate page  
**So that** calculation and documentation concerns are separated  

**Story Points:** 5  
**Priority:** Medium  

**Acceptance Criteria:**
- [ ] Create ProjectDetailsPage component
- [ ] Organize metadata into logical sections
- [ ] Implement tabbed interface for organization
- [ ] All roles can edit project metadata
- [ ] Navigation link in main menu

**Metadata Sections:**
- Project Information (name, order, client, dates)
- Documentation (drawings, manuals, certificates)
- Logistics (packaging, shipping, delivery)
- Spare Parts (plates, gaskets, bolts)

**Definition of Done:**
- [ ] Page renders with organized sections
- [ ] All metadata fields included
- [ ] Navigation integrated
- [ ] Form validation working
- [ ] Responsive design implemented

#### Story 3.2: Navigation Updates
**As a** user  
**I want** updated navigation reflecting the new structure  
**So that** I can easily access calculation and project pages  

**Story Points:** 3  
**Priority:** Medium  

**Acceptance Criteria:**
- [ ] Update AppNavbar with new menu items
- [ ] Remove /supply route and navigation link
- [ ] Add /project-details route and link
- [ ] Update route configurations
- [ ] Add breadcrumb navigation

**Definition of Done:**
- [ ] Old supply link removed
- [ ] New project details link added
- [ ] Routes work correctly
- [ ] Breadcrumbs show current location
- [ ] Mobile navigation updated

### EPIC 4: Excel-Based Color Coding

#### Story 4.1: Color System Implementation
**As a** user  
**I want** fields color-coded based on their type  
**So that** I can quickly identify field categories  

**Story Points:** 5  
**Priority:** Medium  

**Acceptance Criteria:**
- [ ] Implement color constants matching Excel model
- [ ] Create field color mapping utility
- [ ] Apply colors to input components
- [ ] Add color legend for user reference
- [ ] Ensure accessibility compliance

**Color Scheme:**
- 🟨 Yellow: Technologist dropdowns (VLOOKUP fields)
- 🟩 Green: Manual entry fields (user input)
- 🟧 Orange: Engineering design fields
- 🟥 Red: Executive control fields

**Definition of Done:**
- [ ] All fields show appropriate colors
- [ ] Color legend displayed
- [ ] Colors meet accessibility standards
- [ ] Color mapping documented
- [ ] Visual regression tests pass

### EPIC 5: Testing & Deployment

#### Story 5.1: Component Testing
**As a** developer  
**I want** comprehensive component tests  
**So that** role-based functionality is validated  

**Story Points:** 5  
**Priority:** High  

**Acceptance Criteria:**
- [ ] Unit tests for all new components
- [ ] Role permission testing
- [ ] Component integration tests
- [ ] Mock role switching scenarios
- [ ] Test coverage > 80%

**Definition of Done:**
- [ ] All components have unit tests
- [ ] Role switching tested thoroughly
- [ ] Integration tests pass
- [ ] Coverage metrics met
- [ ] Test documentation updated

#### Story 5.2: End-to-End Testing
**As a** QA engineer  
**I want** E2E tests for critical user flows  
**So that** the complete workflow is validated  

**Story Points:** 3  
**Priority:** High  

**Acceptance Criteria:**
- [ ] E2E test for complete calculation workflow
- [ ] Role switching validation
- [ ] Supply page elimination verification
- [ ] Project metadata workflow testing
- [ ] Cross-browser compatibility testing

**Definition of Done:**
- [ ] E2E tests pass consistently
- [ ] All critical flows covered
- [ ] Tests run in CI pipeline
- [ ] Cross-browser validation complete
- [ ] Performance benchmarks met

---

## Sprint Timeline

### Week 1 (August 8-14)
**Focus:** Foundation and Core Components

**Days 1-2 (Aug 8-9):**
- Story 1.1: Role Type Definitions
- Story 1.2: Role Selection Component
- Story 1.3: Role-Based State Management

**Days 3-5 (Aug 10-12):**
- Story 2.1: Technical Section Component
- Story 2.2: Engineering Section Component
- Begin Story 2.3: Supply Section Component

**Week 1 Deliverables:**
- Working role selector in header
- Technical and Engineering sections functional
- Role-based permissions enforced

### Week 2 (August 15-22)
**Focus:** Integration and Polish

**Days 6-8 (Aug 15-17):**
- Complete Story 2.3: Supply Section Component
- Story 3.1: Project Details Page Creation
- Story 3.2: Navigation Updates

**Days 9-10 (Aug 18-19):**
- Story 4.1: Color System Implementation
- Story 5.1: Component Testing
- Story 5.2: End-to-End Testing

**Final Days (Aug 20-22):**
- Bug fixes and polish
- Documentation updates
- Production deployment preparation

---

## Risk Assessment

### High Risk
**Risk:** Complex state management integration  
**Impact:** High  
**Probability:** Medium  
**Mitigation:** Incremental integration, thorough testing of store interactions

**Risk:** User confusion from UI changes  
**Impact:** Medium  
**Probability:** High  
**Mitigation:** Clear migration guide, color legend, tooltips

### Medium Risk
**Risk:** Performance impact from role switching  
**Impact:** Medium  
**Probability:** Low  
**Mitigation:** Optimize re-renders, lazy loading, performance monitoring

**Risk:** Accessibility compliance  
**Impact:** Medium  
**Probability:** Medium  
**Mitigation:** Color contrast validation, screen reader testing, ARIA labels

### Low Risk
**Risk:** Translation key coverage  
**Impact:** Low  
**Probability:** Medium  
**Mitigation:** i18n audit, automated translation validation

---

## Testing Strategy

### Unit Testing
- **Components:** React Testing Library with role mocking
- **Stores:** Zustand store testing with state transitions
- **Utilities:** Role validation and permission functions
- **Coverage Target:** >85% for new code

### Integration Testing
- **Store Integration:** Role state + input state interactions
- **Component Communication:** Parent-child component messaging  
- **Route Testing:** Navigation between calculation/project pages

### End-to-End Testing
- **Critical Flows:**
  1. Role selection → Field access validation
  2. Complete calculation workflow (all roles)
  3. Supply page elimination verification
  4. Project metadata management
  
- **Browser Support:** Chrome, Firefox, Safari, Edge
- **Device Testing:** Desktop, tablet, mobile responsive

### Performance Testing
- **Metrics:** Page load time, role switching speed, calculation response time
- **Targets:** <2s page load, <500ms role switch, <1s calculations
- **Tools:** Lighthouse, Web Vitals, custom performance monitoring

---

## Definition of Done (Sprint Level)

### Functional Requirements
- [ ] Role selector works in all browsers
- [ ] All calculation fields consolidated into single page
- [ ] Supply page route eliminated/redirected
- [ ] Project metadata on separate dedicated page
- [ ] Color coding applied to all field types
- [ ] Role-based permissions enforced correctly

### Technical Requirements
- [ ] No TypeScript compilation errors
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage >80% for new components
- [ ] Performance benchmarks met
- [ ] Mobile responsive design working

### Quality Requirements  
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Cross-browser compatibility validated
- [ ] User testing feedback incorporated
- [ ] Documentation updated
- [ ] Production deployment successful

### Business Requirements
- [ ] No backend changes required
- [ ] Existing calculation accuracy maintained
- [ ] User workflow simplified (fewer clicks)
- [ ] Clear visual field categorization
- [ ] Stakeholder acceptance achieved

---

## Success Metrics

### User Experience
- **Navigation Efficiency:** 50% reduction in clicks for complete workflow
- **User Satisfaction:** >4/5 rating in post-sprint user testing
- **Error Rate:** <2% form validation errors

### Technical Performance
- **Page Load Time:** <2 seconds for calculation page
- **Role Switching:** <500ms transition time
- **Calculation Speed:** Maintain <1s response time

### Development Quality
- **Test Coverage:** >85% for all new components
- **Bug Rate:** <1 bug per 100 lines of new code
- **Code Review:** 100% of PRs reviewed and approved

This sprint plan provides the foundation for a working MVP that can be deployed quickly without backend changes while delivering significant UX improvements through role-based field organization and workflow consolidation.