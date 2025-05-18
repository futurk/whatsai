import { createContext, useContext, ReactNode, useState } from 'react';
import { Model, VENDOR_MODELS } from '@/types/model';
import { ApiKey, Vendor } from '@/types/apiKey';
import { sampleApiKeys } from '@/data/sampleData';

interface ApiKeyContextType {
  apiKeys: ApiKey[];
  addApiKey: (vendor: Vendor, key: string, name: string) => void;
  updateApiKey: (id: string, key: string) => void;
  deleteApiKey: (id: string) => void;
  getApiKeysByVendor: (vendor: Vendor) => ApiKey[];
  getModelsByVendor: (vendor: Vendor) => Model[];
  getSupportedVendors: () => Vendor[];
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(sampleApiKeys);

  const addApiKey = (vendor: Vendor, key: string, name: string) => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      vendor,
      key,
      name,
      createdAt: new Date().toISOString()
    };
    setApiKeys(prev => [...prev, newKey]);
  };

  const updateApiKey = (id: string, key: string) => {
    setApiKeys(prev =>
      prev.map(apiKey =>
        apiKey.id === id
          ? { ...apiKey, key }
          : apiKey
      )
    );
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(apiKey => apiKey.id !== id));
  };

  const getApiKeysByVendor = (vendor: Vendor) => {
    return apiKeys.filter(key => key.vendor === vendor);
  };

  const getModelsByVendor = (vendor: Vendor): Model[] => {
    const vendorData = VENDOR_MODELS.find(v => v.name === vendor);
    return vendorData?.models || [];
  };

  const getSupportedVendors = (): Vendor[] => {
    return VENDOR_MODELS.map(vendor => vendor.name as Vendor);
  };

  return (
    <ApiKeyContext.Provider value={{
      apiKeys,
      addApiKey,
      updateApiKey,
      deleteApiKey,
      getApiKeysByVendor,
      getModelsByVendor,
      getSupportedVendors
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeyContext = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKeyContext must be used within an ApiKeyProvider');
  }
  return context;
};