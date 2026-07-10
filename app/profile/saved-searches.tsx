import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/profile/savedSearches.styles';
import { useSavedSearches } from '../../hooks/useSavedSearches';

export default function SavedSearchesScreen() {
  const { t } = useTranslation();
  const { searches, loading, deleteSearch } = useSavedSearches();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={searches}
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 84 }, searches.length === 0 && { flex: 1 }]}
        ListEmptyComponent={
          <EmptyState
            icon="history"
            title={t('mine.searchHistory.noRecords')}
            message={t('mine.searchHistory.recent')}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <MaterialCommunityIcons name="history" size={18} color={Colors.textMuted} />
            <Text style={styles.query} numberOfLines={1}>{item.query || item.search || item.text}</Text>
            <TouchableOpacity onPress={() => deleteSearch(item._id || item.id)} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}
