import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Alert, ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '../../src/hooks/useConfirm';
import { Colors } from '../../src/constants/colors';

export default function ConfirmScreen() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const {
    code, setCode,
    isConfirmLoading, isResendLoading,
    error, resendError,
    handleConfirm, handleResendCode,
  } = useConfirm(email ?? '');

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
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingVertical: 40 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  emailHighlight: { color: Colors.primary, fontWeight: '600' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 15, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border,
  },
  inputReadonly: { color: Colors.textMuted },
  codeInput: {
    backgroundColor: Colors.inputBg, borderRadius: 12, paddingVertical: 16,
    fontSize: 28, fontWeight: '700', color: Colors.textPrimary,
    borderWidth: 2, borderColor: Colors.primary, letterSpacing: 10,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
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
