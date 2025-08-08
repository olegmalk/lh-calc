# 🏃‍♂️ SPRINT 2 BACKLOG

## LH Calculator - Final Implementation Sprint

**Sprint**: Sprint 2 (Final)  
**Duration**: 10 days (2025-08-07 to 2025-08-18)  
**Scrum Master**: BMAD  
**Total Capacity**: 80 hours (10 days × 8 hours)

---

## 📅 REVISED SPRINT SCHEDULE (10 days)

**Strategic Change**: Bitrix24 integration moved to END to reduce risk and allow other features to be deployed immediately if needed.

### Days 1-3: Local Storage (Epic 1) - 24h

Foundation features that enable save/load workflow

### Days 4-5: Excel Export (Epic 2) - 16h

Business-critical Excel template export

### Days 6-7: Project Organization (Epic 4) - 16h

Grouping and organization features

### Days 8-9: Bitrix24 Integration (Epic 3) - 24h

CRM integration (requires client credentials)

### Day 10: Testing, Polish, Deploy

Final integration and go-live

---

## 🎯 DAILY SPRINT TASKS

### DAY 1 (2025-08-07) - Storage Foundation

**Morning (4h)**:

- Start S2-01: StorageService implementation
- Set up localStorage structure and basic CRUD operations

**Afternoon (4h)**:

- Complete S2-01: StorageService implementation
- Start S2-02: Auto-save functionality

**Deliverable**: Working localStorage service with save/load/delete
**Validation**: Can manually save and retrieve calculation data

---

### DAY 2 (2025-08-08) - Save/Load UI

**Morning (4h)**:

- Complete S2-02: Auto-save functionality
- Start S2-03: Save with custom name modal

**Afternoon (4h)**:

- Complete S2-03: Save with custom name modal
- Start S2-04: Load saved calculations page

**Deliverable**: Save dialog working, calculations auto-saved
**Validation**: User can save calculation with custom name

---

### DAY 3 (2025-08-09) - Storage Management

**Morning (4h)**:

- Complete S2-04: Load saved calculations page
- Start S2-05: Manage saved calculations

**Afternoon (4h)**:

- Complete S2-05: Manage saved calculations
- Test complete storage workflow end-to-end

**Deliverable**: Full save/load/manage workflow complete
**Validation**: User can save, load, search, and delete calculations

---

### DAY 4 (2025-08-10) - Excel Foundation

**Morning (4h)**:

- Start S2-06: Excel template export setup
- Install ExcelJS, create ExcelService class

**Afternoon (4h)**:

- Continue S2-06: Map calculation data to Excel format
- Begin 3-sheet structure implementation

**Deliverable**: ExcelJS integrated, basic export working
**Validation**: Can generate .xlsx file with calculation data

---

### DAY 5 (2025-08-11) - Excel Complete

**Morning (4h)**:

- Complete S2-06: Excel template export
- Start S2-07: Multi-sheet structure

**Afternoon (4h)**:

- Complete S2-07: Multi-sheet structure
- Test Excel files open correctly in Excel/LibreOffice

**Deliverable**: Complete Excel export with 3 sheets
**Validation**: Exported files match original template exactly

---

### DAY 6 (2025-08-12) - Projects Foundation

**Morning (4h)**:

- Start S2-08: Create projects functionality
- Basic project CRUD operations

**Afternoon (4h)**:

- Complete S2-08: Create projects functionality
- Start S2-09: Assign calculations to projects

**Deliverable**: Project creation and management working
**Validation**: Can create projects and assign calculations

---

### DAY 7 (2025-08-13) - Projects Complete

**Morning (4h)**:

- Complete S2-09: Assign calculations to projects
- Start S2-10: Filter by project

**Afternoon (4h)**:

- Complete S2-10: Filter by project
- Test complete project workflow

**Deliverable**: Full project organization complete
**Validation**: Can filter and organize calculations by project

---

### DAY 8 (2025-08-14) - Bitrix24 Setup

**Morning (4h)**:

- Start S2-11: CRM connection setup
- Implement Bitrix24Service, configuration UI

**Afternoon (4h)**:

