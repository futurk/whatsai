/**
 * Environment variable utilities
 * Provides safe access to environment variables with fallbacks
 */

export const ENV = {
  // API Keys
  OPENAI_PRIMARY_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY_PRIMARY || '',
  OPENAI_SECONDARY_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY_SECONDARY || '',
  ANTHROPIC_PRIMARY_KEY: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY_PRIMARY || '',
  
  // API Configuration
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com',
  DEBUG_MODE: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
  
  // Development flags
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
} as const;

/**
 * Validates that required environment variables are present
 */
export const validateEnv = () => {
  const requiredVars = [
    'EXPO_PUBLIC_OPENAI_API_KEY_PRIMARY',
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    console.warn('Please check your .env.local file');
  }
  
  return missing.length === 0;
};

/**
 * Gets API key for a specific vendor with fallback logic
 */
export const getApiKey = (vendor: 'OpenAI' | 'Anthropic', keyType: 'primary' | 'secondary' = 'primary') => {
  switch (vendor) {
    case 'OpenAI':
      return keyType === 'primary' ? ENV.OPENAI_PRIMARY_KEY : ENV.OPENAI_SECONDARY_KEY;
    case 'Anthropic':
      return ENV.ANTHROPIC_PRIMARY_KEY;
    default:
      return '';
  }
};

/**
 * Checks if an API key is available for a vendor
 */
export const hasApiKey = (vendor: 'OpenAI' | 'Anthropic') => {
  return Boolean(getApiKey(vendor));
};