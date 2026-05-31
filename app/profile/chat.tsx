import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getConversation, sendMessage } from '../../src/api/messages';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import type { Message } from '../../src/types';

export default function ChatScreen() {
  const { userId, username, listingId } = useLocalSearchParams<{
    userId: string;
    username: string;
    listingId?: string;
  }>();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({ title: username || 'Chat' });
    if (!userId) { setLoading(false); return; }
    getConversation(userId)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleSend() {
    if (!text.trim() || !userId) return;
    const content = text.trim();
    setText('');
    setSending(true);
    try {
      const msg = await sendMessage({ receiverId: userId, content, listingId });
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      setText(content);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatText}>Send a message to start the conversation</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isMe = item.senderId === (user?._id || user?.id);
            return (
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
                  {item.content}
                </Text>
                <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          }}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={Colors.placeholder}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={text.trim() && !sending ? Colors.white : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, gap: 8, flexGrow: 1 },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyChatText: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  bubble: {
    maxWidth: '78%', paddingHorizontal: 13, paddingVertical: 9,
    borderRadius: 16, marginBottom: 4,
  },
  bubbleMe: { alignSelf: 'flex-end', backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleThem: { alignSelf: 'flex-start', backgroundColor: Colors.white, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, color: Colors.text, lineHeight: 20 },
  bubbleTextMe: { color: Colors.white },
  bubbleTime: { fontSize: 10, color: Colors.textMuted, marginTop: 3, textAlign: 'right' },
  bubbleTimeMe: { color: Colors.white + 'aa' },
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    padding: 10, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  input: {
    flex: 1, backgroundColor: Colors.inputBg, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 15,
    color: Colors.text, maxHeight: 100,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.border },
});
