# UX Role-Based Design Proposals for LH Calculator

## Executive Summary

Based on the Excel color-coding analysis, we need to transform the current single-form interface into a sophisticated multi-actor workflow system that respects role boundaries and enforces proper data entry sequences.

## Current State Problems

1. **Single monolithic form** - All 155+ fields in one view
2. **No role separation** - Any user can edit any field
3. **No workflow enforcement** - Fields can be filled in any order
4. **Missing visual cues** - No color-coding to guide users
5. **No approval stages** - Direct calculation without validation

## Proposal 1: Role-Based Dashboard Architecture

### Navigation Structure
```
LH Calculator
├── Dashboard (Role-Specific)
│   ├── My Tasks
│   ├── Pending Approvals
│   └── Recent Projects
├── Projects Hub
│   ├── Active Projects
│   ├── Drafts
│   └── Completed
└── Role Workspaces
    ├── Technologist Workspace
    ├── Design Engineering
    ├── Supply Management
    └── Executive Review
```

### Implementation

#### 1. User Authentication & Roles
```typescript
enum UserRole {
  TECHNOLOGIST = 'technologist',
  DESIGN_ENGINEER = 'design_engineer', 
  SUPPLY_MANAGER = 'supply_manager',
  GENERAL_DIRECTOR = 'general_director',
  VIEWER = 'viewer'
}

interface User {
  id: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  department: string;
}
```

#### 2. Role-Specific Dashboards

**Technologist Dashboard**
- Active specifications to complete
- Equipment configuration wizard
- Material selection interface
- Technical validation alerts

**Design Engineer Dashboard**
- Engineering specifications queue
- Connection design tools
- Fastener configuration
- Technical drawings attachment

**Supply Manager Dashboard**
- Procurement requirements
- Pricing updates interface
- Vendor management
- Cost tracking

**Executive Dashboard**
- Projects awaiting approval
- Cost override controls
- Performance metrics
- Margin analysis

## Proposal 2: Staged Workflow System

### Project Lifecycle States
```
DRAFT → TECHNICAL_SPEC → ENGINEERING → PROCUREMENT → REVIEW → APPROVED → CALCULATED
```

### Visual Workflow
```
┌─────────────────┐
│   STAGE 1       │ Technologist
│  Technical Spec │ (Yellow/Green fields)
└────────┬────────┘
         ↓
┌─────────────────┐
│   STAGE 2       │ Design Engineer
│   Engineering   │ (Orange fields)
└────────┬────────┘
         ↓
┌─────────────────┐
│   STAGE 3       │ Supply Manager
│  Procurement    │ (Green fields)
└────────┬────────┘
         ↓
┌─────────────────┐
│   STAGE 4       │ General Director
│  Final Review   │ (Red fields)
└────────┬────────┘
         ↓
┌─────────────────┐
│  CALCULATION    │ System
│    RESULTS      │ (Auto-generated)
└─────────────────┘
```

### Stage Implementation

#### Stage 1: Technical Specification (Technologist)
```tsx
<TechnicalSpecificationForm>
  <Section color="yellow" title="Equipment Configuration">
    - Equipment Type (Dropdown)
    - Model Selection (Dropdown)
    - Plate Material (Dropdown)
  </Section>
  
  <Section color="green" title="Operating Parameters">
    - Plate Count (Input)
    - Operating Pressure (Input)
    - Temperature Ranges (Input)
  </Section>
  
  <ValidationPanel>
    - Technical feasibility check
    - Material compatibility
    - Pressure/temperature limits
  </ValidationPanel>
</TechnicalSpecificationForm>
```

#### Stage 2: Engineering Design (Design Engineer)
```tsx
<EngineeringDesignForm>
  <Section color="orange" title="Connection Design">
    - Flange Specifications
    - Connection Materials
    - Mounting Configuration
  </Section>
  
  <Section color="orange" title="Fastener Selection">
    - Bolt Type & Quantity
    - Gasket Specifications
    - Assembly Requirements
  </Section>
</EngineeringDesignForm>
```

#### Stage 3: Procurement (Supply Manager)
```tsx
<ProcurementForm>
  <Section color="green" title="Project Information">
    - Project Number
    - Client Details
    - Delivery Requirements
  </Section>
  
  <Section color="green" title="Pricing & Costs">
    - Material Costs
    - Labor Rates
    - Logistics Costs
  </Section>
</ProcurementForm>
```

