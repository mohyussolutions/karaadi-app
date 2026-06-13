import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { toggleSound } from '../../../store/slices/notificationSettingsSlice';
import { playNotificationSound } from '../../../services/soundService';
import { useThemeColors, useThemedStyles, useThemeMode, type ThemeMode } from '../../../hooks/useTheme';
import { createStyles } from '../../../utils/styles/settings/settings.styles';
import type { SettingsRow } from '../../../utils/types';

const ROWS: SettingsRow[] = [
  { icon: 'shield-lock-outline', labelKey: 'mine.settings.security', route: '/profile/settings/Security' },
  { icon: 'eye-off-outline',     labelKey: 'mine.settings.privacy',  route: '/profile/settings/Privacy' },
  { icon: 'credit-card-outline', labelKey: 'mine.settingsPage.payments', route: '/profile/settings/Payment' },
  { icon: 'crown-outline',       labelKey: 'mine.settings.subscription', route: '/profile/wanted' },
];

const MODE_OPTIONS: { mode: ThemeMode; labelKey: string; icon: string }[] = [
  { mode: 'light',  labelKey: 'mine.settingsPage.light',  icon: 'white-balance-sunny' },
  { mode: 'dark',   labelKey: 'mine.settingsPage.dark',   icon: 'weather-night' },
];

export default function SettingsIndex() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mode, setMode } = useThemeMode();
  const dispatch = useAppDispatch();
  const soundEnabled = useAppSelector((s) => s.notificationSettings.soundEnabled);

  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  function handleToggleSound() {
    const willBeEnabled = !soundEnabled;
    dispatch(toggleSound());
    if (willBeEnabled) playNotificationSound();
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.sectionTitle}>{t('mine.settingsPage.account')}</Text>
        <View style={s.section}>
          {ROWS.map((row) => (
            <TouchableOpacity
              key={row.route}
              style={s.row}
              onPress={() => router.push(row.route as any)}
              activeOpacity={0.75}
            >
              <View style={s.iconWrap}>
                <MaterialCommunityIcons name={row.icon as any} size={20} color={Colors.primary} />
              </View>
              <Text style={s.rowLabel}>{t(row.labelKey)}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[s.sectionTitle, s.sectionTitleSpaced]}>{t('mine.settingsPage.appearance')}</Text>
        <View style={s.section}>
          <View style={s.modeSection}>
            <View style={s.modeHeader}>
              <View style={s.iconWrap}>
                <MaterialCommunityIcons name="theme-light-dark" size={20} color={Colors.primary} />
              </View>
              <Text style={s.rowLabel}>{t('mine.settingsPage.mode')}</Text>
            </View>
            <View style={s.modeRow}>
              {MODE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.mode}
                  style={[s.modeBtn, mode === opt.mode && s.modeBtnActive]}
                  onPress={() => setMode(opt.mode)}
                  activeOpacity={0.75}
                >
                  <MaterialCommunityIcons
                    name={opt.icon as any}
                    size={16}
                    color={mode === opt.mode ? Colors.white : Colors.textSecondary}
                  />
                  <Text style={[s.modeBtnText, mode === opt.mode && s.modeBtnTextActive]}>
                    {t(opt.labelKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Text style={[s.sectionTitle, s.sectionTitleSpaced]}>{t('mine.settingsPage.notifications')}</Text>
        <View style={s.section}>
          <View style={s.row}>
            <View style={s.iconWrap}>
              <MaterialCommunityIcons
                name={soundEnabled ? 'volume-high' : 'volume-off'}
                size={20}
                color={soundEnabled ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={s.rowTextWrap}>
              <Text style={s.rowLabel}>{t('mine.settingsPage.notificationSound')}</Text>
              <Text style={s.rowSub}>
                {soundEnabled ? t('mine.settingsPage.soundOn') : t('mine.settingsPage.soundOff')}
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={handleToggleSound}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
