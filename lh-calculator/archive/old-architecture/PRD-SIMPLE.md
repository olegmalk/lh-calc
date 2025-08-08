# 📋 PRODUCT REQUIREMENTS - LH CALCULATOR (SIMPLIFIED)

**Version**: 2.0 (Corrected)  
**Date**: 2025-08-07  
**Status**: ACTIVE - This is the ONLY PRD to follow

---

## 🎯 PROJECT OBJECTIVE (SIMPLE & CLEAR)

**Build a web calculator that:**

1. Replaces Excel file with 962 formulas ✅ DONE
2. Calculates heat exchanger costs ✅ DONE
3. Saves calculations locally
4. Exports to Excel
5. **Exports to Bitrix24 CRM** ← CRITICAL REQUIREMENT

**Target User**: Single company, few users, Russian market

---

## ✅ WHAT'S ALREADY DONE (Sprint 1)

### Completed Features

- ✅ **Calculation Engine**: All 962 formulas implemented
- ✅ **Web Interface**: Clean, responsive UI
- ✅ **Validation**: All inputs validated
- ✅ **Localization**: Russian/English support
- ✅ **Testing**: 100% test coverage

### Current State

- Fully functional calculator
- Running at: http://34.88.248.65:10000/
- All calculations work correctly
- Ready for production use (except saving/export)

---

## 📌 WHAT'S ACTUALLY NEEDED (Not What We Imagined)

### MUST HAVE Requirements

#### 1. Save/Load Calculations Locally

- **Method**: localStorage (simple, sufficient)
- **Capacity**: ~1000 calculations (5MB limit)
- **Features**:
  - Auto-save on change
  - Name calculations
  - Delete old ones
  - Search by name/date

#### 2. Export to Excel

- **Format**: .xlsx matching original template
- **Content**: 3 sheets (Технолог, Снабжение, Результат)
- **Library**: ExcelJS
- **Download**: Direct browser download

#### 3. Export to Bitrix24 CRM 🔴 CRITICAL

- **Purpose**: Create quotes in CRM
- **Method**: Bitrix24 REST API
- **Fields**: Map calculation results to CRM fields
- **Trigger**: Button "Send to CRM"

**Required Bitrix24 Fields**:

```javascript
{
  TITLE: "Расчет теплообменника [Date]",
  OPPORTUNITY: totalCost,           // Сумма
  UF_EQUIPMENT_TYPE: equipmentType, // Типоразмер
  UF_PLATE_COUNT: plateCount,       // Кол-во пластин
  UF_PRESSURE_A: pressureA,         // Давление А
  UF_PRESSURE_B: pressureB,         // Давление Б
  UF_MATERIAL: materialPlate,       // Материал
  // ... other custom fields
}
```

#### 4. Simple Project Organization

- Group calculations by project/client
- Filter by project
- No complex relationships needed

---

## ❌ WHAT'S NOT NEEDED (Don't Build)

### Over-Engineering to Avoid

- ❌ PostgreSQL database
- ❌ Complex backend API
- ❌ User authentication
- ❌ Multi-tenant architecture
- ❌ Sync mechanisms
- ❌ Version control system
- ❌ Audit logs
- ❌ Role-based access

**Why not needed**: Single company, few users, simple requirements

---

## 🏗️ TECHNICAL APPROACH (KISS Principle)

### Architecture

```
Frontend Only + Bitrix24 API
├── React App (existing)
├── localStorage (for saves)
├── ExcelJS (for export)
└── Bitrix24 REST API (for CRM)
```

### Data Storage

```javascript
// Simple localStorage structure
{
  "calc_001": {
    id: "001",
    name: "Project Alpha - Option 1",
    projectId: "proj_001",
    inputs: {...},
    results: {...},
    savedAt: "2025-08-07T10:00:00Z"
  },
  "projects": [
    { id: "proj_001", name: "Project Alpha" }
  ]
}
```

### Implementation Priority

1. **Week 1**: localStorage save/load
2. **Week 1**: Excel export
3. **Week 2**: Bitrix24 integration
4. **Week 2**: Polish & deploy

---

## 🔄 BITRIX24 INTEGRATION DETAILS

### Prerequisites from Client

- Bitrix24 webhook URL
- Access token/credentials
- Custom field IDs (UF\_\*)
- CRM entity type (Deal/Lead)

### Basic Implementation

```javascript
async function exportToBitrix24(calculation) {
  const webhook = "https://company.bitrix24.ru/rest/1/token/";

  const data = {
    fields: {
      TITLE: `Расчет ${calculation.name}`,
      OPPORTUNITY: calculation.results.totalCost,
      CURRENCY_ID: "RUB",
      // Map all calculation fields
    },
  };

  await fetch(`${webhook}crm.deal.add`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
```

### Error Handling

- Show success/error message
- Retry on network failure
- Log failed exports locally

---

## 📊 SUCCESS METRICS

### Functional Success

- [ ] User can save/load calculations
- [ ] User can export to Excel
- [ ] User can send to Bitrix24
- [ ] No data loss on refresh

### Performance Targets

- Calculation: < 100ms
- Save/Load: < 50ms
- Excel export: < 2s
- Bitrix24 export: < 5s

### Business Success

- Replace Excel completely
- Integrate with existing CRM workflow
- Reduce quote preparation time

---

## 🚫 COMMON MISTAKES TO AVOID

### Don't Do This Again

1. **Don't assume** complex architecture is needed
2. **Don't add** databases without clear requirement
3. **Don't plan** for imaginary scale problems
4. **Don't ignore** explicit requirements (Bitrix24!)
5. **Don't over-document** before validating needs

### Do This Instead

1. **Read** actual requirements carefully
2. **Ask** client about unclear points
3. **Build** simplest solution first
4. **Validate** with real users
5. **Iterate** based on feedback

---

## 📅 REALISTIC TIMELINE

### Phase 1: Essential Features (1 week)

- Day 1-2: localStorage save/load
- Day 3-4: Excel export
- Day 5: Testing & fixes

### Phase 2: Bitrix24 Integration (1 week)

- Day 1: Get credentials from client
- Day 2-3: Implement API integration
- Day 4: Field mapping & testing
- Day 5: Deploy & training

### Total: 2 weeks (not 2 months!)

---

## ✅ DEFINITION OF DONE

The project is COMPLETE when:

1. ✅ Calculator works (ALREADY DONE)
2. ⬜ Saves/loads locally work
3. ⬜ Excel export works
4. ⬜ Bitrix24 export works
5. ⬜ Client trained on usage

---

## 📝 LESSONS LEARNED

### What Went Wrong

- Started with complex architecture assumptions
- Didn't read PRD carefully (missed "ДЛЯ БИТРИКС")
- Over-planned without validation
- Created 10+ unnecessary documents

### What Went Right

- Calculation engine works perfectly
- UI is clean and intuitive
- Tests are comprehensive
- Caught the mistake before building

### Key Takeaway

> "The best code is no code. The best architecture is the simplest one that works."

---

## 🤝 CLIENT COMMUNICATION NEEDED

### Questions for Client

1. Bitrix24 webhook URL and credentials?
2. Which CRM entity: Deal or Lead?
3. Custom field mappings?
4. Any specific workflow triggers?
5. Who will maintain Bitrix24 integration?

### Next Steps

1. Get Bitrix24 access
2. Implement simple features
3. Test with real data
4. Deploy when ready

---

**Remember**: This is a CALCULATOR for a SMALL BUSINESS, not a platform for thousands of users. Keep it simple!
