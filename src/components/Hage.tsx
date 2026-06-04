import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Animated, Dimensions,
  PanResponder, Platform, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../store';
import {
  toggleHage, closeHage, addUserMessage, sendHageMessage, clearHage,
} from '../store/slices/hageSlice';
import { useAppTranslation } from '../hooks/useAppTranslation';
import COLORS from '../constants/colors';

const { width: W, height: H } = Dimensions.get('window');
const STATUSBAR_H = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;
const SHEET_TOP = STATUSBAR_H + 48;
const SHEET_H = H - SHEET_TOP;
const DRAG_THRESHOLD = 80;

const FAB_SIZE = 56;
const FAB_INIT_X = W - FAB_SIZE - 20;
const FAB_INIT_Y = H - FAB_SIZE - 100;

export default function Hage() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { open, messages, loading } = useAppSelector((s) => s.hage);
  const { t, lang } = useAppTranslation();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const slideY = useRef(new Animated.Value(H)).current;

  const fabPosRef = useRef({ x: FAB_INIT_X, y: FAB_INIT_Y });
  const fabPan = useRef(new Animated.ValueXY({ x: FAB_INIT_X, y: FAB_INIT_Y })).current;

  const dragY = useRef(new Animated.Value(0)).current;
  const dragRef = useRef(0);
  const isDraggingDown = useRef(false);

  useEffect(() => {
    Animated.spring(slideY, {
      toValue: open ? SHEET_TOP : H,
      useNativeDriver: true,
      tension: 65,
      friction: 12,
    }).start();
  }, [open]);

  useEffect(() => {
    if (open && messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages, open]);

  const fabResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        fabPan.setOffset({ x: fabPosRef.current.x, y: fabPosRef.current.y });
        fabPan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: fabPan.x, dy: fabPan.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: (_, g) => {
        fabPan.flattenOffset();
        const nx = Math.max(0, Math.min(fabPosRef.current.x + g.dx, W - FAB_SIZE));
        const ny = Math.max(SHEET_TOP, Math.min(fabPosRef.current.y + g.dy, H - FAB_SIZE - insets.bottom));
        fabPosRef.current = { x: nx, y: ny };
        Animated.spring(fabPan, {
          toValue: { x: nx, y: ny },
          useNativeDriver: false,
          tension: 80,
          friction: 14,
        }).start();
      },
      onPanResponderTerminate: () => { fabPan.flattenOffset(); },
    }),
  ).current;

  const sheetDragResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8,
      onPanResponderGrant: () => {
        isDraggingDown.current = false;
        dragRef.current = 0;
        dragY.setValue(0);
      },
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          isDraggingDown.current = true;
          dragRef.current = g.dy;
          dragY.setValue(g.dy);
        }
      },
      onPanResponderRelease: () => {
        if (isDraggingDown.current && dragRef.current > DRAG_THRESHOLD) {
          Animated.timing(dragY, { toValue: 0, duration: 0, useNativeDriver: true }).start();
          dispatch(closeHage());
        } else {
          Animated.spring(dragY, {
            toValue: 0, useNativeDriver: true, tension: 80, friction: 14,
          }).start();
        }
        isDraggingDown.current = false;
        dragRef.current = 0;
      },
    }),
  ).current;

  function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    dispatch(addUserMessage(text));
    dispatch(sendHageMessage({ content: text, lang, history: messages }));
  }

  const sheetTranslateY = Animated.add(slideY, dragY);

  return (
    <>
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: sheetTranslateY }] },
        ]}
        pointerEvents={open ? 'auto' : 'none'}
      >
        <View style={styles.handleBar} {...sheetDragResponder.panHandlers}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <MaterialCommunityIcons name="robot-excited-outline" size={22} color={COLORS.white} />
              <Text style={styles.sheetTitle}>{t('hage.title')}</Text>
            </View>
            <View style={styles.sheetActions}>
              <TouchableOpacity onPress={() => dispatch(clearHage())} style={styles.headerBtn} hitSlop={8}>
                <MaterialCommunityIcons name="refresh" size={20} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dispatch(closeHage())} style={styles.headerBtn} hitSlop={8}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={[styles.messageList, { paddingBottom: insets.bottom + 8 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="robot-outline" size={48} color={COLORS.gray300} />
              <Text style={styles.emptyText}>{t('hage.placeholder')}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.fromAI ? styles.bubbleAI : styles.bubbleUser]}>
              <Text style={[styles.bubbleText, !item.fromAI && styles.bubbleTextUser]}>
                {item.content}
              </Text>
            </View>
          )}
        />

        {loading && (
          <View style={styles.thinkingRow}>
            <View style={styles.thinkingDots}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.dot, { opacity: 0.4 + i * 0.2 }]} />
              ))}
            </View>
            <Text style={styles.thinkingText}>{t('hage.thinking')}</Text>
          </View>
        )}

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={t('hage.placeholder')}
              placeholderTextColor={COLORS.placeholder}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!loading}
              multiline={false}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!input.trim() || loading}
            >
              <MaterialCommunityIcons
                name="send"
                size={18}
                color={input.trim() && !loading ? COLORS.white : COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>

      <Animated.View
        style={[styles.fabWrap, { transform: [{ translateX: fabPan.x }, { translateY: fabPan.y }] }]}
        {...fabResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => dispatch(toggleHage())}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name={open ? 'close' : 'robot-excited-outline'}
            size={26}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: SHEET_H,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 20,
    overflow: 'hidden',
  },
  handleBar: {
    backgroundColor: '#06069C',
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: COLORS.white },
  sheetActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  messageList: { padding: 16, gap: 10 },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleAI: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.gray100,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 15, color: COLORS.textPrimary, lineHeight: 22 },
  bubbleTextUser: { color: COLORS.white },
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  thinkingDots: { flexDirection: 'row', gap: 4 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary },
  thinkingText: { fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: COLORS.gray200 },
  fabWrap: {
    position: 'absolute',
    zIndex: 100,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: '#06069C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
