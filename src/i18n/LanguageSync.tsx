import { useEffect } from 'react';
import { useAppSelector } from '../store/store';
import i18n from './i18n';

import { selectLang } from '../store/slices/languageSlice';
export default function LanguageSync() {
  const lang = useAppSelector(selectLang);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return null;
}
