# LH Calculator User Stories
**Version**: 1.0  
**Date**: 2025-08-06  
**Project**: LH Heat Exchanger Cost Calculator

---

## Epic Overview

### Epic 1: Core Calculation Engine
**Business Value**: Replace Excel with 100% mathematical equivalence  
**Total Story Points**: 34  
**Dependencies**: Foundation for all other epics

### Epic 2: Technical Input Management  
**Business Value**: Streamlined data entry with validation  
**Total Story Points**: 21  
**Dependencies**: Material database, validation engine

### Epic 3: Component Calculations  
**Business Value**: Real-time cost calculations  
**Total Story Points**: 29  
**Dependencies**: Core engine, input management

### Epic 4: Results & Reporting
**Business Value**: Professional output and export capabilities  
**Total Story Points**: 18  
**Dependencies**: Component calculations

### Epic 5: Material Database Management
**Business Value**: Centralized material property management  
**Total Story Points**: 15  
**Dependencies**: None (can run parallel)

### Epic 6: Bitrix24 Integration
**Business Value**: Seamless CRM workflow integration  
**Total Story Points**: 13  
**Dependencies**: Results system

### Epic 7: Data Import/Export
**Business Value**: Data portability and backup capabilities  
**Total Story Points**: 8  
**Dependencies**: All calculation systems

---

## Epic 1: Core Calculation Engine Setup

### E1-S1: Foundation Calculation Infrastructure
**As a** system developer  
**I want to** establish the core calculation engine architecture  
**So that** all 962 formulas can be implemented systematically  

**Acceptance Criteria**:
- CalculationEngine class with dependency injection pattern
- TypeScript interfaces for all Excel data structures (HeatExchanger, MaterialSpec, ComponentCosts)
- Formula-as-code pattern implementation with 1:1 Excel correspondence
- Error handling and validation pipeline integration
- Unit test framework setup for formula validation

**Technical Notes**:
- Implement immutable state patterns to prevent calculation inconsistencies
- Set up cross-sheet reference resolution system (142 dependencies)
- Create formula cache and memoization infrastructure
- Establish calculation performance monitoring (<2 second target)

**Priority**: P0  
**Story Points**: 8

### E1-S2: Excel Formula Translation System
**As a** calculation engine  
**I want to** translate all 962 Excel formulas to TypeScript functions  
**So that** mathematical equivalence is maintained  

**Acceptance Criteria**:
- Direct translation of critical formulas (AI73, AJ73, G22, M22)
- Implementation of CEILING.PRECISE, VLOOKUP, and complex IF logic
- Named range support for material lookups
- Cross-sheet reference handling (технолог → снабжение → результат)
- Comprehensive test suite comparing 100+ calculation scenarios

**Technical Notes**:
- Focus on pressure test calculations (AI73/AJ73) first
- Implement conditional cost calculations (G22/M22) 
- Handle temperature-stress matrix lookups
- Maintain Excel's floating-point precision and rounding behavior

**Priority**: P0  
**Story Points**: 13

### E1-S3: Three-Sheet Calculation Flow
**As a** calculation coordinator  
**I want to** orchestrate calculations across технолог, снабжение, and результат sheets  
**So that** the Excel workflow is preserved  

**Acceptance Criteria**:
- технолог sheet calculations (26 formulas) - input processing
- снабжение sheet calculations (907 formulas) - component processing  
- результат sheet calculations (29 formulas) - cost aggregation
- Proper dependency resolution between sheets
- Incremental recalculation when inputs change

**Technical Notes**:
- Implement reactive calculation pipeline
- Handle 81 снабжение→технолог references
- Process 51 результат→снабжение references  
- Manage 10 результат→технолог references

**Priority**: P0  
**Story Points**: 8

### E1-S4: Calculation Performance Optimization
**As a** system user  
**I want** calculations to complete within 2 seconds  
**So that** the system feels responsive during use  

**Acceptance Criteria**:
- Multi-level caching strategy (formula, material, session)
- Memoization of expensive material lookups
- Batch processing for similar calculations
- Lazy loading of calculation modules
- Performance monitoring and alerting

**Technical Notes**:
- Implement smart cache invalidation on input changes
- Use Web Workers for heavy calculations if needed
- Profile calculation bottlenecks
- Set up performance regression testing

