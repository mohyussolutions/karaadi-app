import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Switch, Linking, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { useAuthStore } from '../../../store/hooks/authStore';
import { toggleSound } from '../../../components/features/notifications/store/notificationSettingsSlice';
import { playNotificationSound } from '../../../components/features/notifications/services/soundService';
import { updatePhoneVisibility } from '../../../actions/core/auth.actions';
import { useThemeColors, useThemedStyles } from '../../../components/hooks/useTheme';
import { createStyles } from '../../../util/styles/settings/settings.styles';
import { SETTINGS_ROWS } from '../../../navigation/config/navConfig';

export default function SettingsIndex() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const soundEnabled = useAppSelector((s) => s.notificationSettings.soundEnabled);
  const { user, setUser } = useAuthStore();

  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const [hidePhone, setHidePhone] = useState(!!user?.hidePhone);
  const [updatingHidePhone, setUpdatingHidePhone] = useState(false);

  useEffect(() => {
    setHidePhone(!!user?.hidePhone);
  }, [user?.hidePhone]);

  function handleToggleSound() {
    const willBeEnabled = !soundEnabled;
    dispatch(toggleSound());
    if (willBeEnabled) playNotificationSound();
  }

  async function handleToggleHidePhone(value: boolean) {
    const previous = hidePhone;
    setHidePhone(value);
    setUpdatingHidePhone(true);
    try {
      const updated = await updatePhoneVisibility(value);
      if (user) await setUser({ ...user, ...updated }, user.token);
    } catch {
      setHidePhone(previous);
      Alert.alert(t('error'), t('mine.settingsPage.hidePhoneUpdateFailed'));
    } finally {
      setUpdatingHidePhone(false);
    }
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 84 }]} showsVerticalScrollIndicator={false}>
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

        <Text style={[s.sectionTitle, s.sectionTitleSpaced]}>{t('mine.settingsPage.privacy')}</Text>
        <View style={s.section}>
          <View style={s.row}>
            <View style={s.iconWrap}>
              <MaterialCommunityIcons
                name={hidePhone ? 'phone-off' : 'phone'}
                size={20}
                color={hidePhone ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={s.rowTextWrap}>
              <Text style={s.rowLabel}>{t('mine.settingsPage.hidePhoneNumber')}</Text>
              <Text style={s.rowSub}>
                {hidePhone ? t('mine.settingsPage.hidePhoneOn') : t('mine.settingsPage.hidePhoneOff')}
              </Text>
            </View>
            <Switch
              value={hidePhone}
              onValueChange={handleToggleHidePhone}
              disabled={updatingHidePhone}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <Text style={[s.sectionTitle, s.sectionTitleSpaced]}>{t('mine.settingsPage.legal')}</Text>
        <View style={s.section}>
          <TouchableOpacity
            style={s.row}
            onPress={() => Linking.openURL('https://karaadi.com/privacy')}
            activeOpacity={0.75}
          >
            <View style={s.iconWrap}>
              <MaterialCommunityIcons name="shield-account-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={s.rowLabel}>{t('mine.settingsPage.privacyPolicy')}</Text>
            <MaterialCommunityIcons name="open-in-new" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.row}
            onPress={() => Linking.openURL('https://karaadi.com/terms')}
            activeOpacity={0.75}
          >
            <View style={s.iconWrap}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={s.rowLabel}>{t('mine.settingsPage.termsOfService')}</Text>
            <MaterialCommunityIcons name="open-in-new" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
