import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingCard from '../../src/components/shared/ListingCard';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import EmptyState from '../../src/components/shared/EmptyState';
import { getFavorites, removeFavorite } from '../../src/api/favorites';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import type { Favorite } from '../../src/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getFavorites().then(setFavorites).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  async function handleUnfavorite(fav: Favorite) {
    setFavorites((prev) => prev.filter((f) => f._id !== fav._id));
    await removeFavorite(fav._id).catch(() => {
      setFavorites((prev) => [...prev, fav]);
    });
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        contentContainerStyle={[styles.list, favorites.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="heart-off-outline" title="No favorites yet" message="Tap the heart on any listing to save it here." />
        }
        renderItem={({ item }) => {
          const listing = item.listing;
          if (!listing) return null;
          return (
            <ListingCard
              item={listing}
              isFavorite
              onFavorite={() => handleUnfavorite(item)}
              onPress={() =>
                router.push({
                  pathname: '/listing/[id]',
                  params: { id: listing._id || listing.id, category: item.listingType },
                })
              }
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16 },
});
