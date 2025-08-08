# Questions Requiring Clarification

## 🔴 Critical - Blocking Implementation

### 1. E19 Calculation Logic
**Context:** Formula M21 references `2*E19` but E19 is empty in test data
```excel
M21: =(технолог!T27+технолог!U27)*0.001*технолог!I27+2*E19+2*технолог!V27*0.001
```
**Question:** What should E19 calculate? Is it:
- A material property calculation?
- A sum from another range?
- A constant that should be entered?

### 2. Component Dimension Columns (H-AK)
**Context:** We need columns H through AK (29 columns) from the VLOOKUP table for component calculations
**Current:** We only see columns B-G in analysis
**Question:** Can you provide the complete VLOOKUP table values for К4-750 row (columns H-AK)?

### 3. Yellow Cell Values
**Context:** Yellow cells appear to be dropdowns but show text values
- E27: "Е-113" (Объем готового раствора)
- F27: "Целый ТА" (Тип аппарата)
- H27: "1/6" (Соотношение)
**Question:** 
- What are the complete dropdown options for these fields?
- How do these values affect calculations?

## 🟡 Important - Affects Accuracy

### 4. Precision Requirements
**Context:** Excel shows 1820.5952 kg (4 decimal places)
**Question:** Should the application:
- Match Excel precision exactly (4 decimals)?
- Round to 2 decimals for display?
- Use different precision for different fields?

### 5. Test Pressure Calculation
**Context:** Previous analysis showed `CEILING.PRECISE(pressure*1.25, 1)`
**Question:** 
- When is this calculation applied?
- Which fields trigger test pressure calculation?

### 6. Corrugation Type Impact
**Context:** S27 = "гофра" (corrugation type)
**Question:** How does corrugation type affect:
- Material calculations?
- Component dimensions?
- Cost calculations?

## 🟢 Nice to Have - UI/UX Clarity

### 7. Field Labels and Descriptions
**Question:** For better user experience, please confirm Russian labels:
- Should D27 "Плотность готового раствора" have units (kg/m³)?
- Should percentages (L27, M27) show as 100 or 1.0?
- Any tooltips or help text needed?

### 8. Validation Rules
**Context:** Need to validate user inputs
**Question:** What are the valid ranges for:
- Plate length (T27): min/max values?
- Equipment count (I27): typical range?
- Mounting panels (V27): maximum allowed?

### 9. Default Values
**Context:** Setting appropriate defaults
**Question:** Should these defaults be:
- T27 (plate length): 5?
- U27 (plate thickness): 1?
- V27 (mounting panels): 3?
- I27 (equipment count): 400?

## 📊 Data Verification

### 10. Screenshot vs Excel Discrepancy
**Context:** Screenshot shows different layout than Excel file
**Question:** Which is the authoritative source:
- The Excel file structure?
- The screenshot visual layout?

### 11. Material List Completeness
**Current Materials:**
- AISI 316L, SMO 254, Hastelloy C-276, Титан ВТ1-0
- AISI 304, AISI 316Ti, 904L

**Question:** Are there other materials that should be included?

### 12. Equipment Type Names
**Context:** Using К4-XXX naming convention
**Question:** 
- Is "К4" a product line identifier?
- Should we display full names or codes?
- Any equipment types besides the 12 listed?

## 🔄 Workflow Questions

### 13. Save/Load Functionality
**Question:** When users save calculations:
- Which fields should be saved?
- Should formulas recalculate on load?
- Version compatibility needed?

### 14. Bitrix24 Integration
**Question:** For Bitrix24 integration:
- Which fields map to Bitrix24?
- One-way or two-way sync?
- Real-time or batch updates?

### 15. User Roles
**Context:** E8 mentions "только Генеральный директор" (only General Director)
**Question:** 
- Which fields require special permissions?
- How many user roles exist?
- What can each role modify?

---

## Summary of Blockers

**Must Have Answers For:**
1. E19 calculation logic
2. Complete VLOOKUP table (columns H-AK)
3. Dropdown option values

**Should Have Answers For:**
4. Precision/rounding rules
5. Validation ranges
6. Default values

**Nice to Have:**
7. UI labels and tooltips
8. User role permissions

---
*Document prepared: 2025-08-08*
*Total Questions: 15*
*Critical Blockers: 3*