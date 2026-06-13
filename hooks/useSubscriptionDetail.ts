import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { SUBSCRIPTION_ENDPOINTS } from '../constants';
import type { Subscription } from '../utils/types/listing.types';

export function useSubscriptionDetail(id: string) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [item, setItem] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    async function load() {
      try {
        const { data } = await apiClient.get(SUBSCRIPTION_ENDPOINTS.BY_ID(id), { signal: ctrl.signal });
        const sub = data?.subscription ?? data?.data ?? data;
        setItem({ ...sub, id: sub.id || sub._id });
      } catch {}
      setLoading(false);
    }
    load();
    return () => ctrl.abort();
  }, [id]);

  const owner = typeof item?.user === 'object' ? item.user : null;
  const ownerName = owner?.username || 'User';
  const ownerPhone = owner?.phone || null;
  const ownerAvatar = owner?.profileImage || null;

  function handleMessage() {
    if (!user) { router.push('/(auth)/login'); return; }
    const ownerId = typeof item?.user === 'object'
      ? item.user?._id || item.user?.id
      : item?.userId;
    if (ownerId) {
      router.push({ pathname: '/profile/chat', params: { userId: ownerId, username: ownerName, listingId: id, listingType: 'Subscription' } });
    }
  }

  function handleCall() {
    if (ownerPhone) Linking.openURL(`tel:${ownerPhone}`);
  }

  function handleShare() { if (item) setShareVisible(true); }

  return {
    user, item, loading,
    showPhone, setShowPhone,
    shareVisible, setShareVisible,
    ownerName, ownerPhone, ownerAvatar,
    handleMessage, handleCall, handleShare,
  };
}
