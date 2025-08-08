# 🏗️ LH CALCULATOR - SIMPLE ARCHITECTURE

**Version**: 1.0  
**Date**: 2025-08-07  
**Status**: IMPLEMENTATION READY

---

## 🎯 ARCHITECTURE OVERVIEW

**Current State**: Calculation engine (962 formulas) works perfectly ✅  
**Remaining Work**: 4 simple features for complete solution

```
Frontend-Only Architecture
├── React App (existing) ✅
├── localStorage (save/load) ⬜
├── ExcelJS (Excel export) ⬜
└── Bitrix24 REST API (CRM export) ⬜
```

**No Backend Required** - Client values simplicity above all

---

## 🛠️ TECHNOLOGY STACK

### Current (Working)

- **Frontend**: React 19 + TypeScript + Mantine UI
- **State**: Zustand stores
- **Calculations**: Custom engine with 962 formulas
- **Testing**: Vitest + Playwright (100% coverage)
- **I18n**: Russian/English support

### New Dependencies Needed

```json
{
  "exceljs": "^4.4.0", // Excel export
  "file-saver": "^2.0.5" // Download helper
}
```

**Total new dependencies**: 2 (keeping it minimal)

---

## 📁 DATA STORAGE STRATEGY

### localStorage Structure

```typescript
// Key: "lh-calculator-data"
interface StorageData {
  calculations: Record<string, SavedCalculation>;
  projects: Record<string, Project>;
  settings: AppSettings;
  version: "1.0";
}

interface SavedCalculation {
  id: string;
  name: string;
  projectId: string;
  inputs: HeatExchangerInput; // Existing type
  results: CalculationResult; // Existing type
  savedAt: string;
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
}
```

### Storage Limits & Management

- **Capacity**: ~5MB = ~1000 calculations
- **Auto-cleanup**: Remove oldest when approaching limit
- **Error handling**: Graceful degradation if storage fails

---

## 🔧 IMPLEMENTATION PLAN

### Phase 1: Core Storage (3 days)

```
Day 1: localStorage service
├── StorageService class
├── Auto-save on calculation
├── List/search saved calculations
└── Delete functionality

Day 2: Save/Load UI
├── "Save Calculation" button
├── Name input dialog
├── Saved calculations list page
└── Load calculation action

Day 3: Project grouping
├── Simple project selector
├── Filter calculations by project
└── Basic project management
```

### Phase 2: Excel Export (2 days)

```
Day 1: ExcelJS integration
├── Install exceljs + file-saver
├── Create Excel template service
├── Map calculation data to Excel format
└── Generate 3 sheets (Технолог, Снабжение, Результат)

Day 2: Export functionality
├── "Export to Excel" button
├── Progress indicator
├── Error handling
└── Success notification
```

### Phase 3: Bitrix24 Integration (3 days)

```
Day 1: API setup (requires client credentials)
├── Bitrix24 service class
├── Webhook URL configuration
├── Field mapping configuration
└── Connection testing

Day 2: CRM export logic
├── Map calculation to Bitrix24 fields
├── "Send to CRM" button
├── Success/error handling
└── Export history tracking

Day 3: Integration testing
├── Real Bitrix24 testing
├── Field validation
├── Error scenarios
└── User training materials
```

### Phase 4: Polish & Deploy (2 days)

```
Day 1: Final integration
├── Test all features together
├── Fix any integration issues
├── Performance optimization
└── Error handling review

Day 2: Deployment
├── Production build
├── Deploy to server
├── Client training
└── Go-live support
```

**Total: 10 days (2 weeks)**

---

## 📊 NEW COMPONENTS TO BUILD

### 1. StorageService

```typescript
class StorageService {
  private static readonly STORAGE_KEY = "lh-calculator-data";

  saveCalculation(
    name: string,
    inputs: HeatExchangerInput,
    results: CalculationResult,
  ): string;
  loadCalculation(id: string): SavedCalculation | null;
  listCalculations(projectId?: string): SavedCalculation[];
  deleteCalculation(id: string): void;
  createProject(name: string): string;
  // ... other methods
}
```

