import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendHageChat } from '../../actions/sockets/hage.actions';
import type { AddUserMessageAction, HageState, SendHageMessageArgs } from '../../utils/types';

const initialState: HageState = {
  open: false,
  messages: [],
  loading: false,
};

export const sendHageMessage = createAsyncThunk(
  'hage/sendMessage',
  async ({ content, lang, history }: SendHageMessageArgs) => {
    return sendHageChat(content, lang, history);
  },
);

const hageSlice = createSlice({
  name: 'hage',
  initialState,
  selectors: {
    selectHage: (state) => state,
  },
  reducers: {
    toggleHage(state) { state.open = !state.open; },
    closeHage(state) { state.open = false; },
    addUserMessage(state, action: AddUserMessageAction) {
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

export const { toggleHage, closeHage, addUserMessage, clearHage } = hageSlice.actions;
export const { selectHage } = hageSlice.selectors;
export default hageSlice.reducer;
