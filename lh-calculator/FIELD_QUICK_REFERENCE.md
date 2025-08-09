# Field Implementation Quick Reference

## Top 50 Critical Fields - Heat Exchanger Calculator

---

## Phase 1: MVP Core Fields (15 fields)

_CRITICAL - Must implement first for basic functionality_

### Input Collection Fields (Technologist Role)

| Field ID       | Cell         | Label                 | Status         | Priority | Dependencies   |
| -------------- | ------------ | --------------------- | -------------- | -------- | -------------- |
| **FIELD_0026** | технолог!D27 | Position Number       | ✅ IMPLEMENTED | CRITICAL | None           |
| FIELD_XXXX     | технолог!E27 | Customer Order Number | ❌ MISSING     | CRITICAL | None           |
| FIELD_XXXX     | технолог!F27 | Delivery Type         | ❌ MISSING     | CRITICAL | None           |
| **FIELD_XXXX** | технолог!G27 | Equipment Type        | ❌ MISSING     | CRITICAL | VLOOKUP Tables |
| **FIELD_XXXX** | технолог!H27 | Plate Configuration   | ❌ MISSING     | CRITICAL | Equipment Type |
| **FIELD_XXXX** | технолог!I27 | Plate Count           | ❌ MISSING     | CRITICAL | Configuration  |
| **FIELD_XXXX** | технолог!J27 | Pressure Hot Side     | ❌ MISSING     | CRITICAL | None           |
| **FIELD_XXXX** | технолог!K27 | Pressure Cold Side    | ❌ MISSING     | CRITICAL | None           |
| **FIELD_XXXX** | технолог!L27 | Temperature Hot Side  | ❌ MISSING     | CRITICAL | Interpolation  |
| **FIELD_XXXX** | технолог!M27 | Temperature Cold Side | ❌ MISSING     | CRITICAL | Interpolation  |
| **FIELD_XXXX** | технолог!P27 | Plate Material        | ❌ MISSING     | CRITICAL | Material DB    |
| **FIELD_XXXX** | технолог!Q27 | Cladding Material     | ❌ MISSING     | CRITICAL | Auto-sync P27  |
| **FIELD_XXXX** | технолог!R27 | Body Material         | ❌ MISSING     | CRITICAL | Material DB    |
| **FIELD_XXXX** | технолог!S27 | Surface Type          | ❌ MISSING     | CRITICAL | None           |
| **FIELD_XXXX** | технолог!U27 | Plate Thickness       | ❌ MISSING     | CRITICAL | Material specs |

### Supply Parameters (Supply Role)

| Field ID       | Cell          | Label                       | Status         | Priority | Dependencies |
| -------------- | ------------- | --------------------------- | -------------- | -------- | ------------ |
| **FIELD_0127** | снабжение!D8  | Plate Material Price        | ✅ IMPLEMENTED | CRITICAL | None         |
| FIELD_XXXX     | снабжение!E8  | Cladding Material Price     | ❌ MISSING     | CRITICAL | None         |
| FIELD_XXXX     | снабжение!F8  | Column Cover Material Price | ❌ MISSING     | CRITICAL | None         |
| FIELD_XXXX     | снабжение!G8  | Panel Material Price        | ❌ MISSING     | CRITICAL | None         |
| FIELD_XXXX     | снабжение!A12 | Labor Rate                  | ❌ MISSING     | CRITICAL | None         |

---

## Phase 1: Technical Calculations (15 fields)

_HIGH PRIORITY - Core calculation engine_

### Test Pressure Calculations

| Field ID       | Cell          | Label                    | Status     | Priority | Formula Complexity     |
| -------------- | ------------- | ------------------------ | ---------- | -------- | ---------------------- |
| **FIELD_XXXX** | технолог!N27  | Test Pressure Hot        | ❌ MISSING | HIGH     | =MAX(J27\*1.25, J27+1) |
| **FIELD_XXXX** | технолог!O27  | Test Pressure Cold       | ❌ MISSING | HIGH     | =MAX(K27\*1.25, K27+1) |
| **FIELD_XXXX** | технолог!AI73 | Final Test Pressure Hot  | ❌ MISSING | HIGH     | Complex interpolation  |
| **FIELD_XXXX** | технолог!AJ73 | Final Test Pressure Cold | ❌ MISSING | HIGH     | Complex interpolation  |

### Material Calculations

