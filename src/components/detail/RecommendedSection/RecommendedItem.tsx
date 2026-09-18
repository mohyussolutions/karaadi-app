import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RemoteImage from '../../shared/RemoteImage/RemoteImage';
import { getImageUrl, formatPrice } from '../../../util/helpers';
import { PLACEHOLDER_IMAGE } from '../../../constants';
import type { ListingBase } from '../../../util/types';
import { createStyles } from '../../../util/styles/detail/recommendedSection.styles';

export const RecommendedItem = memo(function RecommendedItem({
  item, styles, onPress, priceOnRequestLabel,
}: {
  item: ListingBase;
  styles: ReturnType<typeof createStyles>;
  onPress: (item: ListingBase) => void;
  priceOnRequestLabel: string;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.85}>
      <RemoteImage
        source={{ uri: getImageUrl(item.images?.[0]) || PLACEHOLDER_IMAGE }}
        style={styles.img}
        contentFit="cover"
        recyclingKey={item._id || item.id}
      />
      <View style={styles.info}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>
          {item.price > 0 ? formatPrice(item.price) : priceOnRequestLabel}
        </Text>
        {item.city && (
          <Text style={styles.loc} numberOfLines={1}>{item.city}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
});
