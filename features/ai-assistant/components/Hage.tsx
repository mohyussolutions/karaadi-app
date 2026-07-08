import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { toggleHage, closeHage, addUserMessage, sendHageMessage, clearHage } from '../../../store/slices/hageSlice';
import { useAuthStore } from '../../../store/authStore';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { getListingDetailRoute, type ListingRoute } from '../../../util/helpers/nav.routing';
import { createStyles } from '../../../util/styles/layout/hage.styles';
import type { HageMessage, ListingRef } from '../../../util/types/hage.types';
import { SHEET_TOP, H } from '../constants';
import { useFabDrag } from '../hooks/useFabDrag';
import { useSheetDrag } from '../hooks/useSheetDrag';
import { HageMessageList } from './HageMessageList';
import { HageInputBar } from './HageInputBar';

export default function Hage() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuthStore();
  const { open, messages, loading } = useAppSelector((s) => s.hage);
  const { t, lang } = useAppTranslation();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<HageMessage>>(null);

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const slideY = useRef(new Animated.Value(H)).current;
  const { fabPan, fabResponder } = useFabDrag(insets);
  const { dragY, sheetDragResponder } = useSheetDrag(() => dispatch(closeHage()));

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

  function handleFabPress() {
    if (!user) {
      dispatch(closeHage());
      router.push('/(auth)/login');
      return;
    }
    dispatch(toggleHage());
  }

  function handleSend() {
    if (!user) {
      dispatch(closeHage());
      router.push('/(auth)/login');
      return;
    }
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    dispatch(addUserMessage(text));
    dispatch(sendHageMessage({ content: text, lang, history: messages }));
  }

  function navigateToRoute(route: ListingRoute) {
    dispatch(closeHage());
    router.push(route as any);
  }

  function handleListingPress(item: ListingRef) {
    navigateToRoute(getListingDetailRoute(
      { id: item.id || item._id, mainCategory: item.mainCategory, category: item.category },
    ));
  }

  const sheetTranslateY = Animated.add(slideY, dragY);

  return (
    <>
      <Animated.View
        style={[styles.sheet, { opacity: open ? 1 : 0, transform: [{ translateY: sheetTranslateY }] }]}
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

        <HageMessageList
          listRef={listRef}
          messages={messages}
          loading={loading}
          insets={insets}
          emptyText={t('hage.placeholder')}
          thinkingText={t('hage.thinking')}
          onListingPress={handleListingPress}
          onLinkPress={navigateToRoute}
        />

        <HageInputBar
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
          loading={loading}
          placeholder={t('hage.placeholder')}
          insets={insets}
        />
      </Animated.View>

      <Animated.View
        style={[styles.fabWrap, { transform: [{ translateX: fabPan.x }, { translateY: fabPan.y }] }]}
        {...fabResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={handleFabPress}
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
