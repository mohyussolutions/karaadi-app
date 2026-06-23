import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Alert, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRegister, PASSWORD_RULES } from '../../hooks/useRegister';
import { useResponsive } from '../../hooks/useResponsive';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/auth/register.styles';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isLoading, errorMessage,
    ruleResults, isPasswordValid, showRules,
    handleSubmit,
  } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const { isTablet, isMobileLandscape } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

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
        contentContainerStyle={[styles.scroll, isMobileLandscape && styles.scrollLandscape]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, isTablet && styles.cardTablet]}>
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
                <Feather
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

          <Text style={styles.termsNote}>
            By creating an account you agree to our{' '}
            <Text style={styles.termsLink} onPress={() => Linking.openURL('https://karaadi.com/terms')}>
              Terms of Service
            </Text>
            {' '}and{' '}
            <Text style={styles.termsLink} onPress={() => Linking.openURL('https://karaadi.com/privacy')}>
              Privacy Policy
            </Text>
            , including our zero-tolerance policy for objectionable content and abusive users.
          </Text>

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
