# 🎯 SPRINT 2 (SIMPLIFIED) - ESSENTIAL DATA FEATURES

**Principle**: SIMPLICITY ABOVE ALL  
**Duration**: 5 days (not 10)  
**Philosophy**: Do the simplest thing that works

## ❌ REJECTED COMPLEXITY

### What We're NOT Doing

- ❌ PostgreSQL database (overkill)
- ❌ Prisma ORM (unnecessary abstraction)
- ❌ tRPC API layer (not needed)
- ❌ Complex sync mechanisms (single user)
- ❌ Database migrations (maintenance burden)
- ❌ Multi-user support (not requested)

## ✅ SIMPLIFIED ARCHITECTURE

### Technology Stack (No Changes!)

```
EXISTING:
- React 18
- TypeScript
- Vite
- Zustand
- Mantine UI

NEW (Only 1 addition):
- ExcelJS (for export requirement)
```

### Data Flow (Dead Simple)

```
User Input → Zustand Store → localStorage → Excel Export
```

## 📋 SIMPLIFIED USER STORIES

### Story 1: Save & Auto-Save (Day 1)

**As a** user  
**I want** my calculations saved automatically  
**So that** I don't lose work

**Implementation (50 lines of code)**:

```typescript
// In calculationStore.ts
interface SavedCalculation {
  id: string;
  name: string;
  inputs: HeatExchangerInput;
  results: CalculationResult;
  savedAt: string;
  projectId?: string;
}

// Add to store
savedCalculations: SavedCalculation[];
autoSave: () => {
  const current = get();
  if (current.result) {
    const saved: SavedCalculation = {
      id: current.id || Date.now().toString(),
      name: current.name || `Calculation ${new Date().toLocaleString()}`,
      inputs: current.inputs,
      results: current.result,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`calc_${saved.id}`, JSON.stringify(saved));
  }
}
```

### Story 2: Load Previous Calculations (Day 1)

**As a** user  
**I want** to see and load previous calculations  
**So that** I can continue or review work

**Implementation (30 lines of code)**:

```typescript
// Simple list component
const SavedCalculationsList = () => {
  const calculations = Object.keys(localStorage)
    .filter(key => key.startsWith('calc_'))
    .map(key => JSON.parse(localStorage.getItem(key)!))
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));

  return (
    <Table>
      {calculations.map(calc => (
        <tr key={calc.id}>
          <td>{calc.name}</td>
          <td>{new Date(calc.savedAt).toLocaleDateString()}</td>
          <td>{calc.results.totalCost}</td>
          <td>
            <Button onClick={() => loadCalculation(calc)}>Load</Button>
            <Button onClick={() => deleteCalculation(calc.id)}>Delete</Button>
          </td>
        </tr>
      ))}
    </Table>
  );
};
```

### Story 3: Excel Export (Day 2)

**As a** user  
**I want** to export to Excel  
**So that** I can share with stakeholders

**Implementation (100 lines of code)**:

```typescript
import ExcelJS from "exceljs";

export const exportToExcel = async (calc: SavedCalculation) => {
  const workbook = new ExcelJS.Workbook();

  // Sheet 1: Inputs
  const inputSheet = workbook.addWorksheet("Технолог");
  inputSheet.addRow(["Типоразмер", calc.inputs.equipmentType]);
  inputSheet.addRow(["Количество пластин", calc.inputs.plateCount]);
  inputSheet.addRow(["Давление А", calc.inputs.pressureA]);
  inputSheet.addRow(["Давление Б", calc.inputs.pressureB]);
  // ... more rows

  // Sheet 2: Results
  const resultSheet = workbook.addWorksheet("Результат");
  resultSheet.addRow(["Общая стоимость", calc.results.totalCost]);
  // ... more rows

  // Download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${calc.name}.xlsx`;
  link.click();
};
```

### Story 4: Simple Projects (Day 3)

**As a** user  
**I want** to group calculations by project  
**So that** I can organize my work

**Implementation (40 lines of code)**:

```typescript
interface Project {
  id: string;
  name: string;
  client?: string;
  created: string;
}

// In localStorage
const projects: Project[] = JSON.parse(
  localStorage.getItem('projects') || '[]'
);

// Add project selector to form
<Select
  label="Project"
  data={projects.map(p => ({ value: p.id, label: p.name }))}
  value={currentProjectId}
  onChange={setCurrentProjectId}
/>

// Filter calculations by project
const projectCalculations = calculations.filter(
  c => c.projectId === currentProjectId
);
```

### Story 5: Simple History (Day 3)

**As a** user  
**I want** to see previous versions  
**So that** I can track changes

**Implementation (Keep last 5 versions)**:

```typescript
interface CalculationWithHistory extends SavedCalculation {
  history: SavedCalculation[];
}

