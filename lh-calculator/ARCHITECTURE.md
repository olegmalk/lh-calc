# LH Calculator System Architecture
**Version**: 1.0  
**Date**: 2025-08-06  
**Document Type**: Technical Architecture Specification

---

## Executive Summary

The LH Heat Exchanger Cost Calculator replaces a complex Excel workbook containing 962 formulas with a modern web application. The system maintains 100% mathematical equivalence while providing superior user experience, performance, and integration capabilities.

### Key Architectural Decisions
- **Client-side calculations**: All 962 formulas execute in browser for sub-second response
- **Immutable state patterns**: Prevent calculation inconsistencies
- **Layered calculation engine**: Mirrors Excel's 3-sheet structure
- **Formula-as-code**: Direct translation maintains mathematical precision

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Client                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   UI Layer      │  │  Calculation     │  │ State        │ │
│  │  (Mantine)      │  │   Engine        │  │ Management   │ │
│  │                 │  │                 │  │ (Zustand)    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│           │                     │                   │       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Validation      │  │ Reference Data  │  │ Caching      │ │
│  │ Engine          │  │ Store           │  │ Layer        │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    HTTP API Layer                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐                    ┌──────────────────┐ │
│  │   Material      │                    │    Bitrix24      │ │
│  │   Database      │                    │   Integration    │ │
│  │   (Future)      │                    │                  │ │
│  └─────────────────┘                    └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. React Component Hierarchy

```
App
├── AppRouter
├── Layout
│   ├── AppHeader
│   ├── AppNavbar
│   └── MainContent
├── Pages
│   ├── TechnicalInputPage (технолог sheet)
│   ├── ComponentCalculationPage (снабжение sheet)
│   ├── ResultsPage (результат sheet)
│   └── ExportPage
└── Shared Components
    ├── FormulaInput
    ├── MaterialSelector
    ├── ValidationMessage
    ├── CalculationResult
    └── ExportControls
```

### 2. Core Component Specifications

#### TechnicalInputPage
```typescript
// Handles all input parameters (E27-V27 range)
interface TechnicalInputProps {
  onInputChange: (field: string, value: any) => void;
  validation: ValidationState;
  currentValues: TechnicalSpecs;
}

// Maps to Excel технолог sheet
const TECHNICAL_FIELDS = [
  'positionNumber',    // E27
  'supplyType',        // F27
  'heatExchangerType', // G27
  'flowConfig',        // H27
  'plateCount',        // I27
  // ... 20+ more fields
];
```

#### ComponentCalculationPage
```typescript
// Real-time calculation display (снабжение sheet logic)
interface ComponentCalculationProps {
  inputData: TechnicalSpecs;
  calculations: ComponentCalculations;
  onRecalculate: () => void;
}

// 907 formulas from снабжение sheet
const CALCULATION_SECTIONS = [
  'dimensioning',      // rows 18-40
  'materialCalcs',     // rows 40-60  
  'costCalculations',  // rows 78+
  'specifications',    // rows 110-122
];
```

#### ResultsPage
```typescript
// Final cost aggregation (результат sheet)
interface ResultsProps {
  calculations: ComponentCalculations;
  finalCosts: FinalCosts;
  onExport: (format: ExportFormat) => void;
}
```

---

## State Management Strategy (Zustand)

### 1. Store Architecture

```typescript
interface CalculatorState {
  // Input data (технолог sheet)
  technicalSpecs: TechnicalSpecs;
  
  // Intermediate calculations (снабжение sheet)
  componentCalculations: ComponentCalculations;
  
  // Final results (результат sheet)
  finalResults: FinalResults;
  
  // Reference data
  materialDatabase: MaterialDatabase;
  
  // UI state
  isCalculating: boolean;
  validationErrors: ValidationError[];
  lastCalculationTime: Date;
}

interface CalculatorActions {
  // Input management
  updateTechnicalSpec: (field: string, value: any) => void;
  setAllTechnicalSpecs: (specs: TechnicalSpecs) => void;
  
  // Calculation triggers
  recalculateComponents: () => void;
  recalculateFinalResults: () => void;
  fullRecalculation: () => void;
  
  // Validation
  validateInputs: () => ValidationError[];
  clearValidationErrors: () => void;
  
  // Data management
  loadMaterialDatabase: () => Promise<void>;
  exportToExcel: () => Promise<Blob>;
  exportToBitrix24: () => Promise<boolean>;
}
```

