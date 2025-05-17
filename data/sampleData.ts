import { Agent } from '@/types/agent';
import { ApiKey } from '@/types/apiKey';

export const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Assistant',
    instructions: 'You are a helpful AI assistant that can answer general questions and provide information.',
    model: 'gpt-4.1-nano',
    apiKeyId: 'key1',
    color: '#3B82F6',
    tags: ['Helpful', 'Informative', 'General']
  },
  {
    id: '2',
    name: 'Creative',
    instructions: 'You are a creative AI that helps with writing, storytelling, and generating creative content.',
    model: 'claude-3-opus',
    apiKeyId: 'key2',
    color: '#8B5CF6',
    tags: ['Creative', 'Writing', 'Storytelling']
  }
];

export const sampleApiKeys: ApiKey[] = [
  {
    id: 'key1',
    vendor: 'OpenAI',
    key: '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',
    name: 'Development Key',
    createdAt: new Date().toISOString()
  },
  {
    id: 'key2',
    vendor: 'Anthropic',
    key: 'sk-sample-key-2',
    name: 'Testing Key',
    createdAt: new Date().toISOString()
  }
];