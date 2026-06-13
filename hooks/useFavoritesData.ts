import { useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAppDispatch } from '../store';
import { loadFavorites, toggleFavorite } from '../store/slices/favoritesSlice';
import { useAuthStore } from '../store/authStore';
import { getFavorites } from '../api/categories/favorite.actions';
import { getListingDetailRoute } from '../utils/helpers';
import type { Favorite } from '../utils/types';

export const CATEGORY_LABELS: Record<string, string> = {
  marketplace: 'Marketplace',
  cars: 'Cars',
  motorcycles: 'Motorcycles',
  boats: 'Boats',
  realestate: 'Real Estate',
  'real-estate': 'Real Estate',
  farmequipment: 'Farm Equipment',
  jobs: 'Jobs',
};

export const CATEGORY_COLORS: Record<string, string> = {
  marketplace: '#6366F1',
  cars: '#F59E0B',
  motorcycles: '#EF4444',
  boats: '#0EA5E9',
  realestate: '#10B981',
  'real-estate': '#10B981',
  farmequipment: '#84CC16',
  jobs: '#8B5CF6',
};

export function useFavoritesData() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuthStore();
  const isLoggedIn = !!(user?._id || user?.id);

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removing, setRemoving] = useState<Set<string>>(new Set());
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

  useFocusEffect(
    useCallback(() => {
      const ctrl = new AbortController();
      setLoading(true);
      load(ctrl.signal);
      return () => ctrl.abort();
    }, [load]),
  );

  function onRefresh() {
    setRefreshing(true);
    load();
  }

  async function handleRemove(fav: Favorite) {
    setRemoving((prev) => new Set(prev).add(fav.itemId));
    try {
      await dispatch(toggleFavorite({ itemId: fav.itemId, wasFav: true })).unwrap();
      setFavorites((prev) => prev.filter((f) => f.itemId !== fav.itemId));
    } finally {
      setRemoving((prev) => {
        const s = new Set(prev);
        s.delete(fav.itemId);
        return s;
      });
    }
  }

  function handleCardPress(fav: Favorite) {
    router.push(getListingDetailRoute({ id: fav.itemId, category: fav.category }) as any);
  }

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
}
