import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../src/api/client';
import { UPLOAD_ENDPOINTS } from '../../src/api/urls';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/store/authStore';

const CATEGORY_OPTIONS = [
  { label: 'Cars', value: 'cars', endpoint: '/api/cars' },
  { label: 'Real Estate', value: 'real-estate', endpoint: '/api/real-estate' },
  { label: 'Motorcycles', value: 'motorcycles', endpoint: '/api/motorcycles' },
  { label: 'Boats', value: 'boats', endpoint: '/api/boats' },
  { label: 'Marketplace', value: 'marketplace', endpoint: '/api/marketplace' },
  { label: 'Jobs', value: 'jobs', endpoint: '/api/jobs' },
  { label: 'Farm Equipment', value: 'farm-equipment', endpoint: '/api/traktor' },
  { label: 'Items', value: 'items', endpoint: '/api/items' },
  { label: 'Wanted', value: 'wanted', endpoint: '/api/wanted' },
];

export default function NewAdScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  async function pickImages() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Grant photo access to add images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 10));
    }
  }

  async function uploadImages(localUris: string[]): Promise<string[]> {
    const uploaded: string[] = [];
    for (const uri of localUris) {
      try {
        const form = new FormData();
        form.append('image', { uri, name: 'photo.jpg', type: 'image/jpeg' } as any);
        const { data } = await apiClient.post(UPLOAD_ENDPOINTS.IMAGE, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const url = data?.url || data?.imageUrl || data?.path;
        if (url) uploaded.push(url);
      } catch {}
    }
    return uploaded;
  }

  async function handleSubmit() {
    if (!user) { router.push('/(auth)/login'); return; }
    if (!title.trim()) { Alert.alert('Error', 'Please enter a title.'); return; }
    if (!description.trim()) { Alert.alert('Error', 'Please add a description.'); return; }
    setSubmitting(true);
    try {
      const uploadedImages = images.length > 0 ? await uploadImages(images) : [];
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: price ? Number(price) : 0,
        region: region.trim(),
        city: city.trim(),
        images: uploadedImages,
        mainCategory: category.value,
        category: category.value,
      };
      await apiClient.post(category.endpoint, payload);
      Alert.alert('Posted!', 'Your ad has been submitted successfully.', [
        { text: 'View My Ads', onPress: () => router.replace('/profile/my-ads') },
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to post ad. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.guestContainer}>
          <MaterialCommunityIcons name="plus-circle-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.guestTitle}>Post an Ad</Text>
          <Text style={styles.guestSub}>Sign in to start posting your listings.</Text>
          <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}><Text style={styles.headerTitle}>Post New Ad</Text></View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Category *</Text>
              <TouchableOpacity style={styles.select} onPress={() => setShowCategories(!showCategories)}>
                <Text style={styles.selectText}>{category.label}</Text>
                <MaterialCommunityIcons name={showCategories ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.textMuted} />
              </TouchableOpacity>
              {showCategories && (
                <View style={styles.dropdown}>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.dropdownItem, category.value === opt.value && styles.dropdownItemActive]}
                      onPress={() => { setCategory(opt); setShowCategories(false); }}
                    >
                      <Text style={[styles.dropdownText, category.value === opt.value && styles.dropdownTextActive]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Photos (up to 10)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesRow}>
                <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
                  <MaterialCommunityIcons name="camera-plus-outline" size={28} color={Colors.primary} />
                  <Text style={styles.addImageText}>Add Photos</Text>
                </TouchableOpacity>
                {images.map((uri, i) => (
                  <View key={i} style={styles.imagePreviewWrapper}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageBtn}
                      onPress={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    >
                      <MaterialCommunityIcons name="close-circle" size={18} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Toyota Corolla 2020"
                placeholderTextColor={Colors.placeholder}
                maxLength={120}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the item in detail..."
                placeholderTextColor={Colors.placeholder}
                multiline
                numberOfLines={5}
                maxLength={2000}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Price (USD)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={(v) => setPrice(v.replace(/[^0-9]/g, ''))}
                placeholder="0 = Price on request"
                placeholderTextColor={Colors.placeholder}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Region</Text>
                <TextInput
                  style={styles.input}
                  value={region}
                  onChangeText={setRegion}
                  placeholder="e.g. Banaadir"
                  placeholderTextColor={Colors.placeholder}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="e.g. Mogadishu"
                  placeholderTextColor={Colors.placeholder}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.disabledBtn]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitBtnText}>
                {submitting ? 'Posting...' : 'Post Ad'}
              </Text>
            </TouchableOpacity>
            <View style={{ height: 24 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  form: { padding: 16, gap: 4 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  input: {
    backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15, color: Colors.text,
    borderWidth: 1, borderColor: Colors.border,
  },
  textarea: { height: 110, textAlignVertical: 'top' },
  select: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 13, borderWidth: 1, borderColor: Colors.border,
  },
  selectText: { fontSize: 15, color: Colors.text },
  dropdown: {
    backgroundColor: Colors.white, borderRadius: 10, borderWidth: 1,
    borderColor: Colors.border, marginTop: 4, overflow: 'hidden',
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12 },
  dropdownItemActive: { backgroundColor: Colors.primaryLight },
  dropdownText: { fontSize: 15, color: Colors.text },
  dropdownTextActive: { color: Colors.primary, fontWeight: '600' },
  imagesRow: { flexDirection: 'row' },
  addImageBtn: {
    width: 90, height: 90, borderRadius: 10, borderWidth: 2, borderColor: Colors.primary,
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primaryLight + '30', marginRight: 8,
  },
  addImageText: { fontSize: 11, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  imagePreviewWrapper: { position: 'relative', marginRight: 8 },
  imagePreview: { width: 90, height: 90, borderRadius: 10, backgroundColor: Colors.border },
  removeImageBtn: { position: 'absolute', top: -6, right: -6 },
  row: { flexDirection: 'row', gap: 10 },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 12,
  },
  disabledBtn: { opacity: 0.65 },
  submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  guestContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  guestTitle: { fontSize: 22, fontWeight: '700', color: Colors.text },
  guestSub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
  signInBtn: {
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14,
    paddingHorizontal: 48, marginTop: 8,
  },
  signInText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