- Complete S2-11: CRM connection setup
- Start S2-12: Field mapping configuration

**Deliverable**: Bitrix24 service ready for testing
**Validation**: Can configure and test connection (pending credentials)

---

### DAY 9 (2025-08-15) - CRM Integration

**Morning (4h)**:

- Complete S2-12: Field mapping configuration
- Start S2-13: Export to CRM functionality

**Afternoon (4h)**:

- Complete S2-13: Export to CRM functionality
- Test with real Bitrix24 credentials (client required)

**Deliverable**: Complete Bitrix24 integration
**Validation**: Can export calculations as CRM deals

---

### DAY 10 (2025-08-16) - Polish & Deploy

**Morning (4h)**:

- Final integration testing
- Bug fixes and error handling refinement

**Afternoon (4h)**:

- Client training preparation
- Production deployment
- Go-live support

**Deliverable**: Production-ready application
**Validation**: All features working in production

---

## 📋 SPRINT BACKLOG (Story Format)

### Epic 1: Local Storage Management

#### S2-01: StorageService Implementation

**Title**: Implement core storage service with localStorage  
**Estimation**: 6 hours  
**Assigned**: Day 1  
**Definition of Done**:

- StorageService class with CRUD operations
- localStorage quota monitoring
- Error handling for storage failures
- Unit tests written

**Test Criteria**:

- Can save calculation with all data
- Can retrieve by ID
- Can list all calculations
- Handles storage quota gracefully

---

#### S2-02: Auto-save Calculations

**Title**: Auto-save calculations on completion  
**Estimation**: 4 hours  
**Assigned**: Day 1-2  
**Definition of Done**:

- Triggers automatically when calculation completes
- Generates unique ID and timestamp
- No user interaction required
- Doesn't override manual saves

**Test Criteria**:

- Calculation automatically saved after results shown
- Unique ID generated each time
- Timestamp recorded correctly
- Can be retrieved from saved list

---

#### S2-03: Save with Custom Name

**Title**: Manual save with custom naming  
**Estimation**: 6 hours  
**Assigned**: Day 2  
**Definition of Done**:

- "Save" button on results page
- Modal with name input and validation
- Default name format implemented
- Duplicate name prevention

**Test Criteria**:

- Save button appears when results available
- Modal accepts custom names
- Validates name length (max 100 chars)
- Prevents duplicate names with clear error

---

#### S2-04: Load Saved Calculations

**Title**: View and load previously saved calculations  
**Estimation**: 6 hours  
**Assigned**: Day 2-3  
**Definition of Done**:

- Saved Calculations page accessible from nav
- List shows name, date, project
- Click to load replaces current state
- Confirmation before overwriting unsaved work

**Test Criteria**:

- Navigation link works
- List displays all saved calculations
- Loading replaces current inputs/results
- Warns before overwriting current work

---

#### S2-05: Manage Saved Calculations

**Title**: Search and delete saved calculations  
**Estimation**: 4 hours  
**Assigned**: Day 3  
**Definition of Done**:

- Search by name functionality
- Delete individual calculations
- Confirmation before deletion
- Storage usage indicator

**Test Criteria**:

- Search filters list correctly
- Delete removes calculation
- Confirmation dialog appears
- Storage usage updates

---

### Epic 2: Excel Export Functionality

#### S2-06: Excel Template Export

**Title**: Export calculations to Excel format  
**Estimation**: 10 hours  
**Assigned**: Day 4-5  
**Definition of Done**:

- "Export to Excel" button on results
- Downloads .xlsx file immediately
- Correct filename format
- Exact template structure match

**Test Criteria**:

- Button appears with results
- File downloads automatically
- Opens correctly in Excel
- Data matches calculation results

---

#### S2-07: Multi-sheet Structure

**Title**: Generate 3-sheet Excel structure  
**Estimation**: 6 hours  
**Assigned**: Day 5  
**Definition of Done**:

- Three sheets: Технолог, Снабжение, Результат
- Russian headers and proper formatting
- All calculation data mapped correctly
- Formulas preserved where applicable

**Test Criteria**:

