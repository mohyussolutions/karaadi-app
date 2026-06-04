import React, { useEffect, useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, RefreshControl,
  Dimensions, FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import COLORS from '../../src/constants/colors';
import { useAppSelector } from '../../src/store';
import {
  fetchCars, fetchRealEstate, fetchMotorcycles,
  fetchMarketplace, fetchBoats, fetchFarmEquipment,
} from '../../src/api/listings';
import { CategoryGrid, ListingCard } from '../../src/components/shared';
import { useAppTranslation } from '../../src/hooks/useAppTranslation';
import {
  getMemCache, setMemCache, isCacheFresh, readDiskCache, writeDiskCache, mergeListings,
} from '../../src/services/feedCacheService';
import type { ListingBase } from '../../src/utils/types/listing.types';

const { width } = Dimensions.get('window');
const H_PAD = 12;
const COL_GAP = 8;
const CARD_W = (width - H_PAD * 2 - COL_GAP) / 2;
const INITIAL_VISIBLE = 20;
const READ_MORE_STEP = 10;

const FEED_SOURCES = [
  () => fetchCars({ limit: 6 }),
  () => fetchRealEstate({ limit: 6 }),
  () => fetchMotorcycles({ limit: 4 }),
  () => fetchMarketplace({ limit: 6 }),
  () => fetchBoats({ limit: 4 }),
  () => fetchFarmEquipment({ limit: 4 }),
];

async function fetchAll(): Promise<ListingBase[]> {
  const bucket: ListingBase[] = [];
  await Promise.allSettled(
    FEED_SOURCES.map((fn) => fn().then((items) => bucket.push(...items)).catch(() => {})),
  );
  return bucket;
}

function ListHeader({
  user,
  onPostPress,
  sectionTitle,
  seeAllLabel,
  onSeeAll,
  t,
}: {
  user: any;
  onPostPress: () => void;
  sectionTitle: string;
  seeAllLabel: string;
  onSeeAll: () => void;
  t: (k: string) => string;
}) {
  return (
    <View>
      <View style={styles.section}>
        <CategoryGrid />
      </View>

      <TouchableOpacity style={styles.postBtn} onPress={onPostPress} activeOpacity={0.88}>
        <MaterialCommunityIcons name="plus" size={20} color={COLORS.white} />
        <Text style={styles.postBtnText}>{t('wantSell.title')}</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.white} style={styles.postBtnArrow} />
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>{seeAllLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const { t } = useAppTranslation();

  const [listings, setListings] = useState<ListingBase[]>(() => getMemCache() ?? []);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (listings.length === 0) {
        const disk = await readDiskCache();
        if (disk && disk.length > 0 && !cancelled) {
          setListings(disk);
          setMemCache(disk);
        }
      }

      if (isCacheFresh()) return;

      const fresh = await fetchAll();
      if (cancelled || fresh.length === 0) return;

      setListings((prev) => {
        const merged = mergeListings(prev, fresh);
        setMemCache(merged);
        writeDiskCache(merged);
        return merged;
      });
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setVisibleCount(INITIAL_VISIBLE);
    const fresh = await fetchAll();
    if (fresh.length > 0) {
      setListings(fresh);
      setMemCache(fresh);
      writeDiskCache(fresh);
    }
    setRefreshing(false);
  }, []);

  const visibleListings = listings.slice(0, visibleCount);
  const hasMore = visibleCount < listings.length;

  const header = (
    <ListHeader
      user={user}
      onPostPress={() => router.push(user ? '/(tabs)/new-ad' : '/(auth)/login')}
      sectionTitle={t('recentListings')}
      seeAllLabel={t('seeAll')}
      onSeeAll={() => router.push('/(tabs)/search')}
      t={t}
    />
  );

  const footer = hasMore ? (
    <TouchableOpacity
      style={styles.readMoreBtn}
      onPress={() => setVisibleCount((c) => c + READ_MORE_STEP)}
      activeOpacity={0.8}
    >
      <Text style={styles.readMoreText}>Read more</Text>
      <MaterialCommunityIcons name="chevron-down" size={16} color={COLORS.primary} />
    </TouchableOpacity>
  ) : null;

  const empty = listings.length === 0 ? (
    <Text style={styles.empty}>{t('noListings')}</Text>
  ) : null;

  return (
    <View style={styles.safe}>
      <FlatList
        data={visibleListings}
        numColumns={2}
        keyExtractor={(item) => item.id || item._id}
        removeClippedSubviews
        windowSize={5}
        maxToRenderPerBatch={8}
        initialNumToRender={8}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        contentContainerStyle={styles.scroll}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={empty}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ListingCard item={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 32 },
  section: { paddingTop: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H_PAD,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: H_PAD,
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 8,
  },
  postBtnText: { flex: 1, color: COLORS.white, fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
  postBtnArrow: { marginLeft: 'auto' },
  row: {
    paddingHorizontal: H_PAD,
    gap: COL_GAP,
    marginBottom: COL_GAP,
  },
  gridItem: { width: CARD_W },
  empty: { textAlign: 'center', color: COLORS.textMuted, padding: 32 },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginHorizontal: H_PAD,
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  readMoreText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
});
