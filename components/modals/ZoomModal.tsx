import React, { useEffect, useRef, useState } from 'react';
import type { ZoomModalProps } from '../../util/types';
import {
  View, Image, FlatList, TouchableOpacity, Modal, StatusBar, Text,
} from 'react-native';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { getModalHeaderPaddingTop } from '../common/common-for-ios-andriod';
import { createStyles } from '../../util/styles/detail/ZoomModal.styles';

const { width, height } = Dimensions.get('window');

export default function ZoomModal({ visible, images, startIndex, title, onClose }: ZoomModalProps) {
  const insets = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const [current, setCurrent] = useState(startIndex);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

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
      <StatusBar barStyle="light-content" backgroundColor={Colors.black} />
      <View style={[styles.root, { paddingTop: getModalHeaderPaddingTop(insets.top) }]}>

        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          <View style={styles.headerRight}>
            {images.length > 1 && (
              <Text style={styles.counter}>{current + 1} / {images.length}</Text>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={20} color={Colors.white} />
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
          scrollEventThrottle={8}
          decelerationRate="fast"
          disableIntervalMomentum
          onScroll={(e) => setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item: img }) => (
            <View style={styles.imgWrap}>
              <Image source={{ uri: img }} style={styles.image} resizeMode="contain" />
            </View>
          )}
        />

        {images.length > 1 && (
          <View style={[styles.thumbBar, { paddingBottom: insets.bottom + 10 }]}>
            <FlatList
              data={images}
              horizontal
              keyExtractor={(_, i) => `zt-${i}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbList}
              renderItem={({ item: img, index }) => (
                <TouchableOpacity onPress={() => goTo(index)}>
                  <Image
                    source={{ uri: img }}
                    style={[styles.thumb, index === current && styles.thumbActive]}
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
