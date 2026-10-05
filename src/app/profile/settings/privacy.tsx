import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/settings/privacySettings.styles';
import { SECTIONS } from "../../../actions/constants";
import { paddingBottomOf } from '../../../utils/styles/common/dynamic.styles';
import { useAppTranslation } from '../../../hooks/app/useAppTranslation';
import { initTracking, setTrackingConsent } from '../../../lib/tracking/tracker';

export default function PrivacySettings() {
  const s = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation();
  const [trackingOn, setTrackingOn] = useState(false);

  useEffect(() => {
    initTracking().then((consent) => setTrackingOn(consent === 'granted'));
  }, []);

  const toggleTracking = (value: boolean) => {
    setTrackingOn(value);
    setTrackingConsent(value);
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView overScrollMode="never" contentContainerStyle={[s.content, paddingBottomOf(insets.bottom + 84)]} showsVerticalScrollIndicator={false}>

        <Text style={s.heading}>Dejinta Asturnaanta</Text>
        <Text style={s.intro}>
          Xeerarka cusub ee asturnaanta waxay ku siinayaan xakameyn fiican oo ku saabsan xogtaada
          internetka iyo sida Karaadi iyo adeegyo kale u isticmaali karaan.
        </Text>

        <View style={s.card}>
          <View style={s.toggleRow}>
            <View style={s.toggleText}>
              <Text style={s.cardTitle}>{t('tracking.settingTitle')}</Text>
              <Text style={s.cardBody}>{t('tracking.settingBody')}</Text>
            </View>
            <Switch
              value={trackingOn}
              onValueChange={toggleTracking}
              accessibilityLabel={t('tracking.settingTitle')}
            />
          </View>
        </View>

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
