import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Alert, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForgotPassword } from '../../src/hooks/useForgotPassword';
import { Colors } from '../../src/constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { email, setEmail, isLoading, error, handleSubmit } = useForgotPassword();

  async function onPress() {
    const result = await handleSubmit();
    if (!result.success) {
      const msg = result.message === 'invalid_email'
        ? t('auth.forgotPassword.invalidEmail')
        : (result.message || t('auth.forgotPassword.errorMessage'));
      Alert.alert(t('auth.common.error'), msg);
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
          <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.forgotPassword.subtitle')}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.forgotPassword.email')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
              placeholderTextColor={Colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoFocus
            />
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={onPress}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>
              {isLoading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendButton')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>{t('auth.forgotPassword.backToLogin')}</Text>
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
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 15, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border,
  },
  errorBox: {
    backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5',
    borderRadius: 10, padding: 12, marginBottom: 12,
  },
  errorText: { color: '#DC2626', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 15,
    alignItems: 'center', marginBottom: 12,
  },
  btnDisabled: { opacity: 0.65 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  backBtn: { alignItems: 'center', paddingVertical: 10 },
  backText: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
});
