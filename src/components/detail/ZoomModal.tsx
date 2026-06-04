import React, { useEffect, useRef, useState } from 'react';
import {
  View, Image, FlatList, TouchableOpacity, StyleSheet, Modal, StatusBar, Text,
} from 'react-native';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  images: string[];
  startIndex: number;
  title: string;
  onClose: () => void;
}

export default function ZoomModal({ visible, images, startIndex, title, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const [current, setCurrent] = useState(startIndex);

  useEffect(() => {
    if (visible) {
      setCurrent(startIndex);
      setTimeout(
        () => flatRef.current?.scrollToIndex({ index: startIndex, animated: false }),
        50,
      );
    }
  }, [visible, startIndex]);

  function goTo(i: number) {
    const next = Math.max(0, Math.min(i, images.length - 1));
    setCurrent(next);
    flatRef.current?.scrollToIndex({ index: next, animated: true });
  }

  return (
    <Modal visible={visible} transparent={false} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={[s.root, { paddingTop: insets.top }]}>

        <View style={s.header}>
          <Text style={s.headerTitle} numberOfLines={1}>{title}</Text>
          <View style={s.headerRight}>
            {images.length > 1 && (
              <Text style={s.counter}>{current + 1} / {images.length}</Text>
            )}
            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={flatRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => `zoom-${i}`}
          initialScrollIndex={startIndex}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) =>
            setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item: img }) => (
            <View style={s.imgWrap}>
              <Image source={{ uri: img }} style={s.image} resizeMode="contain" />
            </View>
          )}
        />

        {images.length > 1 && (
          <>
            <TouchableOpacity style={[s.arrow, s.arrowL]} onPress={() => goTo(current - 1)}>
              <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={[s.arrow, s.arrowR]} onPress={() => goTo(current + 1)}>
              <MaterialCommunityIcons name="chevron-right" size={28} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        {images.length > 1 && (
          <View style={[s.thumbBar, { paddingBottom: insets.bottom + 10 }]}>
            <FlatList
              data={images}
              horizontal
              keyExtractor={(_, i) => `zt-${i}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
              renderItem={({ item: img, index }) => (
                <TouchableOpacity onPress={() => goTo(index)}>
                  <Image
                    source={{ uri: img }}
                    style={[s.thumb, index === current && s.thumbActive]}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.8)', gap: 12,
  },
  headerTitle: { flex: 1, color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  counter: { color: 'rgba(255,255,255,0.55)', fontSize: 13 },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  imgWrap: { width, flex: 1, justifyContent: 'center' },
  image: { width, height: height * 0.65 },
  arrow: {
    position: 'absolute', top: '50%', marginTop: -28,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center',
  },
  arrowL: { left: 12 },
  arrowR: { right: 12 },
  thumbBar: { backgroundColor: 'rgba(0,0,0,0.8)', paddingTop: 12 },
  thumb: {
    width: 56, height: 56, borderRadius: 8,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', opacity: 0.6,
  },
  thumbActive: { borderColor: '#fff', opacity: 1 },
});
