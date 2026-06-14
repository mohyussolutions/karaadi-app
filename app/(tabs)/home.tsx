import { useMemo } from 'react';
import {
  View, Text, TouchableOpacity, RefreshControl, FlatList, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CategoryGrid, HowToUseVideo, ListingCard } from '../../components/shared';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useResponsive } from '../../hooks/useResponsive';
import { useHomeFeed } from '../../hooks/useHomeFeed';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useAppSelector } from '../../store/store';
import { createStyles, H_PAD, COL_GAP } from '../../util/styles/tabs/home.styles';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useAppTranslation();
  const { isTabletLandscape, sidebarWidth, mainWidth, numColumns, cardWidth } = useResponsive();
  const { user, listings, recommendations, refreshing, visibleListings, hasMore, onRefresh, showMore } = useHomeFeed();
  const searchQuery = useAppSelector((s) => s.browseSearch.query);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const CARD_W = cardWidth(mainWidth, numColumns, H_PAD, COL_GAP);
  const REC_CARD_W = cardWidth(mainWidth, numColumns, H_PAD, COL_GAP);

  const filteredListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return listings.filter((item) => {
      const matchesTitle = (item.title ?? '').toLowerCase().includes(q);
      const matchesCity = (item.city ?? '').toLowerCase().includes(q);
      const matchesRegion = (item.region ?? '').toLowerCase().includes(q);
      const matchesPrice = String(item.price ?? '').includes(q);
      return matchesTitle || matchesCity || matchesRegion || matchesPrice;
    });
  }, [listings, searchQuery]);

  const displayListings = filteredListings ?? visibleListings;
  const showLoadMore = !filteredListings && hasMore;

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
          <FlatList
            horizontal
            data={recommendations}
            keyExtractor={(item) => `rec-${item.id || item._id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recListContent}
            renderItem={({ item }) => (
              <View style={{ width: REC_CARD_W }}>
                <ListingCard item={item} />
              </View>
            )}
          />
        </View>
      )}

    </View>
  );

  const feedList = (
    <FlatList
      key={`feed-${numColumns}`}
      data={displayListings}
      numColumns={numColumns}
      keyExtractor={(item) => item.id || item._id}
      removeClippedSubviews
      windowSize={5}
      maxToRenderPerBatch={8}
      initialNumToRender={8}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
      }
      contentContainerStyle={styles.scroll}
      columnWrapperStyle={styles.colWrapper}
      ListHeaderComponent={feedHeader}
      ListFooterComponent={
        showLoadMore ? (
          <TouchableOpacity
            style={styles.readMoreBtn}
            onPress={showMore}
            activeOpacity={0.8}
          >
            <Text style={styles.readMoreText}>{t('loadMore') || 'Load more'}</Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color={Colors.primary} />
          </TouchableOpacity>
        ) : null
      }
      ListEmptyComponent={
        displayListings.length === 0 ? (
          <Text style={styles.empty}>{filteredListings ? t('noResults') : t('noListings')}</Text>
        ) : null
      }
      renderItem={({ item }) => (
        <View style={{ width: CARD_W }}>
          <ListingCard item={item} />
        </View>
      )}
    />
  );

  if (isTabletLandscape) {
    return (
      <View style={[styles.safe, styles.outerRow]}>
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
    );
  }

  return <View style={styles.safe}>{feedList}</View>;
}
