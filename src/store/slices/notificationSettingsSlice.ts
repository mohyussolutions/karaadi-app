import { createSlice } from '@reduxjs/toolkit';
import type { NotificationSettingsState } from '../../utils/types';

const initialState: NotificationSettingsState = {
  soundEnabled: true,
};

const notificationSettingsSlice = createSlice({
  name: 'notificationSettings',
  initialState,
  selectors: {
    selectSoundEnabled: (state) => state.soundEnabled,
  },
  reducers: {
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
    },
  },
});

export const { toggleSound } = notificationSettingsSlice.actions;
export const { selectSoundEnabled } = notificationSettingsSlice.selectors;
export default notificationSettingsSlice.reducer;
