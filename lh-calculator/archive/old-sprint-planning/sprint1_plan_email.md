# Sprint 1 Plan - LH Calculator Project

## English Version

### Project Overview

**LH Calculator** - Heat Exchanger Cost Calculation System

- Converting Excel calculator (962 formulas) to modern web application
- Tech Stack: React 18, TypeScript, Vite, Mantine UI, Zustand, TanStack Query
- Integration: Bitrix24 CRM

### Sprint 1: MVP Foundation (Week 1-2)

**Duration**: August 6-20, 2025
**Goal**: Establish core infrastructure and basic calculation flow
**Total Story Points**: 26

### User Stories for Sprint 1

#### 1. Core Calculation Engine Setup (P0, 8 points)

**As a** system architect  
**I want** to set up the calculation engine infrastructure  
**So that** we can process 962 formulas efficiently

**Acceptance Criteria:**

- ✅ Formula parser implemented for Excel formula translation
- ✅ Calculation context with dependency tracking
- ✅ Three-layer flow: технолог → снабжение → результат
- ✅ Performance monitoring integrated

#### 2. Technical Input Form (P0, 5 points)

**As a** heat exchanger engineer  
**I want** to input equipment specifications  
**So that** I can calculate costs accurately

**Acceptance Criteria:**

- ✅ Form fields: equipment type (типоразмер), size, pressure, temperature
- ✅ Material selection dropdown (AISI 316L, etc.)
- ✅ Real-time validation
- ✅ Connected to Zustand state management

#### 3. Critical Formula Implementation (P0, 8 points)

**As a** calculation engine  
**I want** to implement core Excel formulas  
**So that** we maintain 100% mathematical accuracy

**Formulas to Implement:**

- Pressure calculations: `CEILING.PRECISE(1.25*pressure*factor/divisor, 0.01)`
- Material density lookups: 7880 kg/m³ (steel), 8080 kg/m³ (stainless)
- Temperature-stress matrix lookups (VLOOKUP equivalents)
- Safety factor calculations (1.25 multiplier)

#### 4. State Management Setup (P0, 3 points)

**As a** developer  
**I want** to configure Zustand stores  
**So that** state management is predictable and efficient

**Stores to Create:**

- `inputStore`: Technical specifications
- `calculationStore`: Formula results
- `materialStore`: Material properties
- Reactive calculation triggers

#### 5. Basic Results Display (P0, 2 points)

**As a** cost analyst  
**I want** to see calculation results in real-time  
**So that** I can verify costs immediately

**Acceptance Criteria:**

- ✅ Dashboard showing calculated values
- ✅ Component cost breakdown
- ✅ Real-time updates on input changes
- ✅ Loading states during calculations

### Definition of Done

- [ ] All critical formulas produce results matching Excel
- [ ] Input validation prevents invalid calculations
- [ ] Unit tests achieve 80% coverage
- [ ] Performance: calculations complete in <2 seconds
- [ ] Code review completed
- [ ] Documentation updated

### Technical Deliverables

1. `/src/lib/calculation-engine/` - Core calculation infrastructure
2. `/src/stores/` - Zustand state management
3. `/src/components/TechnicalInputForm/` - Input interface
4. `/src/components/ResultsDashboard/` - Results display
5. `/src/data/materials.ts` - Material property database

### Key Risks & Mitigations

- **Risk**: Formula translation errors
  - **Mitigation**: Side-by-side Excel comparison testing
- **Risk**: Performance issues with 962 formulas
  - **Mitigation**: Implement caching and memoization early

---

## Русская версия

### Обзор проекта

**LH Calculator** - Система расчета стоимости теплообменников

- Конвертация Excel калькулятора (962 формулы) в современное веб-приложение
- Технологии: React 18, TypeScript, Vite, Mantine UI, Zustand, TanStack Query
- Интеграция: Bitrix24 CRM

### Спринт 1: Основа MVP (Неделя 1-2)

**Длительность**: 6-20 августа 2025
**Цель**: Создание базовой инфраструктуры и основного потока расчетов
**Всего story points**: 26

