import { createSlice } from '@reduxjs/toolkit';
import type { AddNotificationAction, MarkChatNotificationsReadAction, MarkOneReadAction, MergeServerNotificationsAction, Notification, NotificationsState, RemoveNotificationAction, SetUnreadCountAction } from '../../utils/types';

const countUnread = (items: Notification[]) => items.filter((n) => !n.read).length;

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  selectors: {
    selectNotificationItems: (state) => state.items,
    selectUnreadCount: (state) => state.unreadCount,
  },
  reducers: {
    mergeServerNotifications: (state, action: MergeServerNotificationsAction) => {
      const serverIds = new Set(action.payload.map((n) => n._id));
      const localOnly = state.items.filter((n) => n.local && !serverIds.has(n._id));
      state.items = [...action.payload, ...localOnly].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      state.unreadCount = countUnread(state.items);
    },
    addNotification: (state, action: AddNotificationAction) => {
      const exists = state.items.some((n) => n._id === action.payload._id);
      if (!exists) {
        state.items.unshift(action.payload);
        if (!action.payload.read) state.unreadCount += 1;
      }
    },
    setUnreadCount: (state, action: SetUnreadCountAction) => {
      state.unreadCount = action.payload;
    },
    markChatNotificationsRead: (state, action: MarkChatNotificationsReadAction) => {
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
    markOneRead: (state, action: MarkOneReadAction) => {
      const item = state.items.find((n) => n._id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    removeNotification: (state, action: RemoveNotificationAction) => {
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

export const { selectNotificationItems, selectUnreadCount } = notificationsSlice.selectors;
export default notificationsSlice.reducer;
