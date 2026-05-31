import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { resetPassword } from '../../src/api/auth';
import { Colors } from '../../src/constants/colors';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!code.trim() || !password.trim()) { Alert.alert('Error', 'Please fill in all fields.'); return; }
    if (password !== confirm) { Alert.alert('Error', 'Passwords do not match.'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await resetPassword({ email, code: code.trim(), password });
      Alert.alert('Success', 'Password reset successfully!', [
        { text: 'Sign In', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Reset failed. Check your code and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>Enter the code sent to <Text style={{ color: Colors.primary }}>{email}</Text> and your new password.</Text>

        <Text style={styles.label}>Reset Code</Text>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="000000"
          placeholderTextColor={Colors.placeholder}
          keyboardType="number-pad"
          maxLength={6}
        />

        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 6 characters"
            placeholderTextColor={Colors.placeholder}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
            <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 14 }]}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Repeat new password"
          placeholderTextColor={Colors.placeholder}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity style={[styles.btn, loading && styles.disabledBtn]} onPress={handleReset} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 24, paddingTop: 32 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 28, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 13, fontSize: 15, color: Colors.text, borderWidth: 1,
    borderColor: Colors.border, marginBottom: 16,
  },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border, paddingRight: 12, marginBottom: 4,
  },
  eyeBtn: { padding: 4 },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 12,
  },
  disabledBtn: { opacity: 0.65 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
