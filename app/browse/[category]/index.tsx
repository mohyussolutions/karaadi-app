import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Pressable,
  TouchableOpacity, FlatList, RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../../src/constants/colors';
import { getCategoryByKey, SUB_I18N_GROUP } from '../../../src/constants/categories';
import { fetchByCategory } from '../../../src/api/listings';
import { ListingCard, EmptyState, LoadingSpinner } from '../../../src/components/shared';
import { useAppTranslation } from '../../../src/hooks/useAppTranslation';
import { useAppSelector } from '../../../src/store';
import type { SubCategory } from '../../../src/constants/categories';
import type { ListingBase } from '../../../src/utils/types/listing.types';

const { width } = Dimensions.get('window');
const H_PAD = 12;
const COL_GAP = 8;
const COLS = 3;
const CELL_W = (width - H_PAD * 2 - COL_GAP * (COLS - 1)) / COLS;
const CARD_W = (width - H_PAD * 2 - COL_GAP) / 2;

export default function CategoryIndexScreen() {
  const { category: categoryKey } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const { t } = useAppTranslation();
  const user = useAppSelector((s) => s.auth.user);

  const category = getCategoryByKey(categoryKey);
  const group = SUB_I18N_GROUP[categoryKey] ?? categoryKey.toLowerCase();
  const subs = category?.subCategories ?? [];
  const categoryLabel = t(`categories.${categoryKey}`, { defaultValue: category?.name ?? categoryKey });

  const [listings, setListings] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchByCategory(categoryKey, { limit: 40 });
      setListings(data);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryKey]);

  useEffect(() => { load(); }, [load]);

  function onRefresh() { setRefreshing(true); load(); }

  function handleSubPress(sub: SubCategory) {
    router.push({
      pathname: '/browse/[category]/[subcategory]' as any,
      params: { category: categoryKey, subcategory: sub.key },
    });
  }

  const rows: SubCategory[][] = [];
  for (let i = 0; i < subs.length; i += COLS) {
    rows.push(subs.slice(i, i + COLS));
  }

  const header = (
    <View>
      <TouchableOpacity
        style={styles.postBtn}
        onPress={() => router.push(user ? '/(tabs)/new-ad' : '/(auth)/login')}
        activeOpacity={0.88}
      >
        <MaterialCommunityIcons name="plus" size={18} color={COLORS.white} />
        <Text style={styles.postBtnText}>{t('wantSell.title')}</Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.white} />
      </TouchableOpacity>

      <View style={styles.subGrid}>
        {rows.map((row, ri) => (
          <View key={ri} style={styles.subRow}>
            {row.map((sub) => {
              const label = t(`subcategories.${group}.${sub.key}`, { defaultValue: sub.name });
              return (
                <Pressable
                  key={sub.key}
                  hitSlop={4}
                  onPress={() => handleSubPress(sub)}
                  style={({ pressed }) => [styles.subCell, pressed && styles.subCellPressed]}
                >
                  {({ pressed }) => (
                    <>
                      <View style={styles.subIconWrap}>
                        <MaterialCommunityIcons
                          name={sub.icon as any}
                          size={22}
                          color={pressed ? COLORS.primary : COLORS.textSecondary}
                        />
                      </View>
                      <Text style={[styles.subLabel, pressed && styles.subLabelPressed]} numberOfLines={2}>
                        {label}
                      </Text>
                    </>
                  )}
                </Pressable>
              );
            })}
            {row.length < COLS &&
              Array.from({ length: COLS - row.length }).map((_, i) => (
                <View key={i} style={styles.subCellPlaceholder} />
              ))}
          </View>
        ))}
      </View>

      {!loading && listings.length > 0 && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>{listings.length} listings</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.pageHeader}>
        <MaterialCommunityIcons name={category?.icon as any} size={18} color={COLORS.primary} />
        <Text style={styles.headerTitle} numberOfLines={1}>{categoryLabel}</Text>
      </View>

      <View style={styles.breadcrumb}>
        <TouchableOpacity style={styles.breadcrumbItem} onPress={() => router.push('/(tabs)')}>
          <MaterialCommunityIcons name="home-outline" size={12} color={COLORS.primary} />
          <Text style={styles.breadcrumbLink}>{t('nav.home')}</Text>
        </TouchableOpacity>
        <MaterialCommunityIcons name="chevron-right" size={12} color={COLORS.textMuted} />
        <Text style={styles.breadcrumbCurrent} numberOfLines={1}>{categoryLabel}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          {header}
          <LoadingSpinner size="large" />
        </View>
      ) : (
        <FlatList
          data={listings}
          numColumns={2}
          keyExtractor={(item) => item.id || item._id}
          removeClippedSubviews
          windowSize={5}
          maxToRenderPerBatch={8}
          initialNumToRender={8}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={header}
          ListEmptyComponent={
            <EmptyState
              icon="tag-off-outline"
              title={t('common.noResults')}
              message={categoryLabel}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <ListingCard item={item} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: H_PAD,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: H_PAD,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breadcrumbItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  breadcrumbLink: { fontSize: 12, color: COLORS.primary, fontWeight: '500' },
  breadcrumbCurrent: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', flexShrink: 1 },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: H_PAD,
    marginTop: 12,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  postBtnText: { flex: 1, color: COLORS.white, fontWeight: '700', fontSize: 14 },
  subGrid: {
    paddingHorizontal: H_PAD,
    paddingVertical: 12,
    gap: COL_GAP,
  },
  subRow: { flexDirection: 'row', gap: COL_GAP },
  subCell: {
    width: CELL_W,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  subCellPressed: { backgroundColor: COLORS.gray100 },
  subCellPlaceholder: { width: CELL_W },
  subIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 4,
  },
  subLabelPressed: { color: COLORS.primary },
  countRow: {
    paddingHorizontal: H_PAD,
    paddingBottom: 6,
    paddingTop: 2,
  },
  countText: { fontSize: 12, color: COLORS.textMuted },
  listContent: { paddingBottom: 32 },
  row: {
    paddingHorizontal: H_PAD,
    gap: COL_GAP,
    marginBottom: COL_GAP,
  },
  cardWrap: { width: CARD_W },
  loadingWrap: { flex: 1 },
});
