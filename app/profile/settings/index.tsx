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
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/settings/settings.styles';
import { SETTINGS_ROWS } from '../../../config/navigation/settingsRows';

export default function SettingsIndex() {
  const router = useRouter();
  const { t } = useTranslation();
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
          {SETTINGS_ROWS.map((row) => (
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
