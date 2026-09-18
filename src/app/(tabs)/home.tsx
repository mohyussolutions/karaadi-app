import { useCallback } from 'react';
import {
  View, Text, TouchableOpacity, RefreshControl, ScrollView, ActivityIndicator,
} from 'react-native';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CategoryGrid, HowToUseVideo } from '../../components/shared';
import ListingCard from '../../components/cards/ListingCard/ListingCard';
import { ListingCardSkeleton } from '../../components/loading';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useResponsive } from '../../hooks/useResponsive';
import { useHomeFeed } from '../../hooks/useHomeFeed';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useSearchFilteredListings } from '../../hooks/useFilteredListings';
import { useSkeletonListings } from '../../hooks/useSkeletonListings';
import { useAppSelector } from '../../store/store';
import { H_PAD, COL_GAP } from '../../constants/constants';
import { createStyles } from '../../util/styles/tabs/homeTab.styles';
import type { ListingBase } from '../../util/types/listing.types';

const SKELETON_COUNT = 6;

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useAppTranslation();
  const { isTabletLandscape, sidebarWidth, mainWidth, numColumns, cardWidth } = useResponsive();
  const { user, listings, recommendations, refreshing, loading, visibleListings, hasMore, loadingMore, onRefresh, showMore } = useHomeFeed();
  const searchQuery = useAppSelector((s) => s.browseSearch.query);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const REC_CARD_W = cardWidth(mainWidth, numColumns, H_PAD, COL_GAP) * 1.12;

  const filteredListings = useSearchFilteredListings(listings, searchQuery);

  const displayListings = filteredListings ?? visibleListings;
  const showLoadMore = !filteredListings && hasMore;
  const showSkeleton = loading && !filteredListings;
  const skeletonData = useSkeletonListings(SKELETON_COUNT);

  const renderFeedItem = useCallback(({ item, index }: ListRenderItemInfo<ListingBase>) => (
    <View
      style={{
        paddingLeft: index % numColumns === 0 ? H_PAD : COL_GAP / 2,
        paddingRight: (index + 1) % numColumns === 0 ? H_PAD : COL_GAP / 2,
        paddingBottom: COL_GAP,
      }}
    >
      {showSkeleton ? <ListingCardSkeleton /> : <ListingCard item={item} />}
    </View>
  ), [numColumns, showSkeleton]);

  const renderRecItem = useCallback(({ item }: ListRenderItemInfo<ListingBase>) => (
    <View style={{ width: REC_CARD_W, marginRight: 8 }}>
      <ListingCard item={item} imageAspectRatio={0.85} />
    </View>
  ), [REC_CARD_W]);

  const postBtn = (
    <TouchableOpacity
      style={styles.postBtn}
      onPress={() => router.push(user ? '/(tabs)/new-ad' : '/(auth)/login')}
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
          <HowToUseVideo />
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
          <FlashList
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
    <FlashList
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
        showLoadMore ? (
          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={showMore}
            disabled={loadingMore}
            activeOpacity={0.8}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <>
                <Text style={styles.readMoreText}>{t('loadMore')}</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color={Colors.primary} />
              </>
            )}
          </TouchableOpacity>
        ) : null
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
          <View style={[styles.sidebar, { width: sidebarWidth }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarContent}>
              <View style={styles.videoSection}>
                <HowToUseVideo />
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
