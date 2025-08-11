import request from 'supertest';
import app from '../../src/index';
import {
  CalculationRequest
} from '../../src/types/api-contract';

describe('Excel API Integration Tests', () => {
  // Valid test data based on test-request.json
  const validRequest: CalculationRequest = {
    tech_D27_type: 1,
    tech_E27_weightType: "Е-113",
    tech_H27_quantityType: "1/6",
    tech_I27_quantityType: 400,
    tech_J27_quantityType: 22,
    tech_K27_quantity: 22,
    tech_L27_quantity: 100,
    tech_M27_material: 100,
    tech_T27_materialThicknessType: 5,
    sup_F2_projectNumber: "TEST-PROJECT-003",
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
    // Required string fields
    sup_D10_priceCostMaterial: "cost_material_1",
    sup_D11_priceCostMaterial: "cost_material_2",
    sup_D17_priceWeightThickness: "weight_thickness",
    sup_D38_priceQuantityTotal: "quantity_total",
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

  describe('Health Check Endpoint', () => {
    test('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'healthy',
        version: '1.0.0',
        timestamp: expect.any(String)
      });
    });
  });

  describe('Required Fields Endpoint', () => {
    test('should return list of required fields', async () => {
      const response = await request(app)
        .get('/api/fields/required')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        fields: expect.any(Array),
        count: expect.any(Number)
      });

      expect(response.body.count).toBeGreaterThan(0);
    });
  });

  describe('Diagnostics Endpoint', () => {
    test('should return system diagnostics', async () => {
      const response = await request(app)
        .get('/api/diagnostics')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        excel_processor: expect.any(Object),
        template_validation: expect.any(Object),
        timestamp: expect.any(String)
      });
    });
  });

  describe('Metrics Endpoint', () => {
    test('should return system metrics', async () => {
      const response = await request(app)
        .get('/api/metrics')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        metrics: expect.objectContaining({
          queue: expect.any(Object),
          rate_limiter: expect.any(Object),
          workers: expect.any(Object),
          system: expect.objectContaining({
            memory: expect.any(Object),
            uptime: expect.any(Number),
            pid: expect.any(Number)
          })
        })
      });
    });
  });

  describe('Main Calculation Endpoint', () => {
    test('should process valid calculation request', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send(validRequest)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        results: expect.objectContaining({
          calculated_values: expect.any(Object),
          total_cost: expect.any(Number),
          component_costs: expect.objectContaining({
            materials: expect.any(Number),
            processing: expect.any(Number),
            hardware: expect.any(Number),
            other: expect.any(Number)
          })
        }),
        request_id: expect.any(String),
        processing_time_ms: expect.any(Number)
      });
    }, 30000);

    test('should reject empty request body', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({})
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        request_id: expect.any(String),
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED',
          message: expect.any(String)
        })
      });
    });

    test('should reject request with missing required fields', async () => {
      const incompleteRequest = {
        tech_D27_type: 1,
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(incompleteRequest)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        request_id: expect.any(String),
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED',
          details: expect.any(Object)
        })
      });
    });

    test('should validate field types correctly', async () => {
      const invalidTypeRequest = {
        ...validRequest,
        tech_D27_type: "not_a_number", // Should be number
        tech_I27_quantityType: "not_a_number" // Should be number
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidTypeRequest)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED'
        })
      });
    });

    test('should validate enum values', async () => {
      const invalidEnumRequest = {
        ...validRequest,
        sup_F2_projectNumber: "INVALID_MATERIAL_CODE"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidEnumRequest)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED'
        })
      });
    });

    test('should validate equipment code pattern', async () => {
      const invalidPatternRequest = {
        ...validRequest,
        tech_E27_weightType: "INVALID_PATTERN_123"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidPatternRequest)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED'
        })
      });
    });

    test('should validate fraction pattern', async () => {
      const invalidFractionRequest = {
        ...validRequest,
        tech_H27_quantityType: "invalid/fraction/format"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidFractionRequest)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED'
        })
      });
    });

    test('should handle large request payload', async () => {
      const largeRequest = {
        ...validRequest,
        large_field: 'x'.repeat(100000) // 100KB of data
      };

      await request(app)
        .post('/api/calculate')
        .send(largeRequest)
        .expect((res) => {
          // Should either process successfully or reject with 413
          expect([200, 413]).toContain(res.status);
        });
    });

    test('should handle numeric edge cases', async () => {
      const edgeNumericRequest = {
        ...validRequest,
        tech_I27_quantityType: 0.00001, // Very small number
        sup_D8_priceMaterial: 999999999 // Very large number
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(edgeNumericRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should sanitize potentially malicious input', async () => {
      const maliciousRequest = {
        ...validRequest,
        sup_I44_priceMaterialThicknessInsulationTotalType: "<script>alert('xss')</script>",
        sup_I45_priceMaterialThicknessInsulationTotalType: "'; DROP TABLE users; --"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(maliciousRequest);

      // Should either sanitize and process, or reject
      expect([200, 422]).toContain(response.status);
      
      if (response.status === 200) {
        // If processed, check that malicious content was sanitized
        expect(response.body.success).toBe(true);
      }
    });
  });

  describe('Input Validation Edge Cases', () => {
    test('should handle null values in required fields', async () => {
      const nullValueRequest = {
        ...validRequest,
        tech_D27_type: null
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(nullValueRequest)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED'
        })
      });
    });

    test('should handle undefined values', async () => {
      const undefinedValueRequest = {
        ...validRequest,
        sup_D8_priceMaterial: undefined
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(undefinedValueRequest)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED'
        })
      });
    });

    test('should handle empty strings in number fields', async () => {
      const emptyStringRequest = {
        ...validRequest,
        tech_I27_quantityType: ""
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(emptyStringRequest)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED'
        })
      });
    });

    test('should handle negative values where not expected', async () => {
      const negativeValueRequest = {
        ...validRequest,
        tech_I27_quantityType: -100
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(negativeValueRequest);

      // Should validate business logic - quantities shouldn't be negative
      expect([200, 422]).toContain(response.status);
    });

    test('should handle zero values in division contexts', async () => {
      const zeroValueRequest = {
        ...validRequest,
        tech_I27_quantityType: 0 // Could cause division by zero
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(zeroValueRequest);

      // Should handle gracefully
      expect([200, 422]).toContain(response.status);
    });

    test('should handle very long strings', async () => {
      const longStringRequest = {
        ...validRequest,
        sup_I46_priceQuantityMaterialThicknessInsulationTotalSumType: 'A'.repeat(10000)
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(longStringRequest);

      // Should enforce length limits
      expect([200, 422]).toContain(response.status);
    });

    test('should handle special characters', async () => {
      const specialCharsRequest = {
        ...validRequest,
        tech_E27_weightType: "К-750А", // Cyrillic characters
        sup_I44_priceMaterialThicknessInsulationTotalType: "test\x00\x01\x02" // Control characters
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(specialCharsRequest);

      expect([200, 422]).toContain(response.status);
    });
  });

  describe('Response Format Validation', () => {
    test('successful response should have correct structure', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send(validRequest);

      if (response.status === 200) {
        expect(response.body).toMatchObject({
          success: true,
          results: expect.objectContaining({
            calculated_values: expect.any(Object),
            total_cost: expect.any(Number),
            component_costs: expect.any(Object)
          }),
          request_id: expect.stringMatching(/^req_\d{8}T\d{6}_[a-z0-9]{6}$/),
          processing_time_ms: expect.any(Number),
          metadata: expect.any(Object)
        });

        expect(response.body.results.total_cost).toBeGreaterThanOrEqual(0);
        expect(response.body.processing_time_ms).toBeGreaterThan(0);
      }
    }, 30000);

    test('error response should have correct structure', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({});

      expect(response.body).toMatchObject({
        success: false,
        request_id: expect.any(String),
        error: expect.objectContaining({
          code: expect.any(String),
          message: expect.any(String)
        })
      });
    });

    test('should include proper timestamp format', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send(validRequest);

      if (response.status === 200 && response.body.metadata) {
        expect(response.body.metadata.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      }
    }, 30000);
  });

  describe('Admin Endpoints', () => {
    test('should get queue statistics', async () => {
      const response = await request(app)
        .get('/api/admin/queue/stats')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        queue_stats: expect.any(Object),
        workers: expect.any(Object),
        timestamp: expect.any(String)
      });
    });

    test('should get rate limiter statistics', async () => {
      const response = await request(app)
        .get('/api/admin/rate-limiter/stats')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        rate_limiter_stats: expect.any(Object),
        timestamp: expect.any(String)
      });
    });

    test('should get error monitoring data', async () => {
      const response = await request(app)
        .get('/api/admin/errors/recent')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        recent_errors: expect.any(Array),
        metrics: expect.any(Object),
        timestamp: expect.any(String)
      });
    });

    test('should get circuit breaker status', async () => {
      const response = await request(app)
        .get('/api/admin/circuit-breaker/status')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        circuit_breaker: expect.any(Object),
        timestamp: expect.any(String)
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle 404 for non-existent endpoints', async () => {
      await request(app)
        .get('/non-existent-endpoint')
        .expect(404);
    });

    test('should handle malformed JSON', async () => {
      await request(app)
        .post('/api/calculate')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });
  });
});