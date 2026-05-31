import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image, TouchableOpacity,
  FlatList, Dimensions, Alert, Linking,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import LoadingSpinner from '../../src/components/shared/LoadingSpinner';
import { apiClient } from '../../src/api/client';
import { addFavorite, removeFavorite, checkFavorite } from '../../src/api/favorites';
import { useAuthStore } from '../../src/store/authStore';
import type { ListingBase } from '../../src/types';

const { width } = Dimensions.get('window');
const PLACEHOLDER = 'https://placehold.co/400x280/9ca3af/ffffff?text=No+Image';

const CATEGORY_ENDPOINTS: Record<string, string> = {
  cars: '/api/cars',
  boats: '/api/boats',
  motorcycles: '/api/motorcycles',
  'real-estate': '/api/real-estate',
  'farm-equipment': '/api/traktor',
  marketplace: '/api/marketplace',
  jobs: '/api/jobs',
  items: '/api/items',
  wanted: '/api/wanted',
};

export default function ListingDetailScreen() {
  const { id, category } = useLocalSearchParams<{ id: string; category: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useAuthStore();
  const [item, setItem] = useState<ListingBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const endpoint = CATEGORY_ENDPOINTS[category] || `/api/${category}`;
        const { data } = await apiClient.get(`${endpoint}/${id}`);
        const normalized = { ...data, id: data.id || data._id, _id: data._id || data.id };
        setItem(normalized);
        navigation.setOptions({ title: normalized.title || 'Listing' });
        if (user) {
          const fav = await checkFavorite(id, (normalized as any).mainCategory || category);
          setIsFavorite(fav);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [id, category]);

  async function toggleFavorite() {
    if (!user) { router.push('/(auth)/login'); return; }
    if (isFavorite) {
      setIsFavorite(false);
      await removeFavorite(id).catch(() => setIsFavorite(true));
    } else {
      setIsFavorite(true);
      await addFavorite(id, (item as any)?.mainCategory || category).catch(() => setIsFavorite(false));
    }
  }

  function handleContact() {
    if (!user) { router.push('/(auth)/login'); return; }
    const sellerId = (item as any)?.userId;
    if (sellerId) {
      router.push({
        pathname: '/profile/chat',
        params: { userId: sellerId, username: item?.user?.username || 'Seller', listingId: id },
      });
    }
  }

  function handleCall() {
    const phone = item?.user?.phone;
    if (phone) Linking.openURL(`tel:${phone}`);
  }

  if (loading) return <LoadingSpinner fullScreen />;
  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.errorText}>Listing not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = item.images?.length ? item.images : [PLACEHOLDER];
  const badge = item.isPremium90
    ? { label: 'PREMIUM', color: Colors.premium }
    : item.isStandard60
    ? { label: 'STANDARD', color: Colors.standard }
    : item.isBasic30
    ? { label: 'BASIC', color: Colors.basic }
    : null;

  const details = Object.entries(item)
    .filter(([k, v]) =>
      !['_id', 'id', 'userId', 'images', 'title', 'description', 'price', 'createdAt',
        'updatedAt', 'isPaid', 'isActive', 'isBasic30', 'isStandard60', 'isPremium90',
        'expiryDate', 'planId', 'planAmount', 'plan', 'user'].includes(k) &&
      v !== null && v !== undefined && v !== ''
    )
    .map(([k, v]) => ({ key: k, value: String(v) }));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onScroll={(e) => setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item: img }) => (
              <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
            )}
          />
          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, i) => (
                <View key={i} style={[styles.dot, i === activeImage && styles.dotActive]} />
              ))}
            </View>
          )}
          {badge && (
            <View style={[styles.imageBadge, { backgroundColor: badge.color }]}>
              <Text style={styles.imageBadgeText}>{badge.label}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.favBtn} onPress={toggleFavorite}>
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? Colors.error : Colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>
            {item.price > 0 ? `$${item.price.toLocaleString()}` : 'Price on request'}
          </Text>

          <View style={styles.locationRow}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.textMuted} />
            <Text style={styles.locationText}>
              {[item.city, item.region].filter(Boolean).join(', ') || 'Somalia'}
            </Text>
          </View>

          <Text style={styles.postedDate}>
            Posted {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
          </Text>

          {item.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}

          {details.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Details</Text>
              <View style={styles.detailsGrid}>
                {details.map(({ key, value }) => (
                  <View key={key} style={styles.detailItem}>
                    <Text style={styles.detailKey}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Text>
                    <Text style={styles.detailValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {item.user && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Seller</Text>
              <View style={styles.sellerRow}>
                <Image
                  source={{ uri: item.user.profileImage || 'https://placehold.co/48x48/9ca3af/ffffff?text=?' }}
                  style={styles.sellerAvatar}
                />
                <View style={styles.sellerInfo}>
                  <Text style={styles.sellerName}>{item.user.username}</Text>
                  <Text style={styles.sellerEmail}>{item.user.email}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        {item.user?.phone && (
          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
            <MaterialCommunityIcons name="phone" size={20} color={Colors.primary} />
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.messageBtn} onPress={handleContact}>
          <MaterialCommunityIcons name="message-outline" size={20} color={Colors.white} />
          <Text style={styles.messageBtnText}>Message Seller</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  image: { width, height: 260 },
  dots: {
    flexDirection: 'row', justifyContent: 'center', position: 'absolute',
    bottom: 10, left: 0, right: 0, gap: 6,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.white + '80' },
  dotActive: { backgroundColor: Colors.white, width: 18 },
  imageBadge: {
    position: 'absolute', top: 12, left: 12,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
  },
  imageBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  favBtn: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: Colors.overlay, borderRadius: 20, padding: 8,
  },
  body: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  price: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  locationText: { fontSize: 14, color: Colors.textSecondary },
  postedDate: { fontSize: 12, color: Colors.textMuted, marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  detailsGrid: { gap: 8 },
  detailItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  detailKey: { fontSize: 14, color: Colors.textSecondary, textTransform: 'capitalize' },
  detailValue: { fontSize: 14, fontWeight: '600', color: Colors.text, textAlign: 'right', flex: 1, marginLeft: 8 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sellerAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.border },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  sellerEmail: { fontSize: 13, color: Colors.textSecondary },
  actions: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10, padding: 16,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 2, borderColor: Colors.primary, borderRadius: 12,
    paddingVertical: 13, paddingHorizontal: 20,
  },
  callText: { color: Colors.primary, fontWeight: '700', fontSize: 15 },
  messageBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14,
  },
  messageBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  errorText: { fontSize: 16, color: Colors.textSecondary },
  backLink: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
});
