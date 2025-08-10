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
            { id: 'tech_D27_type', label: 'D27', type: 'number', default: 1001 },
            { id: 'tech_E27_weightType', label: 'E27', type: 'text', default: 'Е-113' },
            { id: 'tech_F27_quantityType', label: 'F27', type: 'select', 
              options: ['Целый ТА', 'ШОТ-БЛОК', 'РЕИНЖ'], default: 'Целый ТА' },
            { id: 'tech_G27_quantityType', label: 'G27', type: 'text', default: 'К4-750' },
            { id: 'tech_H27_quantityType', label: 'H27', type: 'text', default: '1/6' },
            { id: 'tech_I27_quantityType', label: 'I27', type: 'number', default: 401 },
            { id: 'tech_J27_quantityType', label: 'J27', type: 'number', default: 22 },
            { id: 'tech_K27_quantity', label: 'K27', type: 'number', default: 23 },
            { id: 'tech_L27_quantity', label: 'L27', type: 'number', default: 101 },
            { id: 'tech_M27_material', label: 'M27', type: 'number', default: 102 },
            { id: 'tech_P27_materialType', label: 'P27', type: 'select',
              options: ['AISI 316L', 'SMO 254', 'Hast-C276', 'Titanium', 'AISI 304', 'AISI316Ti', '904L'], 
              default: 'AISI 316L' },
            { id: 'tech_R27_materialThicknessType', label: 'R27', type: 'select',
              options: ['ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti'],
              default: '09Г2С' },
            { id: 'tech_S27_materialThicknessType', label: 'S27', type: 'select',
              options: ['гофра', 'дв. лунка', 'од. лунка', 'шпилька', 'шпилька-лунка'], default: 'гофра' },
            { id: 'tech_T27_materialThicknessType', label: 'T27', type: 'number', default: 5 },
            { id: 'tech_U27_materialThicknessType', label: 'U27', type: 'select',
              options: ['0.8', '1', '1.2', '1.5', '2', '3', '5'], default: '1' },
            { id: 'tech_V27_thicknessType', label: 'V27', type: 'select',
              options: ['0.8', '1', '1.2', '1.5', '2', '3', '5'], default: '3' }
        ]
    },
    supMain: {
        title: '💰 Базовые цены и материалы',
        fields: [
            { id: 'sup_D8_priceMaterial', label: 'D8', type: 'number', default: 701 },
            { id: 'sup_E8_priceMaterial', label: 'E8', type: 'number', default: 702 },
            { id: 'sup_D9_priceMaterial', label: 'D9', type: 'select',
              options: ['ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti'],
              default: '09Г2С' },
            { id: 'sup_D10_priceCostMaterial', label: 'D10', type: 'number', default: 1010 },
            { id: 'sup_D11_priceCostMaterial', label: 'D11', type: 'number', default: 1011 },
            { id: 'sup_K13_costQuantityNormTotal', label: 'K13', type: 'number', default: 1 },
            { id: 'sup_P13_costQuantityMaterialNorm', label: 'P13', type: 'number', default: 120013 },
            { id: 'sup_D17_priceWeightThickness', label: 'D17', type: 'number', default: 1017 },
            { id: 'sup_D78_massThickness', label: 'D78', type: 'number', default: 3 }
        ]
    },
    supE: {
        title: '📦 Весовые характеристики компонентов',
        fields: [
            { id: 'sup_E19_priceWeightThicknessTotal', label: 'E19', type: 'number', default: 1019 },
            { id: 'sup_E20_priceWeightThicknessTotal', label: 'E20', type: 'number', default: 1020 },
            { id: 'sup_E21_priceWeightThicknessTotal', label: 'E21', type: 'number', default: 1021 },
            { id: 'sup_E25_priceWeightThicknessTotal', label: 'E25', type: 'number', default: 1025 },
            { id: 'sup_E26_priceWeightThickness', label: 'E26', type: 'number', default: 1026 },
            { id: 'sup_E27_priceWeightThickness', label: 'E27', type: 'number', default: 1027 },
            { id: 'sup_E101_priceMassPipeTotal', label: 'E101', type: 'number', default: 1101 },
            { id: 'sup_E105_priceMassPipeTotal', label: 'E105', type: 'number', default: 1105 }
        ]
    },
    supF: {
        title: '📊 Стоимость трубопроводной обвязки',
        fields: [
            { id: 'sup_F28_priceWeightThicknessTotal', label: 'F28', type: 'number', default: 1028 },
            { id: 'sup_F29_priceWeightPipeTotal', label: 'F29', type: 'number', default: 1029 },
            { id: 'sup_F30_priceWeightPipeTotal', label: 'F30', type: 'number', default: 1030 },
            { id: 'sup_F31_priceWeightPipeTotal', label: 'F31', type: 'number', default: 1031 },
            { id: 'sup_F32_priceWeightPipeTotal', label: 'F32', type: 'number', default: 1032 },
            { id: 'sup_F33_priceWeightPipeTotal', label: 'F33', type: 'number', default: 1033 },
            { id: 'sup_F39_priceQuantityWeightMaterialInsulationTotal', label: 'F39', type: 'number', default: 2 }
        ]
    },
    supD_prices: {
        title: '💵 Дополнительные расходы',
        fields: [
            { id: 'sup_D38_priceQuantityTotal', label: 'D38', type: 'number', default: 1038 },
            { id: 'sup_D43_priceTotal', label: 'D43', type: 'number', default: 3301 },
            { id: 'sup_D44_price', label: 'D44', type: 'number', default: 1751 },
            { id: 'sup_D45_price', label: 'D45', type: 'number', default: 2801 },
            { id: 'sup_D46_price', label: 'D46', type: 'number', default: 1201 }
        ]
    },
    supG: {
        title: '💸 Изоляция и дополнительные услуги',
        fields: [
            { id: 'sup_G43_priceMaterialInsulationTotal', label: 'G43', type: 'number', default: 2043 },
            { id: 'sup_G44_priceMaterialInsulation', label: 'G44', type: 'number', default: 2044 },
            { id: 'sup_G45_priceMaterialInsulation', label: 'G45', type: 'number', default: 2045 },
            { id: 'sup_H54_priceTotal', label: 'H54', type: 'number', default: 2054 },
            { id: 'sup_H55_priceTotal', label: 'H55', type: 'number', default: 2055 },
            { id: 'sup_H56_priceTotal', label: 'H56', type: 'number', default: 2056 },
            { id: 'sup_H57_priceTotal', label: 'H57', type: 'number', default: 2057 }
        ]
    },
    supI: {
        title: '📈 Коэффициенты и множители',
        fields: [
            { id: 'sup_I28_priceWeightThicknessType', label: 'I28', type: 'number', default: 2028 },
            { id: 'sup_I29_priceWeightPipeThicknessType', label: 'I29', type: 'number', default: 2029 },
            { id: 'sup_I38_priceThicknessTotalType', label: 'I38', type: 'number', default: 2038 },
            { id: 'sup_I39_priceQuantityMaterialThicknessInsulationTotalType', label: 'I39', type: 'number', default: 2039 },
            { id: 'sup_I44_priceMaterialThicknessInsulationTotalType', label: 'I44', type: 'number', default: 2044 },
            { id: 'sup_I45_priceMaterialThicknessInsulationTotalType', label: 'I45', type: 'number', default: 2045 },
            { id: 'sup_I46_priceQuantityMaterialThicknessInsulationTotalSumType', label: 'I46', type: 'number', default: 2046 },
            { id: 'sup_I50_priceQuantityMaterialThicknessInsulationTotalSumType', label: 'I50', type: 'number', default: 2050 },
            { id: 'sup_I51_priceQuantityMaterialThicknessInsulationTotalSumType', label: 'I51', type: 'number', default: 2051 },
            { id: 'sup_I52_priceQuantityMaterialThicknessInsulationTotalSumType', label: 'I52', type: 'number', default: 2052 },
            { id: 'sup_I54_priceQuantityMaterialThicknessInsulationTotalType', label: 'I54', type: 'number', default: 2054 },
            { id: 'sup_I55_priceQuantityMaterialThicknessInsulationTotalType', label: 'I55', type: 'number', default: 2055 },
            { id: 'sup_I56_priceQuantityMaterialThicknessInsulationTotalType', label: 'I56', type: 'number', default: 2056 },
            { id: 'sup_I57_priceQuantityMaterialThicknessInsulationTotalType', label: 'I57', type: 'number', default: 2057 }
        ]
    },
    supJK: {
        title: '📉 Нормативы и весовые показатели',
        fields: [
            { id: 'sup_J28_priceQuantityWeightThicknessNormTotal', label: 'J28', type: 'number', default: 3028 },
            { id: 'sup_J29_priceQuantityWeightPipeNormTotal', label: 'J29', type: 'number', default: 3029 },
            { id: 'sup_K19_priceWeightThicknessTotal', label: 'K19', type: 'number', default: 3019 },
            { id: 'sup_K20_priceWeightThicknessTotal', label: 'K20', type: 'number', default: 3020 },
            { id: 'sup_K21_priceWeightThicknessTotal', label: 'K21', type: 'number', default: 3021 },
            { id: 'sup_K25_priceWeightThicknessTotal', label: 'K25', type: 'number', default: 3025 },
            { id: 'sup_K26_priceWeightThickness', label: 'K26', type: 'number', default: 3026 },
            { id: 'sup_K27_priceWeightThickness', label: 'K27', type: 'number', default: 3027 },
            { id: 'sup_K38_pricePipeTotal', label: 'K38', type: 'number', default: 3038 },
            { id: 'sup_K39_priceQuantityMaterialPipeInsulationTotal', label: 'K39', type: 'number', default: 3039 }
        ]
    },
    supL: {
        title: '📦 Типы соединений и фитингов',
        fields: [
            { id: 'sup_L28_priceWeightThicknessTotalType', label: 'L28', type: 'number', default: 4028 },
            { id: 'sup_L29_priceWeightPipeTotalType', label: 'L29', type: 'number', default: 4029 },
            { id: 'sup_L30_priceWeightPipeTotalType', label: 'L30', type: 'number', default: 4030 },
            { id: 'sup_L31_priceWeightPipeTotalType', label: 'L31', type: 'number', default: 4031 },
            { id: 'sup_L32_priceWeightPipeTotalType', label: 'L32', type: 'number', default: 4032 },
            { id: 'sup_L33_priceWeightPipeTotalType', label: 'L33', type: 'number', default: 4033 }
        ]
    },
    supM: {
        title: '💰 Материальные затраты',
        fields: [
            { id: 'sup_M38_priceMaterialTotal', label: 'M38', type: 'number', default: 5038 },
            { id: 'sup_M39_quantityMaterialTotal', label: 'M39', type: 'number', default: 5039 },
            { id: 'sup_M44_priceMaterial', label: 'M44', type: 'number', default: 5044 },
            { id: 'sup_M45_priceMaterial', label: 'M45', type: 'number', default: 5045 },
            { id: 'sup_M46_priceQuantityMaterialSum', label: 'M46', type: 'number', default: 5046 },
            { id: 'sup_M51_priceQuantityMaterialTotalSum', label: 'M51', type: 'number', default: 5051 },
            { id: 'sup_M52_priceQuantityMaterialTotalSum', label: 'M52', type: 'number', default: 5052 }
        ]
    },
    supN: {
        title: '📊 Сводные показатели',
        fields: [
            { id: 'sup_N50_priceQuantityWeightThicknessTotalSum', label: 'N50', type: 'number', default: 6050 },
            { id: 'sup_N51_priceQuantityWeightThicknessTotalSum', label: 'N51', type: 'number', default: 6051 },
            { id: 'sup_N52_priceQuantityWeightThicknessTotalSum', label: 'N52', type: 'number', default: 6052 },
            { id: 'sup_N54_quantityWeightThicknessTotal', label: 'N54', type: 'number', default: 6054 },
            { id: 'sup_N55_quantityWeightThicknessTotal', label: 'N55', type: 'number', default: 6055 },
            { id: 'sup_N56_quantityWeightThicknessTotal', label: 'N56', type: 'number', default: 6056 },
            { id: 'sup_N57_quantityWeightThicknessTotal', label: 'N57', type: 'number', default: 6057 }
        ]
    },
    supP: {
        title: '💵 Крепежные элементы',
        fields: [
            { id: 'sup_P19_priceQuantityMaterialThickness', label: 'P19', type: 'number', default: 7019 },
            { id: 'sup_P20_priceQuantityWeightMaterial', label: 'P20', type: 'number', default: 7020 },
            { id: 'sup_P21_priceQuantityMaterial', label: 'P21', type: 'number', default: 7021 },
            { id: 'sup_P22_priceQuantityMaterialTotal', label: 'P22', type: 'number', default: 7022 },
            { id: 'sup_P29_priceMaterialTotal', label: 'P29', type: 'number', default: 7029 },
            { id: 'sup_P33_priceMaterialPipeTotal', label: 'P33', type: 'number', default: 7033 },
            { id: 'sup_P37_priceMaterialTotal', label: 'P37', type: 'number', default: 7037 },
            { id: 'sup_P41_priceMaterialTotal', label: 'P41', type: 'number', default: 7041 },
            { id: 'sup_P45_priceMaterialTotal', label: 'P45', type: 'number', default: 7045 }
        ]
    },
    supQ: {
        title: '📈 Покрытия и обработка',
        fields: [
            { id: 'sup_Q22_priceQuantityMaterialThicknessTotal', label: 'Q22', type: 'number', default: 8022 },
            { id: 'sup_Q23_priceMaterialThicknessTotal', label: 'Q23', type: 'number', default: 8023 },
            { id: 'sup_Q24_priceThicknessTotal', label: 'Q24', type: 'number', default: 8024 },
            { id: 'sup_Q29_priceThickness', label: 'Q29', type: 'number', default: 8029 },
            { id: 'sup_Q33_pricePipeThickness', label: 'Q33', type: 'number', default: 8033 },
            { id: 'sup_Q37_priceThickness', label: 'Q37', type: 'number', default: 8037 },
            { id: 'sup_Q41_priceThicknessTotal', label: 'Q41', type: 'number', default: 8041 }
        ]
    },
    supR: {
        title: '💸 Цены на обработку',
        fields: [
            { id: 'sup_R29_price', label: 'R29', type: 'number', default: 9029 },
            { id: 'sup_R33_pricePipe', label: 'R33', type: 'number', default: 9033 },
            { id: 'sup_R37_price', label: 'R37', type: 'number', default: 9037 },
            { id: 'sup_R41_priceTotal', label: 'R41', type: 'number', default: 9041 }
        ]
    },
    supT: {
        title: '💰 Итоговые расчеты',
        fields: [
            { id: 'sup_T29_priceMaterial', label: 'T29', type: 'number', default: 10029 },
            { id: 'sup_T30_priceMaterial', label: 'T30', type: 'number', default: 10030 },
            { id: 'sup_T31_priceMaterial', label: 'T31', type: 'number', default: 10031 },
            { id: 'sup_T33_priceMaterialPipe', label: 'T33', type: 'number', default: 10033 },
            { id: 'sup_T34_priceMaterialTotal', label: 'T34', type: 'number', default: 10034 },
            { id: 'sup_T35_priceMaterialTotal', label: 'T35', type: 'number', default: 10035 },
            { id: 'sup_T37_price', label: 'T37', type: 'number', default: 10037 },
            { id: 'sup_T38_price', label: 'T38', type: 'number', default: 10038 },
            { id: 'sup_T39_priceQuantity', label: 'T39', type: 'number', default: 10039 },
            { id: 'sup_T41_priceTotal', label: 'T41', type: 'number', default: 10041 },
            { id: 'sup_T42_priceMaterialInsulationTotal', label: 'T42', type: 'number', default: 10042 },
            { id: 'sup_T43_priceTotal', label: 'T43', type: 'number', default: 10043 }
        ]
    },
    flange: {
        title: '🔩 Параметры фланцевых соединений',
        fields: [
            { id: 'sup_C28_priceWeightThickness', label: 'C28', type: 'select',
              options: ['Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160'], default: 'Ру10' },
            { id: 'sup_C29_priceWeightPipeThickness', label: 'C29', type: 'select',
              options: ['Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160'], default: 'Ру40' },
            { id: 'sup_D28_priceWeightThickness', label: 'D28', type: 'select',
              options: ['Ду25','Ду32','Ду40','Ду50','Ду65','Ду80','Ду100','Ду125','Ду150','Ду200','Ду250','Ду300','Ду350','Ду400','Ду450','Ду500','Ду600','Ду800','Ду1000'],
              default: 'Ду600' },
            { id: 'sup_D29_priceWeightPipe', label: 'D29', type: 'select',
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