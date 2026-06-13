import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { getImageUrl, formatPrice } from '../../../utils/helpers';
import { createStyles } from '../../../utils/styles/layout/hage.styles';
import type { ListingRef } from '../../../utils/types/hage.types';

export function ListingChip({ item, onPress }: { item: ListingRef; onPress: () => void }) {
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
