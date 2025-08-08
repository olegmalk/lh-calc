# 📋 PRODUCT PLAN - SPRINT 2

## LH Calculator - Final Implementation Phase

**Sprint**: Sprint 2 (Final)  
**Duration**: 10 days (2025-08-07 to 2025-08-18)  
**Product Manager**: BMAD  
**Status**: READY TO START

---

## 🎯 SPRINT 2 OBJECTIVE

**Mission**: Complete the LH Calculator by implementing 4 critical features that transform a working calculator into a production-ready business tool integrated with Bitrix24 CRM.

**Current State**: ✅ Calculation engine with 962 formulas works perfectly  
**Target State**: 🎯 Complete business solution with save/load, Excel export, and CRM integration

---

## 📊 EPICS BREAKDOWN

### Epic 1: Local Storage Management 💾

**Business Value**: Users can save calculations for reuse, eliminating re-entry work and enabling workflow continuity.

**Acceptance Criteria**:

- Auto-save calculations on completion
- Save calculations with custom names
- Load previously saved calculations
- List all saved calculations with search
- Delete unwanted calculations
- Handle localStorage quota limits gracefully

**Dependencies**: None  
**Priority**: P0 (Blocking)  
**Estimated Effort**: 24 hours

### Epic 2: Excel Export Functionality 📄

**Business Value**: Maintains existing Excel-based workflow while leveraging calculator accuracy, ensuring seamless business process integration.

**Acceptance Criteria**:

- Export matches original Excel template exactly
- Generate 3 sheets: Технолог, Снабжение, Результат
- Download .xlsx file directly to browser
- Handle export errors gracefully
- Support single calculation export

**Dependencies**: None  
**Priority**: P0 (Blocking)  
**Estimated Effort**: 16 hours

### Epic 3: Bitrix24 CRM Integration 🔄

**Business Value**: Creates quotes directly in CRM system, eliminating manual data transfer and enabling automated sales workflow.

**Acceptance Criteria**:

- Send calculation results to Bitrix24 as Deal/Lead
- Map all relevant calculation fields to CRM
- Handle API errors with user feedback
- Show success confirmation with CRM link
- Store failed exports for retry

**Dependencies**: Client must provide Bitrix24 credentials  
**Priority**: P0 (Critical - main business requirement)  
**Estimated Effort**: 24 hours

### Epic 4: Project Organization 📁

**Business Value**: Group calculations by client/project, enabling better organization and faster retrieval for quote variations.

**Acceptance Criteria**:

- Create and manage simple projects
- Assign calculations to projects
- Filter calculations by project
- Basic project management (create, rename, delete)
- Show calculation count per project

**Dependencies**: Epic 1 (Storage)  
**Priority**: P1 (Important)  
**Estimated Effort**: 16 hours

---

## 📝 USER STORIES

### Epic 1: Local Storage Management

#### Story 1.1: Auto-save Calculations

**As a** heat exchanger engineer  
**I want** calculations to be automatically saved when completed  
**So that** I never lose my work if the browser crashes or closes

**Acceptance Criteria**:

- Auto-save triggers on calculation completion
- Save includes all inputs and results
- Unique ID generated for each save
- Timestamp recorded
- No user action required

**Technical Notes**: Use localStorage with 5MB limit monitoring  
**Story Points**: 3

#### Story 1.2: Save with Custom Name

**As a** project manager  
**I want** to save calculations with meaningful names  
**So that** I can easily identify them later

**Acceptance Criteria**:

- "Save" button on results page
- Modal dialog for name input
- Default name format: "Calculation - [Date]"
- Name validation (max 100 characters)
- Prevent duplicate names

**Technical Notes**: SaveCalculationModal component  
**Story Points**: 2

#### Story 1.3: Load Saved Calculations

**As a** engineer  
**I want** to load previously saved calculations  
**So that** I can review results or create variations

**Acceptance Criteria**:

- "Saved Calculations" page accessible from nav
- List shows name, project, date
- Click to load calculation
- Replaces current inputs/results
- Confirm before overwriting current work

**Technical Notes**: SavedCalculationsPage component  
**Story Points**: 3

#### Story 1.4: Manage Saved Calculations

**As a** user  
**I want** to search and delete saved calculations  
**So that** I can keep my workspace organized

**Acceptance Criteria**:

- Search by calculation name
- Delete individual calculations
- Bulk delete option
- Confirm before deletion
- Show storage usage indicator

**Technical Notes**: Include search and delete UI  
**Story Points**: 2

### Epic 2: Excel Export Functionality

#### Story 2.1: Excel Template Export

**As a** engineer  
**I want** to export calculations to Excel format  
**So that** I can share results with colleagues using existing templates

**Acceptance Criteria**:

- "Export to Excel" button on results
- Downloads .xlsx file immediately
- File name: "HE*Calculation*[Name]\_[Date].xlsx"
- Exact match to original template structure
- Opens correctly in Excel/LibreOffice

