import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/client';
import { extractList } from '../../utils/helpers';
import { getImageUrl, formatPrice } from '../../utils/helpers';
import { getListingDetailRoute } from '../../utils/helpers';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { useThemedStyles } from '../../hooks/useTheme';
import type { ListingBase, RecommendedSectionProps } from '../../utils/types';
import { createStyles } from '../../utils/styles/detail/RecommendedSection.styles';

function RecommendedSection({ endpoint, excludeId, title, categoryKey }: RecommendedSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const [items, setItems] = useState<ListingBase[]>([]);

  useEffect(() => {
    let cancelled = false;
    apiClient.get(endpoint, { params: { limit: 10 } }).then(({ data }) => {
      if (cancelled) return;
      const list = extractList<ListingBase>(data)
        .filter((i) => i._id !== excludeId && i.id !== excludeId)
        .slice(0, 8);
      setItems(list);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [endpoint, excludeId]);

  const handlePress = useCallback((item: ListingBase) => {
    const route = getListingDetailRoute(item, categoryKey);
    if (route) router.push(route as never);
  }, [router, categoryKey]);

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>{title ?? t('recommended.title', 'You may also like')}</Text>
      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.list}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item)} activeOpacity={0.85}>
            <Image
              source={{ uri: getImageUrl(item.images?.[0]) || PLACEHOLDER_IMAGE }}
              style={styles.img}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.price}>
                {item.price > 0 ? formatPrice(item.price) : 'On request'}
              </Text>
              {item.city && (
                <Text style={styles.loc} numberOfLines={1}>{item.city}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default memo(RecommendedSection);
