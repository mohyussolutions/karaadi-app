import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/profile/badge.styles';

const STATS = [
  { icon: 'eye-outline', labelKey: 'mine.account.badgeVisits' },
  { icon: 'account-multiple-outline', labelKey: 'mine.account.badgeContacts' },
  { icon: 'message-reply-outline', labelKey: 'mine.account.badgeResponses' },
];

export default function BadgeScreen() {
  const { t } = useTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 84 }]} showsVerticalScrollIndicator={false}>
        <Text style={s.heading}>{t('mine.account.badge')}</Text>
        <Text style={s.intro}>{t('mine.account.badgeDescription')}</Text>

        {STATS.map((stat) => (
          <View key={stat.labelKey} style={s.statRow}>
            <View style={s.statLeft}>
              <View style={s.statIconBg}>
                <MaterialCommunityIcons name={stat.icon as any} size={20} color={Colors.primary} />
              </View>
              <Text style={s.statLabel}>{t(stat.labelKey)}</Text>
            </View>
            <Text style={s.statValue}>0</Text>
          </View>
        ))}

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
