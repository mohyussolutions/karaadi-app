import { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { getChatMessages, sendMessage, createOrFindChat } from '../../api/core/message.actions';
import { blockUser } from '../../api/core/block.actions';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { joinChat, leaveChat, emitSendMessage, emitMarkAsRead, getSocket } from '../../api/sockets/socket.actions';
import { setActiveChatId, cacheUserName } from '../../services/chatState';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import type { ChatMessage } from '../../util/types';
import { createStyles } from '../../util/styles/profile/chat.styles';

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

export default function ChatScreen() {
  const { chatId: chatIdParam, userId, username, listingId, listingType } =
    useLocalSearchParams<{ chatId?: string; userId?: string; username?: string; listingId?: string; listingType?: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fetching, setFetching] = useState(true);
  const [initError, setInitError] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [chatIdNum, setChatIdNum] = useState(0);
  const [showBlockModal, setShowBlockModal] = useState(false);

  const listRef = useRef<FlatList>(null);
  const chatIdRef = useRef(0);
  const allIdsRef = useRef<number[]>([]);
  const initial = (username?.[0] ?? '?').toUpperCase();

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
      const msgChatId = (msg as any).chatId;
      if (msgChatId && !allIdsRef.current.includes(msgChatId)) return;
      const tempKey = (msg as any).tempId;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;

        const pendingIndex = prev.findIndex((m) => {
          const mTempId = (m as any).tempId;
          if (!mTempId) return false;
          return tempKey ? mTempId === tempKey : m.content === msg.content;
        });

        if (pendingIndex !== -1) {
          const next = [...prev];
          next[pendingIndex] = { ...msg, tempId: (prev[pendingIndex] as any).tempId } as any;
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

    const tempMsg: any = {
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
        setMessages((prev) => prev.map((m) => (m as any).tempId === tempId ? msg : m));
      } catch {
        setText(content);
        setMessages((prev) => prev.filter((m) => (m as any).tempId !== tempId));
      } finally {
        setSending(false);
      }
    }
  }

  async function handleConfirmBlock() {
    if (!userId) return;
    try { await blockUser(userId); } catch {}
    router.back();
  }

  const header = (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
        <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.primary} />
      </TouchableOpacity>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <Text style={[styles.headerName, { flex: 1 }]} numberOfLines={1}>{username || t('chats.chatFallback')}</Text>
      {!!userId && (
        <TouchableOpacity onPress={() => setShowBlockModal(true)} hitSlop={10} style={{ paddingHorizontal: 8 }}>
          <MaterialCommunityIcons name="block-helper" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (initError) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {header}
        <View style={styles.centerWrap}>
          <MaterialCommunityIcons name="message-alert-outline" size={52} color={Colors.textMuted} />
          <Text style={styles.errorText}>{t('chats.couldNotOpen')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {header}

      <KeyboardAvoidingView
        style={styles.flexFull}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          style={styles.flexFull}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListHeaderComponent={
            fetching ? (
              <View style={styles.fetchingRow}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.fetchingText}>{t('chats.loadingMessages')}</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            fetching ? null : (
              <View style={styles.centerWrap}>
                <MaterialCommunityIcons name="message-outline" size={52} color={Colors.border} />
                <Text style={styles.emptyTitle}>{t('chats.noMessagesYet')}</Text>
                <Text style={styles.emptySub}>{t('chats.startConversation')}</Text>
              </View>
            )
          }
          renderItem={({ item }) => {
            const isMe = String(item.senderId) === String(user?.id ?? '');
            const ts = item.timestamp || item.createdAt || '';
            return (
              <View style={[styles.row, isMe ? styles.rowMe : styles.rowThem]}>
                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                    {item.content}
                  </Text>
                  {!!ts && (
                    <Text style={[styles.time, isMe ? styles.timeMe : styles.timeThem]}>
                      {new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={t('chats.typeMessage')}
            placeholderTextColor={Colors.slate500}
            multiline
            maxLength={500}
            textAlignVertical="top"
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnOff]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            {sending
              ? <ActivityIndicator size="small" color={Colors.white} />
              : <MaterialCommunityIcons name="send" size={20} color={text.trim() ? Colors.white : Colors.slate500} />
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <ConfirmModal
        visible={showBlockModal}
        title={t('chats.blockUser')}
        message={t('chats.blockUserConfirm')}
        onDismiss={() => setShowBlockModal(false)}
        actions={[
          { label: t('chats.cancel'), onPress: () => {} },
          { label: t('chats.block'), onPress: handleConfirmBlock, destructive: true },
        ]}
      />
    </SafeAreaView>
  );
}
