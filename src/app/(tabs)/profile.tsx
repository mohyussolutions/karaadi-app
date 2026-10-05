import { memo, useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
} from 'react-native';
import { ConfirmModal } from '../../components/modals/ConfirmModal/ConfirmModal';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { useThemeColors, useThemedStyles } from '../../hooks/app/useTheme';
import { useResponsive } from '../../hooks/app/useResponsive';
import { getImageUrl } from '../../lib/helpers';
import RemoteImage from '../../components/shared/RemoteImage/RemoteImage';
import { PROFILE_AVATAR, PROFILE_MENU_ITEMS, ROUTES } from '../../actions/constants';
import { createStyles } from '../../utils/styles/tabs/profileTab.styles';
import type { MenuCardProps } from "../../utils/types";
import { paddingBottomOf } from '../../utils/styles/common/dynamic.styles';


const MenuCard = memo(function MenuCard({ item, onPress }: MenuCardProps) {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardIconBg}>
        <MaterialCommunityIcons name={item.icon} size={20} color={Colors.primary} />
      </View>
      <Text style={styles.cardLabel}>{t(item.labelKey)}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.text} style={styles.cardChevron} />
    </TouchableOpacity>
  );
});

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const { isTablet } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = useCallback(() => setShowLogoutModal(true), []);
  const confirmLogout = useCallback(async () => {
    await logout();
    router.replace(ROUTES.login);
  }, [logout, router]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={styles.header}><Text style={styles.headerTitle}>{t('profile')}</Text></View>
        <View style={styles.guestContainer}>
          <MaterialCommunityIcons name="account-circle-outline" size={80} color={Colors.textMuted} />
          <Text style={styles.guestTitle}>{t('mine.guest')}</Text>
          <Text style={styles.guestSub}>{t('signInToView')}</Text>
          <TouchableOpacity style={styles.signInBtn} onPress={() => router.push(ROUTES.login)}>
            <Text style={styles.signInText}>{t('signIn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerBtn} onPress={() => router.push(ROUTES.register)}>
            <Text style={styles.registerText}>{t('createAccount')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false} contentContainerStyle={paddingBottomOf(120)}>
        <View style={isTablet && styles.tabletInner}>
        <View style={styles.profileCard}>
          <RemoteImage source={{ uri: getImageUrl(user.profileImage) || PROFILE_AVATAR }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.phone && <Text style={styles.phone}>{user.phone}</Text>}
        </View>

        <View style={styles.menuGrid}>
          {PROFILE_MENU_ITEMS.map((item) => (
            <MenuCard key={item.route} item={item} onPress={() => router.push(item.route as Href)} />
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
