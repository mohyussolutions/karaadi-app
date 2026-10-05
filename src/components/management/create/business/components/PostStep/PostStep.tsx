import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../../../hooks/app/useTheme';
import { useAppTranslation } from '../../../../../../hooks/app/useAppTranslation';
import { useBusinessCategoryOptions } from '../../../../../../hooks/business/useBusiness';
import type { BusinessPostStepProps } from '../../../../../../utils/types';
import { createStyles } from '../../../../../../utils/styles/business/businessCreate.styles';
import { paddingBottomOf } from '../../../../../../utils/styles/common/dynamic.styles';

export function PostStep({
  business,
  onSelectCategory,
}: BusinessPostStepProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();

  const allowedBackendKeys: string[] = business.categories ?? [];

  const BUSINESS_CATEGORIES = useBusinessCategoryOptions(allowedBackendKeys);

  return (
    <ScrollView overScrollMode="never" contentContainerStyle={[s.scroll, paddingBottomOf(insets.bottom + 84)]} keyboardShouldPersistTaps="handled">
      <Text style={s.heading}>{t('mine.businesses.postQuestion')}</Text>
      <Text style={s.statusMessage}>{t('mine.businesses.postCategoryDesc', { name: business.name })}</Text>

      <View style={s.categoryGrid}>
        {BUSINESS_CATEGORIES.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={s.categoryGridItem}
            onPress={() => onSelectCategory(opt.value)}
            activeOpacity={0.85}
          >
            <View style={s.categoryGridIconWrap}>
              <MaterialCommunityIcons name={opt.icon} size={28} color={Colors.primary} />
            </View>
            <Text style={s.categoryGridLabel}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
