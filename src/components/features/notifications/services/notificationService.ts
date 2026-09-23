import { AppState, Platform, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePushToken, removePushToken } from '../../../../actions/core/auth.actions';
import { isSoundEnabled } from './soundService';
import { COLORS } from '../../../../util/colors/colors';
import { PUSH_TOKEN_CACHE_KEY } from "../../../../constants";

async function syncPushToken(token: string): Promise<void> {
  try {
    const cached = await AsyncStorage.getItem(PUSH_TOKEN_CACHE_KEY);
    if (cached === token) return;
    await updatePushToken(token, Platform.OS);
    await AsyncStorage.setItem(PUSH_TOKEN_CACHE_KEY, token);
  } catch {}
}

let Notifications: typeof import('expo-notifications') | null = null;
try {
  Notifications = require('expo-notifications');
  Notifications!.setNotificationHandler({
    handleNotification: async (notification) => {
      const trigger = notification.request.trigger as { type?: string } | null;
      const suppress = trigger?.type === 'push' && AppState.currentState === 'active';
      return {
        shouldShowBanner: !suppress,
        shouldShowList: !suppress,
        shouldPlaySound: !suppress && isSoundEnabled(),
        shouldSetBadge: true,
      };
    },
  });
} catch {}

async function setupAndroidChannels() {
  if (Platform.OS !== 'android' || !Notifications) return;
  try {
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: COLORS.blue600,
      sound: 'default',
      enableVibrate: true,
    });
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  } catch {}
}

export async function unregisterPushToken(): Promise<void> {
  try {
    const cached = await AsyncStorage.getItem(PUSH_TOKEN_CACHE_KEY);
    if (!cached) return;
    await removePushToken(cached);
    await AsyncStorage.removeItem(PUSH_TOKEN_CACHE_KEY);
  } catch {}
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web' || !Notifications) return null;
  try {
    await setupAndroidChannels();

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return null;

    try {
      const Constants = require('expo-constants').default;
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined,
      );
      syncPushToken(tokenData.data);
      return tokenData.data;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  Vibration.vibrate(Platform.OS === 'android' ? [0, 250, 100, 250] : 400);

  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: isSoundEnabled() ? 'default' : undefined,
        ...(Platform.OS === 'android' && { channelId: 'messages' }),
      },
      trigger: null,
    });
  } catch {}
}
