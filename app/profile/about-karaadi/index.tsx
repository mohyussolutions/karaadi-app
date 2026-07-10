import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/profile/aboutKaraadi.styles';

const PAGES: { id: string; icon: string; titleKey: string; route: string }[] = [
  { id: 'about', icon: 'information-outline', titleKey: 'about.heading', route: '/profile/about-karaadi/about' },
  { id: 'terms', icon: 'file-document-outline', titleKey: 'terms.heading', route: '/profile/about-karaadi/terms' },
  { id: 'contact', icon: 'email-outline', titleKey: 'contact.heading', route: '/profile/about-karaadi/contact' },
];

export default function AboutKaraadiScreen() {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={PAGES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 84 }]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('aboutKaraadiPage.title')}</Text>
            <Text style={styles.subtitle}>{t('aboutKaraadiPage.subtitle')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.85}
          >
            <View style={styles.iconBg}>
              <MaterialCommunityIcons name={item.icon as any} size={24} color={Colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
              <Text style={styles.cardHint}>{t('aboutKaraadiPage.open')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
