import { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  ScrollView, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { placeholderAvatar } from '../../constants';
import { updateUsername, updatePhone, updateProfileImage, deleteAccount } from '../../api/core/auth.actions';
import { useAuthStore } from '../../store/authStore';
import { getImageUrl } from '../../util/helpers';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/profile/edit.styles';
import { useTranslation } from 'react-i18next';

const AVATAR = placeholderAvatar(100, '2563eb', 'Me');
const DELETE_CONFIRM_TEXT = 'delete account';

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [uploading, setUploading] = useState(false);

  const [username, setUsername] = useState(user?.username || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('mine.editProfile.permissionNeeded'), t('mine.editProfile.grantPhotoAccess'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as const,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploading(true);
    try {
      const asset = result.assets[0];
      const mime = asset.mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
      const ext = mime === 'image/png' ? 'png' : 'jpg';
      const formData = new FormData();
      formData.append('image', { uri: asset.uri, type: mime, name: `profile.${ext}` } as any);
      const updated = await updateProfileImage(formData);
      if (user) await setUser({ ...user, ...updated }, user.token);
      Alert.alert(t('success'), t('mine.editProfile.photoUpdated'));
    } catch {
      Alert.alert(t('error'), t('mine.editProfile.photoUpdateFailed'));
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveUsername() {
    if (!username.trim()) { Alert.alert(t('error'), t('mine.editProfile.usernameEmpty')); return; }
    setSavingUsername(true);
    try {
      const updated = await updateUsername(username.trim());
      if (user) await setUser({ ...user, ...updated }, user.token);
      Alert.alert(t('success'), t('mine.editProfile.usernameUpdated'));
    } catch (err: any) {
      Alert.alert(t('error'), err?.response?.data?.message || t('mine.editProfile.usernameUpdateFailed'));
    } finally {
      setSavingUsername(false);
    }
  }

  async function handleSavePhone() {
    if (!phone.trim()) { Alert.alert(t('error'), t('mine.editProfile.phoneEmpty')); return; }
    setSavingPhone(true);
    try {
      const updated = await updatePhone(phone.trim());
      if (user) await setUser({ ...user, ...updated }, user.token);
      Alert.alert(t('success'), t('mine.editProfile.phoneUpdated'));
    } catch (err: any) {
      Alert.alert(t('error'), err?.response?.data?.message || t('mine.editProfile.phoneUpdateFailed'));
    } finally {
      setSavingPhone(false);
    }
  }

  function handleDeleteAccount() {
    Alert.alert(
      t('mine.editProfile.deleteConfirmTitle'),
      t('mine.editProfile.deleteConfirmMessage', { email: user?.email }),
      [
        { text: t('mine.editProfile.stay'), style: 'cancel' },
        {
          text: t('mine.editProfile.yesDeleteEverything'),
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteAccount();
              await clearAuth();
              router.replace('/(auth)/login');
            } catch {
              Alert.alert(t('error'), t('mine.settingsPage.couldNotDelete'));
              setDeleting(false);
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <View style={styles.avatarSection}>
          <Image
            source={{ uri: getImageUrl(user?.profileImage) || AVATAR }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editPhotoBtn} onPress={handlePickPhoto} disabled={uploading}>
            {uploading
              ? <ActivityIndicator size="small" color={Colors.white} />
              : <MaterialCommunityIcons name="camera" size={18} color={Colors.white} />}
          </TouchableOpacity>
          <Text style={styles.avatarHint}>{t('mine.editProfile.tapToChangePhoto')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t('email')}</Text>
          <Text style={styles.staticValue}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t('username')}</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder={t('mine.editProfile.usernamePlaceholder')}
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.saveBtn, savingUsername && styles.disabled]}
            onPress={handleSaveUsername}
            disabled={savingUsername}
          >
            {savingUsername
              ? <ActivityIndicator size="small" color={Colors.white} />
              : <Text style={styles.saveBtnText}>{t('mine.editProfile.saveUsername')}</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t('mine.editProfile.phoneNumberLabel')}</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={(v) => setPhone(v.replace(/[^0-9+\-()\s]/g, ''))}
            placeholder={t('phonePlaceholder')}
            placeholderTextColor={Colors.placeholder}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            style={[styles.saveBtn, savingPhone && styles.disabled]}
            onPress={handleSavePhone}
            disabled={savingPhone}
          >
            {savingPhone
              ? <ActivityIndicator size="small" color={Colors.white} />
              : <Text style={styles.saveBtnText}>{t('mine.editProfile.savePhone')}</Text>}
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.dangerCard]}>
          <View style={styles.dangerHeader}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={Colors.error} />
            <Text style={styles.dangerTitle}>{t('mine.settingsPage.dangerZone')}</Text>
          </View>
          <Text style={styles.dangerWarning}>{t('mine.editProfile.deleteWarning')}</Text>
          <TextInput
            style={styles.input}
            value={deleteConfirmText}
            onChangeText={setDeleteConfirmText}
            placeholder={t('mine.editProfile.deleteConfirmPlaceholder')}
            placeholderTextColor={Colors.placeholder}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[
              styles.deleteBtn,
              (deleteConfirmText.trim().toLowerCase() !== DELETE_CONFIRM_TEXT || deleting) && styles.disabled,
            ]}
            onPress={handleDeleteAccount}
            disabled={deleteConfirmText.trim().toLowerCase() !== DELETE_CONFIRM_TEXT || deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color={Colors.error} />
            ) : (
              <>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color={Colors.error} />
                <Text style={styles.deleteBtnText}>{t('mine.settingsPage.deleteAccount')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
