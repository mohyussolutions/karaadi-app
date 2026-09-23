import { createSlice } from '@reduxjs/toolkit';
import type { NotificationSettingsState } from '../../../../util/types/redux.types';

const initialState: NotificationSettingsState = {
  soundEnabled: true,
};

const notificationSettingsSlice = createSlice({
  name: 'notificationSettings',
  initialState,
  reducers: {
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled;
    },
  },
});

export const { toggleSound } = notificationSettingsSlice.actions;
export default notificationSettingsSlice.reducer;
