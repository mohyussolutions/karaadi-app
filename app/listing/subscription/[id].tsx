import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../src/constants/colors';
import { LoadingSpinner } from '../../../src/components/shared';
import { apiClient } from '../../../src/api/client';
import { SUBSCRIPTION_ENDPOINTS } from '../../../src/constants/endpoints';
import { useAuthStore } from '../../../src/store/authStore';
import { formatPrice, formatDate } from '../../../src/components/format';
import SellerCard from '../../../src/components/detail/SellerCard';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await apiClient.get(SUBSCRIPTION_ENDPOINTS.BY_ID(id));
        const sub = data?.subscription ?? data?.data ?? data;
        setItem({ ...sub, id: sub.id || sub._id });
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  function handleMessage() {
    if (!user) { router.push('/(auth)/login'); return; }
    const ownerId = typeof item?.user === 'object' ? item.user?._id || item.user?.id : item?.userId;
    if (ownerId) {
      router.push({ pathname: '/profile/chat', params: { userId: ownerId, username: ownerName, listingId: id } });
    }
  }

  function handleCall() {
    const phone = ownerPhone;
    if (phone) Linking.openURL(`tel:${phone}`);
  }

  if (loading) return <LoadingSpinner fullScreen />;
  if (!item) {
    return (
      <View style={s.errorWrap}>
        <MaterialCommunityIcons name="bell-outline" size={52} color={Colors.textMuted} />
        <Text style={s.errorTitle}>Subscription not found</Text>
        <TouchableOpacity style={s.errorBack} onPress={() => router.back()}>
          <Text style={s.errorBackText}>{t('report.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const owner = typeof item.user === 'object' ? item.user : null;
  const ownerName = owner?.username || 'User';
  const ownerPhone = owner?.phone || null;
  const ownerAvatar = owner?.profileImage || null;

  const priceLabel = item.priceMin && item.priceMax
    ? `${formatPrice(item.priceMin)} – ${formatPrice(item.priceMax)}`
    : item.priceMax ? `Up to ${formatPrice(item.priceMax)}`
    : item.priceMin ? `From ${formatPrice(item.priceMin)}`
    : 'Price on request';

  const infoRows: { icon: string; label: string; value: string }[] = [
    item.category && { icon: 'tag-outline', label: 'Category', value: item.category },
    item.subcategory && { icon: 'tag-multiple-outline', label: 'Sub-category', value: item.subcategory },
    item.region && { icon: 'map-marker-outline', label: 'Region', value: [item.city, item.region].filter(Boolean).join(', ') },
    item.duration && { icon: 'calendar-clock', label: 'Duration', value: `${item.duration} days` },
    item.expiresAt && { icon: 'calendar-end', label: 'Expires', value: formatDate(item.expiresAt) },
    item.createdAt && { icon: 'calendar-plus', label: 'Posted', value: formatDate(item.createdAt) },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header hero — no image for subscriptions */}
        <View style={s.hero}>
          <View style={s.heroIcon}>
            <MaterialCommunityIcons name="bell-ring-outline" size={48} color={Colors.primary} />
          </View>
          {item.category && (
            <View style={s.categoryBadge}>
              <Text style={s.categoryBadgeText}>{item.category}</Text>
            </View>
          )}
        </View>

        <View style={s.body}>
          <Text style={s.title}>{item.title || item.category || 'Subscription'}</Text>
          <Text style={s.price}>{priceLabel}</Text>

          {(item.city || item.region) && (
            <View style={s.locRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.primary} />
              <Text style={s.locText}>{[item.city, item.region].filter(Boolean).join(', ')}</Text>
            </View>
          )}

          {/* Info rows — matches website's subscription detail layout */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Subscription Details</Text>
            {infoRows.map(({ icon, label, value }, i) => (
              <View key={label} style={[s.infoRow, i === infoRows.length - 1 && s.infoRowLast]}>
                <View style={s.infoLeft}>
                  <MaterialCommunityIcons name={icon as any} size={16} color={Colors.primary} />
                  <Text style={s.infoLabel}>{label}</Text>
                </View>
                <Text style={s.infoValue}>{value}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          {item.description && (
            <View style={s.card}>
              <Text style={s.cardTitle}>Description</Text>
              <Text style={s.description}>{item.description}</Text>
            </View>
          )}

          {/* Seller card */}
          <SellerCard
            username={ownerName} profileImage={ownerAvatar}
            phone={ownerPhone} subtitle={t('realEstateDetail.activeSeller')}
            onMessage={handleMessage} onCall={ownerPhone ? handleCall : undefined}
            messageBtnLabel={t('realEstateDetail.sendMessage')}
          />

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={s.actions}>
        {ownerPhone && (
          <TouchableOpacity
            style={s.callBtn}
            onPress={showPhone ? handleCall : () => setShowPhone(true)}
          >
            <MaterialCommunityIcons name="phone" size={18} color={Colors.primary} />
            <Text style={s.callText}>{showPhone ? ownerPhone : t('realEstateDetail.showPhone')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={s.msgBtn} onPress={handleMessage}>
          <MaterialCommunityIcons name="message-outline" size={20} color="#fff" />
          <Text style={s.msgBtnText}>{t('realEstateDetail.sendMessage')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  floatBack: {
    position: 'absolute', top: 50, left: 12, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 5, elevation: 5,
  },
  scroll: { paddingBottom: 16 },
  hero: {
    height: 220, backgroundColor: '#EFF6FF',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  heroIcon: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  categoryBadge: { backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  categoryBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', lineHeight: 30, marginBottom: 6 },
  price: { fontSize: 26, fontWeight: '800', color: Colors.primary, marginBottom: 10 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  locText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontSize: 14, color: '#6B7280' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#111827', textAlign: 'right', flex: 1, marginLeft: 16 },
  description: { fontSize: 15, color: '#374151', lineHeight: 24 },
  actions: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 2, borderColor: Colors.primary, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 14 },
  callText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  msgBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14 },
  msgBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorTitle: { fontSize: 17, color: Colors.textSecondary, fontWeight: '600' },
  errorBack: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  errorBackText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
