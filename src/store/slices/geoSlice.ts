import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientGetAllRegions } from '../../actions/categories/geo.actions';
import type { GeoState } from '../../util/types/redux.types';

export const GEO_CACHE_TTL = 3600_000;

const initialState: GeoState = {
  regions: [],
  status: 'idle',
  fetchedAt: null,
};

export const fetchGeoRegions = createAsyncThunk('geo/fetchRegions', async () => {
  return clientGetAllRegions();
});

const geoSlice = createSlice({
  name: 'geo',
  initialState,
  reducers: {
    invalidateGeoCache(state) {
      state.fetchedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeoRegions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGeoRegions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regions = action.payload;
        state.fetchedAt = Date.now();
      })
      .addCase(fetchGeoRegions.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { invalidateGeoCache } = geoSlice.actions;
export default geoSlice.reducer;
