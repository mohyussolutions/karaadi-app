import { useEffect, useState, useCallback, memo } from 'react';
import {
  View, Text,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useGlobal } from '../../../hooks/useGlobal';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getRecommendedByEndpoint } from '../../../actions/categories/feed.actions';
import { prefetchImages, getListingDetailRoute } from '../../../util/helpers';
import { useThemedStyles } from '../../../hooks/useTheme';
import type { ListingBase, RecommendedSectionProps } from '../../../util/types';
import { createStyles } from '../../../util/styles/detail/recommendedSection.styles';
import { RecommendedItem } from './RecommendedItem';

function RecommendedSection({ endpoint, excludeId, title, categoryKey }: RecommendedSectionProps) {
  const { t } = useTranslation();
  const { width } = useGlobal();
  const router = useRouter();
  const styles = useThemedStyles(createStyles, width);
  const [items, setItems] = useState<ListingBase[]>([]);

  useEffect(() => {
    let cancelled = false;
    getRecommendedByEndpoint(endpoint).then((list) => {
      if (cancelled) return;
      const filtered = list
        .filter((i: ListingBase) => i._id !== excludeId && i.id !== excludeId)
        .slice(0, 8) as ListingBase[];
      setItems(filtered);
      prefetchImages(filtered).catch(() => {});
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [endpoint, excludeId]);

  const handlePress = useCallback((item: ListingBase) => {
    const route = getListingDetailRoute(item, categoryKey);
    if (route) router.push(route as never);
  }, [router, categoryKey]);

  const priceOnRequestLabel = t('priceOnRequest');
  const renderItem = useCallback(({ item }: { item: ListingBase }) => (
    <RecommendedItem item={item} styles={styles} onPress={handlePress} priceOnRequestLabel={priceOnRequestLabel} />
  ), [styles, handlePress, priceOnRequestLabel]);

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.heading}>{title ?? t('recommended.title')}</Text>
      <FlashList overScrollMode="never"
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
      />
    </View>
  );
}

export default memo(RecommendedSection);