| Field ID       | Cell          | Label              | Status     | Priority | Formula Complexity   |
| -------------- | ------------- | ------------------ | ---------- | -------- | -------------------- |
| **FIELD_XXXX** | технолог!T27  | Draw Depth         | ❌ MISSING | HIGH     | Equipment-dependent  |
| **FIELD_XXXX** | технолог!V27  | Cladding Thickness | ❌ MISSING | HIGH     | Material-dependent   |
| FIELD_XXXX     | технолог!AC70 | Plate Mass Base    | ❌ MISSING | HIGH     | Density \* Volume    |
| FIELD_XXXX     | технолог!AC71 | Plate Mass Total   | ❌ MISSING | HIGH     | Base _ Count _ Waste |

### Component Dimensions

| Field ID       | Cell          | Label             | Status         | Priority | Formula Complexity   |
| -------------- | ------------- | ----------------- | -------------- | -------- | -------------------- |
| FIELD_XXXX     | технолог!AH72 | Cover Dimensions  | ❌ MISSING     | MEDIUM   | Geometry calculation |
| **FIELD_0104** | технолог!AI72 | Column Dimensions | ✅ IMPLEMENTED | MEDIUM   | Geometry calculation |
| **FIELD_0105** | технолог!AJ72 | Panel Dimensions  | ✅ IMPLEMENTED | MEDIUM   | Equipment-specific   |

---

## Phase 1: Cost Aggregation (15 fields)

_HIGH PRIORITY - Final cost calculations_

### Primary Cost Components

| Field ID   | Cell          | Label             | Status     | Priority | Formula Complexity   |
| ---------- | ------------- | ----------------- | ---------- | -------- | -------------------- |
| FIELD_XXXX | результат!F26 | Plate Work Cost   | ❌ MISSING | CRITICAL | =снабжение!K14       |
| FIELD_XXXX | результат!G26 | Corpus Total      | ❌ MISSING | CRITICAL | =G35+M35 (снабжение) |
| FIELD_XXXX | результат!H26 | Panel Material    | ❌ MISSING | CRITICAL | Complex calculation  |
| FIELD_XXXX | результат!I26 | Covers Cost       | ❌ MISSING | CRITICAL | =G22\*2 (снабжение)  |
| FIELD_XXXX | результат!J26 | Columns Cost      | ❌ MISSING | CRITICAL | =M22\*4 (снабжение)  |
| FIELD_XXXX | результат!N26 | Plate Package     | ❌ MISSING | CRITICAL | Multi-sheet formula  |
| FIELD_XXXX | результат!O26 | Clad Material     | ❌ MISSING | CRITICAL | Multi-sheet formula  |
| FIELD_XXXX | результат!P26 | Internal Supports | ❌ MISSING | CRITICAL | Equipment-specific   |

### Category Totals

| Field ID   | Cell          | Label           | Status     | Priority | Formula Complexity |
| ---------- | ------------- | --------------- | ---------- | -------- | ------------------ |
| FIELD_XXXX | результат!J30 | Work Total      | ❌ MISSING | HIGH     | =F26               |
| FIELD_XXXX | результат!J31 | Corpus Category | ❌ MISSING | HIGH     | =G26+H26+I26+J26   |
| FIELD_XXXX | результат!J32 | Core Category   | ❌ MISSING | HIGH     | =N26+O26+P26       |
| FIELD_XXXX | результат!U32 | **GRAND TOTAL** | ❌ MISSING | CRITICAL | =SUM(F26:X26)      |

---

## Phase 2: Extended Fields (10 fields)

_MEDIUM PRIORITY - Enhanced functionality_

### Advanced Supply Parameters

| Field ID       | Cell          | Label                   | Status         | Priority | Implementation Notes  |
| -------------- | ------------- | ----------------------- | -------------- | -------- | --------------------- |
| **FIELD_0130** | снабжение!D9  | Alternative Material 1  | ✅ IMPLEMENTED | MEDIUM   | Vendor flexibility    |
| FIELD_XXXX     | снабжение!A13 | Cutting Cost            | ❌ MISSING     | MEDIUM   | Per-meter calculation |
| FIELD_XXXX     | снабжение!K13 | Standard Labor Hours    | ❌ MISSING     | MEDIUM   | Equipment-based       |
| FIELD_XXXX     | снабжение!P13 | Internal Logistics      | ❌ MISSING     | MEDIUM   | Weight-based          |
| FIELD_XXXX     | снабжение!P19 | Panel Fastener Quantity | ❌ MISSING     | MEDIUM   | Count-based           |

### Quality Factors

