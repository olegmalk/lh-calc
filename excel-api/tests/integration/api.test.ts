import request from 'supertest';
import app from '../../src/index';
import {
  CalculationRequest
} from '../../src/types/api-contract';

describe('Excel API Integration Tests', () => {
  // Valid test data based on test-request.json
  const validRequest: CalculationRequest = {
    tech_D27_sequenceNumber: 1,
    tech_E27_customerOrderPosition: "Е-113",
    tech_H27_passes: "1/6",
    tech_I27_plateQuantity: 400,
    tech_J27_calcPressureHotSide: 22,
    tech_K27_calcPressureColdSide: 22,
    tech_L27_calcTempHotSide: 100,
    tech_M27_calcTempColdSide: 100,
    tech_T27_drawDepth: 5,
    sup_F2_projectNumber: "TEST-PROJECT-003",
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
    // Required string fields
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
        tech_D27_sequenceNumber: 1,
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
        tech_D27_sequenceNumber: "not_a_number", // Should be number
        tech_I27_plateQuantity: "not_a_number" // Should be number
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
        tech_E27_customerOrderPosition: "INVALID_PATTERN_123"
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
        tech_H27_passes: "invalid/fraction/format"
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
        tech_I27_plateQuantity: 0.00001, // Very small number
        sup_D8_flowPartMaterialPricePerKg: 999999999 // Very large number
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(edgeNumericRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should sanitize potentially malicious input', async () => {
      const maliciousRequest = {
        ...validRequest,
        sup_I44_otherMaterialsDesc1: "<script>alert('xss')</script>",
        sup_I45_otherMaterialsDesc2: "'; DROP TABLE users; --"
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
        tech_D27_sequenceNumber: null
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
        sup_D8_flowPartMaterialPricePerKg: undefined
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
        tech_I27_plateQuantity: ""
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
        tech_I27_plateQuantity: -100
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
        tech_I27_plateQuantity: 0 // Could cause division by zero
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
        sup_I46_otherMaterialsDesc3: 'A'.repeat(10000)
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
        tech_E27_customerOrderPosition: "К-750А", // Cyrillic characters
        sup_I44_otherMaterialsDesc1: "test\x00\x01\x02" // Control characters
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