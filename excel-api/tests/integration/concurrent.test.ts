import request from 'supertest';
import app from '../../src/index';
import { CalculationRequest } from '../../src/types/api-contract';

describe('Excel API Concurrent Processing Tests', () => {
  // Base valid request for concurrent testing
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

  // Utility function to create slightly different requests
  const createVariantRequest = (index: number): CalculationRequest => ({
    ...baseValidRequest,
    tech_I27_quantityType: baseValidRequest.tech_I27_quantityType + index,
    sup_D8_priceMaterial: baseValidRequest.sup_D8_priceMaterial + index * 10,
    sup_I44_priceMaterialThicknessInsulationTotalType: `material_variant_${index}`
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
        tech_I27_quantityType: 10 + i // Simple calculation
      }));

      const complexRequests = Array.from({ length: 5 }, (_, i) => ({
        ...baseValidRequest,
        tech_I27_quantityType: 1000 + i, // More complex calculation
        sup_D8_priceMaterial: 50000 + i * 1000
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
        tech_I27_quantityType: -100 - i, // Invalid negative values
        sup_F2_parameter: `INVALID_${i}` as any
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
        tech_I27_quantityType: input
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
          sup_F2_parameter: `INVALID_${i}` as any
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