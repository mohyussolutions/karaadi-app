import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../../../components/hooks/useTheme";
import { KEYBOARD_AVOIDING_BEHAVIOR } from "../../../../../common/common-for-ios-andriod";
import { useTabBarClearance } from "../../../../../components/hooks/useTabBarClearance";
import RegionCityPicker from "../../../../../components/geo/RegionCityPicker";
import { MAIN_CATEGORIES } from "../../../../../constants";
import { FormField } from "../../../../../components/forms/FormField";
import { ImagePickerRow } from "../../../../../components/forms/ImagePickerRow";
import { CollapsibleSection } from "../../../../../components/forms/CollapsibleSection";
import { getFields } from "../../constants/fields";
import { useAuthStore } from "../../../../../store/hooks/authStore";
import type { FieldDef, StepFormProps } from "../../../../../util/types";
import { createStyles } from "../../../../../util/styles/new-ad/stepForm.styles";
import { validateStepForm } from "../../../../../util/validation/schemas";
import { useSubmitListing } from "./useSubmitListing";
import { NestedSubcategoryPicker } from "./NestedSubcategoryPicker";

export function StepForm({
  categoryKey,
  listingType,
  onSuccess,
  onBack,
}: StepFormProps) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const clearance = useTabBarClearance();

  const [formData, setFormData] = useState<Record<string, string>>(() => ({
    contactPhone: user?.phone || "",
  }));
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nestedSearch, setNestedSearch] = useState("");

  const categoryMeta = MAIN_CATEGORIES.find((c) => c.key === categoryKey);

  const allFields: Record<string, FieldDef[]> = useMemo(
    () => getFields(t as (key: string, opts?: Record<string, unknown>) => string),
    [t],
  );
  const fields: FieldDef[] = useMemo(
    () => (allFields[categoryKey] || []).filter(
      (f: FieldDef) => f.key !== "website" || listingType === "public",
    ),
    [allFields, categoryKey, listingType],
  );

  const primaryFields = useMemo(() => fields.filter((f) => f.required), [fields]);
  const extraFields = useMemo(() => fields.filter((f) => !f.required), [fields]);
  const extraFieldsHaveError = extraFields.some((f) => !!errors[f.key]);
  const scrollRef = useRef<ScrollView>(null);

  const selectedSubKey = formData.subcategory;
  const selectedSubMeta = categoryMeta?.subCategories.find(
    (sc) => sc.key === selectedSubKey,
  );
  const nestedOptions = selectedSubMeta?.nested ?? [];

  useEffect(() => {
    setNestedSearch("");
  }, [selectedSubKey]);

  const { submitting, submitError, submitStatus, submit } = useSubmitListing({
    categoryKey,
    listingType,
    fields,
    formData,
    images,
    user,
    onSuccess,
    t,
  });

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
    const newErrors = validateStepForm(fields, formData, images, t);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    await submit();
  }

  function renderField(field: FieldDef) {
    return (
      <React.Fragment key={field.key}>
        <FormField
          field={field}
          value={formData[field.key] || ""}
          onChange={(v) => setField(field.key, v)}
          error={errors[field.key]}
        />
        {field.key === "subcategory" && nestedOptions.length > 0 && (
          <NestedSubcategoryPicker
            options={nestedOptions}
            search={nestedSearch}
            onSearchChange={setNestedSearch}
            selectedKey={formData.nestedSubcategory || ""}
            onSelect={(key) => setField("nestedSubcategory", key)}
          />
        )}
      </React.Fragment>
    );
  }

  return (
    <View style={s.root}>
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={onBack} hitSlop={8}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={s.flexFull}
        behavior={KEYBOARD_AVOIDING_BEHAVIOR}
      >
        <ScrollView
          ref={scrollRef}
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

          {primaryFields.map((field) => renderField(field))}

          {extraFields.length > 0 && (
            <CollapsibleSection
              title={t("postAd.additionalDetails", { defaultValue: "Additional details" })}
              hasError={extraFieldsHaveError}
            >
              {extraFields.map((field) => renderField(field))}
            </CollapsibleSection>
          )}

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

          <View style={{ height: clearance }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