**Priority**: P1  
**Story Points**: 5

---

## Epic 2: Technical Input Management

### E2-S1: Input Form Infrastructure
**As a** process engineer  
**I want to** input heat exchanger specifications through a structured form  
**So that** I can efficiently enter technical parameters  

**Acceptance Criteria**:
- Input form matching Excel технолог sheet (E27-V27 range)
- 25+ technical parameter fields with proper types
- Real-time input validation and feedback
- Auto-save functionality with state persistence
- Input field grouping and progressive disclosure

**Technical Notes**:
- Use Mantine form components with TypeScript validation
- Implement Zustand state management with persistence
- Create reusable FormulaInput component
- Set up form validation using Zod schemas

**Priority**: P0  
**Story Points**: 5

### E2-S2: Material Selection System
**As a** technical user  
**I want to** select materials from predefined lists with validation  
**So that** only compatible materials are chosen  

**Acceptance Criteria**:
- Plate material dropdown (материал_пластин: AS47:AS54)
- Housing material dropdown (материал_корпуса: AU47:AU54)
- Heat exchanger type selection (типоразмеры_К4: AM45:AM52)
- Plate thickness options (толщина_пластины: AL47:AL53)
- Material compatibility validation with temperature/pressure

**Technical Notes**:
- Implement named range equivalents as static TypeScript data
- Create MaterialSelector reusable component
- Add temperature-material compatibility checks
- Provide material property tooltips

**Priority**: P0  
**Story Points**: 3

### E2-S3: Advanced Input Validation
**As a** quality assurance system  
**I want to** validate all technical inputs against engineering constraints  
**So that** invalid configurations are prevented  

**Acceptance Criteria**:
- Temperature range validation (20°C - 400°C)
- Pressure limits based on material specifications
- Plate count limits by heat exchanger type
- Material-temperature compatibility checks
- Cross-field validation dependencies

**Technical Notes**:
- Create ValidationEngine class with rule-based validation
- Implement real-time validation feedback
- Add validation error recovery suggestions
- Set up comprehensive validation test coverage

**Priority**: P0  
**Story Points**: 5

### E2-S4: Input Configuration Management
**As a** frequent user  
**I want to** save and load input configurations  
**So that** I can reuse common specifications  

**Acceptance Criteria**:
- Save current input set as named configuration
- Load saved configurations from list
- Configuration sharing and import/export
- Configuration validation on load
- Recent configurations quick access

**Technical Notes**:
- Extend Zustand store with configuration management
- Implement localStorage persistence
- Add configuration metadata (name, date, description)
- Create configuration import/export utilities

**Priority**: P2  
**Story Points**: 3

### E2-S5: Bulk Input Processing
**As a** project manager  
**I want to** process multiple heat exchanger specifications in batch  
**So that** I can calculate costs for entire projects efficiently  

**Acceptance Criteria**:
- CSV/Excel import for multiple configurations
- Batch processing with progress indication
- Individual result validation and error handling
- Bulk export of all calculated results
- Summary reporting across all configurations

**Technical Notes**:
- Create batch processing pipeline
- Implement file upload and parsing
- Add progress tracking and cancellation
- Handle partial batch failures gracefully

**Priority**: P2  
**Story Points**: 5

---

## Epic 3: Component Calculations Processing

### E3-S1: Real-time Calculation Display
**As a** cost analyst  
**I want to** see calculations update immediately as I change inputs  
**So that** I can understand cost impact of design decisions  

**Acceptance Criteria**:
- Live calculation updates with <300ms debounced response
- Intermediate calculation visibility (снабжение sheet equivalent)
- Calculation progress indicators for complex operations
- Error states with clear messaging
- Calculation timestamp and version tracking

**Technical Notes**:
- Implement reactive calculation pipeline with useMemo
- Create CalculationResult display components
- Add debounced calculation triggers
- Show calculation dependency flow

**Priority**: P0  
**Story Points**: 5

### E3-S2: Component Cost Breakdown
**As a** cost engineer  
**I want to** see detailed cost breakdown by component type  
**So that** I can identify cost optimization opportunities  

**Acceptance Criteria**:
- Panel cost calculations with material and labor breakdown
- Housing cost calculations with manufacturing factors
- Component-specific cost drivers (plates, covers, flanges, etc.)
- Cost per unit and total cost visibility
- Cost comparison against material alternatives

