import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Dimensions, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListingCard, LoadingSpinner, EmptyState } from '../../src/components/shared';
import { getMyAds } from '../../src/api/search';
import { MY_ADS_ENDPOINTS } from '../../src/constants/endpoints';
import { apiClient } from '../../src/api/client';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import type { ListingBase } from '../../src/utils/types';

const { width } = Dimensions.get('window');
const H_PAD = 12;
const COL_GAP = 8;
const CARD_W = (width - H_PAD * 2 - COL_GAP) / 2;

export default function MyAdsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [ads, setAds] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  function load() {
    if (!user) { setLoading(false); return; }
    getMyAds()
      .then(setAds)
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }

  useEffect(() => { load(); }, [user]);

  function onRefresh() { setRefreshing(true); load(); }

  async function handleDelete(item: ListingBase) {
    Alert.alert('Delete Ad', `Delete "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            const type = item.mainCategory || item.category || 'marketplace';
            await apiClient.delete(MY_ADS_ENDPOINTS.DELETE(item._id || item.id, type));
            setAds((prev) => prev.filter((a) => (a._id || a.id) !== (item._id || item.id)));
          } catch {
            Alert.alert('Error', 'Failed to delete. Please try again.');
          }
        },
      },
    ]);
  }

  if (!user) {
    return (
      <View style={s.center}>
        <EmptyState icon="lock-outline" title="Sign in required" message="Sign in to view your ads." />
        <TouchableOpacity style={s.btn} onPress={() => router.push('/(auth)/login')}>
          <Text style={s.btnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <FlatList
        data={ads}
        keyExtractor={(item) => item._id || item.id}
        numColumns={2}
        columnWrapperStyle={s.row}
        contentContainerStyle={[s.list, ads.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-text-off-outline"
            title="No ads yet"
            message="Post your first ad to start selling."
          />
        }
        renderItem={({ item }) => (
          <View style={s.cardWrap}>
            <ListingCard item={item} />
            <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(item)}>
              <Text style={s.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={s.postBtn} onPress={() => router.push('/(tabs)/new-ad')}>
        <Text style={s.postBtnText}>+ Post New Ad</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, backgroundColor: Colors.background },
  list: { padding: H_PAD, paddingBottom: 80 },
  row: { gap: COL_GAP, marginBottom: COL_GAP },
  cardWrap: { width: CARD_W },
  deleteBtn: { marginTop: 4, alignItems: 'center', paddingVertical: 4 },
  deleteText: { fontSize: 12, color: Colors.error, fontWeight: '600' },
  btn: { margin: 24, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  postBtn: { margin: 16, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  postBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
