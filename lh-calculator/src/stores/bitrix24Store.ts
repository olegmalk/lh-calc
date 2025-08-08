import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bitrix24Service, type Bitrix24Config, type Bitrix24Deal } from '../services/bitrix24.service';

export interface ExportHistory {
  id: string;
  timestamp: Date;
  dealId?: number;
  dealTitle: string;
  status: 'success' | 'error' | 'pending';
  error?: string;
  projectName: string;
  totalCost: number;
}

// Validate configuration completeness
const validateConfigInternal = (config: Bitrix24Config): boolean => {
  if (config.method === 'webhook') {
    return Boolean(config.webhookUrl?.trim());
  }
  
  if (config.method === 'oauth2') {
    return Boolean(
      config.portalUrl?.trim() &&
      config.clientId?.trim() &&
      config.accessToken?.trim()
    );
  }
  
  return false;
};

interface Bitrix24State {
  // Configuration
  config: Bitrix24Config;
  isConfigured: boolean;
  
  // Service instance
  service: Bitrix24Service | null;
  
  // Connection status
  isConnected: boolean;
  lastConnectionTest?: Date;
  connectionError?: string;
  
  // Export state
  isExporting: boolean;
  exportHistory: ExportHistory[];
  
  // Actions
  updateConfig: (config: Partial<Bitrix24Config>) => void;
  testConnection: () => Promise<boolean>;
  exportToBitrix24: (
    result: any,
    projectName: string,
    additionalFields?: Partial<Bitrix24Deal>
  ) => Promise<Bitrix24Deal>;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
  reset: () => void;
}

const defaultConfig: Bitrix24Config = {
  method: 'webhook',
  webhookUrl: '',
  portalUrl: '',
  clientId: '',
  clientSecret: '',
  accessToken: '',
  refreshToken: ''
};

export const useBitrix24Store = create<Bitrix24State>()(
  persist(
    (set, get) => ({
      // Initial state
      config: defaultConfig,
      isConfigured: false,
      service: null,
      isConnected: false,
      lastConnectionTest: undefined,
      connectionError: undefined,
      isExporting: false,
      exportHistory: [],

      // Update configuration and create new service instance
      updateConfig: (newConfig: Partial<Bitrix24Config>) => {
        const updatedConfig = { ...get().config, ...newConfig };
        const isConfigured = validateConfigInternal(updatedConfig);
        
        set({
          config: updatedConfig,
          isConfigured,
          service: isConfigured ? new Bitrix24Service(updatedConfig) : null,
          isConnected: false,
          connectionError: undefined
        });
      },

      // Test connection to Bitrix24
      testConnection: async (): Promise<boolean> => {
        const { service } = get();
        
        if (!service) {
          set({ 
            isConnected: false, 
            connectionError: 'Bitrix24 service not configured',
            lastConnectionTest: new Date()
          });
          return false;
        }

        try {
          const connected = await service.testConnection();
          set({
            isConnected: connected,
            connectionError: connected ? undefined : 'Connection test failed',
            lastConnectionTest: new Date()
          });
          return connected;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
          set({
            isConnected: false,
            connectionError: errorMessage,
            lastConnectionTest: new Date()
          });
          return false;
        }
      },

      // Export calculation to Bitrix24
      exportToBitrix24: async (
        result: any,
        projectName: string,
        additionalFields?: Partial<Bitrix24Deal>
      ): Promise<Bitrix24Deal> => {
        const { service, exportHistory } = get();
        
        if (!service) {
          throw new Error('Bitrix24 service not configured');
        }

        const exportId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const totalCost = result.finalCostBreakdown?.U32_GrandTotal || result.totalCost || 0;
        
        // Add pending export to history
        const pendingExport: ExportHistory = {
          id: exportId,
          timestamp: new Date(),
          dealTitle: `Heat Exchanger - ${projectName}`,
          status: 'pending',
          projectName,
          totalCost
        };

        set({ 
          isExporting: true,
          exportHistory: [pendingExport, ...exportHistory]
        });

        try {
          const deal = await service.createDeal(result, projectName, additionalFields);
          
          // Update export history with success
          const updatedHistory = get().exportHistory.map(item => 
            item.id === exportId 
              ? { 
                  ...item, 
                  status: 'success' as const,
                  dealId: deal.id,
                  dealTitle: deal.title
                }
              : item
          );
          
          set({ 
            isExporting: false,
            exportHistory: updatedHistory
          });
          
          return deal;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Export failed';
          
          // Update export history with error
          const updatedHistory = get().exportHistory.map(item => 
            item.id === exportId 
              ? { ...item, status: 'error' as const, error: errorMessage }
              : item
          );
          
          set({ 
            isExporting: false,
            exportHistory: updatedHistory
          });
          
          throw error;
        }
      },

      // Clear export history
      clearHistory: () => {
        set({ exportHistory: [] });
      },

      // Remove specific history item
      removeHistoryItem: (id: string) => {
        set(state => ({
          exportHistory: state.exportHistory.filter(item => item.id !== id)
        }));
      },

      // Reset all data
      reset: () => {
        set({
          config: defaultConfig,
          isConfigured: false,
          service: null,
          isConnected: false,
          lastConnectionTest: undefined,
          connectionError: undefined,
          isExporting: false,
          exportHistory: []
        });
      }
    }),
    {
      name: 'bitrix24-store',
      partialize: (state) => ({
        config: state.config,
        exportHistory: state.exportHistory.slice(0, 50) // Keep only last 50 exports
      }),
      // Custom serialization to handle Date objects
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const parsed = JSON.parse(str);
            // Convert timestamp strings back to Date objects
            if (parsed.state?.exportHistory) {
              parsed.state.exportHistory = parsed.state.exportHistory.map((item: any) => ({
                ...item,
                timestamp: new Date(item.timestamp)
              }));
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        }
      }
    }
  )
);

// Export helper functions for use in components
export const validateBitrix24Config = validateConfigInternal;

export const getBitrix24ConfigStatus = (): string => {
  const { config, isConfigured } = useBitrix24Store.getState();
  
  if (!isConfigured) {
    if (config.method === 'webhook') {
      return 'Webhook URL required';
    }
    return 'OAuth2 configuration incomplete';
  }
  
  return 'Configuration complete';
};

export const getBitrix24ExportStats = () => {
  const { exportHistory } = useBitrix24Store.getState();
  const now = new Date();
  const last24h = exportHistory.filter(
    item => (now.getTime() - item.timestamp.getTime()) < 24 * 60 * 60 * 1000
  );
  
  return {
    total: exportHistory.length,
    last24h: last24h.length,
    successful: exportHistory.filter(item => item.status === 'success').length,
    failed: exportHistory.filter(item => item.status === 'error').length,
    pending: exportHistory.filter(item => item.status === 'pending').length
  };
};