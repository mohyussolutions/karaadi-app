import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/store';
import { toggleFavorite, selectFavoriteIdSet } from '../store/slices/favoritesSlice';
import { useAuthStore } from '../store/hooks/authStore';
import { trackItemView } from '../actions/categories/feed.actions';
import { getCachedListing } from '../util/cache/listingCache';
import { showToast } from '../util/cache/toastService';
import { ROUTES } from '../constants/constants';
import type { ListingBase } from '../util/types/listing.types';

interface UseListingDetailOptions<T extends ListingBase> {
  fetchItem: (id: string, signal: AbortSignal) => Promise<T | null | undefined>;
  categoryHint: string;
  listingType?: string;
  contactRole?: string;
  extraDeps?: unknown[];
}

export function useListingDetail<T extends ListingBase>(
  id: string,
  { fetchItem, categoryHint, listingType, contactRole = 'Seller', extraDeps = [] }: UseListingDetailOptions<T>,
) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuthStore();
  const isFavorite = useAppSelector(selectFavoriteIdSet).has(id);

  const [item, setItem] = useState<T | null>(() => getCachedListing(id) as T | null);
  // Cache gives an instant preview (title/price), but the feed only ever sends
  // one thumbnail image per listing, so the gallery must wait for the full
  // fetch before rendering — otherwise it looks done with just one photo.
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    async function load() {
      try {
        const data = await fetchItem(id, ctrl.signal);
        if (data) setItem({ ...data, id: data.id || data._id });
      } catch {}
      setLoading(false);
    }
    load();
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ...extraDeps]);

  useEffect(() => {
    if (!item?.id) return;
    trackItemView(item.id, item.mainCategory || categoryHint, user?.id ?? null);
  }, [item?.id]);

  async function toggleFav() {
    if (!user) { router.push(ROUTES.login); return; }
    const willSave = !isFavorite;
    try {
      await dispatch(toggleFavorite({ itemId: id, wasFav: isFavorite, listing: item, categoryHint })).unwrap();
      showToast({
        message: willSave ? 'Saved to favorites' : 'Removed from favorites',
        type: willSave ? 'saved' : 'removed',
        onView: willSave ? () => router.push(ROUTES.favorites) : undefined,
      });
    } catch {
      showToast({ message: 'Could not update favorites', type: 'removed' });
    }
  }

  function handleContact() {
    if (!user) { router.push(ROUTES.login); return; }
    const sellerId = item?.userId || item?.user?._id || item?.user?.id;
    if (sellerId) {
      router.push({
        pathname: ROUTES.chat,
        params: {
          userId: sellerId,
          username: item?.user?.username || contactRole,
          listingId: id,
          ...(listingType ? { listingType } : {}),
        },
      });
    }
  }

  function handleCall() {
    const phone = item?.user?.phone;
    if (phone) Linking.openURL(`tel:${phone}`);
  }

  function handleShare() { if (item) setShareVisible(true); }

  return {
    user, item, loading, isFavorite,
    activeImage, setActiveImage,
    zoomed, setZoomed,
    expanded, setExpanded,
    shareVisible, setShareVisible,
    toggleFav, handleContact, handleCall, handleShare,
  };
}
