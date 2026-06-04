import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/hooks/useAuth';
import { Colors } from '../../src/constants/colors';

const AVATAR = 'https://placehold.co/80x80/2563eb/ffffff?text=Me';

interface MenuItem {
  icon: string;
  labelKey: string;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'view-list',            labelKey: 'mine.account.myAds',          route: '/profile/my-ads' },
  { icon: 'heart-outline',        labelKey: 'mine.account.favorites',      route: '/profile/favorites' },
  { icon: 'history',              labelKey: 'mine.account.savedSearches',  route: '/profile/saved-searches' },
  { icon: 'bell-outline',         labelKey: 'nav.notifications',           route: '/profile/notifications' },
  { icon: 'office-building-outline', labelKey: 'mine.account.forBusinesses', route: '/profile/businesses' },
  { icon: 'crown-outline',        labelKey: 'mine.account.mySubscriptions',route: '/profile/subscription' },
  { icon: 'account-edit-outline', labelKey: 'mine.profile.edit',           route: '/profile/edit' },
  { icon: 'cog-outline',          labelKey: 'mine.nav.settings',           route: '/profile/settings' },
];

function MenuRow({ item }: { item: MenuItem }) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.menuRow} onPress={() => router.push(item.route as any)}>
      <View style={styles.menuLeft}>
        <View style={[styles.menuIconBg, { backgroundColor: Colors.primary + '18' }]}>
          <MaterialCommunityIcons name={item.icon as any} size={20} color={Colors.primary} />
        </View>
        <Text style={styles.menuLabel}>{t(item.labelKey)}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive',
        onPress: async () => { await logout(); router.replace('/(auth)/login'); },
      },
    ]);
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
        <View style={styles.guestContainer}>
          <MaterialCommunityIcons name="account-circle-outline" size={80} color={Colors.textMuted} />
          <Text style={styles.guestTitle}>{t('mine.guest')}</Text>
          <Text style={styles.guestSub}>{t('signInToView')}</Text>
          <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image source={{ uri: user.profileImage || AVATAR }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.phone && <Text style={styles.phone}>{user.phone}</Text>}
        </View>

        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => <MenuRow key={item.route} item={item} />)}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  profileCard: {
    backgroundColor: Colors.white, alignItems: 'center', padding: 24,
    marginBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.border, marginBottom: 12 },
  username: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  email: { fontSize: 14, color: Colors.textSecondary },
  phone: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  menuSection: { backgroundColor: Colors.white, marginBottom: 8 },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconBg: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.white, paddingVertical: 15, gap: 8, marginBottom: 8,
  },
  logoutText: { color: Colors.error, fontSize: 15, fontWeight: '600' },
  guestContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  guestTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  guestSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  signInBtn: {
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14,
    paddingHorizontal: 48, marginTop: 8,
  },
  signInText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  registerBtn: {
    borderWidth: 2, borderColor: Colors.primary, borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 48,
  },
  registerText: { color: Colors.primary, fontWeight: '700', fontSize: 16 },
});
