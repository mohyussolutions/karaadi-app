import { createSlice } from '@reduxjs/toolkit';
import type { SetThemeModeAction, ThemeState } from '../../utils/types';

const initialState: ThemeState = { mode: 'light' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  selectors: {
    selectThemeMode: (state) => state.mode,
  },
  reducers: {
    setThemeMode(state, action: SetThemeModeAction) {
      state.mode = action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export const { selectThemeMode } = themeSlice.selectors;
export default themeSlice.reducer;
