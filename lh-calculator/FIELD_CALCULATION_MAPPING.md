# Field to Calculation Mapping - How Each Input is Used

## Critical Question: Do we understand how each field affects calculations?
**Answer: PARTIALLY** - We understand main formulas but missing component details

## 1. FINAL CALCULATION OUTPUTS

### Primary Output: Total Cost (U32)
```
U32 = SUM(F26:X26) = 1,609,136.64 rubles
```

### Cost Categories (J30-J36)
```
J30: = F26 (Covers)
J31: = G26+H26+I26+J26 (Corpus total)
J32: = N26+O26+P26 (Core total) = 1,356,336.64
J33: = K26+L26+M26 (Connections)
J34: = R26+S26+T26+U26+V26+X26 (Other materials) = 194,700
J35: = Q26 (Assembly)
J36: = W26 (Packaging/logistics) = 58,100
```

## 2. FIELD USAGE MAPPING

### ✅ UNDERSTOOD - Main Mass Calculation

**Formula G93 (Main Plate Mass)**: 1820.5952 kg
```javascript
Uses:
- технолог!G27 (equipmentType) → VLOOKUP to get dimensions
- технолог!P27 (plateMaterial) → VLOOKUP to get density (0.00788)
- технолог!I27 (equipmentCount) → multiplier (400)
- Constants: +15mm padding on dimensions, ÷1000 conversion

G93 = (732+15) × (715+15) × 3 × 0.00788 ÷ 1000 × 400 = 1820.5952
```

### ✅ UNDERSTOOD - M21 Total Mass Formula

**Formula M21**: 15,104,002.406
```javascript
Uses:
- технолог!T27 (plateLength = 5)
- технолог!U27 (plateThickness = 1)
- технолог!I27 (equipmentCount = 400)
- снабжение!E19 (processingCoeff = 7,552,000)
- технолог!V27 (mountingPanels = 3)

M21 = (5+1)×0.001×400 + 2×7552000 + 2×3×0.001 = 15,104,002.406
```

### ✅ UNDERSTOOD - Test Pressure Calculations

**Formulas N27/O27**: 31.46 bar
```javascript
Uses:
- технолог!J27/K27 (designPressure = 22)
- технолог!L27/M27 (temperature = 100)
- VLOOKUP temperature → allowable stress (160 MPa)
- Formula: CEILING.PRECISE(1.25 × pressure × 183 ÷ stress, 0.01)

N27 = CEILING(1.25 × 22 × 183 ÷ 160, 0.01) = 31.46
```

### ⚠️ PARTIALLY UNDERSTOOD - Component Masses (G94-G104)

We know the output values but NOT the complete formulas:
```
G94: 29.625648 kg - Uses VLOOKUP columns H,I,J (MISSING)
G95: 27.346752 kg - Uses VLOOKUP columns K,L,M (MISSING)
G97: 43.6640256 kg - Uses VLOOKUP columns N,O,P (MISSING)
G98: 9.0266976 kg - Uses VLOOKUP columns Q,R,S (MISSING)
G100: 9.021024 kg - Uses VLOOKUP columns T,U,V (MISSING)
G101: 92.22890688 kg - Uses VLOOKUP columns W,X,Y (MISSING)
G103: 91.9960056 kg - Uses VLOOKUP columns Z,AA,AB (MISSING)
```

### ❌ NOT UNDERSTOOD - Cost Calculations (F26-X26)

**Missing formulas for**:
```
F26: = снабжение!K14 (?)
G26: = снабжение!G35 + снабжение!M35 (?)
H26: = Complex formula using E8, G78, D14, V27, H78, D13 (?)
I26: = снабжение!G22 × 2 (?)
J26: = снабжение!M22 × 4 (?)
K26: = снабжение!Q25 (?)
L26: = снабжение!F38 (?)
M26: = L26 × M25 (?)
N26: = 1,274,416.64 (formula unknown)
O26: = Complex formula (?)
P26: = Conditional on equipmentType (?)
...etc
```