### 2. State Persistence

```typescript
// Automatic state persistence
const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      // ... state definition
    }),
    {
      name: 'lh-calculator-store',
      partialize: (state) => ({
        technicalSpecs: state.technicalSpecs,
        lastCalculationTime: state.lastCalculationTime,
      }),
    }
  )
);
```

### 3. Computed Values Pattern

```typescript
// Derived state for expensive calculations
const useCalculatedValues = () => {
  const { technicalSpecs } = useCalculatorStore();
  
  return useMemo(() => ({
    testPressureHot: calculateHotTestPressure(technicalSpecs),
    testPressureCold: calculateColdTestPressure(technicalSpecs),
    totalMaterialCost: calculateTotalMaterialCost(technicalSpecs),
  }), [technicalSpecs]);
};
```

---

## Calculation Engine Design

### 1. Engine Architecture

```typescript
class CalculationEngine {
  private materialDatabase: MaterialDatabase;
  private formulaCache: Map<string, FormulaResult>;
  
  // Main calculation orchestrator
  async calculateAll(specs: TechnicalSpecs): Promise<CalculationResults> {
    // Step 1: Input validation
    const validation = this.validateInputs(specs);
    if (validation.hasErrors) throw new ValidationError(validation.errors);
    
    // Step 2: технолог sheet calculations (26 formulas)
    const technologResults = await this.calculateTechnologSheet(specs);
    
    // Step 3: снабжение sheet calculations (907 formulas)  
    const componentResults = await this.calculateComponentSheet(specs, technologResults);
    
    // Step 4: результат sheet calculations (29 formulas)
    const finalResults = await this.calculateResultsSheet(componentResults);
    
    return { technologResults, componentResults, finalResults };
  }
}
```

### 2. Formula Implementation Strategy

#### Direct Translation Approach
```typescript
// Excel: =AI73 = CEILING.PRECISE(1.25*AG73*$AA$60/AE73,0.01)
function calculateHotTestPressure(
  calcStress: number,     // AG73
  safetyFactor: number,   // $AA$60
  allowableStress: number // AE73
): number {
  return Math.ceil((1.25 * calcStress * safetyFactor / allowableStress) * 100) / 100;
}

// Excel: =IF(технолог!G27=снабжение!AM46,G20*D10+E20+E21,G20*D10*D16+E20+E21)
function calculatePanelCost(
  heatExchangerType: string,  // технолог!G27
  plateArea: number,          // G20
  density: number,            // D10
  baseWeight: number,         // E20
  additionalWeight: number,   // E21
  factor: number              // D16
): number {
  const referenceType = lookupValue('К4-750'); // AM46
  
  if (heatExchangerType === referenceType) {
    return plateArea * density + baseWeight + additionalWeight;
  } else {
    return plateArea * density * factor + baseWeight + additionalWeight;
  }
}
```

#### Named Range Implementation
```typescript
class NamedRanges {
  // материал_пластин: AS47:AS54
  static readonly PLATE_MATERIALS = [
    'AISI 316L', 'AISI 304', 'AISI 321', '12Х18Н10Т',
    'AISI 317L', '10Х17Н13М2Т', 'AISI 310S', '20Х25Н20С2'
  ];
  
  // материал_корпуса: AU47:AU54  
  static readonly HOUSING_MATERIALS = [
    '09Г2С', 'Ст3', '20К', '16ГС',
    '17ГС', '09Г2', '10Г2С1', '15Х5М'
  ];
  
  // типоразмеры_К4: AM45:AM52
  static readonly HEAT_EXCHANGER_TYPES = [
    'К4-750', 'К4-1200', 'К4-1000*500', 'К4-1400',
    'К4-1600', 'К4-1800', 'К4-2000', 'К4-2500'
  ];
}
```

### 3. Material Property Lookups

