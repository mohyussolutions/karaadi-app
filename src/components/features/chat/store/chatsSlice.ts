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
    markChatsRead(state, action: PayloadAction<number[]>) {
      const ids = new Set(action.payload);
      state.items.forEach((chat) => {
        if (ids.has(chat.id) && chat._count) chat._count.messages = 0;
      });
    },
    clearChats: () => initialState,
  },
});

export const { setChats, markChatsRead, clearChats } = chatsSlice.actions;
export default chatsSlice.reducer;
