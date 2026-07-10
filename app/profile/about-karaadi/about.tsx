import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { useThemedStyles } from '../../../hooks/useTheme';
import { createDetailStyles } from '../../../util/styles/profile/aboutKaraadi.styles';

const WHAT_ITEM_KEYS = [
  'about.items.realEstate',
  'about.items.vehicles',
  'about.items.marketplace',
  'about.items.jobs',
  'about.items.services',
];

export default function AboutScreen() {
  const { t } = useAppTranslation();
  const styles = useThemedStyles(createDetailStyles);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 84 }]}>
        <Text style={styles.title}>{t('about.heading')}</Text>
        <Text style={styles.lead}>{t('about.lead')}</Text>

        <Text style={styles.sectionHeading}>{t('about.missionHeading')}</Text>
        <Text style={styles.body}>{t('about.mission')}</Text>

        <Text style={styles.sectionHeading}>{t('about.whatHeading')}</Text>
        {WHAT_ITEM_KEYS.map((key) => (
          <View key={key} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{t(key)}</Text>
          </View>
        ))}

        <Text style={styles.sectionHeading}>{t('about.contactHeading')}</Text>
        <Text style={styles.body}>{t('about.contactIntro')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
