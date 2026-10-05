import { useMemo } from "react";
import { z } from "zod";

import { BUSINESS_FIELD_LIMITS } from "../../actions/constants";
import {
  confirmationCodeSchema,
  emailSchema,
  isSomaliPhone,
  isValidWebsite,
  passwordSchema,
  usernameSchema,
} from "../../lib/validation/schemas";
import { useAppTranslation } from "../app/useAppTranslation";

import type { RegistrationCheck, ResetPasswordKey, Translate } from "../../utils/types";

const trimmed = () => z.string().trim();

const bizMessage = (t: Translate, key: string) => ({
  message: t(`mine.businesses.${key}`),
});

const isBlankOrWebsite = (value: string) =>
  value === "" || isValidWebsite(value);

const nameField = (t: Translate) =>
  trimmed()
    .min(1, bizMessage(t, "nameRequired"))
    .max(BUSINESS_FIELD_LIMITS.name, bizMessage(t, "nameTooLong"));

const orgNumberField = () => trimmed().max(BUSINESS_FIELD_LIMITS.orgNumber);

const emailField = (t: Translate) =>
  trimmed()
    .min(1, bizMessage(t, "emailRequired"))
    .email(bizMessage(t, "emailInvalid"));

const phoneField = (t: Translate) =>
  trimmed()
    .min(1, bizMessage(t, "phoneRequired"))
    .refine(isSomaliPhone, bizMessage(t, "phoneInvalid"));

const contactNameField = (t: Translate) =>
  trimmed().max(
    BUSINESS_FIELD_LIMITS.contactName,
    bizMessage(t, "contactNameTooLong"),
  );

const websiteField = (t: Translate) =>
  trimmed()
    .max(BUSINESS_FIELD_LIMITS.website)
    .refine(isBlankOrWebsite, bizMessage(t, "websiteInvalid"));

const addressField = (t: Translate) =>
  trimmed().max(BUSINESS_FIELD_LIMITS.address, bizMessage(t, "addressTooLong"));

const descriptionField = (t: Translate) =>
  trimmed().max(
    BUSINESS_FIELD_LIMITS.description,
    bizMessage(t, "descriptionTooLong"),
  );

export const buildBusinessApplySchema = (t: Translate) =>
  z.object({
    name: nameField(t),
    orgNumber: orgNumberField(),
    email: emailField(t),
    phone: phoneField(t),
    contactName: contactNameField(t),
    website: websiteField(t),
    address: addressField(t),
    description: descriptionField(t),
  });

export const useBusinessApplySchema = () => {
  const { t } = useAppTranslation();
  return useMemo(() => buildBusinessApplySchema(t), [t]);
};

const checkUsername = (username: string) => {
  const parsed = usernameSchema.safeParse(username);
  return parsed.success
    ? { value: parsed.data }
    : { error: parsed.error.issues[0]?.message || "Enter a valid username." };
};

const checkEmail = (email: string) => {
  const parsed = emailSchema.safeParse(email);
  return parsed.success
    ? { value: parsed.data.toLowerCase() }
    : { error: "Enter a valid email address." };
};

export const validateRegistration = (
  username: string,
  email: string,
): RegistrationCheck => {
  const usernameCheck = checkUsername(username);
  if (usernameCheck.error !== undefined) return { error: usernameCheck.error };
  const emailCheck = checkEmail(email);
  if (emailCheck.error !== undefined) return { error: emailCheck.error };
  return { username: usernameCheck.value, email: emailCheck.value };
};

const isFilled = (...values: string[]) =>
  values.every((value) => value.trim().length > 0);

const isValidCode = (code: string) =>
  confirmationCodeSchema.safeParse(code).success;

const isStrongPassword = (password: string) =>
  passwordSchema.safeParse(password).success;

export const validateResetInput = (
  code: string,
  password: string,
  confirmPassword: string,
): ResetPasswordKey | null => {
  if (!isFilled(code, password, confirmPassword)) return "fillAll";
  if (!isValidCode(code)) return "invalidCode";
  if (password !== confirmPassword) return "passwordsMustMatch";
  if (!isStrongPassword(password)) return "passwordInvalid";
  return null;
};
