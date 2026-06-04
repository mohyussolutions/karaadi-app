import React, { useRef } from 'react';
import {
  View, Image, FlatList, TouchableOpacity, StyleSheet, Text, Platform,
} from 'react-native';
import { Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
export const IMG_H = Math.round(width * 0.88);

interface Props {
  images: string[];
  activeIndex: number;
  onActiveChange: (i: number) => void;
  onZoom: () => void;
  isFavorite: boolean;
  onFavorite: () => void;
  badge?: { label: string; color: string } | null;
  isSold?: boolean;
}

export default function ImageGallery({
  images, activeIndex, onActiveChange, onZoom, isFavorite, onFavorite, badge, isSold,
}: Props) {
  const flatRef = useRef<FlatList>(null);

  function goTo(i: number) {
    const next = Math.max(0, Math.min(i, images.length - 1));
    onActiveChange(next);
    flatRef.current?.scrollToIndex({ index: next, animated: true });
  }

  return (
    <View style={s.wrapper}>
      <FlatList
        ref={flatRef}
        data={images}
        horizontal
        pagingEnabled
        decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.92}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => `img-${i}`}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) =>
          onActiveChange(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item: img }) => (
          <Image source={{ uri: img }} style={s.image} resizeMode="cover" />
        )}
      />

      {images.length > 1 && (
        <>
          <TouchableOpacity style={[s.arrow, s.arrowL]} onPress={() => goTo(activeIndex - 1)} activeOpacity={0.8}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[s.arrow, s.arrowR]} onPress={() => goTo(activeIndex + 1)} activeOpacity={0.8}>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      <View style={s.topRow}>
        {images.length > 1 && (
          <View style={s.counter}>
            <Text style={s.counterText}>{activeIndex + 1} / {images.length}</Text>
          </View>
        )}
        <View style={s.topActions}>
          <TouchableOpacity style={s.actionBtn} onPress={onFavorite} activeOpacity={0.85}>
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorite ? '#EF4444' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={s.actionBtn} onPress={onZoom} activeOpacity={0.85}>
            <MaterialCommunityIcons name="magnify-plus-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {isSold && (
        <View style={StyleSheet.absoluteFill}>
          <View style={s.soldOverlay}>
            <Text style={s.soldText}>WAA LA GATAY</Text>
          </View>
        </View>
      )}

      {images.length > 1 && (
        <View style={s.dotsOverlay}>
          {images.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)} hitSlop={8}>
              <View style={[s.dot, i === activeIndex && s.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {images.length > 1 && (
        <FlatList
          data={images}
          horizontal
          keyExtractor={(_, i) => `thumb-${i}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.thumbStrip}
          renderItem={({ item: img, index }) => (
            <TouchableOpacity onPress={() => goTo(index)} activeOpacity={0.75}>
              <Image
                source={{ uri: img }}
                style={[s.thumb, index === activeIndex && s.thumbActive]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

export const s = StyleSheet.create({
  wrapper: { backgroundColor: '#111' },
  image: { width, height: IMG_H },
  arrow: {
    position: 'absolute',
    top: IMG_H / 2 - 20,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowL: { left: 10 },
  arrowR: { right: 10 },
  topRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  topActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldText: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  dotsOverlay: {
    position: 'absolute',
    bottom: 56,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotActive: { width: 18, backgroundColor: '#fff', borderRadius: 3 },
  thumbStrip: { paddingHorizontal: 10, paddingBottom: 10, paddingTop: 6, gap: 6, backgroundColor: '#111' },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.6,
  },
  thumbActive: { borderColor: '#3B82F6', opacity: 1 },
});
