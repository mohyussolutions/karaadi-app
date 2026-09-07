import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../client';
import { SUBSCRIPTION_ENDPOINTS } from '../../api/endpoints';
import { searchCategory } from '../search/globalSearch';
import { scheduleLocalNotification } from '../../components/features/notifications/services/notificationService';
import type { Subscription, SubscriptionPayload, Plan } from '../../util/types';
import type { RawItem } from '../../util/types/common.types';

const LAST_CHECKED_KEY = 'karaadi_alerts_last_checked_v1';
const MIN_CHECK_INTERVAL_MS = 5 * 60 * 1000;

type SubscriptionEnvelope = Subscription & { subscription?: Subscription; data?: Subscription };

export async function fetchSubscriptionPlans(): Promise<Plan[]> {
  try {
    const { data } = await apiClient.get<Plan[] | { plans?: Plan[] }>(SUBSCRIPTION_ENDPOINTS.PLANS);
    return Array.isArray(data) ? data : data?.plans ?? [];
  } catch {
    return [];
  }
}

export async function fetchMyPlan(): Promise<{ success?: boolean; subscriptions?: Subscription[] } | null> {
  try {
    const { data } = await apiClient.get<{ success?: boolean; subscriptions?: Subscription[] }>(SUBSCRIPTION_ENDPOINTS.MY);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function fetchMySubscriptions(): Promise<Subscription[]> {
  try {
    const { data } = await apiClient.get<{ subscriptions?: RawItem[]; data?: RawItem[] } | RawItem[]>(SUBSCRIPTION_ENDPOINTS.MY);
    const list = (Array.isArray(data) ? data : data?.subscriptions ?? data?.data) ?? [];
    return (Array.isArray(list) ? list : []).map((item) => ({
      ...item,
      id: item.id || item._id,
    })) as Subscription[];
  } catch {
    return [];
  }
}

export async function createSubscription(payload: SubscriptionPayload): Promise<Subscription | null> {
  try {
    const { data } = await apiClient.post<SubscriptionEnvelope>(SUBSCRIPTION_ENDPOINTS.SUBSCRIBE, payload);
    const item = data?.subscription ?? data?.data ?? data;
    return { ...item, id: item.id || item._id || '' };
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
        minPrice: sub.priceMin || undefined,
        maxPrice: sub.priceMax || undefined,
        ...(sub.subCategory ? { category: sub.subCategory, categoryTag: sub.subCategory } : {}),
        limit: 10,
      };

      const results = await searchCategory(sub.category, params);

      const fresh = results.filter((r) => {
        const created = r.createdAt ? new Date(r.createdAt) : null;
        return created && created > lastChecked;
      });

      if (fresh.length) {
        totalMatches += fresh.length;
        const first = fresh[0];
        if (first.title) matchTitles.push(first.title);

        if (fresh.length === 1) {
          await scheduleLocalNotification(
            'New match for your alert!',
            `"${first.title}" just posted — tap to view`,
            { type: 'alert_match', listingId: first._id || first.id, category: sub.category },
          );
        }
      }
    }

    if (totalMatches > 1) {
      await scheduleLocalNotification(
        'New matches for your alerts!',
        `${totalMatches} new listings match your alerts — tap to see`,
        { type: 'alert_match' },
      );
    }

    await AsyncStorage.setItem(LAST_CHECKED_KEY, new Date().toISOString());
  } catch {}
}

export async function getSubscriptionById(id: string, signal?: AbortSignal): Promise<SubscriptionEnvelope> {
  const { data } = await apiClient.get<SubscriptionEnvelope>(SUBSCRIPTION_ENDPOINTS.BY_ID(id), { signal });
  return data;
}

export async function fetchAllPaidSubscriptions(signal?: AbortSignal): Promise<Subscription[]> {
  try {
    const { data } = await apiClient.get<{ subscriptions?: RawItem[] } | RawItem[]>(SUBSCRIPTION_ENDPOINTS.ALL_PAID, { signal });
    const list = (Array.isArray(data) ? data : data?.subscriptions) ?? [];
    return list.map((item) => ({ ...item, id: item.id || item._id })) as Subscription[];
  } catch {
    return [];
  }
}
