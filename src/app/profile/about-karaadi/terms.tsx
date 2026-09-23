import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTranslation } from '../../../hooks/useAppTranslation';
import { useThemedStyles } from '../../../hooks/useTheme';
import { createDetailStyles } from '../../../util/styles/profile/aboutKaraadi.styles';
import { TERMS_ITEM_INDICES } from "../../../constants";

export default function TermsScreen() {
  const { t } = useAppTranslation();
  const styles = useThemedStyles(createDetailStyles);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView overScrollMode="never" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 84 }]}>
        <Text style={styles.title}>{t('terms.heading')}</Text>
        <Text style={styles.lead}>{t('terms.description')}</Text>

        {TERMS_ITEM_INDICES.map((i) => (
          <View key={i} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletText}>{t(`terms.items.${i}`)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
