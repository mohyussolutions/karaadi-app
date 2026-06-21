import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
  Image, Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { getBusinessById, getMyBusinesses, createBusiness, updateBusiness } from '../../api/core/business.actions';
import { getImageUrl } from '../../util/helpers';
import { CheckoutBar } from '../../components/checklist';
import { BIZ_STEPS } from '../../config/navigation/checkbusiness';
import type { StepItem, BusinessPlan, BusinessApplyFormState } from '../../util/types';
import { LoadingSpinner } from '../../components/loading';
import { MAIN_CATEGORIES } from '../../config/navigation/categories';
import { useAuthStore } from '../../store/authStore';
import { useAppDispatch } from '../../store/store';
import { setListingType, setStep, setCategoryKey, setBusinessId } from '../../store/slices/newAdSlice';
import {
  fetchBusinessPlans, selectBusinessPlan, extendBusinessPlan,
} from '../../api/categories/businessPlan.actions';
import { createStyles } from '../../util/styles/profile/businessCreate.styles';

const APPROVAL_POLL_INTERVAL_MS = 5000;

const EMPTY: BusinessApplyFormState = {
  name: '', orgNumber: '', email: '', phone: '',
  contactName: '', website: '', address: '', description: '',
};

function isExpired(business: any): boolean {
  return !!business?.expiryDate && new Date(business.expiryDate) < new Date();
}

export default function BusinessCreateScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useAppTranslation();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!editId;
  const { user, loading: authLoading } = useAuthStore();

  const s = useThemedStyles(createStyles);

  const [bizStep, setBizStep] = useState(0);
  const [business, setBusinessRecord] = useState<any>(null);

  const [initialValues, setInitialValues] = useState<BusinessApplyFormState | null>(null);
  const [initialLogo, setInitialLogo] = useState<string | undefined>(undefined);
  const [loadingBiz, setLoadingBiz] = useState(true);

  const bizSteps: StepItem[] = BIZ_STEPS.map((step) => ({ key: step.key, label: t(step.labelKey) }));

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!user) return;
    if (isEditing && editId) {
      getBusinessById(editId)
        .then((data) => {
          setBusinessRecord(data);
          setInitialValues({
            name: data.name || '',
            orgNumber: data.orgNumber || '',
            email: data.email || '',
            phone: data.phone || '',
            contactName: data.contactName || '',
            website: data.website || '',
            address: data.address || '',
            description: data.description || '',
          });
          if (data.logo) setInitialLogo(getImageUrl(data.logo) || data.logo);

          if (data.status === 'active' && data.isVerified) {
            setBizStep(!data.planId || isExpired(data) ? 2 : 3);
          }
        })
        .catch(() => Alert.alert(t('auth.common.error'), t('mine.businesses.loadError')))
        .finally(() => setLoadingBiz(false));
      return;
    }

    getMyBusinesses()
      .then((list) => {
        const existing = list[0];
        if (existing) {
          setBusinessRecord(existing);
          if (existing.status === 'active' && existing.isVerified) {
            setBizStep(!existing.planId || isExpired(existing) ? 2 : 3);
          } else {
            setBizStep(1);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingBiz(false));
  }, [editId, user]);

  if (!user || loadingBiz) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <CheckoutBar steps={bizSteps} currentIndex={bizStep} />

      {bizStep === 0 && (
        <ApplyStep
          key={editId || 'new'}
          initialValues={initialValues || EMPTY}
          initialLogo={initialLogo}
          isEditing={isEditing}
          editId={editId}
          accountEmail={user.email}
          onSuccess={(biz) => {
            if (isEditing) { router.back(); return; }
            setBusinessRecord(biz);
            setBizStep(1);
          }}
          onCancel={() => router.back()}
        />
      )}

      {bizStep === 1 && business && (
        <ApprovalStep
          business={business}
          onApproved={(biz) => {
            setBusinessRecord(biz);
            setBizStep(!biz.planId || isExpired(biz) ? 2 : 3);
          }}
        />
      )}

      {bizStep === 2 && business && (
        <PlanStep
          business={business}
          onSelected={(biz) => {
            setBusinessRecord(biz);
            setBizStep(3);
          }}
        />
      )}

      {bizStep === 3 && business && (
        <PostStep
          business={business}
          onSelectCategory={(category) => {
            dispatch(setListingType('public'));
            dispatch(setCategoryKey(category));
            dispatch(setBusinessId(business._id || business.id));
            dispatch(setStep('form'));
            router.replace('/(tabs)/new-ad');
          }}
        />
      )}
    </SafeAreaView>
  );
}

