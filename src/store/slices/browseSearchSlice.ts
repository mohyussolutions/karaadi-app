import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BrowseSearchState } from '../../util/types/redux.types';

const initialState: BrowseSearchState = {
  query: '',
};

const browseSearchSlice = createSlice({
  name: 'browseSearch',
  initialState,
  reducers: {
    setBrowseQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearBrowseQuery(state) {
      state.query = '';
    },
  },
});

export const { setBrowseQuery, clearBrowseQuery } = browseSearchSlice.actions;
export default browseSearchSlice.reducer;
