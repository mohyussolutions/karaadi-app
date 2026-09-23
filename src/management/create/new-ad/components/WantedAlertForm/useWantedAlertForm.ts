import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../../../../store/hooks/authStore';
import { useAppTranslation } from '../../../../../hooks/useAppTranslation';
import { createSubscription } from '../../../../../actions/categories/subscription.actions';
import { MAIN_CATEGORIES, getCategoryByKey, SUB_I18N_GROUP, MAX_IMAGES } from '../../../../../constants';
import type { SubscriptionPayload, WantedFormState, UseWantedAlertFormArgs } from '../../../../../util/types';
import { maxLenSchema } from '../../../../../util/validation/schemas';
import { compressImageToDataUri } from '../../../../../util/helpers/imageCompression';
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

export function useWantedAlertForm({ onClose, onCreated }: UseWantedAlertFormArgs) {
  const { t } = useAppTranslation();
  const { user } = useAuthStore();

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
      selectionLimit: remaining,
    });
    if (result.canceled) return;
    const compressed: string[] = [];
    for (const { uri, width, height } of result.assets) {
      const dataUri = await compressImageToDataUri(uri, { width, height }).catch(() => null);
      if (dataUri) compressed.push(dataUri);
    }
    if (compressed.length < result.assets.length) {
      Alert.alert(t('postAd.imageProcessFailed', { count: result.assets.length - compressed.length }));
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, ...compressed].slice(0, MAX_IMAGES) }));
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

  return {
    form, set, saving,
    subCategories, nestedSubCategories,
    categoryOptions, subCategoryOptions, nestedSubCategoryOptions,
    handleCategoryChange, handleSubCategoryChange, handleClose,
    pickImages, removeImage, handleSave,
  };
}
