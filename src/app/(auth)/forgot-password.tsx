import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Alert, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useForgotPassword } from '../../hooks/auth/useAuth';
import { useResponsive } from '../../hooks/app/useResponsive';
import { useThemeColors, useThemedStyles } from '../../hooks/app/useTheme';
import { createStyles } from '../../utils/styles/auth/forgotPassword.styles';
import { EMAIL_MAX_LENGTH } from '../../actions/constants';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { email, setEmail, isLoading, error, handleSubmit } = useForgotPassword();
  const { isTablet, isMobileLandscape } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

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
      <ScrollView overScrollMode="never"
        contentContainerStyle={[styles.scroll, isMobileLandscape && styles.scrollLandscape]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, isTablet && styles.cardTablet]}>
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
              maxLength={EMAIL_MAX_LENGTH}
              autoCorrect={false}
              textContentType="emailAddress"
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
