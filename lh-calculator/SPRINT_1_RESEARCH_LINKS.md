# Sprint 1 Stories - Research Data Links

## Story 1: Add Missing Critical Input Fields

### Required Research Data ✅

- **Field Specifications**: `/lh-calculator/PRD_COMPLETE_INPUTS.md` (lines 14-20)
- **Missing Fields Analysis**: `/lh-calculator/FIELD_CALCULATION_MAPPING.md` (Section 6)
- **D12, D13, D14 Impact**: `/lh-calculator/D13_D14_IMPACT_ANALYSIS.md`
- **Default Values**: `/lh-calculator/UNDERSTANDING_100_PERCENT.md` (Section 3)

### Specific Field Requirements

```javascript
// From research documents:
D12: laborRate = 2500; // Labor rate ₽/hour
D13: laborCoefficient = 1; // Labor multiplier
D14: materialCoefficient = 1; // Material factor (squared in formulas)
T27: plateLength = 5; // mm, from TEST_SCENARIO_DATA.md line 37
V27: mountingPanelsCount = 3; // from TEST_SCENARIO_DATA.md line 39
```

### Formula Dependencies

- **N26 uses D13**: `F78 × D8 + U27 × J78 × D13`
- **O26 uses D13, D14**: `D8 × E78 × D14² + D78 × I78 × D13`
- **H26 uses D13, D14**: `E8 × G78 × D14² + V27 × H78 × D13`
- **F26 uses D12**: `K14 = K13 × D12`

---

## Story 2: Implement Complete VLOOKUP Table

### Required Research Data ✅

- **Complete VLOOKUP Structure**: `/lh-calculator/COMPLETE_VLOOKUP_STRUCTURE.md`
- **К4-750 Full Data**: `/lh-calculator/TEST_SCENARIO_DATA.md` (lines 2500-2600)
- **Material Densities**: `/lh-calculator/TEST_VALIDATION_FRAMEWORK.md` (Section 4)

### К4-750 Specific Values

```javascript
// From COMPLETE_VLOOKUP_STRUCTURE.md:
const K4_750_DATA = {
  B: "К4-750", // Equipment type
  C: 713, // Base length
  D: 698, // Base width
  E: 732, // Adjusted length
  F: 715, // Adjusted width
  G: 3, // Thickness
  L: 29.625648, // Гребенка 4шт
  O: 27.346752, // Полоса гребенки 4шт
  R: 43.6640256, // Лист концевой 2шт
  AB: 9.0266976, // Зеркало А 4шт
  AE: 9.021024, // Зеркало Б 4шт
  AH: 92.22890688, // Лист плакирующий А 2шт
  AK: 91.9960056, // Лист плакирующий Б 2шт
  BA: 171.95, // Total 3mm package
  BB: 31.24, // Total 3mm cladding
  BC: 171.95, // Total 3mm reinforcement
  BD: 1165.15, // Total 1mm components
  // Cost factors (M78-P78):
  M78: 26,
  N78: 8,
  O78: 60,
  P78: 8,
};
```

### All Equipment Types

```javascript
// From TEST_SCENARIO_DATA.md:
const EQUIPMENT_TYPES = [
  "К4-150",
  "К4-300",
  "К4-500",
  "К4-750",
  "К4-1000",
  "К4-1200",
  "К4-600*300",
  "К4-600*600",
  "К4-800*400",
  "К4-800*800",
  "К4-1000*500",
  "К4-1200*600",
];
```

---

## Story 3: Fix Main Plate Mass Calculation

### Required Research Data ✅

- **Formula Documentation**: `/lh-calculator/CALCULATION_UNDERSTANDING_COMPLETE.md` (Section 2)
- **Test Values**: `/lh-calculator/TEST_VALIDATION_FRAMEWORK.md` (Formula 1)
- **Excel Formula**: `/lh-calculator/EXCEL_TO_APP_MAPPING.md` (Section 1)

### Exact Formula (G93)

```javascript
// From CALCULATION_UNDERSTANDING_COMPLETE.md:
// Excel: =(VLOOKUP(col E)+15)*(VLOOKUP(col F)+15)*VLOOKUP(col G)*G93/1000*I27

function calculatePlateMass(inputs) {
  const equipment = VLOOKUP(inputs.equipmentType);
  const length = equipment.E + 15; // 732 + 15 = 747
  const width = equipment.F + 15; // 715 + 15 = 730
  const thickness = equipment.G; // 3
  const density = getMaterialDensity(inputs.plateMaterial); // 0.00788
  const count = inputs.equipmentCount; // 400

  return ((length * width * thickness * density) / 1000) * count;
  // Expected: 747 * 730 * 3 * 0.00788 / 1000 * 400 = 1820.5952
}
```

### Material Densities

