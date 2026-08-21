import { useCallback } from "react";
import { Alert } from "react-native";
import { useAppDispatch, useAppSelector } from "../../../../../store/store";
import { submitListing, setFeeInfo } from "../../../../../store/slices/newAdSlice";
import { getFeeForCategory } from "../../../../../actions/categories/fee.actions";
import { CATEGORY_MAIN_LABEL } from "../../constants/config";
import { NUMERIC_KEYS, BOOLEAN_KEYS } from "../../constants/fields";
import { REGEX_NON_DIGITS } from "../../../../../constants";
import type { FieldDef, ListingType, User } from "../../../../../util/types";

interface UseSubmitListingArgs {
  categoryKey: string;
  listingType: ListingType | null;
  fields: FieldDef[];
  formData: Record<string, string>;
  images: string[];
  user: User | null;
  onSuccess: () => void;
  t: (key: string, opts?: Record<string, unknown>) => string;
}

export function useSubmitListing({
  categoryKey,
  listingType,
  fields,
  formData,
  images,
  user,
  onSuccess,
  t,
}: UseSubmitListingArgs) {
  const dispatch = useAppDispatch();
  const submitStatus = useAppSelector((state) => state.newAd.submitStatus);
  const submitError = useAppSelector((state) => state.newAd.submitError);
  const submitting = submitStatus === "submitting";

  const submit = useCallback(async () => {
    try {
      const subVal =
        (categoryKey === "Jobs" ? formData.jobType : formData.subcategory) || "";
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
        name: formData.title || "",
        images,
        mainCategory: CATEGORY_MAIN_LABEL[categoryKey] || categoryKey,
        category: subVal ? [subVal] : [],
        subcategory: nestedVal ? [nestedVal] : [],
        categoryTag: subVal,
        isPaid: feeAmount === 0,
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

      if (categoryKey === "Jobs") {
        if (subVal) body.employmentType = subVal;
        const salaryDigits = String(body.salaryRange || "").replace(REGEX_NON_DIGITS, "");
        body.salary = salaryDigits ? Number(salaryDigits) : 0;
        delete body.salaryRange;
        delete body.educationLevel;
        delete body.name;
        delete body.categoryTag;
        delete body.listingType;
        delete body.contactPhone;
      }

      if (categoryKey === "farmequipment") {
        if (body.equipmentType !== undefined) body.type = body.equipmentType;
        if (body.brand !== undefined) body.make = body.brand;
        if (body.hoursUsed !== undefined) body.hours = body.hoursUsed;
      }

      if (categoryKey === "RealEstate") {
        if (body.region !== undefined) body.county = body.region;
        if (body.sizeSqm !== undefined) body.squareFeet = body.sizeSqm;
        if (body.amenities === undefined) body.amenities = [];
      }

      const SKIP_KEYS = new Set([
        'userId', 'images', 'mainCategory', 'category', 'categoryTag',
        'isPaid', 'feeId', 'feeAmount', 'listingType', 'contactPhone',
        'nestedSubcategory',
      ]);

      const allAttrs = fields
        .filter((f) => {
          const v = formData[f.key];
          return v && v.trim() && !SKIP_KEYS.has(f.key);
        })
        .map((f) => {
          const rawVal = formData[f.key] || '';
          let displayVal = rawVal;
          if (f.type === 'dropdown' && f.options) {
            const matched = f.options.find((o) =>
              typeof o === 'string' ? o === rawVal : o.value === rawVal,
            );
            if (matched && typeof matched !== 'string') displayVal = matched.label;
            else if (typeof matched === 'string') displayVal = matched;
          }
          return { label: f.label, value: displayVal };
        });

      if (formData.region) allAttrs.push({ label: t('common.region'), value: formData.region });
      if (formData.city) allAttrs.push({ label: t('common.city'), value: formData.city });

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
        allAttrs,
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
  }, [categoryKey, listingType, fields, formData, images, user, dispatch, onSuccess, submitError, t]);

  return { submitting, submitError, submitStatus, submit };
}