### 2. ExcelService

```typescript
class ExcelService {
  exportCalculation(calculation: SavedCalculation): void;
  private createTechnologSheet(data: ExportData): void;
  private createSnabzhnieSheet(data: ExportData): void;
  private createResultSheet(data: ExportData): void;
}
```

### 3. Bitrix24Service

```typescript
class Bitrix24Service {
  private webhookUrl: string;

  exportToCRM(calculation: SavedCalculation): Promise<void>;
  private mapCalculationToFields(calc: SavedCalculation): BitrixFields;
  testConnection(): Promise<boolean>;
}
```

### 4. New Pages/Components

- **SavedCalculationsPage**: List and manage saved calculations
- **SaveCalculationModal**: Name and save current calculation
- **ProjectSelector**: Simple project dropdown
- **ExportButtons**: Excel and Bitrix24 export actions

---

## 🔄 BITRIX24 INTEGRATION DETAILS

### Required Client Information

```javascript
// Configuration needed from client
const bitrixConfig = {
  webhookUrl: "https://company.bitrix24.ru/rest/1/TOKEN/",
  entity: "deal", // or "lead"
  fields: {
    TITLE: "UF_CUSTOM_TITLE",
    OPPORTUNITY: "OPPORTUNITY",
    CURRENCY_ID: "CURRENCY_ID",
    UF_EQUIPMENT_TYPE: "UF_CRM_EQUIPMENT_TYPE",
    UF_PLATE_COUNT: "UF_CRM_PLATE_COUNT",
    // ... other mappings
  },
};
```

### API Implementation

```typescript
async exportToBitrix24(calculation: SavedCalculation) {
  const data = {
    fields: {
      TITLE: `Расчет: ${calculation.name}`,
      OPPORTUNITY: calculation.results.totalCost,
      CURRENCY_ID: "RUB",
      UF_EQUIPMENT_TYPE: calculation.inputs.equipmentType,
      UF_PLATE_COUNT: calculation.inputs.plateCount,
      UF_PRESSURE_A: calculation.inputs.pressureA,
      UF_PRESSURE_B: calculation.inputs.pressureB,
      UF_MATERIAL: calculation.inputs.materialPlate,
      // Map all relevant fields
    }
  };

  const response = await fetch(`${webhookUrl}crm.deal.add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error(`Bitrix24 error: ${response.status}`);

  return response.json();
}
```

---

## 🎨 UI INTEGRATION POINTS

### Dashboard Enhancements

```typescript
// Add to existing Dashboard
<Group gap="sm">
  <Button
    leftSection={<IconDeviceFloppy />}
    onClick={() => openSaveModal()}
  >
    Save Calculation
  </Button>

  <Button
    leftSection={<IconFileExport />}
    onClick={() => exportToExcel()}
    disabled={!result}
  >
    Export Excel
  </Button>

  <Button
    leftSection={<IconSend />}
    onClick={() => exportToBitrix24()}
    disabled={!result}
    color="orange"
  >
    Send to CRM
  </Button>
