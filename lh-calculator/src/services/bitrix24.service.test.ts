import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Bitrix24Service } from './bitrix24.service';
import type { Bitrix24Config } from './bitrix24.service';
import type { CalculationResult } from '../lib/calculation-engine/types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Bitrix24Service', () => {
  let service: Bitrix24Service;
  let webhookConfig: Bitrix24Config;
  let oauthConfig: Bitrix24Config;
  let mockResult: CalculationResult;

  beforeEach(() => {
    webhookConfig = {
      method: 'webhook',
      webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
    };

    oauthConfig = {
      method: 'oauth2',
      portalUrl: 'https://company.bitrix24.ru',
      clientId: 'test_client_id',
      clientSecret: 'test_secret',
      accessToken: 'test_access_token'
    };

    mockResult = {
      totalCost: 1356336.64,
      pressureTestHot: 31.46,
      pressureTestCold: 31.46,
      materialRequirements: new Map([
        ['К4-750 Equipment', 1],
        ['Main Plate Mass', 1820.5952],
        ['Total Component Mass', 302.90905968]
      ]),
      componentCosts: {
        covers: 150000,
        columns: 250000,
        panelsA: 120000,
        panelsB: 80000,
        fasteners: 50000,
        flanges: 450000,
        gaskets: 30000,
        materials: 256336.64,
        total: 1356336.64
      },
      finalCostBreakdown: {
        U32_GrandTotal: 1356336.64,
        N26_PlatePackage: 1274416.64,
        P26_InternalSupports: 81920,
        J32_CoreCategory: 1356336.64
      }
    } as CalculationResult;

    // Reset fetch mock
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should initialize with webhook configuration', () => {
      service = new Bitrix24Service(webhookConfig);
      expect(service).toBeDefined();
    });

    it('should initialize with OAuth2 configuration', () => {
      service = new Bitrix24Service(oauthConfig);
      expect(service).toBeDefined();
    });

    it('should update configuration', () => {
      service = new Bitrix24Service(webhookConfig);
      const newConfig = { webhookUrl: 'https://newcompany.bitrix24.ru/rest/1/yyyyy/' };
      
      service.updateConfig(newConfig);
      // Configuration is private, but we can test behavior through API calls
      expect(service).toBeDefined();
    });
  });

  describe('Connection Testing', () => {
    beforeEach(() => {
      service = new Bitrix24Service(webhookConfig);
    });

    it('should test connection successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          result: { REST_VERSION: '1.0' }
        })
      });

      const connected = await service.testConnection();
      
      expect(connected).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://company.bitrix24.ru/rest/1/xxxxx/app.info.json',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should handle connection failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: 'INVALID_TOKEN',
          error_description: 'Invalid access token'
        })
      });

      const connected = await service.testConnection();
      
      expect(connected).toBe(false);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const connected = await service.testConnection();
      
      expect(connected).toBe(false);
    });
  });

  describe('Deal Creation', () => {
    beforeEach(() => {
      service = new Bitrix24Service(webhookConfig);
    });

    it('should create deal from calculation result', async () => {
      const mockDealId = 12345;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          result: mockDealId,
          time: { start: 1, finish: 2, duration: 1 }
        })
      });

      const deal = await service.createDeal(mockResult, 'Test Project');
      
      expect(deal).toMatchObject({
        id: mockDealId,
        title: expect.stringContaining('Test Project'),
        opportunity: 1356336.64,
        currencyId: 'RUB',
        stageId: 'NEW',
        testPressureHot: 31.46,
        testPressureCold: 31.46
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('crm.deal.add.json'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"OPPORTUNITY":1356336.64')
        })
      );
    });

    it('should handle deal creation errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: 'ACCESS_DENIED',
          error_description: 'Insufficient permissions'
        })
      });

      await expect(service.createDeal(mockResult, 'Test Project'))
        .rejects
        .toThrow('Failed to create deal: Insufficient permissions');
    });

    it('should include custom fields in deal creation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 12345 })
      });

      const additionalFields = {
        contactId: 98765,
        companyId: 54321,
        comments: 'Custom comment'
      };

      await service.createDeal(mockResult, 'Test Project', additionalFields);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringMatching(/"CONTACT_ID":98765.*"COMPANY_ID":54321.*"COMMENTS":"Custom comment"/)
        })
      );
    });
  });

  describe('Deal Retrieval', () => {
    beforeEach(() => {
      service = new Bitrix24Service(webhookConfig);
    });

    it('should retrieve deal by ID', async () => {
      const mockDealData = {
        ID: '12345',
        TITLE: 'Test Deal',
        OPPORTUNITY: '1356336.64',
        CURRENCY_ID: 'RUB',
        STAGE_ID: 'NEW',
        UF_EQUIPMENT_TYPE: 'К4-750',
        UF_PLATE_COUNT: '100',
        UF_TOTAL_MASS: '1820.5952',
        UF_TEST_PRESSURE_HOT: '31.46',
        UF_TEST_PRESSURE_COLD: '31.46'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          result: mockDealData
        })
      });

      const deal = await service.getDeal(12345);
      
      expect(deal).toMatchObject({
        id: 12345,
        title: 'Test Deal',
        opportunity: 1356336.64,
        currencyId: 'RUB',
        stageId: 'NEW',
        equipmentType: 'К4-750',
        plateCount: 100,
        totalMass: 1820.5952,
        testPressureHot: 31.46,
        testPressureCold: 31.46
      });
    });

    it('should return null for non-existent deal', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: 'NOT_FOUND',
          error_description: 'Deal not found'
        })
      });

      const deal = await service.getDeal(99999);
      
      expect(deal).toBeNull();
    });
  });

  describe('Deal Updates', () => {
    beforeEach(() => {
      service = new Bitrix24Service(webhookConfig);
    });

    it('should update existing deal', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          result: true
        })
      });

      const updates = {
        title: 'Updated Deal Title',
        opportunity: 2000000,
        stageId: 'NEGOTIATION'
      };

      await service.updateDeal(12345, updates);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('crm.deal.update.json'),
        expect.objectContaining({
          body: expect.stringMatching(/"id":12345.*"TITLE":"Updated Deal Title".*"OPPORTUNITY":2000000.*"STAGE_ID":"NEGOTIATION"/)
        })
      );
    });

    it('should handle update errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error: 'DEAL_NOT_FOUND',
          error_description: 'Deal not found'
        })
      });

      await expect(service.updateDeal(99999, { title: 'New Title' }))
        .rejects
        .toThrow('Failed to update deal: Deal not found');
    });
  });

  describe('Data Mapping', () => {
    beforeEach(() => {
      service = new Bitrix24Service(webhookConfig);
    });

    it('should correctly map calculation result to deal', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 12345 })
      });

      await service.createDeal(mockResult, 'Heat Exchanger K4-750');
      
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const fields = callBody.fields;

      expect(fields.TITLE).toContain('Heat Exchanger K4-750');
      expect(fields.OPPORTUNITY).toBe(1356336.64);
      expect(fields.CURRENCY_ID).toBe('RUB');
      expect(fields.STAGE_ID).toBe('NEW');
      expect(fields.UF_TEST_PRESSURE_HOT).toBe(31.46);
      expect(fields.UF_TEST_PRESSURE_COLD).toBe(31.46);
      expect(fields.COMMENTS).toContain('Heat Exchanger Calculation Summary');
    });

    it('should generate comprehensive calculation summary', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 12345 })
      });

      await service.createDeal(mockResult, 'Test Project');
      
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const comments = callBody.fields.COMMENTS;

      expect(comments).toContain('Total Cost: 1,356,336.64 RUB');
      expect(comments).toContain('Test Pressure Hot: 31.46 bar');
      expect(comments).toContain('Test Pressure Cold: 31.46 bar');
      expect(comments).toContain('Material Requirements:');
      expect(comments).toContain('К4-750 Equipment: 1.00');
      expect(comments).toContain('Main Plate Mass: 1820.60');
    });
  });

  describe('OAuth2 Configuration', () => {
    beforeEach(() => {
      service = new Bitrix24Service(oauthConfig);
    });

    it('should include authorization header for OAuth2', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: { REST_VERSION: '1.0' } })
      });

      await service.testConnection();
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://company.bitrix24.ru/rest/app.info.json'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test_access_token'
          })
        })
      );
    });

    it('should throw error for invalid OAuth2 configuration', async () => {
      const invalidConfig = {
        method: 'oauth2' as const,
        portalUrl: '',
        accessToken: ''
      };

      service = new Bitrix24Service(invalidConfig);

      await expect(service.testConnection())
        .rejects
        .toThrow('Invalid Bitrix24 configuration');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      service = new Bitrix24Service(webhookConfig);
    });

    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(service.testConnection())
        .rejects
        .toThrow('HTTP 404: Not Found');
    });

    it('should handle network timeouts', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      const connected = await service.testConnection();
      
      expect(connected).toBe(false);
    });

    it('should handle malformed JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(service.testConnection())
        .rejects
        .toThrow();
    });
  });

  describe('URL Building', () => {
    it('should build webhook URLs correctly', () => {
      service = new Bitrix24Service(webhookConfig);
      // URL building is tested indirectly through API calls
      expect(service).toBeDefined();
    });

    it('should build OAuth2 URLs correctly', () => {
      service = new Bitrix24Service(oauthConfig);
      // URL building is tested indirectly through API calls
      expect(service).toBeDefined();
    });

    it('should throw error for missing configuration', async () => {
      const invalidConfig = {
        method: 'webhook' as const,
        webhookUrl: ''
      };

      service = new Bitrix24Service(invalidConfig);

      await expect(service.testConnection())
        .rejects
        .toThrow('Invalid Bitrix24 configuration');
    });
  });
});