#### Stage 4: Executive Review (General Director)
```tsx
<ExecutiveReviewForm>
  <ReadOnlySummary>
    - Technical Specifications
    - Engineering Details
    - Base Cost Calculation
  </ReadOnlySummary>
  
  <Section color="red" title="Management Controls">
    - Management Coefficient
    - Director's Reserve
    - Final Adjustments
  </Section>
</ExecutiveReviewForm>
```

## Proposal 3: Color-Coded Field System

### Visual Language Implementation

```css
/* Field Color Coding System */
.field-yellow {
  background-color: #FFFACD; /* Light yellow */
  border-left: 4px solid #FFFF00;
}

.field-green {
  background-color: #E8F5E8; /* Light green */
  border-left: 4px solid #92D050;
}

.field-orange {
  background-color: #FFF4E6; /* Light orange */
  border-left: 4px solid #FFC000;
}

.field-red {
  background-color: #FFEBEB; /* Light red */
  border-left: 4px solid #FF0000;
}

.field-calculated {
  background-color: #F5F5F5; /* Light gray */
  cursor: not-allowed;
}
```

### Field Component with Role Enforcement

```tsx
interface ColorCodedFieldProps {
  fieldName: string;
  color: 'yellow' | 'green' | 'orange' | 'red' | 'white';
  userRole: UserRole;
  value: any;
  onChange: (value: any) => void;
}

const ColorCodedField: React.FC<ColorCodedFieldProps> = ({
  fieldName,
  color,
  userRole,
  value,
  onChange
}) => {
  const canEdit = checkPermission(userRole, color);
  
  return (
    <div className={`field-${color}`}>
      <label>{t(`form.fields.${fieldName}`)}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!canEdit}
        className={!canEdit ? 'locked' : ''}
      />
      {!canEdit && (
        <span className="lock-icon">
          🔒 {getRoleForColor(color)} only
        </span>
      )}
    </div>
  );
};
```

## Proposal 4: Project-Centric Organization

### Project Hub Interface

```
┌─────────────────────────────────────────────────┐
│                PROJECT DASHBOARD                 │
├─────────────────────────────────────────────────┤
│  Project: HE-2024-001                          │
│  Client: Gazprom                               │
│  Status: Engineering Review (Stage 2/4)        │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ STAGE 1  │ │ STAGE 2  │ │ STAGE 3  │       │
│  │    ✅    │ │    🔄    │ │    ⏳    │       │
│  │Complete  │ │In Progress│ │ Waiting  │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│  Contributors:                                 │
│  👤 Ivan Petrov (Technologist) - Completed     │
│  👤 Maria Smirnova (Engineer) - Working        │
│  👤 Alex Volkov (Supply) - Awaiting           │
│  👤 Director Approval - Pending               │
│                                                 │
│  [View Details] [Edit My Section] [History]    │
└─────────────────────────────────────────────────┘
```

### Project Data Structure

```typescript
interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  currentStage: WorkflowStage;
  stages: {
    technical: {
      status: 'pending' | 'in_progress' | 'completed' | 'rejected';
      assignee: User;
      data: TechnicalData;
      completedAt?: Date;
    };
    engineering: {
      status: 'pending' | 'in_progress' | 'completed' | 'rejected';
      assignee: User;
      data: EngineeringData;
      completedAt?: Date;
    };
    procurement: {
      status: 'pending' | 'in_progress' | 'completed' | 'rejected';
      assignee: User;
      data: ProcurementData;
      completedAt?: Date;
    };
    executive: {
      status: 'pending' | 'in_progress' | 'completed' | 'rejected';
      approver: User;
      adjustments: ExecutiveAdjustments;
      approvedAt?: Date;
    };
  };
  calculations?: CalculationResults;
  history: AuditLog[];
}
```

## Proposal 5: Progressive Disclosure UI

### Collapsible Stage-Based Form

```tsx
const ProjectWorkflow: React.FC = () => {
  const { currentUser, project } = useProjectContext();
  
  return (
    <div className="workflow-container">
      <WorkflowProgress 
        stages={project.stages}
        current={project.currentStage}
      />
      
      <Accordion>
        <AccordionItem 
          title="Technical Specification"
          status={project.stages.technical.status}
          locked={!canEditStage(currentUser, 'technical')}
        >
          <TechnicalSpecForm 
            data={project.stages.technical.data}
            readOnly={!canEditStage(currentUser, 'technical')}
          />
        </AccordionItem>
        
        <AccordionItem 
          title="Engineering Design"
          status={project.stages.engineering.status}
          locked={!canEditStage(currentUser, 'engineering')}
        >
          <EngineeringForm 
            data={project.stages.engineering.data}
            readOnly={!canEditStage(currentUser, 'engineering')}
          />
        </AccordionItem>
        
        <AccordionItem 
          title="Procurement & Pricing"
          status={project.stages.procurement.status}
          locked={!canEditStage(currentUser, 'procurement')}
        >
          <ProcurementForm 
            data={project.stages.procurement.data}
            readOnly={!canEditStage(currentUser, 'procurement')}
          />
        </AccordionItem>
        
        <AccordionItem 
          title="Executive Review"
          status={project.stages.executive.status}
          locked={!canEditStage(currentUser, 'executive')}
        >
          <ExecutiveReview 
            project={project}
            readOnly={!canEditStage(currentUser, 'executive')}
          />
        </AccordionItem>
      </Accordion>
      
      <ActionButtons 
        stage={project.currentStage}
        userRole={currentUser.role}
      />
    </div>
  );
};
```

