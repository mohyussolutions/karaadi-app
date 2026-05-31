import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';
import { Colors } from '../../src/constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({ username: username.trim(), email: email.trim().toLowerCase(), password, phone: phone.trim() || undefined });
      router.push({ pathname: '/(auth)/confirm', params: { email: email.trim().toLowerCase() } });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join Karaadi marketplace</Text>

        <View style={styles.form}>
          {[
            { label: 'Username *', value: username, onChange: setUsername, placeholder: 'yourname', autoComplete: 'username' },
            { label: 'Email *', value: email, onChange: setEmail, placeholder: 'you@example.com', keyboardType: 'email-address', autoComplete: 'email', autoCapitalize: 'none' },
            { label: 'Phone (optional)', value: phone, onChange: setPhone, placeholder: '+252...', keyboardType: 'phone-pad' },
          ].map(({ label, value, onChange, placeholder, ...rest }) => (
            <View key={label} style={styles.inputGroup}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                placeholderTextColor={Colors.placeholder}
                {...(rest as any)}
              />
            </View>
          ))}

          {[
            { label: 'Password *', value: password, onChange: setPassword, placeholder: 'Min. 6 characters' },
            { label: 'Confirm Password *', value: confirm, onChange: setConfirm, placeholder: 'Repeat password' },
          ].map(({ label, value, onChange, placeholder }) => (
            <View key={label} style={styles.inputGroup}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
                  value={value}
                  onChangeText={onChange}
                  placeholder={placeholder}
                  placeholderTextColor={Colors.placeholder}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
                  <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.btn, loading && styles.disabledBtn]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flexGrow: 1, padding: 24 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.text, marginBottom: 4, marginTop: 8 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 28 },
  form: { gap: 4 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 13, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBg,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border, paddingRight: 12,
  },
  eyeBtn: { padding: 4 },
  btn: {
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 8, marginBottom: 20,
  },
  disabledBtn: { opacity: 0.65 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: Colors.textSecondary, fontSize: 14 },
  loginLink: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
});
