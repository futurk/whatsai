import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native';
import { Language, SUPPORTED_LANGUAGES } from '@/types/language';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@app_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Error loading language preference:', error);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    try {
      setLanguageState(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function getDeviceLanguage(): Language {
  if (Platform.OS === 'ios') {
    const locale = NativeModules.SettingsManager.settings.AppleLocale || 
                  NativeModules.SettingsManager.settings.AppleLanguages[0];
    return mapLocaleToLanguage(locale);
  } else if (Platform.OS === 'android') {
    const locale = NativeModules.I18nManager.localeIdentifier;
    return mapLocaleToLanguage(locale);
  } else {
    const locale = navigator.language;
    return mapLocaleToLanguage(locale);
  }
}

function mapLocaleToLanguage(locale: string): Language {
  const languageCode = locale.toLowerCase().split(/[-_]/)[0];
  const supportedLanguage = SUPPORTED_LANGUAGES.find(lang => 
    lang.id === languageCode
  );
  return supportedLanguage?.id || 'en';
}