| Field ID   | Cell          | Label               | Status     | Priority | Implementation Notes |
| ---------- | ------------- | ------------------- | ---------- | -------- | -------------------- |
| FIELD_XXXX | снабжение!D12 | Labor Coefficient   | ❌ MISSING | MEDIUM   | Multiplier factor    |
| FIELD_XXXX | снабжение!D13 | Labor Multiplier    | ❌ MISSING | MEDIUM   | Complexity factor    |
| FIELD_XXXX | снабжение!D14 | Material Factor     | ❌ MISSING | MEDIUM   | Squared in formulas  |
| FIELD_XXXX | снабжение!A14 | Cladding Correction | ❌ MISSING | LOW      | Waste adjustment     |
| FIELD_XXXX | снабжение!A15 | Column Correction   | ❌ MISSING | LOW      | Waste adjustment     |

---

## Critical Dependencies Map

### Level 1: No Dependencies (Can implement first)

```
D27, E27, F27 → Basic project info
D8, E8, F8, G8 → Material prices
A12 → Labor rate
```

### Level 2: Single Dependencies

```
G27 → Equipment type (requires VLOOKUP tables)
H27 → Plate config (requires G27)
P27, Q27, R27 → Materials (require material database)
```

### Level 3: Multiple Dependencies

```
I27 → Plate count (requires G27, H27)
N27, O27 → Test pressures (require J27, K27)
AI73, AJ73 → Final pressures (require L27, M27, interpolation)
```

### Level 4: Complex Aggregations

```
F26-X26 → Cost components (require all supply parameters)
J30-J36 → Category totals (require cost components)
U32 → Grand total (requires all categories)
```

---

## Implementation Priority Matrix

### CRITICAL (Must have for MVP)

- [ ] Equipment specification inputs (G27, H27, I27)
- [ ] Operating parameters (J27, K27, L27, M27)
- [ ] Material selection (P27, Q27, R27)
- [ ] Basic pricing (D8, E8, F8, G8, A12)
- [ ] Grand total calculation (U32)

### HIGH (Core functionality)

- [ ] Test pressure calculations (N27, O27, AI73, AJ73)
- [ ] Material mass calculations (AC70, AC71)
- [ ] Primary cost components (F26, G26, H26, I26, J26, N26, O26, P26)
- [ ] Category totals (J30, J31, J32)

### MEDIUM (Enhanced features)

- [ ] Advanced supply parameters (D9, A13, K13, P13, P19)
- [ ] Quality factors (D12, D13, D14)
- [ ] Correction factors (A14, A15, A16, A17)
- [ ] Component specifications (T27, V27)

### LOW (Nice to have)

- [ ] Alternative materials
- [ ] Advanced logistics
- [ ] Reporting enhancements
- [ ] Analytics features

---

## Formula Complexity Assessment

### Simple (Direct cell references)

- Basic inputs: D27, E27, F27
- Material prices: D8, E8, F8, G8
- Labor rate: A12

### Moderate (Single calculations)

- Test pressures: N27 = MAX(J27\*1.25, J27+1)
- Category totals: J30 = F26, J31 = G26+H26+I26+J26

### Complex (Multi-sheet references)

- Cost components: F26 = снабжение!K14
- Plate package: N26 (requires multiple sheet lookups)
- Grand total: U32 = SUM(F26:X26)

### Advanced (Interpolation/VLOOKUP)

- Final test pressures: AI73, AJ73 (temperature interpolation)
- Equipment specifications: G27 (VLOOKUP required)
- Material properties: P27, R27 (database lookups)

---

## Testing & Validation Strategy

### Phase 1 Validation

- [ ] Compare 15 core calculations vs Excel
- [ ] Test all equipment type variations
- [ ] Validate material database lookups
- [ ] Verify cost aggregation accuracy

### Acceptance Criteria

- **Accuracy:** ±2% variance from Excel calculations
- **Performance:** <500ms for core calculation chain
- **Coverage:** 100% of Phase 1 fields functional
- **Integration:** Seamless role-based access

---

## Next Sprint Actions

### Week 1: Infrastructure

- [ ] Set up enhanced formula engine
- [ ] Create material database schema
- [ ] Implement VLOOKUP table structure
- [ ] Build interpolation algorithms

### Week 2: Core Implementation

- [ ] Implement 15 Phase 1 input fields
- [ ] Build basic calculation chain
- [ ] Create cost aggregation engine
- [ ] Set up testing framework

### Week 3: Integration & Testing

- [ ] Connect role-based permissions
- [ ] Implement Excel comparison tests
- [ ] Build export functionality
- [ ] User acceptance testing

---

_Generated: August 2025 | Priority: Top 50 critical fields | Target: Phase 1 MVP completion_