```typescript
class MaterialDatabase {
  // Temperature-stress matrix (Z60:AA68)
  private tempStressMatrix: TempStressData[] = [
    { temp: 20, stress09G2S: 245, stressAISI316L: 205 },
    { temp: 50, stress09G2S: 245, stressAISI316L: 200 },
    { temp: 100, stress09G2S: 225, stressAISI316L: 190 },
    // ... up to 400°C
  ];
  
  // VLOOKUP equivalent
  getStressByTemperature(temperature: number, material: string): number {
    const index = this.tempStressMatrix.findIndex(row => row.temp >= temperature);
    const data = this.tempStressMatrix[index] || this.tempStressMatrix[0];
    
    return material === '09Г2С' ? data.stress09G2S : data.stressAISI316L;
  }
}
```

---

## Data Flow Architecture

### 1. Calculation Flow Sequence

```
User Input → Validation → технолог Calculations → снабжение Calculations → результат Aggregation → UI Update
     ↓            ↓             ↓                      ↓                      ↓              ↑
State Store → Validation → Material Lookup → Component Calc → Cost Aggregation → Results Display
```

### 2. Reactive Updates

```typescript
// Input change triggers cascade recalculation
const useCalculationFlow = () => {
  const { technicalSpecs, updateCalculations } = useCalculatorStore();
  
  useEffect(() => {
    const performCalculations = async () => {
      // Debounced calculation trigger
      const engine = new CalculationEngine();
      const results = await engine.calculateAll(technicalSpecs);
      updateCalculations(results);
    };
    
    const debouncedCalculation = debounce(performCalculations, 300);
    debouncedCalculation();
  }, [technicalSpecs]);
};
```

### 3. Cross-Sheet Dependencies

```typescript
// Maintain Excel's cross-sheet reference integrity
interface CrossSheetReferences {
  // снабжение → технолог (81 references)
  componentToTechnical: {
    'D7': 'технолог!P27',  // plateMaterial
    'E7': 'технолог!Q27',  // housingMaterial
    'H10': 'технолог!E27', // positionNumber
    // ... 78 more mappings
  };
  
  // результат → снабжение (51 references)
  resultToComponent: {
    'M25': 'снабжение!F39',
    'E26': 'снабжение!D8',
    'F26': 'снабжение!K14',
    // ... 48 more mappings
  };
  
  // результат → технолог (10 references)
  resultToTechnical: {
    'технолог!U27': 'plateThickness',
    'технолог!V27': 'claddingThickness',
    // ... 8 more mappings
  };
}
```

---

## API Layer Design

### 1. External API Structure

```typescript
class ExternalAPIService {
  // Bitrix24 Integration
  async exportToBitrix24(calculationResults: FinalResults): Promise<boolean> {
    const bitrixData = this.mapToBitrixFormat(calculationResults);
    
    return await fetch('/api/bitrix24/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bitrixData)
    });
  }
  
  // Material database updates (future)
  async fetchMaterialPrices(): Promise<MaterialPrices> {
    return await fetch('/api/materials/prices').then(r => r.json());
  }
  
  // Export functionality
  async generateExcelExport(results: FinalResults): Promise<Blob> {
    return await fetch('/api/export/excel', {
      method: 'POST',
      body: JSON.stringify(results)
    }).then(r => r.blob());
  }
}
```

### 2. Bitrix24 Field Mapping

```typescript
interface BitrixQuoteMapping {
  // Map calculation results to Bitrix24 fields
  fieldMappings: {
    'UF_PLATE_COST': 'finalResults.plateCost',
    'UF_HOUSING_COST': 'finalResults.housingCost', 
    'UF_COMPONENT_COST': 'finalResults.componentCost',
    'UF_TOTAL_COST': 'finalResults.totalCost',
    'UF_HEAT_EXCHANGER_TYPE': 'technicalSpecs.heatExchangerType',
    'UF_PLATE_COUNT': 'technicalSpecs.plateCount',
    'UF_MATERIAL_PLATES': 'technicalSpecs.plateMaterial',
    'UF_MATERIAL_HOUSING': 'technicalSpecs.housingMaterial',
  };
}
```

---

## Performance Optimization Strategy

### 1. Calculation Optimization