## Implementation Recommendations

### Phase 1: Foundation (Week 1-2)
1. Implement user authentication system
2. Create role-based access control
3. Add color-coding to existing fields
4. Create project data structure

### Phase 2: Workflow (Week 3-4)
1. Build staged workflow engine
2. Create role-specific dashboards
3. Implement field-level permissions
4. Add workflow state management

### Phase 3: UI Polish (Week 5-6)
1. Apply color-coded visual system
2. Create progressive disclosure UI
3. Add workflow progress indicators
4. Implement approval mechanisms

### Phase 4: Integration (Week 7-8)
1. Connect to Bitrix24 with roles
2. Add audit logging
3. Implement notifications
4. Create reporting dashboards

## Technical Architecture

### State Management
```typescript
// Zustand store for role-based workflow
interface WorkflowStore {
  currentUser: User;
  activeProject: Project;
  userProjects: Project[];
  
  // Actions
  setCurrentUser: (user: User) => void;
  loadProject: (projectId: string) => void;
  updateStageData: (stage: WorkflowStage, data: any) => void;
  submitStage: (stage: WorkflowStage) => void;
  approveStage: (stage: WorkflowStage) => void;
  rejectStage: (stage: WorkflowStage, reason: string) => void;
}
```

### Permission System
```typescript
const ROLE_PERMISSIONS = {
  technologist: {
    canEdit: ['yellow', 'green'],
    stages: ['technical']
  },
  design_engineer: {
    canEdit: ['orange'],
    stages: ['engineering']
  },
  supply_manager: {
    canEdit: ['green'],
    stages: ['procurement']
  },
  general_director: {
    canEdit: ['red'],
    stages: ['executive'],
    canOverride: true
  }
};
```

### Validation Rules
```typescript
const STAGE_VALIDATION = {
  technical: {
    required: ['equipmentType', 'plateCount', 'plateMaterial'],
    validate: (data: TechnicalData) => {
      // Technical feasibility checks
      return validateTechnicalSpec(data);
    }
  },
  engineering: {
    required: ['flangeSpec', 'connectionMaterial'],
    validate: (data: EngineeringData) => {
      // Engineering compatibility checks
      return validateEngineering(data);
    }
  }
};
```

## Benefits of This Approach

### For Users
- **Clear responsibilities** - Each role knows exactly what to fill
- **Guided workflow** - Stage-by-stage progression
- **Visual clarity** - Color coding matches Excel familiarity
- **Reduced errors** - Can only edit authorized fields

### For Business
- **Compliance** - Enforces proper approval chains
- **Auditability** - Complete history of who did what
- **Efficiency** - Parallel work on different stages
- **Quality** - Stage validation prevents errors

### For Development
- **Modular architecture** - Each stage is independent
- **Reusable components** - Color-coded fields used everywhere
- **Clear testing** - Role-based test scenarios
- **Maintainable** - Separation of concerns

## Migration Strategy

### Step 1: Add Authentication
- Implement basic login system
- Assign roles to users
- Create user management interface

### Step 2: Apply Color Coding
- Add visual indicators to existing form
- Show lock icons for unauthorized fields
- Display current user role

### Step 3: Create Workflow
- Split form into stages
- Add stage progression logic
- Implement approval system

### Step 4: Build Dashboards
- Create role-specific views
- Add project management
- Implement notifications

## Conclusion

The proposed UX transformation respects the sophisticated role model from the Excel color scheme while providing a modern, efficient web interface. The staged workflow ensures data quality, enforces business rules, and provides clear accountability throughout the heat exchanger cost calculation process.

The color-coding system (Yellow=Technologist dropdowns, Green=Manual entry, Orange=Engineering, Red=Executive) becomes the visual language that guides users through their responsibilities while preventing unauthorized modifications.