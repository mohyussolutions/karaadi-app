import { memo, useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { ConfirmModal } from '../../components/modals/ConfirmModal';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { getImageUrl } from '../../util/helpers';
import { placeholderAvatar } from '../../constants';
import { PROFILE_MENU_ITEMS } from '../../config/navigation/profileMenuItems';
import type { MenuItem } from '../../util/types';
import { createStyles } from '../../util/styles/tabs/profile.styles';

const AVATAR = placeholderAvatar(80, '2563eb', 'Me');

const MenuCard = memo(function MenuCard({ item, onPress }: { item: MenuItem; onPress: () => void }) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardIconBg}>
        <MaterialCommunityIcons name={item.icon as any} size={20} color={Colors.primary} />
      </View>
      <Text style={styles.cardLabel}>{t(item.labelKey)}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.text} style={styles.cardChevron} />
    </TouchableOpacity>
  );
});

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isTablet } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = useCallback(() => setShowLogoutModal(true), []);
  const confirmLogout = useCallback(async () => {
    await logout();
    router.replace('/(auth)/login');
  }, [logout, router]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={styles.header}><Text style={styles.headerTitle}>{t('profile')}</Text></View>
        <View style={styles.guestContainer}>
          <MaterialCommunityIcons name="account-circle-outline" size={80} color={Colors.textMuted} />
          <Text style={styles.guestTitle}>{t('mine.guest')}</Text>
          <Text style={styles.guestSub}>{t('signInToView')}</Text>
          <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.signInText}>{t('signIn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerText}>{t('createAccount')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={isTablet && styles.tabletInner}>
        <View style={styles.profileCard}>
          <Image source={{ uri: getImageUrl(user.profileImage) || AVATAR }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.phone && <Text style={styles.phone}>{user.phone}</Text>}
        </View>

        <View style={styles.menuGrid}>
          {PROFILE_MENU_ITEMS.map((item) => (
            <MenuCard key={item.route} item={item} onPress={() => router.push(item.route as any)} />
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>{t('mine.profile.signOut')}</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      <ConfirmModal
        visible={showLogoutModal}
        title={t('mine.profile.signOut')}
        message={t('mine.profile.signOutConfirm')}
        onDismiss={() => setShowLogoutModal(false)}
        actions={[
          { label: t('mine.businesses.cancel'), onPress: () => {} },
          { label: t('mine.profile.signOut'), onPress: confirmLogout, destructive: true },
        ]}
      />
    </SafeAreaView>
  );
}
