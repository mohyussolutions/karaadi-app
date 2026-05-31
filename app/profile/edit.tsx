import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../src/api/client';
import { AUTH_ENDPOINTS, UPLOAD_ENDPOINTS } from '../../src/api/urls';
import { useAuthStore } from '../../src/store/authStore';
import { Colors } from '../../src/constants/colors';

const AVATAR = 'https://placehold.co/100x100/2563eb/ffffff?text=Me';

export default function EditProfileScreen() {
  const { user, setUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Grant photo access to update your profile picture.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploading(true);
    try {
      const uri = result.assets[0].uri;
      const form = new FormData();
      form.append('image', { uri, name: 'profile.jpg', type: 'image/jpeg' } as any);
      const { data } = await apiClient.put(AUTH_ENDPOINTS.UPDATE_PROFILE_IMAGE, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = data?.profileImage || data?.url;
      if (imageUrl && user) {
        await setUser({ ...user, profileImage: imageUrl }, user.token);
        Alert.alert('Success', 'Profile photo updated.');
      }
    } catch {
      Alert.alert('Error', 'Failed to update profile photo.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <Image source={{ uri: user?.profileImage || AVATAR }} style={styles.avatar} />
          <TouchableOpacity style={styles.editPhotoBtn} onPress={handlePickPhoto} disabled={uploading}>
            <MaterialCommunityIcons name="camera" size={18} color={Colors.white} />
          </TouchableOpacity>
          {uploading && <Text style={styles.uploading}>Uploading...</Text>}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>{user?.username}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user?.phone || 'Not set'}</Text>
          </View>
        </View>

        <Text style={styles.note}>
          To change your username or phone, go to{' '}
          <Text style={{ color: Colors.primary }}>Settings</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 24, alignItems: 'center' },
  avatarSection: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.border, marginBottom: 4 },
  editPhotoBtn: {
    position: 'absolute', bottom: 8, right: -2,
    backgroundColor: Colors.primary, borderRadius: 15, padding: 6,
    borderWidth: 2, borderColor: Colors.white,
  },
  uploading: { fontSize: 12, color: Colors.textSecondary, marginTop: 6 },
  infoCard: {
    backgroundColor: Colors.white, borderRadius: 12, width: '100%',
    padding: 4, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
  infoLabel: { fontSize: 14, color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 14 },
  note: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
