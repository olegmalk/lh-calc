# UX Architecture: Calculation vs Project Fields Separation

## Field Classification

### CALCULATION FIELDS (Affect Cost/Technical Results)
These fields directly participate in heat exchanger calculations and must be in the main workflow.

#### Technical Specification (Technologist - Yellow/Green)
- `equipmentType` - Equipment type selection (**VLOOKUP driver**)
- `plateCount` - Number of plates (**Core calculation**)
- `plateMaterial` - Plate material (**Cost driver**)
- `bodyMaterial` - Housing material (**Cost factor**)
- `plateThickness` - Thickness in mm (**Mass calculation**)
- `pressureA/B` - Operating pressures (**Test pressure calc**)
- `temperatureA/B` - Operating temperatures (**Material selection**)
- `surfaceType` - Surface configuration (**Manufacturing cost**)
- `corrugationType` - Corrugation type (**Performance factor**)

#### Engineering Design (Design Engineer - Orange)
- `flangeHotPressure1/2` - Flange pressure ratings (**Component cost**)
- `flangeHotDiameter1/2` - Flange sizes (**Component cost**)
- `flangeColdPressure1/2` - Cold side flanges (**Component cost**)
- `flangeColdDiameter1/2` - Cold side sizes (**Component cost**)
- `mountingPanelsCount` - Mounting panels (**Material cost**)

#### Supply/Procurement (Supply Manager - Green)
**These fields are now integrated into the main calculation workflow:**
- `laborRateD12` - Labor rate per hour (**Direct cost factor**)
- `laborCoefficientD13` - Labor coefficient (**Cost multiplier**)
- `materialCoefficientD14` - Material coefficient (**Cost multiplier**)
- Component costs 1-4 (**Direct cost additions**)
- Process costs 1-4 (**Manufacturing costs**)
- Material costs 1-3 (**Material additions**)

#### Executive Controls (Director - Red)
- `specialCost1-4` - Management adjustments (**Final cost modifiers**)
- `discountPercent` - Discount percentage (**Price adjustment**)

### PROJECT METADATA FIELDS (No Calculation Impact)
These fields are for documentation, tracking, and reporting only.

#### Project Information
- `projectName` - Project identifier
- `orderNumber` - Internal order number
- `clientName` - Client name
- `deliveryDate` - Delivery date
- `projectManager` - PM assignment
- `salesManager` - Sales assignment
- `positionNumber` - Position in order
- `customerOrderNumber` - Customer's reference

#### Documentation & Compliance
- `drawingsIncluded` - Include drawings
- `manualsIncluded` - Include manuals
- `certificatesIncluded` - Include certificates
- `warrantyPeriod` - Warranty duration
- `serviceContract` - Service agreement
- `certificationRequired` - Third-party cert
- `inspectionLevel` - Inspection requirements
- `qualityControl` - QC specifications

#### Logistics & Delivery
- `packagingType` - Packaging method
- `packagingMaterial` - Packaging materials
- `crateRequired` - Wooden crate needed
- `shippingMethod` - Shipping type
- `deliveryTerms` - Incoterms
- `insuranceRequired` - Insurance coverage
- `customsClearance` - Customs support
- `deliveryType` - Delivery classification

#### Spare Parts & Extras
- `sparePlates` - Spare plates quantity
- `spareGaskets` - Spare gaskets
- `spareBolts` - Spare bolts
- `spareNuts` - Spare nuts
- `spareKit` - Complete spare kit

#### Financial Terms (Non-calculation)
- `paymentTerms` - Payment schedule
- `currencyType` - Currency selection
- `exchangeRate` - Exchange rate
- `taxRate` - VAT/Tax rate

## Simplified Navigation Structure

```
LH Calculator
├── 📊 Calculation (Main)           // All calculation fields in role-based view
│   └── Role-based sections
│       ├── Technical (Yellow/Green)
│       ├── Engineering (Orange)
│       ├── Supply/Costs (Green)
│       └── Executive (Red)
│
├── 📋 Project Details              // Non-calculation metadata
│   ├── Project Info
│   ├── Documentation
│   ├── Logistics
│   └── Spare Parts
│
├── 📈 Results                      // Calculation outputs
│   └── Export options
│
└── 🗂️ Saved Calculations          // History and saved projects
```

## Pages to Remove/Consolidate

### REMOVE these standalone pages:
- `/supply` - **Merged into main calculation workflow**
- `/components` - **Merged into calculation**
- `/flanges` - **Part of engineering section**
- `/materials` - **Part of technical section**
- `/reference-data` - **Move to settings/help**

### KEEP these pages:
- `/` - Dashboard (role selector, quick stats)
- `/calculation` - Main calculation with all role fields
- `/project-details` - Non-calculation metadata
- `/results` - Calculation results
- `/saved` - Saved calculations history
- `/settings` - User preferences

## User Interface Design

