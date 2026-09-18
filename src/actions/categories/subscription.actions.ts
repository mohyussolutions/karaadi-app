import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../client';
import { SUBSCRIPTION_ENDPOINTS } from '../../api/endpoints';
import {
  SUBSCRIPTION_MATCH_LIMIT,
  ALERTS_LAST_CHECKED_KEY,
  ALERTS_SEEN_IDS_KEY,
  ALERTS_SEEN_IDS_MAX,
  ALERTS_MIN_CHECK_INTERVAL_MS,
} from '../../constants/constants';
import { storeRef } from '../../store/internal/storeRef';
import { addNotification } from '../../components/features/notifications/store/notificationsSlice';
import { searchCategory } from '../search/globalSearch';
import { scheduleLocalNotification } from '../../components/features/notifications/services/notificationService';
import type { Subscription, SubscriptionPayload, SubscriptionEnvelope, Plan } from '../../util/types';
import type { RawItem } from '../../util/types/common.types';


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

async function loadSeenIds(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(ALERTS_SEEN_IDS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

async function saveSeenIds(seen: Set<string>): Promise<void> {
  const trimmed = Array.from(seen).slice(-ALERTS_SEEN_IDS_MAX);
  await AsyncStorage.setItem(ALERTS_SEEN_IDS_KEY, JSON.stringify(trimmed));
}

export async function checkAlertsForMatches(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(ALERTS_LAST_CHECKED_KEY);
    const lastChecked = raw
      ? new Date(raw)
      : new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (raw && Date.now() - lastChecked.getTime() < ALERTS_MIN_CHECK_INTERVAL_MS) return;

    const subs = await fetchMySubscriptions();
    if (!subs.length) return;

    const seen = await loadSeenIds();
    const startedAt = new Date();
    let totalMatches = 0;
    let failed = false;

    for (const sub of subs) {
      const params = {
        title: sub.title || undefined,
        region: sub.region || undefined,
        city: sub.cities?.[0] || undefined,
        minPrice: sub.priceMin || undefined,
        maxPrice: sub.priceMax || undefined,
        ...(sub.subCategory ? { category: sub.subCategory, categoryTag: sub.subCategory } : {}),
        limit: SUBSCRIPTION_MATCH_LIMIT,
      };

      let results;
      try {
        results = await searchCategory(sub.category, params);
      } catch {
        failed = true;
        continue;
      }

      const fresh = results.filter((r) => {
        const id = String(r._id || r.id || '');
        const created = r.createdAt ? new Date(r.createdAt) : null;
        return id && !seen.has(id) && created && created > lastChecked;
      });

      for (const item of fresh) {
        const id = String(item._id || item.id);
        seen.add(id);
        totalMatches += 1;
        const title = 'New match for your alert!';
        const body = `"${item.title}" was just posted`;
        const data = { type: 'alert_match', listingId: id, category: sub.category };
        storeRef.dispatch?.(
          addNotification({
            _id: `alert-${id}`,
            userId: String(sub.userId ?? ''),
            title,
            body,
            type: 'subscription_match',
            read: false,
            data,
            createdAt: new Date().toISOString(),
          }),
        );
        if (fresh.length === 1) await scheduleLocalNotification(title, `${body} — tap to view`, data);
      }
    }

    if (totalMatches > 1) {
      await scheduleLocalNotification(
        'New matches for your alerts!',
        `${totalMatches} new listings match your alerts — tap to see`,
        { type: 'alert_match' },
      );
    }

    await saveSeenIds(seen);
    if (!failed) await AsyncStorage.setItem(ALERTS_LAST_CHECKED_KEY, startedAt.toISOString());
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
