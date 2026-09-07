import { useCallback, useState } from 'react';
import {
  View, Text, FlatList,
  KeyboardAvoidingView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KEYBOARD_AVOIDING_BEHAVIOR } from '../../../../platform/common-for-ios-andriod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { blockUser } from '../../../../actions/core/block.actions';
import { ConfirmModal } from '../../../modals/ConfirmModal';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { useChatConversation } from '../../../../hooks/useChatConversation';
import type { ChatMessage } from '../../../../util/types';
import { createStyles } from '../../../../util/styles/profile/chat.styles';
import { ChatHeader } from '../components/ChatHeader';
import { ChatComposer } from '../components/ChatComposer';
import { MessageBubble } from '../components/MessageBubble';

export default function ChatScreen() {
  const { chatId: chatIdParam, userId, username, listingId, listingType } =
    useLocalSearchParams<{ chatId?: string; userId?: string; username?: string; listingId?: string; listingType?: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const [showBlockModal, setShowBlockModal] = useState(false);

  const {
    messages, fetching, initError, text, setText, sending,
    handleSend, listRef, currentUserId,
  } = useChatConversation({ chatIdParam, userId, username, listingId, listingType });

  async function handleConfirmBlock() {
    if (!userId) return;
    try { await blockUser(userId); } catch {}
    router.back();
  }

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <MessageBubble item={item} isMe={String(item.senderId) === String(currentUserId)} />
  ), [currentUserId]);

  const header = (
    <ChatHeader
      username={username}
      userId={userId}
      onBack={() => router.back()}
      onBlockPress={() => setShowBlockModal(true)}
    />
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
        behavior={KEYBOARD_AVOIDING_BEHAVIOR}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          style={styles.flexFull}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
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
          renderItem={renderMessage}
        />

        <ChatComposer value={text} onChangeText={setText} onSend={handleSend} sending={sending} />
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
