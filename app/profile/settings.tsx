import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { updateUsername, updatePhone, deleteAccount } from '../../src/api/auth';
import { useAuthStore } from '../../src/store/authStore';
import { Colors } from '../../src/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();
  const [username, setUsername] = useState(user?.username || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  async function handleSaveUsername() {
    if (!username.trim()) { Alert.alert('Error', 'Username cannot be empty.'); return; }
    setSaving(true);
    try {
      const updated = await updateUsername(username.trim());
      if (user) await setUser({ ...user, ...updated }, user.token);
      Alert.alert('Success', 'Username updated successfully.');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update username.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePhone() {
    if (!phone.trim()) { Alert.alert('Error', 'Phone cannot be empty.'); return; }
    setSaving(true);
    try {
      const updated = await updatePhone(phone.trim());
      if (user) await setUser({ ...user, ...updated }, user.token);
      Alert.alert('Success', 'Phone updated successfully.');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update phone.');
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'This action is permanent. All your data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              await clearAuth();
              router.replace('/(auth)/login');
            } catch {
              Alert.alert('Error', 'Could not delete account. Please try again.');
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Account Details</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.staticValue}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Your username"
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="none"
          />
          <TouchableOpacity style={[styles.saveBtn, saving && styles.disabled]} onPress={handleSaveUsername} disabled={saving}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Username'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+252..."
            placeholderTextColor={Colors.placeholder}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={[styles.saveBtn, saving && styles.disabled]} onPress={handleSavePhone} disabled={saving}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Phone'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Danger Zone</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteAccount}>
          <Text style={styles.deleteBtnText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  card: {
    backgroundColor: Colors.white, borderRadius: 12, padding: 16,
    marginBottom: 12, gap: 10,
  },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text },
  staticValue: { fontSize: 15, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 10, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 11, alignItems: 'center',
  },
  disabled: { opacity: 0.65 },
  saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  deleteBtn: {
    backgroundColor: Colors.error + '15', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.error + '40',
  },
  deleteBtnText: { color: Colors.error, fontWeight: '700', fontSize: 15 },
});
