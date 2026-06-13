import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Alert, ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useResetPassword } from '../../hooks/useResetPassword';
import { useResponsive } from '../../hooks/useResponsive';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../utils/styles/auth/reset-password.styles';

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const {
    code, setCode,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading, isResendLoading, error,
    handleReset, handleResendCode,
  } = useResetPassword(email ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isTablet, isMobileLandscape } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  async function onReset() {
    const result = await handleReset();
    if (!result.success) {
      const msg = result.key
        ? t(`auth.resetPassword.${result.key}`)
        : (error || t('auth.resetPassword.errorMessage'));
      Alert.alert(t('auth.common.error'), msg);
    } else {
      Alert.alert(t('auth.common.success'), t('auth.resetPassword.successMessage'));
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
          <Text style={styles.title}>{t('auth.resetPassword.title')}</Text>
          <Text style={styles.subtitle}>
            {t('auth.resetPassword.subtitle')}{' '}
            <Text style={styles.emailHighlight}>{email}</Text>
            {' '}{t('auth.resetPassword.andNewPassword')}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.resetPassword.resetCodeLabel')}</Text>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              placeholder={t('auth.resetPassword.codePlaceholder')}
              placeholderTextColor={Colors.placeholder}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.resetPassword.newPasswordLabel')}</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
                placeholderTextColor={Colors.placeholder}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.resetPassword.confirmPasswordLabel')}</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
                placeholderTextColor={Colors.placeholder}
                secureTextEntry={!showConfirm}
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm((v) => !v)}>
                <MaterialCommunityIcons
                  name={showConfirm ? 'eye-off' : 'eye'}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={onReset}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>
              {isLoading ? t('auth.resetPassword.resetting') : t('auth.resetPassword.resetButton')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendBtn} onPress={onResend} disabled={isResendLoading}>
            <Text style={styles.resendText}>
              {isResendLoading ? t('auth.resetPassword.resending') : t('auth.resetPassword.resendCode')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
