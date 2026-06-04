import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../src/api/client';
import { SEARCH_HISTORY_ENDPOINTS } from '../../src/constants/endpoints';
import { EmptyState, LoadingSpinner } from '../../src/components/shared';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

export default function SavedSearchesScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    apiClient.get(SEARCH_HISTORY_ENDPOINTS.LIST)
      .then(({ data }) => setSearches(Array.isArray(data) ? data : data?.searches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  function deleteSearch(id: string) {
    Alert.alert(t('auth.common.error'), `${t('common.back')}?`, [
      { text: t('auth.common.ok'), style: 'cancel' },
      {
        text: t('businesses.myAds.delete'), style: 'destructive',
        onPress: () => {
          setSearches((prev) => prev.filter((s) => (s._id || s.id) !== id));
          apiClient.delete(SEARCH_HISTORY_ENDPOINTS.DELETE(id)).catch(() => {});
        },
      },
    ]);
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <FlatList
        data={searches}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={[s.list, searches.length === 0 && { flex: 1 }]}
        ListEmptyComponent={
          <EmptyState
            icon="history"
            title={t('mine.searchHistory.noRecords')}
            message={t('mine.searchHistory.recent')}
          />
        }
        renderItem={({ item }) => (
          <View style={s.row}>
            <MaterialCommunityIcons name="history" size={18} color={Colors.textMuted} />
            <Text style={s.query} numberOfLines={1}>{item.query || item.search || item.text}</Text>
            <TouchableOpacity onPress={() => deleteSearch(item._id || item.id)} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={s.separator} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  list: { flexGrow: 1 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
  },
  query: { flex: 1, fontSize: 15, color: Colors.text },
  separator: { height: 1, backgroundColor: Colors.border },
});