- All three sheets present
- Headers in Russian
- Data in correct cells
- File structure matches original template

---

### Epic 4: Project Organization (Moved ahead of Epic 3)

#### S2-08: Create Projects

**Title**: Create and manage projects for grouping  
**Estimation**: 4 hours  
**Assigned**: Day 6  
**Definition of Done**:

- "Create Project" functionality
- Project name validation
- Auto-generated unique IDs
- Default project for ungrouped items

**Test Criteria**:

- Can create new project
- Name validation works
- Projects appear in selectors immediately
- Default project exists

---

#### S2-09: Assign Calculations to Projects

**Title**: Group calculations by project  
**Estimation**: 6 hours  
**Assigned**: Day 6-7  
**Definition of Done**:

- Project selector in save dialog
- Option to create project during save
- Visual project indicators
- Move calculations between projects

**Test Criteria**:

- Project selector works in save modal
- Can create project on-the-fly
- Project shown in calculation list
- Can reassign calculations

---

#### S2-10: Filter by Project

**Title**: Filter calculations by project  
**Estimation**: 4 hours  
**Assigned**: Day 7  
**Definition of Done**:

- Project filter dropdown
- "All Projects" option
- Calculation count per project
- Filter remembered in session

**Test Criteria**:

- Filter dropdown works
- Shows correct calculation counts
- Filtering updates list immediately
- Selection persists during session

---

### Epic 3: Bitrix24 CRM Integration (Moved to end)

#### S2-11: CRM Connection Setup

**Title**: Configure Bitrix24 connection  
**Estimation**: 6 hours  
**Assigned**: Day 8  
**Definition of Done**:

- Settings page for Bitrix24 config
- Webhook URL and token inputs
- Test connection functionality
- Secure credential storage

**Test Criteria**:

- Settings page accessible
- Credentials can be entered and saved
- Test connection validates setup
- Credentials stored securely

---

#### S2-12: Field Mapping Configuration

**Title**: Map calculation fields to CRM  
**Estimation**: 4 hours  
**Assigned**: Day 8-9  
**Definition of Done**:

- Field mapping configuration UI
- Default mapping provided
- Validation of required fields
- Mapping stored in settings

**Test Criteria**:

- Mapping configuration works
- Required fields validated
- Default mapping sensible
- Settings persist

---

#### S2-13: Export to CRM

**Title**: Send calculations to Bitrix24  
**Estimation**: 10 hours  
**Assigned**: Day 9  
**Definition of Done**:

- "Send to CRM" button on results
- Progress indicator during export
- Success confirmation with CRM link
- Error handling with retry option

**Test Criteria**:

- Export button appears with results
- Creates deal in Bitrix24
- Success message with link
- Graceful error handling

---

## 🔗 DEPENDENCIES & RISKS

### Story Dependencies

- **S2-08 → S2-09**: Projects must exist before assignment
- **S2-04 → S2-05**: Load page needed before management features
- **S2-11 → S2-12 → S2-13**: CRM setup → mapping → export
- **Client credentials required for S2-11+ testing**

### Risk Mitigation

✅ **Bitrix24 moved to end**: Reduces blocking risk  
✅ **Core features first**: Value delivered even if CRM delayed  
✅ **No backend dependencies**: All client-side implementation  
✅ **Incremental delivery**: Each epic provides immediate value

### Blocking Risks

1. **Client credentials delay**: Can develop with mocks, test when available
2. **Excel format mismatch**: Test with original template early
3. **localStorage quota**: Auto-cleanup implemented

---

## 📈 BURNDOWN TRACKING

### Total Hours: 80 (10 days × 8 hours)

**Daily Targets**:

- Day 1: 72h remaining (10h completed)
- Day 2: 62h remaining (18h completed)
- Day 3: 54h remaining (26h completed)
- Day 4: 44h remaining (36h completed)
- Day 5: 34h remaining (46h completed)
- Day 6: 26h remaining (54h completed)
- Day 7: 18h remaining (62h completed)
- Day 8: 12h remaining (68h completed)
- Day 9: 4h remaining (76h completed)
- Day 10: 0h remaining (80h completed)

