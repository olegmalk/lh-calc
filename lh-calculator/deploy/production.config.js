export const productionConfig = {
  // Environment
  NODE_ENV: 'production',
  
  // API Configuration
  api: {
    baseUrl: process.env.VITE_API_BASE_URL || 'https://api.lh-calculator.production.com',
    timeout: 30000,
    retries: 3,
  },
  
  // Bitrix24 Production Settings
  bitrix24: {
    webhookUrl: process.env.VITE_BITRIX24_WEBHOOK_URL,
    domain: process.env.VITE_BITRIX24_DOMAIN || 'teploblock.bitrix24.ru',
    applicationId: process.env.VITE_BITRIX24_APP_ID,
    applicationSecret: process.env.VITE_BITRIX24_APP_SECRET,
    timeout: 15000,
    retries: 2,
  },
  
  // Application Settings
  app: {
    title: 'LH Calculator - Production',
    version: process.env.npm_package_version || '1.0.0',
    buildHash: process.env.VITE_BUILD_HASH || Date.now().toString(),
    environment: 'production',
  },
  
  // Security
  security: {
    enableCSP: true,
    allowedOrigins: [
      'https://lh-calculator.production.com',
      'https://teploblock.bitrix24.ru'
    ],
    httpsOnly: true,
  },
  
  // Performance
  performance: {
    enableGzip: true,
    enableBrotli: true,
    cacheMaxAge: 31536000, // 1 year
    staticCacheMaxAge: 86400, // 1 day
  },
  
  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.VITE_SENTRY_DSN,
      environment: 'production',
      release: process.env.VITE_APP_VERSION,
      tracesSampleRate: 0.1,
      beforeSend: (event) => {
        // Filter sensitive data
        if (event.exception) {
          const error = event.exception.values[0];
          if (error.value && error.value.includes('BITRIX24')) {
            return null; // Don't send Bitrix24 errors to avoid leaking credentials
          }
        }
        return event;
      },
    },
    analytics: {
      enabled: true,
      googleAnalytics: process.env.VITE_GA_ID,
    },
  },
  
  // Logging
  logging: {
    level: 'error',
    enableConsole: false,
    enableRemote: true,
  },
  
  // Feature Flags
  features: {
    debugMode: false,
    maintenanceMode: process.env.VITE_MAINTENANCE_MODE === 'true',
    betaFeatures: false,
  }
};

export default productionConfig;