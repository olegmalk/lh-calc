import type { CalculationResult } from '../lib/calculation-engine/types';

export interface Bitrix24Config {
  method: 'webhook' | 'oauth2';
  webhookUrl?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  portalUrl?: string;
}

export interface Bitrix24Deal {
  id?: number;
  title: string;
  opportunity: number;
  currencyId: string;
  stageId: string;
  equipmentType?: string;
  plateCount?: number;
  totalMass?: number;
  testPressureHot?: number;
  testPressureCold?: number;
  comments?: string;
  contactId?: number;
  companyId?: number;
}

export interface Bitrix24Response<T = unknown> {
  result?: T;
  error?: string;
  error_description?: string;
  next?: number;
  total?: number;
  time?: {
    start: number;
    finish: number;
    duration: number;
  };
}

export class Bitrix24Service {
  private config: Bitrix24Config;
  
  constructor(config: Bitrix24Config) {
    this.config = config;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<Bitrix24Config>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Test connection to Bitrix24
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest('app.info');
      return response.result !== undefined;
    } catch (error) {
      console.error('Bitrix24 connection test failed:', error);
      return false;
    }
  }

  /**
   * Create a deal from calculation results
   */
  async createDeal(
    result: CalculationResult,
    projectName: string,
    additionalFields?: Partial<Bitrix24Deal>
  ): Promise<Bitrix24Deal> {
    const dealData = this.mapCalculationToDeal(result, projectName, additionalFields);
    
    const response = await this.makeRequest('crm.deal.add', {
      fields: this.formatDealFields(dealData)
    });

    if (response.error) {
      throw new Error(`Failed to create deal: ${response.error_description || response.error}`);
    }

    return {
      ...dealData,
      id: response.result
    };
  }

  /**
   * Update an existing deal
   */
  async updateDeal(dealId: number, updates: Partial<Bitrix24Deal>): Promise<void> {
    const response = await this.makeRequest('crm.deal.update', {
      id: dealId,
      fields: this.formatDealFields(updates)
    });

    if (response.error) {
      throw new Error(`Failed to update deal: ${response.error_description || response.error}`);
    }
  }

  /**
   * Get deal by ID
   */
  async getDeal(dealId: number): Promise<Bitrix24Deal | null> {
    try {
      const response = await this.makeRequest('crm.deal.get', { id: dealId });
      
      if (response.error) {
        throw new Error(response.error_description || response.error);
      }

      return this.formatDealFromResponse(response.result);
    } catch (error) {
      console.error('Failed to get deal:', error);
      return null;
    }
  }

  /**
   * Upload calculation document as PDF
   */
  async uploadDocument(
    dealId: number,
    pdfBlob: Blob,
    filename: string = 'calculation.pdf'
  ): Promise<void> {
    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', pdfBlob, filename);
      
      const uploadResponse = await this.makeRequest('disk.folder.uploadfile', {
        id: 'storage',
        data: {
          NAME: filename
        },
        fileContent: formData
      });

      if (uploadResponse.error) {
        throw new Error(`Failed to upload file: ${uploadResponse.error_description || uploadResponse.error}`);
      }

      // Attach file to deal
      await this.makeRequest('crm.deal.update', {
        id: dealId,
        fields: {
          UF_CRM_FILE: uploadResponse.result.ID
        }
      });
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  }

  /**
   * Map calculation result to Bitrix24 deal format
   */
  private mapCalculationToDeal(
    result: CalculationResult,
    projectName: string,
    additionalFields?: Partial<Bitrix24Deal>
  ): Bitrix24Deal {
    const equipmentType = this.extractEquipmentType(result);
    const totalCost = result.finalCostBreakdown?.U32_GrandTotal || result.totalCost;
    
    return {
      title: `Heat Exchanger ${equipmentType} - ${projectName}`,
      opportunity: totalCost,
      currencyId: 'RUB',
      stageId: 'NEW',
      equipmentType,
      plateCount: this.extractPlateCount(result),
      totalMass: this.extractTotalMass(result),
      testPressureHot: result.pressureTestHot,
      testPressureCold: result.pressureTestCold,
      comments: this.generateCalculationSummary(result),
      ...additionalFields
    };
  }

  /**
   * Format deal fields for Bitrix24 API
   */
  private formatDealFields(deal: Partial<Bitrix24Deal>): Record<string, unknown> {
    const fields: Record<string, unknown> = {};
    
    if (deal.title) fields.TITLE = deal.title;
    if (deal.opportunity !== undefined) fields.OPPORTUNITY = deal.opportunity;
    if (deal.currencyId) fields.CURRENCY_ID = deal.currencyId;
    if (deal.stageId) fields.STAGE_ID = deal.stageId;
    if (deal.contactId) fields.CONTACT_ID = deal.contactId;
    if (deal.companyId) fields.COMPANY_ID = deal.companyId;
    if (deal.comments) fields.COMMENTS = deal.comments;

    // Custom fields for heat exchanger specific data
    if (deal.equipmentType) fields.UF_EQUIPMENT_TYPE = deal.equipmentType;
    if (deal.plateCount !== undefined) fields.UF_PLATE_COUNT = deal.plateCount;
    if (deal.totalMass !== undefined) fields.UF_TOTAL_MASS = deal.totalMass;
    if (deal.testPressureHot !== undefined) fields.UF_TEST_PRESSURE_HOT = deal.testPressureHot;
    if (deal.testPressureCold !== undefined) fields.UF_TEST_PRESSURE_COLD = deal.testPressureCold;

    return fields;
  }

  /**
   * Format deal response from Bitrix24 API
   */
  private formatDealFromResponse(response: Record<string, unknown>): Bitrix24Deal {
    return {
      id: parseInt(String(response.ID || '0')),
      title: String(response.TITLE || ''),
      opportunity: parseFloat(String(response.OPPORTUNITY || '0')),
      currencyId: String(response.CURRENCY_ID || 'RUB'),
      stageId: String(response.STAGE_ID || 'NEW'),
      equipmentType: String(response.UF_EQUIPMENT_TYPE || ''),
      plateCount: response.UF_PLATE_COUNT ? parseInt(String(response.UF_PLATE_COUNT)) : undefined,
      totalMass: response.UF_TOTAL_MASS ? parseFloat(String(response.UF_TOTAL_MASS)) : undefined,
      testPressureHot: response.UF_TEST_PRESSURE_HOT ? parseFloat(String(response.UF_TEST_PRESSURE_HOT)) : undefined,
      testPressureCold: response.UF_TEST_PRESSURE_COLD ? parseFloat(String(response.UF_TEST_PRESSURE_COLD)) : undefined,
      comments: String(response.COMMENTS || ''),
      contactId: response.CONTACT_ID ? parseInt(String(response.CONTACT_ID)) : undefined,
      companyId: response.COMPANY_ID ? parseInt(String(response.COMPANY_ID)) : undefined
    };
  }

  /**
   * Make HTTP request to Bitrix24 API
   */
  private async makeRequest(method: string, params?: Record<string, unknown>): Promise<Bitrix24Response> {
    const url = this.buildApiUrl(method);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add authentication headers for OAuth2
    if (this.config.method === 'oauth2' && this.config.accessToken) {
      headers.Authorization = `Bearer ${this.config.accessToken}`;
    }

    const body = params ? JSON.stringify(params) : undefined;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Bitrix24 API request failed:', error);
      throw error;
    }
  }

  /**
   * Build API URL based on configuration
   */
  private buildApiUrl(method: string): string {
    if (this.config.method === 'webhook' && this.config.webhookUrl) {
      return `${this.config.webhookUrl}${method}.json`;
    }
    
    if (this.config.method === 'oauth2' && this.config.portalUrl) {
      return `${this.config.portalUrl}/rest/${method}.json`;
    }

    throw new Error('Invalid Bitrix24 configuration: missing webhook URL or portal URL');
  }

  /**
   * Extract equipment type from calculation result
   */
  private extractEquipmentType(result: CalculationResult): string {
    // Try to extract from materialRequirements or other sources
    if (result.materialRequirements) {
      const entries = Array.from(result.materialRequirements.entries());
      const equipmentEntry = entries.find(([key, _]) => key.includes('Equipment'));
      if (equipmentEntry) {
        return equipmentEntry[0];
      }
    }
    return 'Unknown';
  }

  /**
   * Extract plate count from calculation result
   */
  private extractPlateCount(result: CalculationResult): number | undefined {
    // Try to extract from materialRequirements
    if (result.materialRequirements) {
      const entries = Array.from(result.materialRequirements.entries());
      const plateEntry = entries.find(([key, _]) => key.toLowerCase().includes('plate'));
      if (plateEntry) {
        return Math.round(plateEntry[1]);
      }
    }
    return undefined;
  }

  /**
   * Extract total mass from calculation result
   */
  private extractTotalMass(result: CalculationResult): number | undefined {
    if (result.materialRequirements) {
      const entries = Array.from(result.materialRequirements.entries());
      const massEntry = entries.find(([key, _]) => key.toLowerCase().includes('mass'));
      if (massEntry) {
        return parseFloat(massEntry[1].toFixed(2));
      }
    }
    return undefined;
  }

  /**
   * Generate calculation summary for comments
   */
  private generateCalculationSummary(result: CalculationResult): string {
    const summary = ['Heat Exchanger Calculation Summary:'];
    
    if (result.finalCostBreakdown?.U32_GrandTotal) {
      summary.push(`Total Cost: ${Math.round(result.finalCostBreakdown.U32_GrandTotal).toLocaleString('ru-RU')} RUB`);
    }
    
    if (result.pressureTestHot) {
      summary.push(`Test Pressure Hot: ${result.pressureTestHot.toFixed(2)} bar`);
    }
    
    if (result.pressureTestCold) {
      summary.push(`Test Pressure Cold: ${result.pressureTestCold.toFixed(2)} bar`);
    }

    if (result.materialRequirements) {
      summary.push('Material Requirements:');
      Array.from(result.materialRequirements.entries()).forEach(([material, quantity]: [string, number]) => {
        summary.push(`• ${material}: ${quantity.toFixed(2)}`);
      });
    }

    summary.push(`Calculated at: ${new Date().toLocaleString('ru-RU')}`);
    
    return summary.join('\n');
  }
}