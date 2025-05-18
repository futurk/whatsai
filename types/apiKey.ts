export type VendorId = 'OpenAI' | 'Anthropic';

export interface ApiKey {
  id: string;
  vendorId: VendorId;
  key: string;
  name: string;
  createdAt: string;
}