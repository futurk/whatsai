import { createContext, useContext, ReactNode, useState } from 'react';
import { Model, VENDOR_MODELS } from '@/types/model';
import { ApiKey, VendorId } from '@/types/apiKey';
import { sampleApiKeys } from '@/data/sampleData';

interface ApiKeyContextType {
  apiKeys: ApiKey[];
  addApiKey: (vendorId: VendorId, key: string, name: string) => void;
  updateApiKey: (id: string, key: string) => void;
  deleteApiKey: (id: string) => void;
  getApiKeysByVendor: (vendorId: VendorId) => ApiKey[];
  getModelsByVendor: (vendorId: VendorId) => Model[];
  getSupportedVendors: () => VendorId[];
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(sampleApiKeys);

  const addApiKey = (vendorId: VendorId, key: string, name: string) => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      vendorId,
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

  const getApiKeysByVendor = (vendorId: VendorId) => {
    return apiKeys.filter(key => key.vendorId === vendorId);
  };

  const getModelsByVendor = (vendorId: VendorId): Model[] => {
    const vendorData = VENDOR_MODELS.find(v => v.name === vendorId);
    return vendorData?.models || [];
  };

  const getSupportedVendors = (): VendorId[] => {
    return VENDOR_MODELS.map(vendor => vendor.name);
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