import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { getFavorites } from '../../actions/categories/favorite.actions';
import { getIdentificationStatus, submitIdentification } from '../../actions/categories/identification.actions';
import { deleteMyAd, getMyAdById, getMyAds, setAdSold } from '../../actions/core/myAds.actions';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { loadFavorites, toggleFavorite } from '../../store/slices/favoritesSlice';
import { useAppDispatch } from '../../store/store';
import { getListingDetailRoute } from '../../lib/helpers';

import type { AbortableTask, AppDispatch, BooleanCallback, Favorite, IdentificationStatus, ListingBase, RouterHref, SetAd, StateSetter, Translate, VoidCallback } from '../../utils/types';

const adKey = (item: ListingBase) => item._id || item.id;

const useLoadOnFocus = (load: AbortableTask, setLoading: BooleanCallback) => {
  useFocusEffect(
    useCallback(() => {
      const abortController = new AbortController();
      setLoading(true);
      load(abortController.signal);
      return () => abortController.abort();
    }, [load]),
  );
};

const confirmDelete = (t: Translate, title: string, onConfirm: VoidCallback) => {
  Alert.alert(t('mine.myAds.delete'), `${t('mine.myAds.deleteConfirm')} "${title}"?`, [
    { text: t('auth.common.cancel'), style: 'cancel' },
    { text: t('mine.myAds.delete'), style: 'destructive', onPress: onConfirm },
  ]);
};

const setSoldFlag = (setAd: SetAd, maGaday: boolean) => {
  setAd((prev) => (prev ? { ...prev, maGaday } : prev));
};

const withoutId = (ids: Set<string>, id: string) => {
  const nextIds = new Set(ids);
  nextIds.delete(id);
  return nextIds;
};

const useAdDeletion = (t: Translate, setAds: StateSetter<ListingBase[]>) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(
    (item: ListingBase) => {
      const id = adKey(item);
      confirmDelete(t, item.title, async () => {
        setDeletingId(id);
        try {
          await deleteMyAd(id);
          setAds((prev) => prev.filter((a) => adKey(a) !== id));
        } catch {
          Alert.alert(t('auth.common.error'), t('mine.myAds.deleteFailed'));
        } finally {
          setDeletingId(null);
        }
      });
    },
    [t],
  );

  return { deletingId, handleDelete };
};

export const useMyAds = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const hasUser = !!user;
  const [ads, setAds] = useState<ListingBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!hasUser) {
        setLoading(false);
        return;
      }
      setError(false);
      try {
        const data = await getMyAds(signal);
        if (!signal?.aborted) setAds(data);
      } catch {
        if (!signal?.aborted) setError(true);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [hasUser],
  );

  useLoadOnFocus(load, setLoading);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const retry = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  const { deletingId, handleDelete } = useAdDeletion(t, setAds);

  return { user, ads, loading, refreshing, error, deletingId, onRefresh, retry, handleDelete };
};

export const useMyAdManage = (id: string | undefined) => {
  const { t } = useTranslation();
  const [ad, setAd] = useState<ListingBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [toggling, setToggling] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) {
        setLoading(false);
        setNotFound(true);
        return;
      }
      setNotFound(false);
      try {
        const data = await getMyAdById(id, signal);
        if (signal?.aborted) return;
        if (data) setAd(data);
        else setNotFound(true);
      } catch {
        if (!signal?.aborted) setNotFound(true);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [id],
  );

  useLoadOnFocus(load, setLoading);

  const toggleSold = useCallback(async () => {
    if (!ad) return;
    const nextValue = !ad.maGaday;
    setSoldFlag(setAd, nextValue);
    setToggling(true);
    try {
      setSoldFlag(setAd, await setAdSold(adKey(ad), nextValue));
    } catch {
      setSoldFlag(setAd, !nextValue);
      Alert.alert(t('auth.common.error'), t('mine.myAds.toggleSoldFailed'));
    } finally {
      setToggling(false);
    }
  }, [ad, t]);

  return { ad, loading, notFound, toggling, toggleSold };
};

const useFavoriteRemoval = (
  dispatch: AppDispatch,
  setFavorites: StateSetter<Favorite[]>,
) => {
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  const handleRemove = useCallback(
    async (fav: Favorite) => {
      setRemoving((prev) => new Set(prev).add(fav.itemId));
      try {
        await dispatch(toggleFavorite({ itemId: fav.itemId, wasFav: true })).unwrap();
        setFavorites((prev) => prev.filter((f) => f.itemId !== fav.itemId));
      } finally {
        setRemoving((prev) => withoutId(prev, fav.itemId));
      }
    },
    [dispatch],
  );

  return { removing, handleRemove };
};

export const useFavoritesData = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuthStore();
  const isLoggedIn = !!(user?._id || user?.id);

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }
      setError(false);
      try {
        const favs = await getFavorites();
        if (signal?.aborted) return;
        setFavorites(favs);
        dispatch(loadFavorites());
      } catch {
        if (!signal?.aborted) setError(true);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [isLoggedIn, dispatch],
  );

  useLoadOnFocus(load, setLoading);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const { removing, handleRemove } = useFavoriteRemoval(dispatch, setFavorites);

  const handleCardPress = useCallback(
    (fav: Favorite) => {
      router.push(
        getListingDetailRoute({ id: fav.itemId, category: fav.category }) as RouterHref,
      );
    },
    [router],
  );

  return {
    user,
    favorites,
    loading,
    refreshing,
    removing,
    error,
    onRefresh,
    handleRemove,
    handleCardPress,
  };
};

export const useIdentification = () => {
  const { user } = useAuthStore();
  const hasUser = !!user;
  const [status, setStatus] = useState<IdentificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!hasUser) {
        setLoading(false);
        return;
      }
      setError(false);
      try {
        const data = await getIdentificationStatus();
        if (!signal?.aborted) setStatus(data);
      } catch {
        if (!signal?.aborted) setError(true);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [hasUser],
  );

  useEffect(() => {
    const abortController = new AbortController();
    load(abortController.signal);
    return () => abortController.abort();
  }, [load]);

  const submit = useCallback(async (idCardImage?: string, selfieImage?: string) => {
    setSubmitting(true);
    try {
      await submitIdentification({ idCardImage, selfieImage });
      setStatus((prev) => (prev ? { ...prev, submitted: true } : prev));
      return true;
    } catch {
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { user, status, loading, error, submitting, submit, reload: load };
};

export const useIdentityGate = () => {
  const { user } = useAuthStore();
  const userId = user?.id;
  const isAdmin = user?.isAdmin;
  const [status, setStatus] = useState<IdentificationStatus | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const checking = useRef(false);

  const check = useCallback(async () => {
    if (!userId || isAdmin || checking.current) return;
    checking.current = true;
    try {
      const data = await getIdentificationStatus();
      setStatus(data);
      setGateOpen(data.required && !data.submitted);
    } catch {
    } finally {
      checking.current = false;
    }
  }, [userId, isAdmin]);

  useEffect(() => {
    if (!userId) {
      setGateOpen(false);
      return;
    }
    check();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    return () => sub.remove();
  }, [userId, check]);

  const onVerified = useCallback(() => {
    setGateOpen(false);
    check();
  }, [check]);

  return {
    gateOpen,
    idCardRequired: status?.idCardRequired ?? true,
    selfieRequired: status?.selfieRequired ?? true,
    onVerified,
  };
};
