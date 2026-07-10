import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EmptyState } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useMyBusinesses } from '../../hooks/useMyBusinesses';
import { placeholderAvatar } from '../../constants';
import { BUSINESS_TYPE_ICON, BUSINESS_TYPE_LABEL } from '../../util/types';
import { createStyles } from '../../util/styles/profile/businesses.styles';

const PLACEHOLDER = placeholderAvatar(80, '2563eb', 'B');

export default function BusinessesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { businesses, loading, refreshing, onRefresh, handleDelete } = useMyBusinesses();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={businesses}
        keyExtractor={item => item._id || item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 84 }, businesses.length === 0 && styles.listEmpty]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListHeaderComponent={
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => router.push('/profile/business-create')}
            activeOpacity={0.88}
          >
            <MaterialCommunityIcons name="office-building-plus-outline" size={20} color={Colors.white} />
            <Text style={styles.createBtnText}>{t('mine.businesses.createProfile')}</Text>
            <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.white} />
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <EmptyState
            icon="office-building-off-outline"
            title={t('mine.businesses.noBusinessesYet')}
            message={t('mine.businesses.noBusinessesDesc')}
          />
        }
        renderItem={({ item }) => {
          const typeKey = item.categories?.[0] || item.category || item.type || '';
          const typeLabel = BUSINESS_TYPE_LABEL[typeKey] || typeKey || t('mine.businesses.businessLabel');
          const typeIcon = BUSINESS_TYPE_ICON[typeKey] || 'office-building-outline';
          return (
            <View>
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => router.push(`/profile/business-create?id=${item._id || item.id}`)}
              >
                <Image source={{ uri: item.logo || PLACEHOLDER }} style={styles.logo} />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.typeBadge}>
                    <MaterialCommunityIcons name={typeIcon as any} size={11} color={Colors.primary} />
                    <Text style={styles.typeText}>{typeLabel}</Text>
                  </View>
                  {(item.city || item.region) && (
                    <View style={styles.locationRow}>
                      <MaterialCommunityIcons name="map-marker-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.location}>{[item.city, item.region].filter(Boolean).join(', ')}</Text>
                    </View>
                  )}
                  {item.phone && (
                    <View style={styles.locationRow}>
                      <MaterialCommunityIcons name="phone-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.location}>{item.phone}</Text>
                    </View>
                  )}
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                <MaterialCommunityIcons name="trash-can-outline" size={13} color={Colors.error} />
                <Text style={styles.deleteText}>{t('mine.businesses.delete')}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
