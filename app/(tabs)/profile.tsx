import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { getImageUrl } from '../../utils/helpers';
import { placeholderAvatar } from '../../constants';
import type { MenuItem } from '../../utils/types';
import { createStyles } from '../../utils/styles/tabs/profile.styles';

const AVATAR = placeholderAvatar(80, '2563eb', 'Me');

const MENU_ITEMS: MenuItem[] = [
  { icon: 'bullhorn-outline',        labelKey: 'mine.account.myAds',          descKey: 'descriptions.myAdsDesc',          route: '/profile/my-ads' },
  { icon: 'account-outline',         labelKey: 'mine.account.myAccount',      descKey: 'descriptions.myAccountDesc',      route: '/profile/edit' },
  { icon: 'cog-outline',             labelKey: 'mine.account.settings',       descKey: 'descriptions.settingsDesc',       route: '/profile/settings' },
  { icon: 'heart-outline',           labelKey: 'mine.account.favorites',      descKey: 'descriptions.favoritesDesc',      route: '/profile/favorites' },
  { icon: 'magnify',                 labelKey: 'mine.account.savedSearches',  descKey: 'descriptions.savedSearchesDesc',  route: '/profile/saved-searches' },
  { icon: 'office-building-outline', labelKey: 'mine.account.forBusinesses',  descKey: 'descriptions.forBusinessesDesc',  route: '/profile/businesses' },
  { icon: 'history',                 labelKey: 'mine.account.contactHistory', descKey: 'descriptions.contactHistoryDesc', route: '/profile/contact-history' },
  { icon: 'crown-outline',           labelKey: 'mine.account.mySubscriptions',descKey: 'descriptions.mySubscriptionsDesc',route: '/profile/subscription' },
  { icon: 'shield-star-outline',     labelKey: 'mine.account.badge',          descKey: 'descriptions.badgeDesc',          route: '/profile/badge' },
];

function MenuCard({ item }: { item: MenuItem }) {
  const router = useRouter();
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(item.route as any)} activeOpacity={0.85}>
      <View style={styles.cardIconBg}>
        <MaterialCommunityIcons name={item.icon as any} size={20} color={Colors.primary} />
      </View>
      <Text style={styles.cardLabel}>{t(item.labelKey)}</Text>
      {!!item.descKey && <Text style={styles.cardDesc} numberOfLines={2}>{t(item.descKey)}</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isTablet } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  function handleLogout() {
    Alert.alert(t('mine.profile.signOut'), t('mine.profile.signOutConfirm'), [
      { text: t('mine.businesses.cancel'), style: 'cancel' },
      {
        text: t('mine.profile.signOut'), style: 'destructive',
        onPress: async () => { await logout(); router.replace('/(auth)/login'); },
      },
    ]);
  }

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={isTablet && styles.tabletInner}>
        <View style={styles.profileCard}>
          <Image source={{ uri: getImageUrl(user.profileImage) || AVATAR }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.phone && <Text style={styles.phone}>{user.phone}</Text>}
        </View>

        <View style={styles.menuGrid}>
          {MENU_ITEMS.map((item) => <MenuCard key={item.route} item={item} />)}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>{t('mine.profile.signOut')}</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
