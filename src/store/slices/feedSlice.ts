import { createSlice } from '@reduxjs/toolkit';
import type { FeedState, MergeFeedAction, SetFeedAction, SetRecommendationsAction } from '../../utils/types';

const initialState: FeedState = {
  listings: [],
  recommendations: [],
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    selectFeedListings: (state) => state.listings,
    selectFeedRecommendations: (state) => state.recommendations,
  },
  reducers: {
    setFeed(state, action: SetFeedAction) {
      state.listings = action.payload;
    },
    mergeFeed(state, action: MergeFeedAction) {
      if (!Array.isArray(state.listings)) state.listings = [];
      const seen = new Set(state.listings.map((l) => l.id || l._id));
      const novel = action.payload.filter((l) => !seen.has(l.id || l._id) && !seen.has(l._id || l.id));
      if (novel.length > 0) state.listings = [...state.listings, ...novel];
    },
    setRecommendations(state, action: SetRecommendationsAction) {
      state.recommendations = action.payload;
    },
  },
});

export const { setFeed, mergeFeed, setRecommendations } = feedSlice.actions;
export const { selectFeedListings, selectFeedRecommendations } = feedSlice.selectors;
export default feedSlice.reducer;
