import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/i18n';
import type { I18nProviderProps } from '../util/types/component.types';

export default function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
