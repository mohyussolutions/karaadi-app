import React, { useState, useCallback, memo } from 'react';
import {
  View, FlatList, StyleSheet, Text, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { ListingCard, LoadingSpinner, EmptyState } from '../../src/components/shared';
import { globalSearch } from '../../src/api/search';
import { Colors } from '../../src/constants/colors';
import type { SearchResult } from '../../src/utils/types';

const Field = memo(function Field({
  icon, placeholder, value, onChangeText, keyboardType = 'default',
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.field}>
      <MaterialCommunityIcons name={icon as any} size={18} color={Colors.textMuted} style={styles.fieldIcon} />
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
          <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
});

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const hasInput = name.trim() || region.trim() || city.trim() || minPrice || maxPrice;

  const handleSearch = useCallback(async () => {
    if (!hasInput) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await globalSearch({
        q: name.trim() || undefined,
        region: region.trim() || undefined,
        city: city.trim() || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [name, region, city, minPrice, maxPrice, hasInput]);

  function handleClear() {
    setName('');
    setRegion('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setResults([]);
    setSearched(false);
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Search</Text>

          <Field icon="magnify" placeholder="Name, title, keyword..." value={name} onChangeText={setName} />
          <View style={styles.row}>
            <View style={[styles.flex, styles.halfField]}>
              <Field icon="map-marker-outline" placeholder="Region" value={region} onChangeText={setRegion} />
            </View>
            <View style={[styles.flex, styles.halfField]}>
              <Field icon="city-variant-outline" placeholder="City" value={city} onChangeText={setCity} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.flex, styles.halfField]}>
              <Field icon="currency-usd" placeholder="Min price" value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" />
            </View>
            <View style={[styles.flex, styles.halfField]}>
              <Field icon="currency-usd" placeholder="Max price" value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" />
            </View>
          </View>

          <View style={styles.btnRow}>
            {searched && (
              <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.searchBtn, !hasInput && styles.searchBtnDisabled]}
              onPress={handleSearch}
              disabled={!hasInput}
            >
              <MaterialCommunityIcons name="magnify" size={18} color={Colors.white} />
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <LoadingSpinner fullScreen />
        ) : searched && results.length === 0 ? (
          <EmptyState icon="magnify-close" title={t('common.noResults')} message={t('common.noResults')} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item._id || item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              results.length > 0 ? (
                <Text style={styles.resultCount}>{results.length} results</Text>
              ) : null
            }
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
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  row: { flexDirection: 'row', gap: 8 },
  halfField: {},
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 6,
  },
  fieldIcon: {},
  fieldInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 0,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearBtnText: { color: Colors.textSecondary, fontWeight: '600', fontSize: 14 },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  searchBtnDisabled: { opacity: 0.5 },
  searchBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  list: { padding: 14, gap: 10 },
  resultCount: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
});
