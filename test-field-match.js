// Test which fields from Excel don't exist in the form

const fetch = require('node-fetch');

async function testFieldMatching() {
    // Upload the Excel file
    const FormData = require('form-data');
    const fs = require('fs');
    
    const form = new FormData();
    form.append('excel', fs.createReadStream('/home/vmuser/dev/lh_calc/calc.xlsx'));
    
    const response = await fetch('http://localhost:3000/api/upload-prefill', {
        method: 'POST',
        body: form
    });
    
    const data = await response.json();
    const extractedFields = data.extracted_fields || {};
    
    // List of all field IDs that exist in our form (from app-sectioned.js)
    const formFieldIds = [
        // технолог fields
        'tech_D27_sequenceNumber',
        'tech_E27_customerOrderPosition',
        'tech_F27_deliveryType',
        'tech_G27_sizeTypeK4',
        'tech_H27_passes',
        'tech_I27_plateQuantity',
        'tech_J27_calcPressureHotSide',
        'tech_K27_calcPressureColdSide',
        'tech_L27_calcTempHotSide',
        'tech_M27_calcTempColdSide',
        'tech_P27_plateMaterial',
        'tech_Q27_materialType',
        'tech_R27_bodyMaterial',
        'tech_S27_plateSurfaceType',
        'tech_T27_drawDepth',
        'tech_U27_plateThickness',
        'tech_V27_claddingThickness',
        // снабжение fields (sample)
        'sup_F2_projectNumber',
        'sup_D8_flowPartMaterialPricePerKg',
        'sup_E8_flowPartMaterialPrice',
        'sup_D9_bodyMaterial',
        // ... (all other sup_ fields from our form)
    ];
    
    // Find fields that were extracted but don't exist in form
    const skippedFields = [];
    for (const [fieldId, value] of Object.entries(extractedFields)) {
        // For testing, just check if field starts with known prefixes
        if (!fieldId.startsWith('tech_') && !fieldId.startsWith('sup_')) {
            skippedFields.push({ id: fieldId, value, reason: 'Unknown field prefix' });
        }
    }
    
    console.log('=== Field Matching Analysis ===');
    console.log(`Total extracted: ${Object.keys(extractedFields).length}`);
    console.log(`Skipped fields: ${skippedFields.length}`);
    
    if (skippedFields.length > 0) {
        console.log('\nFields that would be skipped:');
        skippedFields.forEach(f => {
            console.log(`  ${f.id}: "${f.value}" - ${f.reason}`);
        });
    }
    
    // Show first few extracted fields
    console.log('\nFirst 5 extracted fields:');
    Object.entries(extractedFields).slice(0, 5).forEach(([id, value]) => {
        console.log(`  ${id}: ${value}`);
    });
}

testFieldMatching().catch(console.error);