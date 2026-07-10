import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/settings/privacy.styles';

const SECTIONS = [
  {
    title: 'Dejinta Karaadi',
    body: 'Xogta aan ka aruurinay adiga waxaa loo isticmaalaa in lagu habeeyo khibradaada Karaadi ee bogga iyo app-ka. Dejintan waxay khusaysaa macluumaadka akoonkaaga.',
  },
  {
    title: 'Fariimaha iyo Cusboonaysiinta',
    body: 'Karaadi waxay kuu soo diri doontaa wargeysyo, talooyin safar, tartamo iyo xog kale oo ku saabsan adeegyada iyo alaabta aad xiisaynayso.',
  },
  {
    title: 'Macluumaadkaaga Gaarka ah',
    body: "Xogtaada waxaa loo isticmaalaa in lagu tuso waxyaabaha aad xiisaynayso, laguugu soo bandhigo xayaysiisyo ku habboon, iyo inaad hesho macluumaad muhiim ah oo ku saabsan adeegyada Karaadi.",
  },
  {
    title: 'Xayeysiiska iyo Koontaroolka',
    body: "Xogtaada waxaa loo isticmaalaa in lagu habeeyo xayeysiiska aad aragto. Waxaad dooran kartaa in xayeysiiska lagu habeeyo da'da, jinsiga, danaha ama goobta aad ku sugan tahay.",
  },
];

export default function PrivacySettings() {
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 84 }]} showsVerticalScrollIndicator={false}>

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
