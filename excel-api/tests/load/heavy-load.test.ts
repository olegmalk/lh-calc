import request from 'supertest';
import app from '../../src/index';
import { CalculationRequest } from '../../src/types/api-contract';

describe('Heavy Load Tests', () => {
  // Base valid request for load testing
  const baseValidRequest: CalculationRequest = {
    tech_D27_type: 1,
    tech_E27_weightType: "Е-113",
    tech_H27_quantityType: "1/6",
    tech_I27_quantityType: 400,
    tech_J27_quantityType: 22,
    tech_K27_quantity: 22,
    tech_L27_quantity: 100,
    tech_M27_material: 100,
    tech_T27_materialThicknessType: 5,
    sup_F2_projectNumber: "TEST-PROJECT-001",
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
    sup_P45_priceMaterialTotal: 5200,
    // String fields
    sup_D10_priceCostMaterial: "cost_material_1",
    sup_D11_priceCostMaterial: "cost_material_2",
    sup_D17_priceWeightThickness: "weight_thickness",
    sup_D38_priceQuantityTotal: "quantity_total",
    sup_E101_priceMassPipeTotal: "mass_pipe_1",
    sup_E105_priceMassPipeTotal: "mass_pipe_2",
    sup_E20_priceWeightThicknessTotal: "weight_thick_total_1",
    sup_E21_priceWeightThicknessTotal: "weight_thick_total_2",
    sup_E26_priceWeightThickness: "weight_thick_1",
    sup_E27_priceWeightThickness: "weight_thick_2",
    sup_F28_priceWeightThicknessTotal: "f28_total",
    sup_F29_priceWeightPipeTotal: "f29_pipe",
    sup_F30_priceWeightPipeTotal: "f30_pipe",
    sup_F31_priceWeightPipeTotal: "f31_pipe",
    sup_F32_priceWeightPipeTotal: "f32_pipe",
    sup_F33_priceWeightPipeTotal: "f33_pipe",
    sup_K20_priceWeightThicknessTotal: "k20_total",
    sup_K21_priceWeightThicknessTotal: "k21_total",
    sup_K26_priceWeightThickness: "k26_thick",
    sup_K27_priceWeightThickness: "k27_thick",
    sup_L28_priceWeightThicknessTotalType: "l28_type",
    sup_L29_priceWeightPipeTotalType: "l29_type",
    sup_L30_priceWeightPipeTotalType: "l30_type",
    sup_L31_priceWeightPipeTotalType: "l31_type",
    sup_L32_priceWeightPipeTotalType: "l32_type",
    sup_L33_priceWeightPipeTotalType: "l33_type",
    sup_Q22_priceQuantityMaterialThicknessTotal: "q22_total",
    sup_Q23_priceMaterialThicknessTotal: "q23_total",
    sup_Q24_priceThicknessTotal: "q24_total",
    sup_T29_priceMaterial: "t29_material",
    sup_T30_priceMaterial: "t30_material",
    sup_T31_priceMaterial: "t31_material",
    sup_T33_priceMaterialPipe: "t33_pipe",
    sup_T34_priceMaterialTotal: "t34_total",
    sup_T35_priceMaterialTotal: "t35_total",
    sup_T37_price: "t37_price",
    sup_T38_price: "t38_price",
    sup_T39_priceQuantity: "t39_quantity",
    sup_T41_priceTotal: "t41_total",
    sup_T42_priceMaterialInsulationTotal: "t42_insulation",
    sup_T43_priceTotal: "t43_total"
  };

  const createVariantRequest = (index: number): CalculationRequest => ({
    ...baseValidRequest,
    tech_I27_quantityType: baseValidRequest.tech_I27_quantityType + index,
    sup_D8_priceMaterial: baseValidRequest.sup_D8_priceMaterial + index * 10,
    sup_I44_priceMaterialThicknessInsulationTotalType: `material_variant_${index}`
  });

  const makeConcurrentRequests = async (requestData: CalculationRequest[]) => {
    const promises = requestData.map((data, index) =>
      request(app)
        .post('/api/calculate')
        .send(data)
        .then(response => ({ index, response }))
        .catch(error => ({ index, error }))
    );

    return Promise.all(promises);
  };

  describe('Heavy Concurrent Load (20+ requests)', () => {
    test('should handle 20 concurrent requests', async () => {
      const requests = Array.from({ length: 20 }, (_, i) => createVariantRequest(i));
      const results = await makeConcurrentRequests(requests);

      expect(results).toHaveLength(20);

      let successCount = 0;
      let queueFullCount = 0;

      results.forEach((result) => {
        expect('error' in result ? result.error : undefined).toBeUndefined();
        if ('response' in result) {
          expect([200, 503]).toContain(result.response.status);

          if (result.response.status === 200) {
            successCount++;
          } else if (result.response.status === 503) {
            queueFullCount++;
          }
        }
      });

      // Should handle at least some requests successfully
      expect(successCount + queueFullCount).toBe(20);
      expect(successCount).toBeGreaterThanOrEqual(1);

      console.log(`Heavy load test: ${successCount} success, ${queueFullCount} queue full`);
    }, 120000);

    test('should handle burst of 50 requests', async () => {
      const requests = Array.from({ length: 50 }, (_, i) => createVariantRequest(i % 10));
      
      const results = await makeConcurrentRequests(requests);

      expect(results).toHaveLength(50);

      let successCount = 0;
      let rejectedCount = 0;
      let errorCount = 0;

      results.forEach((result) => {
        if ('error' in result) {
          errorCount++;
          return;
        }

        if ('response' in result) {
          if (result.response.status === 200) {
            successCount++;
          } else if ([422, 503].includes(result.response.status)) {
            rejectedCount++;
          } else {
            errorCount++;
          }
        }
      });

      // System should handle the burst without crashing
      expect(successCount + rejectedCount + errorCount).toBe(50);
      expect(errorCount).toBeLessThan(10);

      console.log(`Burst test: ${successCount} success, ${rejectedCount} rejected, ${errorCount} errors`);
    }, 180000);

    test('should handle extreme load of 100 requests', async () => {
      const extremeRequests = Array.from({ length: 100 }, (_, i) => createVariantRequest(i % 20));
      
      const batchSize = 25;
      const batches = [];
      for (let i = 0; i < extremeRequests.length; i += batchSize) {
        batches.push(extremeRequests.slice(i, i + batchSize));
      }

      let totalSuccess = 0;
      let totalRejected = 0;

      for (const batch of batches) {
        const results = await makeConcurrentRequests(batch);
        
        const successCount = results.filter(r => 'response' in r && r.response.status === 200).length;
        const rejectedCount = results.filter(r => 'response' in r && [422, 503].includes(r.response.status)).length;
        
        totalSuccess += successCount;
        totalRejected += rejectedCount;

        // Brief pause between batches
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`Extreme load: ${totalSuccess} success, ${totalRejected} rejected out of 100`);
      
      // System should handle at least some requests successfully
      expect(totalSuccess).toBeGreaterThan(0);
      expect(totalSuccess + totalRejected).toBeGreaterThanOrEqual(80);
    }, 300000);
  });
});