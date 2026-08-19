import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTranslation } from '../../../components/hooks/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../../components/hooks/useTheme';
import { useAuthStore } from '../../../store/authStore';
import { createTicket } from '../../../actions/core/support.actions';
import { createDetailStyles } from '../../../util/styles/profile/aboutKaraadi.styles';
import { maxLenSchema } from '../../../util/validation/schemas';

export default function ContactScreen() {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createDetailStyles);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthStore();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }
    if (!subject.trim() || !message.trim()) {
      Alert.alert(t('auth.common.error'), t('auth.register.fillAll'));
      return;
    }
    if (!maxLenSchema(150).safeParse(subject).success) {
      Alert.alert(t('auth.common.error'), t('supportModule.form.subjectTooLong'));
      return;
    }
    if (!maxLenSchema(3000).safeParse(message).success) {
      Alert.alert(t('auth.common.error'), t('supportModule.form.bodyTooLong'));
      return;
    }
    setSubmitting(true);
    try {
      await createTicket({
        senderName: user.username || '',
        senderEmail: user.email || '',
        subject: subject.trim(),
        body: message.trim(),
      });
      setSubject('');
      setMessage('');
      router.push('/profile/contact-history');
    } catch {
      Alert.alert(
        t('auth.common.error'),
        t('supportModule.form.submitError'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 84 }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerBody}>
            <Text style={styles.title}>{t('supportModule.title')}</Text>
            <Text style={styles.lead}>{t('supportModule.subtitle')}</Text>
          </View>
          {user ? (
            <TouchableOpacity
              style={styles.historyButton}
              activeOpacity={0.85}
              onPress={() => router.push('/profile/contact-history')}
            >
              <MaterialCommunityIcons name="history" size={16} color={Colors.primary} />
              <Text style={styles.historyButtonText}>{t('supportModule.historyButton')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {!user ? (
          <>
            <Text style={styles.loginPrompt}>{t('supportModule.loginRequired')}</Text>
            <TouchableOpacity style={styles.loginButton} activeOpacity={0.85} onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginButtonText}>{t('auth.login.loginButton')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder={t('supportModule.form.subjectPlaceholder')}
              placeholderTextColor={Colors.textMuted}
              value={subject}
              onChangeText={setSubject}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder={t('supportModule.form.bodyPlaceholder')}
              placeholderTextColor={Colors.textMuted}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.submitButton, submitting ? styles.submitButtonDisabled : null]}
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.submitButtonText}>{t('supportModule.form.submitting')}</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>{t('supportModule.form.submit')}</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