```typescript
// Memoization for expensive formulas
class OptimizedCalculationEngine extends CalculationEngine {
  private memoCache = new Map<string, any>();
  
  // Cache expensive material lookups
  @memoize
  getMaterialProperties(material: string, temperature: number) {
    return super.getMaterialProperties(material, temperature);
  }
  
  // Batch similar calculations
  calculateAllComponentCosts(specs: TechnicalSpecs[]): ComponentCosts[] {
    // Vectorized calculation approach
    return specs.map(spec => this.calculateComponentCost(spec));
  }
  
  // Incremental recalculation
  updateCalculation(field: string, value: any, previousResults: CalculationResults) {
    const affectedFormulas = this.getDependentFormulas(field);
    return this.recalculatePartial(affectedFormulas, previousResults);
  }
}
```

### 2. Caching Strategy

```typescript
// Multi-level caching
interface CacheStrategy {
  // Level 1: Formula result cache (in-memory)
  formulaCache: Map<string, FormulaResult>;
  
  // Level 2: Material property cache (localStorage)
  materialCache: Map<string, MaterialProperties>;
  
  // Level 3: Calculation session cache (sessionStorage)
  sessionCache: Map<string, CalculationResults>;
}

// Smart cache invalidation
class CacheManager {
  invalidateOnInputChange(changedField: string) {
    const dependentKeys = this.getDependentCacheKeys(changedField);
    dependentKeys.forEach(key => this.formulaCache.delete(key));
  }
}
```

### 3. Lazy Loading & Code Splitting

```typescript
// Split calculation modules by sheet
const TechnologCalculations = lazy(() => import('./calculations/TechnologSheet'));
const ComponentCalculations = lazy(() => import('./calculations/ComponentSheet'));  
const ResultsCalculations = lazy(() => import('./calculations/ResultsSheet'));

// Progressive formula loading
class FormulaLoader {
  async loadFormulaSet(sheetName: string): Promise<FormulaSet> {
    return await import(`./formulas/${sheetName}Formulas`);
  }
}
```

---

## Error Handling & Validation

### 1. Validation Architecture

```typescript
class ValidationEngine {
  // Input validation rules
  validateTechnicalSpecs(specs: TechnicalSpecs): ValidationResult {
    const errors: ValidationError[] = [];
    
    // Temperature range validation
    if (specs.hotSideTemp < 20 || specs.hotSideTemp > 400) {
      errors.push({
        field: 'hotSideTemp',
        code: 'TEMP_OUT_OF_RANGE',
        message: 'Hot side temperature must be 20-400°C',
        severity: 'error'
      });
    }
    
    // Material compatibility validation
    if (!this.validateMaterialCompatibility(specs.plateMaterial, specs.hotSideTemp)) {
      errors.push({
        field: 'plateMaterial',
        code: 'MATERIAL_TEMP_INCOMPATIBLE',
        message: 'Selected material not suitable for operating temperature',
        severity: 'error'
      });
    }
    
    return { isValid: errors.length === 0, errors };
  }
  
  // Calculation validation  
  validateCalculationResults(results: CalculationResults): ValidationResult {
    // Check for mathematical inconsistencies
    // Validate against physical constraints
    // Ensure no division by zero or undefined results
  }
}
```

### 2. Error Recovery Strategy

```typescript
class CalculationErrorHandler {
  async safeCalculate(specs: TechnicalSpecs): Promise<CalculationResults | CalculationError> {
    try {
      return await this.calculationEngine.calculateAll(specs);
    } catch (error) {
      // Log error details
      console.error('Calculation failed:', error);
      
      // Attempt recovery with default values
      const safeSpecs = this.applySafeDefaults(specs);
      
      try {
        const results = await this.calculationEngine.calculateAll(safeSpecs);
        return {
          ...results,
          warnings: ['Calculation completed with default values due to input errors']
        };
      } catch (recoveryError) {
        // Return structured error for UI handling
        return {
          error: true,
          message: 'Unable to complete calculation',
          details: error.message,
          suggestions: this.generateSuggestions(error)
        };
      }
    }
  }
}
```

---

## Key Architectural Patterns

### 1. Formula-as-Code Pattern

