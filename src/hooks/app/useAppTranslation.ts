import { useCallback } from 'react';
import i18n from '../../i18n/i18n';
import { useTranslation } from 'react-i18next';

import { selectLang, setLanguage } from '../../store/slices/languageSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import type { Lang } from '../../utils/types';

export const useAppTranslation = () => {
  const { t } = useTranslation();
  const lang = useAppSelector(selectLang);
  const dispatch = useAppDispatch();

  const switchLanguage = useCallback(
    (newLang: Lang) => {
      dispatch(setLanguage(newLang));
      i18n.changeLanguage(newLang);
    },
    [dispatch],
  );

  return { t, lang, switchLanguage };
};
