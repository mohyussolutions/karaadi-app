import React, { useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  TextInput, Alert, KeyboardAvoidingView, ScrollView, Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from '../../../../components/forms';
import { REGEX_NON_DIGITS } from '../../../../constants';
import RegionCityPicker from '../../../../components/geo/RegionCityPicker';
import { useAuthStore } from '../../../../store/hooks/authStore';
import { useAppTranslation } from '../../../../components/hooks/useAppTranslation';
import { KEYBOARD_AVOIDING_BEHAVIOR } from '../../../../common/common-for-ios-andriod';
import { createSubscription } from '../../../../actions/categories/subscription.actions';
import { useThemeColors, useThemedStyles } from '../../../../components/hooks/useTheme';
import {
  createStyles, createSheetInlineStyles, createImagePickerStyles,
} from '../../../../util/styles/profile/wanted.styles';
import { MAIN_CATEGORIES, getCategoryByKey, SUB_I18N_GROUP } from '../../../../constants';
import type { Subscription, SubscriptionPayload, WantedFormState } from '../../../../util/types';
import { maxLenSchema } from '../../../../util/validation/schemas';

const MAX_IMAGES = 3;

const EMPTY_FORM: WantedFormState = {
  title: '',
  category: MAIN_CATEGORIES[0].key,
  subCategory: '',
  nestedSubCategory: '',
  priceMin: '',
  priceMax: '',
  region: '',
  city: '',
  description: '',
  images: [],
};

function SectionTitle({ label }: { label: string }) {
  const sheetInline = useThemedStyles(createSheetInlineStyles);
  return (
    <View style={sheetInline.sectionRow}>
      <View style={sheetInline.sectionLine} />
      <Text style={sheetInline.sectionLabel}>{label}</Text>
      <View style={sheetInline.sectionLine} />
    </View>
  );
}

export interface WantedAlertFormProps {
  visible: boolean;
  onClose: () => void;
  onCreated: (sub: Subscription) => void;
}

export function WantedAlertForm({ visible, onClose, onCreated }: WantedAlertFormProps) {
  const { t } = useAppTranslation();
  const { user } = useAuthStore();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const sheetInline = useThemedStyles(createSheetInlineStyles);
  const imageStyles = useThemedStyles(createImagePickerStyles);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<WantedFormState>(EMPTY_FORM);

  const set = (key: keyof WantedFormState) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const selectedCategory = getCategoryByKey(form.category);
  const subCategories = selectedCategory?.subCategories ?? [];
  const selectedSubCategory = subCategories.find((s) => s.key === form.subCategory);
  const nestedSubCategories = selectedSubCategory?.nested ?? [];
  const i18nGroup = SUB_I18N_GROUP[form.category] ?? form.category.toLowerCase();

  const categoryOptions = useMemo(() => MAIN_CATEGORIES.map((c) => ({
    label: t(`categories.${c.key}`, { defaultValue: c.name }),
    value: c.key,
  })), [t]);

  const subCategoryOptions = useMemo(() => [
    { label: t('subscription.allCategories'), value: '' },
    ...subCategories.map((sub) => ({
      label: t(`subcategories.${i18nGroup}.${sub.key}`, { defaultValue: sub.name }),
      value: sub.key,
    })),
  ], [subCategories, i18nGroup, t]);

  const nestedSubCategoryOptions = useMemo(() => [
    { label: t('subscription.allCategories'), value: '' },
    ...nestedSubCategories.map((n) => ({ label: t(n.labelKey), value: n.key })),
  ], [nestedSubCategories, t]);

  function handleCategoryChange(value: string) {
    setForm((prev) => ({ ...prev, category: value, subCategory: '', nestedSubCategory: '' }));
  }

  function handleSubCategoryChange(value: string) {
    setForm((prev) => ({ ...prev, subCategory: value, nestedSubCategory: '' }));
  }

  function handleClose() {
    onClose();
    setForm(EMPTY_FORM);
  }

  async function pickImages() {
    const remaining = MAX_IMAGES - form.images.length;
    if (remaining <= 0) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as const,
      allowsMultipleSelection: true,
      quality: 0.6,
      base64: true,
      selectionLimit: remaining,
    });
    if (!result.canceled) {
      const dataUris = result.assets
        .filter((a) => !!a.base64)
        .map((a) => {
          const mime = a.mimeType === 'image/png' || a.mimeType === 'image/webp' ? a.mimeType : 'image/jpeg';
          return `data:${mime};base64,${a.base64}`;
        });
      setForm((prev) => ({ ...prev, images: [...prev.images, ...dataUris].slice(0, MAX_IMAGES) }));
    }
  }

  function removeImage(index: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.region.trim() || !form.city.trim()) {
      Alert.alert(t('subscription.required'));
      return;
    }
    if (!maxLenSchema(120).safeParse(form.title).success || !maxLenSchema(1000).safeParse(form.description).success) {
      Alert.alert(t('subscription.required'));
      return;
    }
    if (form.priceMin && form.priceMax && Number(form.priceMin) > Number(form.priceMax)) {
      Alert.alert(t('subscription.priceRangeInvalid'));
      return;
    }
    setSaving(true);
    const payload: SubscriptionPayload = {
      userId: user?.id || user?._id || '',
      title: form.title.trim(),
      category: form.category,
      region: form.region.trim(),
      cities: [form.city.trim()],
      selectedCityIds: [],
      customCities: [],
      ...(form.subCategory ? { subCategory: form.subCategory } : {}),
      ...(form.nestedSubCategory ? { nestedSubCategory: form.nestedSubCategory } : {}),
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
      ...(form.priceMin ? { priceMin: Number(form.priceMin) } : {}),
      ...(form.priceMax ? { priceMax: Number(form.priceMax) } : {}),
      ...(form.images.length ? { images: form.images } : {}),
    };
    const created = await createSubscription(payload);
    setSaving(false);
    if (created) {
      onCreated(created);
      onClose();
      setForm(EMPTY_FORM);
      Alert.alert(t('subscription.savedSuccessTitle'), t('subscription.savedSuccessMsg'));
    } else {
      Alert.alert(t('subscription.errorSaving'));
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={KEYBOARD_AVOIDING_BEHAVIOR}
      >
        <TouchableOpacity
          style={styles.flexFull}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={sheetInline.sheetWrap}>
          <View style={sheetInline.sheetHeader}>
            <Text style={styles.sheetTitle}>{t('subscription.newAlertTitle')}</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={sheetInline.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={sheetInline.fieldGroup}>
              <Text style={styles.label}>{t('subscription.alertTitle')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('subscription.titlePlaceholder')}
                placeholderTextColor={Colors.placeholder}
                value={form.title}
                onChangeText={set('title')}
              />
            </View>

            <Dropdown
              label={t('subscription.category')}
              value={form.category}
              options={categoryOptions}
              onChange={handleCategoryChange}
              required
            />

            {subCategories.length > 0 && (
              <Dropdown
                label={t('subscription.subCategory')}
                value={form.subCategory}
                options={subCategoryOptions}
                onChange={handleSubCategoryChange}
                placeholder={t('subscription.allCategories')}
              />
            )}

            {nestedSubCategories.length > 0 && (
              <Dropdown
                label={t('subscription.nestedSubCategory')}
                value={form.nestedSubCategory}
                options={nestedSubCategoryOptions}
                onChange={set('nestedSubCategory')}
                placeholder={t('subscription.allCategories')}
              />
            )}

            <SectionTitle label={t('subscription.priceRange')} />
            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>{t('subscription.minPrice')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.placeholder}
                  value={form.priceMin}
                  onChangeText={(v) => set('priceMin')(v.replace(REGEX_NON_DIGITS, ''))}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>{t('subscription.maxPrice')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="7000"
                  placeholderTextColor={Colors.placeholder}
                  value={form.priceMax}
                  onChangeText={(v) => set('priceMax')(v.replace(REGEX_NON_DIGITS, ''))}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <SectionTitle label={t('subscription.locationFilters')} />
            <RegionCityPicker
              selectedRegion={form.region}
              selectedCity={form.city}
              onRegionChange={set('region')}
              onCityChange={set('city')}
            />

            <View style={sheetInline.fieldGroup}>
              <Text style={styles.label}>{t('subscription.description')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('subscription.descriptionPlaceholder')}
                placeholderTextColor={Colors.placeholder}
                value={form.description}
                onChangeText={set('description')}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={sheetInline.imageFieldGroup}>
              <Text style={styles.label}>{t('subscription.images')}</Text>
              <Text style={sheetInline.hint}>{t('subscription.imagesHint')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={imageStyles.row}>
                {form.images.length < MAX_IMAGES && (
                  <TouchableOpacity style={imageStyles.addBtn} onPress={pickImages} activeOpacity={0.75}>
                    <MaterialCommunityIcons name="camera-plus-outline" size={26} color={Colors.primary} />
                  </TouchableOpacity>
                )}
                {form.images.map((uri, i) => (
                  <View key={uri + i} style={imageStyles.imgWrap}>
                    <Image source={{ uri }} style={imageStyles.thumb} />
                    <TouchableOpacity style={imageStyles.remove} onPress={() => removeImage(i)} hitSlop={6}>
                      <MaterialCommunityIcons name="close-circle" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>
                {saving ? t('subscription.submitting') : t('subscription.submit')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>{t('mine.businesses.cancel')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
