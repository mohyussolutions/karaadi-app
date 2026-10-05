import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from 'expo-router';

import { CHAT_MESSAGE_MAX_LENGTH, CHAT_SCROLL_DELAY_MS } from '../../actions/constants';
import {
  createOrFindChat,
  getChatMessages,
  getMyChats,
  markChatRead,
  sendMessage,
} from '../../actions/core/message.actions';
import { emitMarkAsRead, emitSendMessage, getSocket, joinChat, leaveChat } from '../../actions/sockets/socket.actions';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { parseHageReply } from '../../components/ai-assistant/utils/parseHageLinks';
import { cacheUserName, setActiveChatId } from '../../components/features/chat/services/chatState';
import { markChatsRead, selectChats, setChats } from '../../store/slices/chatsSlice';
import { markChatNotificationsRead } from '../../store/slices/notificationsSlice';
import {
  buildPendingMessage,
  mergeIncomingMessage,
  parseChatIds,
  sortMessagesByTime,
  toChatItemModel,
} from '../../lib/helpers';

import type { AnimatedCallback, AppDispatch, Chat, ChatMessage, ChatMessageListRef, ChatPeer, GroupedChat, HageMessage, IdentifiedUser, NumberListRef, StateSetter, UseChatConversationArgs } from '../../utils/types';

const chatIdCache = new Map<string, number>();

const resolveChatId = async (
  routeChatIds: number[],
  ownUserId: string,
  { userId, listingId, listingType }: ChatPeer,
): Promise<number | null> => {
  if (routeChatIds[0]) return routeChatIds[0];
  if (!userId) return 0;
  const cacheKey = `${ownUserId}:${userId}:${listingId || ''}`;
  const cachedChatId = chatIdCache.get(cacheKey);
  if (cachedChatId) return cachedChatId;
  try {
    const { chat } = await createOrFindChat({
      senderId: ownUserId,
      receiverId: userId,
      itemId: listingId || '',
      itemModel: toChatItemModel(listingType),
    });
    chatIdCache.set(cacheKey, chat.id);
    return chat.id;
  } catch {
    return null;
  }
};

const joinAndMarkRead = (chatIds: number[], dispatch: AppDispatch) => {
  const socketConnected = !!getSocket()?.connected;
  chatIds.forEach((id) => {
    joinChat(id);
    emitMarkAsRead(id);
    if (!socketConnected) markChatRead(id).catch(() => {});
  });
  dispatch(markChatsRead(chatIds));
  dispatch(markChatNotificationsRead(chatIds));
};

const loadMessages = (chatIds: number[], ownUserId: string) =>
  Promise.all(chatIds.map((id) => getChatMessages(id, ownUserId).catch(() => [] as ChatMessage[])));

const sendOverSocket = (chatId: number, content: string, tempId: string): boolean => {
  if (!getSocket()?.connected) return false;
  emitSendMessage(chatId, content, tempId);
  return true;
};

const useIncomingMessages = (
  chatIdNum: number,
  chatIdsRef: NumberListRef,
  setMessages: StateSetter<ChatMessage[]>,
  dispatch: AppDispatch,
  scrollToLatest: AnimatedCallback,
) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatIdNum) return;

    const handleIncomingMessage = (incoming: ChatMessage) => {
      if (incoming.chatId && !chatIdsRef.current.includes(incoming.chatId)) return;
      setMessages((current) => mergeIncomingMessage(current, incoming));
      emitMarkAsRead(chatIdNum);
      dispatch(markChatNotificationsRead([chatIdNum]));
      scrollToLatest(true);
    };

    socket.on('receiveMessage', handleIncomingMessage);
    socket.on('newMessage', handleIncomingMessage);
    return () => {
      socket.off('receiveMessage', handleIncomingMessage);
      socket.off('newMessage', handleIncomingMessage);
    };
  }, [chatIdNum, dispatch, scrollToLatest]);
};

