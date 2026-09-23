import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/settings/privacySettings.styles';
import { SECTIONS } from "../../../constants";

export default function PrivacySettings() {
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView overScrollMode="never" contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 84 }]} showsVerticalScrollIndicator={false}>

        <Text style={s.heading}>Dejinta Asturnaanta</Text>
        <Text style={s.intro}>
          Xeerarka cusub ee asturnaanta waxay ku siinayaan xakameyn fiican oo ku saabsan xogtaada
          internetka iyo sida Karaadi iyo adeegyo kale u isticmaali karaan.
        </Text>

        {SECTIONS.map((sec) => (
          <View key={sec.title} style={s.card}>
            <Text style={s.cardTitle}>{sec.title}</Text>
            <Text style={s.cardBody}>{sec.body}</Text>
          </View>
        ))}

        <Text style={s.footer}>
          © {new Date().getFullYear()} Karaadi. Dhammaan xuquuqda way dhowrsanyihiin.
        </Text>

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}
