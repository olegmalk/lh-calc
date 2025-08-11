// Field configuration - single source of truth
const FIELD_CONFIG = {
    projectInfo: {
        title: '📋 Информация о проекте',
        fields: [
            { id: 'sup_F2_projectNumber', label: 'Номер проекта', type: 'text', default: '' }
        ]
    },
    tech: {
        title: '🔧 Технические параметры теплообменника',
        fields: [
            { id: 'tech_D27_sequenceNumber', label: 'D27 - Номер у технолога', type: 'number', default: 1001 },
            { id: 'tech_E27_customerOrderPosition', label: 'E27', type: 'text', default: 'Е-113' },
            { id: 'tech_F27_deliveryType', label: 'F27', type: 'select', 
              options: ['Целый ТА', 'ШОТ-БЛОК', 'РЕИНЖ'], default: 'Целый ТА' },
            { id: 'tech_G27_sizeTypeK4', label: 'G27', type: 'text', default: 'К4-750' },
            { id: 'tech_H27_passes', label: 'H27 - Ходы', type: 'text', default: '1/6' },
            { id: 'tech_I27_plateQuantity', label: 'I27 - Кол-во пластин', type: 'number', default: 401 },
            { id: 'tech_J27_calcPressureHotSide', label: 'J27', type: 'number', default: 22 },
            { id: 'tech_K27_calcPressureColdSide', label: 'K27', type: 'number', default: 23 },
            { id: 'tech_L27_calcTempHotSide', label: 'L27', type: 'number', default: 101 },
            { id: 'tech_M27_calcTempColdSide', label: 'M27', type: 'number', default: 102 },
            { id: 'tech_P27_plateMaterial', label: 'P27 - Материал пластин', type: 'select',
              options: ['AISI 316L', 'SMO 254', 'Hast-C276', 'Titanium', 'AISI 304', 'AISI316Ti', '904L'], 
              default: 'AISI 316L' },
            { id: 'tech_R27_bodyMaterial', label: 'R27', type: 'select',
              options: ['ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti'],
              default: '09Г2С' },
            { id: 'tech_S27_plateSurfaceType', label: 'S27 - Тип поверхности', type: 'select',
              options: ['гофра', 'дв. лунка', 'од. лунка', 'шпилька', 'шпилька-лунка'], default: 'гофра' },
            { id: 'tech_T27_drawDepth', label: 'T27', type: 'number', default: 5 },
            { id: 'tech_U27_plateThickness', label: 'U27 - Толщина пластины', type: 'select',
              options: ['0.8', '1', '1.2', '1.5', '2', '3', '5'], default: '1' },
            { id: 'tech_V27_claddingThickness', label: 'V27', type: 'select',
              options: ['0.8', '1', '1.2', '1.5', '2', '3', '5'], default: '3' }
        ]
    },
    supMain: {
        title: '💰 Базовые цены и материалы',
        fields: [
            { id: 'sup_D8_flowPartMaterialPricePerKg', label: 'D8 - Цена проточ. части', type: 'number', default: 701 },
            { id: 'sup_E8_flowPartMaterialPrice', label: 'E8 - Принятая Цена материала про...', type: 'number', default: 702 },
            { id: 'sup_D9_bodyMaterial', label: 'D9 - Материал корпуса', type: 'select',
              options: ['ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti'],
              default: '09Г2С' },
            { id: 'sup_D10_columnCoverMaterialPrice', label: 'D10 - Цена колонн/крышек', type: 'number', default: 1010 },
            { id: 'sup_D11_panelMaterialPrice', label: 'D11 - Цена панелей', type: 'number', default: 1011 },
            { id: 'sup_K13_normHoursPerUnit', label: 'K13 - Нормочасы', type: 'number', default: 1 },
            { id: 'sup_P13_internalLogistics', label: 'P13 - Внутр. логистика', type: 'number', default: 120013 },
            { id: 'sup_D17_panelCuttingCoefficient', label: 'D17 - Коэфф. раскроя', type: 'number', default: 1017 },
            { id: 'sup_D78_stainlessSteelThickness', label: 'D78 - Толщ. нержавейки', type: 'number', default: 3 }
        ]
    },
    supE: {
        title: '📦 Весовые характеристики компонентов',
        fields: [
            { id: 'sup_E19_coverRolledThickness', label: 'E19 - Толщ. крышки', type: 'number', default: 1019 },
            { id: 'sup_E20_coverCuttingPrice', label: 'E20 - Цена раскроя крышки', type: 'number', default: 1020 },
            { id: 'sup_E21_coverProcessingCost', label: 'E21 - Обработка крышки', type: 'number', default: 1021 },
            { id: 'sup_E25_panelRolledThickness', label: 'E25 - Толщ. панели', type: 'number', default: 1025 },
            { id: 'sup_E26_panelCuttingPrice', label: 'E26 - Цена раскроя панели', type: 'number', default: 1026 },
            { id: 'sup_E27_panelProcessingCost', label: 'E27 - Обработка панели', type: 'number', default: 1027 }
        ]
    },
    supF: {
        title: '📊 Стоимость трубопроводной обвязки',
        fields: [
            { id: 'sup_F28_flange1PanelAPrice', label: 'F28 - Цена Фланца №1, Панель А, руб.', type: 'number', default: 1028 },
            { id: 'sup_F29_flange2PanelAPrice', label: 'F29 - Цена Фланца №2, Панель А, руб.', type: 'number', default: 1029 },
            { id: 'sup_F30_pipeBilletFlange1Price', label: 'F30 - Цена заготовки трубы под фл...', type: 'number', default: 1030 },
            { id: 'sup_F31_pipeBilletFlange2Price', label: 'F31 - Цена заготовки трубы под фл...', type: 'number', default: 1031 },
            { id: 'sup_F32_drainageNozzlePrice', label: 'F32 - Цена на патрубок (фланец+тр...', type: 'number', default: 1032 },
            { id: 'sup_F33_ventilationNozzlePrice', label: 'F33 - Цена на патрубок(фланец+тру...', type: 'number', default: 1033 },
            { id: 'sup_F39_spareKitsPressureReserve', label: 'F39 - количество запасных комплек...', type: 'number', default: 2 }
        ]
    },
    supD_prices: {
        title: '💵 Дополнительные расходы',
        fields: [
            { id: 'sup_D38_panelGasketsPrice', label: 'D38 - Цена 1 шт., Прокладки панелей', type: 'number', default: 1038 },
            { id: 'sup_D43_studM24x2000Price', label: 'D43 - цена  шпильки М24х2000, шт....', type: 'number', default: 3301 },
            { id: 'sup_D44_studM24x1000Price', label: 'D44 - Цена шпильки М24х1000, шт.,...', type: 'number', default: 1751 },
            { id: 'sup_D45_studM20x2000Price', label: 'D45 - Цена шпильки М20х2000, шт.,...', type: 'number', default: 2801 },
            { id: 'sup_D46_studM20M16x1000Price', label: 'D46 - Цена шпильки М20/М16х1000, ...', type: 'number', default: 1201 }
        ]
    },
    supG: {
        title: '💸 Изоляция и дополнительные услуги',
        fields: [
            { id: 'sup_G43_nutM24DIN6330Price', label: 'G43 - цена выс. гайки М24 DIN6330...', type: 'number', default: 2043 },
            { id: 'sup_G44_nutM24DIN933Price', label: 'G44 - цена гайки М24 DIN933, шт.,...', type: 'number', default: 2044 },
            { id: 'sup_G45_nutM20M16DIN933Price', label: 'G45 - цена гайки М20/М16 DIN933, ...', type: 'number', default: 2045 },
            { id: 'sup_H54_spareFlangeFlange1Price', label: 'H54 - ЗИП, Фланцевый крепеж, Флан...', type: 'number', default: 2054 },
            { id: 'sup_H55_spareFlangeFlange2Price', label: 'H55 - ЗИП, Фланцевый крепеж, Флан...', type: 'number', default: 2055 },
            { id: 'sup_H56_spareFlangeFlange3Price', label: 'H56 - ЗИП, Фланцевый крепеж, Флан...', type: 'number', default: 2056 },
            { id: 'sup_H57_spareFlangeFlange4Price', label: 'H57 - ЗИП, Фланцевый крепеж, Флан...', type: 'number', default: 2057 }
        ]
    },
    supI: {
        title: '📈 Коэффициенты и множители',
        fields: [
            { id: 'sup_I28_panelBFlange3Pressure', label: 'I28 - Панель Б, Фланец №3, давлен...', type: 'number', default: 2028 },
            { id: 'sup_I29_panelBFlange4Pressure', label: 'I29 - Панель Б, Фланец №4, давлен...', type: 'number', default: 2029 },
            { id: 'sup_I38_eyeboltKitMaterialCost', label: 'I38 - ПРОУШИНЫ, комплект, стоимос...', type: 'number', default: 2038 },
            { id: 'sup_I39_eyeboltKitProcessingCost', label: 'I39 - ПРОУШИНЫ, комплект, стоимос...', type: 'number', default: 2039 },
            { id: 'sup_I44_otherMaterialsDesc1', label: 'I44 - ДРУГИЕ МАТЕРИАЛЫ (не ЗИП), ...', type: 'number', default: 2044 },
            { id: 'sup_I45_otherMaterialsDesc2', label: 'I45 - ДРУГИЕ МАТЕРИАЛЫ (не ЗИП), ...', type: 'number', default: 2045 },
            { id: 'sup_I46_otherMaterialsDesc3', label: 'I46 - ДРУГИЕ МАТЕРИАЛЫ (не ЗИП), ...', type: 'number', default: 2046 },
            { id: 'sup_I50_sparePanelStudQuantity', label: 'I50 - ЗИП, Крепеж панелей, шпильк...', type: 'number', default: 2050 },
            { id: 'sup_I51_sparePanelNutQuantity', label: 'I51 - ЗИП, Крепеж панелей, гайка,...', type: 'number', default: 2051 },
            { id: 'sup_I52_sparePanelWasherQuantity', label: 'I52 - ЗИП, Крепеж панелей, шайба,...', type: 'number', default: 2052 },
            { id: 'sup_I54_flangeFastenersFlange1Quantity', label: 'I54 - Фланцевый крепеж, количеств...', type: 'number', default: 2054 },
            { id: 'sup_I55_flangeFastenersFlange2Quantity', label: 'I55 - Фланцевый крепеж, количеств...', type: 'number', default: 2055 },
            { id: 'sup_I56_flangeFastenersFlange3Quantity', label: 'I56 - Фланцевый крепеж, количеств...', type: 'number', default: 2056 },
            { id: 'sup_I57_flangeFastenersFlange4Quantity', label: 'I57 - Фланцевый крепеж, количеств...', type: 'number', default: 2057 }
        ]
    },
    supJK: {
        title: '📉 Нормативы и весовые показатели',
        fields: [
            { id: 'sup_J28_panelBFlange3Diameter', label: 'J28 - Панель Б, Ду, Фланец №3', type: 'number', default: 3028 },
            { id: 'sup_J29_panelBFlange4Diameter', label: 'J29 - Панель Б, Ду, Фланец №4', type: 'number', default: 3029 },
            { id: 'sup_K19_columnRolledThickness', label: 'K19 - Толщина проката Колонна, м', type: 'number', default: 3019 },
            { id: 'sup_K20_columnCuttingPrice', label: 'K20 - Цена раскроя (Колонна), руб.', type: 'number', default: 3020 },
            { id: 'sup_K21_columnProcessingCost', label: 'K21 - Стоимость обработки 1 шт Ко...', type: 'number', default: 3021 },
            { id: 'sup_K25_panelBRolledThickness', label: 'K25 - Панель Б, Толщина проката , м', type: 'number', default: 3025 },
            { id: 'sup_K26_panelBCuttingPrice', label: 'K26 - Панель Б, Цена раскроя, руб.', type: 'number', default: 3026 },
            { id: 'sup_K27_panelBProcessingCost', label: 'K27 - Панель Б, Стоимость обработ...', type: 'number', default: 3027 },
            { id: 'sup_K38_supportsKitMaterialCost', label: 'K38 - ЛАПЫ, комплект, стоимость м...', type: 'number', default: 3038 },
            { id: 'sup_K39_supportsKitProcessingCost', label: 'K39 - ЛАПЫ, комплект, стоимость о...', type: 'number', default: 3039 }
        ]
    },
    supL: {
        title: '📦 Типы соединений и фитингов',
        fields: [
            { id: 'sup_L28_panelBFlange3Price', label: 'L28 - Панель Б, Цена за шт., Флан...', type: 'number', default: 4028 },
            { id: 'sup_L29_panelBFlange4Price', label: 'L29 - Панель Б, Цена за шт., Флан...', type: 'number', default: 4029 },
            { id: 'sup_L30_panelBPipeBilletFlange3Price', label: 'L30 - Панель Б, Цена заготовки тр...', type: 'number', default: 4030 },
            { id: 'sup_L31_panelBPipeBilletFlange4Price', label: 'L31 - Панель Б, Цена заготовки тр...', type: 'number', default: 4031 },
            { id: 'sup_L32_panelBDrainageNozzlePrice', label: 'L32 - Панель Б, Цена на патрубок ...', type: 'number', default: 4032 },
            { id: 'sup_L33_panelBVentilationNozzlePrice', label: 'L33 - Панель Б, Цена на патрубок(...', type: 'number', default: 4033 }
        ]
    },
    supM: {
        title: '💰 Материальные затраты',
        fields: [
            { id: 'sup_M38_bracesKitMaterialCost', label: 'M38 - РАСКОСЫ, комплект, стоимост...', type: 'number', default: 5038 },
            { id: 'sup_M39_bracesKitProcessingCost', label: 'M39 - РАСКОСЫ, комплект, стоимост...', type: 'number', default: 5039 },
            { id: 'sup_M44_otherMaterialsCost1', label: 'M44 - Стоимость указанного компле...', type: 'number', default: 5044 },
            { id: 'sup_M45_otherMaterialsCost2', label: 'M45 - Стоимость указанного компле...', type: 'number', default: 5045 },
            { id: 'sup_M46_otherMaterialsCost3', label: 'M46 - Стоимость указанного компле...', type: 'number', default: 5046 },
            { id: 'sup_M51_spareAnchorBoltsCost', label: 'M51 - ЗИП, крепёж к фундаменту, а...', type: 'number', default: 5051 },
            { id: 'sup_M52_spareOtherCost', label: 'M52 - ЗИП, ДРУГОЕ, стоимость, шт....', type: 'number', default: 5052 }
        ]
    },
    supN: {
        title: '📊 Сводные показатели',
        fields: [
            { id: 'sup_N50_sparePanelGasketsQuantity', label: 'N50 - ЗИП, Прокладки панелей, кол-во', type: 'number', default: 6050 },
            { id: 'sup_N51_spareAnchorBoltsQuantity', label: 'N51 - ЗИП, крепёж к фундаменту, а...', type: 'number', default: 6051 },
            { id: 'sup_N52_spareOtherQuantity', label: 'N52 - ЗИП, ДРУГОЕ, кол-во', type: 'number', default: 6052 },
            { id: 'sup_N54_spareFlangeGasketsFlange1Quantity', label: 'N54 - ЗИП, Фланцевые прокладки, Ф...', type: 'number', default: 6054 },
            { id: 'sup_N55_spareFlangeGasketsFlange2Quantity', label: 'N55 - ЗИП, Фланцевые прокладки, Ф...', type: 'number', default: 6055 },
            { id: 'sup_N56_spareFlangeGasketsFlange3Quantity', label: 'N56 - ЗИП, Фланцевые прокладки, Ф...', type: 'number', default: 6056 },
            { id: 'sup_N57_spareFlangeGasketsFlange4Quantity', label: 'N57 - ЗИП, Фланцевые прокладки, Ф...', type: 'number', default: 6057 }
        ]
    },
    supP: {
        title: '💵 Крепежные элементы',
        fields: [
            { id: 'sup_P19_panelFastenersQuantity', label: 'P19 - КРЕПЕЖ ПАНЕЛЕЙ, кол-во', type: 'number', default: 7019 },
            { id: 'sup_P20_panelFastenersMaterial', label: 'P20 - КРЕПЕЖ ПАНЕЛЕЙ, материал, с...', type: 'number', default: 7020 },
            { id: 'sup_P21_panelFastenersCoating', label: 'P21 - КРЕПЕЖ ПАНЕЛЕЙ, покрытие, с...', type: 'number', default: 7021 },
            { id: 'sup_P22_panelFastenersStudSize', label: 'P22 - КРЕПЕЖ ПАНЕЛЕЙ, размер шпил...', type: 'number', default: 7022 },
            { id: 'sup_P29_cofFastenersFlange1Size', label: 'P29 - КОФ, размер крепежа, Фланец...', type: 'number', default: 7029 },
            { id: 'sup_P33_cofFastenersFlange2Size', label: 'P33 - КОФ, размер крепежа, Фланец...', type: 'number', default: 7033 },
            { id: 'sup_P37_cofFastenersFlange3Size', label: 'P37 - КОФ, размер крепежа, Фланец...', type: 'number', default: 7037 },
            { id: 'sup_P41_cofFastenersFlange4Size', label: 'P41 - КОФ, размер крепежа, Фланец...', type: 'number', default: 7041 },
            { id: 'sup_P45_unaccountedCost', label: 'P45 - Неучтенка, стоимость, руб.', type: 'number', default: 7045 }
        ]
    },
    supQ: {
        title: '📈 Покрытия и обработка',
        fields: [
            { id: 'sup_Q22_panelFastenersStudCost', label: 'Q22 - КРЕПЕЖ ПАНЕЛЕЙ, стоимость ш...', type: 'number', default: 8022 },
            { id: 'sup_Q23_panelFastenersNutCost', label: 'Q23 - КРЕПЕЖ ПАНЕЛЕЙ, стоимость г...', type: 'number', default: 8023 },
            { id: 'sup_Q24_panelFastenersWasherCost', label: 'Q24 - КРЕПЕЖ ПАНЕЛЕЙ, стоимость ш...', type: 'number', default: 8024 },
            { id: 'sup_Q29_cofFastenersFlange1Material', label: 'Q29 - КОФ, материал крепежа, Флан...', type: 'number', default: 8029 },
            { id: 'sup_Q33_cofFastenersFlange2Material', label: 'Q33 - КОФ, материал крепежа, Флан...', type: 'number', default: 8033 },
            { id: 'sup_Q37_cofFastenersFlange3Material', label: 'Q37 - КОФ, материал крепежа, Флан...', type: 'number', default: 8037 },
            { id: 'sup_Q41_cofFastenersFlange4Material', label: 'Q41 - КОФ, материал крепежа, Флан...', type: 'number', default: 8041 }
        ]
    },
    supR: {
        title: '💸 Цены на обработку',
        fields: [
            { id: 'sup_R29_cofFastenersFlange1Coating', label: 'R29 - КОФ, мат. покрытие крепежа,...', type: 'number', default: 9029 },
            { id: 'sup_R33_cofFastenersFlange2Coating', label: 'R33 - КОФ, мат. покрытие крепежа,...', type: 'number', default: 9033 },
            { id: 'sup_R37_cofFastenersFlange3Coating', label: 'R37 - КОФ, мат. покрытие крепежа,...', type: 'number', default: 9037 },
            { id: 'sup_R41_cofFastenersFlange4Coating', label: 'R41 - КОФ, мат. покрытие крепежа,...', type: 'number', default: 9041 }
        ]
    },
    supT: {
        title: '💰 Итоговые расчеты',
        fields: [
            { id: 'sup_T29_cofFastenersFlange1KitPrice', label: 'T29 - КОФ, крепежа, Фланец №1, це...', type: 'number', default: 10029 },
            { id: 'sup_T30_cofGasketFlange1Price', label: 'T30 - КОФ, Прокладка, Фланец №1, ...', type: 'number', default: 10030 },
            { id: 'sup_T31_cofObturatorFlange1Price', label: 'T31 - КОФ, Обтюратор, Фланец №1, ...', type: 'number', default: 10031 },
            { id: 'sup_T33_cofFastenersFlange2KitPrice', label: 'T33 - КОФ, крепежа, Фланец №2, це...', type: 'number', default: 10033 },
            { id: 'sup_T34_cofGasketFlange2Price', label: 'T34 - КОФ, Прокладка, Фланец №2, ...', type: 'number', default: 10034 },
            { id: 'sup_T35_cofObturatorFlange2Price', label: 'T35 - КОФ, Обтюратор, Фланец №2, ...', type: 'number', default: 10035 },
            { id: 'sup_T37_cofFastenersFlange3KitPrice', label: 'T37 - КОФ, крепежа, Фланец №3, це...', type: 'number', default: 10037 },
            { id: 'sup_T38_cofGasketFlange3Price', label: 'T38 - КОФ, Прокладка, Фланец №3, ...', type: 'number', default: 10038 },
            { id: 'sup_T39_cofObturatorFlange3Price', label: 'T39 - КОФ, Обтюратор, Фланец №3, ...', type: 'number', default: 10039 },
            { id: 'sup_T41_cofFastenersFlange4KitPrice', label: 'T41 - КОФ, крепежа, Фланец №4, це...', type: 'number', default: 10041 },
            { id: 'sup_T42_cofGasketFlange4Price', label: 'T42 - КОФ, Прокладка, Фланец №4, ...', type: 'number', default: 10042 },
            { id: 'sup_T43_cofObturatorFlange4Price', label: 'T43 - КОФ, Обтюратор, Фланец №4, ...', type: 'number', default: 10043 }
        ]
    },
    flange: {
        title: '🔩 Параметры фланцевых соединений',
        fields: [
            { id: 'sup_C28_panelAFlange1Pressure', label: 'C28 - Панель А, Фланец №1, давлен...', type: 'select',
              options: ['Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160'], default: 'Ру10' },
            { id: 'sup_C29_panelAFlange2Pressure', label: 'C29 - Панель А, Фланец №2, давлен...', type: 'select',
              options: ['Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160'], default: 'Ру40' },
            { id: 'sup_D28_panelAFlange1Diameter', label: 'D28 - Панель А, Ду, Фланец №1', type: 'select',
              options: ['Ду25','Ду32','Ду40','Ду50','Ду65','Ду80','Ду100','Ду125','Ду150','Ду200','Ду250','Ду300','Ду350','Ду400','Ду450','Ду500','Ду600','Ду800','Ду1000'],
              default: 'Ду600' },
            { id: 'sup_D29_panelAFlange2Diameter', label: 'D29 - Панель А, Ду, Фланец №2', type: 'select',
              options: ['Ду25','Ду32','Ду40','Ду50','Ду65','Ду80','Ду100','Ду125','Ду150','Ду200','Ду250','Ду300','Ду350','Ду400','Ду450','Ду500','Ду600','Ду800','Ду1000'],
              default: 'Ду600' }
        ]
    }
};

