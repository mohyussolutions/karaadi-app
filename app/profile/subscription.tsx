import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/loading';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles, createCurrentStyles } from '../../utils/styles/profile/profileSubscription.styles';
import { useSubscriptionPlans } from '../../hooks/useSubscriptionPlans';

function formatDate(iso: string | undefined): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { plans, loading, myPlan } = useSubscriptionPlans();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const currentStyles = useThemedStyles(createCurrentStyles);

  if (loading) return <LoadingSpinner fullScreen />;

  const planName = myPlan?.planName || myPlan?.name || myPlan?.type;
  const expiresAt = myPlan?.expiresAt || myPlan?.expiredAt || myPlan?.endDate;
  const isActive = myPlan?.isActive ?? (expiresAt ? new Date(expiresAt) > new Date() : !!myPlan);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={plans}
        keyExtractor={(item, index) => item._id || item.key || String(index)}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          myPlan ? (
            <View style={[currentStyles.card, isActive ? currentStyles.cardActive : currentStyles.cardInactive]}>
              <View style={currentStyles.row}>
                <MaterialCommunityIcons
                  name="crown"
                  size={22}
                  color={isActive ? Colors.premium : Colors.textMuted}
                />
                <View style={currentStyles.flexFull}>
                  <Text style={currentStyles.label}>{t('mine.subscriptions.currentPlan')}</Text>
                  <Text style={currentStyles.name}>{planName || t('mine.subscriptions.activePlan')}</Text>
                </View>
                <View style={[currentStyles.badge, isActive ? currentStyles.badgeActive : currentStyles.badgeInactive]}>
                  <Text style={[currentStyles.badgeText, isActive ? currentStyles.badgeTextActive : currentStyles.badgeTextInactive]}>
                    {isActive ? t('mine.subscriptions.status.active') : t('mine.subscriptions.status.expired')}
                  </Text>
                </View>
              </View>
              {!!expiresAt && (
                <View style={currentStyles.expiryRow}>
                  <MaterialCommunityIcons name="calendar-clock" size={13} color={Colors.textMuted} />
                  <Text style={currentStyles.expiryText}>
                    {t(isActive ? 'mine.subscriptions.expires' : 'mine.subscriptions.expired')} {formatDate(expiresAt)}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={currentStyles.noplan}>
              <MaterialCommunityIcons name="crown-outline" size={32} color={Colors.textMuted} />
              <Text style={currentStyles.noplanText}>{t('mine.subscriptions.noActivePlan')}</Text>
              <Text style={currentStyles.noplanSub}>{t('mine.subscriptions.choosePlanBelow')}</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{item.label}</Text>
              <Text style={styles.planPrice}>
                ${item.price}<Text style={styles.planPer}>/{item.days}d</Text>
              </Text>
            </View>
            {item.features?.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color={Colors.success} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.subscribeBtn}
              onPress={() => router.push('/(tabs)/new-ad')}
            >
              <Text style={styles.subscribeBtnText}>{t('plan.clickToSelect')} — {item.label}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
