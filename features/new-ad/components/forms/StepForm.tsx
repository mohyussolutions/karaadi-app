import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../../hooks/useTheme";
import RegionCityPicker from "../../../../components/geo/RegionCityPicker";
import { MAIN_CATEGORIES } from "../../../../constants";
import { FormField } from "./FormField";
import { ImagePickerRow } from "./ImagePickerRow";
import { FIELDS, NUMERIC_KEYS, BOOLEAN_KEYS } from "../../constants/fields";
import { useAuthStore } from "../../../../store/authStore";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { submitListing, setFeeInfo } from "../../../../store/slices/newAdSlice";
import { getFeeForCategory } from "../../../../api/categories/fee.actions";
import type { FieldDef, StepFormProps } from "../../../../utils/types";
import { createStyles } from "./StepForm.styles";

function validate(
  fields: FieldDef[],
  formData: Record<string, string>,
  images: string[],
  t: (key: string, opts?: Record<string, unknown>) => string,
): Record<string, string> {
  const errors: Record<string, string> = {};
  fields.forEach((f) => {
    if (f.required && !formData[f.key]?.trim()) {
      errors[f.key] = t("postAd.fieldRequired", { label: f.label });
    }
    if (f.key === "year" && formData.year && !/^\d{4}$/.test(formData.year)) {
      errors.year = t("postAd.invalidYear");
    }
    if (f.key === "price" && formData.price && Number(formData.price) < 0) {
      errors.price = t("postAd.negativePrice");
    }
  });
  if (images.length < 2)
    errors._images = t("postAd.minPhotosRequired");
  return errors;
}

