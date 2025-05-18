export interface Model {
  id: string;
  name: string;
  description: string;
  contextWindow?: number;
  inputPrice?: number;
  outputPrice?: number;
  features?: string[];
}

export interface VendorModels {
  name: string;
  description?: string;
  models: Model[];
}

export const VENDOR_MODELS: VendorModels[] = [
  {
    name: 'OpenAI',
    description: 'Leading provider of large language models',
    models: [
      {
        id: 'gpt-4.1',
        name: 'GPT-4.1',
        description: 'Flagship GPT model for complex tasks',
        contextWindow: 1047576,
        inputPrice: 2,
        outputPrice: 8,
        features: ['Knowledge cutoff: June 2024']
      },
      {
        id: 'gpt-4.1-mini',
        name: 'GPT-4.1 mini',
        description: 'Balanced for intelligence, speed, and cost',
        contextWindow: 1047576,
        inputPrice: 0.4,
        outputPrice: 1.6,
        features: ['Knowledge cutoff: June 2024']
      },
      {
        id: 'gpt-4.1-nano',
        name: 'GPT-4.1 nano',
        description: 'Fastest, most cost-effective GPT-4.1 model',
        contextWindow: 1047576,
        inputPrice: 0.1,
        outputPrice: 0.4,
        features: ['Knowledge cutoff: June 2024']
      }
    ]
  },
  {
    name: 'Anthropic',
    description: 'Advanced AI models with strong safety features',
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Most capable Claude model',
        contextWindow: 200000,
        features: ['Multimodal', 'Advanced reasoning', 'High accuracy']
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        description: 'Balanced performance and speed',
        contextWindow: 150000,
        features: ['Fast responses', 'Good accuracy', 'Cost-effective']
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        description: 'Fastest Claude model',
        contextWindow: 100000,
        features: ['Very fast', 'Efficient', 'Good for simple tasks']
      }
    ]
  }
];