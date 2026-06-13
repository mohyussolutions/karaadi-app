import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { sendHageChat } from '../../api/sockets/hage.actions';
import type { HageMessage } from '../../utils/types/hage.types';

interface HageState {
  open: boolean;
  messages: HageMessage[];
  loading: boolean;
}

const initialState: HageState = {
  open: false,
  messages: [],
  loading: false,
};

export const sendHageMessage = createAsyncThunk(
  'hage/sendMessage',
  async ({ content, lang, history }: { content: string; lang: string; history: HageMessage[] }) => {
    return sendHageChat(content, lang, history);
  },
);

const hageSlice = createSlice({
  name: 'hage',
  initialState,
  reducers: {
    toggleHage(state) { state.open = !state.open; },
    openHage(state) { state.open = true; },
    closeHage(state) { state.open = false; },
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({ id: Date.now(), content: action.payload, fromAI: false });
    },
    clearHage(state) { state.messages = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendHageMessage.pending, (state) => { state.loading = true; })
      .addCase(sendHageMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: Date.now(),
          content: action.payload.reply,
          fromAI: true,
          listings: action.payload.listings?.length ? action.payload.listings : undefined,
        });
      })
      .addCase(sendHageMessage.rejected, (state) => {
        state.loading = false;
        state.messages.push({
          id: Date.now(),
          content: 'Waan ka xumahay, jawaab lama helin. Fadlan isku day mar kale.',
          fromAI: true,
        });
      });
  },
});

export const { toggleHage, openHage, closeHage, addUserMessage, clearHage } = hageSlice.actions;
export default hageSlice.reducer;
