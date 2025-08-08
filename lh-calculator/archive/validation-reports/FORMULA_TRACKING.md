# Formula Implementation Tracking

## Summary

- **Total Excel Formulas**: 962
- **Unique Patterns to Implement**: ~40-50
- **Current Implementation**: ~8-10 patterns (20%)

## Core Calculation Patterns

### ✅ Implemented (Basic)

- [x] Material weight calculation
- [x] Basic cost aggregation
- [x] Equipment type selection
- [x] Material price lookups

### 🔴 Critical - Not Implemented

- [ ] **Pressure test calculations** (AI73/AJ73) - SAFETY CRITICAL
- [ ] **Plate dimension interpolation** (VLOOKUP matrix)
- [ ] **Draw depth calculations** (Column T)
- [ ] **Cladding thickness adjustments** (Column V)

### 📊 Main Calculation Groups

#### 1. Dimension Calculations (13 patterns)

- [ ] Plate width/height from equipment type
- [ ] Cover dimensions
- [ ] Column dimensions
- [ ] Panel dimensions
- [ ] Gasket calculations

#### 2. Weight Calculations (8 patterns)

- [x] Basic weight formula (mass = volume × density)
- [ ] Plate weight with cladding
- [ ] Cover weight calculations
- [ ] Column weight calculations
- [ ] Panel weight calculations
- [ ] Fastener weight
- [ ] Gasket weight
- [ ] Total assembly weight

#### 3. Cost Calculations (10 patterns)

- [x] Material cost (weight × price/kg)
- [ ] Cutting cost calculations
- [ ] Labor cost calculations
- [ ] Logistics cost allocation
- [ ] Correction factor applications
- [ ] Assembly labor costs
- [ ] Testing costs
- [ ] Certification costs
- [ ] Packaging costs
- [ ] Margin calculations

#### 4. Lookup Operations (7 patterns)

- [x] Equipment type → dimensions
- [ ] Pressure → flange rating
- [ ] Temperature → material selection
- [ ] Material → density lookup
- [ ] Material → price lookup
- [ ] Size → gasket dimensions
- [ ] Pressure/temp → safety factors

#### 5. Conditional Logic (5 patterns)

- [x] Equipment type selection
- [ ] Material compatibility checks
- [ ] Pressure rating validation
- [ ] Temperature limit checks
- [ ] Delivery type adjustments

#### 6. Aggregations (5 patterns)

- [x] Total cost summation
- [ ] Component cost breakdown
- [ ] Material usage summary
- [ ] Labor hours total
- [ ] Weight summary by component

## Tracking Progress

### Phase 1: Safety Critical (4 hours)

- [ ] N27/O27 pressure test fields
- [ ] AI73/AJ73 safety calculations
- [ ] U27 field mapping fix

### Phase 2: Core Calculations (8 hours)

- [ ] VLOOKUP matrix for dimensions
- [ ] All weight calculations
- [ ] Cost calculations with corrections

### Phase 3: Complete Logic (8 hours)

- [ ] Remaining lookups
- [ ] Conditional validations
- [ ] Final aggregations

## Formula Examples from Excel

### Simple Repetitive Pattern (appears 13x)

```excel
снабжение!E110: =(E110+15)*(F110+15)*G110*7880/1000000000*2
снабжение!E111: =(E111+15)*(F111+15)*G111*7880/1000000000*2
... (same pattern for all equipment types)
```

**Implementation**: One function with equipment type parameter

### Complex Lookup Pattern

```excel
технолог!AI73: =INDEX(материал_пластин,MATCH(1.25*J27,давление_Ру,1),MATCH(Q27,материал_пластин_заголовки,0))
```

**Implementation**: Pressure-based material selection logic

### Conditional Cost Pattern

```excel
снабжение!K34: =IF(технолог!G27="standard",120000,IF(технолог!G27="express",180000,150000))
```

**Implementation**: Delivery type cost adjustment

## Notes

1. **Most formulas are NOT unique** - they're the same calculation repeated for different equipment types
2. **Focus on patterns, not individual formulas** - implement once, apply to all equipment types
3. **The Excel has 13 equipment types** × ~30 calculations each = ~390 formulas that are really just 30 patterns
4. **Priority on safety calculations** - pressure tests are critical for production
