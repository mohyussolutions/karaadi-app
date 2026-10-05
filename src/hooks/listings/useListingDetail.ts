import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';

import { trackItemView } from '../../actions/categories/feed.actions';
import { getJobById } from '../../actions/categories/job.actions';
import { getVehicleDetailById } from '../../actions/categories/listing.actions';
import { getMarketplaceItemById } from '../../actions/categories/marketplace.actions';
import { getRealEstateById } from '../../actions/categories/realEstate.actions';
import { getSubscriptionById } from '../../actions/categories/subscription.actions';
import { ROUTES } from '../../actions/constants';
import { vehicleListPath } from '../../actions/constants/paths';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { selectFavoriteIdSet, toggleFavorite } from '../../store/slices/favoritesSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { showToast } from '../../lib/cache/toastService';
import { formatPrice } from '../../lib/helpers';

import type { AppRouter, Job, ListingBase, ListingFetcher, MarketplaceItem, RealEstate, Subscription, SubscriptionEnvelope, UseListingDetailOptions, VehicleListing } from '../../utils/types';

const callPhone = (phone: string | null | undefined) => {
  if (phone) Linking.openURL(`tel:${phone}`);
};

const showFavoriteToast = (willSave: boolean, router: AppRouter) => {
  showToast({
    message: willSave ? 'Saved to favorites' : 'Removed from favorites',
    type: willSave ? 'saved' : 'removed',
    onView: willSave ? () => router.push(ROUTES.favorites) : undefined,
  });
};

const getSellerId = (item: ListingBase | null) => item?.userId || item?.user?._id || item?.user?.id;

const useFetchedListing = <T extends ListingBase>(
  id: string,
  fetchItem: ListingFetcher<T>,
  extraDeps: unknown[],
) => {
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const load = async () => {
      try {
        const data = await fetchItem(id, abortController.signal);
        if (data) setItem({ ...data, id: data.id || data._id });
      } catch {}
      setLoading(false);
    };
    load();
    return () => abortController.abort();
  }, [id, ...extraDeps]);

  return { item, loading };
};

const useFavoriteToggle = (id: string, item: ListingBase | null, categoryHint: string, router: AppRouter) => {
  const dispatch = useAppDispatch();
  const { user } = useAuthStore();
  const isFavorite = useAppSelector(selectFavoriteIdSet).has(id);

  const toggleFav = async () => {
    if (!user) return router.push(ROUTES.login);
    const willSave = !isFavorite;
    try {
      await dispatch(
        toggleFavorite({
          itemId: id,
          wasFav: isFavorite,
          listing: item,
          categoryHint,
        }),
      ).unwrap();
      showFavoriteToast(willSave, router);
    } catch {
      showToast({ message: 'Could not update favorites', type: 'removed' });
    }
  };

  return { isFavorite, toggleFav };
};

const useDetailViewState = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  return {
    activeImage,
    setActiveImage,
    zoomed,
    setZoomed,
    expanded,
    setExpanded,
    shareVisible,
    setShareVisible,
  };
};

export const useListingDetail = <T extends ListingBase>(
  id: string,
  { fetchItem, categoryHint, listingType, contactRole = 'Seller', extraDeps = [] }: UseListingDetailOptions<T>,
) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { item, loading } = useFetchedListing(id, fetchItem, extraDeps);
  const { isFavorite, toggleFav } = useFavoriteToggle(id, item, categoryHint, router);
  const viewState = useDetailViewState();

  useEffect(() => {
    if (!item?.id) return;
    trackItemView(item.id, item.mainCategory || categoryHint, user?.id ?? null);
  }, [item?.id]);

  const handleContact = () => {
    if (!user) return router.push(ROUTES.login);
    const sellerId = getSellerId(item);
    if (!sellerId) return;
    router.push({
      pathname: ROUTES.chat,
      params: {
        userId: sellerId,
        username: item?.user?.username || contactRole,
        listingId: id,
        ...(listingType ? { listingType } : {}),
      },
    });
  };

  const handleCall = () => callPhone(item?.user?.phone);
  const handleShare = () => {
    if (item) viewState.setShareVisible(true);
  };

  return {
    user,
    item,
    loading,
    isFavorite,
    ...viewState,
    toggleFav,
    handleContact,
    handleCall,
    handleShare,
  };
};

export const useItemDetail = (id: string) =>
  useListingDetail<MarketplaceItem>(id, {
    fetchItem: getMarketplaceItemById,
    categoryHint: 'marketplace',
    listingType: 'Marketplace',
  });

export const useVehicleDetail = (id: string, category: string) =>
  useListingDetail<VehicleListing>(id, {
    fetchItem: (itemId, signal) => getVehicleDetailById(itemId, vehicleListPath(category), signal),
    categoryHint: category || 'cars',
    extraDeps: [category],
  });

export const formatSalary = (min?: number, max?: number): string => {
  if (!min && !max) return 'Negotiable';
  if (min && max) return `${formatPrice(min)} – ${formatPrice(max)}`;
  if (min) return `From ${formatPrice(min)}`;
  return `Up to ${formatPrice(max!)}`;
};

export const useJobDetail = (id: string) =>
  useListingDetail<Job>(id, {
    fetchItem: getJobById,
    categoryHint: 'jobs',
    contactRole: 'Employer',
  });

export const useRealEstateDetail = (id: string) =>
  useListingDetail<RealEstate>(id, {
    fetchItem: getRealEstateById,
    categoryHint: 'realestate',
    listingType: 'RealEstate',
  });

const unwrapSubscription = (data: SubscriptionEnvelope): Subscription => {
  const sub = data?.subscription ?? data?.data ?? data;
  return { ...sub, id: sub.id || sub._id || '' };
};

const getSubscriptionOwnerId = (item: Subscription | null) =>
  typeof item?.user === 'object' ? item.user?._id || item.user?.id : item?.userId;

const useSubscriptionItem = (id: string) => {
  const [item, setItem] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const load = async () => {
      try {
        setItem(unwrapSubscription(await getSubscriptionById(id, abortController.signal)));
      } catch {}
      setLoading(false);
    };
    load();
    return () => abortController.abort();
  }, [id]);

  return { item, loading };
};

export const useSubscriptionDetail = (id: string) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { item, loading } = useSubscriptionItem(id);
  const [showPhone, setShowPhone] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);

  const owner = typeof item?.user === 'object' ? item.user : null;
  const ownerName = owner?.username || 'User';
  const ownerPhone = owner?.phone || null;
  const ownerAvatar = owner?.profileImage || null;

  const handleMessage = () => {
    if (!user) return router.push(ROUTES.login);
    const ownerId = getSubscriptionOwnerId(item);
    if (!ownerId) return;
    router.push({
      pathname: ROUTES.chat,
      params: {
        userId: ownerId,
        username: ownerName,
        listingId: id,
        listingType: 'Subscription',
      },
    });
  };

  const handleCall = () => callPhone(ownerPhone);
  const handleShare = () => {
    if (item) setShareVisible(true);
  };

  return {
    user,
    item,
    loading,
    showPhone,
    setShowPhone,
    shareVisible,
    setShareVisible,
    ownerName,
    ownerPhone,
    ownerAvatar,
    handleMessage,
    handleCall,
    handleShare,
  };
};
