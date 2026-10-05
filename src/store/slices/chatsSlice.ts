import { createSlice } from '@reduxjs/toolkit';
import type { ChatsState, MarkChatsReadAction, SetChatsAction } from '../../utils/types';

const initialState: ChatsState = {
  items: [],
  loaded: false,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  selectors: {
    selectChats: (state) => state,
  },
  reducers: {
    setChats(state, action: SetChatsAction) {
      state.items = action.payload;
      state.loaded = true;
    },
    markChatsRead(state, action: MarkChatsReadAction) {
      const ids = new Set(action.payload);
      state.items.forEach((chat) => {
        if (ids.has(chat.id) && chat._count) chat._count.messages = 0;
      });
    },
    clearChats: () => initialState,
  },
});

export const { setChats, markChatsRead, clearChats } = chatsSlice.actions;
export const { selectChats } = chatsSlice.selectors;
export default chatsSlice.reducer;