**Technical Notes**: Use ExcelJS library, implement ExcelService  
**Story Points**: 5

#### Story 2.2: Multi-sheet Structure

**As a** technical specialist  
**I want** Excel export to include all three required sheets  
**So that** data matches our established workflow

**Acceptance Criteria**:

- Sheet 1: "Технолог" - technical parameters
- Sheet 2: "Снабжение" - supply data
- Sheet 3: "Результат" - calculation results
- Proper Russian headers and formatting
- All formulas preserved where applicable

**Technical Notes**: Map calculation data to specific cells  
**Story Points**: 3

### Epic 3: Bitrix24 CRM Integration

#### Story 3.1: CRM Connection Setup

**As a** system administrator  
**I want** to configure Bitrix24 connection  
**So that** calculations can be sent to our CRM

**Acceptance Criteria**:

- Settings page for Bitrix24 configuration
- Input fields for webhook URL and token
- Test connection functionality
- Field mapping configuration
- Secure credential storage

**Technical Notes**: Bitrix24Service class, configuration UI  
**Story Points**: 3

#### Story 3.2: Export to CRM

**As a** sales manager  
**I want** to send calculations directly to Bitrix24  
**So that** quotes are created automatically in our CRM

**Acceptance Criteria**:

- "Send to CRM" button on results
- Map calculation fields to Bitrix24 Deal fields
- Show progress during export
- Success message with CRM link
- Error handling with retry option

**Technical Notes**: Implement crm.deal.add API call  
**Story Points**: 5

#### Story 3.3: Field Mapping

**As a** business analyst  
**I want** calculation data mapped to correct CRM fields  
**So that** quotes contain all necessary information

**Acceptance Criteria**:

- TITLE: "Расчет теплообменника [Name]"
- OPPORTUNITY: Total cost in RUB
- UF_EQUIPMENT_TYPE: Equipment type
- UF_PLATE_COUNT: Number of plates
- UF_PRESSURE_A/B: Operating pressures
- UF_MATERIAL: Plate material
- Custom fields as defined by client

**Technical Notes**: Field mapping configuration, client-dependent  
**Story Points**: 2

### Epic 4: Project Organization

#### Story 4.1: Create Projects

**As a** project manager  
**I want** to create projects for grouping calculations  
**So that** I can organize work by client or project phase

**Acceptance Criteria**:

- "Create Project" button on dashboard
- Project name input (required)
- Auto-generated unique ID
- Project appears in selector immediately
- Default project for ungrouped calculations

**Technical Notes**: Project management in StorageService  
**Story Points**: 2

#### Story 4.2: Assign Calculations to Projects

**As a** engineer  
**I want** to assign calculations to projects when saving  
**So that** related calculations are grouped together

**Acceptance Criteria**:

- Project selector in save dialog
- Default to current project if set
- Option to create new project during save
- Visual project indicator on calculation list
- Move calculations between projects

**Technical Notes**: Update SaveCalculationModal  
**Story Points**: 3

#### Story 4.3: Filter by Project

**As a** user  
**I want** to filter saved calculations by project  
**So that** I can quickly find project-specific calculations

**Acceptance Criteria**:

- Project filter dropdown on Saved Calculations page
- "All Projects" option
- Show calculation count per project
- Filter updates list immediately
- Remember selected filter

**Technical Notes**: Filter logic in SavedCalculationsPage  
**Story Points**: 2

---

## 🗓️ SPRINT 2 BACKLOG

### Week 1: Core Features (Days 1-5)

**Focus**: Storage and Excel export - foundational features

#### Day 1-2: Storage Foundation

- **Story 1.1**: Auto-save calculations (3 points)
- **Story 1.2**: Save with custom name (2 points)
- **Story 4.1**: Create projects (2 points)
- **Total**: 7 points

#### Day 3-4: Storage Management

- **Story 1.3**: Load saved calculations (3 points)
- **Story 1.4**: Manage saved calculations (2 points)
- **Story 4.2**: Assign calculations to projects (3 points)
- **Total**: 8 points

#### Day 5: Excel Export

- **Story 2.1**: Excel template export (5 points)
- **Story 2.2**: Multi-sheet structure (3 points)
- **Total**: 8 points

**Week 1 Total**: 23 points

### Week 2: Integration & Polish (Days 6-10)

**Focus**: Bitrix24 integration and final polish

#### Day 6-7: Bitrix24 Setup

- **Story 3.1**: CRM connection setup (3 points)
- **Story 3.3**: Field mapping (2 points)
- **Story 4.3**: Filter by project (2 points)
- **Total**: 7 points

#### Day 8-9: CRM Integration

- **Story 3.2**: Export to CRM (5 points)
- Integration testing
- Error handling refinement
- **Total**: 5+ points

#### Day 10: Final Polish

- End-to-end testing
- Bug fixes
- Client training preparation
- Deployment

**Week 2 Total**: 12+ points

**Sprint Total**: 35 points (80 hours)

---