### Main Navigation (Simplified)
```
┌────────────────────────────────────────────────────────────┐
│ 🏭 LH Calculator            [👤 Technologist ▼]            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [📊 Calculate] [📋 Project] [📈 Results] [🗂️ Saved]      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Calculation Page (All Roles, One Place)
```
┌────────────────────────────────────────────────────────────┐
│ CALCULATION WORKSPACE              Current Role: Technologist│
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ✅ Technical Specification (Your Section)        │    │
│  │                                                  │    │
│  │ Equipment Type: [K4-750 ▼]     🟨              │    │
│  │ Plate Count: [400]              🟩              │    │
│  │ Plate Material: [AISI 316L ▼]  🟨              │    │
│  │ Pressure A: [22] bar            🟩              │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 🔒 Engineering Design (Design Engineer Only)     │    │
│  │                                                  │    │
│  │ [Locked - Switch to Engineer role to edit]      │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 🔒 Supply Costs (Supply Manager Only)           │    │
│  │                                                  │    │
│  │ [Locked - Switch to Supply role to edit]        │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 🔒 Executive Controls (Director Only)           │    │
│  │                                                  │    │
│  │ [Locked - Switch to Director role to edit]      │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  [Calculate Costs →]                                      │
└────────────────────────────────────────────────────────────┘
```

### Supply Manager View (Same Page, Different Permissions)
```
┌────────────────────────────────────────────────────────────┐
│ CALCULATION WORKSPACE              Current Role: Supply Mgr │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ✅ Technical Specification (View Only)           │    │
│  │                                                  │    │
│  │ Equipment: K4-750, 400 plates, AISI 316L       │    │
│  │ Operating: 22 bar, 100°C                       │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ✅ Engineering Design (View Only)               │    │
│  │                                                  │    │
│  │ Flanges: Ру10/Ду600, Ру25/Ду450               │    │
│  │ Mounting: 3 panels                             │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ✏️ Supply Costs (Your Section)                  │    │
│  │                                                  │    │
│  │ Labor Rate: [850] ₽/hour          🟩           │    │
│  │ Labor Coefficient: [1.2]          🟩           │    │
│  │ Material Coefficient: [1.15]      🟩           │    │
│  │ Component Cost 1: [25000] ₽       🟩           │    │
│  │ Process Cost 1: [15000] ₽         🟩           │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  [Update & Calculate →]                                   │
└────────────────────────────────────────────────────────────┘
```

## Component Structure (Updated)

```
src/
├── pages/
│   ├── Dashboard.tsx               // Role selector, quick stats
│   ├── CalculationPage.tsx         // Main calculation (all roles)
│   ├── ProjectDetailsPage.tsx      // Non-calculation metadata
│   ├── ResultsPage.tsx             // Calculation results
│   └── SavedCalculationsPage.tsx   // History
│
├── components/
│   ├── Navigation/
│   │   ├── TopNav.tsx              // Simplified navigation
│   │   └── RoleSelector.tsx        // Role dropdown
│   │
│   ├── Calculation/
│   │   ├── TechnicalSection.tsx    // Yellow/Green fields
│   │   ├── EngineeringSection.tsx  // Orange fields
│   │   ├── SupplySection.tsx       // Green cost fields (integrated)
│   │   └── ExecutiveSection.tsx    // Red fields
│   │
│   └── ProjectDetails/
│       ├── ProjectInfoSection.tsx
│       ├── DocumentationSection.tsx
│       └── LogisticsSection.tsx
```

## Routes Configuration

```typescript
const routes = [
  { path: '/', component: Dashboard },
  { path: '/calculation', component: CalculationPage },
  { path: '/project-details', component: ProjectDetailsPage },
  { path: '/results', component: ResultsPage },
  { path: '/saved', component: SavedCalculationsPage },
  { path: '/settings', component: SettingsPage },
  
  // REMOVE these routes:
  // { path: '/supply', ... } ❌
  // { path: '/components', ... } ❌
  // { path: '/flanges', ... } ❌
  // { path: '/materials', ... } ❌
  // { path: '/reference-data', ... } ❌
];
```

## Benefits of Consolidation

### User Experience
- **Single source of truth** - All calculation fields in one place
- **Role context** - See your section and others' progress
- **Fewer clicks** - No navigation between calculation pages
- **Better overview** - See complete calculation state

### Development
- **Simpler routing** - Fewer pages to maintain
- **Unified state** - All calculation data in one store
- **Easier validation** - Cross-field dependencies visible
- **Cleaner architecture** - Clear separation of calculation vs metadata

### Performance
- **Single page load** - All calculation fields loaded once
- **Better caching** - One calculation state to manage
- **Faster calculations** - No page transitions during workflow

## Migration Path

1. **Keep existing functionality** - Don't delete yet
2. **Build new CalculationPage** - With all role sections
3. **Add role selector** - In navigation
4. **Test role switching** - Ensure permissions work
5. **Redirect old routes** - `/supply` → `/calculation`
6. **Remove old pages** - After validation

## State Management (Simplified)

```typescript
interface AppState {
  // Single calculation state
  calculation: {
    // All fields in one place, organized by role
    technical: TechnicalFields;      // Yellow/Green
    engineering: EngineeringFields;   // Orange
    supply: SupplyFields;            // Green (costs)
    executive: ExecutiveFields;      // Red
    results?: CalculationResults;
  };
  
  // Project metadata (separate page)
  project: ProjectMetadata;
  
  // UI state
  ui: {
    currentRole: UserRole;
    currentPage: 'dashboard' | 'calculation' | 'project' | 'results';
  };
}
```

## Summary

The new UX **eliminates the standalone Supply page** by integrating all calculation-related supply fields into the main calculation workflow. Supply managers will:

1. Select "Supply Manager" role from dropdown
2. Navigate to single Calculation page
3. See technical/engineering sections as read-only
4. Edit their supply/cost fields directly
5. Calculate results immediately

This creates a more cohesive, efficient workflow where all calculation fields live in one place, organized by role-based sections.