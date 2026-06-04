import React, { useEffect, useState, useCallback } from 'react';
import {
  View, StyleSheet, Dimensions, RefreshControl, TouchableOpacity, Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ListingCard, LoadingSpinner, EmptyState } from '../../src/components/shared';
import { getFavorites, removeFavorite } from '../../src/api/favorites';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import type { Favorite } from '../../src/utils/types';

const { width } = Dimensions.get('window');
const H_PAD = 12;
const COL_GAP = 8;
const CARD_W = (width - H_PAD * 2 - COL_GAP) / 2;

export default function FavoritesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    if (!user) { setLoading(false); return; }
    getFavorites()
      .then(setFavorites)
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, [user]);

  useEffect(() => { load(); }, [load]);

  function onRefresh() { setRefreshing(true); load(); }

  async function handleUnfavorite(fav: Favorite) {
    setFavorites((prev) => prev.filter((f) => f._id !== fav._id));
    await removeFavorite(fav._id).catch(() => setFavorites((prev) => [...prev, fav]));
  }

  if (!user) {
    return (
      <View style={s.center}>
        <EmptyState icon="lock-outline" title={t('signInRequired')} message={t('signInToView')} />
        <TouchableOpacity style={s.btn} onPress={() => router.push('/(auth)/login')}>
          <Text style={s.btnText}>{t('auth.login.loginButton')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={s.row}
        contentContainerStyle={[s.list, favorites.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="heart-off-outline"
            title={t('mine.account.favorites')}
            message={t('noListings')}
          />
        }
        renderItem={({ item }) => {
          const listing = item.listing;
          if (!listing) return null;
          return (
            <View style={s.cardWrap}>
              <ListingCard item={listing} />
              <TouchableOpacity style={s.removeBtn} onPress={() => handleUnfavorite(item)}>
                <Text style={s.removeBtnText}>{t('businesses.myAds.delete')}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, backgroundColor: Colors.background },
  list: { padding: H_PAD, paddingBottom: 32 },
  row: { gap: COL_GAP, marginBottom: COL_GAP },
  cardWrap: { width: CARD_W },
  removeBtn: { marginTop: 4, alignItems: 'center', paddingVertical: 4 },
  removeBtnText: { fontSize: 11, color: Colors.error, fontWeight: '600' },
  btn: { margin: 24, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
