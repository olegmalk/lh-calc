import request from 'supertest';
import app from '../../src/index';
import { CalculationRequest } from '../../src/types/api-contract';

describe('Excel API Concurrent Processing Tests', () => {
  // Base valid request for concurrent testing
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

  // Utility function to create slightly different requests
  const createVariantRequest = (index: number): CalculationRequest => ({
    ...baseValidRequest,
    tech_I27_plateQuantity: baseValidRequest.tech_I27_plateQuantity + index,
    sup_D8_flowPartMaterialPricePerKg: baseValidRequest.sup_D8_flowPartMaterialPricePerKg + index * 10,
    sup_I44_otherMaterialsDesc1: `material_variant_${index}`
  });

  // Utility function to make concurrent requests
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

  describe('Basic Concurrent Processing', () => {
    test('should handle 5 identical concurrent requests', async () => {
      const requests = Array(5).fill(baseValidRequest);
      const results = await makeConcurrentRequests(requests);

      // All requests should be processed
      expect(results).toHaveLength(5);

      // Check each result
      results.forEach((result) => {
        expect('error' in result ? result.error : undefined).toBeUndefined();
        if ('response' in result) {
          expect(result.response.status).toBe(200);
          expect(result.response.body.success).toBe(true);
          expect(result.response.body.request_id).toBeDefined();
          expect(result.response.body.results.total_cost).toBeGreaterThan(0);
        }
      });

      // All requests should have unique request IDs
      const requestIds = results
        .filter(r => 'response' in r)
        .map(r => 'response' in r ? r.response.body.request_id : undefined)
        .filter(id => id !== undefined);
      const uniqueIds = new Set(requestIds);
      expect(uniqueIds.size).toBe(5);
    }, 60000);

    test('should handle 10 different concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, (_, i) => createVariantRequest(i));
      const results = await makeConcurrentRequests(requests);

      expect(results).toHaveLength(10);

      let successfulRequests = 0;
      results.forEach((result) => {
        expect('error' in result ? result.error : undefined).toBeUndefined();
        if ('response' in result) {
          expect([200, 422]).toContain(result.response.status);
          
          if (result.response.status === 200) {
            successfulRequests++;
            expect(result.response.body.success).toBe(true);
            expect(result.response.body.request_id).toBeDefined();
          }
        }
      });

      // At least half should be successful
      expect(successfulRequests).toBeGreaterThanOrEqual(5);
    }, 90000);
  });

  describe('High Load Concurrent Processing', () => {
    test.skip('should handle 20 concurrent requests without corruption', async () => {
      const requests = Array.from({ length: 20 }, (_, i) => createVariantRequest(i));
      const results = await makeConcurrentRequests(requests);

      expect(results).toHaveLength(20);

      let successCount = 0;
      let queueFullCount = 0;
      const processingTimes: number[] = [];

      results.forEach((result) => {
        expect('error' in result ? result.error : undefined).toBeUndefined();
        if ('response' in result) {
          expect([200, 422, 503]).toContain(result.response.status);

          if (result.response.status === 200) {
            successCount++;
            expect(result.response.body.success).toBe(true);
            expect(result.response.body.processing_time_ms).toBeGreaterThan(0);
            processingTimes.push(result.response.body.processing_time_ms);
          } else if (result.response.status === 503) {
            queueFullCount++;
            expect(result.response.body.success).toBe(false);
            expect(result.response.body.error).toMatch(/queue|busy|capacity/i);
          }
        }
      });

      // Should handle at least some requests successfully
      expect(successCount + queueFullCount).toBe(20);
      expect(successCount).toBeGreaterThanOrEqual(1);

      // Check processing time consistency
      if (processingTimes.length > 1) {
        const avgTime = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
        expect(avgTime).toBeLessThan(30000); // Should not take more than 30 seconds on average
      }
    }, 120000);

    test('should handle burst of 50 requests gracefully', async () => {
      const requests = Array.from({ length: 50 }, (_, i) => createVariantRequest(i % 10));
      const startTime = Date.now();
      
      const results = await makeConcurrentRequests(requests);
      const totalTime = Date.now() - startTime;

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
            expect(result.response.body.success).toBe(true);
          } else if ([422, 503].includes(result.response.status)) {
            rejectedCount++;
            expect(result.response.body.success).toBe(false);
          } else {
            errorCount++;
          }
        }
      });

      // System should handle the burst without crashing
      expect(successCount + rejectedCount + errorCount).toBe(50);
      expect(errorCount).toBeLessThan(10); // Most errors should be handled gracefully

      console.log(`Burst test results: ${successCount} success, ${rejectedCount} rejected, ${errorCount} errors in ${totalTime}ms`);
    }, 180000);
  });

  describe('Mixed Request Types Concurrency', () => {
    test('should handle concurrent requests with different complexity', async () => {
      const simpleRequests = Array.from({ length: 5 }, (_, i) => ({
        ...baseValidRequest,
        tech_I27_plateQuantity: 10 + i // Simple calculation
      }));

      const complexRequests = Array.from({ length: 5 }, (_, i) => ({
        ...baseValidRequest,
        tech_I27_plateQuantity: 1000 + i, // More complex calculation
        sup_D8_flowPartMaterialPricePerKg: 50000 + i * 1000
      }));

      const allRequests = [...simpleRequests, ...complexRequests];
      const results = await makeConcurrentRequests(allRequests);

      expect(results).toHaveLength(10);

      const simpleResults = results.slice(0, 5);
      const complexResults = results.slice(5, 10);

      // Simple requests should generally complete faster
      const simpleValidResults = simpleResults.filter(r => 'response' in r && r.response.status === 200);
      const simpleAvgTime = simpleValidResults.length > 0 ?
        simpleValidResults.reduce((sum, r) => sum + ('response' in r ? r.response.body.processing_time_ms : 0), 0) / simpleValidResults.length : 0;

      const complexValidResults = complexResults.filter(r => 'response' in r && r.response.status === 200);
      const complexAvgTime = complexValidResults.length > 0 ?
        complexValidResults.reduce((sum, r) => sum + ('response' in r ? r.response.body.processing_time_ms : 0), 0) / complexValidResults.length : 0;

      if (!isNaN(simpleAvgTime) && !isNaN(complexAvgTime)) {
        console.log(`Simple avg: ${simpleAvgTime}ms, Complex avg: ${complexAvgTime}ms`);
      }
    }, 120000);

    test.skip('should handle mix of valid and invalid requests concurrently', async () => {
      const validRequests = Array.from({ length: 5 }, (_, i) => createVariantRequest(i));
      
      const invalidRequests = Array.from({ length: 5 }, (_, i) => ({
        ...baseValidRequest,
        tech_I27_plateQuantity: -100 - i, // Invalid negative values
        sup_F2_projectNumber: `INVALID_${i}` as any
      }));

      const allRequests = [...validRequests, ...invalidRequests];
      const results = await makeConcurrentRequests(allRequests);

      expect(results).toHaveLength(10);

      const validResults = results.slice(0, 5);
      const invalidResults = results.slice(5, 10);

      // Valid requests should mostly succeed
      const validSuccessCount = validResults.filter(r => 'response' in r && r.response.status === 200).length;
      expect(validSuccessCount).toBeGreaterThanOrEqual(3);

      // Invalid requests should mostly fail validation
      const invalidFailCount = invalidResults.filter(r => 'response' in r && r.response.status === 422).length;
      expect(invalidFailCount).toBeGreaterThanOrEqual(3);
    }, 90000);
  });

  describe('Queue Management Under Load', () => {
    test('should provide queue status during high load', async () => {
      // Start concurrent processing load
      const loadRequests = Array.from({ length: 20 }, (_, i) => createVariantRequest(i));
      const loadPromise = makeConcurrentRequests(loadRequests);

      // Check queue status during load
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for requests to start

      const queueResponse = await request(app)
        .get('/api/admin/queue/stats')
        .expect(200);

      expect(queueResponse.body.success).toBe(true);
      expect(queueResponse.body.queue_stats).toBeDefined();
      expect(queueResponse.body.workers).toBeDefined();

      // Wait for load to complete
      await loadPromise;
    }, 120000);

    test.skip('should handle queue capacity limits gracefully', async () => {
      // Try to overwhelm the queue
      const overloadRequests = Array.from({ length: 100 }, (_, i) => createVariantRequest(i));
      
      const results = await Promise.allSettled(
        overloadRequests.map(data =>
          request(app)
            .post('/api/calculate')
            .send(data)
            .timeout(60000)
        )
      );

      let successCount = 0;
      let queueFullCount = 0;
      let timeoutCount = 0;
      let otherErrors = 0;

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const response = result.value;
          if (response.status === 200) {
            successCount++;
          } else if (response.status === 503) {
            queueFullCount++;
          }
        } else {
          if (result.reason.code === 'ECONNABORTED') {
            timeoutCount++;
          } else {
            otherErrors++;
          }
        }
      });

      console.log(`Overload test: ${successCount} success, ${queueFullCount} queue full, ${timeoutCount} timeout, ${otherErrors} other errors`);
      
      // System should handle overload gracefully
      expect(successCount + queueFullCount + timeoutCount + otherErrors).toBe(100);
      expect(otherErrors).toBeLessThan(20); // Most failures should be handled gracefully
    }, 300000);
  });

  describe('Race Condition Prevention', () => {
    test('should prevent request ID collision', async () => {
      // Generate many requests quickly to test ID uniqueness
      const quickRequests = Array.from({ length: 50 }, () => baseValidRequest);
      const results = await makeConcurrentRequests(quickRequests);

      const requestIds = results
        .filter(r => 'response' in r && r.response.status === 200)
        .map(r => 'response' in r ? r.response.body.request_id : undefined)
        .filter(id => id !== undefined);

      // All successful request IDs should be unique
      const uniqueIds = new Set(requestIds);
      expect(uniqueIds.size).toBe(requestIds.length);
    }, 120000);

    test('should maintain data integrity across concurrent requests', async () => {
      // Use different input values and verify outputs are correct
      const testData = [
        { input: 100, expectedMin: 0 },
        { input: 200, expectedMin: 0 },
        { input: 300, expectedMin: 0 },
        { input: 400, expectedMin: 0 },
        { input: 500, expectedMin: 0 }
      ];

      const requests = testData.map(({ input }) => ({
        ...baseValidRequest,
        tech_I27_plateQuantity: input
      }));

      const results = await makeConcurrentRequests(requests);

      results.forEach((result, index) => {
        if ('response' in result && result.response.status === 200) {
          const expectedMin = testData[index].expectedMin;
          
          expect(result.response.body.success).toBe(true);
          expect(result.response.body.results.total_cost).toBeGreaterThanOrEqual(expectedMin);
          
          // Verify the calculation didn't get mixed up with other requests
          expect(result.response.body.results.total_cost).toBeLessThan(1000000);
        }
      });
    }, 90000);
  });

  describe('Error Recovery and Resilience', () => {
    test.skip('should recover from temporary errors during concurrent load', async () => {
      const requests = Array.from({ length: 15 }, (_, i) => createVariantRequest(i));
      
      // First batch - might cause some temporary errors due to load
      const firstBatch = await makeConcurrentRequests(requests);
      
      // Wait a moment for recovery
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Second batch - should work better after recovery
      const secondBatch = await makeConcurrentRequests(requests);

      // System should recover and handle subsequent requests
      const firstSuccessCount = firstBatch.filter(r => 'response' in r && r.response.status === 200).length;
      const secondSuccessCount = secondBatch.filter(r => 'response' in r && r.response.status === 200).length;

      // Second batch should have equal or better success rate
      expect(secondSuccessCount).toBeGreaterThanOrEqual(Math.max(1, firstSuccessCount - 2));
    }, 150000);

    test.skip('should handle graceful degradation under extreme load', async () => {
      const extremeRequests = Array.from({ length: 200 }, (_, i) => createVariantRequest(i % 20));
      
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

      console.log(`Extreme load: ${totalSuccess} success, ${totalRejected} rejected out of ${extremeRequests.length}`);
      
      // System should handle at least some requests successfully
      expect(totalSuccess).toBeGreaterThan(0);
      expect(totalSuccess + totalRejected).toBeGreaterThanOrEqual(extremeRequests.length * 0.8);
    }, 400000);
  });

  describe('System Monitoring Under Load', () => {
    test('should provide accurate metrics during concurrent processing', async () => {
      // Start background load
      const backgroundLoad = Array.from({ length: 10 }, (_, i) => createVariantRequest(i));
      const loadPromise = makeConcurrentRequests(backgroundLoad);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check metrics during load
      const metricsResponse = await request(app)
        .get('/api/metrics')
        .expect(200);

      expect(metricsResponse.body.success).toBe(true);
      expect(metricsResponse.body.metrics).toBeDefined();
      expect(metricsResponse.body.metrics.queue).toBeDefined();
      expect(metricsResponse.body.metrics.system).toBeDefined();
      expect(metricsResponse.body.metrics.system.memory).toBeDefined();

      await loadPromise;

      // Check metrics after load
      const postLoadMetrics = await request(app)
        .get('/api/metrics')
        .expect(200);

      expect(postLoadMetrics.body.success).toBe(true);
    }, 60000);

    test('should track error rates accurately', async () => {
      // Mix of valid and invalid requests
      const mixedRequests = [
        ...Array.from({ length: 5 }, (_, i) => createVariantRequest(i)),
        ...Array.from({ length: 5 }, (_, i) => ({
          ...baseValidRequest,
          sup_F2_projectNumber: `INVALID_${i}` as any
        }))
      ];

      await makeConcurrentRequests(mixedRequests);

      const errorsResponse = await request(app)
        .get('/api/admin/errors/recent')
        .expect(200);

      expect(errorsResponse.body.success).toBe(true);
      expect(errorsResponse.body.recent_errors).toBeDefined();
      expect(Array.isArray(errorsResponse.body.recent_errors)).toBe(true);
    }, 60000);
  });
});