## 🚨 RISKS & MITIGATIONS

### High Priority Risks

#### Risk 1: Bitrix24 Credentials Delay

**Impact**: High - Blocks Epic 3 (main business requirement)  
**Probability**: Medium  
**Mitigation**:

- Contact client immediately for credentials
- Implement mock integration for testing
- Prepare training materials for quick deployment once received

#### Risk 2: localStorage Quota Issues

**Impact**: Medium - Affects user experience  
**Probability**: Low  
**Mitigation**:

- Implement quota monitoring
- Auto-cleanup oldest calculations
- Graceful fallback messaging

#### Risk 3: Excel Format Compatibility

**Impact**: Medium - May require rework  
**Probability**: Low  
**Mitigation**:

- Test with original Excel file immediately
- Verify with client early in implementation
- Keep ExcelJS version compatible

### Medium Priority Risks

#### Risk 4: Field Mapping Complexity

**Impact**: Medium - May require additional development time  
**Probability**: Medium  
**Mitigation**:

- Start with basic mapping
- Make field configuration flexible
- Plan iteration based on client feedback

#### Risk 5: Browser Compatibility

**Impact**: Low - May affect some users  
**Probability**: Low  
**Mitigation**:

- Test on client's preferred browsers
- Use well-supported libraries
- Implement fallbacks for edge cases

---

## 📈 SUCCESS METRICS

### Functional Success Criteria

- ✅ User can save calculations with custom names
- ✅ User can load previously saved calculations
- ✅ Excel export produces files matching original template
- ✅ Bitrix24 integration creates deals with correct data
- ✅ No data loss on browser refresh
- ✅ Project organization works intuitively

### Performance Targets

- **Save/Load**: < 50ms response time
- **Excel Export**: < 2s for single calculation
- **Bitrix24 Export**: < 5s end-to-end
- **Page Load**: < 1s initial load
- **Storage**: Support 1000+ calculations

### Business Success Measures

- **Workflow Replacement**: 100% Excel workflow replaced
- **CRM Integration**: Automatic quote creation in Bitrix24
- **Time Savings**: >50% reduction in quote preparation time
- **Error Reduction**: Eliminate manual data transfer errors
- **User Adoption**: Zero additional training required

### Technical Quality Gates

- **Test Coverage**: Maintain 100% for new features
- **Error Handling**: Graceful failure for all external dependencies
- **Data Integrity**: No calculation data corruption
- **Performance**: All response times under targets
- **Security**: No credentials stored in localStorage

---

## 🎯 DEFINITION OF DONE

### Sprint 2 Complete When:

1. ✅ All 12 user stories implemented and tested
2. ✅ Excel export produces correct multi-sheet files
3. ✅ Bitrix24 integration tested with real credentials
4. ✅ localStorage handles quota limits gracefully
5. ✅ Project organization functional
6. ✅ All tests passing (unit + integration)
7. ✅ Client trained on new features
8. ✅ Deployed to production environment

### Feature Complete When:

- **Story passes acceptance criteria**: All ACs verified
- **Unit tests written**: 100% coverage for new code
- **Integration tested**: Works with existing features
- **Error handling implemented**: Graceful failure modes
- **UI/UX reviewed**: Matches design standards
- **Performance verified**: Meets defined targets

---

## 🤝 CLIENT DEPENDENCIES

### Required from Client (URGENT)

1. **Bitrix24 Webhook URL**: For CRM integration
2. **Access Token/Credentials**: API authentication
3. **Custom Field IDs**: UF\_\* field mapping
4. **CRM Entity Type**: Deal vs Lead preference
5. **Field Mapping Preferences**: Which calculation fields to export

### Client Communication Plan

- **Day 1**: Request all Bitrix24 information
- **Day 6**: Verify credentials and test connection
- **Day 9**: Demo integration and gather feedback
- **Day 10**: Final training and go-live support

---

## 🚀 DELIVERY TIMELINE

```
Week 1: Foundation
├── Day 1-2: Storage system
├── Day 3-4: Project management
└── Day 5: Excel export

Week 2: Integration
├── Day 6-7: Bitrix24 setup
├── Day 8-9: CRM integration
└── Day 10: Polish & deploy
```

**Key Milestones**:

- **Day 5**: Core features demo ready
- **Day 7**: Bitrix24 connection established
- **Day 9**: Full integration testing complete
- **Day 10**: Production deployment

---

## 📋 IMMEDIATE NEXT STEPS

### Today (Day 1)

1. ✅ Review and approve this product plan
2. 🔄 Contact client for Bitrix24 credentials
3. 🔄 Set up development environment for new features
4. 🔄 Create GitHub issues for all user stories
5. 🔄 Begin StorageService implementation

### This Week

- Complete all storage functionality
- Implement Excel export
- Test with existing calculation engine
- Prepare for Bitrix24 integration

---

**This plan transforms a working calculator into a complete business solution that integrates seamlessly with the client's existing CRM workflow. Focus on simplicity and direct business value.**
