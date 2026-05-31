import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import CategoryGrid from '../../src/components/shared/CategoryGrid';
import ListingCard from '../../src/components/shared/ListingCard';
import { getFeed } from '../../src/api/search';
import { useAuthStore } from '../../src/store/authStore';
import type { ListingBase } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [feed, setFeed] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadFeed() {
    try {
      const data = await getFeed(1);
      setFeed(data);
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { loadFeed(); }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadFeed(); }}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {user ? `Hello, ${user.username}` : 'Welcome to Karaadi'}
            </Text>
            <Text style={styles.subGreeting}>Find what you're looking for</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile/notifications')} style={styles.notifBtn}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchTap} onPress={() => router.push('/(tabs)/search')}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search listings...</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Categories</Text>
        <CategoryGrid />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Listings</Text>
          <TouchableOpacity onPress={() => router.push('/browse/cars')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingRow}>
            {[1, 2].map((k) => <View key={k} style={styles.skeleton} />)}
          </View>
        ) : feed.length === 0 ? (
          <Text style={styles.emptyText}>No listings available yet.</Text>
        ) : (
          <View style={styles.listingsContainer}>
            {feed.slice(0, 10).map((item) => (
              <ListingCard
                key={item._id || item.id}
                item={item}
                onPress={() =>
                  router.push({
                    pathname: '/listing/[id]',
                    params: { id: item._id || item.id, category: (item as any).mainCategory || 'cars' },
                  })
                }
              />
            ))}
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  greeting: { fontSize: 20, fontWeight: '800', color: Colors.text },
  subGreeting: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.inputBg, alignItems: 'center', justifyContent: 'center',
  },
  searchTap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.inputBg, borderRadius: 10, marginHorizontal: 16,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20,
  },
  searchPlaceholder: { fontSize: 15, color: Colors.placeholder },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17, fontWeight: '700', color: Colors.text,
    paddingHorizontal: 16, marginBottom: 12, marginTop: 8,
  },
  seeAll: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  listingsContainer: { paddingHorizontal: 16 },
  loadingRow: { paddingHorizontal: 16, gap: 12 },
  skeleton: { height: 220, backgroundColor: Colors.border, borderRadius: 12, marginBottom: 12 },
  emptyText: { textAlign: 'center', color: Colors.textMuted, fontSize: 14, marginTop: 24 },
});
