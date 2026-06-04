import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../src/api/client';
import { SUBSCRIPTION_ENDPOINTS } from '../../src/constants/endpoints';
import { LoadingSpinner } from '../../src/components/shared';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  type: string;
}

export default function SubscriptionScreen() {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [myPlan, setMyPlan] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const [plansRes, myRes] = await Promise.allSettled([
          apiClient.get(SUBSCRIPTION_ENDPOINTS.PLANS),
          user ? apiClient.get(SUBSCRIPTION_ENDPOINTS.MY_SUBSCRIPTION) : Promise.reject(),
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

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={plans}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          myPlan ? (
            <View style={styles.currentPlan}>
              <MaterialCommunityIcons name="crown" size={20} color={Colors.premium} />
              <Text style={styles.currentPlanText}>
                Current plan: <Text style={{ fontWeight: '700' }}>{myPlan.planName || myPlan.type}</Text>
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{item.name}</Text>
              <Text style={styles.planPrice}>${item.price}<Text style={styles.planPer}>/{item.duration}d</Text></Text>
            </View>
            {item.features?.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color={Colors.success} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.subscribeBtn}
              onPress={() => Alert.alert('Subscribe', `Upgrade to ${item.name}? This will redirect to payment.`)}
            >
              <Text style={styles.subscribeBtnText}>Get {item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 12 },
  currentPlan: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.premium + '20', borderRadius: 10, padding: 12, marginBottom: 8,
  },
  currentPlanText: { fontSize: 14, color: Colors.text },
  planCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  planName: { fontSize: 18, fontWeight: '700', color: Colors.text },
  planPrice: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  planPer: { fontSize: 13, fontWeight: '400', color: Colors.textSecondary },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  featureText: { fontSize: 14, color: Colors.textSecondary },
  subscribeBtn: {
    backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', marginTop: 14,
  },
  subscribeBtnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
});
