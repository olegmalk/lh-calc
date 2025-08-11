// Enum values and field metadata will be fetched dynamically from API
let ENUM_VALUES = {};
let FIELD_METADATA = {};

// Hardcoded values for fields that don't have validation in Excel
// G27 values are from снабжение!AM45:AM52 (named range типоразмеры_К4)
// H27 values are standard heat exchanger pass configurations
const HARDCODED_ENUMS = {
    'tech_G27_sizeTypeK4': [
        'К4-750',
        'К4-500',
        'К4-600',
        'К4-600*300',
        'К4-1000',
        'К4-1000*500',
        'К4-1200',
        'К4-1200*600'
    ],
    'tech_H27_passes': [
        '1/6',
        '1/1',
        '1/2',
        '1/3',
        '1/4',
        '1/5',
        '2/2',
        '2/3',
        '2/4',
        '2/5',
        '3/3',
        '3/4',
        '4/3',
        '4/4',
        '5/2',
        '6/1'
    ]
};

// Field sections based on Fields2.xlsx structure
const FIELD_SECTIONS = {
    technolog: {
        title: '🔧 Технические параметры теплообменника (вкладка технолог)',
        fields: [
            { id: 'tech_D27_sequenceNumber', label: 'D27 - Порядковый номер', type: 'number', default: 1 },
            { id: 'tech_E27_customerOrderPosition', label: 'E27 - Позиция в ОЛ Заказчика', type: 'text', default: 'Е-113' },
            { id: 'tech_F27_deliveryType', label: 'F27 - Тип поставки', type: 'select', enumField: true, default: 'Целый ТА' },
            { id: 'tech_G27_sizeTypeK4', label: 'G27 - Типоразмер К4', type: 'select', enumField: true, default: 'К4-750' },
            { id: 'tech_H27_passes', label: 'H27 - Ходы', type: 'select', enumField: true, default: '1/6' },
            { id: 'tech_I27_plateQuantity', label: 'I27 - Количество пластин, шт', type: 'number', default: 50 },
            { id: 'tech_J27_calcPressureHotSide', label: 'J27 - Расч давл по гор стороне, бар', type: 'number', default: 22 },
            { id: 'tech_K27_calcPressureColdSide', label: 'K27 - Расч давл по хол стороне, бар', type: 'number', default: 23 },
            { id: 'tech_L27_calcTempHotSide', label: 'L27 - Расч темп по гор стороне, °C', type: 'number', default: 90 },
            { id: 'tech_M27_calcTempColdSide', label: 'M27 - Расч темп по хол стороне, °C', type: 'number', default: 70 },
            { id: 'tech_P27_plateMaterial', label: 'P27 - Материал пластин', type: 'select', enumField: true, default: 'AISI 316L' },
            { id: 'tech_Q27_materialType', label: 'Q27 - Материал проточной части', type: 'text', default: 'AISI 316L' },
            { id: 'tech_R27_bodyMaterial', label: 'R27 - Материал корпуса', type: 'select', enumField: true, default: '09Г2С' },
            { id: 'tech_S27_plateSurfaceType', label: 'S27 - Тип поверхности пластин', type: 'select', enumField: true, default: 'гофра' },
            { id: 'tech_T27_drawDepth', label: 'T27 - Глубина вытяжки, мм', type: 'number', default: 5 },
            { id: 'tech_U27_plateThickness', label: 'U27 - Толщина пластины, мм', type: 'select', enumField: true, default: 1 },
            { id: 'tech_V27_claddingThickness', label: 'V27 - Толщина плакировки, мм', type: 'select', enumField: true, default: 3 }
        ]
    },
    supply_main: {
        title: '💰 Снабжение - Основные параметры',
        fields: [
            { id: 'sup_F2_projectNumber', label: 'F2 - Номер проекта (Б24)', type: 'text', default: '' },
            { id: 'sup_D8_flowPartMaterialPricePerKg', label: 'D8 - Цена материала проточной части, руб/кг', type: 'currency', default: 70 },
            { id: 'sup_E8_flowPartMaterialPrice', label: 'E8 - Цена материала проточной части', type: 'currency', default: 70 },
            { id: 'sup_D9_bodyMaterial', label: 'D9 - Материал корпуса', type: 'select', enumField: true, default: '09Г2С' },
            { id: 'sup_D10_columnCoverMaterialPrice', label: 'D10 - Цена материала колонн/крышек, руб/кг', type: 'currency', default: 10 },
            { id: 'sup_D11_panelMaterialPrice', label: 'D11 - Цена материала панелей, руб/кг', type: 'currency', default: 10 },
            { id: 'sup_K13_normHoursPerUnit', label: 'K13 - Количество нормочасов', type: 'number', default: 1 },
            { id: 'sup_P13_internalLogistics', label: 'P13 - Внутренняя логистика', type: 'currency', default: 20 },
            { id: 'sup_D17_panelCuttingCoefficient', label: 'D17 - Поправка на раскрой панелей', type: 'percentage', default: 1 },
            { id: 'sup_D78_stainlessSteelThickness', label: 'D78 - Толщина нержавейки, мм', type: 'number', default: 3 }
        ]
    },
    cover_column: {
        title: '🔩 Крышка и Колонна',
        fields: [
            { id: 'sup_E19_coverRolledThickness', label: 'E19 - Толщина проката крышки, м', type: 'number', default: 10 },
            { id: 'sup_E20_coverCuttingPrice', label: 'E20 - Цена раскроя крышки, руб', type: 'currency', default: 10 },
            { id: 'sup_E21_coverProcessingCost', label: 'E21 - Стоимость обработки крышки, руб', type: 'currency', default: 10 },
            { id: 'sup_K19_columnRolledThickness', label: 'K19 - Толщина проката колонны, м', type: 'number', default: 30 },
            { id: 'sup_K20_columnCuttingPrice', label: 'K20 - Цена раскроя колонны, руб', type: 'currency', default: 30 },
            { id: 'sup_K21_columnProcessingCost', label: 'K21 - Стоимость обработки колонны, руб', type: 'currency', default: 30 }
        ]
    },
    panel_a: {
        title: '📐 Панель А',
        fields: [
            { id: 'sup_E25_panelRolledThickness', label: 'E25 - Толщина проката панели, м', type: 'number', default: 10 },
            { id: 'sup_E26_panelCuttingPrice', label: 'E26 - Цена раскроя панели, руб', type: 'currency', default: 10 },
            { id: 'sup_E27_panelProcessingCost', label: 'E27 - Стоимость обработки панели, руб', type: 'currency', default: 10 },
            { id: 'sup_F28_flange1PanelAPrice', label: 'F28 - Цена фланца №1, руб', type: 'currency', default: 10 },
            { id: 'sup_F29_flange2PanelAPrice', label: 'F29 - Цена фланца №2, руб', type: 'currency', default: 10 },
            { id: 'sup_F30_pipeBilletFlange1Price', label: 'F30 - Цена трубы под фланец №1', type: 'currency', default: 10 },
            { id: 'sup_F31_pipeBilletFlange2Price', label: 'F31 - Цена трубы под фланец №2', type: 'currency', default: 10 },
            { id: 'sup_F32_drainageNozzlePrice', label: 'F32 - Цена патрубка дренажа', type: 'currency', default: 10 },
            { id: 'sup_F33_ventilationNozzlePrice', label: 'F33 - Цена патрубка вентиляции', type: 'currency', default: 10 },
            { id: 'sup_C28_panelAFlange1Pressure', label: 'C28 - Давление фланца №1', type: 'select', enumField: true, default: 'Ру10' },
            { id: 'sup_C29_panelAFlange2Pressure', label: 'C29 - Давление фланца №2', type: 'select', enumField: true, default: 'Ру10' },
            { id: 'sup_D28_panelAFlange1Diameter', label: 'D28 - Диаметр фланца №1', type: 'select', enumField: true, default: 'Ду100' },
            { id: 'sup_D29_panelAFlange2Diameter', label: 'D29 - Диаметр фланца №2', type: 'select', enumField: true, default: 'Ду100' }
        ]
    },
    panel_b: {
        title: '📐 Панель Б',
        fields: [
            { id: 'sup_K25_panelBRolledThickness', label: 'K25 - Толщина проката панели Б, м', type: 'number', default: 30 },
            { id: 'sup_K26_panelBCuttingPrice', label: 'K26 - Цена раскроя панели Б, руб', type: 'currency', default: 30 },
            { id: 'sup_K27_panelBProcessingCost', label: 'K27 - Стоимость обработки панели Б, руб', type: 'currency', default: 30 },
            { id: 'sup_L28_panelBFlange3Price', label: 'L28 - Цена фланца №3, руб', type: 'currency', default: 40 },
            { id: 'sup_L29_panelBFlange4Price', label: 'L29 - Цена фланца №4, руб', type: 'currency', default: 40 },
            { id: 'sup_L30_panelBPipeBilletFlange3Price', label: 'L30 - Цена трубы под фланец №3', type: 'currency', default: 40 },
            { id: 'sup_L31_panelBPipeBilletFlange4Price', label: 'L31 - Цена трубы под фланец №4', type: 'currency', default: 40 },
            { id: 'sup_L32_panelBDrainageNozzlePrice', label: 'L32 - Цена патрубка дренажа панель Б', type: 'currency', default: 40 },
            { id: 'sup_L33_panelBVentilationNozzlePrice', label: 'L33 - Цена патрубка вентиляции панель Б', type: 'currency', default: 40 },
            { id: 'sup_I28_panelBFlange3Pressure', label: 'I28 - Давление фланца №3', type: 'select', enumField: true, default: 'Ру10' },
            { id: 'sup_I29_panelBFlange4Pressure', label: 'I29 - Давление фланца №4', type: 'select', enumField: true, default: 'Ру10' },
            { id: 'sup_J28_panelBFlange3Diameter', label: 'J28 - Диаметр фланца №3', type: 'select', enumField: true, default: 'Ду100' },
            { id: 'sup_J29_panelBFlange4Diameter', label: 'J29 - Диаметр фланца №4', type: 'select', enumField: true, default: 'Ду100' }
        ]
    },
    gaskets_studs: {
        title: '🔧 Прокладки и Распорки',
        fields: [
            { id: 'sup_F39_spareKitsPressureReserve', label: 'F39 - Запасные комплекты резерв', type: 'select', enumField: true, default: '2' },
            { id: 'sup_D38_panelGasketsPrice', label: 'D38 - Цена прокладки панелей', type: 'currency', default: 10 },
            { id: 'sup_D43_studM24x2000Price', label: 'D43 - Цена шпильки М24х2000', type: 'currency', default: 33 },
            { id: 'sup_D44_studM24x1000Price', label: 'D44 - Цена шпильки М24х1000', type: 'currency', default: 17 },
            { id: 'sup_D45_studM20x2000Price', label: 'D45 - Цена шпильки М20х2000', type: 'currency', default: 28 },
            { id: 'sup_D46_studM20M16x1000Price', label: 'D46 - Цена шпильки М20/М16х1000', type: 'currency', default: 12 },
            { id: 'sup_G43_nutM24DIN6330Price', label: 'G43 - Цена гайки М24 DIN6330', type: 'currency', default: 20 },
            { id: 'sup_G44_nutM24DIN933Price', label: 'G44 - Цена гайки М24 DIN933', type: 'currency', default: 20 },
            { id: 'sup_G45_nutM20M16DIN933Price', label: 'G45 - Цена гайки М20/М16 DIN933', type: 'currency', default: 20 }
        ]
    },
    spare_parts: {
        title: '🔄 ЗИП (Запасные части)',
        fields: [
            { id: 'sup_H54_spareFlangeFlange1Price', label: 'H54 - ЗИП крепеж фланец №1', type: 'currency', default: 20 },
            { id: 'sup_H55_spareFlangeFlange2Price', label: 'H55 - ЗИП крепеж фланец №2', type: 'currency', default: 20 },
            { id: 'sup_H56_spareFlangeFlange3Price', label: 'H56 - ЗИП крепеж фланец №3', type: 'currency', default: 20 },
            { id: 'sup_H57_spareFlangeFlange4Price', label: 'H57 - ЗИП крепеж фланец №4', type: 'currency', default: 20 },
            { id: 'sup_I50_sparePanelStudQuantity', label: 'I50 - ЗИП шпилька кол-во', type: 'number', default: 20 },
            { id: 'sup_I51_sparePanelNutQuantity', label: 'I51 - ЗИП гайка кол-во', type: 'number', default: 20 },
            { id: 'sup_I52_sparePanelWasherQuantity', label: 'I52 - ЗИП шайба кол-во', type: 'number', default: 20 },
            { id: 'sup_I54_flangeFastenersFlange1Quantity', label: 'I54 - Крепеж фланец №1 кол-во', type: 'number', default: 20 },
            { id: 'sup_I55_flangeFastenersFlange2Quantity', label: 'I55 - Крепеж фланец №2 кол-во', type: 'number', default: 20 },
            { id: 'sup_I56_flangeFastenersFlange3Quantity', label: 'I56 - Крепеж фланец №3 кол-во', type: 'number', default: 20 },
            { id: 'sup_I57_flangeFastenersFlange4Quantity', label: 'I57 - Крепеж фланец №4 кол-во', type: 'number', default: 20 },
            { id: 'sup_M51_spareAnchorBoltsCost', label: 'M51 - ЗИП анкерные болты стоимость', type: 'currency', default: 50 },
            { id: 'sup_M52_spareOtherCost', label: 'M52 - ЗИП другое стоимость', type: 'currency', default: 50 },
            { id: 'sup_N50_sparePanelGasketsQuantity', label: 'N50 - ЗИП прокладки панелей кол-во', type: 'number', default: 60 },
            { id: 'sup_N51_spareAnchorBoltsQuantity', label: 'N51 - ЗИП анкерные болты кол-во', type: 'number', default: 60 },
            { id: 'sup_N52_spareOtherQuantity', label: 'N52 - ЗИП другое кол-во', type: 'number', default: 60 },
            { id: 'sup_N54_spareFlangeGasketsFlange1Quantity', label: 'N54 - ЗИП прокладки фланец №1', type: 'number', default: 60 },
            { id: 'sup_N55_spareFlangeGasketsFlange2Quantity', label: 'N55 - ЗИП прокладки фланец №2', type: 'number', default: 60 },
            { id: 'sup_N56_spareFlangeGasketsFlange3Quantity', label: 'N56 - ЗИП прокладки фланец №3', type: 'number', default: 60 },
            { id: 'sup_N57_spareFlangeGasketsFlange4Quantity', label: 'N57 - ЗИП прокладки фланец №4', type: 'number', default: 60 }
        ]
    },
    supports_braces: {
        title: '🏗️ Опоры и Раскосы',
        fields: [
            { id: 'sup_I38_eyeboltKitMaterialCost', label: 'I38 - Проушины металл', type: 'currency', default: 20 },
            { id: 'sup_I39_eyeboltKitProcessingCost', label: 'I39 - Проушины обработка', type: 'currency', default: 20 },
            { id: 'sup_K38_supportsKitMaterialCost', label: 'K38 - Лапы металл', type: 'currency', default: 30 },
            { id: 'sup_K39_supportsKitProcessingCost', label: 'K39 - Лапы обработка', type: 'currency', default: 30 },
            { id: 'sup_M38_bracesKitMaterialCost', label: 'M38 - Раскосы металл', type: 'currency', default: 50 },
            { id: 'sup_M39_bracesKitProcessingCost', label: 'M39 - Раскосы обработка', type: 'currency', default: 50 }
        ]
    },
    other_materials: {
        title: '📦 Другие материалы',
        fields: [
            { id: 'sup_I44_otherMaterialsDesc1', label: 'I44 - Другие материалы 1', type: 'textarea', default: '' },
            { id: 'sup_I45_otherMaterialsDesc2', label: 'I45 - Другие материалы 2', type: 'textarea', default: '' },
            { id: 'sup_I46_otherMaterialsDesc3', label: 'I46 - Другие материалы 3', type: 'textarea', default: '' },
            { id: 'sup_M44_otherMaterialsCost1', label: 'M44 - Стоимость материалов 1', type: 'currency', default: 50 },
            { id: 'sup_M45_otherMaterialsCost2', label: 'M45 - Стоимость материалов 2', type: 'currency', default: 50 },
            { id: 'sup_M46_otherMaterialsCost3', label: 'M46 - Стоимость материалов 3', type: 'currency', default: 50 },
            { id: 'sup_P45_unaccountedCost', label: 'P45 - Неучтенка стоимость', type: 'currency', default: 70 }
        ]
    },
    panel_fasteners: {
        title: '⚙️ Крепеж панелей и КОФ',
        fields: [
            { id: 'sup_P19_panelFastenersQuantity', label: 'P19 - Крепеж панелей кол-во', type: 'number', default: 70 },
            { id: 'sup_P20_panelFastenersMaterial', label: 'P20 - Крепеж панелей материал', type: 'select', enumField: true, default: '09Г2С' },
            { id: 'sup_P21_panelFastenersCoating', label: 'P21 - Крепеж панелей покрытие', type: 'select', enumField: true, default: '' },
            { id: 'sup_P22_panelFastenersStudSize', label: 'P22 - Крепеж панелей размер шпильки', type: 'select', enumField: true, default: '' },
            { id: 'sup_Q22_panelFastenersStudCost', label: 'Q22 - Крепеж панелей цена шпильки', type: 'currency', default: 80 },
            { id: 'sup_Q23_panelFastenersNutCost', label: 'Q23 - Крепеж панелей цена гайки', type: 'currency', default: 80 },
            { id: 'sup_Q24_panelFastenersWasherCost', label: 'Q24 - Крепеж панелей цена шайбы', type: 'currency', default: 80 },
            // КОФ fields
            { id: 'sup_Q29_cofFastenersFlange1Material', label: 'Q29 - КОФ материал крепежа фланец №1', type: 'select', enumField: true, default: '' },
            { id: 'sup_Q33_cofFastenersFlange2Material', label: 'Q33 - КОФ материал крепежа фланец №2', type: 'select', enumField: true, default: '' },
            { id: 'sup_Q37_cofFastenersFlange3Material', label: 'Q37 - КОФ материал крепежа фланец №3', type: 'select', enumField: true, default: '' },
            { id: 'sup_Q41_cofFastenersFlange4Material', label: 'Q41 - КОФ материал крепежа фланец №4', type: 'select', enumField: true, default: '' },
            { id: 'sup_R29_cofFastenersFlange1Coating', label: 'R29 - КОФ покрытие крепежа фланец №1', type: 'select', enumField: true, default: '' },
            { id: 'sup_R33_cofFastenersFlange2Coating', label: 'R33 - КОФ покрытие крепежа фланец №2', type: 'select', enumField: true, default: '' },
            { id: 'sup_R37_cofFastenersFlange3Coating', label: 'R37 - КОФ покрытие крепежа фланец №3', type: 'select', enumField: true, default: '' },
            { id: 'sup_R41_cofFastenersFlange4Coating', label: 'R41 - КОФ покрытие крепежа фланец №4', type: 'select', enumField: true, default: '' },
            { id: 'sup_P29_cofFastenersFlange1Size', label: 'P29 - КОФ размер крепежа фланец №1', type: 'select', enumField: true, default: '' },
            { id: 'sup_P33_cofFastenersFlange2Size', label: 'P33 - КОФ размер крепежа фланец №2', type: 'select', enumField: true, default: '' },
            { id: 'sup_P37_cofFastenersFlange3Size', label: 'P37 - КОФ размер крепежа фланец №3', type: 'select', enumField: true, default: '' },
            { id: 'sup_P41_cofFastenersFlange4Size', label: 'P41 - КОФ размер крепежа фланец №4', type: 'select', enumField: true, default: '' },
            { id: 'sup_T29_cofFastenersFlange1KitPrice', label: 'T29 - КОФ цена комплекта фланец №1', type: 'currency', default: 29 },
            { id: 'sup_T30_cofGasketFlange1Price', label: 'T30 - КОФ прокладка фланец №1', type: 'currency', default: 30 },
            { id: 'sup_T31_cofObturatorFlange1Price', label: 'T31 - КОФ обтюратор фланец №1', type: 'currency', default: 31 },
            { id: 'sup_T33_cofFastenersFlange2KitPrice', label: 'T33 - КОФ цена комплекта фланец №2', type: 'currency', default: 33 },
            { id: 'sup_T34_cofGasketFlange2Price', label: 'T34 - КОФ прокладка фланец №2', type: 'currency', default: 34 },
            { id: 'sup_T35_cofObturatorFlange2Price', label: 'T35 - КОФ обтюратор фланец №2', type: 'currency', default: 35 },
            { id: 'sup_T37_cofFastenersFlange3KitPrice', label: 'T37 - КОФ цена комплекта фланец №3', type: 'currency', default: 37 },
            { id: 'sup_T38_cofGasketFlange3Price', label: 'T38 - КОФ прокладка фланец №3', type: 'currency', default: 38 },
            { id: 'sup_T39_cofObturatorFlange3Price', label: 'T39 - КОФ обтюратор фланец №3', type: 'currency', default: 39 },
            { id: 'sup_T41_cofFastenersFlange4KitPrice', label: 'T41 - КОФ цена комплекта фланец №4', type: 'currency', default: 41 },
            { id: 'sup_T42_cofGasketFlange4Price', label: 'T42 - КОФ прокладка фланец №4', type: 'currency', default: 42 },
            { id: 'sup_T43_cofObturatorFlange4Price', label: 'T43 - КОФ обтюратор фланец №4', type: 'currency', default: 43 }
        ]
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
async function initializeApp() {
    console.log('Initializing application with sectioned layout...');
    
    // Fetch field metadata and enum values
    await fetchFieldMetadata();
    
    // Create the sectioned form
    createSectionedForm();
    
    // Load saved values
    loadSavedValues();
    
    // Setup event handlers
    setupEventHandlers();
}

// Fetch field metadata from API with fallback
async function fetchFieldMetadata() {
    try {
        // Try to fetch metadata endpoint
        const metadataResponse = await fetch('/api/fields/metadata');
        if (metadataResponse.ok) {
            const data = await metadataResponse.json();
            console.log('Fetched field metadata:', data);
            
            // Process metadata
            if (data.fields) {
                data.fields.forEach(field => {
                    FIELD_METADATA[field.id] = field;
                    if (field.enumValues) {
                        ENUM_VALUES[field.id] = field.enumValues;
                    }
                });
            }
            return;
        }
    } catch (error) {
        console.log('Metadata endpoint not available, falling back to enum endpoint');
    }
    
    // Fallback to enum endpoint
    try {
        const enumResponse = await fetch('/api/fields/enum');
        if (enumResponse.ok) {
            const data = await enumResponse.json();
            console.log('Fetched enum values:', data);
            if (data.fields) {
                ENUM_VALUES = data.fields;
            }
        }
    } catch (error) {
        console.error('Error fetching field data:', error);
    }
}

// Create sectioned form
function createSectionedForm() {
    const container = document.getElementById('fieldsContainer');
    if (!container) {
        console.error('Fields container not found');
        return;
    }
    
    container.innerHTML = '';
    
    // Create sections
    for (const [sectionKey, section] of Object.entries(FIELD_SECTIONS)) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        sectionDiv.id = `section-${sectionKey}`;
        
        // Section header
        const header = document.createElement('h3');
        header.className = 'section-header';
        header.innerHTML = `
            <span class="section-toggle">▼</span>
            ${section.title}
            <span class="field-count">(${section.fields.length} полей)</span>
        `;
        header.onclick = () => toggleSection(sectionKey);
        sectionDiv.appendChild(header);
        
        // Section content
        const content = document.createElement('div');
        content.className = 'section-content';
        content.id = `section-content-${sectionKey}`;
        
        // Create fields grid
        const fieldsGrid = document.createElement('div');
        fieldsGrid.className = 'fields-grid';
        
        section.fields.forEach(field => {
            const fieldDiv = renderField(field);
            fieldsGrid.appendChild(fieldDiv);
        });
        
        content.appendChild(fieldsGrid);
        sectionDiv.appendChild(content);
        container.appendChild(sectionDiv);
    }
    
    // Add section navigation
    addSectionNavigation();
}

// Render individual field
function renderField(field) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'form-group';
    
    const label = document.createElement('label');
    label.htmlFor = field.id;
    label.textContent = field.label;
    
    // Add currency symbol for currency fields
    if (field.type === 'currency') {
        label.innerHTML = field.label + ' <span class="currency-symbol">₽</span>';
    }
    // Add percentage symbol for percentage fields  
    else if (field.type === 'percentage') {
        label.innerHTML = field.label + ' <span class="percentage-symbol">%</span>';
    }
    
    fieldDiv.appendChild(label);
    
    let input;
    
    // Check if field has enum values (from API or hardcoded)
    const hasEnumValues = field.enumField && (ENUM_VALUES[field.id] || HARDCODED_ENUMS[field.id]);
    
    if (field.type === 'select' || hasEnumValues) {
        input = document.createElement('select');
        input.id = field.id;
        input.name = field.id;
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '-- Выберите --';
        input.appendChild(emptyOption);
        
        // Add enum values if available (from API or hardcoded)
        const enumValues = ENUM_VALUES[field.id] || HARDCODED_ENUMS[field.id];
        if (enumValues) {
            enumValues.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                input.appendChild(option);
            });
            
            // Select first enum value if available
            if (enumValues.length > 0) {
                input.value = enumValues[0];
            }
        }
        
        // Set default value if specified and not already set
        if (field.default && !input.value) {
            input.value = field.default;
        }
    } else if (field.type === 'textarea') {
        input = document.createElement('textarea');
        input.id = field.id;
        input.name = field.id;
        input.rows = 3;
        input.placeholder = 'Введите описание...';
        input.value = field.default || '';
    } else {
        input = document.createElement('input');
        input.id = field.id;
        input.name = field.id;
        
        // Set input type
        if (field.type === 'number' || field.type === 'currency' || field.type === 'percentage') {
            input.type = 'number';
            input.step = field.type === 'currency' ? '0.01' : 'any';
            
            // Apply validation from metadata
            const metadata = FIELD_METADATA[field.id];
            if (metadata && metadata.validation) {
                if (metadata.validation.min !== undefined) {
                    input.min = metadata.validation.min;
                }
                if (metadata.validation.max !== undefined) {
                    input.max = metadata.validation.max;
                }
            }
        } else {
            input.type = 'text';
        }
        
        input.value = field.default || '';
        
        // Add placeholders
        if (field.type === 'currency') {
            input.placeholder = '0.00';
        } else if (field.type === 'percentage') {
            input.placeholder = '1.0';
        }
    }
    
    // Add field ID as data attribute for easy access
    input.dataset.fieldId = field.id;
    
    fieldDiv.appendChild(input);
    
    return fieldDiv;
}