const useConversationLoader = (
  { chatIdParam, userId, username, listingId, listingType }: UseChatConversationArgs,
  scrollToLatest: AnimatedCallback,
) => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fetching, setFetching] = useState(true);
  const [initError, setInitError] = useState(false);
  const [chatIdNum, setChatIdNum] = useState(0);
  const chatIdsRef = useRef<number[]>([]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    if (userId && username) cacheUserName(userId, username);
    const currentUserId = user?.id;
    if (!currentUserId) {
      setFetching(false);
      return;
    }

    const openConversation = async (ownUserId: string) => {
      const routeChatIds = parseChatIds(chatIdParam);
      const chatId = await resolveChatId(routeChatIds, ownUserId, { userId, listingId, listingType });
      if (chatId === null) {
        setInitError(true);
        setFetching(false);
        return;
      }

      const chatIds = routeChatIds.length > 0 ? routeChatIds : chatId ? [chatId] : [];
      chatIdsRef.current = chatIds;
      setChatIdNum(chatId);
      if (!chatId) {
        setFetching(false);
        return;
      }

      setActiveChatId(chatId);
      joinAndMarkRead(chatIds, dispatch);
      loadMessages(chatIds, ownUserId)
        .then((messageLists) => {
          setMessages(sortMessagesByTime(messageLists));
          scrollToLatest(false);
        })
        .finally(() => setFetching(false));
    };

    openConversation(currentUserId);
    return () => {
      chatIdsRef.current.forEach((id) => leaveChat(id));
      setActiveChatId(null);
    };
  }, [user?.id]);

  useIncomingMessages(chatIdNum, chatIdsRef, setMessages, dispatch, scrollToLatest);

  return { user, messages, setMessages, fetching, initError, chatIdNum };
};

const useMessageComposer = (
  chatIdNum: number,
  ownUserId: string | undefined,
  peerUserId: string | undefined,
  setMessages: StateSetter<ChatMessage[]>,
  scrollToLatest: AnimatedCallback,
) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);

  const handleSend = async () => {
    const content = text.trim().slice(0, CHAT_MESSAGE_MAX_LENGTH);
    if (!content || !chatIdNum || !ownUserId || sendingRef.current) return;
    sendingRef.current = true;
    setText('');
    setSending(true);

    const pending = buildPendingMessage(chatIdNum, ownUserId, content);
    setMessages((current) => [...current, pending]);
    scrollToLatest(true);

    try {
      if (sendOverSocket(chatIdNum, content, String(pending.tempId))) return;
      const saved = await sendMessage({
        chatId: chatIdNum,
        senderId: ownUserId,
        receiverId: peerUserId || '',
        content,
      });
      setMessages((current) => current.map((message) => (message.tempId === pending.tempId ? saved : message)));
    } catch {
      setText(content);
      setMessages((current) => current.filter((message) => message.tempId !== pending.tempId));
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  return { text, setText, sending, handleSend };
};

export const useChatConversation = (args: UseChatConversationArgs) => {
  const listRef = useRef<ChatMessageListRef>(null);
  const scrollToLatest = useCallback((animated: boolean) => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated }), CHAT_SCROLL_DELAY_MS);
  }, []);
  const { user, messages, setMessages, fetching, initError, chatIdNum } = useConversationLoader(args, scrollToLatest);
  const { text, setText, sending, handleSend } = useMessageComposer(
    chatIdNum,
    user?.id,
    args.userId,
    setMessages,
    scrollToLatest,
  );

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
};

export const useChatsData = () => {
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const { items: chats, loaded } = useAppSelector(selectChats);

  const loadChats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await getMyChats(user.id);
      dispatch(setChats(data));
    } catch {}
  }, [user?.id, dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [loadChats]),
  );

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
};

const groupChatsByPeer = (chats: Chat[], user: IdentifiedUser | null): GroupedChat[] => {
  if (!user) return [];
  const byUser = new Map<string, GroupedChat>();
  for (const item of chats) {
    const other = item.senderId === user.id ? item.receiver : item.sender;
    const key = other?.id ? String(other.id) : `chat-${item.id}`;
    const unread = item._count?.messages ?? 0;
    const existing = byUser.get(key);
    if (existing) {
      existing.allIds.push(item.id);
      existing.unreadTotal += unread;
      if (item.updatedAt && (!existing.updatedAt || new Date(item.updatedAt) > new Date(existing.updatedAt))) {
        existing.updatedAt = item.updatedAt;
        if (item.messages?.[0]) existing.messages = item.messages;
      }
    } else {
      byUser.set(key, { ...item, allIds: [item.id], unreadTotal: unread });
    }
  }
  return [...byUser.values()];
};

export const useGroupedChats = (chats: Chat[], user: IdentifiedUser | null) =>
  useMemo(() => groupChatsByPeer(chats, user), [chats, user]);

export const useHageSegments = (item: HageMessage) =>
  useMemo(() => (item.fromAI ? parseHageReply(item.content) : null), [item.fromAI, item.content]);