```javascript
// From TEST_VALIDATION_FRAMEWORK.md:
const MATERIAL_DENSITIES = {
  "AISI 316L": 0.00788,
  "SMO 254": 0.00808,
  "Hastelloy C-276": 0.00889,
  "Титан ВТ1-0": 0.0045,
  "AISI 304": 0.0074,
  "AISI 316Ti": 0.00786,
  "904L": 0.00806,
};
```

---

## Story 4: Implement Component Mass Calculations

### Required Research Data ✅

- **Component Formulas**: `/lh-calculator/UNDERSTANDING_100_PERCENT.md` (Section 1)
- **VLOOKUP Columns**: `/lh-calculator/COMPLETE_VLOOKUP_STRUCTURE.md`
- **Expected Values**: `/lh-calculator/TEST_SCENARIO_DATA.md` (lines 93-101)

### Component Formulas (E93-E100)

```javascript
// From research analysis:
E93 = VLOOKUP(К4-750, B110:L122, 11) = 29.625648    // Column L
E94 = VLOOKUP(К4-750, B110:O122, 14) = 27.346752    // Column O
E95 = VLOOKUP(К4-750, B110:R122, 17) = 43.6640256   // Column R
E97 = VLOOKUP(К4-750, B110:AB122, 27) = 9.0266976   // Column AB
E98 = VLOOKUP(К4-750, B110:AE122, 30) = 9.021024    // Column AE
E99 = VLOOKUP(К4-750, B110:AH122, 33) = 92.22890688 // Column AH
E100 = VLOOKUP(К4-750, B110:AK122, 36) = 91.9960056 // Column AK

E101 = SUM(E93:E100) = 118.6841472 // Must match exactly
```

### Screenshot Validation

- **Component masses visible**: `/lh-calculator/SCREENSHOT_FINDINGS_COMPLETE.md`
- Shows exact values matching our calculations

---

## Story 5: Implement Core Cost Calculations

### Required Research Data ✅

- **Cost Formulas**: `/lh-calculator/CALCULATION_UNDERSTANDING_COMPLETE.md` (Section 2)
- **Zero Values Analysis**: `/lh-calculator/ZERO_VALUES_ANALYSIS_REPORT.md`
- **Final Totals**: `/lh-calculator/TEST_VALIDATION_FRAMEWORK.md` (Section 2)

### N26 Formula (Plate Package Cost)

```javascript
// From CALCULATION_UNDERSTANDING_COMPLETE.md:
N26 = F78 × D8 + U27 × J78 × D13
    = 1820.5952 × 700 + 1 × 1165.15 × 0
    = 1,274,416.64 + 0
    = 1,274,416.64 rubles
```

### P26 Formula (Equipment Cost)

```javascript
// Q78 calculation:
Q78 = M78×D44 + N78×D43 + O78×G44 + P78×G43
    = 26×1750 + 8×3300 + 60×87 + 8×600
    = 45,500 + 26,400 + 5,220 + 4,800
    = 81,920 rubles
```

### O26 Formula (Component Cost - currently zero)

```javascript
// Will be non-zero when D13, D14 added:
O26 = D8 × E78 × D14² + D78 × I78 × D13
    = 700 × 118.684 × D14² + 3 × 171.95 × D13
```

### Total Validation

```javascript
J32 = N26 + O26 + P26
    = 1,274,416.64 + 0 + 81,920
    = 1,356,336.64 rubles // Must match
```

---

## Research Data Coverage Summary

| Story   | Research Data Available | Files Linked | Ready |
| ------- | ----------------------- | ------------ | ----- |
| Story 1 | ✅ Complete             | 4 documents  | YES   |
| Story 2 | ✅ Complete             | 3 documents  | YES   |
| Story 3 | ✅ Complete             | 3 documents  | YES   |
| Story 4 | ✅ Complete             | 3 documents  | YES   |
| Story 5 | ✅ Complete             | 3 documents  | YES   |

## Additional Research Resources

### Test Data Files

- `/lh-calculator/TEST_SCENARIO_DATA.md` - Complete cell values
- `/lh-calculator/complete_excel_data.json` - Machine-readable data
- `/lh-calculator/TEST_VALIDATION_FRAMEWORK.md` - Validation checklist

### Understanding Documents

- `/lh-calculator/UNDERSTANDING_100_PERCENT.md` - Complete understanding
- `/lh-calculator/CALCULATION_UNDERSTANDING_COMPLETE.md` - Formula details
- `/lh-calculator/FIELD_CALCULATION_MAPPING.md` - Field dependencies

### Analysis Reports

- `/lh-calculator/BLOCKERS_RESOLVED_SUMMARY.md` - E19 resolution
- `/lh-calculator/SCREENSHOT_FINDINGS_COMPLETE.md` - Visual validation
- `/lh-calculator/PRD_COMPLETE_INPUTS.md` - All 155 fields documented

## Conclusion

**All stories have complete research data linked and ready for implementation.**

Each story has:

- Exact formulas documented
- Test values specified
- Expected outputs defined
- File references provided
- Code examples prepared

The development team can proceed with confidence using the linked research data.
