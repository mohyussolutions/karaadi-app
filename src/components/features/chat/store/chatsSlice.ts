import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Chat } from '../../../../util/types';
import type { ChatsState } from '../../../../util/types/redux.types';

const initialState: ChatsState = {
  items: [],
  loaded: false,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      state.items = action.payload;
      state.loaded = true;
    },
    clearChats: () => initialState,
  },
});

export const { setChats, clearChats } = chatsSlice.actions;
export default chatsSlice.reducer;