### ❌ NOT UNDERSTOOD - Supply Field Usage

**Fields with UNKNOWN usage**:
- F2 (orderNumber) - Where used?
- D9 (bodyMaterial) - Confirmation only or calculation?
- F39 (coefficient) - Multiplies what?
- D43-D46 (component costs) - How combined?
- G43-G45 (additional costs) - Added where?
- Flange specs (C28-J29) - Cost impact?
- Processing costs (H54-H57) - Formula?
- Quantities (I50-I57) - Multiply what?
- Fastener specs - Cost calculation?

## 3. CALCULATION DEPENDENCY TREE

```
FINAL COST (U32)
├── J32: Core Cost = 1,356,336.64
│   ├── N26: Plate cost (formula UNKNOWN)
│   ├── O26: Component cost (formula UNKNOWN)
│   └── P26: Equipment-specific (formula UNKNOWN)
├── J34: Other Materials = 194,700
│   ├── Uses: R26, S26, T26, U26, V26, X26
│   └── Formulas: UNKNOWN
└── J36: Logistics = 58,100
    └── Formula: UNKNOWN

MASS CALCULATIONS
├── G93: Main mass = 1820.5952 ✅ UNDERSTOOD
├── G94-G104: Components = 118.68 ⚠️ PARTIAL
└── M21: Total = 15,104,002.406 ✅ UNDERSTOOD
```

## 4. CRITICAL UNKNOWNS

### 🔴 HIGH PRIORITY - Block calculations
1. **Cost formulas** (F26-X26) - How costs aggregate
2. **Component formulas** (G94-G104) - VLOOKUP columns H-AK
3. **Supply field usage** - Which fields affect which calculations

### 🟡 MEDIUM PRIORITY - Affect accuracy
4. **Conditional logic** - Equipment type conditions
5. **Multiplier usage** - F39, quantity fields
6. **Price aggregation** - How component prices combine

### 🟢 LOW PRIORITY - UI only
7. **Label fields** - Don't affect calculations
8. **Descriptive fields** - Information only

## 5. WHAT WE NEED TO DISCOVER

### From Excel Analysis
1. Complete formulas for F26-X26 (cost calculations)
2. VLOOKUP columns H-AK (component dimensions)
3. How supply prices (D43-D46) aggregate to final cost

### From Testing
1. Change each field and observe output changes
2. Map dependencies through testing
3. Reverse-engineer formulas

## 6. IMPLEMENTATION RISK ASSESSMENT

### ✅ Can Implement Now (High Confidence)
- Main plate mass (G93)
- M21 total formula
- Test pressure calculations
- Basic structure

### ⚠️ Can Approximate (Medium Confidence)
- Component masses (have values, missing exact formulas)
- Some cost categories (have totals)

### ❌ Cannot Implement (Need More Info)
- Detailed cost calculations
- Supply field integration
- Component cost formulas
- Conditional logic

## 7. RECOMMENDED APPROACH

### Option 1: Reverse Engineering
1. Test each field individually
2. Observe output changes
3. Derive formulas empirically
**Time: 2-3 weeks**

### Option 2: Get Complete Excel Formulas
1. Request formula documentation
2. Or access to Excel with formula view
3. Extract all formulas programmatically
**Time: 1-2 days with access**

### Option 3: Implement Known + Stub Unknown
1. Implement what we understand (mass calculations)
2. Stub cost calculations with hardcoded values
3. Refine as we learn more
**Time: 1 week for partial implementation**

## CONCLUSION

**Understanding Level: 40%**
- ✅ Main mass calculations understood
- ⚠️ Component calculations partially understood
- ❌ Cost calculations NOT understood
- ❌ Many field usages UNKNOWN

**Recommendation**: We need either:
1. Complete Excel formula access, OR
2. Systematic testing to reverse-engineer, OR
3. Documentation from Excel creator

Without this, we can only implement ~40% of the calculator accurately.