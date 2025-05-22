export type Language = 'system' | 'en' | 'tr' | 'de' | 'es';

export interface LanguageOption {
  id: Language;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { id: 'system', name: 'System', nativeName: 'System' },
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { id: 'de', name: 'German', nativeName: 'Deutsch' },
  { id: 'es', name: 'Spanish', nativeName: 'Español' },
];