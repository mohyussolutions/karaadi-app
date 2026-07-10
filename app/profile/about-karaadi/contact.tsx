import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { createDetailStyles } from '../../../util/styles/profile/aboutKaraadi.styles';

export default function ContactScreen() {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createDetailStyles);
  const insets = useSafeAreaInsets();

  const email = t('helpPage.contactMethods.email.address');
  const whatsapp = t('helpPage.contactMethods.whatsapp.link');

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 84 }]}>
        <Text style={styles.title}>{t('contact.heading')}</Text>
        <Text style={styles.lead}>{t('contact.description')}</Text>

        <TouchableOpacity
          style={styles.contactRow}
          activeOpacity={0.85}
          onPress={() => Linking.openURL(`mailto:${email}`)}
        >
          <View style={styles.contactIconBg}>
            <MaterialCommunityIcons name="email-outline" size={22} color={Colors.primary} />
          </View>
          <View style={styles.contactBody}>
            <Text style={styles.contactLabel}>{t('helpPage.contactMethods.email.title')}</Text>
            <Text style={styles.contactValue}>{email}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactRow}
          activeOpacity={0.85}
          onPress={() => Linking.openURL(whatsapp)}
        >
          <View style={styles.contactIconBg}>
            <MaterialCommunityIcons name="whatsapp" size={22} color={Colors.primary} />
          </View>
          <View style={styles.contactBody}>
            <Text style={styles.contactLabel}>{t('helpPage.contactMethods.whatsapp.title')}</Text>
            <Text style={styles.contactValue}>{t('helpPage.contactMethods.whatsapp.desc')}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
