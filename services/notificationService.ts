import { Platform, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePushToken } from '../api/core/auth.actions';
import { isSoundEnabled } from './soundService';

const PUSH_TOKEN_CACHE_KEY = 'karaadi_push_token_v1';

async function syncPushToken(token: string): Promise<void> {
  try {
    const cached = await AsyncStorage.getItem(PUSH_TOKEN_CACHE_KEY);
    if (cached === token) return;
    await updatePushToken(token);
    await AsyncStorage.setItem(PUSH_TOKEN_CACHE_KEY, token);
  } catch {}
}

let Notifications: typeof import('expo-notifications') | null = null;
try {
  Notifications = require('expo-notifications');
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: isSoundEnabled(),
      shouldSetBadge: true,
    }),
  });
} catch {}

async function setupAndroidChannels() {
  if (Platform.OS !== 'android' || !Notifications) return;
  try {
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#2563EB',
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
  data?: Record<string, any>,
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
