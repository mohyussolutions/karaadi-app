import { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../hooks/useAppTranslation';
import { MAIN_CATEGORIES } from '../../../../navigation/config/navConfig';
import { BUSINESS_CATEGORY_KEY_MAP, BUSINESS_TYPE_ICON } from '../../../../util/types/business.types';
import type { BusinessPostStepProps } from '../../../../util/types/component.types';
import { createStyles } from '../../../../util/styles/business/businessCreate.styles';

export function PostStep({
  business,
  onSelectCategory,
}: BusinessPostStepProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();

  const allowedBackendKeys: string[] = business.categories ?? [];

  const BUSINESS_CATEGORIES = useMemo(() => {
    const all = MAIN_CATEGORIES.map(c => ({
      label: t(`categories.${c.key}`, { defaultValue: c.name }),
      value: c.key,
      icon: BUSINESS_TYPE_ICON[c.key],
    }));
    if (allowedBackendKeys.length === 0) return all;
    return all.filter((opt) => allowedBackendKeys.includes(BUSINESS_CATEGORY_KEY_MAP[opt.value]));
  }, [t, allowedBackendKeys.join(',')]);

  return (
    <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 84 }]} keyboardShouldPersistTaps="handled">
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
