import { Agent } from '@/types/agent';
import { ApiKey, Vendor } from '@/types/apiKey';

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

export const sampleApiKeys: ApiKey[] = [
  {
    id: 'key1',
    vendor: 'OpenAI',
    key: process.env.EXPO_PUBLIC_SAMPLE_OPENAI_KEY || 'sk-sample-key-placeholder',
    name: 'Development Key',
    createdAt: new Date().toISOString()
  },
  {
    id: 'key2',
    vendor: 'OpenAI',
    key: 'sk-sample-key-false',
    name: 'False Key',
    createdAt: new Date().toISOString()
  }
];