**Technical Notes**:
- Implement 8 major component calculation categories
- Create cost breakdown visualization components
- Add cost sensitivity analysis
- Handle conditional cost logic (G22/M22 formula equivalents)

**Priority**: P0  
**Story Points**: 8

### E3-S3: Pressure Test Calculations
**As a** safety engineer  
**I want** accurate pressure test calculations based on material properties  
**So that** equipment meets safety standards  

**Acceptance Criteria**:
- Hot side test pressure calculation (AI73 formula equivalent)
- Cold side test pressure calculation (AJ73 formula equivalent)
- Material stress lookup with temperature compensation
- Safety factor application (1.25x base calculation)
- Pressure test report generation

**Technical Notes**:
- Implement CEILING.PRECISE equivalent with proper rounding
- Create temperature-stress matrix lookup system
- Add material property validation
- Handle edge cases and error conditions

**Priority**: P0  
**Story Points**: 5

### E3-S4: Material Property Integration
**As a** materials engineer  
**I want** calculations to use current material property data  
**So that** results reflect actual material capabilities  

**Acceptance Criteria**:
- Real-time material property lookups
- Temperature-dependent stress value calculations
- Material density and cost factor integration
- Multiple material standard support (AISI, Russian GOST)
- Material substitution impact analysis

**Technical Notes**:
- Create MaterialDatabase class with property caching
- Implement VLOOKUP equivalent for temperature-stress matrices
- Add material property interpolation for intermediate temperatures
- Handle missing material data gracefully

**Priority**: P1  
**Story Points**: 5

### E3-S5: Calculation Audit Trail
**As a** quality manager  
**I want** complete calculation traceability  
**So that** results can be verified and audited  

**Acceptance Criteria**:
- Step-by-step calculation logging
- Input parameter versioning
- Formula execution trace
- Calculation result history
- Audit report generation with all assumptions

**Technical Notes**:
- Implement calculation logging infrastructure
- Create audit trail storage and retrieval
- Add calculation reproducibility verification
- Generate calculation certificates

**Priority**: P2  
**Story Points**: 3

### E3-S6: Advanced Calculation Features
**As a** senior engineer  
**I want** advanced calculation capabilities beyond basic Excel functionality  
**So that** I can perform sophisticated cost analysis  

**Acceptance Criteria**:
- Sensitivity analysis for key parameters
- Monte Carlo simulation for uncertainty analysis
- Multi-scenario comparison
- Optimization suggestions
- What-if analysis tools

**Technical Notes**:
- Implement parameter sensitivity calculation
- Add statistical analysis capabilities
- Create scenario comparison interface
- Build optimization recommendation engine

**Priority**: P2  
**Story Points**: 3

---

## Epic 4: Results Display & Export

### E4-S1: Professional Results Dashboard
**As a** project stakeholder  
**I want to** see calculation results in a professional, comprehensive format  
**So that** I can make informed business decisions  

**Acceptance Criteria**:
- Cost summary with total project cost
- Component cost breakdown with percentages
- Material specifications summary
- Key technical parameters display
- Professional visual design matching corporate standards

**Technical Notes**:
- Create ResultsPage with Mantine components
- Implement cost visualization charts
- Add summary statistics and key metrics
- Design print-friendly layout

**Priority**: P0  
**Story Points**: 5

### E4-S2: Excel Export Generation
**As a** document manager  
**I want to** export results to Excel format  
**So that** results can be shared with stakeholders using familiar tools  

**Acceptance Criteria**:
- Excel export with original sheet structure
- All calculation results preserved
- Formatted tables with proper headers
- Formula preservation where applicable
- Custom branding and headers

**Technical Notes**:
- Implement Excel generation using SheetJS or similar
- Create export templates matching original format
- Handle complex formatting and cell styling
- Add export progress indication

**Priority**: P1  
**Story Points**: 3

### E4-S3: PDF Report Generation
**As a** client-facing professional  
**I want to** generate PDF reports with calculation results  
**So that** I can provide professional documentation to customers  

**Acceptance Criteria**:
- Professional PDF layout with company branding
- Complete cost breakdown and specifications
- Technical diagrams and illustrations
- Calculation methodology explanation
- Digital signature and timestamp