export function StepForm({
  categoryKey,
  listingType,
  onSuccess,
  onBack,
}: StepFormProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  const submitStatus = useAppSelector((state) => state.newAd.submitStatus);
  const submitError = useAppSelector((state) => state.newAd.submitError);

  const [formData, setFormData] = useState<Record<string, string>>(() => ({
    contactPhone: user?.phone || "",
  }));
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nestedSearch, setNestedSearch] = useState("");

  const submitting = submitStatus === "submitting";

  const categoryMeta = MAIN_CATEGORIES.find((c) => c.key === categoryKey);
  const fields = (FIELDS[categoryKey] || []).filter(
    (f) => f.key !== "website" || listingType === "public",
  );

  const selectedSubKey = formData.subcategory;
  const selectedSubMeta = categoryMeta?.subCategories.find(
    (s) => s.key === selectedSubKey,
  );
  const nestedOptions = selectedSubMeta?.nested ?? [];

  useEffect(() => {
    setNestedSearch("");
  }, [selectedSubKey]);

  const filteredNestedOptions = useMemo(() => {
    const q = nestedSearch.trim().toLowerCase();
    if (!q) return nestedOptions;
    return nestedOptions.filter((n) => t(n.labelKey).toLowerCase().includes(q));
  }, [nestedOptions, nestedSearch, t]);

  function setField(key: string, value: string) {
    setFormData((p) => {
      const next = { ...p, [key]: value };
      if (key === "subcategory") delete next.nestedSubcategory;
      return next;
    });
    if (errors[key])
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
  }

  async function handleSubmit() {
    const newErrors = validate(fields, formData, images, t);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const subVal =
        (categoryKey === "Jobs" ? formData.jobType : formData.subcategory) ||
        "";
      const nestedVal = formData.nestedSubcategory || "";

      const { feeId, feeAmount } = await getFeeForCategory(
        categoryKey,
        subVal || undefined,
      );
      dispatch(setFeeInfo({ feeId, feeAmount }));

      const {
        subcategory: _sub,
        nestedSubcategory: _nested,
        jobType: _jt,
        ...rest
      } = formData;

      const body: Record<string, any> = {
        ...rest,
        userId: user?.id || user?._id || "",
        images,
        mainCategory: categoryKey,
        category: subVal ? [subVal] : [],
        subcategory: nestedVal ? [nestedVal] : [],
        categoryTag: subVal,
        isPaid: feeAmount === 0,
        feeId: feeId || undefined,
        feeAmount: feeAmount,
        listingType: listingType ?? "private",
        contactPhone: formData.contactPhone || user?.phone || "",
      };

      const required = new Set(
        fields.filter((f) => f.required).map((f) => f.key),
      );
      Object.keys(body).forEach((k) => {
        if (
          body[k] === undefined ||
          body[k] === null ||
          (body[k] === "" && !required.has(k) && k !== "contactPhone")
        ) {
          delete body[k];
        }
      });

      NUMERIC_KEYS.forEach((k) => {
        if (body[k] !== undefined) body[k] = Number(body[k]);
      });
      BOOLEAN_KEYS.forEach((k) => {
        if (k in body) body[k] = body[k] === "Yes";
      });

      if (categoryKey === "Jobs" && subVal) body.type = subVal;

      const summary = {
        title: String(body.title || ""),
        price: Number(body.price || 0),
        images,
        categoryTag: String(body.categoryTag || body.category?.[0] || ""),
        mainCategory: categoryKey,
        region: formData.region || undefined,
        city: formData.city || undefined,
        make: body.make ? String(body.make) : undefined,
        model:
          body.modelName || body.boatModel || body.model
            ? String(body.modelName || body.boatModel || body.model)
            : undefined,
        year: body.year ? String(body.year) : undefined,
        mileage: body.mileage ? String(body.mileage) : undefined,
        type: body.type ? String(body.type) : undefined,
        color: body.color ? String(body.color) : undefined,
        description: body.description ? String(body.description) : undefined,
      };
      await dispatch(submitListing({ categoryKey, body, summary })).unwrap();
      onSuccess();
    } catch (err: any) {
      Alert.alert(
        t("auth.common.error"),
        submitError ||
          err?.message ||
          t("postAd.createListingError"),
      );
    }
  }

  return (
    <View style={s.root}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>
          {t(`categories.${categoryKey}`, { defaultValue: categoryMeta?.name ?? categoryKey })}
        </Text>
        <View style={s.topBarSpacer} />
      </View>
      <KeyboardAvoidingView
        style={s.flexFull}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={s.flexFull}
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>{t("postAd.mainCategoryLabel")}</Text>
            <View style={s.mainCatBadge}>
              {categoryMeta && (
                <MaterialCommunityIcons
                  name={categoryMeta.icon as any}
                  size={16}
                  color={Colors.primary}
                />
              )}
              <Text style={s.mainCatText}>
                {t(`categories.${categoryKey}`, { defaultValue: categoryMeta?.name ?? categoryKey })}
              </Text>
            </View>
          </View>

          <ImagePickerRow
            images={images}
            onChange={(imgs) => {
              setImages(imgs);
              if (errors._images)
                setErrors((e) => {
                  const n = { ...e };
                  delete n._images;
                  return n;
                });
            }}
            error={errors._images}
          />

          {fields.map((field) => {
            if (field.type === "phone") {
              return (
                <View key={field.key} style={s.fieldWrap}>
                  <Text style={s.fieldLabel}>{field.label}</Text>
                  <TextInput
                    style={[s.input, errors[field.key] ? s.inputError : null]}
                    value={formData[field.key] || ""}
                    onChangeText={(v) =>
                      setField(field.key, v.replace(/[^0-9+\-()\s]/g, ""))
                    }
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.placeholder}
                    keyboardType="phone-pad"
                  />
                  {!!errors[field.key] && (
                    <Text style={s.errorText}>{errors[field.key]}</Text>
                  )}
                </View>
              );
            }
            return (
              <React.Fragment key={field.key}>
                <FormField
                  field={field}
                  value={formData[field.key] || ""}
                  onChange={(v) => setField(field.key, v)}
                  error={errors[field.key]}
                />
                {field.key === "subcategory" && nestedOptions.length > 0 && (
                  <View style={s.nestedWrap}>
                    <Text style={s.nestedLabel}>{t("postAd.subCategoryLabel")}</Text>
                    <View style={s.nestedSearchBox}>
                      <MaterialCommunityIcons name="magnify" size={16} color={Colors.primary} />
                      <TextInput
                        style={s.nestedSearchInput}
                        value={nestedSearch}
                        onChangeText={setNestedSearch}
                        placeholder={t("postAd.searchTypePlaceholder")}
                        placeholderTextColor={Colors.placeholder}
                        autoCorrect={false}
                      />
                      {nestedSearch.length > 0 && (
                        <TouchableOpacity onPress={() => setNestedSearch("")} hitSlop={8}>
                          <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                    {filteredNestedOptions.length > 0 ? (
                      <View style={s.chipsRow}>
                        {filteredNestedOptions.map((n) => {
                          const active = formData.nestedSubcategory === n.key;
                          return (
                            <Pressable
                              key={n.key}
                              onPress={() =>
                                setField("nestedSubcategory", active ? "" : n.key)
                              }
                              style={[s.chip, active && s.chipActive]}
                              hitSlop={4}
                            >
                              <MaterialCommunityIcons
                                name={n.icon as any}
                                size={13}
                                color={active ? Colors.white : Colors.textSecondary}
                              />
                              <Text
                                style={[s.chipText, active && s.chipTextActive]}
                              >
                                {t(n.labelKey)}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    ) : (
                      <Text style={s.nestedEmptyText}>{t("postAd.noMatches")}</Text>
                    )}
                  </View>
                )}
              </React.Fragment>
            );
          })}

          <RegionCityPicker
            selectedRegion={formData.region || ""}
            selectedCity={formData.city || ""}
            onRegionChange={(name) => setField("region", name)}
            onCityChange={(name) => setField("city", name)}
          />

          {!!submitError && submitStatus === "error" && (
            <View style={s.errorBanner}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={16}
                color={Colors.error}
              />
              <Text style={s.errorBannerText}>{submitError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[s.btn, submitting && s.btnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <>
                <Text style={s.btnText}>{t("postAd.continueToPlan")}</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={18}
                  color={Colors.white}
                />
              </>
            )}
          </TouchableOpacity>

          <View style={s.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