// Toggle section visibility
function toggleSection(sectionKey) {
    const content = document.getElementById(`section-content-${sectionKey}`);
    const header = document.querySelector(`#section-${sectionKey} .section-toggle`);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        header.textContent = '▼';
    } else {
        content.style.display = 'none';
        header.textContent = '▶';
    }
}

// Add section navigation
function addSectionNavigation() {
    const nav = document.createElement('div');
    nav.className = 'section-navigation';
    nav.innerHTML = `
        <button onclick="expandAllSections()">Развернуть все</button>
        <button onclick="collapseAllSections()">Свернуть все</button>
    `;
    
    const container = document.getElementById('fieldsContainer');
    container.parentNode.insertBefore(nav, container);
}

// Expand all sections
function expandAllSections() {
    Object.keys(FIELD_SECTIONS).forEach(sectionKey => {
        const content = document.getElementById(`section-content-${sectionKey}`);
        const header = document.querySelector(`#section-${sectionKey} .section-toggle`);
        if (content) {
            content.style.display = 'block';
            header.textContent = '▼';
        }
    });
}

// Collapse all sections
function collapseAllSections() {
    Object.keys(FIELD_SECTIONS).forEach(sectionKey => {
        const content = document.getElementById(`section-content-${sectionKey}`);
        const header = document.querySelector(`#section-${sectionKey} .section-toggle`);
        if (content) {
            content.style.display = 'none';
            header.textContent = '▶';
        }
    });
}

