import { z } from "zod";
import {
  MAX_ADDRESS_LENGTH,
  MAX_PRICE,
  MAX_SHORT_TEXT_LENGTH,
  MAX_TEXTAREA_LENGTH,
  IMAGE_MAX_COUNT,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MIN_IMAGES_REQUIRED,
  MIN_TITLE_LENGTH,
  PASSWORD_MIN_LENGTH,
  REGEX_CONFIRMATION_CODE,
  REGEX_EMAIL,
  REGEX_PASSWORD_DIGIT,
  REGEX_PASSWORD_LOWERCASE,
  REGEX_PASSWORD_SPECIAL,
  REGEX_PASSWORD_UPPERCASE,
  REGEX_PHONE_CLEAN,
  REGEX_SOMALI_PHONE_FULL,
  REGEX_SOMALI_PHONE_LOCAL,
  REGEX_USERNAME,
  REGEX_WEBSITE,
  REGEX_YEAR,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from "../../constants";
import type { FieldDef } from "../types";

type Translate = (key: string, opts?: Record<string, unknown>) => string;
type FormData = Record<string, string>;
type FieldCheck = (
  field: FieldDef,
  formData: FormData,
  t: Translate,
) => string | undefined;

export const isSomaliPhone = (v: string): boolean => {
  const cleaned = v.replace(REGEX_PHONE_CLEAN, "");
  return (
    REGEX_SOMALI_PHONE_FULL.test(cleaned) ||
    REGEX_SOMALI_PHONE_LOCAL.test(cleaned)
  );
};

export const isValidWebsite = (v: string): boolean => REGEX_WEBSITE.test(v);

export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Email is required" })
  .regex(REGEX_EMAIL, { message: "Enter a valid email address" });

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, {
    message: `At least ${PASSWORD_MIN_LENGTH} characters`,
  })
  .regex(REGEX_PASSWORD_LOWERCASE, { message: "Add a lowercase letter" })
  .regex(REGEX_PASSWORD_UPPERCASE, { message: "Add an uppercase letter" })
  .regex(REGEX_PASSWORD_DIGIT, { message: "Add a number" })
  .regex(REGEX_PASSWORD_SPECIAL, { message: "Add a special character" });

export const usernameSchema = z
  .string()
  .trim()
  .min(USERNAME_MIN_LENGTH, {
    message: `At least ${USERNAME_MIN_LENGTH} characters`,
  })
  .max(USERNAME_MAX_LENGTH, {
    message: `At most ${USERNAME_MAX_LENGTH} characters`,
  })
  .regex(REGEX_USERNAME, {
    message: "Letters, numbers, underscore and period only",
  });

export const somaliPhoneSchema = z
  .string()
  .trim()
  .refine(isSomaliPhone, { message: "Enter a valid Somali phone number" });
export const confirmationCodeSchema = z
  .string()
  .trim()
  .regex(REGEX_CONFIRMATION_CODE, { message: "Enter the 6-digit code" });
export const maxLenSchema = (
  max: number,
  message = `Must be ${max} characters or fewer`,
) => z.string().trim().max(max, { message });

const isBlank = (value?: string): boolean => !value?.trim();

const lengthOf = (value?: string): number => value?.length ?? 0;

const textMaxLength = (key: string): number =>
  key === "title"
    ? MAX_TITLE_LENGTH
    : key === "address"
      ? MAX_ADDRESS_LENGTH
      : MAX_SHORT_TEXT_LENGTH;

const requiredCheck: FieldCheck = (f, data, t) =>
  f.required && isBlank(data[f.key])
    ? t("postAd.fieldRequired", { label: f.label })
    : undefined;

const titleCheck: FieldCheck = (f, data, t) =>
  f.key === "title" && data.title && data.title.trim().length < MIN_TITLE_LENGTH
    ? t("postAd.titleTooShort", {
        defaultValue: `Title must be at least ${MIN_TITLE_LENGTH} characters`,
      })
    : undefined;

const descriptionCheck: FieldCheck = (f, data, t) =>
  f.key === "description" &&
  data.description &&
  data.description.trim().length < MIN_DESCRIPTION_LENGTH
    ? t("postAd.descriptionTooShort", {
        defaultValue: `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`,
      })
    : undefined;

const yearCheck: FieldCheck = (f, data, t) =>
  f.key === "year" && data.year && !REGEX_YEAR.test(data.year)
    ? t("postAd.invalidYear")
    : undefined;

const priceCheck: FieldCheck = (f, data, t) => {
  if (f.key !== "price" || !data.price) return undefined;
  const price = Number(data.price);
  if (price < 0) return t("postAd.negativePrice");
  if (price > MAX_PRICE) {
    return t("postAd.priceTooLarge", { defaultValue: "Price is too large" });
  }
  return undefined;
};

const websiteCheck: FieldCheck = (f, data, t) =>
  f.key === "website" &&
  !isBlank(data.website) &&
  !isValidWebsite(data.website.trim())
    ? t("postAd.invalidWebsite")
    : undefined;

const textareaLengthCheck: FieldCheck = (f, data, t) =>
  f.type === "textarea" && lengthOf(data[f.key]) > MAX_TEXTAREA_LENGTH
    ? t("postAd.fieldTooLong", { label: f.label })
    : undefined;

const textLengthCheck: FieldCheck = (f, data, t) =>
  f.type === "text" && lengthOf(data[f.key]) > textMaxLength(f.key)
    ? t("postAd.fieldTooLong", { label: f.label })
    : undefined;

const FIELD_CHECKS: FieldCheck[] = [
  titleCheck,
  descriptionCheck,
  yearCheck,
  priceCheck,
  websiteCheck,
  textareaLengthCheck,
  textLengthCheck,
];

const lastDefined = (values: (string | undefined)[]): string | undefined =>
  values.reduce<string | undefined>((acc, v) => v ?? acc, undefined);

const validateField = (
  field: FieldDef,
  data: FormData,
  t: Translate,
): string | undefined =>
  requiredCheck(field, data, t) ??
  lastDefined(FIELD_CHECKS.map((check) => check(field, data, t)));

const validateFields = (
  fields: FieldDef[],
  data: FormData,
  t: Translate,
): FormData =>
  Object.fromEntries(
    fields.flatMap((f): [string, string][] => {
      const error = validateField(f, data, t);
      return error ? [[f.key, error]] : [];
    }),
  );

const validateLocation = (data: FormData, t: Translate): FormData => ({
  ...(isBlank(data.region) && {
    _region: t("postAd.regionRequired", { defaultValue: "Region is required" }),
  }),
  ...(isBlank(data.city) && {
    _city: t("postAd.cityRequired", { defaultValue: "City is required" }),
  }),
});

const validateImages = (images: string[], t: Translate): FormData => {
  if (images.length < MIN_IMAGES_REQUIRED) {
    return { _images: t("postAd.minPhotosRequired") };
  }
  if (images.length > IMAGE_MAX_COUNT) {
    return { _images: t("postAd.maxPhotosMessage", { max: IMAGE_MAX_COUNT }) };
  }
  return {};
};

export const validateStepForm = (
  fields: FieldDef[],
  formData: FormData,
  images: string[],
  t: Translate,
): Record<string, string> => ({
  ...validateFields(fields, formData, t),
  ...validateImages(images, t),
  ...validateLocation(formData, t),
});
