import { useEffect } from 'react';
import { useAppSelector } from '../store';
import i18n from './i18n';

export default function LanguageSync() {
  const lang = useAppSelector((s) => s.language.lang);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return null;
}
