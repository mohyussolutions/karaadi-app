import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from 'expo-router';
import { getChatMessages, sendMessage, createOrFindChat } from '../actions/core/message.actions';
import { joinChat, leaveChat, emitSendMessage, emitMarkAsRead, getSocket } from '../actions/sockets/socket.actions';
import { setActiveChatId, cacheUserName } from '../components/features/chat/services/chatState';
import { useAuthStore } from '../store/hooks/authStore';
import type { ChatMessage } from '../util/types';

const chatIdCache = new Map<string, number>();

function getItemModel(category?: string): string {
  const c = (category || '').toLowerCase();
  if (c === 'cars' || c === 'car') return 'Car';
  if (c === 'boats' || c === 'boat') return 'Boat';
  if (c === 'motorcycles' || c === 'motorcycle') return 'Motorcycle';
  if (c === 'farmequipment' || c === 'farm-equipment' || c === 'traktor') return 'Traktor';
  if (c === 'realestate' || c === 'real-estate') return 'RealEstate';
  if (c === 'jobs' || c === 'job') return 'Job';
  if (c === 'subscription') return 'Subscription';
  return 'Marketplace';
}

interface UseChatConversationArgs {
  chatIdParam?: string;
  userId?: string;
  username?: string;
  listingId?: string;
  listingType?: string;
}

export function useChatConversation({ chatIdParam, userId, username, listingId, listingType }: UseChatConversationArgs) {
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fetching, setFetching] = useState(true);
  const [initError, setInitError] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [chatIdNum, setChatIdNum] = useState(0);

  const listRef = useRef<FlatList<ChatMessage>>(null);
  const chatIdRef = useRef(0);
  const allIdsRef = useRef<number[]>([]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    if (userId && username) cacheUserName(userId, username);
    if (!user?.id) { setFetching(false); return; }

    async function init() {
      const parsedIds = (chatIdParam || '')
        .split(',')
        .map((v) => parseInt(v, 10))
        .filter((n) => Number.isFinite(n) && n > 0);
      let resolvedId = parsedIds[0] || 0;

      if (!resolvedId && userId) {
        const cacheKey = `${user!.id}:${userId}:${listingId || ''}`;
        const cached = chatIdCache.get(cacheKey);
        if (cached) {
          resolvedId = cached;
        } else {
          try {
            const { chat } = await createOrFindChat({
              senderId: user!.id,
              receiverId: userId,
              itemId: listingId || '',
              itemModel: getItemModel(listingType),
            });
            resolvedId = chat.id;
            chatIdCache.set(cacheKey, resolvedId);
          } catch {
            setInitError(true);
            setFetching(false);
            return;
          }
        }
      }

      chatIdRef.current = resolvedId;
      const allIds = parsedIds.length > 0 ? parsedIds : resolvedId ? [resolvedId] : [];
      allIdsRef.current = allIds;
      setChatIdNum(resolvedId);

      if (resolvedId) {
        setActiveChatId(resolvedId);
        allIds.forEach((id) => {
          joinChat(id);
          emitMarkAsRead(id);
        });

        Promise.all(allIds.map((id) => getChatMessages(id, user!.id).catch(() => [])))
          .then((lists) => {
            const merged = lists
              .flat()
              .sort((a, b) =>
                new Date(a.timestamp || a.createdAt || 0).getTime() -
                new Date(b.timestamp || b.createdAt || 0).getTime());
            setMessages(merged);
            setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 60);
          })
          .finally(() => setFetching(false));
        return;
      }

      setFetching(false);
    }

    init();
    return () => {
      allIdsRef.current.forEach((id) => leaveChat(id));
      setActiveChatId(null);
    };
  }, [user?.id]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatIdNum) return;

    const onReceive = (msg: ChatMessage) => {
      const msgChatId = msg.chatId;
      if (msgChatId && !allIdsRef.current.includes(msgChatId)) return;
      const tempKey = msg.tempId;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;

        const pendingIndex = prev.findIndex((m) => {
          const mTempId = m.tempId;
          if (!mTempId) return false;
          return tempKey ? mTempId === tempKey : m.content === msg.content;
        });

        if (pendingIndex !== -1) {
          const next = [...prev];
          next[pendingIndex] = { ...msg, tempId: prev[pendingIndex].tempId };
          return next;
        }
        return [...prev, msg];
      });
      emitMarkAsRead(chatIdNum);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    };

    socket.on('receiveMessage', onReceive);
    socket.on('newMessage', onReceive);
    return () => {
      socket.off('receiveMessage', onReceive);
      socket.off('newMessage', onReceive);
    };
  }, [chatIdNum]);

  async function handleSend() {
    if (!text.trim() || !chatIdNum || !user?.id) return;
    const content = text.trim();
    const tempId = `temp_${Date.now()}`;
    setText('');
    setSending(true);

    const tempMsg: ChatMessage = {
      id: tempId,
      tempId,
      chatId: chatIdNum,
      senderId: user.id,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);

    const socket = getSocket();
    if (socket?.connected) {
      emitSendMessage(chatIdNum, content, tempId);
      setSending(false);
    } else {
      try {
        const msg = await sendMessage({ chatId: chatIdNum, senderId: user.id, receiverId: userId || '', content });
        setMessages((prev) => prev.map((m) => m.tempId === tempId ? msg : m));
      } catch {
        setText(content);
        setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
      } finally {
        setSending(false);
      }
    }
  }

  return {
    messages,
    fetching,
    initError,
    chatIdNum,
    text,
    setText,
    sending,
    handleSend,
    listRef,
    currentUserId: user?.id ?? '',
  };
}
