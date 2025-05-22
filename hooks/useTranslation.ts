import { useLanguage } from '@/context/LanguageContext';
import en from '@/locales/en';
import tr from '@/locales/tr';
import de from '@/locales/de';
import es from '@/locales/es';
import { Language } from '@/types/language';

const translations = {
  en,
  tr,
  de,
  es,
};

type TranslationKeys = typeof en;
type DotNotation<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? `${K & string}.${DotNotation<T[K]> & string}`
    : K & string;
}[keyof T];

type TranslationKey = DotNotation<TranslationKeys>;

export function useTranslation() {
  const { language } = useLanguage();
  
  const getTranslation = (key: TranslationKey): string => {
    const selectedLanguage = language === 'system' ? 'en' : language;
    const translation = translations[selectedLanguage as keyof typeof translations];
    
    return key.split('.').reduce((obj, k) => obj?.[k], translation as any) || key;
  };

  return {
    t: getTranslation,
  };
}