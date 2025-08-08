/**
 * Bitrix24 Integration Types
 * 
 * Type definitions for Bitrix24 CRM integration including
 * configuration, deals, API responses, and export functionality.
 */

export interface Bitrix24Config {
  /** Connection method: webhook (simple) or oauth2 (advanced) */
  method: 'webhook' | 'oauth2';
  
  /** Webhook URL for simple API access */
  webhookUrl?: string;
  
  /** Portal URL for OAuth2 authentication */
  portalUrl?: string;
  
  /** OAuth2 Application ID */
  clientId?: string;
  
  /** OAuth2 Application Secret */
  clientSecret?: string;
  
  /** OAuth2 Access Token */
  accessToken?: string;
  
  /** OAuth2 Refresh Token */
  refreshToken?: string;
}

export interface Bitrix24Deal {
  /** Deal ID (assigned by Bitrix24) */
  id?: number;
  
  /** Deal title/name */
  title: string;
  
  /** Deal amount/opportunity value */
  opportunity: number;
  
  /** Currency code (RUB, USD, EUR, etc.) */
  currencyId: string;
  
  /** Deal stage ID */
  stageId: string;
  
  /** Heat exchanger equipment type */
  equipmentType?: string;
  
  /** Number of plates in the heat exchanger */
  plateCount?: number;
  
  /** Total mass of materials */
  totalMass?: number;
  
  /** Test pressure for hot side */
  testPressureHot?: number;
  
  /** Test pressure for cold side */
  testPressureCold?: number;
  
  /** Deal comments/description */
  comments?: string;
  
  /** Associated contact ID */
  contactId?: number;
  
  /** Associated company ID */
  companyId?: number;
  
  /** Created date */
  createdDate?: Date;
  
  /** Modified date */
  modifiedDate?: Date;
}

export interface Bitrix24Response<T = any> {
  /** Response data */
  result?: T;
  
  /** Error code */
  error?: string;
  
  /** Error description */
  error_description?: string;
  
  /** Next page marker for pagination */
  next?: number;
  
  /** Total number of records */
  total?: number;
  
  /** Execution timing information */
  time?: {
    start: number;
    finish: number;
    duration: number;
  };
}

export interface Bitrix24Contact {
  /** Contact ID */
  id?: number;
  
  /** First name */
  name?: string;
  
  /** Last name */
  lastName?: string;
  
  /** Company name */
  companyTitle?: string;
  
  /** Email address */
  email?: string;
  
  /** Phone number */
  phone?: string;
}

export interface Bitrix24Company {
  /** Company ID */
  id?: number;
  
  /** Company title */
  title: string;
  
  /** Company type */
  companyType?: string;
  
  /** Industry */
  industry?: string;
  
  /** Email address */
  email?: string;
  
  /** Phone number */
  phone?: string;
  
  /** Website URL */
  web?: string;
}

export interface ExportHistory {
  /** Unique export ID */
  id: string;
  
  /** Export timestamp */
  timestamp: Date;
  
  /** Bitrix24 deal ID (if successful) */
  dealId?: number;
  
  /** Deal title */
  dealTitle: string;
  
  /** Export status */
  status: 'success' | 'error' | 'pending';
  
  /** Error message (if failed) */
  error?: string;
  
  /** Project name */
  projectName: string;
  
  /** Total cost of calculation */
  totalCost: number;
  
  /** Equipment type */
  equipmentType?: string;
  
  /** Export duration in milliseconds */
  duration?: number;
}

export interface Bitrix24ApiError extends Error {
  /** Bitrix24 error code */
  code?: string;
  
  /** HTTP status code */
  status?: number;
  
  /** Detailed error description */
  description?: string;
  
  /** Original API response */
  response?: Bitrix24Response;
}

export interface Bitrix24ExportOptions {
  /** Include PDF attachment */
  includePdf?: boolean;
  
  /** Custom deal fields */
  customFields?: Record<string, any>;
  
  /** Contact information */
  contact?: Partial<Bitrix24Contact>;
  
  /** Company information */
  company?: Partial<Bitrix24Company>;
  
  /** Deal stage override */
  stageId?: string;
  
  /** Currency override */
  currencyId?: string;
}

export interface Bitrix24Stats {
  /** Total exports */
  total: number;
  
  /** Exports in last 24 hours */
  last24h: number;
  
  /** Successful exports */
  successful: number;
  
  /** Failed exports */
  failed: number;
  
  /** Pending exports */
  pending: number;
}

export interface Bitrix24FileUpload {
  /** File ID in Bitrix24 */
  id: string;
  
  /** Original filename */
  name: string;
  
  /** File size in bytes */
  size: number;
  
  /** Upload timestamp */
  uploadedAt: Date;
  
  /** File URL in Bitrix24 */
  url?: string;
}

/**
 * Bitrix24 Custom Field Types
 * These correspond to user-defined fields in Bitrix24 CRM
 */
export interface Bitrix24CustomFields {
  /** Equipment type custom field */
  UF_EQUIPMENT_TYPE?: string;
  
  /** Plate count custom field */
  UF_PLATE_COUNT?: number;
  
  /** Total mass custom field */
  UF_TOTAL_MASS?: number;
  
  /** Test pressure hot side custom field */
  UF_TEST_PRESSURE_HOT?: number;
  
  /** Test pressure cold side custom field */
  UF_TEST_PRESSURE_COLD?: number;
  
  /** Calculation date custom field */
  UF_CALCULATION_DATE?: Date;
  
  /** Project manager custom field */
  UF_PROJECT_MANAGER?: string;
  
  /** Technical specifications custom field */
  UF_TECH_SPECS?: string;
}

/**
 * Standard Bitrix24 Deal Stages
 */
export const BITRIX24_DEAL_STAGES = {
  NEW: 'NEW',
  PREPARATION: 'PREPARATION',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  INVOICING: 'INVOICING',
  WON: 'WON',
  LOST: 'LOST'
} as const;

export type Bitrix24DealStage = typeof BITRIX24_DEAL_STAGES[keyof typeof BITRIX24_DEAL_STAGES];

/**
 * Standard Bitrix24 Currency Codes
 */
export const BITRIX24_CURRENCIES = {
  RUB: 'RUB',
  USD: 'USD',
  EUR: 'EUR'
} as const;

export type Bitrix24Currency = typeof BITRIX24_CURRENCIES[keyof typeof BITRIX24_CURRENCIES];