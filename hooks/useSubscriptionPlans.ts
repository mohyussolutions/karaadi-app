import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { SUBSCRIPTION_ENDPOINTS } from '../constants';
import type { Plan } from '../util/types';

export function useSubscriptionPlans() {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [myPlan, setMyPlan] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const [plansRes, myRes] = await Promise.allSettled([
          apiClient.get(SUBSCRIPTION_ENDPOINTS.PLANS),
          user ? apiClient.get(SUBSCRIPTION_ENDPOINTS.MY) : Promise.reject(),
        ]);
        if (plansRes.status === 'fulfilled') {
          const data = plansRes.value.data;
          setPlans(Array.isArray(data) ? data : data?.plans || []);
        }
        if (myRes.status === 'fulfilled') setMyPlan(myRes.value.data);
      } catch {}
      setLoading(false);
    }
    load();
  }, [user]);

  return { user, plans, loading, myPlan };
}
