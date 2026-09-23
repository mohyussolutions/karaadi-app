import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '../../../../util/types/notification.types';
import type { NotificationsState } from '../../../../util/types/redux.types';

const countUnread = (items: Notification[]) => items.filter((n) => !n.read).length;

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    mergeServerNotifications: (state, action: PayloadAction<Notification[]>) => {
      const serverIds = new Set(action.payload.map((n) => n._id));
      const localOnly = state.items.filter((n) => n.local && !serverIds.has(n._id));
      state.items = [...action.payload, ...localOnly].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      state.unreadCount = countUnread(state.items);
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      const exists = state.items.some((n) => n._id === action.payload._id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (!action.payload.read) state.unreadCount += 1;
      }
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    markChatNotificationsRead: (state, action: PayloadAction<number[]>) => {
      const ids = new Set(action.payload.map(String));
      state.items.forEach((n) => {
        if (n.type === 'message' && !n.read && ids.has(String(n.data?.chatId))) {
          n.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
    },
    markAllRead: (state) => {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    markOneRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n._id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const idx = state.items.findIndex((n) => n._id === action.payload);
      if (idx !== -1) {
        if (!state.items[idx].read) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.items.splice(idx, 1);
      }
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  mergeServerNotifications,
  addNotification,
  markChatNotificationsRead,
  setUnreadCount,
  markAllRead,
  markOneRead,
  removeNotification,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
