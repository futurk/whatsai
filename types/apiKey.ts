export type Vendor = 'OpenAI' | 'Anthropic';

export interface ApiKey {
  id: string;
  vendor: Vendor;
  key: string;
  name: string;
  createdAt: string;
}