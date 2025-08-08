# 📄 PRD FILES SUMMARY & STORAGE REQUIREMENTS

## 🗂️ PRD FILES INVENTORY

### 1. Primary PRD Document

**File**: `/home/vmuser/dev/lh_calc/lh-calculator/PRD.md`  
**Created**: 2025-08-06  
**Status**: Active requirements document

### 2. Original Excel Source (THE REAL PRD!)

**File**: `Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7 ДЛЯ БИТРИКС (1) (1).xlsx`  
**Note**: File name literally says "FOR BITRIX" (ДЛЯ БИТРИКС)  
**Content**: 962 formulas across 3 sheets

### 3. Supporting Documents

- `CLAUDE.md` - Project context and clarifications
- `ARCHITECTURE.md` - Technical architecture
- `USER_STORIES.md` - User stories and epics
- `EXCEL_ANALYSIS.md` - Formula extraction analysis
- Sprint planning documents

## 🎯 STORAGE & API REQUIREMENTS FROM PRD

### ✅ EXPLICITLY SPECIFIED IN PRD

#### 1. **Bitrix24 Integration** (BR-004, F-004.2, TC-004)

```
Requirements:
- Export calculated results to Bitrix24 CRM system
- API-compatible data format
- Map Excel outputs to Bitrix24 fields
- Maintain calculation audit trail
- One-click export functionality
- Integration with existing CRM workflows
- Quote generation templates
```

**Status**: ❌ NOT IMPLEMENTED

#### 2. **Material Database** (BR-003, Epic 4)

```
Requirements:
- Support material specifications with temperature-pressure matrices
- CRUD operations for materials
- Material properties management
- Temperature-stress lookup tables
```

**Status**: ✅ Partially implemented (hardcoded, not CRUD)

#### 3. **Calculation Audit Trail**

```
Requirements:
- Maintain history of calculations
- Track changes and versions
- Audit log for compliance
```

**Status**: ❌ NOT IMPLEMENTED

### ⚠️ IMPLIED BUT NOT EXPLICIT

#### 1. **Data Persistence**

- PRD doesn't explicitly specify HOW to store data
- Focus is on WHAT data to process (Excel formulas)
- No mention of database technology choice

#### 2. **Multi-User Support**

- Not mentioned in PRD
- Bitrix24 integration implies shared data
- But no explicit multi-user requirements

#### 3. **Offline Support**

- Not mentioned in PRD
- Focus on calculation accuracy, not availability

## 📊 STORAGE OPTIONS ANALYSIS

### Option 1: Frontend-Only + Bitrix24 API (CURRENT GAP)

```
User → React App → Calculate → Bitrix24 API
         ↓
    localStorage (temp)
```

**Pros**:

- Matches PRD requirement for Bitrix24 export
- Simple architecture
- Bitrix24 becomes the database

**Cons**:

- Requires Bitrix24 API credentials
- Network dependency for saves
- Limited offline capability

### Option 2: Simple Backend + Bitrix24 Sync

```
User → React App → Simple API → Database
                        ↓
                   Bitrix24 Sync
```

**Pros**:

- Local database for fast access
- Batch sync to Bitrix24
- Works offline

**Cons**:

- More complex than needed?
- Duplicates data

### Option 3: localStorage + Bitrix24 Export (RECOMMENDED)

```
User → React App → localStorage
         ↓              ↓
    Auto-save    Export to Bitrix24 (on demand)
```

**Pros**:

- Simplest solution
- Meets PRD requirements
- Fast local operations
- Export when needed

**Cons**:

- No multi-user
- 5MB localStorage limit

## 🔍 KEY FINDINGS

### 1. **Bitrix24 is REQUIRED**

- File name says "ДЛЯ БИТРИКС" (FOR BITRIX)
- PRD explicitly requires Bitrix24 integration
- This is NOT optional

### 2. **Database is NOT specified**

- PRD doesn't mandate PostgreSQL
- PRD doesn't mandate any specific database
- Focus is on calculation accuracy and Bitrix24 export

### 3. **Current Sprint 2 Plan MISSES Bitrix24**

- Complex database architecture planned
- But NO Bitrix24 integration included
- This violates PRD requirement BR-004

## 📝 CORRECTED REQUIREMENTS

### MUST HAVE (From PRD)

1. ✅ Calculate costs with 962 formulas (DONE)
2. ❌ **Export to Bitrix24 CRM** (MISSING!)
3. ❌ Material database management
4. ❌ Calculation audit trail

### NICE TO HAVE (Not in PRD)

1. Local database (PostgreSQL)
2. Multi-user support
3. Offline sync
4. Complex versioning

## 🚨 CRITICAL ISSUE

**We're planning complex database architecture but IGNORING the actual PRD requirement for Bitrix24 integration!**

### Recommended Action

1. **STOP** complex database planning
2. **FOCUS** on Bitrix24 API integration
3. **USE** localStorage for local saves
4. **IMPLEMENT** Bitrix24 export function

## 💡 SIMPLIFIED SOLUTION

```typescript
// What PRD actually requires:
class Bitrix24Exporter {
  async exportCalculation(calc: SavedCalculation) {
    const bitrixData = {
      TITLE: `Расчет ${calc.name}`,
      OPPORTUNITY: calc.results.totalCost,
      UF_EQUIPMENT_TYPE: calc.inputs.equipmentType,
      UF_PLATE_COUNT: calc.inputs.plateCount,
      // ... map all fields
    };

    await fetch("https://company.bitrix24.ru/rest/deal.add", {
      method: "POST",
      body: JSON.stringify(bitrixData),
    });
  }
}
```

## 📋 REVISED SPRINT 2 PRIORITIES

Based on ACTUAL PRD requirements:

### Priority 1: Bitrix24 Integration (REQUIRED)

- Research Bitrix24 REST API
- Implement field mapping
- Create export function
- Test with client's Bitrix24

### Priority 2: Local Storage (SIMPLE)

- Save/load with localStorage
- Export to Excel
- Simple project grouping

### Priority 3: Material Database (IF TIME)

- CRUD for materials
- Temperature-pressure matrices
- Reference data management

### SKIP (Not in PRD)

- PostgreSQL database
- Complex sync mechanisms
- Multi-user support
- Advanced versioning

## ✅ FINAL RECOMMENDATION

1. **Follow the PRD**, not imagined requirements
2. **Implement Bitrix24** integration (it's required!)
3. **Keep storage simple** (localStorage is enough)
4. **Skip complexity** that PRD doesn't require

The client named their Excel file "FOR BITRIX" - this is the clearest requirement we have!
