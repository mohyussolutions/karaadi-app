import { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, ActivityIndicator, Alert,
  Image, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KEYBOARD_AVOIDING_BEHAVIOR } from '../../../../platform/common-for-ios-andriod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { isSomaliPhone, isValidWebsite } from '../../../../util/validation/schemas';
import { REGEX_PHONE_INPUT_FILTER } from '../../../../constants';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { useAppTranslation } from '../../../../hooks/useAppTranslation';
import { createBusiness, updateBusiness } from '../../../../actions/core/business.actions';
import type { Business, BusinessApplyFormState } from '../../../../util/types/business.types';
import type { BusinessApplyStepProps } from '../../../../util/types/component.types';
import { createStyles } from '../../../../util/styles/business/businessCreate.styles';
import { getApiErrorMessage } from '../business.helpers';
import { SectionHeader, Field } from './FormControls';

export function ApplyStep({
  initialValues,
  initialLogo,
  isEditing,
  editId,
  accountEmail,
  plan,
  onSuccess,
  onCancel,
}: BusinessApplyStepProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const [form, setFormState] = useState<BusinessApplyFormState>(() =>
    isEditing ? initialValues : { ...initialValues, email: accountEmail },
  );
  const insets = useSafeAreaInsets();
  const [logo, setLogo] = useState<string | null>(initialLogo || null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const applySchema = useMemo(() => z.object({
    name: z.string().trim().min(1, { message: t('mine.businesses.nameRequired') }).max(150, { message: t('mine.businesses.nameTooLong') }),
    orgNumber: z.string().trim().max(50),
    email: z.string().trim().min(1, { message: t('mine.businesses.emailRequired') }).email({ message: t('mine.businesses.emailInvalid') }),
    phone: z.string().trim().min(1, { message: t('mine.businesses.phoneRequired') })
      .refine(isSomaliPhone, { message: t('mine.businesses.phoneInvalid') }),
    contactName: z.string().trim().max(100, { message: t('mine.businesses.contactNameTooLong') }),
    website: z.string().trim().max(200)
      .refine((v) => v === '' || isValidWebsite(v), { message: t('mine.businesses.websiteInvalid') }),
    address: z.string().trim().max(200, { message: t('mine.businesses.addressTooLong') }),
    description: z.string().trim().max(2000, { message: t('mine.businesses.descriptionTooLong') }),
  }), [t]);

  function set(key: keyof BusinessApplyFormState, value: string) {
    setFormState(p => ({ ...p, [key]: value }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  async function pickLogo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as const,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const mime = asset.mimeType === 'image/png' || asset.mimeType === 'image/webp' ? asset.mimeType : 'image/jpeg';
      setLogo(asset.base64 ? `data:${mime};base64,${asset.base64}` : asset.uri);
    }
  }

  function validate(): boolean {
    const result = applySchema.safeParse(form);
    if (!result.success) {
      const e: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!e[key]) e[key] = issue.message;
      }
      setErrors(e);
      return false;
    }
    setErrors({});
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const planId = plan ? (plan._id || plan.id) : undefined;
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        orgNumber: form.orgNumber.trim() || undefined,
        contactName: form.contactName.trim() || undefined,
        website: form.website.trim() || undefined,
        address: form.address.trim() || undefined,
        description: form.description.trim() || undefined,
        ...(logo && !logo.startsWith('http') ? { logo } : {}),
        ...(!isEditing && planId ? { planId } : {}),
      };

      if (isEditing && editId) {
        await updateBusiness(editId, payload);
        onSuccess({ _id: editId, ...payload } as Business);
      } else {
        const data = await createBusiness(payload);
        onSuccess(data?.business || data);
      }
    } catch (err) {
      Alert.alert(t('auth.common.error'), getApiErrorMessage(err) || t('mine.businesses.saveError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.flexFull} behavior={KEYBOARD_AVOIDING_BEHAVIOR}>
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 84 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {plan && (
          <View style={s.planBanner}>
            <View>
              <Text style={s.planBannerLabel}>{t('mine.businesses.selectedPlanLabel')}</Text>
              <Text style={s.planBannerName}>{plan.name}</Text>
            </View>
            <Text style={s.planBannerPrice}>${plan.price}</Text>
          </View>
        )}

        <View style={s.logoSection}>
          <Pressable onPress={pickLogo}>
            {logo
              ? <Image source={{ uri: logo }} style={s.logoImg} />
              : (
                <View style={s.logoPlaceholder}>
                  <MaterialCommunityIcons name="camera-plus-outline" size={32} color={Colors.primary} />
                  <Text style={s.logoHint}>{t('mine.businesses.addLogo')}</Text>
                </View>
              )}
          </Pressable>
          <View style={s.logoInfo}>
            <Text style={s.logoTitle}>{t('mine.businesses.logoLabel')}</Text>
            <Text style={s.logoSub}>{t('mine.businesses.logoHint')}</Text>
            {logo && (
              <TouchableOpacity onPress={() => setLogo(null)}>
                <Text style={s.logoRemove}>{t('mine.businesses.removeLogo')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <SectionHeader title={t('mine.businesses.businessInfo')} icon="office-building-outline" />

        <Field label={t('mine.businesses.companyName')} required error={errors.name}>
          <TextInput
            style={[s.input, errors.name && s.inputError]}
            value={form.name}
            onChangeText={v => set('name', v)}
            placeholder={t('mine.businesses.namePlaceholder')}
            placeholderTextColor={Colors.placeholder}
          />
        </Field>

        <View style={s.fieldRow}>
          <View style={s.fieldRowItem}>
            <Field label={t('mine.businesses.businessEmail')} required error={errors.email}>
              {isEditing ? (
                <TextInput
                  style={[s.input, errors.email && s.inputError]}
                  value={form.email}
                  onChangeText={v => set('email', v)}
                  placeholder={t('mine.businesses.emailPlaceholder')}
                  placeholderTextColor={Colors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <>
                  <TextInput
                    style={[s.input, s.inputLocked]}
                    value={form.email}
                    editable={false}
                  />
                  <Text style={s.fieldHint}>{t('mine.businesses.emailLocked')}</Text>
                </>
              )}
            </Field>
          </View>
          <View style={s.fieldRowItem}>
            <Field label={t('mine.businesses.phone')} required error={errors.phone}>
              <TextInput
                style={[s.input, errors.phone && s.inputError]}
                value={form.phone}
                onChangeText={v => set('phone', v.replace(REGEX_PHONE_INPUT_FILTER, ''))}
                placeholder={t('mine.businesses.phonePlaceholder')}
                placeholderTextColor={Colors.placeholder}
                keyboardType="phone-pad"
              />
            </Field>
          </View>
        </View>

        <View style={s.fieldRow}>
          <View style={s.fieldRowItem}>
            <Field label={t('mine.businesses.orgNumber')}>
              <TextInput
                style={s.input}
                value={form.orgNumber}
                onChangeText={v => set('orgNumber', v)}
                placeholder={t('mine.businesses.orgNumberPlaceholder')}
                placeholderTextColor={Colors.placeholder}
              />
            </Field>
          </View>
          <View style={s.fieldRowItem}>
            <Field label={t('mine.businesses.contactPerson')}>
              <TextInput
                style={s.input}
                value={form.contactName}
                onChangeText={v => set('contactName', v)}
                placeholder={t('mine.businesses.contactPersonPlaceholder')}
                placeholderTextColor={Colors.placeholder}
              />
            </Field>
          </View>
        </View>

        <Field label={t('mine.businesses.address')}>
          <TextInput
            style={s.input}
            value={form.address}
            onChangeText={v => set('address', v)}
            placeholder={t('mine.businesses.addressPlaceholder')}
            placeholderTextColor={Colors.placeholder}
          />
        </Field>

        <Field label={t('mine.businesses.website')}>
          <TextInput
            style={s.input}
            value={form.website}
            onChangeText={v => set('website', v)}
            placeholder={t('mine.businesses.websitePlaceholder')}
            placeholderTextColor={Colors.placeholder}
            keyboardType="url"
            autoCapitalize="none"
          />
        </Field>

        <Field label={t('mine.businesses.description')}>
          <TextInput
            style={[s.input, s.textarea]}
            value={form.description}
            onChangeText={v => set('description', v)}
            placeholder={t('mine.businesses.descriptionPlaceholder')}
            placeholderTextColor={Colors.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Field>

        <TouchableOpacity
          style={[s.submitBtn, submitting && s.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.88}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <MaterialCommunityIcons
                name={isEditing ? 'content-save-outline' : 'send-outline'}
                size={20}
                color={Colors.white}
              />
              <Text style={s.submitText}>
                {isEditing ? t('mine.businesses.saveChanges') : t('mine.businesses.submitApplication')}
              </Text>
              {!isEditing && <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />}
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={s.cancelBtn} onPress={onCancel}>
          <Text style={s.cancelText}>{t('mine.businesses.cancel')}</Text>
        </TouchableOpacity>

        <View style={s.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
