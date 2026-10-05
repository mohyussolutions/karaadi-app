import type { useTranslation } from 'react-i18next';

export type Lang = 'en' | 'so';

export type Translate = ReturnType<typeof useTranslation>['t'];

export interface Language {
  code: Lang;
  label: string;
}

export type TFn = (key: string, opts?: Record<string, unknown>) => string;

export type SimpleTranslate = (key: string) => string;
