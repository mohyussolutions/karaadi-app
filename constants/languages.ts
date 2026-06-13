export interface Language {
  code: 'en' | 'so';
  label: string;
}

export const LANGUAGES: Language[] = [
  { code: 'so', label: 'SOMALI' },
  { code: 'en', label: 'ENGLISH' },
];
