import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Alert, ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useResetPassword } from '../../src/hooks/useResetPassword';
import { Colors } from '../../src/constants/colors';

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
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingVertical: 40 },
  card: {
    backgroundColor: Colors.white, borderRadius: 24, padding: 28,
    borderWidth: 1, borderColor: Colors.border,
    shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 6,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  emailHighlight: { color: Colors.primary, fontWeight: '600' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  codeInput: {
    backgroundColor: Colors.inputBg, borderRadius: 12, paddingVertical: 16,
    fontSize: 28, fontWeight: '700', color: Colors.textPrimary,
    borderWidth: 2, borderColor: Colors.primary, letterSpacing: 10,
  },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingRight: 12,
  },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: Colors.textPrimary },
  eyeBtn: { padding: 4 },
  errorBox: {
    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5',
    borderRadius: 10, padding: 12, marginBottom: 12,
  },
  errorText: { color: '#DC2626', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15,
    alignItems: 'center', marginTop: 4, marginBottom: 12,
  },
  btnDisabled: { opacity: 0.65 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  resendBtn: { alignItems: 'center', paddingVertical: 10 },
  resendText: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
});
