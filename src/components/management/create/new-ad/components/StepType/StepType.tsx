import type { ColorPalette, ListingTypeOption, StepTypeProps } from '../../../../../../utils/types';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../../../../hooks/app/useAppTranslation';
import { useTabBarClearance } from '../../../../../../hooks/app/useResponsive';
import { createStyles } from '../../../../../../utils/styles/new-ad/stepType.styles';
import { bgColor, spacerHeight } from '../../../../../../utils/styles/common/dynamic.styles';

function getOptions(Colors: ColorPalette): ListingTypeOption[] {
  return [
    { type: 'private', labelKey: 'createAd.private', subKey: 'createAd.privateSub', icon: 'account-outline', bg: Colors.primaryGhost, color: Colors.primary },
    { type: 'public',  labelKey: 'createAd.public',  subKey: 'createAd.publicSub',  icon: 'store-outline',   bg: Colors.success + '15', color: Colors.success  },
  ];
}

export function StepType({ onSelect }: StepTypeProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const OPTIONS = getOptions(Colors);
  const clearance = useTabBarClearance();
  return (
    <ScrollView overScrollMode="never" contentContainerStyle={s.scroll}>
      <Text style={s.title}>{t('createAd.selectListingType')}</Text>
      <View style={s.cards}>
        {OPTIONS.map(opt => (
          <TouchableOpacity key={opt.type} style={s.card} onPress={() => onSelect(opt.type)} activeOpacity={0.85}>
            <View style={[s.icon, bgColor(opt.bg)]}>
              <MaterialCommunityIcons name={opt.icon} size={32} color={opt.color} />
            </View>
            <View style={s.info}>
              <Text style={s.cardTitle}>{t(opt.labelKey)}</Text>
              <Text style={s.cardSub}>{t(opt.subKey)}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={spacerHeight(clearance)} />
    </ScrollView>
  );
}
