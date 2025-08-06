# Sprint 1 - Revised Plan

## 🎯 Sprint Goal
Build MVP with core calculation engine supporting all 13 equipment variants

## 📊 Key Discovery
The 962 formulas are actually:
- **13 equipment models** (К4-150 to К4-1200*600)
- **~53 calculations per model**
- **Not 962 unique formulas!**

## 📝 Updated User Stories

### Story 1: Equipment Configuration System (8 pts) ✅ IN PROGRESS
**As a** user  
**I want to** select from 13 predefined equipment models  
**So that** calculations are performed for my specific heat exchanger type

**Acceptance Criteria:**
- [x] Define data structure for 13 equipment variants
- [x] Create equipment specs constant with dimensions for each model
- [ ] Implement equipment-specific calculation parameters
- [ ] Add validation for plate count limits per model

**Technical Notes:**
- Equipment models: К4-150, К4-200, К4-300, К4-400, К4-500, К4-500*250, К4-600, К4-600*300, К4-750, К4-1000*500, К4-1000, К4-1200, К4-1200*600
- Each model has specific width, height, max plates

---

### Story 2: Parameterized Calculation Functions (13 pts) 🔄 NEEDS REFACTOR
**As a** developer  
**I want to** implement ~30 core calculation functions that work for any equipment type  
**So that** we don't duplicate code for 13 variants

**Acceptance Criteria:**
- [ ] Extract the 53 calculation types from Excel patterns
- [ ] Create reusable functions with equipment type as parameter
- [ ] Implement dimension calculations (cover, column, panels)
- [ ] Implement material requirement calculations
- [ ] Implement cost calculations

**Key Calculations to Implement:**
1. Cover dimensions: `(width+15) * (height+15) * density`
2. Column height: `baseHeight + plateCount * factor`
3. Panel calculations: `width * 0.95` (both A and B)
4. Material mass: `volume * density[material]`
5. Component costs: Based on dimensions and material prices
6. Pressure test: `CEILING(1.25 * pressure * factor / interpolated_value, 0.01)`

---

### Story 3: Excel Formula Translator (8 pts) 🆕 NEW
**As a** developer  
**I want to** create a formula translation layer  
**So that** Excel formulas can be converted to JavaScript functions

**Acceptance Criteria:**
- [ ] Implement VLOOKUP equivalent for lookups
- [ ] Implement CEILING.PRECISE equivalent
- [ ] Implement INDEX/MATCH pattern
- [ ] Create interpolation functions
- [ ] Handle Russian function names (СУММ, ВПР)

---

### Story 4: Dynamic Calculation Engine (5 pts) ✅ PARTIALLY DONE
**As a** system  
**I want to** calculate results based on selected equipment type  
**So that** each variant produces accurate results

**Acceptance Criteria:**
- [x] Basic engine structure created
- [ ] Load equipment-specific parameters dynamically
- [ ] Execute calculations in correct sequence
- [ ] Handle dependencies between calculations
- [ ] Cache intermediate results

---

### Story 5: Equipment Selection UI (3 pts) ✅ DONE
**As a** user  
**I want to** easily select equipment type and input parameters  
**So that** I can calculate costs for my specific configuration

**Acceptance Criteria:**
- [x] Dropdown with 13 equipment types
- [x] Dynamic max plate count based on equipment
- [x] Material selection dropdowns
- [x] Pressure/temperature inputs
- [x] Real-time validation

---

### Story 6: Results Comparison View (5 pts) 🆕 NEW
**As a** user  
**I want to** see how calculations match Excel results  
**So that** I can verify accuracy

**Acceptance Criteria:**
- [ ] Display calculated vs expected values
- [ ] Show calculation breakdown
- [ ] Highlight discrepancies
- [ ] Export comparison report

---

## 📊 Sprint Metrics
- **Total Points**: 41 (increased from 26)
- **Completed**: ~40%
- **New Stories**: 2 (Formula Translator, Comparison View)
- **Refactor Needed**: Calculation Engine

## 🚨 Key Changes from Original Plan

### What We Thought:
- 962 unique formulas to implement
- Complex formula parser needed
- Each formula is different

### What It Actually Is:
- 13 equipment variants
- ~30 unique calculation types
- 53 calculations repeated per variant
- Parameterized functions can handle all variants

### Impact on Development:
- ✅ **Simpler**: Don't need 962 separate implementations
- ✅ **Faster**: Reusable functions for all variants  
- ⚠️ **Different**: Need equipment configuration system
- ⚠️ **Testing**: Must validate all 13 variants

## 🎯 Next Steps

1. **Immediate** (Today):
   - Refactor CalculationEngine to use equipment configurations
   - Create complete equipment specs data structure
   - Map Excel row numbers to equipment types

2. **Tomorrow**:
   - Implement the 53 core calculations as parameterized functions
   - Create formula translation utilities
   - Test with К4-750 variant (most common)

3. **Day 3-4**:
   - Validate all 13 equipment variants
   - Implement comparison view
   - Fine-tune calculations to match Excel exactly

## 📝 Definition of Done
- [ ] All 13 equipment types calculate correctly
- [ ] Core calculations match Excel within 0.01%
- [ ] Results display matches Excel structure
- [ ] Can switch between equipment types seamlessly
- [ ] Pressure test calculations are accurate
- [ ] Material requirements calculated correctly

## 🔍 Discovered Patterns

### Excel Structure (rows 110-122):
```
Row 110: К4-150    - 53 formulas
Row 111: К4-200    - 53 formulas
Row 112: К4-300    - 53 formulas
Row 113: К4-400    - 53 formulas
Row 114: К4-500    - 53 formulas
Row 115: К4-500*250- 53 formulas
Row 116: К4-600    - 53 formulas
Row 117: К4-600*300- 53 formulas
Row 118: К4-750    - 53 formulas
Row 119: К4-1000*500-53 formulas
Row 120: К4-1000   - 51 formulas
Row 121: К4-1200   - 53 formulas
Row 122: К4-1200*600-52 formulas
```

### Column Patterns (53 calculations):
- Columns G-H: Base calculations
- Columns J-O: Dimension calculations
- Columns P-AK: Component calculations
- Columns AL-BD: Cost calculations
- Columns BE-BI: Summary calculations

This is actually a more manageable problem than we initially thought!