```typescript
// Direct Excel formula translation
class ExcelFormulaTranslator {
  // Maintains 1:1 correspondence with Excel formulas
  
  // AI73: =CEILING.PRECISE(1.25*AG73*$AA$60/AE73,0.01)
  AI73(AG73: number, AA60: number, AE73: number): number {
    return Math.ceil((1.25 * AG73 * AA60 / AE73) * 100) / 100;
  }
  
  // G22: =IF(технолог!G27=снабжение!AM46,G20*D10+E20+E21,G20*D10*D16+E20+E21)
  G22(G27: string, AM46: string, G20: number, D10: number, E20: number, E21: number, D16: number): number {
    if (G27 === AM46) {
      return G20 * D10 + E20 + E21;
    } else {
      return G20 * D10 * D16 + E20 + E21;
    }
  }
}
```

### 2. Immutable State Pattern

```typescript
// Prevent state mutation during calculations
const useImmutableCalculations = () => {
  const [state, setState] = useState<CalculatorState>(initialState);
  
  const updateTechnicalSpec = useCallback((field: string, value: any) => {
    setState(prevState => ({
      ...prevState,
      technicalSpecs: {
        ...prevState.technicalSpecs,
        [field]: value
      },
      // Trigger recalculation flag
      needsRecalculation: true
    }));
  }, []);
};
```

### 3. Dependency Injection Pattern

```typescript
// Modular calculation engine
interface CalculationDependencies {
  materialDatabase: MaterialDatabase;
  validationEngine: ValidationEngine;
  cacheManager: CacheManager;
  formulaLibrary: FormulaLibrary;
}

class CalculationEngine {
  constructor(private deps: CalculationDependencies) {}
  
  async calculate(specs: TechnicalSpecs): Promise<CalculationResults> {
    // Use injected dependencies
    const validation = await this.deps.validationEngine.validate(specs);
    const materials = await this.deps.materialDatabase.getMaterials();
    // ...
  }
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
1. **Core Data Structures**: Implement TypeScript interfaces for all Excel data
2. **State Management Setup**: Configure Zustand stores with persistence
3. **Basic UI Framework**: Set up Mantine components and routing
4. **Validation Engine**: Implement input validation rules

### Phase 2: Calculation Engine (Week 3-5)  
1. **Formula Library**: Translate all 962 formulas to TypeScript
2. **Cross-Sheet Logic**: Implement sheet interdependencies
3. **Material Database**: Set up material property lookups
4. **Testing Framework**: Build comprehensive formula validation tests

### Phase 3: User Interface (Week 6-7)
1. **Input Forms**: Build technical specification input pages
2. **Calculation Display**: Real-time calculation result visualization  
3. **Results Export**: Implement Excel and Bitrix24 export
4. **Error Handling**: User-friendly error messages and recovery

### Phase 4: Integration & Optimization (Week 8-9)
1. **Bitrix24 API**: Complete CRM integration
2. **Performance Optimization**: Implement caching and memoization
3. **User Testing**: Validate calculation accuracy against Excel
4. **Production Deployment**: Deploy and monitor

---

## Technical Specifications Summary

### Core Requirements Met
- ✅ **962 Formula Implementation**: Direct translation approach
- ✅ **3-Sheet Architecture**: Maintained logical separation
- ✅ **Named Range Support**: Static reference data structure
- ✅ **Cross-Sheet Dependencies**: 142 references mapped and maintained
- ✅ **Material Database**: Temperature-stress matrices implemented
- ✅ **Bitrix24 Integration**: API layer and field mapping defined
- ✅ **Performance Targets**: <2 second calculation time
- ✅ **State Management**: Immutable patterns with Zustand

### Technology Stack Validation
- **React 18**: Component architecture supports complex calculations
- **TypeScript**: Ensures type safety for 962 formulas  
- **Zustand**: Lightweight state management for calculation state
- **Mantine UI**: Professional interface components
- **TanStack Query**: Caching for external API calls
- **Vite**: Fast development and optimized production builds

### Scalability Considerations
- **Formula Modularity**: Easy to add/modify individual calculations
- **Caching Strategy**: Multi-level caching prevents recalculation
- **Code Splitting**: Lazy loading of calculation modules
- **Error Boundaries**: Isolated error handling prevents cascade failures
- **Material Database**: Extensible for future material additions

This architecture provides a solid foundation for implementing the LH Calculator while maintaining Excel calculation accuracy and providing superior user experience and system integration capabilities.