import { useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { setChats } from '../features/chat/store/chatsSlice';
import { getMyChats } from '../../actions/core/message.actions';
import { getSocket } from '../../actions/sockets/socket.actions';

export function useChatsData() {
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const { items: chats, loaded } = useAppSelector((s) => s.chats);

  const loadChats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getMyChats(user.id);
      dispatch(setChats(data));
    } catch {}
  }, [user?.id, dispatch]);

  useFocusEffect(useCallback(() => {
    loadChats();
  }, [loadChats]));

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = () => loadChats();
    socket.on('newMessage', handler);
    socket.on('unreadCountUpdate', handler);
    return () => {
      socket.off('newMessage', handler);
      socket.off('unreadCountUpdate', handler);
    };
  }, [loadChats]);

  return { user, chats, loaded };
}