// No more programmatic generation - all fields defined explicitly above

// Dashboard cards configuration
const DASHBOARD_CARDS = [
    { id: 'health', title: '🟢 Состояние системы', metrics: 'healthMetrics' },
    { id: 'system', title: '📊 Метрики системы', metrics: 'systemMetrics' },
    { id: 'admin', title: '🔧 Инструменты администратора', content: `
        <a href="/template-upload.html" style="display:block;padding:12px 20px;background:#667eea;color:white;text-decoration:none;border-radius:8px;font-weight:600;text-align:center;">
            📋 Управление шаблонами →
        </a>
        <p style="font-size:12px;color:#718096;margin:8px 0 0;">Загружайте, скачивайте и управляйте Excel шаблонами для расчетов</p>
    `},
    { id: 'files', title: '📁 Последние файлы', metrics: 'recentFiles' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    renderForm();
    startMetricsUpdate();
});

function renderDashboard() {
    const container = document.getElementById('dashboardCards');
    container.innerHTML = DASHBOARD_CARDS.map(card => `
        <div class="card">
            <h2>${card.title}</h2>
            ${card.content || `<div id="${card.metrics}"><div class="metric"><span class="metric-label">Загрузка...</span></div></div>`}
        </div>
    `).join('');
}

function renderForm() {
    const container = document.getElementById('formSections');
    container.innerHTML = Object.entries(FIELD_CONFIG).map(([key, section]) => `
        <div class="form-section">
            <h3>${section.title}</h3>
            <div class="form-grid">
                ${section.fields.map(field => renderField(field)).join('')}
            </div>
        </div>
    `).join('');
}

