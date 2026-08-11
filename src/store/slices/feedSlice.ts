import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ListingBase } from '../../util/types/listing.types';

interface FeedState {
  listings: ListingBase[];
  recommendations: ListingBase[];
}

const initialState: FeedState = {
  listings: [],
  recommendations: [],
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed(state, action: PayloadAction<ListingBase[]>) {
      state.listings = action.payload;
    },
    mergeFeed(state, action: PayloadAction<ListingBase[]>) {
      if (!Array.isArray(state.listings)) state.listings = [];
      const seen = new Set(state.listings.map((l) => l.id || l._id));
      const novel = action.payload.filter((l) => !seen.has(l.id || l._id) && !seen.has(l._id || l.id));
      if (novel.length > 0) state.listings = [...state.listings, ...novel];
    },
    setRecommendations(state, action: PayloadAction<ListingBase[]>) {
      state.recommendations = action.payload;
    },
  },
});

export const { setFeed, mergeFeed, setRecommendations } = feedSlice.actions;
export default feedSlice.reducer;
