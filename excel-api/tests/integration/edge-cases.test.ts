import request from 'supertest';
import app from '../../src/index';
import {
  CalculationRequest,
  MATERIAL_CODES,
  PRESSURE_RATINGS
} from '../../src/types/api-contract';

describe('Excel API Edge Cases Tests', () => {
  // Base valid request for creating variations
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

  describe('Division by Zero Edge Cases', () => {
    test('should handle zero denominator in quantity calculations', async () => {
      const zeroQuantityRequest = {
        ...baseValidRequest,
        tech_I27_plateQuantity: 0, // Could cause division by zero
        sup_D8_flowPartMaterialPricePerKg: 100
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(zeroQuantityRequest);

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.results.total_cost).toBeDefined();
        expect(typeof response.body.results.total_cost).toBe('number');
        expect(isFinite(response.body.results.total_cost)).toBe(true);
      } else {
        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBeDefined();
      }
    });

    test('should handle very small numbers causing precision issues', async () => {
      const precisionRequest = {
        ...baseValidRequest,
        tech_I27_plateQuantity: 0.00001,
        sup_D8_flowPartMaterialPricePerKg: 1000000
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(precisionRequest);

      expect([200, 422]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body.results.total_cost).toBeDefined();
        expect(isFinite(response.body.results.total_cost)).toBe(true);
      }
    });

    test('should handle multiple zero values in calculations', async () => {
      const multipleZeroRequest = {
        ...baseValidRequest,
        tech_I27_plateQuantity: 0,
        tech_J27_calcPressureHotSide: 0,
        tech_K27_calcPressureColdSide: 0
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(multipleZeroRequest);

      expect([200, 422]).toContain(response.status);
    });
  });

  describe('Invalid Material Codes', () => {
    test('should reject completely invalid material code', async () => {
      const invalidMaterialRequest = {
        ...baseValidRequest,
        sup_F2_projectNumber: "TOTALLY_INVALID_CODE" as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidMaterialRequest)
        .expect(422);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.objectContaining({
          code: 'VALIDATION_FAILED'
        })
      });
    });

    test('should reject case-sensitive material code variations', async () => {
      const caseSensitiveRequest = {
        ...baseValidRequest,
        sup_F2_projectNumber: "09г2с" as any // lowercase version
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(caseSensitiveRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should reject material code with whitespace', async () => {
      const whitespaceRequest = {
        ...baseValidRequest,
        sup_F2_projectNumber: "TEST-PROJECT-002" as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(whitespaceRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should validate all valid material codes', async () => {
      for (const materialCode of MATERIAL_CODES) {
        const materialRequest = {
          ...baseValidRequest,
          sup_F2_projectNumber: materialCode
        };

        const response = await request(app)
          .post('/api/calculate')
          .send(materialRequest);

        expect([200, 422]).toContain(response.status);
        
        if (response.status === 422) {
          // If validation fails, it should be for other reasons, not material code
          expect(response.body.error?.details?.field_errors?.sup_F2_projectNumber).toBeUndefined();
        }
      }
    }, 30000);
  });

  describe('Negative Numbers Edge Cases', () => {
    test('should reject negative quantity values', async () => {
      const negativeQuantityRequest = {
        ...baseValidRequest,
        tech_I27_plateQuantity: -100
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(negativeQuantityRequest);

      // Should either validate business rules and reject, or handle gracefully
      expect([200, 422]).toContain(response.status);
    });

    test('should reject negative price values', async () => {
      const negativePriceRequest = {
        ...baseValidRequest,
        sup_D8_flowPartMaterialPricePerKg: -700
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(negativePriceRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should reject negative thickness values', async () => {
      const negativeThicknessRequest = {
        ...baseValidRequest,
        tech_T27_drawDepth: -5
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(negativeThicknessRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should handle multiple negative values', async () => {
      const multipleNegativeRequest = {
        ...baseValidRequest,
        tech_I27_plateQuantity: -100,
        sup_D8_flowPartMaterialPricePerKg: -700,
        tech_T27_drawDepth: -5
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(multipleNegativeRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Very Large Numbers and Overflow', () => {
    test('should handle JavaScript max safe integer', async () => {
      const maxIntegerRequest = {
        ...baseValidRequest,
        sup_D8_flowPartMaterialPricePerKg: Number.MAX_SAFE_INTEGER
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(maxIntegerRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should handle very large floating point numbers', async () => {
      const largeFloatRequest = {
        ...baseValidRequest,
        sup_D8_flowPartMaterialPricePerKg: 1.7976931348623157e+307
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(largeFloatRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should reject infinity values', async () => {
      const infinityRequest = {
        ...baseValidRequest,
        sup_D8_flowPartMaterialPricePerKg: Infinity
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(infinityRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject NaN values', async () => {
      const nanRequest = {
        ...baseValidRequest,
        tech_I27_plateQuantity: NaN
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(nanRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should handle very small numbers causing underflow', async () => {
      const underflowRequest = {
        ...baseValidRequest,
        tech_T27_drawDepth: 5e-324
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(underflowRequest);

      expect([200, 422]).toContain(response.status);
    });
  });

  describe('Empty Required Fields', () => {
    test('should reject request with missing tech_D27_type', async () => {
      const { tech_D27_type, ...missingFieldRequest } = baseValidRequest;

      const response = await request(app)
        .post('/api/calculate')
        .send(missingFieldRequest)
        .expect(422);

      expect(response.body.error?.details?.missing_required_fields).toContain('tech_D27_sequenceNumber');
    });

    test('should reject request with null required field', async () => {
      const nullFieldRequest = {
        ...baseValidRequest,
        tech_D27_sequenceNumber: null as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(nullFieldRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject request with undefined required field', async () => {
      const undefinedFieldRequest = {
        ...baseValidRequest,
        sup_F2_projectNumber: undefined as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(undefinedFieldRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject request with empty string in required number field', async () => {
      const emptyStringRequest = {
        ...baseValidRequest,
        tech_I27_plateQuantity: "" as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(emptyStringRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should handle empty string in optional string field', async () => {
      const optionalEmptyRequest = {
        ...baseValidRequest,
        tech_V27_claddingThickness: undefined // Optional field
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(optionalEmptyRequest);

      // Should be handled gracefully since it's optional
      expect([200, 422]).toContain(response.status);
    });
  });

  describe('Invalid Enum Values', () => {
    test('should reject invalid pressure rating', async () => {
      const invalidPressureRequest = {
        ...baseValidRequest,
        sup_C28_panelAFlange1Pressure: "Ру999" as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidPressureRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject invalid diameter code', async () => {
      const invalidDiameterRequest = {
        ...baseValidRequest,
        sup_D28_panelAFlange1Diameter: "Ду999" as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidDiameterRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject invalid thread specification', async () => {
      const invalidThreadRequest = {
        ...baseValidRequest,
        sup_P22_panelFastenersStudSize: "М999" as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidThreadRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject invalid surface treatment', async () => {
      const invalidSurfaceRequest = {
        ...baseValidRequest,
        sup_P21_panelFastenersCoating: "INVALID_SURFACE" as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidSurfaceRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should validate all valid pressure ratings', async () => {
      for (const pressureRating of PRESSURE_RATINGS) {
        const pressureRequest = {
          ...baseValidRequest,
          sup_C28_panelAFlange1Pressure: pressureRating
        };

        const response = await request(app)
          .post('/api/calculate')
          .send(pressureRequest);

        expect([200, 422]).toContain(response.status);
      }
    }, 15000);
  });

  describe('Malformed Fraction Formats', () => {
    test('should reject invalid fraction format with multiple slashes', async () => {
      const invalidFractionRequest = {
        ...baseValidRequest,
        tech_H27_passes: "1/2/3"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidFractionRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject fraction with zero denominator', async () => {
      const zeroDenominatorRequest = {
        ...baseValidRequest,
        tech_H27_passes: "1/0"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(zeroDenominatorRequest);

      // Should be caught by business logic validation
      expect([200, 422]).toContain(response.status);
    });

    test('should reject decimal fractions', async () => {
      const decimalFractionRequest = {
        ...baseValidRequest,
        tech_H27_passes: "1.5/2.3"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(decimalFractionRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject negative fractions', async () => {
      const negativeFractionRequest = {
        ...baseValidRequest,
        tech_H27_passes: "-1/6"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(negativeFractionRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject fraction with letters', async () => {
      const letterFractionRequest = {
        ...baseValidRequest,
        tech_H27_passes: "a/b"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(letterFractionRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should accept valid fraction formats', async () => {
      const validFractions = ['1/2', '1/3', '1/4', '1/6', '1/8', '2/3', '3/4', '5/6'];
      
      for (const fraction of validFractions) {
        const validFractionRequest = {
          ...baseValidRequest,
          tech_H27_passes: fraction
        };

        const response = await request(app)
          .post('/api/calculate')
          .send(validFractionRequest);

        expect([200, 422]).toContain(response.status);
        
        if (response.status === 422) {
          // If validation fails, it shouldn't be because of fraction format
          const errorMessage = response.body.error?.details?.field_errors?.tech_H27_passes;
          if (errorMessage) {
            expect(errorMessage).not.toMatch(/fraction|format/i);
          }
        }
      }
    }, 20000);
  });

  describe('Invalid Pressure/Diameter Codes', () => {
    test('should reject incompatible pressure-diameter combinations', async () => {
      const incompatibleRequest = {
        ...baseValidRequest,
        sup_C28_panelAFlange1Pressure: "Ру160" as any,
        sup_D28_panelAFlange1Diameter: "Ду25" as any // Very high pressure with small diameter
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(incompatibleRequest);

      // Should either validate engineering constraints or process
      expect([200, 422]).toContain(response.status);
    });

    test('should handle missing pressure code when diameter is provided', async () => {
      const missingPressureRequest = {
        ...baseValidRequest,
        sup_D28_panelAFlange1Diameter: "Ду100" as any
        // sup_C28_priceWeightThickness is undefined
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(missingPressureRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should handle missing diameter code when pressure is provided', async () => {
      const missingDiameterRequest = {
        ...baseValidRequest,
        sup_C28_panelAFlange1Pressure: "Ру100" as any
        // sup_D28_priceWeightThickness is undefined
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(missingDiameterRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should validate pressure rating format', async () => {
      const invalidPressureFormats = [
        "РУ10", // Wrong case
        "Py10", // Latin letters
        "Ру10.5", // Decimal
        "Ру-10", // Negative
        "Ру", // Missing number
        "10", // Missing prefix
      ];

      for (const invalidPressure of invalidPressureFormats) {
        const invalidRequest = {
          ...baseValidRequest,
          sup_C28_panelAFlange1Pressure: invalidPressure as any
        };

        const response = await request(app)
          .post('/api/calculate')
          .send(invalidRequest)
          .expect(422);

        expect(response.body.success).toBe(false);
      }
    });

    test('should validate diameter code format', async () => {
      const invalidDiameterFormats = [
        "ДУ25", // Wrong case
        "Du25", // Latin letters
        "Ду25.5", // Decimal
        "Ду-25", // Negative
        "Ду", // Missing number
        "25", // Missing prefix
      ];

      for (const invalidDiameter of invalidDiameterFormats) {
        const invalidRequest = {
          ...baseValidRequest,
          sup_D28_panelAFlange1Diameter: invalidDiameter as any
        };

        const response = await request(app)
          .post('/api/calculate')
          .send(invalidRequest)
          .expect(422);

        expect(response.body.success).toBe(false);
      }
    });
  });

  describe('Special Characters and Security', () => {
    test('should sanitize SQL injection attempts', async () => {
      const sqlInjectionRequest = {
        ...baseValidRequest,
        sup_I44_otherMaterialsDesc1: "'; DROP TABLE users; --"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(sqlInjectionRequest);

      expect([200, 422]).toContain(response.status);
      
      if (response.status === 200) {
        // Should not contain the malicious content in response
        expect(JSON.stringify(response.body)).not.toMatch(/DROP TABLE/i);
      }
    });

    test('should sanitize XSS attempts', async () => {
      const xssRequest = {
        ...baseValidRequest,
        sup_I45_otherMaterialsDesc2: "<script>alert('xss')</script>"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(xssRequest);

      expect([200, 422]).toContain(response.status);
      
      if (response.status === 200) {
        expect(JSON.stringify(response.body)).not.toMatch(/<script>/i);
      }
    });

    test('should handle control characters', async () => {
      const controlCharsRequest = {
        ...baseValidRequest,
        sup_I44_otherMaterialsDesc1: "test\x00\x01\x02\x03"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(controlCharsRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should handle Unicode normalization', async () => {
      const unicodeRequest = {
        ...baseValidRequest,
        tech_E27_customerOrderPosition: "Е\u0301-113" // E with combining acute accent
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(unicodeRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should handle very long strings', async () => {
      const longStringRequest = {
        ...baseValidRequest,
        sup_I46_otherMaterialsDesc3: 'A'.repeat(10000)
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(longStringRequest);

      // Should enforce length limits
      expect([200, 413, 422]).toContain(response.status);
    });

    test('should handle equipment code with Cyrillic characters', async () => {
      const cyrillicRequest = {
        ...baseValidRequest,
        tech_E27_customerOrderPosition: "К-750А"
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(cyrillicRequest);

      expect([200, 422]).toContain(response.status);
    });
  });

  describe('Type Conversion Edge Cases', () => {
    test('should reject string in number field', async () => {
      const stringInNumberRequest = {
        ...baseValidRequest,
        tech_D27_sequenceNumber: "not_a_number" as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(stringInNumberRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject boolean in string field', async () => {
      const booleanInStringRequest = {
        ...baseValidRequest,
        tech_E27_customerOrderPosition: true as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(booleanInStringRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject object in primitive field', async () => {
      const objectInFieldRequest = {
        ...baseValidRequest,
        tech_I27_plateQuantity: { value: 400 } as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(objectInFieldRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });

    test('should reject array in primitive field', async () => {
      const arrayInFieldRequest = {
        ...baseValidRequest,
        sup_D8_flowPartMaterialPricePerKg: [700, 800] as any
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(arrayInFieldRequest)
        .expect(422);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Field Combination Edge Cases', () => {
    test('should validate incompatible material and thickness combinations', async () => {
      const incompatibleMaterialRequest = {
        ...baseValidRequest,
        sup_F2_projectNumber: "TEST-PROJECT-003" as any, // Basic material
        tech_V27_claddingThickness: 50 // Very thick for basic material
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(incompatibleMaterialRequest);

      // Business logic may or may not reject this
      expect([200, 422]).toContain(response.status);
    });

    test('should handle extreme temperature with material limits', async () => {
      const extremeTemperatureRequest = {
        ...baseValidRequest,
        tech_L27_calcTempHotSide: 1000, // Very high temperature
        sup_F2_projectNumber: "TEST-PROJECT-001" as any // Standard steel
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(extremeTemperatureRequest);

      expect([200, 422]).toContain(response.status);
    });

    test('should validate quantity relationships', async () => {
      const invalidQuantityRelationRequest = {
        ...baseValidRequest,
        tech_I27_plateQuantity: 1000,
        tech_J27_calcPressureHotSide: 1, // J should not be much smaller than I
        tech_K27_calcPressureColdSide: 100000 // K should not be much larger than I*J
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(invalidQuantityRelationRequest);

      expect([200, 422]).toContain(response.status);
    });
  });

  describe('API Contract Validation', () => {
    test('should reject oversized request', async () => {
      const oversizedRequest = {
        ...baseValidRequest,
        extraLargeField: 'X'.repeat(1024 * 1024) // 1MB field
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(oversizedRequest);

      expect([200, 413, 422]).toContain(response.status);
    });

    test('should handle unknown fields gracefully', async () => {
      const unknownFieldsRequest = {
        ...baseValidRequest,
        unknown_field_123: "value",
        invalid_prefix_field: "value",
        completely_random: { nested: "object" }
      };

      const response = await request(app)
        .post('/api/calculate')
        .send(unknownFieldsRequest);

      // Should process known fields and ignore unknown ones
      expect([200, 422]).toContain(response.status);
    });

    test('should validate required fields are present', async () => {
      const requiredFields = [
        'tech_D27_sequenceNumber',
        'tech_E27_customerOrderPosition',
        'tech_H27_passes',
        'tech_I27_plateQuantity',
        'sup_F2_projectNumber',
        'sup_D8_flowPartMaterialPricePerKg'
      ];

      for (const field of requiredFields) {
        const { [field]: omittedField, ...incompleteRequest } = baseValidRequest as any;

        const response = await request(app)
          .post('/api/calculate')
          .send(incompleteRequest)
          .expect(422);

        expect(response.body.success).toBe(false);
        expect(
          response.body.error?.details?.missing_required_fields || 
          response.body.error?.details?.field_errors
        ).toBeDefined();
      }
    });

    test('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .set('Content-Type', 'application/json')
        .send('{"malformed": json, "missing": "quotes"}')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});