function renderField(field) {
    if (field.type === 'select') {
        return `
            <div class="form-group">
                <label title="${field.id}">${field.label}</label>
                <select id="${field.id}">
                    ${field.options.map(opt => 
                        `<option value="${opt}" ${opt === field.default ? 'selected' : ''}>${opt}</option>`
                    ).join('')}
                </select>
            </div>
        `;
    }
    return `
        <div class="form-group">
            <label title="${field.id}">${field.label}</label>
            <input type="${field.type}" id="${field.id}" value="${field.default || ''}">
        </div>
    `;
}

// API functions
async function updateMetrics() {
    try {
        const [health, metrics, files] = await Promise.all([
            fetch('/health').then(r => r.json()),
            fetch('/api/metrics').then(r => r.json()),
            fetch('/api/excel-files').then(r => r.json())
        ]);
        
        updateHealthMetrics(health);
        updateSystemMetrics(metrics);
        updateRecentFiles(files);
        updateFileList(files.files);
    } catch (error) {
        console.error('Failed to update metrics:', error);
    }
}

function updateHealthMetrics(data) {
    document.getElementById('healthMetrics').innerHTML = `
        <div class="metric"><span class="metric-label">Статус</span><span class="metric-value">${data.status}</span></div>
        <div class="metric"><span class="metric-label">Версия</span><span class="metric-value">${data.version}</span></div>
        <div class="metric"><span class="metric-label">Время работы</span><span class="metric-value">${formatUptime(data.uptime)}</span></div>
    `;
}

