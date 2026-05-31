import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { confirmAccount, resendCode } from '../../src/api/auth';
import { Colors } from '../../src/constants/colors';

export default function ConfirmScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleConfirm() {
    if (!code.trim()) { Alert.alert('Error', 'Please enter the confirmation code.'); return; }
    setLoading(true);
    try {
      await confirmAccount(email, code.trim());
      Alert.alert('Success', 'Account confirmed! Please sign in.', [
        { text: 'OK', onPress: () => router.replace({ pathname: '/(auth)/login', params: { email } }) },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      await resendCode(email);
      Alert.alert('Sent', 'A new code has been sent to your email.');
    } catch {
      Alert.alert('Error', 'Could not resend code. Try again.');
    } finally {
      setResending(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Confirm your account</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}<Text style={styles.email}>{email}</Text>
        </Text>

        <TextInput
          style={styles.codeInput}
          value={code}
          onChangeText={setCode}
          placeholder="000000"
          placeholderTextColor={Colors.placeholder}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />

        <TouchableOpacity style={[styles.btn, loading && styles.disabledBtn]} onPress={handleConfirm} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Confirming...' : 'Confirm Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendBtn}>
          <Text style={styles.resendText}>{resending ? 'Sending...' : "Didn't receive a code? Resend"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 32, lineHeight: 22 },
  email: { color: Colors.primary, fontWeight: '600' },
  codeInput: {
    backgroundColor: Colors.inputBg, borderRadius: 12, paddingVertical: 16, fontSize: 28,
    fontWeight: '700', color: Colors.text, borderWidth: 2, borderColor: Colors.primary,
    letterSpacing: 8, marginBottom: 24,
  },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginBottom: 16,
  },
  disabledBtn: { opacity: 0.65 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  resendBtn: { alignItems: 'center', padding: 8 },
  resendText: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
});
