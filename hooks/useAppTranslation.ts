import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store';
import { setLanguage } from '../store/slices/languageSlice';
import type { Lang } from '../i18n/translations';
import i18n from '../i18n/i18n';

export function useAppTranslation() {
  const { t } = useTranslation();
  const lang = useAppSelector((s) => s.language.lang);
  const dispatch = useAppDispatch();

  const switchLanguage = useCallback(
    (newLang: Lang) => {
      dispatch(setLanguage(newLang));
      i18n.changeLanguage(newLang);
    },
    [dispatch],
  );

  return { t, lang, switchLanguage };
}
