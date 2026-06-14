# Project structure

Flat layout, no `src/` folder. All modules live at the project root.

## `app/`
Expo Router routes (file-based routing).
- `(auth)/` — login, register, confirm, password reset
- `(tabs)/` — home, businesses, new-ad, messages, profile (bottom tab screens)
- `browse/`, `business/`, `listing/`, `profile/` — stack screens
- `_layout.tsx`, `loading.tsx` — root layout and loading screen

## `components/`
Reusable UI, grouped by domain.
- `browse/`, `detail/`, `geo/`, `payment/`, `social/`, `checklist/`, `shared/` — domain-specific components
- `layout/` — app shell (GlobalHeader, BottomTabBar, Hage chat overlay, NotificationBanner)
- `loading/` — splash/skeleton/loading screens
- `common/` — cross-platform shared UI primitives (see `common/README.md`)

## `features/`
Larger, self-contained feature flows.
- `new-ad/` — the post-ad wizard (type → category → form → plan → payment)

## `api/`
Backend API client layer (mirrors the Karaadi website's API shape).
- `client.ts` — fetch wrapper (get/post/put/patch/delete, Bearer token injection)
- `categories/`, `core/`, `search/`, `sockets/` — endpoint groups, re-exported via `index.ts`

## `hooks/`
Shared React hooks — data fetching per screen, auth, theme, i18n, responsive layout, etc.
Re-exported via `hooks/index.ts`.

## `store/`
Redux Toolkit store (`store.ts`, `slices/`) plus `authStore.ts` (auth state outside Redux).

## `services/`
Caching and platform services: feed/listing/category caches, sockets (`chatState.ts`),
notifications, sound, toast.

## `util/`
Shared utilities — single source of truth.
- `colors/` — color palettes (light/dark)
- `helpers/` — api.format, ui.format, data.normalize, nav.routing
- `icons/` — icon maps
- `styles/` — shared style tokens (`theme.ts`, `styles.ts`) plus per-screen/component StyleSheets
- `types/` — all TypeScript types, re-exported via `types/index.ts`

## `constants/`
API endpoints, config, category/vehicle/business definitions, languages — re-exported
via `constants/index.ts`.

## `i18n/`
Translations (`locales/en.ts`, `locales/so.ts`), i18next setup, language sync.

## `navigation/`
Navigator setup — `AppNavigator`, `AuthNavigator`, `TabNavigator`, tab bar background.

## `assets/`
Images, sounds, videos bundled with the app.

## `docs/`
Project documentation (this file, `PRODUCTION.md`).

## Root files
- `app.json`, `eas.json` — Expo/EAS config
- `main.tsx` — app entry point
- `package.json`, `tsconfig.json` — package and TypeScript config
