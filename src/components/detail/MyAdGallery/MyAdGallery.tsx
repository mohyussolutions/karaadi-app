import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import RemoteImage from '../../shared/RemoteImage/RemoteImage';
import { useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/profile/myAdManage.styles';
import { fixedSize } from '../../../utils/styles/common/dynamic.styles';
import type { MyAdGalleryProps, ScrollEvent } from '../../../utils/types';

export default function MyAdGallery({ images, width, sold, soldLabel }: MyAdGalleryProps) {
  const styles = useThemedStyles(createStyles);
  const [index, setIndex] = useState(0);
  const height = Math.round(width * 0.75);

  function handleScrollEnd(event: ScrollEvent) {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }

  return (
    <View style={[styles.galleryWrap, fixedSize(width, height)]}>
      <ScrollView
        horizontal
        pagingEnabled
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {images.map((uri, i) => (
          <RemoteImage key={`${uri}-${i}`} source={{ uri }} style={fixedSize(width, height)} contentFit="cover" />
        ))}
      </ScrollView>

      {sold && (
        <View style={styles.soldBadge}>
          <Text style={styles.soldBadgeText}>{soldLabel}</Text>
        </View>
      )}

      {images.length > 1 && (
        <>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{index + 1}/{images.length}</Text>
          </View>
          <View style={styles.dots}>
            {images.map((uri, i) => (
              <View key={`${uri}-dot-${i}`} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}
