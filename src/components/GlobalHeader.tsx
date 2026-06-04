import React, { useState } from 'react';
import {
  View, Image, TouchableOpacity, Text, StyleSheet, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '../hooks/useAppTranslation';
import COLORS from '../constants/colors';
import type { Lang } from '../i18n/translations';

const AUTH_RE = /\/(login|register|confirm|forgot-password|reset-password)/;
const TAB_PATHS = new Set(['/', '/search', '/messages', '/profile', '/new-ad', '/businesses', '/notifications']);

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'so', label: 'Soomaali' },
];

export default function GlobalHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { t, lang, switchLanguage } = useAppTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const isAuth = AUTH_RE.test(pathname);
  const isTab = TAB_PATHS.has(pathname);
  const showBack = !isTab && !isAuth && router.canGoBack();

  if (isAuth) return null;

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} hitSlop={8}>
              <MaterialCommunityIcons name="chevron-left" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => router.push('/(tabs)')} activeOpacity={0.8}>
            <Image
              source={require('../../assets/logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setShowLangMenu(true)}
          accessibilityLabel="Change language"
        >
          <Text style={styles.langText}>{lang.toUpperCase()}</Text>
          <MaterialCommunityIcons name="chevron-down" size={12} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => router.push('/(tabs)/search')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="magnify" size={16} color={COLORS.textMuted} />
        <Text style={styles.searchPlaceholder}>{t('searchListings')}</Text>
      </TouchableOpacity>

      <Modal
        visible={showLangMenu}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => setShowLangMenu(false)}
      >
        <Pressable style={styles.langOverlay} onPress={() => setShowLangMenu(false)}>
          <View style={[styles.langDropdown, { top: insets.top + 56 }]}>
            {LANGS.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[styles.langOption, lang === l.code && styles.langOptionActive]}
                onPress={() => {
                  switchLanguage(l.code);
                  setShowLangMenu(false);
                }}
              >
                <Text style={[styles.langOptionText, lang === l.code && styles.langOptionTextActive]}>
                  {l.label}
                </Text>
                {lang === l.code && (
                  <MaterialCommunityIcons name="check" size={16} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtn: { marginRight: 2 },
  logo: { width: 110, height: 40 },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#06069C',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 44,
  },
  langText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchPlaceholder: { fontSize: 13, color: COLORS.placeholder, flex: 1 },
  langOverlay: { flex: 1 },
  langDropdown: {
    position: 'absolute',
    right: 12,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 140,
    overflow: 'hidden',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  langOptionActive: { backgroundColor: '#EFF6FF' },
  langOptionText: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  langOptionTextActive: { color: COLORS.primary, fontWeight: '700' },
});
