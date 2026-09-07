import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../hooks/useAppTranslation';
import { updateBusiness } from '../../../../actions/core/business.actions';
import { MAIN_CATEGORIES } from '../../../../navigation/config/navConfig';
import { BUSINESS_CATEGORY_KEY_MAP, BUSINESS_TYPE_ICON } from '../../../../util/types/business.types';
import type { BusinessCategoriesStepProps } from '../../../../util/types/component.types';
import { createStyles } from '../../../../util/styles/business/businessCreate.styles';
import { getApiErrorMessage } from '../business.helpers';

export function CategoriesStep({
  business,
  onSaved,
}: BusinessCategoriesStepProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();

  const OPTIONS = useMemo(() => MAIN_CATEGORIES.map(c => ({
    label: t(`categories.${c.key}`, { defaultValue: c.name }),
    value: c.key,
    icon: BUSINESS_TYPE_ICON[c.key],
  })), [t]);

  const [selected, setSelected] = useState<string[]>(() => {
    const backendKeys: string[] = business.categories ?? [];
    return OPTIONS
      .filter((opt) => backendKeys.includes(BUSINESS_CATEGORY_KEY_MAP[opt.value]))
      .map((opt) => opt.value);
  });
  const [saving, setSaving] = useState(false);

  function toggle(key: string) {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function handleSave() {
    if (selected.length === 0) return;
    setSaving(true);
    try {
      const backendCategories = selected.map((k) => BUSINESS_CATEGORY_KEY_MAP[k]).filter(Boolean);
      const id = business._id || business.id || '';
      await updateBusiness(id, { categories: backendCategories });
      onSaved({ ...business, categories: backendCategories });
    } catch (err) {
      Alert.alert(t('auth.common.error'), getApiErrorMessage(err) || t('mine.businesses.saveError'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 84 }]} keyboardShouldPersistTaps="handled">
      <Text style={s.heading}>{t('mine.businesses.selectCategoriesTitle')}</Text>
      <Text style={s.statusMessage}>{t('mine.businesses.selectCategoriesDesc')}</Text>

      <View style={s.categoryGrid}>
        {OPTIONS.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <TouchableOpacity
              key={opt.value}
              style={[s.categoryGridItem, active && s.categoryGridItemActive]}
              onPress={() => toggle(opt.value)}
              activeOpacity={0.85}
            >
              <View style={[s.categoryGridIconWrap, active && s.categoryGridIconWrapActive]}>
                <MaterialCommunityIcons name={opt.icon} size={28} color={active ? Colors.white : Colors.primary} />
              </View>
              <Text style={s.categoryGridLabel}>{opt.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[s.submitBtn, (selected.length === 0 || saving) && s.submitBtnDisabled]}
        onPress={handleSave}
        disabled={selected.length === 0 || saving}
        activeOpacity={0.88}
      >
        {saving ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <>
            <Text style={s.submitText}>{t('mine.businesses.saveAndContinue')}</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
          </>
        )}
      </TouchableOpacity>

      <View style={s.spacer40} />
    </ScrollView>
  );
}