// Setup event handlers
function setupEventHandlers() {
    // Calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCost);
    }
    
    // Load defaults button
    const loadDefaultsBtn = document.getElementById('loadDefaultsBtn');
    if (loadDefaultsBtn) {
        loadDefaultsBtn.addEventListener('click', loadDefaults);
    }
    
    // Clear form button
    const clearFormBtn = document.getElementById('clearFormBtn');
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', clearForm);
    }
}

// Calculate cost
async function calculateCost() {
    const requestData = {};
    
    // Collect all field values
    Object.values(FIELD_SECTIONS).forEach(section => {
        section.fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input) {
                const value = input.value.trim();
                if (value !== '') {
                    // Send raw value to server for validation
                    requestData[field.id] = value;
                }
            }
        });
    });
    
    console.log('Sending request:', requestData);
    
    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            displayResults(result);
            saveValues(); // Save successful values
        } else {
            displayError(result);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка при отправке запроса: ' + error.message);
    }
}

// Display results
function displayResults(result) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <div class="success">
            <h3>✅ Расчет выполнен успешно!</h3>
            <div class="result-item">
                <strong>Общая стоимость:</strong> 
                <span class="total-cost">${formatCurrency(result.results.total_cost)}</span>
            </div>
            <h4>Компоненты стоимости:</h4>
            <ul>
                ${Object.entries(result.results.component_costs || {}).map(([key, value]) => 
                    `<li>${key}: ${formatCurrency(value)}</li>`
                ).join('')}
            </ul>
            <div class="meta-info">
                <small>Request ID: ${result.request_id}</small><br>
                <small>Время обработки: ${result.processing_time_ms}ms</small>
            </div>
        </div>
    `;
}

// Display error
function displayError(error) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;
    
    let errorDetails = '';
    
    if (error.error && error.error.details) {
        const details = error.error.details;
        
        if (details.field_errors) {
            errorDetails += '<h4>Ошибки полей:</h4><ul>';
            for (const [field, message] of Object.entries(details.field_errors)) {
                errorDetails += `<li><strong>${field}:</strong> ${message}</li>`;
                // Highlight error field
                const input = document.getElementById(field);
                if (input) {
                    input.classList.add('error');
                }
            }
            errorDetails += '</ul>';
        }
        
        if (details.missing_required_fields) {
            errorDetails += '<h4>Отсутствуют обязательные поля:</h4><ul>';
            details.missing_required_fields.forEach(field => {
                errorDetails += `<li>${field}</li>`;
            });
            errorDetails += '</ul>';
        }
    }
    
    resultsDiv.innerHTML = `
        <div class="error">
            <h3>❌ Ошибка расчета</h3>
            <p>${error.error?.message || error.message || 'Неизвестная ошибка'}</p>
            ${errorDetails}
        </div>
    `;
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
    }).format(value);
}

// Load defaults
function loadDefaults() {
    Object.values(FIELD_SECTIONS).forEach(section => {
        section.fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && field.default !== undefined) {
                input.value = field.default;
            }
        });
    });
    saveValues();
}

// Clear form
function clearForm() {
    if (confirm('Вы уверены, что хотите очистить все поля?')) {
        Object.values(FIELD_SECTIONS).forEach(section => {
            section.fields.forEach(field => {
                const input = document.getElementById(field.id);
                if (input) {
                    input.value = '';
                    input.classList.remove('error');
                }
            });
        });
        localStorage.removeItem('calculatorValues');
        document.getElementById('results').innerHTML = '';
    }
}

// Save values to localStorage
function saveValues() {
    const values = {};
    Object.values(FIELD_SECTIONS).forEach(section => {
        section.fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && input.value) {
                values[field.id] = input.value;
            }
        });
    });
    localStorage.setItem('calculatorValues', JSON.stringify(values));
}

// Load saved values from localStorage
function loadSavedValues() {
    const saved = localStorage.getItem('calculatorValues');
    if (saved) {
        try {
            const values = JSON.parse(saved);
            Object.entries(values).forEach(([fieldId, value]) => {
                const input = document.getElementById(fieldId);
                if (input) {
                    input.value = value;
                }
            });
        } catch (error) {
            console.error('Error loading saved values:', error);
        }
    }
}

// Auto-save on input change
document.addEventListener('change', function(e) {
    if (e.target.matches('input, select, textarea')) {
        saveValues();
    }
});

// Add styles for sections
const style = document.createElement('style');
style.textContent = `
    .section {
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .section-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px;
        margin: 0;
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .section-header:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
    
    .section-toggle {
        font-size: 12px;
        width: 20px;
    }
    
    .field-count {
        margin-left: auto;
        font-size: 14px;
        opacity: 0.9;
    }
    
    .section-content {
        padding: 20px;
        background: white;
    }
    
    .fields-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 15px;
    }
    
    .section-navigation {
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
    }
    
    .section-navigation button {
        padding: 8px 16px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .section-navigation button:hover {
        background: #45a049;
    }
    
    .currency-symbol, .percentage-symbol {
        color: #4CAF50;
        font-weight: bold;
    }
    
    input.error {
        border-color: #f44336;
        background-color: #ffebee;
    }
    
    .total-cost {
        font-size: 24px;
        color: #4CAF50;
        font-weight: bold;
    }
`;
document.head.appendChild(style);