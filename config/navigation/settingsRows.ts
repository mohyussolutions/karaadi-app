import type { SettingsRow } from "../../util/types";

export const SETTINGS_ROWS: SettingsRow[] = [
  {
    icon: "shield-lock-outline",
    labelKey: "mine.settings.security",
    route: "/profile/settings/Security",
  },
  {
    icon: "eye-off-outline",
    labelKey: "mine.settings.privacy",
    route: "/profile/settings/Privacy",
  },
  {
    icon: "credit-card-outline",
    labelKey: "mine.settingsPage.payments",
    route: "/profile/settings/Payment",
  },
  {
    icon: "crown-outline",
    labelKey: "mine.settings.subscription",
    route: "/profile/wanted",
  },
  {
    icon: "information-outline",
    labelKey: "mine.account.aboutKaraadi",
    route: "/profile/about-karaadi",
  },
];
