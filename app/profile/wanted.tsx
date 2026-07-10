import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { EmptyState, AppIcon } from '../../components/shared';
import { LoadingSpinner } from '../../components/loading';
import { Dropdown } from '../../features/new-ad/components/forms';
import RegionCityPicker from '../../components/geo/RegionCityPicker';
import { useAuthStore } from '../../store/authStore';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import {
  fetchMySubscriptions, createSubscription, deleteSubscription,
} from '../../api/categories/subscription.actions';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import {
  createStyles, createSheetInlineStyles, createImagePickerStyles,
} from '../../util/styles/profile/wanted.styles';
import { MAIN_CATEGORIES, getCategoryByKey, SUB_I18N_GROUP } from '../../constants';
import { formatPrice } from '../../util/helpers';
import type { Subscription, SubscriptionPayload, WantedFormState } from '../../util/types';

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

export default function WantedScreen() {
  const { t } = useAppTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const sheetInline = useThemedStyles(createSheetInlineStyles);
  const imageStyles = useThemedStyles(createImagePickerStyles);
  const insets = useSafeAreaInsets();

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<WantedFormState>(EMPTY_FORM);

  const set = (key: keyof WantedFormState) => (val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const data = await fetchMySubscriptions();
    setSubs(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const selectedCategory = getCategoryByKey(form.category);
  const subCategories = selectedCategory?.subCategories ?? [];
  const selectedSubCategory = subCategories.find((s) => s.key === form.subCategory);
  const nestedSubCategories = selectedSubCategory?.nested ?? [];
  const i18nGroup = SUB_I18N_GROUP[form.category] ?? form.category.toLowerCase();

  const categoryOptions = MAIN_CATEGORIES.map((c) => ({
    label: t(`categories.${c.key}`, { defaultValue: c.name }),
    value: c.key,
  }));

  const subCategoryOptions = [
    { label: t('subscription.allCategories'), value: '' },
    ...subCategories.map((sub) => ({
      label: t(`subcategories.${i18nGroup}.${sub.key}`, { defaultValue: sub.name }),
      value: sub.key,
    })),
  ];

  const nestedSubCategoryOptions = [
    { label: t('subscription.allCategories'), value: '' },
    ...nestedSubCategories.map((n) => ({ label: t(n.labelKey), value: n.key })),
  ];

  function handleCategoryChange(value: string) {
    setForm((prev) => ({ ...prev, category: value, subCategory: '', nestedSubCategory: '' }));
  }

  function handleSubCategoryChange(value: string) {
    setForm((prev) => ({ ...prev, subCategory: value, nestedSubCategory: '' }));
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
      setSubs((prev) => [created, ...prev]);
      setShowSheet(false);
      setForm(EMPTY_FORM);
      Alert.alert(t('subscription.savedSuccessTitle'), t('subscription.savedSuccessMsg'));
    } else {
      Alert.alert(t('subscription.errorSaving'));
    }
  }

  function handleDelete(id: string) {
    Alert.alert(
      t('subscription.deleteAlertTitle'),
      t('subscription.deleteAlertMessage'),
      [
        { text: t('mine.businesses.cancel'), style: 'cancel' },
        {
          text: t('subscription.actions.delete'),
          style: 'destructive',
          onPress: () => {
            setSubs((prev) => prev.filter((s) => s.id !== id));
            deleteSubscription(id);
          },
        },
      ],
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="account-outline"
          title={t('subscription.signInPromptTitle')}
          message={t('subscription.signInPromptMsg')}
        />
      </SafeAreaView>
    );
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => setShowSheet(true)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="bell-plus-outline" size={20} color={Colors.white} />
        <Text style={styles.createBtnText}>{t('subscription.createNewAlert')}</Text>
      </TouchableOpacity>

      <Text style={sheetInline.hint}>{t('subscription.notifyHint')}</Text>

      <FlatList
        data={subs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 84 }, subs.length === 0 && styles.flexFull]}
        ListEmptyComponent={
          <EmptyState
            icon="bell-alert-outline"
            title={t('subscription.noAlerts')}
            message={t('subscription.myAlertsEmpty')}
          />
        }
        renderItem={({ item }) => (
          <AlertCard
            item={item}
            onDelete={handleDelete}
            onPress={() => router.push({ pathname: '/listing/subscription/[id]', params: { id: item.id || item._id || '' } })}
            t={t}
          />
        )}
      />

      <Modal
        visible={showSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSheet(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity
            style={styles.flexFull}
            activeOpacity={1}
            onPress={() => setShowSheet(false)}
          />
          <View style={sheetInline.sheetWrap}>
            <View style={sheetInline.sheetHeader}>
              <Text style={styles.sheetTitle}>{t('subscription.newAlertTitle')}</Text>
              <TouchableOpacity
                onPress={() => { setShowSheet(false); setForm(EMPTY_FORM); }}
                hitSlop={8}
              >
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
                    onChangeText={(v) => set('priceMin')(v.replace(/[^0-9]/g, ''))}
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
                    onChangeText={(v) => set('priceMax')(v.replace(/[^0-9]/g, ''))}
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
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setShowSheet(false); setForm(EMPTY_FORM); }}
              >
                <Text style={styles.cancelText}>{t('mine.businesses.cancel')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

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

function AlertCard({ item, onDelete, onPress, t }: { item: Subscription; onDelete: (id: string) => void; onPress: () => void; t: any }) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const category = getCategoryByKey(item.category);
  const catIcon = category?.icon || 'tag-outline';
  const categoryLabel = t(`categories.${item.category}`, { defaultValue: category?.name ?? item.category });
  const i18nGroup = SUB_I18N_GROUP[item.category] ?? item.category?.toLowerCase();

  const subCategoryDef = category?.subCategories.find((s) => s.key === item.subCategory);
  const subCategoryLabel = item.subCategory
    ? t(`subcategories.${i18nGroup}.${item.subCategory}`, { defaultValue: subCategoryDef?.name ?? item.subCategory })
    : null;

  const nestedDef = subCategoryDef?.nested?.find((n) => n.key === item.nestedSubCategory);
  const nestedLabel = item.nestedSubCategory && nestedDef ? t(nestedDef.labelKey) : null;

  const meta: string[] = [];
  if (subCategoryLabel) meta.push(subCategoryLabel);
  if (nestedLabel) meta.push(nestedLabel);
  if (item.priceMin || item.priceMax) {
    const priceStr = item.priceMin && item.priceMax
      ? `${formatPrice(item.priceMin)} – ${formatPrice(item.priceMax)}`
      : item.priceMin ? `${t('subscription.minPrice')}: ${formatPrice(item.priceMin)}`
      : `${t('subscription.maxPrice')}: ${formatPrice(item.priceMax!)}`;
    meta.push(priceStr);
  }
  if (item.cities?.length) meta.push(item.cities.join(', '));
  if (item.region) meta.push(item.region);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconWrap}>
        <AppIcon name={catIcon} size={22} color={Colors.primary} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.keyword} numberOfLines={1}>
          {item.title || categoryLabel}
        </Text>
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{categoryLabel}</Text>
          </View>
        )}
        {meta.length > 0 && (
          <Text style={styles.meta} numberOfLines={2}>{meta.join(' · ')}</Text>
        )}
        {item.description ? (
          <Text style={styles.meta} numberOfLines={1}>{item.description}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item.id)}
        hitSlop={8}
      >
        <MaterialCommunityIcons name="delete-outline" size={18} color={Colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
