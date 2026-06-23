import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
} from 'react-native';
import { useGlobal } from '../../hooks/useGlobal';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getRecommendedByEndpoint } from '../../api/categories/feed.actions';
import { extractList } from '../../util/helpers';
import { getImageUrl, formatPrice } from '../../util/helpers';
import { getListingDetailRoute } from '../../util/helpers';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { useThemedStyles } from '../../hooks/useTheme';
import type { ListingBase, RecommendedSectionProps } from '../../util/types';
import { createStyles } from '../../util/styles/detail/RecommendedSection.styles';

function RecommendedSection({ endpoint, excludeId, title, categoryKey }: RecommendedSectionProps) {
  const { t } = useTranslation();
  const { width } = useGlobal();
  const router = useRouter();
  const styles = useThemedStyles((c) => createStyles(c, width));
  const [items, setItems] = useState<ListingBase[]>([]);

  useEffect(() => {
    let cancelled = false;
    getRecommendedByEndpoint(endpoint).then((list) => {
      if (cancelled) return;
      const filtered = list
        .filter((i: any) => i._id !== excludeId && i.id !== excludeId)
        .slice(0, 8) as ListingBase[];
      setItems(filtered);
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
      <Text style={styles.heading}>{title ?? t('recommended.title')}</Text>
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
                {item.price > 0 ? formatPrice(item.price) : t('priceOnRequest')}
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
