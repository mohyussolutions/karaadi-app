import { useCallback } from 'react';
import {
  View, Text, TouchableOpacity, RefreshControl, ScrollView,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CategoryGrid, TutorialsButton, LoadMoreButton } from '../../components/shared';
import ListingCard from '../../components/cards/ListingCard/ListingCard';
import { ListingCardSkeleton } from '../../components/loading';
import { useAppTranslation } from '../../hooks/app/useAppTranslation';
import { useResponsive } from '../../hooks/app/useResponsive';
import { useHomeFeed } from '../../hooks/listings/useFeed';
import { useThemeColors, useThemedStyles } from '../../hooks/app/useTheme';
import { useGlobalSearch } from '../../hooks/listings/useSearch';
import { useSkeletonListings } from '../../hooks/listings/useFeed';
import { useAppSelector } from '../../store/store';
import { H_PAD, COL_GAP, SKELETON_COUNT, ROUTES } from '../../actions/constants';
import { createStyles } from '../../utils/styles/tabs/homeTab.styles';
import type { ListingRenderInfo } from '../../utils/types';
import { fixedWidth, gridCellPadding } from '../../utils/styles/common/dynamic.styles';
import { useSearchTracking } from '../../hooks/listings/useSearch';

import { selectBrowseQuery } from '../../store/slices/browseSearchSlice';
export default function HomeScreen() {
  const router = useRouter();
  const { t } = useAppTranslation();
  const { isTabletLandscape, sidebarWidth, mainWidth, numColumns, cardWidth } = useResponsive();
  const { user, listings, recommendations, refreshing, loading, visibleListings, hasMore, loadingMore, onRefresh, showMore } = useHomeFeed();
  const searchQuery = useAppSelector(selectBrowseQuery);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const REC_CARD_W = cardWidth(mainWidth, numColumns, H_PAD, COL_GAP) * 1.12;

  const filteredListings = useGlobalSearch(searchQuery, listings);
  useSearchTracking({ query: searchQuery, resultsCount: filteredListings?.length ?? 0, loading, filters: { category: 'home' } });

  const displayListings = filteredListings ?? visibleListings;
  const showLoadMore = !filteredListings && hasMore;
  const showSkeleton = loading && !filteredListings;
  const skeletonData = useSkeletonListings(SKELETON_COUNT);

  const renderFeedItem = useCallback(({ item, index }: ListingRenderInfo) => (
    <View
      style={gridCellPadding(index, numColumns, H_PAD, COL_GAP)}
    >
      {showSkeleton ? <ListingCardSkeleton /> : <ListingCard item={item} />}
    </View>
  ), [numColumns, showSkeleton]);

  const renderRecItem = useCallback(({ item }: ListingRenderInfo) => (
    <View style={[styles.recCard, fixedWidth(REC_CARD_W)]}>
      <ListingCard item={item} imageAspectRatio={0.85} />
    </View>
  ), [REC_CARD_W]);

  const postBtn = (
    <TouchableOpacity
      style={styles.postBtn}
      onPress={() => router.push(user ? ROUTES.newAd : ROUTES.login)}
      activeOpacity={0.88}
    >
      <MaterialCommunityIcons name="plus" size={20} color={Colors.white} />
      <Text style={styles.postBtnText}>{t('wantSell.title')}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.white} />
    </TouchableOpacity>
  );

  const feedHeader = filteredListings ? null : (
    <View>
      {!isTabletLandscape && (
        <View style={styles.videoSection}>
          <TutorialsButton />
        </View>
      )}
      {!isTabletLandscape && (
        <View style={styles.section}>
          <CategoryGrid />
        </View>
      )}
      {!isTabletLandscape && postBtn}

      {recommendations.length > 0 && (
        <View style={styles.recSection}>
          <Text style={[styles.sectionTitle, styles.recTitle]}>
            {t('recommended') || 'Recommended for You'}
          </Text>
          <FlashList overScrollMode="never"
            horizontal
            data={recommendations}
            keyExtractor={(item) => `rec-${item.id || item._id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recListContent}
            renderItem={renderRecItem}
          />
        </View>
      )}

    </View>
  );

  const feedList = (
    <FlashList overScrollMode="never"
      key={`feed-${numColumns}`}
      data={showSkeleton ? skeletonData : displayListings}
      numColumns={numColumns}
      keyExtractor={(item) => item.id || item._id}
      maintainVisibleContentPosition={{ disabled: true }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
      }
      contentContainerStyle={styles.scroll}
      ListHeaderComponent={feedHeader}
      ListFooterComponent={
        showLoadMore ? <LoadMoreButton onPress={showMore} loading={loadingMore} /> : null
      }
      ListEmptyComponent={
        !showSkeleton && displayListings.length === 0 ? (
          <Text style={styles.empty}>{filteredListings ? t('noResults') : t('noListings')}</Text>
        ) : null
      }
      renderItem={renderFeedItem}
    />
  );

  if (isTabletLandscape) {
    return (
      <View style={styles.safe}>
        <View style={styles.outerRow}>
          <View style={[styles.sidebar, fixedWidth(sidebarWidth)]}>
            <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarContent}>
              <View style={styles.videoSection}>
                <TutorialsButton />
              </View>
              <CategoryGrid />
              {postBtn}
            </ScrollView>
          </View>
          <View style={styles.mainFlex}>
            {feedList}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <View style={styles.mainFlex}>
        {feedList}
      </View>
    </View>
  );
}
