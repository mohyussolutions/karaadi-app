import React, { useEffect, useState, useCallback } from 'react';
import {
  View, FlatList, StyleSheet, Text, Pressable, TouchableOpacity,
  RefreshControl, Dimensions, ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORS from '../../../src/constants/colors';
import { getCategoryByKey, SUB_I18N_GROUP } from '../../../src/constants/categories';
import { fetchByCategory } from '../../../src/api/listings';
import { ListingCard, LoadingSpinner, EmptyState } from '../../../src/components/shared';
import { useAppSelector } from '../../../src/store';
import { useAppTranslation } from '../../../src/hooks/useAppTranslation';
import type { NestedSubCategory } from '../../../src/constants/categories';
import type { ListingBase } from '../../../src/utils/types/listing.types';

const { width } = Dimensions.get('window');
const H_PAD = 12;
const GAP = 8;

export default function SubcategoryScreen() {
  const { category: categoryKey, subcategory: subcategoryKey } =
    useLocalSearchParams<{ category: string; subcategory: string }>();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const { t } = useAppTranslation();

  const category = getCategoryByKey(categoryKey);
  const group = SUB_I18N_GROUP[categoryKey] ?? categoryKey.toLowerCase();
  const sub = category?.subCategories.find((s) => s.key === subcategoryKey);
  const nestedItems = sub?.nested ?? [];

  const [listings, setListings] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNested, setSelectedNested] = useState<NestedSubCategory | null>(null);

  const load = useCallback(async () => {
    if (!categoryKey || !subcategoryKey) return;
    try {
      const params: Record<string, string> = { subcategory: subcategoryKey };
      if (selectedNested) params.nestedSubcategory = selectedNested.key;
      const data = await fetchByCategory(categoryKey, params);
      setListings(data);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryKey, subcategoryKey, selectedNested]);

  useEffect(() => { load(); }, [load]);

  function onRefresh() { setRefreshing(true); load(); }

  function handleNestedPress(nested: NestedSubCategory) {
    setSelectedNested((prev) => (prev?.key === nested.key ? null : nested));
  }

  const categoryLabel = t(`categories.${categoryKey}`, { defaultValue: category?.name ?? categoryKey });
  const subLabel = t(`subcategories.${group}.${subcategoryKey}`, {
    defaultValue: sub?.name ?? subcategoryKey,
  });

  const ListHeader = (
    <View>
      {/* Page header with back + title */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
          <MaterialCommunityIcons name="chevron-left" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <MaterialCommunityIcons name={sub?.icon as any ?? 'tag-outline'} size={18} color={COLORS.primary} />
        <Text style={styles.navTitle} numberOfLines={1}>{subLabel}</Text>
      </View>

      {/* Breadcrumb: Home > Category > Subcategory */}
      <View style={styles.breadcrumb}>
        <TouchableOpacity style={styles.breadcrumbItem} onPress={() => router.push('/(tabs)')}>
          <MaterialCommunityIcons name="home-outline" size={12} color={COLORS.primary} />
          <Text style={styles.breadcrumbLink}>{t('nav.home')}</Text>
        </TouchableOpacity>
        <MaterialCommunityIcons name="chevron-right" size={12} color={COLORS.textMuted} />
        <TouchableOpacity
          style={styles.breadcrumbItem}
          onPress={() => router.push({ pathname: '/browse/[category]' as any, params: { category: categoryKey } })}
        >
          <Text style={styles.breadcrumbLink}>{categoryLabel}</Text>
        </TouchableOpacity>
        <MaterialCommunityIcons name="chevron-right" size={12} color={COLORS.textMuted} />
        <Text style={styles.breadcrumbCurrent} numberOfLines={1}>{subLabel}</Text>
      </View>

      {nestedItems.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {nestedItems.map((nested) => {
            const active = selectedNested?.key === nested.key;
            return (
              <Pressable
                key={nested.key}
                onPress={() => handleNestedPress(nested)}
                hitSlop={6}
                style={[
                  styles.chip,
                  active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                ]}
              >
                <MaterialCommunityIcons
                  name={nested.icon as any}
                  size={14}
                  color={active ? COLORS.white : COLORS.textSecondary}
                />
                <Text style={[styles.chipText, active && { color: COLORS.white }]}>
                  {t(nested.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.postBtn}
        onPress={() => router.push(user ? '/(tabs)/new-ad' : '/(auth)/login')}
        activeOpacity={0.88}
      >
        <MaterialCommunityIcons name="plus" size={18} color={COLORS.white} />
        <Text style={styles.postBtnText}>{t('wantSell.title')}</Text>
        <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.white} />
      </TouchableOpacity>

      {!loading && listings.length > 0 && (
        <View style={styles.countRow}>
          <Text style={styles.countLabel}>Results:</Text>
          <Text style={styles.countValue}>{listings.length}</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {ListHeader}
        <LoadingSpinner fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id || item._id}
        numColumns={2}
        key="2col"
        columnWrapperStyle={styles.row}
        contentContainerStyle={listings.length === 0 ? styles.emptyContainer : styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            icon="tag-off-outline"
            title={t('common.noResults')}
            message={selectedNested ? t(selectedNested.labelKey) : subLabel}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <ListingCard item={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: H_PAD,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { marginRight: 2 },
  navTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
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
  chipsRow: {
    paddingHorizontal: H_PAD,
    paddingVertical: 10,
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: H_PAD,
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  postBtnText: { flex: 1, color: COLORS.white, fontWeight: '700', fontSize: 14, letterSpacing: 0.3 },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: H_PAD,
    paddingTop: 12,
    paddingBottom: 6,
    gap: 6,
  },
  countLabel: { fontSize: 13, color: COLORS.textSecondary },
  countValue: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  row: { paddingHorizontal: H_PAD, gap: GAP },
  listItem: { flex: 1 },
  listContent: { paddingBottom: 32 },
  emptyContainer: { flex: 1 },
});
