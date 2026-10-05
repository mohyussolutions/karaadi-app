import { createSlice } from '@reduxjs/toolkit';
import type { LanguageState, SetLanguageAction } from '../../utils/types';

const initialState: LanguageState = { lang: 'so' };

const languageSlice = createSlice({
  name: 'language',
  initialState,
  selectors: {
    selectLang: (state) => state.lang,
  },
  reducers: {
    setLanguage(state, action: SetLanguageAction) {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export const { selectLang } = languageSlice.selectors;
export default languageSlice.reducer;
