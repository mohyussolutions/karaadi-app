import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../client';
import { SUBSCRIPTION_ENDPOINTS } from '../../constants';
import { searchCategory } from '../search';
import { scheduleLocalNotification } from '../../services/notificationService';
import type { Subscription, SubscriptionPayload } from '../../util/types';

const LAST_CHECKED_KEY = 'karaadi_alerts_last_checked_v1';
const MIN_CHECK_INTERVAL_MS = 5 * 60 * 1000;

export async function fetchMySubscriptions(): Promise<Subscription[]> {
  try {
    const { data } = await apiClient.get(SUBSCRIPTION_ENDPOINTS.MY);
    const list = data?.subscriptions ?? data?.data ?? data ?? [];
    return (Array.isArray(list) ? list : []).map((item: any) => ({
      ...item,
      id: item.id || item._id,
    }));
  } catch {
    return [];
  }
}

export async function createSubscription(payload: SubscriptionPayload): Promise<Subscription | null> {
  try {
    const { data } = await apiClient.post(SUBSCRIPTION_ENDPOINTS.SUBSCRIBE, payload);
    const item = data?.subscription ?? data?.data ?? data;
    return { ...item, id: item.id || item._id };
  } catch {
    return null;
  }
}

export async function deleteSubscription(id: string): Promise<void> {
  try {
    await apiClient.delete(SUBSCRIPTION_ENDPOINTS.BY_ID(id));
  } catch {}
}

export async function checkAlertsForMatches(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(LAST_CHECKED_KEY);
    const lastChecked = raw
      ? new Date(raw)
      : new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (raw && Date.now() - lastChecked.getTime() < MIN_CHECK_INTERVAL_MS) return;

    const subs = await fetchMySubscriptions();
    if (!subs.length) return;

    let totalMatches = 0;
    const matchTitles: string[] = [];

    for (const sub of subs) {
      const params = {
        title: sub.title || undefined,
        region: sub.region || undefined,
        city: sub.cities?.[0] || undefined,
        maxPrice: sub.priceMax || undefined,
        limit: 10,
      };

      const results = await searchCategory(sub.category, params);

      const fresh = results.filter((r) => {
        const created = (r as any).createdAt ? new Date((r as any).createdAt) : null;
        return created && created > lastChecked;
      });

      if (fresh.length) {
        totalMatches += fresh.length;
        if (fresh[0].title) matchTitles.push(fresh[0].title);
      }
    }

    if (totalMatches > 0) {
      const preview =
        matchTitles.length === 1
          ? `"${matchTitles[0]}"`
          : `${totalMatches} new listings`;
      await scheduleLocalNotification(
        'New matches for your alerts!',
        `${preview} just posted — tap to see`,
        { type: 'alert_match' },
      );
    }

    await AsyncStorage.setItem(LAST_CHECKED_KEY, new Date().toISOString());
  } catch {}
}