function updateSystemMetrics(data) {
    document.getElementById('systemMetrics').innerHTML = `
        <div class="metric"><span class="metric-label">Активные рабочие процессы</span><span class="metric-value">${data.queue.activeWorkers}/${data.queue.totalWorkers}</span></div>
        <div class="metric"><span class="metric-label">Размер очереди</span><span class="metric-value">${data.queue.queuedRequests}</span></div>
        <div class="metric"><span class="metric-label">Ср. время ответа</span><span class="metric-value">${data.requests.averageResponseTime}ms</span></div>
        <div class="metric"><span class="metric-label">Успешность</span><span class="metric-value">${data.requests.successRate}%</span></div>
    `;
}

function updateRecentFiles(data) {
    document.getElementById('recentFiles').innerHTML = `
        <div class="metric"><span class="metric-label">Всего файлов</span><span class="metric-value">${data.count}</span></div>
        <div class="metric"><span class="metric-label">Последний</span><span class="metric-value">${data.count > 0 ? new Date(data.files[0].created).toLocaleTimeString() : 'Отсутствует'}</span></div>
    `;
}

function updateFileList(files) {
    const fileList = document.getElementById('fileList');
    if (!files || files.length === 0) {
        fileList.innerHTML = '<div style="padding:20px;text-align:center;color:#718096;">Файлы еще не сгенерированы</div>';
        return;
    }
    
    fileList.innerHTML = files.slice(0, 10).map(file => `
        <div class="file-item">
            <div class="file-info">
                <div class="file-name" title="${file.name}">${file.name}</div>
                <div class="file-meta">${new Date(file.created).toLocaleString()} • ${formatFileSize(file.size)}</div>
            </div>
            <div class="file-actions">
                <a href="${file.downloadUrl}" class="download-btn" download>Скачать</a>
            </div>
        </div>
    `).join('');
}

