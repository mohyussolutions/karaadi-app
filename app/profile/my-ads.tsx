import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingCard from '../../src/components/shared/ListingCard';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import EmptyState from '../../src/components/shared/EmptyState';
import { getMyAds } from '../../src/api/search';
import { MY_ADS_ENDPOINTS } from '../../src/api/urls';
import { apiClient } from '../../src/api/client';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import type { ListingBase } from '../../src/types';

export default function MyAdsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [ads, setAds] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getMyAds().then(setAds).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <View style={styles.center}>
        <EmptyState icon="lock-outline" title="Sign in required" message="Sign in to view your ads." />
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={ads}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={[styles.list, ads.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-text-off-outline"
            title="No ads yet"
            message="Post your first ad to start selling."
          />
        }
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onPress={() =>
              router.push({
                pathname: '/listing/[id]',
                params: { id: item._id || item.id, category: (item as any).mainCategory || 'cars' },
              })
            }
          />
        )}
      />
      <TouchableOpacity style={styles.postBtn} onPress={() => router.push('/(tabs)/new-ad')}>
        <Text style={styles.postBtnText}>+ Post New Ad</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16 },
  btn: {
    margin: 24, backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  postBtn: {
    margin: 16, backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  postBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
