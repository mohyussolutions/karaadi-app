import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  FlatList, KeyboardAvoidingView, Animated, Dimensions,
  PanResponder, Platform, StatusBar, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  toggleHage, closeHage, addUserMessage, sendHageMessage, clearHage,
} from '../../store/slices/hageSlice';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { getListingDetailRoute } from '../../utils/helpers/nav.routing';
import { getImageUrl, formatPrice } from '../../utils/helpers';
import { createStyles } from './Hage.styles';
import type { ListingRef } from '../../api/sockets/hage.actions';

const { width: W, height: H } = Dimensions.get('window');
const STATUSBAR_H = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;
const SHEET_TOP = STATUSBAR_H + 48;
const SHEET_H = H - SHEET_TOP;
const DRAG_THRESHOLD = 80;

const FAB_SIZE = 56;
const FAB_INIT_X = W - FAB_SIZE - 20;
const FAB_INIT_Y = H - FAB_SIZE - 100;

function ListingChip({ item, onPress }: { item: ListingRef; onPress: () => void }) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const image = item.images?.[0] ? getImageUrl(item.images[0]) : null;
  return (
    <TouchableOpacity style={styles.chip} onPress={onPress} activeOpacity={0.82}>
      {image ? (
        <Image source={{ uri: image }} style={styles.chipImg} resizeMode="cover" />
      ) : (
        <View style={[styles.chipImg, styles.chipImgPlaceholder]}>
          <MaterialCommunityIcons name="image-outline" size={16} color={Colors.textMuted} />
        </View>
      )}
      <View style={styles.chipInfo}>
        <Text style={styles.chipTitle} numberOfLines={2}>{item.title}</Text>
        {item.price != null && (
          <Text style={styles.chipPrice}>{formatPrice(item.price)}</Text>
        )}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function Hage() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { open, messages, loading } = useAppSelector((s) => s.hage);
  const { t, lang } = useAppTranslation();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

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

  function handleListingPress(item: ListingRef) {
    const route = getListingDetailRoute(
      { id: item.id || item._id, mainCategory: item.mainCategory, category: item.category },
    );
    dispatch(closeHage());
    router.push(route as any);
  }

  const sheetTranslateY = Animated.add(slideY, dragY);

  return (
    <>
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
        pointerEvents={open ? 'auto' : 'none'}
      >
        <View style={styles.handleBar} {...sheetDragResponder.panHandlers}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <MaterialCommunityIcons name="robot-excited-outline" size={22} color={Colors.white} />
              <Text style={styles.sheetTitle}>{t('hage.title')}</Text>
            </View>
            <View style={styles.sheetActions}>
              <TouchableOpacity onPress={() => dispatch(clearHage())} style={styles.headerBtn} hitSlop={8}>
                <MaterialCommunityIcons name="refresh" size={20} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dispatch(closeHage())} style={styles.headerBtn} hitSlop={8}>
                <MaterialCommunityIcons name="close" size={22} color={Colors.white} />
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
              <MaterialCommunityIcons name="robot-outline" size={48} color={Colors.gray300} />
              <Text style={styles.emptyText}>{t('hage.placeholder')}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View>
              <View style={[styles.bubble, item.fromAI ? styles.bubbleAI : styles.bubbleUser]}>
                <Text style={[styles.bubbleText, !item.fromAI && styles.bubbleTextUser]}>
                  {item.content}
                </Text>
              </View>
              {item.fromAI && item.listings && item.listings.length > 0 && (
                <View style={styles.listingsWrap}>
                  {item.listings.map((listing: ListingRef) => (
                    <ListingChip
                      key={listing.id || listing._id}
                      item={listing}
                      onPress={() => handleListingPress(listing)}
                    />
                  ))}
                </View>
              )}
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
              placeholderTextColor={Colors.placeholder}
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
                color={input.trim() && !loading ? Colors.white : Colors.textMuted}
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
            color={Colors.white}
          />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
