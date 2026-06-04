import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRegister, PASSWORD_RULES } from '../../src/hooks/useRegister';
import { Colors } from '../../src/constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    username, setUsername,
    email, setEmail,
    phone, setPhone,
    password, setPassword,
    isLoading, errorMessage,
    ruleResults, isPasswordValid, showRules,
    handleSubmit,
  } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  async function onPress() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t('auth.common.error'), t('auth.register.fillAll'));
      return;
    }
    if (!isPasswordValid) {
      Alert.alert(t('auth.common.error'), t('auth.register.passwordInvalid'));
      return;
    }
    await handleSubmit();
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{t('auth.register.title')}</Text>
          <Text style={styles.subtitle}>{t('auth.register.subtitle')}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.register.username')}</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder={t('auth.register.usernamePlaceholder')}
              placeholderTextColor={Colors.placeholder}
              autoComplete="username"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.register.email')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.register.emailPlaceholder')}
              placeholderTextColor={Colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.register.phone')}</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(v) => setPhone(v.replace(/[^0-9+\-()\s]/g, ''))}
              placeholder={t('auth.register.phonePlaceholder')}
              placeholderTextColor={Colors.placeholder}
              keyboardType="phone-pad"
              autoComplete="tel"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.register.password')}</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.register.createPasswordPlaceholder')}
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

            {showRules && (
              <View style={styles.rulesGrid}>
                {ruleResults.map((r) => (
                  <View key={r.id} style={styles.ruleRow}>
                    <MaterialCommunityIcons
                      name={r.passes ? 'check-circle' : 'close-circle'}
                      size={14}
                      color={r.passes ? Colors.success : Colors.error}
                    />
                    <Text style={[styles.ruleText, r.passes ? styles.rulePass : styles.ruleFail]}>
                      {t(r.labelKey)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {errorMessage || t('auth.register.errorMessage')}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.btn, (!isPasswordValid || isLoading) && styles.btnDisabled]}
            onPress={onPress}
            disabled={!isPasswordValid || isLoading}
          >
            <Text style={styles.btnText}>
              {isLoading ? t('auth.register.registering') : t('auth.register.registerButton')}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>{t('auth.register.alreadyAccount')} </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.loginLink}>{t('auth.register.signIn')}</Text>
            </TouchableOpacity>
          </View>
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
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', marginBottom: 28 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingRight: 12,
  },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: Colors.textPrimary },
  eyeBtn: { padding: 4 },
  rulesGrid: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, width: '47%' },
  ruleText: { fontSize: 12 },
  rulePass: { color: Colors.success },
  ruleFail: { color: Colors.textMuted },
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
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
});
