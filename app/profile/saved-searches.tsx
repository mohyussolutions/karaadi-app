import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../src/api/client';
import EmptyState from '../../src/components/shared/EmptyState';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

export default function SavedSearchesScreen() {
  const { user } = useAuthStore();
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    apiClient.get('/api/history-search')
      .then(({ data }) => setSearches(Array.isArray(data) ? data : data?.searches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  async function deleteSearch(id: string) {
    setSearches((prev) => prev.filter((s) => (s._id || s.id) !== id));
    await apiClient.delete(`/api/history-search/${id}`).catch(() => {});
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={searches}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={[styles.list, searches.length === 0 && { flex: 1 }]}
        ListEmptyComponent={
          <EmptyState icon="history" title="No saved searches" message="Your search history will appear here." />
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <MaterialCommunityIcons name="history" size={18} color={Colors.textMuted} />
            <Text style={styles.query} numberOfLines={1}>{item.query || item.search || item.text}</Text>
            <TouchableOpacity onPress={() => deleteSearch(item._id || item.id)}>
              <MaterialCommunityIcons name="close" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { flexGrow: 1 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
  },
  query: { flex: 1, fontSize: 15, color: Colors.text },
  separator: { height: 1, backgroundColor: Colors.border },
});
