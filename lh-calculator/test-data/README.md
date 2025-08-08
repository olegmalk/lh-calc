# Test Data Directory

## 📁 Folder Structure

### /excel-screenshots/

Upload Excel screenshots here showing:

- How the actual Excel calculator works
- Different calculation scenarios
- Input/output examples
- Color-coded cells and their meanings

### /excel-scenarios/

Upload Excel files with test data here:

- Excel files with pre-filled test scenarios
- Expected calculation results
- Different equipment configurations
- Edge cases and validation data

## 📋 Naming Convention

### Screenshots:

- `scenario-01-k4-750-input.png` - Input data for scenario
- `scenario-01-k4-750-result.png` - Expected results
- `scenario-01-k4-750-supply.png` - Supply sheet data
- `field-mapping-technolog.png` - Field mapping reference
- `color-legend.png` - Color code explanations

### Excel Files:

- `test-scenario-01-k4-750.xlsx` - Complete test scenario
- `validation-data-k4-150.xlsx` - Validation data
- `edge-cases.xlsx` - Edge case testing

## 🎯 What We Need

### Priority 1 - Basic Scenarios

1. **К4-750 with 400 plates** (standard case)
   - All input fields filled
   - Supply parameters set
   - Expected results shown

2. **К4-150 minimum config** (edge case)
   - Minimum plate count
   - Minimum thickness
   - Expected results

3. **К4-1200 maximum config** (edge case)
   - Maximum plate count
   - Maximum parameters
   - Expected results

### Priority 2 - Field Verification

1. Screenshot showing **ALL colored cells** in технолог sheet
2. Screenshot showing **ALL colored cells** in снабжение sheet
3. Screenshot showing formula bar for key calculations
4. Screenshot showing результат sheet with final values

### Priority 3 - Formula Validation

1. Excel file with formula audit showing:
   - Which cells feed into which calculations
   - Intermediate calculation values
   - Final result derivation

## 📝 Test Scenario Template

For each test scenario, provide:

### Input Data (технолог sheet)

- Cell D27-V27 values
- Screenshot of filled form
- Note any special configurations

### Supply Parameters (снабжение sheet)

- Cell F2, D8-E8, D9, K13, P13 values
- Management overrides if any (G93, G96)
- Screenshot of filled form

### Expected Results (результат sheet)

- Total costs
- Component breakdowns
- Material requirements
- Screenshot of results

### Calculation Trace

- Key intermediate values
- Formula results at each step
- Any validation errors/warnings

## ✅ Checklist for Each Scenario

- [ ] Input screenshot
- [ ] Supply parameters screenshot
- [ ] Results screenshot
- [ ] Excel file with all data
- [ ] Cell-by-cell value list
- [ ] Expected vs actual comparison points
- [ ] Any special notes or edge cases

## 🔍 Focus Areas

1. **Verify ALL input fields** are captured
2. **Document color meanings** for each cell
3. **Trace formula dependencies**
4. **Validate calculation accuracy**
5. **Identify any missing business logic**

---

**Note**: This folder is ready to receive test data. Upload files here and they will be used to create comprehensive test scenarios for validation.
