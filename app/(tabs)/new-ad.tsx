import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Alert, Image, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../src/api/client';
import { UPLOAD_ENDPOINTS, SUBSCRIPTION_ENDPOINTS } from '../../src/constants/endpoints';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';
import { MAIN_CATEGORIES } from '../../src/constants/categories';
import RegionCityPicker from '../../src/components/RegionCityPicker';

type ListingType = 'private' | 'public';
type Step = 'type' | 'category' | 'form' | 'plan' | 'payment';

interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  type: string;
}

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  numeric?: boolean;
  options?: string[];
  required?: boolean;
}

const CATEGORY_ENDPOINTS: Record<string, string> = {
  Marketplace: '/api/marketplace',
  Cars: '/api/cars',
  RealEstate: '/api/real-estate',
  Motorcycles: '/api/motorcycles',
  Boats: '/api/boats',
  farmequipment: '/api/traktor',
};

const CATEGORY_ITEM_MODEL: Record<string, string> = {
  Marketplace: 'MarketplaceItem',
  Cars: 'Car',
  RealEstate: 'RealEstate',
  Motorcycles: 'Motorcycle',
  Boats: 'Boat',
  farmequipment: 'FarmEquipment',
};

const FIELDS: Record<string, FieldDef[]> = {
  Marketplace: [
    { key: 'title', label: 'Title', placeholder: 'e.g. Samsung Galaxy S23', required: true },
    { key: 'condition', label: 'Condition', placeholder: '', options: ['New', 'Used – Like New', 'Used – Good', 'Used – Fair'], required: true },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', numeric: true },
    { key: 'description', label: 'Description', placeholder: 'Describe your item in detail...', multiline: true, required: true },
  ],
  Cars: [
    { key: 'title', label: 'Title', placeholder: 'e.g. Toyota Camry 2022 – Low Mileage', required: true },
    { key: 'brand', label: 'Make', placeholder: 'e.g. Toyota', required: true },
    { key: 'model', label: 'Model', placeholder: 'e.g. Camry', required: true },
    { key: 'year', label: 'Year', placeholder: 'e.g. 2022', numeric: true },
    { key: 'mileage', label: 'Mileage (km)', placeholder: 'e.g. 45000', numeric: true },
    { key: 'fuelType', label: 'Fuel Type', placeholder: '', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Other'] },
    { key: 'transmission', label: 'Gearbox', placeholder: '', options: ['Manual', 'Automatic'] },
    { key: 'color', label: 'Color', placeholder: 'e.g. White' },
    { key: 'condition', label: 'Condition', placeholder: '', options: ['New', 'Used', 'Certified Pre-Owned'] },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', numeric: true, required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe your car...', multiline: true, required: true },
    { key: 'tiktok', label: 'TikTok Link', placeholder: 'https://www.tiktok.com/@karaadi_' },
  ],
  RealEstate: [
    { key: 'title', label: 'Title', placeholder: 'e.g. Spacious 3BR Apartment in Mogadishu', required: true },
    { key: 'propertyType', label: 'Property Type', placeholder: '', options: ['Apartment / Flat', 'House / Villa', 'Commercial Office', 'Warehouse', 'Land', 'Farm'] },
    { key: 'bedrooms', label: 'Bedrooms', placeholder: 'e.g. 3', numeric: true },
    { key: 'bathrooms', label: 'Bathrooms', placeholder: 'e.g. 2', numeric: true },
    { key: 'area', label: 'Size (sqm)', placeholder: 'e.g. 120', numeric: true },
    { key: 'furnished', label: 'Furnished', placeholder: '', options: ['Yes', 'No'] },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', numeric: true, required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe the property in detail...', multiline: true, required: true },
  ],
  Motorcycles: [
    { key: 'title', label: 'Title', placeholder: 'e.g. Honda CB500 2021', required: true },
    { key: 'brand', label: 'Make', placeholder: 'e.g. Honda' },
    { key: 'model', label: 'Model', placeholder: 'e.g. CB500' },
    { key: 'year', label: 'Year', placeholder: 'e.g. 2021', numeric: true },
    { key: 'mileage', label: 'Mileage (km)', placeholder: 'e.g. 8000', numeric: true },
    { key: 'condition', label: 'Condition', placeholder: '', options: ['New', 'Used'] },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', numeric: true, required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe your motorcycle...', multiline: true, required: true },
  ],
  Boats: [
    { key: 'title', label: 'Title', placeholder: 'e.g. Fishing Boat 2019', required: true },
    { key: 'brand', label: 'Make', placeholder: 'e.g. Yamaha' },
    { key: 'model', label: 'Model', placeholder: 'e.g. F40' },
    { key: 'year', label: 'Year', placeholder: 'e.g. 2019', numeric: true },
    { key: 'length', label: 'Length (ft)', placeholder: 'e.g. 22', numeric: true },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', numeric: true, required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe the boat...', multiline: true, required: true },
  ],
  farmequipment: [
    { key: 'title', label: 'Title', placeholder: 'e.g. John Deere 5075E Tractor 2020', required: true },
    { key: 'brand', label: 'Brand', placeholder: 'e.g. John Deere' },
    { key: 'model', label: 'Model', placeholder: 'e.g. 5075E' },
    { key: 'year', label: 'Year', placeholder: 'e.g. 2020', numeric: true },
    { key: 'hours', label: 'Hours Used', placeholder: 'e.g. 1200', numeric: true },
    { key: 'condition', label: 'Condition', placeholder: '', options: ['New', 'Used', 'Refurbished'] },
    { key: 'price', label: 'Price ($)', placeholder: '0 = price on request', numeric: true, required: true },
    { key: 'description', label: 'Description', placeholder: 'Describe the equipment condition and usage history...', multiline: true, required: true },
  ],
};

