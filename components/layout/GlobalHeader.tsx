import { useState, useEffect } from 'react';
import {
  View, Image, TouchableOpacity, Text, Modal, Pressable,
  TextInput, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { setBrowseQuery, clearBrowseQuery } from '../../store/slices/browseSearchSlice';
import { useThemeColors, useThemedStyles, useThemeMode } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { tabletHeaderStyles, TABLET_HEADER_ICON_SIZES, TABLET_LANG_DROPDOWN_TOP_OFFSET } from '../common/ipad';
import type { Lang } from '../../i18n/translations';
import { createStyles } from '../../util/styles/layout/globalHeader.styles';

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
  const { mode, setMode } = useThemeMode();
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector((s) => s.notifications.unreadCount);
  const browseQuery = useAppSelector((s) => s.browseSearch.query);
  const user = useAppSelector((s) => s.auth.user);

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { isTablet } = useResponsive();

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
  if (isDetail) return null;

  if (isAuth) {
    return (
      <View style={[styles.wrapper, { paddingTop: insets.top }]}>
        <View style={[styles.inner, isTablet && tabletHeaderStyles.inner]}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')} activeOpacity={0.8}>
            <Image source={require('../../assets/logo.jpg')} style={[styles.logo, isTablet && tabletHeaderStyles.logo]} resizeMode="contain" />
          </TouchableOpacity>
          <View style={styles.rightGroup}>
            <Switch
              value={mode === 'dark'}
              onValueChange={(v) => setMode(v ? 'dark' : 'light')}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
              style={styles.themeSwitch}
              accessibilityLabel="Toggle dark mode"
            />
            <TouchableOpacity style={[styles.langBtn, isTablet && tabletHeaderStyles.langBtn]} onPress={() => setShowLangMenu(true)}>
              <Text style={[styles.langText, isTablet && tabletHeaderStyles.langText]}>{lang.toUpperCase()}</Text>
              <MaterialCommunityIcons name="chevron-down" size={isTablet ? TABLET_HEADER_ICON_SIZES.langChevron : 12} color={Colors.white} />
            </TouchableOpacity>
          </View>
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
      <View style={[styles.inner, isTablet && tabletHeaderStyles.inner]}>
        <View style={styles.left}>
          <View style={[styles.backSlot, isTablet && tabletHeaderStyles.backSlot]}>
            {showBack && (
              <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
                <MaterialCommunityIcons name="chevron-left" size={isTablet ? TABLET_HEADER_ICON_SIZES.back : 28} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')} activeOpacity={0.8}>
            <Image source={require('../../assets/logo.jpg')} style={[styles.logo, isTablet && tabletHeaderStyles.logo]} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.notifBtn, isTablet && tabletHeaderStyles.notifBtn]}
            onPress={() => router.push(user ? '/profile/notifications' : '/(auth)/login')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="bell-outline" size={isTablet ? TABLET_HEADER_ICON_SIZES.notif : 26} color={Colors.primary} />
            {unreadCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.rightGroup}>
          <Switch
            value={mode === 'dark'}
            onValueChange={(v) => setMode(v ? 'dark' : 'light')}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
            style={styles.themeSwitch}
            accessibilityLabel="Toggle dark mode"
          />
          <TouchableOpacity
            style={[styles.langBtn, isTablet && tabletHeaderStyles.langBtn]}
            onPress={() => setShowLangMenu(true)}
            accessibilityLabel="Change language"
          >
            <Text style={[styles.langText, isTablet && tabletHeaderStyles.langText]}>{lang.toUpperCase()}</Text>
            <MaterialCommunityIcons name="chevron-down" size={isTablet ? TABLET_HEADER_ICON_SIZES.langChevron : 12} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {showSearchBar && (
        <View style={[styles.searchBar, isTablet && tabletHeaderStyles.searchBar, searchFocused && { borderColor: Colors.primary }]}>
          <MaterialCommunityIcons name="magnify" size={isTablet ? TABLET_HEADER_ICON_SIZES.search : 16} color={searchFocused ? Colors.primary : Colors.textMuted} />
          <TextInput
            style={[styles.searchInput, isTablet && tabletHeaderStyles.searchInput]}
            value={browseQuery}
            onChangeText={(text) => dispatch(setBrowseQuery(text))}
            placeholder={t('searchListings')}
            placeholderTextColor={Colors.placeholder}
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="never"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {browseQuery.length > 0 && (
            <TouchableOpacity onPress={() => dispatch(clearBrowseQuery())} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={isTablet ? TABLET_HEADER_ICON_SIZES.searchClear : 16} color={Colors.textMuted} />
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
  const { isTablet } = useResponsive();

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.langOverlay} onPress={onClose}>
        <View
          style={[
            styles.langDropdown,
            { top: insets.top + (isTablet ? TABLET_LANG_DROPDOWN_TOP_OFFSET : 56) },
            isTablet && tabletHeaderStyles.langDropdown,
          ]}
        >
          {LANGS.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langOption, isTablet && tabletHeaderStyles.langOption, lang === l.code && styles.langOptionActive]}
              onPress={() => onSelect(l.code)}
            >
              <Text style={[styles.langOptionText, isTablet && tabletHeaderStyles.langOptionText, lang === l.code && styles.langOptionTextActive]}>
                {l.label}
              </Text>
              {lang === l.code && <MaterialCommunityIcons name="check" size={isTablet ? 20 : 16} color={Colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
