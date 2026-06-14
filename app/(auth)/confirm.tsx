import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Alert, ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '../../hooks/useConfirm';
import { useResponsive } from '../../hooks/useResponsive';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/auth/confirm.styles';

export default function ConfirmScreen() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const {
    code, setCode,
    isConfirmLoading, isResendLoading,
    error, resendError,
    handleConfirm, handleResendCode,
  } = useConfirm(email ?? '');
  const { isTablet, isMobileLandscape } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  async function onConfirm() {
    if (!code.trim()) {
      Alert.alert(t('auth.common.error'), t('auth.confirm.enterCode'));
      return;
    }
    const result = await handleConfirm();
    if (result.success) {
      Alert.alert(t('auth.common.success'), t('auth.confirm.successMessage'));
    }
  }

  async function onResend() {
    const result = await handleResendCode();
    if (result.success) {
      Alert.alert(t('auth.common.success'), t('auth.confirm.resendSuccess'));
    } else {
      Alert.alert(t('auth.common.error'), t('auth.confirm.resendError'));
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <ScrollView
        contentContainerStyle={[styles.scroll, isMobileLandscape && styles.scrollLandscape]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={styles.title}>{t('auth.confirm.title')}</Text>
          <Text style={styles.subtitle}>
            {t('auth.confirm.subtitle')}{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.confirm.email')}</Text>
            <TextInput
              style={[styles.input, styles.inputReadonly]}
              value={email}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.confirm.codeLabel')}</Text>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              placeholder={t('auth.confirm.codePlaceholder')}
              placeholderTextColor={Colors.placeholder}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
              autoFocus
            />
          </View>

          {(error || resendError) && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error || resendError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.btn, isConfirmLoading && styles.btnDisabled]}
            onPress={onConfirm}
            disabled={isConfirmLoading}
          >
            <Text style={styles.btnText}>
              {isConfirmLoading ? t('auth.confirm.confirming') : t('auth.confirm.confirmButton')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendBtn} onPress={onResend} disabled={isResendLoading}>
            <Text style={styles.resendText}>
              {isResendLoading ? t('auth.confirm.resending') : t('auth.confirm.resendCode')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
