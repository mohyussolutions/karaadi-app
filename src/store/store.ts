import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authReducer from './slices/authSlice';
import notificationsReducer from './slices/notificationsSlice';
import languageReducer from './slices/languageSlice';
import themeReducer from './slices/themeSlice';
import hageReducer from './slices/hageSlice';
import favoritesReducer from './slices/favoritesSlice';
import feedReducer from './slices/feedSlice';
import chatsReducer from './slices/chatsSlice';
import newAdReducer from './slices/newAdSlice';
import browseSearchReducer from './slices/browseSearchSlice';
import geoReducer from './slices/geoSlice';
import notificationSettingsReducer from './slices/notificationSettingsSlice';
import { storeRef } from './internal/storeRef';
import type { RootState, AppDispatch } from '../utils/types';

const persistConfig = {
  key: 'karaadi-mobile-v1',
  storage: AsyncStorage,
  whitelist: ['language', 'theme', 'favorites', 'notificationSettings'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationsReducer,
  language: languageReducer,
  theme: themeReducer,
  hage: hageReducer,
  favorites: favoritesReducer,
  feed: feedReducer,
  chats: chatsReducer,
  newAd: newAdReducer,
  browseSearch: browseSearchReducer,
  notificationSettings: notificationSettingsReducer,
  geo: geoReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

storeRef.dispatch = store.dispatch;

export const persistor = persistStore(store);

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
