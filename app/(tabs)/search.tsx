import React, { useState, useCallback } from 'react';
import {
  View, FlatList, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../src/components/shared/SearchBar';
import ListingCard from '../../src/components/shared/ListingCard';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import EmptyState from '../../src/components/shared/EmptyState';
import { globalSearch } from '../../src/api/search';
import { Colors } from '../../src/constants/colors';
import type { SearchResult } from '../../src/types';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await globalSearch(query.trim());
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchRow}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search all listings..."
            onSubmit={handleSearch}
            onClear={() => { setResults([]); setSearched(false); }}
          />
          {query.trim().length > 0 && (
            <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
              <Text style={styles.searchBtnText}>Go</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <LoadingSpinner message="Searching..." />
      ) : searched && results.length === 0 ? (
        <EmptyState icon="magnify-close" title="No results found" message={`No listings matched "${query}"`} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListingCard
              item={item as any}
              onPress={() =>
                router.push({
                  pathname: '/listing/[id]',
                  params: { id: item._id || item.id, category: item.mainCategory || 'cars' },
                })
              }
            />
          )}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={styles.resultCount}>{results.length} results for "{query}"</Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 10 },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  searchBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  searchBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  list: { padding: 16 },
  resultCount: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
});
