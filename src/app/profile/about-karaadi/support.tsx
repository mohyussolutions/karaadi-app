import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { useAuthStore } from '../../../store/hooks/useAuthStore';
import { getSupportThread, markSupportRead, sendSupportMessage } from '../../../actions/core/supportChat.actions';
import { createStyles } from '../../../utils/styles/profile/supportChat.styles';
import { KEYBOARD_AVOIDING_BEHAVIOR } from '../../../lib/platform/platform';
import { ROUTES, SUPPORT_CHAT_MESSAGE_MAX, SUPPORT_CHAT_POLL_MS, SUPPORT_URL_REGEX } from '../../../actions/constants';
import type { SupportChatListRef, SupportChatMessage, SupportChatMessageRenderInfo, SupportChatRole } from '../../../utils/types';

export default function SupportChatScreen() {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const { user } = useAuthStore();
  const listRef = useRef<SupportChatListRef>(null);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const thread = await getSupportThread();
      setMessages(thread.messages);
      if (thread.conversation?.userUnread) await markSupportRead().catch(() => undefined);
      setError(null);
    } catch {
      setError(t('supportChat.error'));
    } finally {
      setLoaded(true);
    }
  }, [t]);

  useEffect(() => {
    if (!user) return;
    refresh();
    const id = setInterval(refresh, SUPPORT_CHAT_POLL_MS);
    return () => clearInterval(id);
  }, [user, refresh]);

  useEffect(() => {
    if (messages.length) setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages.length]);

  async function send() {
    const content = input.trim();
    if (!content || sending) return;
    if (SUPPORT_URL_REGEX.test(content)) {
      setError(t('supportChat.noLinks'));
      return;
    }
    setSending(true);
    try {
      const message = await sendSupportMessage(content);
      setMessages((prev) => [...prev, message]);
      setInput('');
      setError(null);
    } catch {
      setError(t('supportChat.error'));
    } finally {
      setSending(false);
    }
  }

  const senderLabel = (role: SupportChatRole) =>
    role === 'ASSISTANT' ? t('supportChat.assistant') : t('supportChat.team');

  const renderMessage = ({ item }: SupportChatMessageRenderInfo) => {
    const mine = item.senderRole === 'USER';
    return (
      <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          {!mine && <Text style={styles.sender}>{senderLabel(item.senderRole)}</Text>}
          <Text style={[styles.text, mine && styles.textMine]}>{item.content}</Text>
          <Text style={[styles.time, mine && styles.timeMine]}>
            {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('supportChat.title')}</Text>
        <Text style={styles.subtitle}>{t('supportChat.subtitle')}</Text>
      </View>

      {!user ? (
        <View style={styles.loginBox}>
          <Text style={styles.emptyText}>{t('supportChat.loginPrompt')}</Text>
          <TouchableOpacity style={styles.loginButton} activeOpacity={0.85} onPress={() => router.push(ROUTES.login)}>
            <Text style={styles.loginButtonText}>{t('auth.login.loginButton')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView style={styles.flex} behavior={KEYBOARD_AVOIDING_BEHAVIOR}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.list}
            overScrollMode="never"
            ListEmptyComponent={
              <View style={styles.empty}>
                {loaded ? (
                  <Text style={styles.emptyText}>{t('supportChat.intro')}</Text>
                ) : (
                  <ActivityIndicator color={Colors.primary} />
                )}
              </View>
            }
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={(value) => {
                setInput(value);
                setError(null);
              }}
              placeholder={t('supportChat.placeholder')}
              placeholderTextColor={Colors.textMuted}
              maxLength={SUPPORT_CHAT_MESSAGE_MAX}
              multiline
            />
            <TouchableOpacity
              style={[styles.send, (!input.trim() || sending) && styles.sendDisabled]}
              onPress={send}
              disabled={!input.trim() || sending}
              accessibilityLabel={t('supportChat.send')}
            >
              {sending ? <ActivityIndicator color={Colors.white} /> : <MaterialCommunityIcons name="send" size={18} color={Colors.white} />}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
