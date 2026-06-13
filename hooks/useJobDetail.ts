import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/store';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { JOBS_ENDPOINTS } from '../constants';
import { getCachedListing } from '../services/listingCache';
import { showToast } from '../services/toastService';
import { formatPrice } from '../utils/helpers';
import type { Job } from '../utils/types/listing.types';

export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return 'Negotiable';
  if (min && max) return `${formatPrice(min)} – ${formatPrice(max)}`;
  if (min) return `From ${formatPrice(min)}`;
  return `Up to ${formatPrice(max!)}`;
}

export function useJobDetail(id: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuthStore();
  const isFavorite = useAppSelector((st) => st.favorites.ids.includes(id));

  const [item, setItem] = useState<Job | null>(() => getCachedListing(id));
  const [loading, setLoading] = useState(() => !getCachedListing(id));
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    async function load() {
      try {
        const { data } = await apiClient.get(JOBS_ENDPOINTS.BY_ID(id), { signal: ctrl.signal });
        setItem({ ...data, id: data.id || data._id });
      } catch {}
      setLoading(false);
    }
    load();
    return () => ctrl.abort();
  }, [id]);

  async function toggleFav() {
    if (!user) { router.push('/(auth)/login'); return; }
    const willSave = !isFavorite;
    try {
      await dispatch(toggleFavorite({ itemId: id, wasFav: isFavorite, listing: item, categoryHint: 'jobs' })).unwrap();
      showToast({
        message: willSave ? 'Saved to favorites' : 'Removed from favorites',
        type: willSave ? 'saved' : 'removed',
        onView: willSave ? () => router.push('/profile/favorites') : undefined,
      });
    } catch {
      showToast({ message: 'Could not update favorites', type: 'removed' });
    }
  }

  function handleContact() {
    if (!user) { router.push('/(auth)/login'); return; }
    const sellerId = item?.userId || item?.user?._id || item?.user?.id;
    if (sellerId) {
      router.push({ pathname: '/profile/chat', params: { userId: sellerId, username: item.user?.username || 'Employer', listingId: id } });
    }
  }

  function handleCall() {
    const phone = item?.user?.phone;
    if (phone) Linking.openURL(`tel:${phone}`);
  }

  function handleShare() { setShareVisible(true); }

  return {
    user, item, loading, isFavorite,
    activeImage, setActiveImage,
    zoomed, setZoomed,
    expanded, setExpanded,
    shareVisible, setShareVisible,
    toggleFav, handleContact, handleCall, handleShare,
  };
}
