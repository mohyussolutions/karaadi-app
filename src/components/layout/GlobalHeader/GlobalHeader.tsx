import { memo, useState } from 'react';
import {
  View, Image, TouchableOpacity, Text, Modal, Pressable,
  TextInput, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGlobal } from '../../../hooks/app/useResponsive';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { useHeaderSearch } from '../../../hooks/listings/useSearch';
import { useAppSelector } from '../../../store/store';
import { useThemeColors, useThemedStyles, useThemeMode } from '../../../hooks/app/useTheme';
import { useResponsive } from '../../../hooks/app/useResponsive';
import { tabletHeaderStyles } from '../../../utils/styles/common/tablet.styles';
import { createStyles } from '../../../utils/styles/layout/globalHeader.styles';
import {
  AUTH_RE, BRAND_LOGO, CHAT_RE, INPUT_LIMITS, LANG_DROPDOWN_TOP_OFFSET, LANGS, ROUTES,
  TABLET_HEADER_ICON_SIZES, TABLET_LANG_DROPDOWN_TOP_OFFSET, TAB_PATHS,
} from '../../../actions/constants';
import { useIsOverlayActive } from '../../../navigation/header/headerVisibility';
import type { HeaderLogoProps, LangModalProps } from '../../../utils/types';
import { paddingTopOf, topOf } from '../../../utils/styles/common/dynamic.styles';

import { selectUser } from '../../../store/slices/authSlice';
import { selectUnreadCount } from '../../../store/slices/notificationsSlice';
const HeaderLogo = memo(function HeaderLogo({ onPress }: HeaderLogoProps) {
  const styles = useThemedStyles(createStyles);
  const { logoSize } = useGlobal();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Image source={BRAND_LOGO} style={[styles.logo, logoSize()]} resizeMode="contain" fadeDuration={0} />
    </TouchableOpacity>
  );
});

export default function GlobalHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { t, lang, switchLanguage } = useAppTranslation();
  const { mode, setMode } = useThemeMode();
  const unreadCount = useAppSelector(selectUnreadCount);
  const user = useAppSelector(selectUser);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const search = useHeaderSearch(pathname);

  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { isTablet } = useResponsive();

  const isAuth = AUTH_RE.test(pathname);
  const isChat = CHAT_RE.test(pathname);
  const isDetail = useIsOverlayActive();
  const isTab = TAB_PATHS.has(pathname);
  const showBack = !isTab && !isAuth && !isChat && !isDetail && router.canGoBack();
  const showSearchBar = !isDetail && !isAuth && !isChat;

  if (isChat || isDetail) return null;

  return (
    <View style={[styles.wrapper, paddingTopOf(insets.top)]}>
      <View style={[styles.inner, isTablet && tabletHeaderStyles.inner]}>
        <View style={styles.left}>
          <View style={[styles.backSlot, isTablet && tabletHeaderStyles.backSlot]}>
            {showBack && (
              <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
                <MaterialCommunityIcons name="chevron-left" size={isTablet ? TABLET_HEADER_ICON_SIZES.back : 28} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <HeaderLogo onPress={() => router.push(ROUTES.home)} />
          {!isAuth && (
            <TouchableOpacity
              style={[styles.notifBtn, isTablet && tabletHeaderStyles.notifBtn]}
              onPress={() => router.push(user ? ROUTES.notifications : ROUTES.login)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="bell-outline" size={isTablet ? TABLET_HEADER_ICON_SIZES.notif : 26} color={Colors.primary} />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rightGroup}>
          <Switch
            value={mode === 'dark'}
            onValueChange={(isDark) => setMode(isDark ? 'dark' : 'light')}
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
        <View style={[styles.searchBar, isTablet && tabletHeaderStyles.searchBar, search.searchFocused && styles.searchBarFocused]}>
          <MaterialCommunityIcons name="magnify" size={isTablet ? TABLET_HEADER_ICON_SIZES.search : 20} color={search.searchFocused ? Colors.primary : Colors.textMuted} />
          <TextInput
            style={[styles.searchInput, isTablet && tabletHeaderStyles.searchInput]}
            value={search.searchInput}
            maxLength={INPUT_LIMITS.search}
            onChangeText={search.handleSearchChange}
            placeholder={t('searchListings')}
            placeholderTextColor={Colors.placeholder}
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="never"
            onFocus={search.onSearchFocus}
            onBlur={search.onSearchBlur}
          />
          {search.searchInput.length > 0 && (
            <TouchableOpacity onPress={search.clearSearch} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={isTablet ? TABLET_HEADER_ICON_SIZES.searchClear : 20} color={Colors.textMuted} />
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

function LangModal({ visible, insets, lang, onClose, onSelect }: LangModalProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { isTablet } = useResponsive();
  const dropdownTop = insets.top + (isTablet ? TABLET_LANG_DROPDOWN_TOP_OFFSET : LANG_DROPDOWN_TOP_OFFSET);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.langOverlay} onPress={onClose}>
        <View style={[styles.langDropdown, topOf(dropdownTop), isTablet && tabletHeaderStyles.langDropdown]}>
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
