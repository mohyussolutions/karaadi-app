import {
  View, Text, TouchableOpacity, Modal,
  TextInput, KeyboardAvoidingView, ScrollView, Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dropdown } from '../../../../components/forms';
import { REGEX_NON_DIGITS } from '../../../../constants';
import RegionCityPicker from '../../../../components/geo/RegionCityPicker';
import { useAppTranslation } from '../../../../hooks/useAppTranslation';
import { KEYBOARD_AVOIDING_BEHAVIOR } from '../../../../platform/common-for-ios-andriod';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import {
  createStyles, createSheetInlineStyles, createImagePickerStyles,
} from '../../../../util/styles/profile/wanted.styles';
import type { WantedAlertFormProps } from '../../../../util/types/new-ad.types';
import { useWantedAlertForm } from './useWantedAlertForm';

const MAX_IMAGES = 3;

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

function ImagePickerRow({
  images, onPick, onRemove,
}: {
  images: string[];
  onPick: () => void;
  onRemove: (index: number) => void;
}) {
  const Colors = useThemeColors();
  const imageStyles = useThemedStyles(createImagePickerStyles);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={imageStyles.row}>
      {images.length < MAX_IMAGES && (
        <TouchableOpacity style={imageStyles.addBtn} onPress={onPick} activeOpacity={0.75}>
          <MaterialCommunityIcons name="camera-plus-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>
      )}
      {images.map((uri, i) => (
        <View key={uri + i} style={imageStyles.imgWrap}>
          <Image source={{ uri }} style={imageStyles.thumb} />
          <TouchableOpacity style={imageStyles.remove} onPress={() => onRemove(i)} hitSlop={6}>
            <MaterialCommunityIcons name="close-circle" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

export function WantedAlertForm({ visible, onClose, onCreated }: WantedAlertFormProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const sheetInline = useThemedStyles(createSheetInlineStyles);

  const {
    form, set, saving,
    subCategories, nestedSubCategories,
    categoryOptions, subCategoryOptions, nestedSubCategoryOptions,
    handleCategoryChange, handleSubCategoryChange, handleClose,
    pickImages, removeImage, handleSave,
  } = useWantedAlertForm({ onClose, onCreated });

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
              <ImagePickerRow images={form.images} onPick={pickImages} onRemove={removeImage} />
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
