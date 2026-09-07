import { REGEX_TRAILING_SLASH } from "../constants/regex";

if (!process.env.EXPO_PUBLIC_API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not set");
}

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL.replace(
  REGEX_TRAILING_SLASH,
  "",
);