const PLAN_STYLE: Record<string, { color: string; icon: string; bg: string }> = {
  basic:    { color: '#6B7280', icon: 'shield-outline',   bg: '#F3F4F6' },
  standard: { color: Colors.primary, icon: 'lightning-bolt', bg: '#EFF6FF' },
  premium:  { color: '#D97706', icon: 'star',             bg: '#FFFBEB' },
};

const FALLBACK_PLANS: Plan[] = [
  { _id: 'basic',    name: 'Basic',    price: 5,  duration: 30, features: ['30 days visibility', 'Standard placement', 'Search listing'],                                             type: 'basic' },
  { _id: 'standard', name: 'Standard', price: 15, duration: 60, features: ['60 days visibility', 'Priority placement', 'Featured in category', 'Bold title'],                        type: 'standard' },
  { _id: 'premium',  name: 'Premium',  price: 25, duration: 90, features: ['90 days visibility', 'Top placement', 'Featured on homepage', 'Bold + highlight', 'Priority support'], type: 'premium' },
];

const ITEM_FEE = 0;

function CheckoutBar({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: 'form',    label: 'New Ad' },
    { key: 'plan',    label: 'Plan' },
    { key: 'payment', label: 'Payment' },
  ];
  const relevant = steps.filter((s) => ['form', 'plan', 'payment'].includes(step));
  const activeIdx = steps.findIndex((s) => s.key === step);

  return (
    <View style={cb.bar}>
      {steps.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        const color = done || active ? Colors.primary : Colors.gray300;
        return (
          <React.Fragment key={s.key}>
            <View style={cb.item}>
              <View style={[cb.dot, { backgroundColor: done || active ? Colors.primary : Colors.gray200 }]}>
                {done
                  ? <MaterialCommunityIcons name="check" size={11} color="#fff" />
                  : <Text style={[cb.dotNum, active && cb.dotNumActive]}>{i + 1}</Text>}
              </View>
              <Text style={[cb.label, (done || active) && cb.labelActive]}>{s.label}</Text>
            </View>
            {i < steps.length - 1 && <View style={[cb.line, done && cb.lineDone]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const cb = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  item: { alignItems: 'center', gap: 3 },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dotNum: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  dotNumActive: { color: '#fff' },
  label: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
  labelActive: { color: Colors.primary },
  line: { flex: 1, height: 2, backgroundColor: Colors.gray200, marginBottom: 16 },
  lineDone: { backgroundColor: Colors.primary },
});

export default function NewAdScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [step, setStep] = useState<Step>('type');
  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [categoryKey, setCategoryKey] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [images, setImages] = useState<string[]>([]);
  const [creatingListing, setCreatingListing] = useState(false);
  const [listingId, setListingId] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mobileMoney' | 'card'>('mobileMoney');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (step === 'plan' && plans.length === 0) {
      setPlansLoading(true);
      apiClient.get(SUBSCRIPTION_ENDPOINTS.PLANS)
        .then(({ data }) => {
          const list = Array.isArray(data) ? data : data?.plans || [];
          setPlans(list.length > 0 ? list : FALLBACK_PLANS);
        })
        .catch(() => setPlans(FALLBACK_PLANS))
        .finally(() => setPlansLoading(false));
    }
  }, [step]);

  if (!user) {
    return (
      <SafeAreaView style={s.safe} edges={[]}>
        <View style={s.guestWrap}>
          <MaterialCommunityIcons name="plus-circle-outline" size={64} color={Colors.textMuted} />
          <Text style={s.guestTitle}>{t('nav.newAd')}</Text>
          <Text style={s.guestSub}>{t('auth.login.noAccount')}</Text>
          <TouchableOpacity style={s.signInBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={s.signInText}>{t('auth.login.loginButton')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  async function pickImages() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t('auth.common.error'), 'Photo access required.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 16,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 16));
    }
  }

  async function uploadImages(): Promise<string[]> {
    const uploaded: string[] = [];
    for (const uri of images) {
      try {
        const form = new FormData();
        form.append('image', { uri, name: 'photo.jpg', type: 'image/jpeg' } as any);
        const { data } = await apiClient.post(UPLOAD_ENDPOINTS.IMAGE, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        const url = data?.url || data?.imageUrl || data?.path;
        if (url) uploaded.push(url);
      } catch {}
    }
    return uploaded;
  }

  async function submitForm() {
    const fields = FIELDS[categoryKey] || [];
    const missing = fields.filter((f) => f.required && !formData[f.key]?.trim());
    if (missing.length > 0) {
      Alert.alert(t('auth.common.error'), `Required: ${missing.map((f) => f.label).join(', ')}`);
      return;
    }
    if (images.length === 0) {
      Alert.alert(t('auth.common.error'), 'Please upload at least one image.');
      return;
    }
    setCreatingListing(true);
    try {
      const uploadedImages = await uploadImages();
      const endpoint = CATEGORY_ENDPOINTS[categoryKey] || '/api/marketplace';
      const numericKeys = ['price', 'year', 'mileage', 'bedrooms', 'bathrooms', 'area', 'length', 'hours'];
      const payload: Record<string, any> = {
        ...formData,
        images: uploadedImages,
        mainCategory: categoryKey,
        category: categoryKey.toLowerCase(),
        listingType,
      };
      numericKeys.forEach((k) => { if (payload[k]) payload[k] = Number(payload[k]); });
      const { data } = await apiClient.post(endpoint, payload);
      const id = data?._id || data?.id || data?.listing?._id || '';
      setListingId(id);
      setStep('plan');
    } catch (err: any) {
      Alert.alert(t('auth.common.error'), err?.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setCreatingListing(false);
    }
  }

  async function confirmPayment() {
    if (!selectedPlan) return;
    setSubmitting(true);
    try {
      if (listingId) {
        await apiClient.post(SUBSCRIPTION_ENDPOINTS.SUBSCRIBE, {
          listingId,
          planId: selectedPlan._id,
          paymentMethod,
          itemModel: CATEGORY_ITEM_MODEL[categoryKey] || 'Listing',
        }).catch(() => {});
      }
      Alert.alert(
        t('businesses.myAds.paymentSuccess'),
        `Your listing is now active with the ${selectedPlan.name} plan.`,
        [
          { text: 'My Ads', onPress: () => router.replace('/profile/my-ads') },
          { text: t('auth.common.ok'), onPress: () => router.replace('/(tabs)') },
        ],
      );
    } catch {
      Alert.alert(t('auth.common.error'), 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const categoryMeta = MAIN_CATEGORIES.find((c) => c.key === categoryKey);
  const fields = FIELDS[categoryKey] || [];
  const planStyle = selectedPlan
    ? (PLAN_STYLE[selectedPlan.type?.toLowerCase()] || PLAN_STYLE.basic)
    : null;
  const total = ITEM_FEE + (selectedPlan?.price ?? 0);

  return (
    <SafeAreaView style={s.safe} edges={[]}>
      {['form', 'plan', 'payment'].includes(step) && <CheckoutBar step={step} />}

      {step === 'type' && (
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.pageTitle}>{t('createAd.selectType')}</Text>
          <View style={s.typeCards}>
            {([
              { type: 'private' as ListingType, label: t('createAd.private'), sub: 'Individual seller', icon: 'account-outline', bg: '#EFF6FF', color: Colors.primary },
              { type: 'public' as ListingType, label: t('createAd.public'), sub: 'Business / Company', icon: 'store-outline', bg: '#F0FDF4', color: Colors.secondary },
            ]).map((opt) => (
              <TouchableOpacity key={opt.type} style={s.typeCard} onPress={() => { setListingType(opt.type); setStep('category'); }} activeOpacity={0.85}>
                <View style={[s.typeIcon, { backgroundColor: opt.bg }]}>
                  <MaterialCommunityIcons name={opt.icon as any} size={32} color={opt.color} />
                </View>
                <View style={s.typeInfo}>
                  <Text style={s.typeTitle}>{opt.label}</Text>
                  <Text style={s.typeSub}>{opt.sub}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {step === 'category' && (
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.pageTitle}>{t('createAd.categories')}</Text>
          <View style={s.catGrid}>
            {MAIN_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[s.catCard, categoryKey === cat.key && { borderColor: cat.color, borderWidth: 2, backgroundColor: cat.color + '10' }]}
                onPress={() => { setCategoryKey(cat.key); setFormData({}); setImages([]); }}
                activeOpacity={0.85}
              >
                <View style={[s.catIcon, { backgroundColor: cat.color + '20' }]}>
                  <MaterialCommunityIcons name={cat.icon as any} size={26} color={cat.color} />
                </View>
                <Text style={[s.catLabel, categoryKey === cat.key && { color: cat.color }]} numberOfLines={2}>
                  {cat.name}
                </Text>
                {categoryKey === cat.key && (
                  <MaterialCommunityIcons name="check-circle" size={16} color={cat.color} style={s.catCheck} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          {categoryKey ? (
            <TouchableOpacity style={s.primaryBtn} onPress={() => setStep('form')}>
              <Text style={s.primaryBtnText}>Continue</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={s.backLink} onPress={() => setStep('type')}>
            <Text style={s.backLinkText}>← Back</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {step === 'form' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
            <View style={s.formHeader}>
              {categoryMeta && (
                <View style={[s.catIconSmall, { backgroundColor: categoryMeta.color + '20' }]}>
                  <MaterialCommunityIcons name={categoryMeta.icon as any} size={18} color={categoryMeta.color} />
                </View>
              )}
              <Text style={s.pageTitle}>{categoryMeta?.name}</Text>
            </View>

            <Text style={s.fieldLabel}>
              Photos (max 16 · JPEG, PNG, WEBP)
              {images.length === 0 && <Text style={{ color: Colors.error }}> *</Text>}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.imagesRow}>
              <TouchableOpacity style={s.addImgBtn} onPress={pickImages}>
                <MaterialCommunityIcons name="camera-plus-outline" size={26} color={Colors.primary} />
                <Text style={s.addImgText}>Add</Text>
              </TouchableOpacity>
              {images.map((uri, i) => (
                <View key={i} style={s.imgWrap}>
                  <Image source={{ uri }} style={s.imgThumb} />
                  <TouchableOpacity style={s.imgRemove} onPress={() => setImages((p) => p.filter((_, idx) => idx !== i))}>
                    <MaterialCommunityIcons name="close-circle" size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {fields.map((field) => (
              <View key={field.key} style={s.fieldWrap}>
                <Text style={s.fieldLabel}>
                  {field.label}{field.required && <Text style={{ color: Colors.error }}> *</Text>}
                </Text>
                {field.options ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
                    {field.options.map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={[s.chip, formData[field.key] === opt && s.chipActive]}
                        onPress={() => setFormData((p) => ({ ...p, [field.key]: opt }))}
                      >
                        <Text style={[s.chipText, formData[field.key] === opt && s.chipTextActive]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <TextInput
                    style={[s.input, field.multiline && s.textarea]}
                    value={formData[field.key] || ''}
                    onChangeText={(v) => setFormData((p) => ({ ...p, [field.key]: field.numeric ? v.replace(/[^0-9]/g, '') : v }))}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.placeholder}
                    keyboardType={field.numeric ? 'number-pad' : 'default'}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 4 : 1}
                    textAlignVertical={field.multiline ? 'top' : 'center'}
                  />
                )}
              </View>
            ))}

            <RegionCityPicker
              selectedRegion={formData.region || ''}
              selectedCity={formData.city || ''}
              onRegionChange={(name) => setFormData((p) => ({ ...p, region: name }))}
              onCityChange={(name) => setFormData((p) => ({ ...p, city: name }))}
            />

            <TouchableOpacity
              style={[s.primaryBtn, creatingListing && s.btnDisabled]}
              onPress={submitForm}
              disabled={creatingListing}
            >
              {creatingListing
                ? <ActivityIndicator size="small" color="#fff" />
                : <>
                    <Text style={s.primaryBtnText}>Continue to Plan</Text>
                    <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
                  </>
              }
            </TouchableOpacity>
            <TouchableOpacity style={s.backLink} onPress={() => setStep('category')}>
              <Text style={s.backLinkText}>← Back</Text>
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {step === 'plan' && (
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.pageTitle}>{t('plan.selectHeading')} {t('plan.plan')}</Text>
          <Text style={s.pageSub}>{t('plan.feePreview')}</Text>

          {plansLoading
            ? <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
            : plans.map((plan) => {
                const ps = PLAN_STYLE[plan.type?.toLowerCase()] || PLAN_STYLE.basic;
                const chosen = selectedPlan?._id === plan._id;
                return (
                  <TouchableOpacity
                    key={plan._id}
                    style={[s.planCard, chosen && { borderColor: ps.color, borderWidth: 2 }]}
                    onPress={() => setSelectedPlan(plan)}
                    activeOpacity={0.88}
                  >
                    <View style={s.planTop}>
                      <View style={[s.planIcon, { backgroundColor: ps.bg }]}>
                        <MaterialCommunityIcons name={ps.icon as any} size={22} color={ps.color} />
                      </View>
                      <View style={s.planMeta}>
                        <Text style={[s.planName, { color: ps.color }]}>{plan.name}</Text>
                        <Text style={s.planDur}>{plan.duration} {t('plan.days')}</Text>
                      </View>
                      <View style={s.planRight}>
                        <Text style={[s.planPrice, { color: ps.color }]}>${plan.price}</Text>
                        <Text style={s.planCurr}>{t('plan.currency')}</Text>
                      </View>
                      {chosen && <MaterialCommunityIcons name="check-circle" size={20} color={ps.color} />}
                    </View>
                    <View style={s.planFeats}>
                      {(plan.features || []).map((f, i) => (
                        <View key={i} style={s.featRow}>
                          <MaterialCommunityIcons name="check" size={13} color={ps.color} />
                          <Text style={s.featText}>{f}</Text>
                        </View>
                      ))}
                    </View>
                    {chosen && (
                      <View style={[s.selectedBadge, { backgroundColor: ps.color }]}>
                        <Text style={s.selectedBadgeText}>{t('plan.selected')}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
          }

          {selectedPlan && (
            <TouchableOpacity style={s.primaryBtn} onPress={() => setStep('payment')}>
              <Text style={s.primaryBtnText}>Review &amp; Pay — ${selectedPlan.price}</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={s.backLink} onPress={() => setStep('form')}>
            <Text style={s.backLinkText}>← Back to Details</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {step === 'payment' && selectedPlan && planStyle && (
        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={s.pageTitle}>{t('paymentPage.heading')}</Text>
          <Text style={s.pageSub}>{t('paymentPage.subheading')}</Text>

          <View style={s.summaryCard}>
            <Text style={s.cardTitle}>{t('paymentPage.orderSummary')}</Text>
            {listingId ? (
              <View style={s.summaryRow}>
                <Text style={s.summaryKey}>{t('paymentPage.itemId')}</Text>
                <Text style={s.summaryVal} numberOfLines={1}>#{listingId.slice(-8).toUpperCase()}</Text>
              </View>
            ) : null}
            <View style={s.summaryRow}>
              <Text style={s.summaryKey}>Title</Text>
              <Text style={s.summaryVal} numberOfLines={1}>{formData.title}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryKey}>Category</Text>
              <Text style={s.summaryVal}>{categoryMeta?.name}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryKey}>{t('plan.itemFee')}</Text>
              <Text style={s.summaryVal}>{ITEM_FEE === 0 ? 'Free' : `$${ITEM_FEE}`}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryKey}>{t('plan.planPrice')}</Text>
              <Text style={[s.summaryVal, { color: planStyle.color }]}>${selectedPlan.price} · {selectedPlan.name}</Text>
            </View>
            <View style={[s.summaryRow, s.summaryRowLast]}>
              <Text style={[s.summaryKey, { fontWeight: '800', fontSize: 14 }]}>{t('paymentPage.total')}</Text>
              <Text style={s.totalAmt}>${total} {t('plan.currency')}</Text>
            </View>
          </View>

          <Text style={s.fieldLabel}>{t('paymentPage.selectPaymentType')}</Text>
          <View style={s.payMethods}>
            {([
              { key: 'mobileMoney' as const, label: t('paymentPage.mobileMoney'), icon: 'cellphone-wireless' },
              { key: 'card' as const, label: t('paymentPage.cardPayment'), icon: 'credit-card-outline' },
            ]).map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[s.payCard, paymentMethod === m.key && s.payCardActive]}
                onPress={() => setPaymentMethod(m.key)}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name={m.icon as any} size={24} color={paymentMethod === m.key ? Colors.primary : Colors.textMuted} />
                <Text style={[s.payLabel, paymentMethod === m.key && { color: Colors.primary }]}>{m.label}</Text>
                {paymentMethod === m.key && <MaterialCommunityIcons name="check-circle" size={18} color={Colors.primary} style={{ marginLeft: 'auto' }} />}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[s.confirmBtn, submitting && s.btnDisabled]}
            onPress={confirmPayment}
            disabled={submitting}
          >
            {submitting
              ? <ActivityIndicator size="small" color="#fff" />
              : <>
                  <MaterialCommunityIcons name="lock-outline" size={18} color="#fff" />
                  <Text style={s.confirmBtnText}>{t('paymentPage.confirmPayment')} — ${total}</Text>
                </>
            }
          </TouchableOpacity>
          <TouchableOpacity style={s.backLink} onPress={() => setStep('plan')}>
            <Text style={s.backLinkText}>← Change Plan</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, flexGrow: 1 },
  guestWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  guestTitle: { fontSize: 22, fontWeight: '700', color: Colors.text },
  guestSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  signInBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 48, marginTop: 8 },
  signInText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  pageSub: { fontSize: 13, color: Colors.textMuted, marginBottom: 16 },
  typeCards: { gap: 12, marginTop: 16 },
  typeCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: Colors.border },
  typeIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  typeInfo: { flex: 1 },
  typeTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  typeSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12, marginBottom: 16 },
  catCard: { width: '30%', alignItems: 'center', padding: 12, borderRadius: 14, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border, gap: 6 },
  catIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  catIconSmall: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  catLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center', lineHeight: 14 },
  catCheck: { position: 'absolute', top: 6, right: 6 },
  formHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  input: { backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  textarea: { height: 100, textAlignVertical: 'top' },
  chipsRow: { gap: 8, paddingBottom: 2 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  imagesRow: { marginBottom: 16 },
  addImgBtn: { width: 80, height: 80, borderRadius: 10, borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryLight + '20', marginRight: 8 },
  addImgText: { fontSize: 10, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  imgWrap: { position: 'relative', marginRight: 8 },
  imgThumb: { width: 80, height: 80, borderRadius: 10, backgroundColor: Colors.border },
  imgRemove: { position: 'absolute', top: -6, right: -6 },
  planCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border, position: 'relative', overflow: 'hidden' },
  planTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  planIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  planMeta: { flex: 1 },
  planName: { fontSize: 17, fontWeight: '800' },
  planDur: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  planRight: { alignItems: 'flex-end', marginRight: 8 },
  planPrice: { fontSize: 24, fontWeight: '900' },
  planCurr: { fontSize: 10, color: Colors.textMuted },
  planFeats: { gap: 6 },
  featRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featText: { fontSize: 13, color: Colors.textSecondary },
  selectedBadge: { position: 'absolute', top: 0, right: 0, paddingHorizontal: 10, paddingVertical: 4, borderBottomLeftRadius: 10 },
  selectedBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  summaryCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontSize: 12, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: Colors.border },
  summaryRowLast: { borderBottomWidth: 0 },
  summaryKey: { fontSize: 13, color: Colors.textSecondary },
  summaryVal: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, flex: 1, textAlign: 'right', marginLeft: 12 },
  totalAmt: { fontSize: 18, fontWeight: '900', color: Colors.primary },
  payMethods: { gap: 10, marginBottom: 20 },
  payCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  payCardActive: { borderColor: Colors.primary, backgroundColor: '#EFF6FF', borderWidth: 2 },
  payLabel: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15, marginTop: 8, marginBottom: 4 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, marginBottom: 8 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnDisabled: { opacity: 0.65 },
  backLink: { alignItems: 'center', paddingVertical: 10 },
  backLinkText: { fontSize: 13, color: Colors.textMuted },
});
