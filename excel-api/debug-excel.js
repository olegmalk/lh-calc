const { ExcelProcessor } = require('./dist/src/processors/excel-processor.js');
const { CalculationRequest } = require('./dist/src/types/api-contract.js');

async function debugExcelProcessing() {
  console.log('Testing Excel processing directly...');
  
  const processor = new ExcelProcessor();
  
  const testRequest = {
    tech_D27_type: 1,
    tech_E27_weightType: "Е-113",
    tech_H27_quantityType: "1/6",
    tech_I27_quantityType: 400,
    tech_J27_quantityType: 22,
    tech_K27_quantity: 22,
    tech_L27_quantity: 100,
    tech_M27_material: 100,
    tech_T27_materialThicknessType: 5,
    sup_F2_parameter: "09Г2С",
    sup_D8_priceMaterial: 700,
    sup_E8_priceMaterial: 700,
    sup_K13_costQuantityNormTotal: 1,
    sup_P13_costQuantityMaterialNorm: 120000,
    sup_D78_massThickness: 3,
    sup_D43_priceTotal: 3300,
    sup_D44_price: 1750,
    sup_D45_price: 2800,
    sup_D46_price: 1200,
    sup_G43_priceMaterialInsulationTotal: 2500,
    sup_G44_priceMaterialInsulation: 1800,
    sup_G45_priceMaterialInsulation: 2200,
    sup_H54_priceTotal: 4500,
    sup_H55_priceTotal: 3800,
    sup_H56_priceTotal: 4200,
    sup_H57_priceTotal: 3600,
    sup_I38_priceThicknessTotalType: 1500,
    sup_I39_priceQuantityMaterialThicknessInsulationTotalType: 2800,
    sup_I44_priceMaterialThicknessInsulationTotalType: "test_material",
    sup_I45_priceMaterialThicknessInsulationTotalType: "test_thickness",
    sup_I46_priceQuantityMaterialThicknessInsulationTotalSumType: "test_sum",
    sup_I50_priceQuantityMaterialThicknessInsulationTotalSumType: 1200,
    sup_I51_priceQuantityMaterialThicknessInsulationTotalSumType: 1400,
    sup_I52_priceQuantityMaterialThicknessInsulationTotalSumType: 1600,
    sup_I54_priceQuantityMaterialThicknessInsulationTotalType: 1800,
    sup_I55_priceQuantityMaterialThicknessInsulationTotalType: 2000,
    sup_I56_priceQuantityMaterialThicknessInsulationTotalType: 2200,
    sup_I57_priceQuantityMaterialThicknessInsulationTotalType: 2400,
    sup_K38_pricePipeTotal: 3200,
    sup_K39_priceQuantityMaterialPipeInsulationTotal: 2800,
    sup_M38_priceMaterialTotal: 4100,
    sup_M39_quantityMaterialTotal: 3500,
    sup_M44_priceMaterial: 1900,
    sup_M45_priceMaterial: 2100,
    sup_M46_priceQuantityMaterialSum: 3300,
    sup_M51_priceQuantityMaterialTotalSum: 4500,
    sup_M52_priceQuantityMaterialTotalSum: 4700,
    sup_N50_priceQuantityWeightThicknessTotalSum: 3800,
    sup_N51_priceQuantityWeightThicknessTotalSum: 4000,
    sup_N52_priceQuantityWeightThicknessTotalSum: 4200,
    sup_N54_quantityWeightThicknessTotal: 2500,
    sup_N55_quantityWeightThicknessTotal: 2700,
    sup_N56_quantityWeightThicknessTotal: 2900,
    sup_N57_quantityWeightThicknessTotal: 3100,
    sup_P45_priceMaterialTotal: 5200
  };

  try {
    console.log('Processing request...');
    const result = await processor.processCalculation(testRequest);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.success && result.results) {
      console.log('Total cost:', result.results.total_cost);
      console.log('Component costs:', result.results.component_costs);
    } else {
      console.log('Processing failed:', result.error);
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugExcelProcessing();