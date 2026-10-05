import { memo } from 'react';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { View, Text, TouchableOpacity } from 'react-native';
import RemoteImage from '../../shared/RemoteImage/RemoteImage';
import { getImageUrl, formatPrice } from '../../../lib/helpers';
import { PLACEHOLDER_IMAGE } from '../../../actions/constants';
import type { RecommendedItemProps } from "../../../utils/types";

export const RecommendedItem = memo(function RecommendedItem({
  item, styles, onPress, priceOnRequestLabel,
}: RecommendedItemProps) {
  const { t } = useAppTranslation();
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.85}>
      <RemoteImage
        source={{ uri: getImageUrl(item.images?.[0]) || PLACEHOLDER_IMAGE }}
        style={styles.img}
        contentFit="cover"
        recyclingKey={item._id || item.id}
      />
      {item.maGaday && (
        <View style={styles.soldBadge}>
          <Text style={styles.soldBadgeText}>{t('common.sold')}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.price, item.maGaday && styles.priceSold]}>
          {item.price > 0 ? formatPrice(item.price) : priceOnRequestLabel}
        </Text>
        {item.city && (
          <Text style={styles.loc} numberOfLines={1}>{item.city}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
});
