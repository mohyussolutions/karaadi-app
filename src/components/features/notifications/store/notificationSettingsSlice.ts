import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NotificationSettingsState } from '../../../../util/types/redux.types';

const initialState: NotificationSettingsState = {
  soundEnabled: true,
};

const notificationSettingsSlice = createSlice({
  name: 'notificationSettings',
  initialState,
  reducers: {
    setSoundEnabled(state, action: PayloadAction<boolean>) {
      state.soundEnabled = action.payload;
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
    },
  },
});

export const { setSoundEnabled, toggleSound } = notificationSettingsSlice.actions;
export default notificationSettingsSlice.reducer;
