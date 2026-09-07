import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/hooks/authStore';
import { fetchSubscriptionPlans, fetchMyPlan } from '../actions/categories/subscription.actions';
import type { Plan } from '../util/types';

export function useSubscriptionPlans() {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [myPlan, setMyPlan] = useState<unknown>(null);

  const hasUser = !!user;

  useEffect(() => {
    async function load() {
      const [plansData, myPlanData] = await Promise.all([
        fetchSubscriptionPlans(),
        hasUser ? fetchMyPlan() : Promise.resolve(null),
      ]);
      setPlans(plansData);
      setMyPlan(myPlanData);
      setLoading(false);
    }
    load();
  }, [hasUser]);

  return { user, plans, loading, myPlan };
}