### Пользовательские истории для Спринта 1

#### 1. Настройка движка расчетов (P0, 8 баллов)

**Как** системный архитектор  
**Я хочу** настроить инфраструктуру движка расчетов  
**Чтобы** эффективно обрабатывать 962 формулы

**Критерии приемки:**

- ✅ Реализован парсер формул для перевода Excel формул
- ✅ Контекст расчетов с отслеживанием зависимостей
- ✅ Трехслойный поток: технолог → снабжение → результат
- ✅ Интегрирован мониторинг производительности

#### 2. Форма технических данных (P0, 5 баллов)

**Как** инженер по теплообменникам  
**Я хочу** вводить характеристики оборудования  
**Чтобы** точно рассчитывать стоимость

**Критерии приемки:**

- ✅ Поля формы: типоразмер, размер, давление, температура
- ✅ Выбор материала (AISI 316L и др.)
- ✅ Валидация в реальном времени
- ✅ Подключение к Zustand

#### 3. Реализация критических формул (P0, 8 баллов)

**Как** движок расчетов  
**Я хочу** реализовать основные формулы Excel  
**Чтобы** сохранить 100% математическую точность

**Формулы для реализации:**

- Расчеты давления: `CEILING.PRECISE(1.25*давление*фактор/делитель, 0.01)`
- Плотность материалов: 7880 кг/м³ (сталь), 8080 кг/м³ (нержавейка)
- Матрицы температура-напряжение (аналоги ВПР)
- Коэффициент безопасности (множитель 1.25)

#### 4. Настройка управления состоянием (P0, 3 балла)

**Как** разработчик  
**Я хочу** настроить хранилища Zustand  
**Чтобы** управление состоянием было предсказуемым

**Создаваемые хранилища:**

- `inputStore`: Технические характеристики
- `calculationStore`: Результаты формул
- `materialStore`: Свойства материалов
- Реактивные триггеры расчетов

#### 5. Базовое отображение результатов (P0, 2 балла)

**Как** аналитик по затратам  
**Я хочу** видеть результаты расчетов в реальном времени  
**Чтобы** сразу проверять стоимость

**Критерии приемки:**

- ✅ Дашборд с расчетными значениями
- ✅ Разбивка стоимости по компонентам
- ✅ Обновление при изменении входных данных
- ✅ Состояния загрузки во время расчетов

### Определение готовности

- [ ] Все критические формулы дают результаты, совпадающие с Excel
- [ ] Валидация предотвращает некорректные расчеты
- [ ] Юнит-тесты покрывают 80% кода
- [ ] Производительность: расчеты выполняются за <2 секунды
- [ ] Выполнена проверка кода
- [ ] Обновлена документация

### Технические результаты

1. `/src/lib/calculation-engine/` - Инфраструктура расчетов
2. `/src/stores/` - Управление состоянием Zustand
3. `/src/components/TechnicalInputForm/` - Интерфейс ввода
4. `/src/components/ResultsDashboard/` - Отображение результатов
5. `/src/data/materials.ts` - База данных материалов

### Ключевые риски и их снижение

- **Риск**: Ошибки перевода формул
  - **Снижение**: Параллельное тестирование с Excel
- **Риск**: Проблемы производительности с 962 формулами
  - **Снижение**: Раннее внедрение кэширования и мемоизации

---

## Контактная информация / Contact Information

- **Project Repository**: /home/vmuser/dev/lh_calc/lh-calculator
- **Development Server**: http://34.88.248.65:10000/
- **Documentation**: CLAUDE.md, PRD.md, ARCHITECTURE.md, USER_STORIES.md

## Статус готовности к Спринту 1 / Sprint 1 Readiness

✅ PRD завершен / PRD complete  
✅ Архитектура спроектирована / Architecture designed  
✅ User stories созданы / User stories created  
✅ Технический стек настроен / Tech stack configured  
✅ BMAD агенты интегрированы / BMAD agents integrated  
✅ Excel формулы извлечены / Excel formulas extracted

**Готовы к началу разработки! / Ready to start development!**
