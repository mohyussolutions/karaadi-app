import { useMemo } from 'react';
import {
  View, Text, TouchableOpacity, RefreshControl, ScrollView, Platform, ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CategoryGrid, HowToUseVideo } from '../../components/shared';
import ListingCard from '../../components/cards/ListingCard';
import { useAppTranslation } from '../../components/hooks/useAppTranslation';
import { useResponsive } from '../../components/hooks/useResponsive';
import { WEB_MAX_WIDTH } from '../../components/hooks/useGlobal';
import { useHomeFeed } from '../../components/hooks/useHomeFeed';
import { useThemeColors, useThemedStyles } from '../../components/hooks/useTheme';
import { useAppSelector } from '../../store/store';
import { createStyles, H_PAD, COL_GAP } from '../../util/styles/tabs/home.styles';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useAppTranslation();
  const { isTabletLandscape, sidebarWidth, mainWidth, numColumns, cardWidth } = useResponsive();
  const { user, listings, recommendations, refreshing, visibleListings, hasMore, onRefresh, showMore, revealing } = useHomeFeed();
  const searchQuery = useAppSelector((s) => s.browseSearch.query);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const REC_CARD_W = cardWidth(mainWidth, numColumns, H_PAD, COL_GAP) * 1.12;

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
          <FlashList
            horizontal
            data={recommendations}
            keyExtractor={(item) => `rec-${item.id || item._id}`}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recListContent}
            renderItem={({ item }) => (
              <View style={{ width: REC_CARD_W, marginRight: 8 }}>
                <ListingCard item={item} imageAspectRatio={0.85} />
              </View>
            )}
          />
        </View>
      )}

    </View>
  );

  const feedList = (
    <FlashList
      key={`feed-${numColumns}`}
      data={displayListings}
      numColumns={numColumns}
      keyExtractor={(item) => item.id || item._id}
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
            activeOpacity={0.8}
            disabled={revealing}
          >
            {revealing ? (
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
        displayListings.length === 0 ? (
          <Text style={styles.empty}>{filteredListings ? t('noResults') : t('noListings')}</Text>
        ) : null
      }
      renderItem={({ item, index }) => (
        <View
          style={{
            paddingLeft: index % numColumns === 0 ? H_PAD : COL_GAP / 2,
            paddingRight: (index + 1) % numColumns === 0 ? H_PAD : COL_GAP / 2,
            paddingBottom: COL_GAP,
          }}
        >
          <ListingCard item={item} />
        </View>
      )}
    />
  );

  if (isTabletLandscape) {
    return (
      <View style={[styles.safe, Platform.OS === 'web' && styles.webCenterWrap]}>
        <View style={[styles.outerRow, Platform.OS === 'web' && { maxWidth: WEB_MAX_WIDTH, width: '100%' }]}>
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
    <View style={[styles.safe, Platform.OS === 'web' && styles.webCenterWrap]}>
      <View style={[styles.mainFlex, Platform.OS === 'web' && { maxWidth: WEB_MAX_WIDTH, width: '100%' }]}>
        {feedList}
      </View>
    </View>
  );
}
