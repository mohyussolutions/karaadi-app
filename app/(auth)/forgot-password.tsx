import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { forgotPassword } from '../../src/api/auth';
import { Colors } from '../../src/constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) { Alert.alert('Error', 'Please enter your email.'); return; }
    setLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      router.push({ pathname: '/(auth)/reset-password', params: { email: email.trim().toLowerCase() } });
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Could not send reset code. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot password?</Text>
      <Text style={styles.subtitle}>Enter your email and we'll send you a reset code.</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor={Colors.placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <TouchableOpacity style={[styles.btn, loading && styles.disabledBtn]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Sending...' : 'Send Reset Code'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 24, paddingTop: 32 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 28, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 13, fontSize: 15, color: Colors.text, borderWidth: 1,
    borderColor: Colors.border, marginBottom: 20,
  },
  btn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  disabledBtn: { opacity: 0.65 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
