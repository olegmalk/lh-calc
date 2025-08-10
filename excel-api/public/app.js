// Field configuration - single source of truth
const FIELD_CONFIG = {
    tech: {
        title: '🔧 Technical Parameters (технолог)',
        fields: [
            { id: 'tech_D27_type', label: 'D27 Equipment Type', type: 'number', default: 1001 },
            { id: 'tech_E27_weightType', label: 'E27 Equipment Code', type: 'text', default: 'Е-113' },
            { id: 'tech_F27_quantityType', label: 'F27 Delivery Type', type: 'select', 
              options: ['Целый ТА', 'ШОТ-БЛОК', 'РЕИНЖ'], default: 'Целый ТА' },
            { id: 'tech_G27_quantityType', label: 'G27 Equipment Size', type: 'text', default: 'К4-750' },
            { id: 'tech_H27_quantityType', label: 'H27 Process Spec', type: 'text', default: '1/6' },
            { id: 'tech_I27_quantityType', label: 'I27 Plate Count', type: 'number', default: 401 },
            { id: 'tech_J27_quantityType', label: 'J27 Pressure Bar', type: 'number', default: 22 },
            { id: 'tech_K27_quantity', label: 'K27 Pressure Bar', type: 'number', default: 23 },
            { id: 'tech_L27_quantity', label: 'L27 Temperature °C', type: 'number', default: 101 },
            { id: 'tech_M27_material', label: 'M27 Temperature °C', type: 'number', default: 102 },
            { id: 'tech_P27_materialType', label: 'P27 Plate Material', type: 'select',
              options: ['AISI 316L', 'SMO 254', 'Hast-C276', 'Titanium', 'AISI 304', 'AISI316Ti', '904L'], 
              default: 'AISI 316L' },
            { id: 'tech_R27_materialThicknessType', label: 'R27 Frame Material', type: 'select',
              options: ['ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti'],
              default: '09Г2С' },
            { id: 'tech_S27_materialThicknessType', label: 'S27 Groove Type', type: 'select',
              options: ['гофра', 'дв. лунка', 'од. лунка', 'шпилька', 'шпилька-лунка'], default: 'гофра' },
            { id: 'tech_T27_materialThicknessType', label: 'T27 Groove Depth mm', type: 'number', default: 5 },
            { id: 'tech_U27_materialThicknessType', label: 'U27 Plate Thickness', type: 'select',
              options: ['0.8', '1', '1.2', '1.5', '2', '3', '5'], default: '1' },
            { id: 'tech_V27_thicknessType', label: 'V27 Cladding mm', type: 'select',
              options: ['0.8', '1', '1.2', '1.5', '2', '3', '5'], default: '3' }
        ]
    },
    supMain: {
        title: '💰 Supply Main Parameters',
        fields: [
            { id: 'sup_F2_parameter', label: 'F2 Base Material', type: 'text', default: '0000' },
            { id: 'sup_D8_priceMaterial', label: 'D8 Price/kg', type: 'number', default: 701 },
            { id: 'sup_E8_priceMaterial', label: 'E8 Price/kg', type: 'number', default: 702 },
            { id: 'sup_D9_priceMaterial', label: 'D9 Material', type: 'select',
              options: ['ст3', 'ст20', '09Г2С', '12Х18Н10Т', 'AISI 304', 'AISI 316L', 'AISI 321', 'AISI 316Ti'],
              default: '09Г2С' },
            { id: 'sup_D10_priceCostMaterial', label: 'D10 Cost', type: 'number', default: 1010 },
            { id: 'sup_D11_priceCostMaterial', label: 'D11 Cost', type: 'number', default: 1011 },
            { id: 'sup_K13_costQuantityNormTotal', label: 'K13 Norm Cost', type: 'number', default: 1 },
            { id: 'sup_P13_costQuantityMaterialNorm', label: 'P13 Material Norm', type: 'number', default: 120013 },
            { id: 'sup_D17_priceWeightThickness', label: 'D17 Weight', type: 'number', default: 1017 },
            { id: 'sup_D78_massThickness', label: 'D78 Mass mm', type: 'number', default: 3 }
        ]
    },
    supE: {
        title: '📦 Supply E Column',
        fields: Array.from([19,20,21,25,26,27,101,105], n => ({
            id: `sup_E${n}_price${n>100?'Mass':'Weight'}${n<28?'ThicknessTotal':'Thickness'}${n>100?'PipeTotal':''}`,
            label: `E${n} ${n>100?'Mass Pipe':'Weight'} ${n<28?'Total':''}`,
            type: 'number',
            default: 1000 + n
        }))
    },
    flange: {
        title: '🔩 Flange Parameters',
        fields: [
            { id: 'sup_C28_priceWeightThickness', label: 'C28 Pressure', type: 'select',
              options: ['Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160'], default: 'Ру10' },
            { id: 'sup_C29_priceWeightPipeThickness', label: 'C29 Pressure', type: 'select',
              options: ['Ру6', 'Ру10', 'Ру16', 'Ру25', 'Ру40', 'Ру63', 'Ру100', 'Ру160'], default: 'Ру40' },
            { id: 'sup_D28_priceWeightThickness', label: 'D28 Diameter', type: 'select',
              options: ['Ду25','Ду32','Ду40','Ду50','Ду65','Ду80','Ду100','Ду125','Ду150','Ду200','Ду250','Ду300','Ду350','Ду400','Ду450','Ду500','Ду600','Ду800','Ду1000'],
              default: 'Ду600' },
            { id: 'sup_D29_priceWeightPipe', label: 'D29 Diameter', type: 'select',
              options: ['Ду25','Ду32','Ду40','Ду50','Ду65','Ду80','Ду100','Ду125','Ду150','Ду200','Ду250','Ду300','Ду350','Ду400','Ду450','Ду500','Ду600','Ду800','Ду1000'],
              default: 'Ду600' }
        ]
    }
};

