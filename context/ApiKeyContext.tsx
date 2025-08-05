import { createContext, useContext, ReactNode, useState } from 'react';
import React from 'react';
import { Model, VENDOR_MODELS } from '@/types/model';
import { ApiKey, Vendor } from '@/types/apiKey';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface ApiKeyContextType {
  apiKeys: ApiKey[];
  loading: boolean;
  addApiKey: (vendor: Vendor, key: string, name: string) => void;
  updateApiKey: (id: string, key: string) => void;
  deleteApiKey: (id: string) => void;
  getApiKeysByVendor: (vendor: Vendor) => ApiKey[];
  getModelsByVendor: (vendor: Vendor) => Model[];
  getSupportedVendors: () => Vendor[];
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load API keys when user changes
  React.useEffect(() => {
    if (user && !user.isGuest) {
      loadApiKeys();
    } else {
      // For guests, use sample data
      setApiKeys([
        {
          id: 'sample-1',
          vendor: 'OpenAI',
          key: process.env.EXPO_PUBLIC_SAMPLE_OPENAI_KEY || 'sk-sample-key-placeholder',
          name: 'Sample OpenAI Key',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, [user]);

  const loadApiKeys = async () => {
    if (!user || user.isGuest) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedKeys: ApiKey[] = data.map(key => ({
        id: key.id,
        vendor: key.vendor as Vendor,
        key: key.key,
        name: key.name,
        createdAt: key.created_at,
      }));

      setApiKeys(formattedKeys);
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const addApiKey = async (vendor: Vendor, key: string, name: string) => {
    if (!user || user.isGuest) {
      // For guests, add to local state only
      const newKey: ApiKey = {
        id: Date.now().toString(),
        vendor,
        key,
        name,
        createdAt: new Date().toISOString()
      };
      setApiKeys(prev => [...prev, newKey]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          vendor,
          key,
          name,
        })
        .select()
        .single();

      if (error) throw error;

      const newKey: ApiKey = {
        id: data.id,
        vendor: data.vendor as Vendor,
        key: data.key,
        name: data.name,
        createdAt: data.created_at,
      };

      setApiKeys(prev => [...prev, newKey]);
    } catch (error) {
      console.error('Error adding API key:', error);
      throw error;
    }
  };

  const updateApiKey = async (id: string, key: string) => {
    if (!user || user.isGuest) {
      // For guests, update local state only
      setApiKeys(prev =>
        prev.map(apiKey =>
          apiKey.id === id
            ? { ...apiKey, key }
            : apiKey
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ key })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setApiKeys(prev =>
        prev.map(apiKey =>
          apiKey.id === id
            ? { ...apiKey, key }
            : apiKey
        )
      );
    } catch (error) {
      console.error('Error updating API key:', error);
      throw error;
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!user || user.isGuest) {
      // For guests, remove from local state only
      setApiKeys(prev => prev.filter(apiKey => apiKey.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setApiKeys(prev => prev.filter(apiKey => apiKey.id !== id));
    } catch (error) {
      console.error('Error deleting API key:', error);
      throw error;
    }
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
      loading,
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