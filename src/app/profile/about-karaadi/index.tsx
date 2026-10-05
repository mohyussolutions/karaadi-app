import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, type Href } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/profile/aboutKaraadi.styles';
import { SOCIAL_LINKS, PAGES } from '../../../actions/constants';
import { SOCIAL_ICONS } from '../../../utils/icons';
import { paddingBottomOf, tint } from '../../../utils/styles/common/dynamic.styles';

export default function AboutKaraadiScreen() {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList overScrollMode="never"
        data={PAGES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, paddingBottomOf(insets.bottom + 84)]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>{t('aboutKaraadiPage.title')}</Text>
            <Text style={styles.subtitle}>{t('aboutKaraadiPage.subtitle')}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(item.route as Href)}
            activeOpacity={0.85}
          >
            <View style={styles.iconBg}>
              <MaterialCommunityIcons name={item.icon} size={24} color={Colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
              <Text style={styles.cardHint}>{t('aboutKaraadiPage.open')}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.followUsLabel}>{t('aboutKaraadiPage.followUs')}</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={[styles.socialIconBg, tint(Colors.brandFacebook)]}
                onPress={() => Linking.openURL(SOCIAL_LINKS.FACEBOOK)}
                activeOpacity={0.8}
                accessibilityLabel="Facebook"
              >
                <MaterialCommunityIcons name={SOCIAL_ICONS.facebook} size={22} color={Colors.brandFacebook} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialIconBg, tint(Colors.brandTiktok)]}
                onPress={() => Linking.openURL(SOCIAL_LINKS.TIKTOK)}
                activeOpacity={0.8}
                accessibilityLabel="TikTok"
              >
                <MaterialCommunityIcons name={SOCIAL_ICONS.tiktok} size={22} color={Colors.brandTiktok} />
              </TouchableOpacity>
            </View>

            <Text style={styles.rightsText}>{t('aboutKaraadiPage.rightsShort', { brand: 'Karaadi' })}</Text>
            <Text style={styles.developedByText}>
              {t('aboutKaraadiPage.developedBy')}{' '}
              <Text style={styles.developedByLink} onPress={() => Linking.openURL(SOCIAL_LINKS.DEVELOPER)}>
                Mohyus
              </Text>
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