async function calculateCost() {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const responseArea = document.getElementById('responseArea');
    const downloadSection = document.getElementById('downloadSection');
    const progressFill = document.getElementById('progressFill');
    
    loading.classList.add('active');
    errorMessage.classList.remove('active');
    downloadSection.classList.remove('active');
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress = Math.min(progress + 5, 90);
        progressFill.style.width = progress + '%';
    }, 200);
    
    try {
        const requestData = {};
        // Collect all field values
        Object.values(FIELD_CONFIG).forEach(section => {
            section.fields.forEach(field => {
                const el = document.getElementById(field.id);
                if (el) {
                    const value = el.value;
                    requestData[field.id] = field.type === 'number' ? (parseInt(value) || null) : value;
                }
            });
        });
        
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        const data = await response.json();
        
        clearInterval(progressInterval);
        progressFill.style.width = '100%';
        
        setTimeout(() => {
            loading.classList.remove('active');
            
            if (data.success) {
                responseArea.textContent = formatResponse(data);
                if (data.downloadUrl) {
                    document.getElementById('downloadLink').href = data.downloadUrl;
                    downloadSection.classList.add('active');
                }
            } else {
                responseArea.textContent = JSON.stringify(data, null, 2);
                errorMessage.textContent = data.error?.message || 'Calculation failed';
                errorMessage.classList.add('active');
            }
            updateMetrics();
        }, 500);
    } catch (error) {
        clearInterval(progressInterval);
        loading.classList.remove('active');
        errorMessage.textContent = 'Failed to connect to API: ' + error.message;
        errorMessage.classList.add('active');
    }
}

function formatResponse(data) {
    const fmt = n => n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    return `✅ РАСЧЕТ УСПЕШНО ВЫПОЛНЕН

Общая стоимость: ${fmt(data.results.total_cost)}

Состав по компонентам:
  • Материалы: ${fmt(data.results.component_costs.materials)}
  • Обработка: ${fmt(data.results.component_costs.processing)}
  • Оборудование: ${fmt(data.results.component_costs.hardware)}
  • Прочее: ${fmt(data.results.component_costs.other)}

Время обработки: ${data.processing_time_ms}ms
ID запроса: ${data.request_id}

Полный ответ:
${JSON.stringify(data, null, 2)}`;
}

function fillRealisticValues() {
    Object.values(FIELD_CONFIG).forEach(section => {
        section.fields.forEach(field => {
            const el = document.getElementById(field.id);
            if (el && field.default !== undefined) {
                el.value = field.default;
            }
        });
    });
}

function clearForm() {
    document.querySelectorAll('input, select').forEach(el => {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
    });
    document.getElementById('responseArea').textContent = 'Форма очищена. Введите новые значения...';
    document.getElementById('downloadSection').classList.remove('active');
}

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function startMetricsUpdate() {
    updateMetrics();
    setInterval(updateMetrics, 5000);
}