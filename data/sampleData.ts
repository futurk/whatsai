import { Agent } from '@/types/agent';
import { ApiKey, Vendor } from '@/types/apiKey';
import { ENV, getApiKey, hasApiKey } from '@/utils/env';

export const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Assistant',
    instructions: 'You are a helpful AI assistant that can answer general questions and provide information.',
    model: 'gpt-4.1-nano',
    apiKeyId: 'key1',
    color: '#3B82F6',
    tags: ['Helpful', 'Informative', 'General'],
    temperature: 1.0,
    maxTokens: 1000
  },
  {
    id: '2',
    name: 'Creative',
    instructions: 'You are a creative AI that helps with writing, storytelling, and generating creative content.',
    model: 'gpt-4.1-nano',
    apiKeyId: 'key2',
    color: '#8B5CF6',
    tags: ['Creative', 'Writing', 'Storytelling'],
    temperature: 0.9,
    maxTokens: 2000
  }
];

/**
 * Generate sample API keys from environment variables
 * Falls back to placeholder values if env vars are not set
 */
export const sampleApiKeys: ApiKey[] = [
  {
    id: 'key1',
    vendor: 'OpenAI',
    key: getApiKey('OpenAI', 'primary') || 'sk-example-key-placeholder-replace-with-your-actual-key',
    name: hasApiKey('OpenAI') ? 'Primary OpenAI Key' : 'Development Key (Placeholder)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'key2',
    vendor: 'OpenAI',
    key: getApiKey('OpenAI', 'secondary') || 'sk-another-example-key-placeholder',
    name: 'Secondary Key',
    createdAt: new Date().toISOString()
  },
  ...(hasApiKey('Anthropic') ? [{
    id: 'key3',
    vendor: 'Anthropic' as Vendor,
    key: getApiKey('Anthropic'),
    name: 'Primary Anthropic Key',
    createdAt: new Date().toISOString()
  }] : [])
];

/**
 * Get development status message for API keys
 */
export const getApiKeyStatus = () => {
  const openaiAvailable = hasApiKey('OpenAI');
  const anthropicAvailable = hasApiKey('Anthropic');
  
  if (!openaiAvailable && !anthropicAvailable) {
    return 'No API keys configured. Add your keys to .env.local file.';
  }
  
  const available = [];
  if (openaiAvailable) available.push('OpenAI');
  if (anthropicAvailable) available.push('Anthropic');
  
  return `API keys available for: ${available.join(', ')}`;
};