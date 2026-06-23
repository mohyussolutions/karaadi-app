import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { fetchSubscriptionPlans, fetchMyPlan } from '../api/categories/subscription.actions';
import type { Plan } from '../util/types';

export function useSubscriptionPlans() {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [myPlan, setMyPlan] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const [plansData, myPlanData] = await Promise.all([
        fetchSubscriptionPlans(),
        user ? fetchMyPlan() : Promise.resolve(null),
      ]);
      setPlans(plansData);
      setMyPlan(myPlanData);
      setLoading(false);
    }
    load();
  }, [user]);

  return { user, plans, loading, myPlan };
}
