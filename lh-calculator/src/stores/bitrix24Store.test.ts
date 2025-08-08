import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useBitrix24Store, validateBitrix24Config, getBitrix24ConfigStatus, getBitrix24ExportStats } from './bitrix24Store';
import type { Bitrix24Config } from '../services/bitrix24.service';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Bitrix24Service
vi.mock('../services/bitrix24.service', () => ({
  Bitrix24Service: vi.fn().mockImplementation(() => ({
    testConnection: vi.fn().mockResolvedValue(true),
    createDeal: vi.fn().mockResolvedValue({
      id: 12345,
      title: 'Test Deal',
      opportunity: 1356336.64,
      currencyId: 'RUB',
      stageId: 'NEW'
    })
  }))
}));

describe('Bitrix24Store', () => {
  let mockResult: {
    totalCost: number;
    pressureTestHot: number;
    pressureTestCold: number;
    materialRequirements: Map<string, number>;
    componentCosts: {
      covers: number;
      columns: number;
      panelsA: number;
      panelsB: number;
      fasteners: number;
      flanges: number;
      gaskets: number;
      materials: number;
      total: number;
    };
    finalCostBreakdown: {
      U32_GrandTotal: number;
      N26_PlatePackage: number;
      P26_InternalSupports: number;
    };
  };

  beforeEach(() => {
    // Clear store state
    useBitrix24Store.getState().reset();
    
    mockResult = {
      totalCost: 1356336.64,
      pressureTestHot: 31.46,
      pressureTestCold: 31.46,
      materialRequirements: new Map([
        ['К4-750 Equipment', 1],
        ['Main Plate Mass', 1820.5952]
      ]),
      componentCosts: {
        covers: 150000,
        columns: 250000,
        panelsA: 120000,
        panelsB: 80000,
        fasteners: 50000,
        flanges: 450000,
        gaskets: 30000,
        materials: 276336.64,
        total: 1356336.64
      },
      finalCostBreakdown: {
        U32_GrandTotal: 1356336.64,
        N26_PlatePackage: 1274416.64,
        P26_InternalSupports: 81920
      }
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('Initial State', () => {
    it('should have default configuration', () => {
      const state = useBitrix24Store.getState();
      
      expect(state.config.method).toBe('webhook');
      expect(state.config.webhookUrl).toBe('');
      expect(state.isConfigured).toBe(false);
      expect(state.service).toBeNull();
      expect(state.isConnected).toBe(false);
      expect(state.isExporting).toBe(false);
      expect(state.exportHistory).toEqual([]);
    });
  });

  describe('Configuration Management', () => {
    it('should update webhook configuration', () => {
      const { updateConfig } = useBitrix24Store.getState();
      
      const config: Partial<Bitrix24Config> = {
        method: 'webhook',
        webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
      };

      updateConfig(config);
      const state = useBitrix24Store.getState();
      
      expect(state.config.method).toBe('webhook');
      expect(state.config.webhookUrl).toBe(config.webhookUrl);
      expect(state.isConfigured).toBe(true);
      expect(state.service).toBeDefined();
    });

    it('should update OAuth2 configuration', () => {
      const { updateConfig } = useBitrix24Store.getState();
      
      const config: Partial<Bitrix24Config> = {
        method: 'oauth2',
        portalUrl: 'https://company.bitrix24.ru',
        clientId: 'test_client',
        accessToken: 'test_token'
      };

      updateConfig(config);
      const state = useBitrix24Store.getState();
      
      expect(state.config.method).toBe('oauth2');
      expect(state.config.portalUrl).toBe(config.portalUrl);
      expect(state.config.clientId).toBe(config.clientId);
      expect(state.config.accessToken).toBe(config.accessToken);
      expect(state.isConfigured).toBe(true);
      expect(state.service).toBeDefined();
    });

    it('should mark configuration as incomplete for invalid webhook', () => {
      const { updateConfig } = useBitrix24Store.getState();
      
      const config: Partial<Bitrix24Config> = {
        method: 'webhook',
        webhookUrl: ''
      };

      updateConfig(config);
      const state = useBitrix24Store.getState();
      
      expect(state.isConfigured).toBe(false);
      expect(state.service).toBeNull();
    });

    it('should mark configuration as incomplete for invalid OAuth2', () => {
      const { updateConfig } = useBitrix24Store.getState();
      
      const config: Partial<Bitrix24Config> = {
        method: 'oauth2',
        portalUrl: 'https://company.bitrix24.ru',
        clientId: '',
        accessToken: ''
      };

      updateConfig(config);
      const state = useBitrix24Store.getState();
      
      expect(state.isConfigured).toBe(false);
      expect(state.service).toBeNull();
    });
  });

  describe('Connection Testing', () => {
    beforeEach(() => {
      // Setup valid webhook configuration
      const { updateConfig } = useBitrix24Store.getState();
      updateConfig({
        method: 'webhook',
        webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
      });
    });

    it('should test connection successfully', async () => {
      const { testConnection } = useBitrix24Store.getState();
      
      const connected = await testConnection();
      
      expect(connected).toBe(true);
      
      const state = useBitrix24Store.getState();
      expect(state.isConnected).toBe(true);
      expect(state.connectionError).toBeUndefined();
      expect(state.lastConnectionTest).toBeDefined();
    });

    it('should handle connection failure', async () => {
      // Mock service to return false
      const state = useBitrix24Store.getState();
      if (state.service) {
        vi.mocked(state.service.testConnection).mockResolvedValueOnce(false);
      }

      const { testConnection } = useBitrix24Store.getState();
      const connected = await testConnection();
      
      expect(connected).toBe(false);
      
      const newState = useBitrix24Store.getState();
      expect(newState.isConnected).toBe(false);
      expect(newState.connectionError).toBe('Connection test failed');
      expect(newState.lastConnectionTest).toBeDefined();
    });

    it('should handle service errors', async () => {
      // Mock service to throw error
      const state = useBitrix24Store.getState();
      if (state.service) {
        vi.mocked(state.service.testConnection).mockRejectedValueOnce(new Error('Network error'));
      }

      const { testConnection } = useBitrix24Store.getState();
      const connected = await testConnection();
      
      expect(connected).toBe(false);
      
      const newState = useBitrix24Store.getState();
      expect(newState.isConnected).toBe(false);
      expect(newState.connectionError).toBe('Network error');
    });

    it('should fail when service is not configured', async () => {
      // Reset to unconfigured state
      useBitrix24Store.getState().reset();
      
      const { testConnection } = useBitrix24Store.getState();
      const connected = await testConnection();
      
      expect(connected).toBe(false);
      
      const state = useBitrix24Store.getState();
      expect(state.connectionError).toBe('Bitrix24 service not configured');
    });
  });

  describe('Export Functionality', () => {
    beforeEach(() => {
      // Setup valid configuration
      const { updateConfig } = useBitrix24Store.getState();
      updateConfig({
        method: 'webhook',
        webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
      });
    });

    it('should export calculation successfully', async () => {
      const { exportToBitrix24 } = useBitrix24Store.getState();
      
      const deal = await exportToBitrix24(mockResult, 'Test Project');
      
      expect(deal.id).toBe(12345);
      expect(deal.title).toBe('Test Deal');
      
      const state = useBitrix24Store.getState();
      expect(state.isExporting).toBe(false);
      expect(state.exportHistory).toHaveLength(1);
      
      const export_ = state.exportHistory[0];
      expect(export_.status).toBe('success');
      expect(export_.dealId).toBe(12345);
      expect(export_.projectName).toBe('Test Project');
      expect(export_.totalCost).toBe(1356336.64);
    });

    it('should handle export errors', async () => {
      // Mock service to throw error
      const state = useBitrix24Store.getState();
      if (state.service) {
        vi.mocked(state.service.createDeal).mockRejectedValueOnce(new Error('API Error'));
      }

      const { exportToBitrix24 } = useBitrix24Store.getState();
      
      await expect(exportToBitrix24(mockResult, 'Test Project'))
        .rejects
        .toThrow('API Error');
      
      const newState = useBitrix24Store.getState();
      expect(newState.isExporting).toBe(false);
      expect(newState.exportHistory).toHaveLength(1);
      
      const export_ = newState.exportHistory[0];
      expect(export_.status).toBe('error');
      expect(export_.error).toBe('API Error');
    });

    it('should fail export when service is not configured', async () => {
      // Reset to unconfigured state
      useBitrix24Store.getState().reset();
      
      const { exportToBitrix24 } = useBitrix24Store.getState();
      
      await expect(exportToBitrix24(mockResult, 'Test Project'))
        .rejects
        .toThrow('Bitrix24 service not configured');
    });

    it('should include additional fields in export', async () => {
      const { exportToBitrix24 } = useBitrix24Store.getState();
      
      const additionalFields = {
        contactId: 98765,
        companyId: 54321
      };
      
      await exportToBitrix24(mockResult, 'Test Project', additionalFields);
      
      const state = useBitrix24Store.getState();
      if (state.service) {
        expect(state.service.createDeal).toHaveBeenCalledWith(
          mockResult,
          'Test Project',
          additionalFields
        );
      }
    });
  });

  describe('History Management', () => {
    beforeEach(() => {
      // Setup valid configuration and add some history
      const { updateConfig } = useBitrix24Store.getState();
      updateConfig({
        method: 'webhook',
        webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
      });
    });

    it('should clear export history', async () => {
      const { exportToBitrix24, clearHistory } = useBitrix24Store.getState();
      
      // Add some exports
      await exportToBitrix24(mockResult, 'Project 1');
      await exportToBitrix24(mockResult, 'Project 2');
      
      expect(useBitrix24Store.getState().exportHistory).toHaveLength(2);
      
      clearHistory();
      
      expect(useBitrix24Store.getState().exportHistory).toHaveLength(0);
    });

    it('should remove specific history item', async () => {
      const { exportToBitrix24, removeHistoryItem } = useBitrix24Store.getState();
      
      // Add an export
      await exportToBitrix24(mockResult, 'Test Project');
      
      const { exportHistory } = useBitrix24Store.getState();
      expect(exportHistory).toHaveLength(1);
      
      const exportId = exportHistory[0].id;
      removeHistoryItem(exportId);
      
      expect(useBitrix24Store.getState().exportHistory).toHaveLength(0);
    });

    it('should maintain export history order (newest first)', async () => {
      const { exportToBitrix24 } = useBitrix24Store.getState();
      
      // Add exports with delays to ensure different timestamps
      await exportToBitrix24(mockResult, 'Project 1');
      await new Promise(resolve => setTimeout(resolve, 10));
      await exportToBitrix24(mockResult, 'Project 2');
      
      const { exportHistory } = useBitrix24Store.getState();
      expect(exportHistory).toHaveLength(2);
      expect(exportHistory[0].projectName).toBe('Project 2'); // Newest first
      expect(exportHistory[1].projectName).toBe('Project 1');
    });
  });

  describe('State Reset', () => {
    it('should reset all state to defaults', async () => {
      const { updateConfig, exportToBitrix24, reset } = useBitrix24Store.getState();
      
      // Setup configuration and add history
      updateConfig({
        method: 'webhook',
        webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
      });
      
      await exportToBitrix24(mockResult, 'Test Project');
      
      // Verify state is populated
      let state = useBitrix24Store.getState();
      expect(state.isConfigured).toBe(true);
      expect(state.exportHistory).toHaveLength(1);
      
      // Reset
      reset();
      
      // Verify state is back to defaults
      state = useBitrix24Store.getState();
      expect(state.config.webhookUrl).toBe('');
      expect(state.isConfigured).toBe(false);
      expect(state.service).toBeNull();
      expect(state.isConnected).toBe(false);
      expect(state.exportHistory).toEqual([]);
    });
  });

  describe('Helper Functions', () => {
    describe('validateBitrix24Config', () => {
      it('should validate webhook configuration', () => {
        const validWebhook = {
          method: 'webhook' as const,
          webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
        };
        
        const invalidWebhook = {
          method: 'webhook' as const,
          webhookUrl: ''
        };

        expect(validateBitrix24Config(validWebhook)).toBe(true);
        expect(validateBitrix24Config(invalidWebhook)).toBe(false);
      });

      it('should validate OAuth2 configuration', () => {
        const validOAuth2 = {
          method: 'oauth2' as const,
          portalUrl: 'https://company.bitrix24.ru',
          clientId: 'test_client',
          accessToken: 'test_token'
        };
        
        const invalidOAuth2 = {
          method: 'oauth2' as const,
          portalUrl: '',
          clientId: '',
          accessToken: ''
        };

        expect(validateBitrix24Config(validOAuth2)).toBe(true);
        expect(validateBitrix24Config(invalidOAuth2)).toBe(false);
      });
    });

    describe('getBitrix24ConfigStatus', () => {
      it('should return appropriate status messages', () => {
        // Reset state
        useBitrix24Store.getState().reset();
        
        expect(getBitrix24ConfigStatus()).toBe('Webhook URL required');
        
        // Set OAuth2 method
        useBitrix24Store.getState().updateConfig({ method: 'oauth2' });
        expect(getBitrix24ConfigStatus()).toBe('OAuth2 configuration incomplete');
        
        // Complete webhook config
        useBitrix24Store.getState().updateConfig({
          method: 'webhook',
          webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
        });
        expect(getBitrix24ConfigStatus()).toBe('Configuration complete');
      });
    });

    describe('getBitrix24ExportStats', () => {
      it('should calculate export statistics', async () => {
        // Setup configuration
        const { updateConfig, exportToBitrix24 } = useBitrix24Store.getState();
        updateConfig({
          method: 'webhook',
          webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
        });

        // Add successful export
        await exportToBitrix24(mockResult, 'Project 1');
        
        // Add failed export
        const state = useBitrix24Store.getState();
        if (state.service) {
          vi.mocked(state.service.createDeal).mockRejectedValueOnce(new Error('Test error'));
        }
        
        try {
          await exportToBitrix24(mockResult, 'Project 2');
        } catch {
          // Expected to fail
        }

        const stats = getBitrix24ExportStats();
        
        expect(stats.total).toBe(2);
        expect(stats.successful).toBe(1);
        expect(stats.failed).toBe(1);
        expect(stats.pending).toBe(0);
        expect(stats.last24h).toBe(2);
      });

      it('should handle empty history', () => {
        useBitrix24Store.getState().reset();
        
        const stats = getBitrix24ExportStats();
        
        expect(stats.total).toBe(0);
        expect(stats.successful).toBe(0);
        expect(stats.failed).toBe(0);
        expect(stats.pending).toBe(0);
        expect(stats.last24h).toBe(0);
      });
    });
  });

  describe('Persistence', () => {
    it('should persist configuration and history', async () => {
      const { updateConfig, exportToBitrix24 } = useBitrix24Store.getState();
      
      // Setup configuration
      const config = {
        method: 'webhook' as const,
        webhookUrl: 'https://company.bitrix24.ru/rest/1/xxxxx/'
      };
      
      updateConfig(config);
      await exportToBitrix24(mockResult, 'Test Project');
      
      // Check that localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalled();
      
      // Verify persisted data structure
      const setItemCalls = vi.mocked(localStorageMock.setItem).mock.calls;
      const lastCall = setItemCalls[setItemCalls.length - 1];
      const [key, value] = lastCall;
      
      expect(key).toBe('bitrix24-store');
      
      const persistedData = JSON.parse(value);
      expect(persistedData.state.config).toMatchObject(config);
      expect(persistedData.state.exportHistory).toHaveLength(1);
    });
  });
});