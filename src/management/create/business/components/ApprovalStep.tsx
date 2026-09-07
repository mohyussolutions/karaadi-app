import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../hooks/useAppTranslation';
import { getMyBusinesses } from '../../../../actions/core/business.actions';
import type { MCIcon } from '../../../../util/icons/icons';
import type { BusinessApprovalStepProps } from '../../../../util/types/component.types';
import { createStyles } from '../../../../util/styles/business/businessCreate.styles';

const APPROVAL_POLL_INTERVAL_MS = 5000;

export function ApprovalStep({
  business,
  onApproved,
}: BusinessApprovalStepProps) {
  const router = useRouter();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();
  const [biz, setBiz] = useState(business);
  const [checking, setChecking] = useState(false);
  const id = biz._id || biz.id;

  const STATUS_META: Record<string, { icon: MCIcon; colorKey: 'primary' | 'success' | 'error'; title: string; message: string }> = useMemo(() => ({
    pending: {
      icon: 'clock-outline', colorKey: 'primary',
      title: t('mine.businesses.pendingTitle'),
      message: t('mine.businesses.pendingMessage'),
    },
    active: {
      icon: 'check-decagram', colorKey: 'success',
      title: t('mine.businesses.approvedTitle'),
      message: t('mine.businesses.approvedMessage'),
    },
    rejected: {
      icon: 'close-circle-outline', colorKey: 'error',
      title: t('mine.businesses.rejectedTitle'),
      message: t('mine.businesses.rejectedMessage'),
    },
  }), [t]);

  const poll = useCallback(async () => {
    setChecking(true);
    try {
      const list = await getMyBusinesses();
      const updated = list.find((b) => (b._id || b.id) === id) || list[0];
      if (updated) {
        setBiz(updated);
        if (updated.status === 'active' && updated.isVerified) {
          onApproved(updated);
        }
      }
    } catch {
    } finally {
      setChecking(false);
    }
  }, [id, onApproved]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, APPROVAL_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [poll]);

  const status: string = biz.status || 'pending';
  const meta = STATUS_META[status] || STATUS_META.pending;
  const color = Colors[meta.colorKey];

  return (
    <ScrollView contentContainerStyle={[s.statusScroll, { paddingBottom: insets.bottom + 84 }]} keyboardShouldPersistTaps="handled">
      <View style={[s.statusIconWrap, { backgroundColor: color + '18' }]}>
        <MaterialCommunityIcons name={meta.icon} size={56} color={color} />
      </View>
      <Text style={s.statusTitle}>{meta.title}</Text>
      <Text style={s.statusMessage}>{meta.message}</Text>

      <View style={s.statusCard}>
        <View style={s.statusRow}>
          <Text style={s.statusLabel}>{t('mine.businesses.businessLabel')}</Text>
          <Text style={s.statusValue}>{biz.name}</Text>
        </View>
        <View style={[s.statusRow, s.statusRowLast]}>
          <Text style={s.statusLabel}>{t('mine.businesses.statusLabel')}</Text>
          <View style={[s.statusBadge, { backgroundColor: color + '18' }]}>
            <Text style={[s.statusBadgeText, { color }]}>
              {t(`mine.businesses.${status}`, { defaultValue: status }).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {status === 'rejected' && (
        <TouchableOpacity style={s.submitBtn} onPress={() => router.replace('/profile/businesses')} activeOpacity={0.88}>
          <MaterialCommunityIcons name="pencil-outline" size={18} color={Colors.white} />
          <Text style={s.submitText}>{t('mine.businesses.goToMyBusinesses')}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={s.refreshBtn} onPress={poll} disabled={checking}>
        {checking ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <>
            <MaterialCommunityIcons name="refresh" size={16} color={Colors.primary} />
            <Text style={s.refreshText}>{t('mine.businesses.checkAgain')}</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
