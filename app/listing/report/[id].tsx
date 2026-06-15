import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useAuthStore } from '../../../store/authStore';
import { apiClient } from '../../../api/client';
import { REPORT_ENDPOINTS } from '../../../constants';
import { createStyles } from '../../../util/styles/listing/report.styles';

const REASON_OPTIONS = [
  { value: 'scam', labelKey: 'report.reasonScam' },
  { value: 'sold', labelKey: 'report.reasonSold' },
  { value: 'misleading', labelKey: 'report.reasonMisleading' },
  { value: 'prohibited', labelKey: 'report.reasonProhibited' },
  { value: 'offensive', labelKey: 'report.reasonOffensive' },
  { value: 'other', labelKey: 'report.reasonOther' },
] as const;

export default function ReportScreen() {
  const { id, itemType } = useLocalSearchParams<{ id: string; itemType?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) router.replace('/(auth)/login');
  }, [user]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => router.back(), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  if (!user) return null;

  async function handleSubmit() {
    if (!user?.id || !id) { setError(t('report.errorNoUser')); return; }
    if (!reason) { setError(t('report.errorNoReason')); return; }

    setSubmitting(true);
    setError('');
    try {
      await apiClient.post(REPORT_ENDPOINTS.CREATE, {
        userId: user.id,
        itemId: id,
        itemType: itemType || 'MARKETPLACE',
        reason,
        description: details,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || t('report.errorFailed'));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.successWrap}>
          <View style={styles.successIconWrap}>
            <MaterialCommunityIcons name="check" size={40} color={Colors.success} />
          </View>
          <Text style={styles.successHeading}>{t('report.successHeading')}</Text>
          <Text style={styles.successBody}>{t('report.successBody')}</Text>
          <Text style={styles.successHint}>{t('report.redirecting')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('report.heading')}</Text>
          </View>

          <Text style={styles.intro}>
            {user.username ? `${user.username}, ` : ''}{t('report.intro')}
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>{t('report.reasonLabel')}</Text>
          <View style={styles.reasonList}>
            {REASON_OPTIONS.map((opt) => {
              const active = reason === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.reasonRow, active && styles.reasonRowActive]}
                  onPress={() => setReason(opt.value)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.reasonText}>{t(opt.labelKey)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>{t('report.detailsLabel')}</Text>
          <TextInput
            style={styles.textarea}
            value={details}
            onChangeText={setDetails}
            placeholder={t('report.detailsPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={6}
          />

          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            <Text style={styles.submitText}>
              {submitting ? t('report.submitting') : t('report.submit')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