**Technical Notes**:
- Use PDF generation library (jsPDF or Puppeteer)
- Create report templates with consistent styling
- Add chart and diagram generation
- Implement digital watermarking

**Priority**: P1  
**Story Points**: 5

### E4-S4: Results Comparison Tools
**As a** design engineer  
**I want to** compare multiple calculation scenarios side-by-side  
**So that** I can optimize design choices  

**Acceptance Criteria**:
- Side-by-side comparison of up to 4 scenarios
- Difference highlighting and percentage changes
- Cost optimization recommendations
- Export comparison reports
- Scenario naming and organization

**Technical Notes**:
- Create comparison visualization components
- Implement diff calculation algorithms
- Add scenario management state handling
- Design responsive comparison layouts

**Priority**: P2  
**Story Points**: 3

### E4-S5: Custom Report Builder
**As a** business user  
**I want to** customize report content and layout  
**So that** reports meet specific stakeholder requirements  

**Acceptance Criteria**:
- Drag-and-drop report section arrangement
- Custom field selection and formatting
- Template creation and sharing
- Brand customization options
- Report preview before generation

**Technical Notes**:
- Build report builder interface
- Implement template engine system
- Add drag-and-drop functionality
- Create template storage and management

**Priority**: P2  
**Story Points**: 2

---

## Epic 5: Material Database Management

### E5-S1: Material Property Database
**As a** materials engineer  
**I want to** maintain comprehensive material property data  
**So that** calculations use accurate, current material specifications  

**Acceptance Criteria**:
- Complete material property database (AISI, GOST standards)
- Temperature-stress matrices for all materials
- Material cost data with update timestamps
- Property validation and consistency checks
- Material specification search and filtering

**Technical Notes**:
- Create MaterialDatabase class with CRUD operations
- Implement temperature-stress matrix storage
- Add material property validation rules
- Design material search and filter interface

**Priority**: P0  
**Story Points**: 5

### E5-S2: Temperature-Stress Matrix Management
**As a** thermal analyst  
**I want to** manage temperature-dependent material properties  
**So that** calculations account for operating temperature effects  

**Acceptance Criteria**:
- Temperature range management (20°C - 400°C)
- Stress value interpolation for intermediate temperatures
- Multiple material support with individual curves
- Temperature-stress curve visualization
- Data validation and consistency checking

**Technical Notes**:
- Implement temperature interpolation algorithms
- Create matrix visualization components
- Add curve fitting and validation
- Handle edge cases and extrapolation

**Priority**: P1  
**Story Points**: 3

### E5-S3: Material Cost Updates
**As a** procurement manager  
**I want to** update material costs based on current supplier pricing  
**So that** calculations reflect current market conditions  

**Acceptance Criteria**:
- Material cost entry and bulk update
- Price history tracking with timestamps
- Cost escalation factor management
- Supplier-specific pricing support
- Cost update audit trail

**Technical Notes**:
- Create cost management interface
- Implement price history storage
- Add bulk update capabilities
- Design cost trend visualization

**Priority**: P1  
**Story Points**: 3

### E5-S4: Material Standards Integration
**As a** standards compliance officer  
**I want** material properties to comply with international standards  
**So that** calculations meet regulatory requirements  

**Acceptance Criteria**:
- AISI, ASTM, and GOST standard support
- Standard compliance validation
- Cross-reference between different standards
- Standard update notification system
- Compliance reporting

**Technical Notes**:
- Implement standards database structure
- Create compliance validation rules
- Add cross-reference lookup system
- Design standards update mechanism

**Priority**: P2  
**Story Points**: 2

### E5-S5: Material Database Backup & Sync
**As a** system administrator  
**I want** reliable material database backup and synchronization  
**So that** data is protected and consistent across deployments  

**Acceptance Criteria**:
- Automated database backup with versioning
- Data export/import functionality
- Multi-site synchronization capability
- Data integrity verification
- Recovery procedures and testing

**Technical Notes**:
- Implement backup scheduling and storage
- Create data synchronization protocols
- Add integrity checking algorithms
- Design recovery procedures

**Priority**: P2  
**Story Points**: 2

---

## Epic 6: Bitrix24 Integration

