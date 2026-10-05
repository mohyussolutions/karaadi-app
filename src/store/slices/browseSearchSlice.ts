import { createSlice } from '@reduxjs/toolkit';
import type { BrowseSearchState, SetBrowseQueryAction } from '../../utils/types';

const initialState: BrowseSearchState = {
  query: '',
};

const browseSearchSlice = createSlice({
  name: 'browseSearch',
  initialState,
  selectors: {
    selectBrowseQuery: (state) => state.query,
  },
  reducers: {
    setBrowseQuery(state, action: SetBrowseQueryAction) {
      state.query = action.payload;
    },
    clearBrowseQuery(state) {
      state.query = '';
    },
  },
});

export const { setBrowseQuery, clearBrowseQuery } = browseSearchSlice.actions;
export const { selectBrowseQuery } = browseSearchSlice.selectors;
export default browseSearchSlice.reducer;
