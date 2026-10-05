import { useCallback, useEffect, useState } from 'react';
import { Appearance, AppState, Platform } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { checkAlertsForMatches } from '../../actions/categories/subscription.actions';
import { ALERTS_POLL_INTERVAL_MS, EULA_ACCEPTED_KEY } from '../../actions/constants';
import { getUnreadNotificationCount } from '../../actions/core/notifications.actions';
import { trackVisitor } from '../../actions/core/visitor.actions';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { clearFavorites, loadFavorites } from '../../store/slices/favoritesSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { clearChats } from '../../store/slices/chatsSlice';
import { registerForPushNotifications } from '../../components/features/notifications/services/notificationService';
import { setUnreadCount } from '../../store/slices/notificationsSlice';
import { useMessageBanner, useNotificationTap, useSocketMessages, useSocketNotifications } from '../messaging/useNotifications';
import { useThemeColors, useThemeMode } from './useTheme';

import { selectUser } from '../../store/slices/authSlice';
import type { AppDispatch, IntervalHandle } from '../../utils/types';
const watchAlerts = (userId: string, dispatch: AppDispatch) => {
  let timer: IntervalHandle | null = null;

  const refreshAlerts = () => {
    checkAlertsForMatches();
    getUnreadNotificationCount(userId)
      .then((count) => dispatch(setUnreadCount(count)))
      .catch(() => {});
  };
  const startPolling = () => {
    if (!timer) timer = setInterval(checkAlertsForMatches, ALERTS_POLL_INTERVAL_MS);
  };
  const stopPolling = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  refreshAlerts();
  startPolling();
  const sub = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      refreshAlerts();
      startPolling();
    } else stopPolling();
  });
  return () => {
    sub.remove();
    stopPolling();
  };
};

export const useAppInit = () => {
  const { loadFromStorage } = useAuthStore();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    loadFromStorage();
    trackVisitor();
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(loadFavorites());
      registerForPushNotifications();
    } else {
      dispatch(clearFavorites());
      dispatch(clearChats());
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    return watchAlerts(user._id || user.id, dispatch);
  }, [user?.id, dispatch]);
};

export const useRootSetup = () => {
  const banner = useMessageBanner();

  useAppInit();
  useSystemAppearance();
  useSocketMessages(banner.showBanner);
  useSocketNotifications();
  useNotificationTap();

  return banner;
};

export const useSystemAppearance = () => {
  const { mode, resolved } = useThemeMode();
  const Colors = useThemeColors();

  useEffect(() => {
    if (Platform.OS !== 'web') Appearance.setColorScheme(mode);
  }, [mode]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Colors.background);
    if (Platform.OS === 'android') NavigationBar.setStyle(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, Colors.background]);
};

export const useEulaConsent = () => {
  const [showEula, setShowEula] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(EULA_ACCEPTED_KEY).then((value) => {
      if (!value) setShowEula(true);
    });
  }, []);

  const acceptEula = useCallback(() => {
    AsyncStorage.setItem(EULA_ACCEPTED_KEY, '1');
    setShowEula(false);
  }, []);

  return { showEula, acceptEula };
};
