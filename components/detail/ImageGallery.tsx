import React, { useRef, useCallback, useState } from 'react';
import type { ImageGalleryProps } from '../../utils/types';
import {
  View, Image, ScrollView, Pressable, Text, Platform, Modal, TouchableOpacity,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles, createSheetStyles } from '../../utils/styles/detail/ImageGallery.styles';

const { width } = Dimensions.get('window');
export const IMG_H = Math.round(width * 0.88);

export default function ImageGallery({
  images, activeIndex, onActiveChange, onImagePress,
  isFavorite, onFavorite, onShare,
  badge, isSold,
}: ImageGalleryProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [saveSheet, setSaveSheet] = useState(false);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const sheetStyles = useThemedStyles(createSheetStyles);

  function goTo(i: number) {
    const next = Math.max(0, Math.min(i, images.length - 1));
    onActiveChange(next);
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
  }

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== activeIndex) onActiveChange(i);
  }, [activeIndex, onActiveChange]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={8}
        decelerationRate="fast"
        disableIntervalMomentum
        bounces={Platform.OS === 'ios'}
        overScrollMode="never"
        directionalLockEnabled
      >
        {images.map((img, i) => (
          <Pressable
            key={i}
            onPress={onImagePress}
            disabled={!onImagePress}
            style={{ width, height: IMG_H }}
          >
            <Image
              source={{ uri: img }}
              style={styles.image}
              resizeMode="cover"
            />
          </Pressable>
        ))}
      </ScrollView>

      <View style={[styles.topLeft, { top: insets.top + 12 }]}>
        {onImagePress && (
          <Pressable style={styles.actionBtn} onPress={onImagePress} hitSlop={8}>
            <MaterialCommunityIcons name="magnify-plus-outline" size={20} color={Colors.white} />
          </Pressable>
        )}
        {images.length > 1 && (
          <View style={styles.counter}>
            <Text style={styles.counterText}>{activeIndex + 1} / {images.length}</Text>
          </View>
        )}
        {badge && !isSold && (
          <View style={[styles.badge, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeText}>{badge.label}</Text>
          </View>
        )}
      </View>

      {(onFavorite || onShare) && (
        <View style={[styles.rightActions, { top: insets.top + 12 }]}>
          {onFavorite && (
            <Pressable
              style={styles.actionBtn}
              onPress={() => isFavorite ? onFavorite() : setSaveSheet(true)}
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? Colors.error : Colors.white}
              />
            </Pressable>
          )}
          {onShare && (
            <Pressable style={styles.actionBtn} onPress={onShare} hitSlop={8}>
              <MaterialCommunityIcons name="share-variant-outline" size={20} color={Colors.white} />
            </Pressable>
          )}
        </View>
      )}

      {isSold && (
        <View style={styles.soldOverlay}>
          <Text style={styles.soldText}>WAA LA GATAY</Text>
        </View>
      )}

      {images.length > 1 && (
        <View style={styles.dotsOverlay}>
          {images.map((_, i) => (
            <Pressable key={i} onPress={() => goTo(i)} hitSlop={8}>
              <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
            </Pressable>
          ))}
        </View>
      )}

      {images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbStrip}
        >
          {images.map((img, i) => (
            <Pressable key={i} onPress={() => goTo(i)} hitSlop={4}>
              <Image
                source={{ uri: img }}
                style={[styles.thumb, i === activeIndex && styles.thumbActive]}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={saveSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setSaveSheet(false)}
      >
        <Pressable style={sheetStyles.overlay} onPress={() => setSaveSheet(false)}>
          <View style={sheetStyles.sheet} onStartShouldSetResponder={() => true}>
            <View style={sheetStyles.handle} />
            <View style={sheetStyles.iconRow}>
              <MaterialCommunityIcons name="heart-outline" size={38} color={Colors.primary} />
            </View>
            <Text style={sheetStyles.title}>Save this item?</Text>
            <Text style={sheetStyles.sub}>Add to your favorites for quick access later.</Text>
            <TouchableOpacity
              style={sheetStyles.confirmBtn}
              onPress={() => { setSaveSheet(false); onFavorite!(); }}
            >
              <MaterialCommunityIcons name="heart" size={18} color={Colors.white} />
              <Text style={sheetStyles.confirmText}>Yes, Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={sheetStyles.cancelBtn} onPress={() => setSaveSheet(false)}>
              <Text style={sheetStyles.cancelText}>No, Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
