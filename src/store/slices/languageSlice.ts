import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Lang } from '../../i18n/translations';

interface LanguageState {
  lang: Lang;
}

const initialState: LanguageState = { lang: 'so' };

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Lang>) {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
