import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Lang } from '../../i18n/translations';
import type { LanguageState } from '../../util/types/redux.types';

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