### Story Completion Milestones

- **Day 3**: Epic 1 complete (Save/Load working)
- **Day 5**: Epic 2 complete (Excel export working)
- **Day 7**: Epic 4 complete (Projects working)
- **Day 9**: Epic 3 complete (Bitrix24 working)
- **Day 10**: All epics polished and deployed

---

## ✅ DEFINITION OF DONE

### Global DoD (All Stories)

- [ ] Code complete and reviewed
- [ ] Unit tests written and passing
- [ ] Integration tested with existing features
- [ ] Error handling implemented
- [ ] Localization added (RU/EN strings)
- [ ] No console errors or warnings
- [ ] Performance meets targets (<50ms for operations)
- [ ] PR ready for production

### Sprint 2 Complete When

- [ ] All 13 user stories implemented and tested
- [ ] Save/load workflow functional
- [ ] Excel export produces correct files
- [ ] Project organization working
- [ ] Bitrix24 integration tested (pending client credentials)
- [ ] All tests passing (unit + integration + E2E)
- [ ] Client trained on new features
- [ ] Deployed to production environment

---

## 🤝 SPRINT CEREMONIES

### Daily Standup Format (5 min max)

**Yesterday**: What story was completed?  
**Today**: What story is in progress?  
**Blockers**: Any impediments to progress?  
**Burndown**: Hours remaining vs target

### Sprint Review Agenda (Day 10)

1. **Demo all features** (20 min)
   - Save/load calculations
   - Excel export with 3 sheets
   - Project organization
   - Bitrix24 integration (if credentials available)

2. **Business value delivered** (10 min)
   - Workflow improvements demonstrated
   - Time savings quantified
   - Integration benefits shown

3. **Client feedback** (15 min)
   - Feature acceptance
   - Change requests for future
   - Go-live decision

### Retrospective Questions

**What went well?**

- Which features delivered most value?
- What was easier than expected?

**What was challenging?**

- Technical blockers encountered
- Dependencies that caused delays

**What to improve?**

- Process improvements for future sprints
- Better estimation techniques

---

## 🚨 ESCALATION PATHS

### Bitrix24 Credentials Delay

**Trigger**: No credentials by Day 6  
**Action**: Implement with mock data, prepare for rapid deployment when available  
**Owner**: Scrum Master to contact client

### Excel Format Issues

**Trigger**: Export doesn't match original template  
**Action**: Priority fix, may require client template review  
**Owner**: Developer + client validation

### localStorage Quota Problems

**Trigger**: Storage failures in testing  
**Action**: Implement aggressive cleanup, reduce data stored  
**Owner**: Developer, may impact data retention

### Performance Issues

**Trigger**: Operations >200ms  
**Action**: Immediate optimization required  
**Owner**: Developer, may require scope reduction

---

## 📞 CLIENT COMMUNICATION PLAN

### Day 1: Sprint start

- Confirm Bitrix24 credentials timeline
- Request Excel template validation access

### Day 5: Mid-sprint demo

- Show save/load and Excel export
- Get feedback before proceeding to Bitrix24

### Day 8: Bitrix24 setup

- Validate credentials and test connection
- Confirm field mapping requirements

### Day 10: Sprint review

- Demo all features
- Training session
- Go-live decision

---

## 🏁 SUCCESS CRITERIA

### Functional Success

- ✅ Zero data loss on browser refresh
- ✅ Excel files open correctly in Excel/LibreOffice
- ✅ Bitrix24 creates deals with correct data
- ✅ Projects organize calculations logically
- ✅ Performance targets met (<50ms save/load)

### Business Success

- 🎯 Replaces 100% of Excel workflow
- 🎯 Reduces quote preparation time >50%
- 🎯 Eliminates manual CRM data entry
- 🎯 No additional training required for calculation part
- 🎯 Client ready to use immediately after training

---

**SPRINT 2 IS READY TO START!**  
**Next Action**: Begin S2-01 StorageService implementation immediately.

All stories are properly sized (4-10 hours), dependencies mapped, and daily goals clear. Bitrix24 positioned at the end eliminates blocking risk while maintaining business value delivery.
