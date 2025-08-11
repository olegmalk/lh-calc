import request from 'supertest';
import app from '../../src/index';
import { CalculationRequest } from '../../src/types/api-contract';

describe('Heavy Load Tests', () => {
  // Base valid request for load testing
  const baseValidRequest: CalculationRequest = {
    tech_D27_sequenceNumber: 1,
    tech_E27_customerOrderPosition: "Е-113",
    tech_H27_passes: "1/6",
    tech_I27_plateQuantity: 400,
    tech_J27_calcPressureHotSide: 22,
    tech_K27_calcPressureColdSide: 22,
    tech_L27_calcTempHotSide: 100,
    tech_M27_calcTempColdSide: 100,
    tech_T27_drawDepth: 5,
    sup_F2_projectNumber: "TEST-PROJECT-001",
    sup_D8_flowPartMaterialPricePerKg: 700,
    sup_E8_flowPartMaterialPrice: 700,
    sup_K13_normHoursPerUnit: 1,
    sup_P13_internalLogistics: 120000,
    sup_D78_stainlessSteelThickness: 3,
    sup_D43_studM24x2000Price: 3300,
    sup_D44_studM24x1000Price: 1750,
    sup_D45_studM20x2000Price: 2800,
    sup_D46_studM20M16x1000Price: 1200,
    sup_G43_nutM24DIN6330Price: 2500,
    sup_G44_nutM24DIN933Price: 1800,
    sup_G45_nutM20M16DIN933Price: 2200,
    sup_H54_spareFlangeFlange1Price: 4500,
    sup_H55_spareFlangeFlange2Price: 3800,
    sup_H56_spareFlangeFlange3Price: 4200,
    sup_H57_spareFlangeFlange4Price: 3600,
    sup_I38_eyeboltKitMaterialCost: 1500,
    sup_I39_eyeboltKitProcessingCost: 2800,
    sup_I44_otherMaterialsDesc1: "test_material",
    sup_I45_otherMaterialsDesc2: "test_thickness",
    sup_I46_otherMaterialsDesc3: "test_sum",
    sup_I50_sparePanelStudQuantity: 1200,
    sup_I51_sparePanelNutQuantity: 1400,
    sup_I52_sparePanelWasherQuantity: 1600,
    sup_I54_flangeFastenersFlange1Quantity: 1800,
    sup_I55_flangeFastenersFlange2Quantity: 2000,
    sup_I56_flangeFastenersFlange3Quantity: 2200,
    sup_I57_flangeFastenersFlange4Quantity: 2400,
    sup_K38_supportsKitMaterialCost: 3200,
    sup_K39_supportsKitProcessingCost: 2800,
    sup_M38_bracesKitMaterialCost: 4100,
    sup_M39_bracesKitProcessingCost: 3500,
    sup_M44_otherMaterialsCost1: 1900,
    sup_M45_otherMaterialsCost2: 2100,
    sup_M46_otherMaterialsCost3: 3300,
    sup_M51_spareAnchorBoltsCost: 4500,
    sup_M52_spareOtherCost: 4700,
    sup_N50_sparePanelGasketsQuantity: 3800,
    sup_N51_spareAnchorBoltsQuantity: 4000,
    sup_N52_spareOtherQuantity: 4200,
    sup_N54_spareFlangeGasketsFlange1Quantity: 2500,
    sup_N55_spareFlangeGasketsFlange2Quantity: 2700,
    sup_N56_spareFlangeGasketsFlange3Quantity: 2900,
    sup_N57_spareFlangeGasketsFlange4Quantity: 3100,
    sup_P45_unaccountedCost: 5200,
    // String fields
    sup_D10_columnCoverMaterialPrice: "cost_material_1",
    sup_D11_panelMaterialPrice: "cost_material_2",
    sup_D17_panelCuttingCoefficient: "weight_thickness",
    sup_D38_panelGasketsPrice: "quantity_total",
    sup_E20_coverCuttingPrice: "weight_thick_total_1",
    sup_E21_coverProcessingCost: "weight_thick_total_2",
    sup_E26_panelCuttingPrice: "weight_thick_1",
    sup_E27_panelProcessingCost: "weight_thick_2",
    sup_F28_flange1PanelAPrice: "f28_total",
    sup_F29_flange2PanelAPrice: "f29_pipe",
    sup_F30_pipeBilletFlange1Price: "f30_pipe",
    sup_F31_pipeBilletFlange2Price: "f31_pipe",
    sup_F32_drainageNozzlePrice: "f32_pipe",
    sup_F33_ventilationNozzlePrice: "f33_pipe",
    sup_K20_columnCuttingPrice: "k20_total",
    sup_K21_columnProcessingCost: "k21_total",
    sup_K26_panelBCuttingPrice: "k26_thick",
    sup_K27_panelBProcessingCost: "k27_thick",
    sup_L28_panelBFlange3Price: "l28_type",
    sup_L29_panelBFlange4Price: "l29_type",
    sup_L30_panelBPipeBilletFlange3Price: "l30_type",
    sup_L31_panelBPipeBilletFlange4Price: "l31_type",
    sup_L32_panelBDrainageNozzlePrice: "l32_type",
    sup_L33_panelBVentilationNozzlePrice: "l33_type",
    sup_Q22_panelFastenersStudCost: "q22_total",
    sup_Q23_panelFastenersNutCost: "q23_total",
    sup_Q24_panelFastenersWasherCost: "q24_total",
    sup_T29_cofFastenersFlange1KitPrice: "t29_material",
    sup_T30_cofGasketFlange1Price: "t30_material",
    sup_T31_cofObturatorFlange1Price: "t31_material",
    sup_T33_cofFastenersFlange2KitPrice: "t33_pipe",
    sup_T34_cofGasketFlange2Price: "t34_total",
    sup_T35_cofObturatorFlange2Price: "t35_total",
    sup_T37_cofFastenersFlange3KitPrice: "t37_price",
    sup_T38_cofGasketFlange3Price: "t38_price",
    sup_T39_cofObturatorFlange3Price: "t39_quantity",
    sup_T41_cofFastenersFlange4KitPrice: "t41_total",
    sup_T42_cofGasketFlange4Price: "t42_insulation",
    sup_T43_cofObturatorFlange4Price: "t43_total"
  };

  const createVariantRequest = (index: number): CalculationRequest => ({
    ...baseValidRequest,
    tech_I27_plateQuantity: baseValidRequest.tech_I27_plateQuantity + index,
    sup_D8_flowPartMaterialPricePerKg: baseValidRequest.sup_D8_flowPartMaterialPricePerKg + index * 10,
    sup_I44_otherMaterialsDesc1: `material_variant_${index}`
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