import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../src/api/client';
import { BUSINESSES_ENDPOINTS } from '../../src/api/urls';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import EmptyState from '../../src/components/shared/EmptyState';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

const PLACEHOLDER = 'https://placehold.co/80x80/2563eb/ffffff?text=B';

export default function BusinessesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    apiClient.get(BUSINESSES_ENDPOINTS.MY_BUSINESS)
      .then(({ data }) => setBusinesses(Array.isArray(data) ? data : data?.businesses || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={businesses}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={[styles.list, businesses.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="office-building-off-outline" title="No business yet" message="Create a business profile to reach more customers." />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.logo || PLACEHOLDER }} style={styles.logo} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category || item.type || 'Business'}</Text>
              {item.city && <Text style={styles.location}>{[item.city, item.region].filter(Boolean).join(', ')}</Text>}
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 12, padding: 14,
    marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
  },
  logo: { width: 52, height: 52, borderRadius: 10, backgroundColor: Colors.border },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  category: { fontSize: 13, color: Colors.textSecondary },
  location: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
});
