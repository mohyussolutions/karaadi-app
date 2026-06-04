import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../../src/constants/colors';
import { LoadingSpinner } from '../../../src/components/shared';
import { apiClient } from '../../../src/api/client';
import { JOBS_ENDPOINTS } from '../../../src/constants/endpoints';
import { addFavorite, removeFavorite, checkFavorite } from '../../../src/api/favorites';
import { useAuthStore } from '../../../src/store/authStore';
import { getImageUrl, formatPrice, formatDate } from '../../../src/components/format';
import ImageGallery from '../../../src/components/detail/ImageGallery';
import ZoomModal from '../../../src/components/detail/ZoomModal';
import { SpecGrid } from '../../../src/components/detail/DetailCard';

const PLACEHOLDER = 'https://placehold.co/800x560/e5e7eb/9ca3af?text=No+Image';

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return 'Negotiable';
  if (min && max) return `${formatPrice(min)} – ${formatPrice(max)}`;
  if (min) return `From ${formatPrice(min)}`;
  return `Up to ${formatPrice(max!)}`;
}

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await apiClient.get(JOBS_ENDPOINTS.BY_ID(id));
        setItem({ ...data, id: data.id || data._id });
        if (user) {
          const fav = await checkFavorite(id, 'jobs');
          setIsFavorite(fav);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  async function toggleFav() {
    if (!user) { router.push('/(auth)/login'); return; }
    if (isFavorite) { setIsFavorite(false); await removeFavorite(id).catch(() => setIsFavorite(true)); }
    else { setIsFavorite(true); await addFavorite(id, 'jobs').catch(() => setIsFavorite(false)); }
  }

  function handleApply() {
    if (!user) { router.push('/(auth)/login'); return; }
    router.push({ pathname: '/profile/chat', params: { userId: item?.userId, username: item?.user?.username || 'Employer', listingId: id } });
  }

  if (loading) return <LoadingSpinner fullScreen />;
  if (!item) {
    return (
      <View style={s.errorWrap}>
        <MaterialCommunityIcons name="briefcase-outline" size={52} color={Colors.textMuted} />
        <Text style={s.errorTitle}>{t('jobsPage.backLabel') || 'Job not found'}</Text>
        <TouchableOpacity style={s.errorBack} onPress={() => router.back()}>
          <Text style={s.errorBackText}>{t('report.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const rawImages: string[] = [];
  if (item.companyLogo) rawImages.push(item.companyLogo);
  if (item.images?.length) rawImages.push(...item.images);
  const images = rawImages.length ? rawImages.map(getImageUrl) : [PLACEHOLDER];

  const desc = item.description || '';
  const TRUNCATE = 300;
  const salary = formatSalary(item.salaryMin, item.salaryMax);

  const poster = item.user;
  const posterName = typeof poster === 'object' ? poster?.username || 'Employer' : 'Employer';
  const posterAvatar = typeof poster === 'object' ? poster?.profileImage || null : null;
  const initial = posterName[0].toUpperCase();
  const avatarFallback = `https://placehold.co/80x80/3B82F6/ffffff?text=${initial}`;

  const specItems: { label: string; value: string }[] = [
    item.company && { label: 'Company', value: item.company },
    (item.employmentType || item.type) && { label: 'Job Type', value: item.employmentType || item.type },
    salary !== 'Negotiable' && { label: 'Salary', value: salary },
    item.location && { label: 'Location', value: item.location },
    item.createdAt && { label: 'Posted', value: formatDate(item.createdAt) },
  ].filter(Boolean) as { label: string; value: string }[];

  const locationLabel = [item.city, item.region].filter(Boolean).join(', ') || item.location || 'Somalia';

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageGallery
          images={images} activeIndex={activeImage}
          onActiveChange={setActiveImage} onZoom={() => setZoomed(true)}
          isFavorite={isFavorite} onFavorite={toggleFav}
        />

        <View style={s.body}>
          <Text style={s.title}>{item.title}</Text>
          <Text style={s.salary}>{salary}</Text>

          <View style={s.metaRow}>
            <View style={s.locPill}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color={Colors.primary} />
              <Text style={s.locText}>{locationLabel}</Text>
            </View>
            {item.createdAt && <Text style={s.dateText}>{formatDate(item.createdAt)}</Text>}
          </View>

          <View style={s.employerCard}>
            <Image source={{ uri: posterAvatar || avatarFallback }} style={s.employerAvatar} />
            <View style={s.employerInfo}>
              <Text style={s.employerName}>{posterName}</Text>
              {item.company && <Text style={s.employerSub}>{item.company}</Text>}
            </View>
          </View>

          {specItems.length > 0 && (
            <SpecGrid title="Job Details" items={specItems} />
          )}

          {desc.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>{t('jobsPage.jobDescription') || 'Description'}</Text>
              <Text style={s.description}>
                {expanded || desc.length <= TRUNCATE ? desc : `${desc.slice(0, TRUNCATE)}...`}
              </Text>
              {desc.length > TRUNCATE && (
                <TouchableOpacity onPress={() => setExpanded(!expanded)} style={{ marginTop: 8 }}>
                  <Text style={s.readMore}>
                    {expanded ? t('realEstateDetail.showLess') : t('realEstateDetail.readMore')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {item.requirements && (
            <View style={s.card}>
              <Text style={s.cardTitle}>Requirements</Text>
              <Text style={s.description}>{item.requirements}</Text>
            </View>
          )}

          <View style={{ height: 8 }} />
        </View>
      </ScrollView>

      <View style={s.actions}>
        <View style={s.salaryBlock}>
          <Text style={s.salaryLabel}>{salary}</Text>
          <Text style={s.salaryTitle} numberOfLines={1}>{item.title}</Text>
        </View>
        <TouchableOpacity style={s.applyBtn} onPress={handleApply}>
          <MaterialCommunityIcons name="send-outline" size={18} color="#fff" />
          <Text style={s.applyBtnText}>{t('jobsPage.applyNow') || 'Apply'}</Text>
        </TouchableOpacity>
      </View>

      <ZoomModal visible={zoomed} images={images} startIndex={activeImage} title={item.title} onClose={() => setZoomed(false)} />
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
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', lineHeight: 30, marginBottom: 6 },
  salary: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 },
  locPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EFF6FF', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  locText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  dateText: { fontSize: 12, color: Colors.textMuted },
  employerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: Colors.border,
  },
  employerAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.border },
  employerInfo: { flex: 1 },
  employerName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  employerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  description: { fontSize: 15, color: '#374151', lineHeight: 24 },
  readMore: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  actions: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  salaryBlock: { flex: 1, minWidth: 0 },
  salaryLabel: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  salaryTitle: { fontSize: 12, color: Colors.textSecondary },
  applyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 13, paddingHorizontal: 20,
  },
  applyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorTitle: { fontSize: 17, color: Colors.textSecondary, fontWeight: '600' },
  errorBack: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  errorBackText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