const saveWithHistory = (calc: SavedCalculation) => {
  const existing = localStorage.getItem(`calc_${calc.id}`);
  if (existing) {
    const prev = JSON.parse(existing);
    if (!prev.history) prev.history = [];
    prev.history.unshift({ ...prev, history: undefined });
    prev.history = prev.history.slice(0, 5); // Keep last 5
    calc.history = prev.history;
  }
  localStorage.setItem(`calc_${calc.id}`, JSON.stringify(calc));
};
```

## 🚀 IMPLEMENTATION PLAN

### Day 1: Core Persistence

**Morning (4 hours)**:

- Add save/load to calculationStore
- Implement auto-save on changes
- Add saved calculations list page

**Afternoon (4 hours)**:

- Create delete/rename functions
- Add load calculation feature
- Test data persistence

### Day 2: Excel Export

**Morning (4 hours)**:

- Install ExcelJS
- Create basic export function
- Map all fields to Excel

**Afternoon (4 hours)**:

- Format Excel sheets properly
- Add formulas where needed
- Test export functionality

### Day 3: Organization

**Morning (4 hours)**:

- Add project management
- Create project selector
- Filter by project

**Afternoon (4 hours)**:

- Add simple history tracking
- Create history viewer
- Version restore feature

### Day 4: Polish & Testing

**Morning (4 hours)**:

- UI improvements
- Search/filter functionality
- Bulk operations

**Afternoon (4 hours)**:

- E2E test updates
- Bug fixes
- Documentation

### Day 5: Buffer & Delivery

- Final testing
- Performance optimization
- Deployment
- User documentation

## 💰 COST-BENEFIT ANALYSIS

### Complex Approach (Original)

- **Time**: 10 days
- **Technologies**: 11+
- **Lines of Code**: ~3000
- **Maintenance**: High
- **Risk**: High

### Simple Approach (Recommended)

- **Time**: 5 days
- **Technologies**: 6 (only +1)
- **Lines of Code**: ~500
- **Maintenance**: Low
- **Risk**: Low

### Business Value Delivered

| Feature      | Complex | Simple | User Cares? |
| ------------ | ------- | ------ | ----------- |
| Save/Load    | ✅      | ✅     | YES         |
| Excel Export | ✅      | ✅     | YES         |
| Projects     | ✅      | ✅     | YES         |
| History      | ✅      | ✅     | MAYBE       |
| Database     | ✅      | ❌     | NO          |
| API Layer    | ✅      | ❌     | NO          |
| Sync         | ✅      | ❌     | NO          |
| Multi-user   | ✅      | ❌     | NO          |

**Result**: 100% of what users care about, 50% of the time

## 🎯 SUCCESS CRITERIA

Sprint 2 is successful if:

1. ✅ Users can save calculations (localStorage)
2. ✅ Users can load previous calculations
3. ✅ Users can export to Excel
4. ✅ Users can organize by projects
5. ✅ No new dependencies except ExcelJS

## ⚠️ WHEN TO ADD COMPLEXITY

Only consider complex architecture when:

1. Multiple users need concurrent access
2. Data exceeds 10MB
3. Server-side processing is required
4. Integration with other systems needed
5. Regulatory compliance requires audit logs

**Current Status**: NONE of these apply

## 📝 MIGRATION PATH (If Needed Later)

If complexity is needed in future:

```javascript
// Step 1: Export all localStorage data
const exportAll = () => {
  const allData = Object.keys(localStorage)
    .filter(k => k.startsWith('calc_'))
    .map(k => JSON.parse(localStorage.getItem(k)!));
  return JSON.stringify(allData);
};

// Step 2: Import to database (future)
// Only when actually needed!
```

## 🔑 KEY DECISIONS

1. **localStorage over Database**
   - Why: No server needed, instant, works offline
   - Risk: 5-10MB limit (thousands of calculations)
   - Mitigation: Auto-cleanup old calculations

2. **No API Layer**
   - Why: Single page app, no server needed
   - Risk: Can't share between devices
   - Mitigation: Export/import JSON files

3. **ExcelJS only new dependency**
   - Why: Required for business need
   - Alternative considered: CSV (not good enough)
   - Decision: ExcelJS is justified

## 📊 METRICS TO TRACK

- Save/Load speed: < 100ms
- Excel export time: < 2 seconds
- localStorage usage: < 5MB
- User satisfaction: Can they do their job?

## ✅ FINAL RECOMMENDATION

**APPROVE** this simplified Sprint 2 plan.

**Benefits**:

- 50% time reduction
- 90% complexity reduction
- 100% feature delivery
- Zero infrastructure
- Trivial maintenance

**The user wants a CALCULATOR that SAVES and EXPORTS.**  
**We're delivering exactly that, nothing more, nothing less.**

---

_"Perfection is achieved not when there is nothing more to add,  
but when there is nothing left to take away."_ - Antoine de Saint-Exupéry
