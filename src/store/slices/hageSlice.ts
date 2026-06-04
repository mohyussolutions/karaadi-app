import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL, HAGE_ENDPOINTS } from '../../constants/endpoints';

export interface HageMessage {
  id: number;
  content: string;
  fromAI: boolean;
}

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
    const chatHistory = history.map((m) => ({
      role: m.fromAI ? 'assistant' : 'user',
      content: m.content,
    }));
    const res = await fetch(`${API_BASE_URL}${HAGE_ENDPOINTS.CHAT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content, lang, history: chatHistory }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'No response');
    return data.reply as string;
  },
);

const hageSlice = createSlice({
  name: 'hage',
  initialState,
  reducers: {
    toggleHage(state) {
      state.open = !state.open;
    },
    openHage(state) {
      state.open = true;
    },
    closeHage(state) {
      state.open = false;
    },
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({ id: Date.now(), content: action.payload, fromAI: false });
    },
    clearHage(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendHageMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendHageMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ id: Date.now(), content: action.payload, fromAI: true });
      })
      .addCase(sendHageMessage.rejected, (state, action) => {
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
