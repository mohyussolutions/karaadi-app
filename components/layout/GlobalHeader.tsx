import React, { useState, useEffect } from 'react';
import {
  View, Image, TouchableOpacity, Text, Modal, Pressable,
  TextInput, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useAppSelector, useAppDispatch } from '../../store';
import { setBrowseQuery, clearBrowseQuery } from '../../store/slices/browseSearchSlice';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import type { Lang } from '../../i18n/translations';
import { createStyles } from '../../utils/styles/layout/globalHeader.styles';

const AUTH_RE = /\/(login|register|confirm|forgot-password|reset-password)/;
const CHAT_RE = /^\/profile\/chat/;
const DETAIL_RE = /^\/listing/;
const TAB_PATHS = new Set(['/home', '/messages', '/profile', '/new-ad', '/businesses', '/notifications']);

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'so', label: 'Soomaali' },
];

export default function GlobalHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { t, lang, switchLanguage } = useAppTranslation();
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const browseQuery = useAppSelector((s) => s.browseSearch.query);
  const user = useAppSelector((s) => s.auth.user);

  const [showLangMenu, setShowLangMenu] = useState(false);

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const isAuth = AUTH_RE.test(pathname);
  const isChat = CHAT_RE.test(pathname);
  const isDetail = DETAIL_RE.test(pathname);
  const isTab = TAB_PATHS.has(pathname);
  const showBack = !isTab && !isAuth && !isChat && !isDetail && router.canGoBack();
  const showSearchBar = !isDetail && !isAuth && !isChat;

  useEffect(() => {
    dispatch(clearBrowseQuery());
  }, [pathname, dispatch]);

  if (isChat) return null;

  if (isAuth) {
    return (
      <View style={[styles.wrapper, { paddingTop: insets.top }]}>
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')} activeOpacity={0.8}>
            <Image source={require('../../assets/logo.jpg')} style={styles.logo} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangMenu(true)}>
            <Text style={styles.langText}>{lang.toUpperCase()}</Text>
            <MaterialCommunityIcons name="chevron-down" size={12} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <LangModal
          visible={showLangMenu}
          insets={insets}
          lang={lang}
          onClose={() => setShowLangMenu(false)}
          onSelect={(code) => { switchLanguage(code); setShowLangMenu(false); }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top }]}>
      <View style={styles.inner}>
        <View style={styles.left}>
          <View style={styles.backSlot}>
            {showBack && (
              <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
                <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')} activeOpacity={0.8}>
            <Image source={require('../../assets/logo.jpg')} style={styles.logo} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push(user ? '/profile/notifications' : '/(auth)/login')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="bell-outline" size={26} color={Colors.primary} />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setShowLangMenu(true)}
          accessibilityLabel="Change language"
        >
          <Text style={styles.langText}>{lang.toUpperCase()}</Text>
          <MaterialCommunityIcons name="chevron-down" size={12} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {showSearchBar && (
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={browseQuery}
            onChangeText={(text) => dispatch(setBrowseQuery(text))}
            placeholder={t('searchListings')}
            placeholderTextColor={Colors.placeholder}
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {browseQuery.length > 0 && (
            <TouchableOpacity onPress={() => dispatch(clearBrowseQuery())} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <LangModal
        visible={showLangMenu}
        insets={insets}
        lang={lang}
        onClose={() => setShowLangMenu(false)}
        onSelect={(code) => { switchLanguage(code); setShowLangMenu(false); }}
      />
    </View>
  );
}

function LangModal({ visible, insets, lang, onClose, onSelect }: {
  visible: boolean;
  insets: { top: number };
  lang: Lang;
  onClose: () => void;
  onSelect: (code: Lang) => void;
}) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.langOverlay} onPress={onClose}>
        <View style={[styles.langDropdown, { top: insets.top + 56 }]}>
          {LANGS.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langOption, lang === l.code && styles.langOptionActive]}
              onPress={() => onSelect(l.code)}
            >
              <Text style={[styles.langOptionText, lang === l.code && styles.langOptionTextActive]}>
                {l.label}
              </Text>
              {lang === l.code && <MaterialCommunityIcons name="check" size={16} color={Colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