function ApplyStep({
  initialValues,
  initialLogo,
  isEditing,
  editId,
  accountEmail,
  onSuccess,
  onCancel,
}: {
  initialValues: BusinessApplyFormState;
  initialLogo?: string;
  isEditing: boolean;
  editId?: string;
  accountEmail: string;
  onSuccess: (business: any) => void;
  onCancel: () => void;
}) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const [form, setFormState] = useState<BusinessApplyFormState>(() =>
    isEditing ? initialValues : { ...initialValues, email: accountEmail },
  );
  const [logo, setLogo] = useState<string | null>(initialLogo || null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const applySchema = useMemo(() => z.object({
    name: z.string().trim().min(1, { message: t('mine.businesses.nameRequired') }),
    orgNumber: z.string(),
    email: z.string().trim().min(1, { message: t('mine.businesses.emailRequired') }).email({ message: t('mine.businesses.emailInvalid') }),
    phone: z.string().trim().min(1, { message: t('mine.businesses.phoneRequired') }),
    contactName: z.string(),
    website: z.string(),
    address: z.string(),
    description: z.string(),
  }), [t]);

  function set(key: keyof BusinessApplyFormState, value: string) {
    setFormState(p => ({ ...p, [key]: value }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  async function pickLogo() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('mine.businesses.permissionRequired'), t('mine.businesses.photoAccessNeeded'));
      return;
    }
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
      const payload: Record<string, any> = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        orgNumber: form.orgNumber.trim() || undefined,
        contactName: form.contactName.trim() || undefined,
        website: form.website.trim() || undefined,
        address: form.address.trim() || undefined,
        description: form.description.trim() || undefined,
        ...(logo && !logo.startsWith('http') ? { logo } : {}),
      };

      if (isEditing && editId) {
        await updateBusiness(editId, payload);
        onSuccess({ _id: editId, ...payload });
      } else {
        const data = await createBusiness(payload);
        onSuccess(data?.business || data);
      }
    } catch (err: any) {
      Alert.alert(t('auth.common.error'), err?.response?.data?.message || t('mine.businesses.saveError'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.flexFull} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
                onChangeText={v => set('phone', v.replace(/[^0-9+\-()\s]/g, ''))}
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

function ApprovalStep({
  business,
  onApproved,
}: {
  business: any;
  onApproved: (biz: any) => void;
}) {
  const router = useRouter();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const [biz, setBiz] = useState(business);
  const [checking, setChecking] = useState(false);
  const id = biz._id || biz.id;

  const STATUS_META: Record<string, { icon: string; colorKey: 'primary' | 'success' | 'error'; title: string; message: string }> = useMemo(() => ({
    pending: {
      icon: 'clock-outline', colorKey: 'primary',
      title: t('mine.businesses.pendingTitle'),
      message: t('mine.businesses.pendingMessage'),
    },
    active: {
      icon: 'check-decagram', colorKey: 'success',
      title: t('mine.businesses.approvedTitle'),
      message: t('mine.businesses.approvedMessage'),
    },
    rejected: {
      icon: 'close-circle-outline', colorKey: 'error',
      title: t('mine.businesses.rejectedTitle'),
      message: t('mine.businesses.rejectedMessage'),
    },
  }), [t]);

  const poll = useCallback(async () => {
    setChecking(true);
    try {
      const list = await getMyBusinesses();
      const updated = list.find((b: any) => (b._id || b.id) === id) || list[0];
      if (updated) {
        setBiz(updated);
        if (updated.status === 'active' && updated.isVerified) {
          onApproved(updated);
        }
      }
    } catch {
    } finally {
      setChecking(false);
    }
  }, [id, onApproved]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, APPROVAL_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [poll]);

  const status: string = biz.status || 'pending';
  const meta = STATUS_META[status] || STATUS_META.pending;
  const color = Colors[meta.colorKey];

  return (
    <ScrollView contentContainerStyle={s.statusScroll}>
      <View style={[s.statusIconWrap, { backgroundColor: color + '18' }]}>
        <MaterialCommunityIcons name={meta.icon as any} size={56} color={color} />
      </View>
      <Text style={s.statusTitle}>{meta.title}</Text>
      <Text style={s.statusMessage}>{meta.message}</Text>

      <View style={s.statusCard}>
        <View style={s.statusRow}>
          <Text style={s.statusLabel}>{t('mine.businesses.businessLabel')}</Text>
          <Text style={s.statusValue}>{biz.name}</Text>
        </View>
        <View style={[s.statusRow, s.statusRowLast]}>
          <Text style={s.statusLabel}>{t('mine.businesses.statusLabel')}</Text>
          <View style={[s.statusBadge, { backgroundColor: color + '18' }]}>
            <Text style={[s.statusBadgeText, { color }]}>
              {t(`mine.businesses.${status}`, { defaultValue: status }).toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {status === 'rejected' && (
        <TouchableOpacity style={s.submitBtn} onPress={() => router.replace('/profile/businesses')} activeOpacity={0.88}>
          <MaterialCommunityIcons name="pencil-outline" size={18} color={Colors.white} />
          <Text style={s.submitText}>{t('mine.businesses.goToMyBusinesses')}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={s.refreshBtn} onPress={poll} disabled={checking}>
        {checking ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <>
            <MaterialCommunityIcons name="refresh" size={16} color={Colors.primary} />
            <Text style={s.refreshText}>{t('mine.businesses.checkAgain')}</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function PlanStep({
  business,
  onSelected,
}: {
  business: any;
  onSelected: (biz: any) => void;
}) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BusinessPlan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBusinessPlans().then(setPlans).finally(() => setLoading(false));
  }, []);

  function tierFor(plan: BusinessPlan): { label: string; color: string } {
    if (plan.durationDays >= 90) return { label: t('mine.businesses.tierPremium'), color: Colors.primary };
    if (plan.durationDays >= 60) return { label: t('mine.businesses.tierStandard'), color: Colors.success };
    return { label: t('mine.businesses.tierBasic'), color: Colors.textSecondary };
  }

  async function handleConfirm() {
    if (!selected) return;
    setSubmitting(true);
    try {
      const id = business._id || business.id;
      const planId = (selected as any)._id || selected.id;
      const action = business.planId ? extendBusinessPlan : selectBusinessPlan;
      const updated = await action(id, planId);
      onSelected(updated?._id || updated?.id ? updated : { ...business, planId });
    } catch (err: any) {
      Alert.alert(t('auth.common.error'), err?.response?.data?.message || t('mine.businesses.planError'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <ScrollView contentContainerStyle={s.scroll}>
      <Text style={s.heading}>
        {business.planId ? t('mine.businesses.renewPlan') : t('mine.businesses.selectPlanTitle')}
      </Text>
      <Text style={s.statusMessage}>{t('mine.businesses.selectPlanDesc', { name: business.name })}</Text>

      {plans.map((plan) => {
        const tier = tierFor(plan);
        const planId = (plan as any)._id || plan.id;
        const selectedId = selected ? ((selected as any)._id || selected.id) : null;
        const active = selectedId === planId;
        return (
          <TouchableOpacity
            key={planId}
            style={[s.planCard, active && s.planCardActive]}
            onPress={() => setSelected(plan)}
            activeOpacity={0.85}
          >
            <View style={s.planHeader}>
              <Text style={s.planName}>{plan.name}</Text>
              <View style={[s.tierBadge, { backgroundColor: tier.color + '18' }]}>
                <Text style={[s.tierBadgeText, { color: tier.color }]}>{tier.label}</Text>
              </View>
            </View>
            <Text style={s.planPrice}>
              ${plan.price} <Text style={s.planDuration}>/ {plan.durationDays} {t('mine.businesses.days')}</Text>
            </Text>
            <Text style={s.planMeta}>{t('mine.businesses.upToListings', { count: plan.maxListings })}</Text>
            {plan.features?.map((f, i) => (
              <View key={i} style={s.featureRow}>
                <MaterialCommunityIcons name="check" size={14} color={Colors.success} />
                <Text style={s.featureText}>{f}</Text>
              </View>
            ))}
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[s.submitBtn, (!selected || submitting) && s.submitBtnDisabled]}
        onPress={handleConfirm}
        disabled={!selected || submitting}
        activeOpacity={0.88}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <>
            <Text style={s.submitText}>{t('mine.businesses.confirmPlan')}</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={Colors.white} />
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function PostStep({
  business,
  onSelectCategory,
}: {
  business: any;
  onSelectCategory: (category: string) => void;
}) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const { t } = useAppTranslation();

  const BUSINESS_CATEGORIES = MAIN_CATEGORIES.map(c => ({
    label: t(`categories.${c.key}`, { defaultValue: c.name }),
    value: c.key,
    icon: c.icon,
  }));

  return (
    <ScrollView contentContainerStyle={s.scroll}>
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
              <MaterialCommunityIcons name={opt.icon as any} size={28} color={Colors.primary} />
            </View>
            <Text style={s.categoryGridLabel}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.sectionHeader}>
      <MaterialCommunityIcons name={icon as any} size={16} color={Colors.primary} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  const s = useThemedStyles(createStyles);
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>
        {label}{required && <Text style={s.req}> *</Text>}
      </Text>
      {children}
      {!!error && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
}