### E6-S1: Bitrix24 API Connection
**As a** sales manager  
**I want to** export calculation results directly to Bitrix24  
**So that** quotes can be generated seamlessly in our CRM  

**Acceptance Criteria**:
- Secure API authentication with Bitrix24
- Field mapping configuration for all calculation outputs
- Export success/failure handling and retry logic
- Connection testing and validation
- Error logging and troubleshooting

**Technical Notes**:
- Implement OAuth2 authentication flow
- Create field mapping configuration system
- Add retry logic with exponential backoff
- Design connection health monitoring

**Priority**: P0  
**Story Points**: 5

### E6-S2: Quote Generation Integration
**As a** sales representative  
**I want** calculation results automatically formatted as Bitrix24 quotes  
**So that** I can quickly generate customer proposals  

**Acceptance Criteria**:
- Quote template mapping from calculation results
- Customer information integration
- Quote numbering and tracking
- Quote status management
- Quote revision handling

**Technical Notes**:
- Create quote template engine
- Implement Bitrix24 quote creation API calls
- Add quote metadata management
- Design quote versioning system

**Priority**: P1  
**Story Points**: 3

### E6-S3: CRM Workflow Integration
**As a** sales process manager  
**I want** calculations integrated into existing Bitrix24 workflows  
**So that** the tool fits seamlessly into our sales process  

**Acceptance Criteria**:
- Integration with existing deal stages
- Automated workflow triggers based on calculations
- Activity logging for calculation events
- Opportunity value updates from calculations
- Pipeline reporting with calculation data

**Technical Notes**:
- Study existing Bitrix24 workflow configuration
- Implement workflow trigger mechanisms
- Add activity logging to Bitrix24
- Create pipeline integration points

**Priority**: P1  
**Story Points**: 3

### E6-S4: Data Synchronization
**As a** data analyst  
**I want** bidirectional data sync between calculator and Bitrix24  
**So that** all systems maintain consistent information  

**Acceptance Criteria**:
- Customer data synchronization from Bitrix24
- Project information import for calculations
- Real-time data updates and conflict resolution
- Sync status monitoring and alerting
- Manual sync override capabilities

**Technical Notes**:
- Implement bidirectional sync protocols
- Add conflict resolution algorithms
- Create sync monitoring dashboard
- Design manual override interface

**Priority**: P2  
**Story Points**: 2

---

## Epic 7: Data Import/Export Capabilities

### E7-S1: Excel Configuration Import
**As a** existing Excel user  
**I want to** import my current Excel configurations  
**So that** I can transition smoothly to the web application  

**Acceptance Criteria**:
- Excel file parsing for input parameters
- Configuration validation and error reporting
- Bulk import with progress indication
- Import preview before commitment
- Import history and rollback capabilities

**Technical Notes**:
- Implement Excel file parsing using SheetJS
- Create configuration validation pipeline
- Add import progress tracking
- Design preview and confirmation interface

**Priority**: P1  
**Story Points**: 3

### E7-S2: Data Export Formats
**As a** data consumer  
**I want** multiple export format options  
**So that** I can use calculation data in various downstream systems  

**Acceptance Criteria**:
- JSON export for API integration
- CSV export for spreadsheet analysis
- XML export for enterprise systems
- Custom format definition capability
- Batch export for multiple calculations

**Technical Notes**:
- Implement multiple export format generators
- Create custom format definition interface
- Add batch export processing
- Design format validation and testing

**Priority**: P2  
**Story Points**: 3

### E7-S3: Configuration Templates
**As a** template administrator  
**I want to** create and share configuration templates  
**So that** common configurations can be reused across teams  

**Acceptance Criteria**:
- Template creation from existing configurations
- Template sharing and access control
- Template versioning and updates
- Template validation and testing
- Template library organization

**Technical Notes**:
- Create template management system
- Implement access control mechanisms
- Add template versioning infrastructure
- Design template organization interface

**Priority**: P2  
**Story Points**: 2

---

## Sprint Planning

### Sprint 1: MVP Foundation (Weeks 1-2)
**Goal**: Establish core infrastructure and basic calculation capability  
**Story Points**: 21

**Stories**:
- E1-S1: Foundation Calculation Infrastructure (8 pts)
- E1-S2: Excel Formula Translation System (13 pts) - Phase 1 only

