import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/loading';
import { useThemeColors, useThemedStyles } from '../../components/hooks/useTheme';
import { useIdentification } from '../../components/hooks/useIdentification';
import { IdentityCaptureForm } from '../../components/features/identification/components/IdentityCaptureForm';
import { createStyles } from '../../util/styles/profile/verifyIdentity.styles';

export default function VerifyIdentityScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, status, loading, error, submitting, submit, reload } = useIdentification();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  const [resubmitting, setResubmitting] = useState(false);

  if (!user) {
    return (
      <View style={s.guestWrap}>
        <MaterialCommunityIcons name="shield-account-outline" size={64} color={Colors.gray300} />
        <Text style={s.guestTitle}>{t('mine.identification.guestTitle')}</Text>
        <Text style={s.guestSub}>{t('mine.identification.guestSub')}</Text>
        <TouchableOpacity style={s.signInBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={s.signInText}>{t('auth.login.loginButton')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !status) {
    return (
      <View style={s.guestWrap}>
        <MaterialCommunityIcons name="wifi-off" size={64} color={Colors.gray300} />
        <Text style={s.guestTitle}>{t('mine.favorites.loadError')}</Text>
        <TouchableOpacity style={s.retryBtn} onPress={() => reload()}>
          <Text style={s.signInText}>{t('mine.favorites.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleSubmit(idCardImage?: string, selfieImage?: string) {
    const ok = await submit(idCardImage, selfieImage);
    if (ok) {
      setResubmitting(false);
      Alert.alert(t('mine.identification.submittedTitle'), t('mine.identification.submittedSub'));
    }
    return ok;
  }

  const showForm = !status.submitted || resubmitting;

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={[s.banner, status.submitted ? s.bannerSubmitted : status.required ? s.bannerRequired : null]}>
          <MaterialCommunityIcons
            name={status.submitted ? 'check-decagram' : status.required ? 'alert-circle-outline' : 'shield-check-outline'}
            size={22}
            color={status.submitted ? Colors.success : status.required ? Colors.warning : Colors.textMuted}
          />
          <View style={s.flexFull}>
            <Text style={s.bannerTitle}>
              {status.submitted
                ? t('mine.identification.statusSubmitted')
                : status.required
                  ? t('mine.identification.statusRequired')
                  : t('mine.identification.statusOptional')}
            </Text>
            <Text style={s.bannerSub}>
              {status.submitted
                ? t('mine.identification.statusSubmittedSub')
                : status.required
                  ? t('mine.identification.statusRequiredSub')
                  : t('mine.identification.statusOptionalSub')}
            </Text>
          </View>
        </View>

        {status.submitted && !resubmitting && (
          <TouchableOpacity style={s.resubmitBtn} onPress={() => setResubmitting(true)}>
            <Text style={s.resubmitText}>{t('mine.identification.resubmit')}</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <IdentityCaptureForm
            submitting={submitting}
            idCardRequired={status.idCardRequired}
            selfieRequired={status.selfieRequired}
            onSubmit={handleSubmit}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