</Group>
```

### New Navigation Items

```typescript
// Add to AppRouter
<Route path="/saved" element={<SavedCalculationsPage />} />
<Route path="/projects" element={<ProjectsPage />} />
```

---

## 🔒 ERROR HANDLING STRATEGY

### localStorage Failures

```typescript
try {
  StorageService.saveCalculation(name, inputs, results);
  notifications.show({ message: "Saved successfully" });
} catch (error) {
  if (error.name === "QuotaExceededError") {
    // Show cleanup options
    openCleanupModal();
  } else {
    notifications.show({ message: "Save failed", color: "red" });
  }
}
```

### Bitrix24 Failures

- Network timeout: Retry once
- Invalid credentials: Show setup guide
- Field errors: Log details, show generic error
- Success: Show CRM link if available

### Excel Export Failures

- Memory issues: Reduce data scope
- Browser compatibility: Fallback message
- File system errors: Alternative download method

---

## ⚡ PERFORMANCE CONSIDERATIONS

### localStorage Optimization

- Lazy load calculation list
- Paginate large lists (50 per page)
- Compress old data if needed
- Index by project for fast filtering

### Excel Generation

- Stream large files
- Show progress for >100 calculations
- Limit concurrent exports (1 at a time)

### Memory Management

- Clear calculation cache after export
- Limit stored calculations in memory
- Use React.memo for list items

---

## 🧪 TESTING STRATEGY

### Unit Tests

```bash
# New test files needed
src/services/StorageService.test.ts
src/services/ExcelService.test.ts
src/services/Bitrix24Service.test.ts
src/components/SaveCalculationModal.test.ts
```

### Integration Tests

```bash
# E2E scenarios
e2e/save-load-flow.spec.ts
e2e/excel-export.spec.ts
e2e/bitrix24-integration.spec.ts (mock)
```

### Manual Testing Checklist

- [ ] Save calculation with custom name
- [ ] Load saved calculation
- [ ] Delete calculation
- [ ] Export to Excel (verify 3 sheets)
- [ ] Group by project
- [ ] Bitrix24 export (with client credentials)
- [ ] localStorage quota handling
- [ ] Offline behavior

---

## 🚀 DEPLOYMENT PLAN

### Development Environment

1. **Local Development**: http://localhost:5173
2. **Testing**: Current server (34.88.248.65:10000)
3. **Production**: Same server (client preference)

### Build Process

```bash
npm run build          # Create production build
npm run test:once      # Verify all tests pass
npm run test:e2e       # E2E validation
# Deploy dist/ to server
```

### Client Setup Requirements

1. **Bitrix24 Configuration**:
   - Create webhook URL
   - Configure custom fields
   - Provide field mappings
   - Test credentials

2. **Training Session** (1 hour):
   - Save/load workflow
   - Excel export process
   - CRM integration demo
   - Error troubleshooting

---

## 📈 SUCCESS METRICS

### Functional Validation

- [ ] User can save/load calculations
- [ ] Excel export matches original format
- [ ] Bitrix24 integration works end-to-end
- [ ] No data loss on browser refresh
- [ ] Projects grouping functions correctly

### Performance Targets

- Save/load: < 50ms
- Excel export: < 2s for single calculation
- Bitrix24 export: < 5s
- Page load: < 1s

### Business Success

- Replaces Excel workflow completely
- Integrates with existing CRM process
- Reduces quote preparation time by >50%
- Zero training required for calculation part

---

## 🔮 FUTURE CONSIDERATIONS

### Potential Enhancements (NOT in scope)

- Bulk operations
- Export templates
- Advanced search
- Data sync between devices
- User accounts

### Maintenance Plan

- Monthly localStorage cleanup reminder
- Quarterly Bitrix24 API updates check
- Annual Excel format validation

**Remember**: This is a calculator for a small business, not a platform for thousands of users. Keep it simple!

---

## 📋 IMPLEMENTATION CHECKLIST

### Week 1: Core Features

- [ ] StorageService implementation
- [ ] Save/Load UI components
- [ ] Project grouping
- [ ] ExcelJS integration
- [ ] Excel export functionality

### Week 2: Integration & Polish

- [ ] Bitrix24 service (pending client credentials)
- [ ] CRM export UI
- [ ] Error handling
- [ ] Integration testing
- [ ] Client training
- [ ] Go-live support

**Total effort: 2 weeks (80 hours)**  
**Dependencies: Bitrix24 credentials from client**

---

_Architecture focuses on simplicity, speed of implementation, and meeting actual business requirements. No over-engineering._
