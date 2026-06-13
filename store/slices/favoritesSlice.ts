import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavorites, addFavorite, removeFavorite } from '../../api/categories/favorite.actions';
import type { Favorite } from '../../utils/types';

interface FavoritesState {
  ids: string[];
  idMap: Record<string, string>;
  items: Favorite[];
  loaded: boolean;
}

const initialState: FavoritesState = {
  ids: [],
  idMap: {},
  items: [],
  loaded: false,
};

function fromFavList(favs: Favorite[]): Pick<FavoritesState, 'ids' | 'idMap' | 'items'> {
  return {
    items: favs,
    ids: favs.map((f) => f.itemId).filter(Boolean),
    idMap: Object.fromEntries(
      favs.filter((f) => f.itemId && f.id).map((f) => [f.itemId, f.id]),
    ),
  };
}

export const loadFavorites = createAsyncThunk('favorites/load', async () => {
  return getFavorites();
});

export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async (
    { itemId, wasFav, listing, categoryHint }: { itemId: string; wasFav: boolean; listing?: any; categoryHint?: string },
    { getState },
  ) => {
    if (wasFav) {
      const state = (getState() as { favorites: FavoritesState }).favorites;
      const favId = state.idMap[itemId];
      if (favId) await removeFavorite(favId);
      return { action: 'remove' as const, itemId };
    } else {
      const favorite = await addFavorite(listing, categoryHint);
      return { action: 'add' as const, itemId, favorite };
    }
  },
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.fulfilled, (state, action) => {
        const derived = fromFavList(action.payload);
        state.items = derived.items;
        state.ids = derived.ids;
        state.idMap = derived.idMap;
        state.loaded = true;
      })
      .addCase(toggleFavorite.pending, (state, action) => {
        const { itemId, wasFav, listing } = action.meta.arg;
        if (wasFav) {
          state.ids = state.ids.filter((id) => id !== itemId);
          state.items = state.items.filter((f) => f.itemId !== itemId);
        } else {
          if (!state.ids.includes(itemId)) {
            state.ids = [...state.ids, itemId];
          }
          if (!state.items.find((f) => f.itemId === itemId)) {
            state.items = [
              ...state.items,
              {
                id: `temp_${itemId}`,
                itemId,
                title: listing?.title || '',
                description: listing?.description || '',
                price: listing?.price != null ? String(listing.price) : undefined,
                image: listing?.images?.[0],
                category: listing?.mainCategory || listing?.category || '',
                createdAt: new Date().toISOString(),
              },
            ];
          }
        }
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { action: act, itemId } = action.payload;
        if (act === 'remove') {
          delete state.idMap[itemId];
          state.items = state.items.filter((f) => f.itemId !== itemId);
        } else {
          const { favorite } = action.payload as any;
          if (favorite?.id) {
            state.idMap[itemId] = favorite.id;
            state.items = state.items.map((f) => (f.itemId === itemId ? { ...favorite, itemId } : f));
          }
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        const { itemId, wasFav } = action.meta.arg;
        if (wasFav) {
          if (!state.ids.includes(itemId)) state.ids = [...state.ids, itemId];
        } else {
          state.ids = state.ids.filter((id) => id !== itemId);
          state.items = state.items.filter((f) => f.itemId !== itemId);
        }
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
