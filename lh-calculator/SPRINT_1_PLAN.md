# Sprint 1 Development Plan - LH Calculator
**To**: olegmalkov2023@gmail.com  
**Date**: August 6, 2025  
**Project**: Heat Exchanger Cost Calculation System

---

## 🚀 Sprint 1: MVP Foundation (August 6-20, 2025)

### Executive Summary
Converting Excel calculator with 962 formulas into modern web application using React, TypeScript, and Zustand. Sprint 1 establishes core calculation engine and basic UI.

### Sprint Goals
- ✅ Set up calculation engine infrastructure
- ✅ Implement 10-15 critical formulas
- ✅ Create input form for equipment specifications
- ✅ Display real-time calculation results
- ✅ Achieve Excel parity for core calculations

### 📋 User Stories (26 Story Points)

#### Story 1: Core Calculation Engine (8 pts)
```typescript
// Key deliverable: Formula parser and calculation context
interface CalculationEngine {
  parseFormula(excel: string): Function;
  calculate(sheet: 'технолог' | 'снабжение' | 'результат'): Results;
  trackDependencies(): DependencyGraph;
}
```

#### Story 2: Technical Input Form (5 pts)
- Equipment type (типоразмер): К4-250 to К4-3000
- Pressure A/B: 0-100 bar
- Temperature A/B: 0-200°C
- Material selection: AISI 316L, etc.

#### Story 3: Critical Formulas (8 pts)
**Excel → JavaScript translations:**
```javascript
// Pressure calculation (AI73)
const pressure = Math.ceil(1.25 * baseValue * factor / divisor * 100) / 100;

// Material density
const densities = {
  'steel': 7880,      // kg/m³
  'stainless': 8080   // kg/m³
};

// VLOOKUP equivalent
const lookup = (value, matrix, column) => matrix.find(row => row[0] === value)?.[column];
```

#### Story 4: State Management (3 pts)
```typescript
// Zustand stores
const useInputStore = create((set) => ({
  equipment: {},
  materials: {},
  updateField: (field, value) => set(state => ({...}))
}));

const useCalculationStore = create((set) => ({
  results: {},
  calculate: async () => {...}
}));
```

#### Story 5: Results Dashboard (2 pts)
- Real-time calculation display
- Component cost breakdown
- Total cost aggregation
- Loading states

### 🎯 Definition of Done
| Criterion | Target |
|-----------|--------|
| Formula Accuracy | 100% match with Excel |
| Performance | <2 seconds calculation time |
| Test Coverage | 80% unit test coverage |
| Validation | All inputs validated |
| Documentation | Code documented |

### 📊 Key Metrics to Track
- Calculation accuracy vs Excel
- Performance benchmarks
- User input validation rate
- Error handling coverage

### 🔧 Technical Stack
```json
{
  "frontend": {
    "framework": "React 18",
    "language": "TypeScript",
    "bundler": "Vite",
    "ui": "Mantine v8",
    "state": "Zustand",
    "query": "TanStack Query"
  },
  "calculations": {
    "formulas": 962,
    "sheets": ["технолог", "снабжение", "результат"],
    "critical_formulas": 15
  }
}
```

### 🚨 Risks & Mitigations
1. **Formula Translation Errors**
   - Mitigation: Create Excel comparison tests
   - Action: Side-by-side validation

2. **Performance Issues**
   - Mitigation: Implement caching early
   - Action: Use memoization for expensive calculations

3. **State Management Complexity**
   - Mitigation: Clear separation of concerns
   - Action: Separate stores for input/calculation/materials

### 📅 Daily Standup Topics
- **Day 1-2**: Calculation engine setup
- **Day 3-4**: Input form development
- **Day 5-7**: Formula implementation
- **Day 8-9**: State management integration
- **Day 10**: Testing and refinement

### 📈 Success Criteria
- [ ] Engineer can input heat exchanger specifications
- [ ] System calculates pressure correctly (matching Excel)
- [ ] Results update in real-time
- [ ] Core formulas produce accurate results
- [ ] Performance meets <2 second target

### 🔗 Resources
- **Excel File**: `Себестоимость ТЕПЛОБЛОК шаблон для снабжения версия 7 ДЛЯ БИТРИКС (1) (1).xlsx`
- **Formulas JSON**: `excel_formulas.json` (962 formulas extracted)
- **PRD**: `PRD.md`
- **Architecture**: `ARCHITECTURE.md`
- **User Stories**: `USER_STORIES.md`

### 📞 Contact
**Project Lead**: Oleg Malkov (olegmalkov2023@gmail.com)  
**Development Server**: http://34.88.248.65:10000/  
**Repository**: /home/vmuser/dev/lh_calc/lh-calculator

---

## Русская версия / Russian Version

### 🚀 Спринт 1: Основа MVP (6-20 августа 2025)

### Краткое описание
Конвертация Excel калькулятора с 962 формулами в современное веб-приложение на React, TypeScript и Zustand. Спринт 1 создает основной движок расчетов и базовый интерфейс.

### Цели спринта
- ✅ Настройка инфраструктуры движка расчетов
- ✅ Реализация 10-15 критических формул
- ✅ Создание формы ввода характеристик оборудования
- ✅ Отображение результатов расчетов в реальном времени
- ✅ Достижение точности Excel для основных расчетов

### Ключевые формулы для реализации
- Расчет давления: `ОКРВВЕРХ.ТОЧН(1.25*давление*фактор/делитель, 0.01)`
- Плотность материалов: 7880 кг/м³ (сталь), 8080 кг/м³ (нержавейка)
- Поиск в матрицах температура-напряжение (аналог ВПР)
- Коэффициент безопасности 1.25

### Критерии готовности
- Точность формул: 100% соответствие Excel
- Производительность: <2 секунд на расчет
- Покрытие тестами: 80%
- Валидация всех входных данных
- Документированный код

---

**Готовы начать разработку! / Ready to start development!**