**Definition of Done**:
- Core calculation engine architecture complete
- Critical formulas (AI73, AJ73, G22, M22) implemented
- Basic TypeScript interfaces defined
- Initial test framework established

### Sprint 2: Core Calculations (Weeks 3-4)
**Goal**: Complete calculation engine and establish three-sheet flow  
**Story Points**: 24

**Stories**:
- E1-S2: Excel Formula Translation System - Phase 2 (remaining work)
- E1-S3: Three-Sheet Calculation Flow (8 pts)
- E2-S1: Input Form Infrastructure (5 pts)
- E2-S2: Material Selection System (3 pts)

**Definition of Done**:
- All 962 formulas translated and tested
- Three-sheet calculation flow operational
- Basic input forms functional
- Material selection working

### Sprint 3: User Interface & Validation (Weeks 5-6)  
**Goal**: Complete user interface and input validation system  
**Story Points**: 23

**Stories**:
- E2-S3: Advanced Input Validation (5 pts)
- E3-S1: Real-time Calculation Display (5 pts)
- E3-S2: Component Cost Breakdown (8 pts)
- E5-S1: Material Property Database (5 pts)

**Definition of Done**:
- Complete input validation system
- Real-time calculation updates
- Detailed cost breakdown display
- Material database operational

### Sprint 4: Results & Integration (Weeks 7-8)
**Goal**: Complete results system and Bitrix24 integration  
**Story Points**: 22

**Stories**:
- E3-S3: Pressure Test Calculations (5 pts)
- E4-S1: Professional Results Dashboard (5 pts)
- E6-S1: Bitrix24 API Connection (5 pts)
- E4-S2: Excel Export Generation (3 pts)
- E1-S4: Calculation Performance Optimization (5 pts)

**Definition of Done**:
- Complete results dashboard
- Bitrix24 integration functional
- Excel export capability
- Performance targets met (<2 seconds)

### Sprint 5: Advanced Features (Weeks 9-10)
**Goal**: Complete advanced features and polish  
**Story Points**: 20

**Stories**:
- E3-S4: Material Property Integration (5 pts)
- E4-S3: PDF Report Generation (5 pts)
- E6-S2: Quote Generation Integration (3 pts)
- E7-S1: Excel Configuration Import (3 pts)
- E2-S4: Input Configuration Management (3 pts)

**Definition of Done**:
- Advanced material property handling
- PDF report generation
- Quote integration with Bitrix24
- Configuration management complete

### Sprint 6: Polish & Production Readiness (Weeks 11-12)
**Goal**: Final polish and production deployment preparation  
**Story Points**: 17

**Stories**:
- E3-S5: Calculation Audit Trail (3 pts)
- E4-S4: Results Comparison Tools (3 pts)
- E5-S2: Temperature-Stress Matrix Management (3 pts)
- E5-S3: Material Cost Updates (3 pts)
- E6-S3: CRM Workflow Integration (3 pts)
- E7-S2: Data Export Formats (3 pts)

**Definition of Done**:
- Audit trail system complete
- Comparison tools functional
- Material management complete
- Full CRM workflow integration
- All export formats working

---

## Implementation Dependencies

### Critical Path
1. **Foundation** → **Calculations** → **User Interface** → **Results** → **Integration**
2. Material Database can be developed in parallel with calculations
3. Export functionality requires completed results system
4. Bitrix24 integration requires results and quote systems

### Risk Mitigation
1. **Complex Formula Translation**: Implement comprehensive test suite comparing outputs
2. **Material Property Accuracy**: Create validation pipeline with engineering review
3. **Cross-Sheet Dependencies**: Build dependency tracking and testing system
4. **Performance Requirements**: Implement performance monitoring from Sprint 1

### Quality Gates
- **Sprint 1**: Core calculation accuracy validated against Excel
- **Sprint 2**: Complete three-sheet flow operational
- **Sprint 3**: User acceptance testing with domain experts
- **Sprint 4**: Bitrix24 integration testing with real data
- **Sprint 5**: Performance testing and optimization verification
- **Sprint 6**: Production readiness validation and deployment

This comprehensive user story framework provides a clear roadmap for implementing the LH Calculator while maintaining focus on delivering incremental value and ensuring Excel calculation accuracy throughout the development process.