// Generate remaining supply fields programmatically
const SUPPLY_FIELDS = {
    F: [28,29,30,31,32,33,39],
    D: [38,43,44,45,46],
    G: [43,44,45],
    H: [54,55,56,57],
    I: [28,29,38,39,44,45,46,50,51,52,54,55,56,57],
    J: [28,29],
    K: [19,20,21,25,26,27,38,39],
    L: [28,29,30,31,32,33],
    M: [38,39,44,45,46,51,52],
    N: [50,51,52,54,55,56,57],
    P: [19,20,21,22,29,33,37,41,45],
    Q: [22,23,24,29,33,37,41],
    R: [29,33,37,41],
    T: [29,30,31,33,34,35,37,38,39,41,42,43]
};

// Add supply field sections to config
Object.entries(SUPPLY_FIELDS).forEach(([col, rows]) => {
    FIELD_CONFIG[`sup${col}`] = {
        title: `📊 Supply ${col} Column`,
        fields: rows.map(n => ({
            id: `sup_${col}${n}_price${getFieldSuffix(col, n)}`,
            label: `${col}${n} ${getFieldLabel(col, n)}`,
            type: 'number',
            default: parseInt(`${col.charCodeAt(0)}0${n}`)
        }))
    };
});

function getFieldSuffix(col, row) {
    const patterns = {
        weight: [19,20,21,25,26,27,28],
        pipe: [29,30,31,32,33],
        material: [38,39,44,45,46],
        total: [41,43,50,51,52,54,55,56,57]
    };
    
    for (const [suffix, rows] of Object.entries(patterns)) {
        if (rows.includes(row)) return suffix.charAt(0).toUpperCase() + suffix.slice(1);
    }
    return 'Value';
}

function getFieldLabel(col, row) {
    if (row >= 50) return 'Sum/Total';
    if (row >= 40) return 'Material/Price';
    if (row >= 30) return 'Pipe';
    if (row >= 20) return 'Weight/Thickness';
    return 'Value';
}

// Dashboard cards configuration
const DASHBOARD_CARDS = [
    { id: 'health', title: '🟢 Health Status', metrics: 'healthMetrics' },
    { id: 'system', title: '📊 System Metrics', metrics: 'systemMetrics' },
    { id: 'admin', title: '🔧 Admin Tools', content: `
        <a href="/template-upload.html" style="display:block;padding:12px 20px;background:#667eea;color:white;text-decoration:none;border-radius:8px;font-weight:600;text-align:center;">
            📋 Template Management →
        </a>
        <p style="font-size:12px;color:#718096;margin:8px 0 0;">Upload, download, and manage Excel calculation templates</p>
    `},
    { id: 'files', title: '📁 Recent Files', metrics: 'recentFiles' }
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
            ${card.content || `<div id="${card.metrics}"><div class="metric"><span class="metric-label">Loading...</span></div></div>`}
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
        <div class="metric"><span class="metric-label">Status</span><span class="metric-value">${data.status}</span></div>
        <div class="metric"><span class="metric-label">Version</span><span class="metric-value">${data.version}</span></div>
        <div class="metric"><span class="metric-label">Uptime</span><span class="metric-value">${formatUptime(data.uptime)}</span></div>
    `;
}

function updateSystemMetrics(data) {
    document.getElementById('systemMetrics').innerHTML = `
        <div class="metric"><span class="metric-label">Active Workers</span><span class="metric-value">${data.queue.activeWorkers}/${data.queue.totalWorkers}</span></div>
        <div class="metric"><span class="metric-label">Queue Size</span><span class="metric-value">${data.queue.queuedRequests}</span></div>
        <div class="metric"><span class="metric-label">Avg Response</span><span class="metric-value">${data.requests.averageResponseTime}ms</span></div>
        <div class="metric"><span class="metric-label">Success Rate</span><span class="metric-value">${data.requests.successRate}%</span></div>
    `;
}

function updateRecentFiles(data) {
    document.getElementById('recentFiles').innerHTML = `
        <div class="metric"><span class="metric-label">Total Files</span><span class="metric-value">${data.count}</span></div>
        <div class="metric"><span class="metric-label">Latest</span><span class="metric-value">${data.count > 0 ? new Date(data.files[0].created).toLocaleTimeString() : 'None'}</span></div>
    `;
}

function updateFileList(files) {
    const fileList = document.getElementById('fileList');
    if (!files || files.length === 0) {
        fileList.innerHTML = '<div style="padding:20px;text-align:center;color:#718096;">No files generated yet</div>';
        return;
    }
    
    fileList.innerHTML = files.slice(0, 10).map(file => `
        <div class="file-item">
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-meta">${new Date(file.created).toLocaleString()} • ${formatFileSize(file.size)}</div>
            </div>
            <a href="${file.downloadUrl}" class="download-btn" download>Download</a>
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
    return `✅ CALCULATION SUCCESSFUL

Total Cost: ${fmt(data.results.total_cost)}

Component Breakdown:
  • Materials: ${fmt(data.results.component_costs.materials)}
  • Processing: ${fmt(data.results.component_costs.processing)}
  • Hardware: ${fmt(data.results.component_costs.hardware)}
  • Other: ${fmt(data.results.component_costs.other)}

Processing Time: ${data.processing_time_ms}ms
Request ID: ${data.request_id}

Full Response:
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
    document.getElementById('responseArea').textContent = 'Form cleared. Enter new values...';
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