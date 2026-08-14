import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '../../util/colors';
import type { ThemeState } from '../../util/types/redux.types';

const initialState: ThemeState = { mode: 'light' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
