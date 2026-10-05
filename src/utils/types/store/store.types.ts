import type { store } from '../../../store/store';

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export interface StoreRef {
  dispatch: AppDispatch | null;
}

export type FavoritesRootState = Pick<RootState, 'favorites'>;
