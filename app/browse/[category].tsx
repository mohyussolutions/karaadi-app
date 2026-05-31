import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingCard from '../../src/components/shared/ListingCard';
import SearchBar from '../../src/components/shared/SearchBar';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import EmptyState from '../../src/components/shared/EmptyState';
import { Colors } from '../../src/constants/colors';
import {
  carsApi, boatsApi, motorcyclesApi, realEstateApi,
  farmEquipmentApi, marketplaceApi, jobsApi, itemsApi, wantedApi,
} from '../../src/api/categories';
import { addFavorite, removeFavorite } from '../../src/api/favorites';
import type { ListingBase } from '../../src/types';

const CATEGORY_LABELS: Record<string, string> = {
  cars: 'Cars',
  boats: 'Boats',
  motorcycles: 'Motorcycles',
  'real-estate': 'Real Estate',
  'farm-equipment': 'Farm Equipment',
  marketplace: 'Marketplace',
  jobs: 'Jobs',
  items: 'Items',
  wanted: 'Wanted',
  businesses: 'Businesses',
};

const API_MAP: Record<string, (p?: number, s?: number) => Promise<ListingBase[]>> = {
  cars: carsApi.list as any,
  boats: boatsApi.list as any,
  motorcycles: motorcyclesApi.list as any,
  'real-estate': realEstateApi.list as any,
  'farm-equipment': farmEquipmentApi.list as any,
  marketplace: marketplaceApi.list as any,
  jobs: jobsApi.list as any,
  items: itemsApi.list as any,
  wanted: wantedApi.list as any,
};

export default function BrowseScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [items, setItems] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: CATEGORY_LABELS[category] || category });
  }, [category]);

  const loadItems = useCallback(async (p = 1, reset = false) => {
    const apiFn = API_MAP[category];
    if (!apiFn) { setLoading(false); return; }
    try {
      const data = await apiFn(p, 20);
      setItems((prev) => reset ? data : [...prev, ...data]);
      setHasMore(data.length === 20);
      setPage(p);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, [category]);

  useEffect(() => { loadItems(1, true); }, [loadItems]);

  async function toggleFavorite(item: ListingBase) {
    const id = item._id || item.id;
    if (favorites.has(id)) {
      setFavorites((prev) => { const s = new Set(prev); s.delete(id); return s; });
      await removeFavorite(id).catch(() => {});
    } else {
      setFavorites((prev) => new Set(prev).add(id));
      await addFavorite(id, (item as any).mainCategory || category).catch(() => {});
    }
  }

  const filtered = query
    ? items.filter((i) =>
        i.title?.toLowerCase().includes(query.toLowerCase()) ||
        i.city?.toLowerCase().includes(query.toLowerCase()) ||
        i.region?.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.searchWrapper}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={`Search ${CATEGORY_LABELS[category] || category}...`}
          onClear={() => setQuery('')}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadItems(1, true); }}
            tintColor={Colors.primary}
          />
        }
        onEndReached={() => { if (hasMore && !loading) loadItems(page + 1); }}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <EmptyState
            icon="inbox-outline"
            title={`No ${CATEGORY_LABELS[category] || category} found`}
            message="Check back later or try a different category."
          />
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            isFavorite={favorites.has(item._id || item.id)}
            onFavorite={() => toggleFavorite(item)}
            onPress={() =>
              router.push({
                pathname: '/listing/[id]',
                params: { id: item._id || item.id, category },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  searchWrapper: {
    padding: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  list: { padding: 16, flexGrow: 1 },
});
