import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/app/useTheme';
import { getImageUrl, formatPrice } from '../../../../lib/helpers';
import { useAppTranslation } from '../../../../hooks/app/useAppTranslation';
import { createStyles } from '../../../../utils/styles/layout/hageAssistant.styles';
import type { ListingChipProps } from "../../../../utils/types";

export const ListingChip = memo(function ListingChip({ item, onPress }: ListingChipProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const image = item.images?.[0] ? getImageUrl(item.images[0]) : null;
  return (
    <TouchableOpacity style={styles.chip} onPress={onPress} activeOpacity={0.82}>
      {image ? (
        <Image source={{ uri: image }} style={styles.chipImg} contentFit="cover" cachePolicy="memory-disk" />
      ) : (
        <View style={[styles.chipImg, styles.chipImgPlaceholder]}>
          <MaterialCommunityIcons name="image-outline" size={16} color={Colors.textMuted} />
        </View>
      )}
      <View style={styles.chipInfo}>
        <Text style={styles.chipTitle} numberOfLines={2}>{item.title}</Text>
        {item.price != null && (
          <Text style={[styles.chipPrice, item.maGaday && styles.chipPriceSold]}>{formatPrice(item.price)}</Text>
        )}
        {item.maGaday && <Text style={styles.chipSold}>{t('common.sold')}</Text>}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
});
