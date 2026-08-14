# Project structure

Source code lives under `src/`, including `docs/`. Static assets, scripts,
native projects, and all config files stay at the project root. Expo Router
auto-detects `src/app/` as the routes root (no `app.json` changes
needed); `package.json`'s `main` points at `src/main.tsx`.

## `src/app/`
Expo Router routes (file-based routing).
- `(auth)/` — login, register, confirm, password reset
- `(tabs)/` — home, businesses, new-ad, messages, profile (bottom tab screens)
- `browse/`, `business/`, `listing/`, `profile/` — stack screens
- `_layout.tsx`, `loading.tsx` — root layout and loading screen

## `src/components/`
Reusable UI, grouped by domain, plus the two folders below.
- `browse/`, `detail/`, `geo/`, `payment/`, `social/`, `checklist/`, `shared/` — domain-specific components
- `layout/` — app shell (GlobalHeader)
- `loading/` — splash/skeleton/loading screens
- `common/` — cross-platform shared UI primitives (`common-for-ios-andriod.ts`, `special-for-ios.ts`, `special-for-android.ts`)
- `hooks/` — shared React hooks — data fetching per screen, auth, theme, i18n, responsive layout, etc. Re-exported via `hooks/index.ts`.
- `features/` — larger, self-contained feature flows (each with its own `api/`, `store/`, `hooks/`, `components/`). `new-ad/` is the post-ad wizard (type → category → form → plan → payment).

## `src/api/`
Backend API client layer (mirrors the Karaadi website's API shape).
- `client.ts` — fetch wrapper (get/post/put/patch/delete, Bearer token injection)
- `categories/`, `core/`, `search/`, `sockets/` — endpoint groups, re-exported via `index.ts`

## `src/store/`
Redux Toolkit store (`store.ts`, `slices/`) plus `authStore.ts` (auth state outside Redux).

## `services/`
Caching and platform services: feed/listing/category caches, sockets (`chatState.ts`),
notifications, sound, toast.

## `src/util/`
Shared utilities — single source of truth.
- `colors/` — color palettes (light/dark)
- `helpers/` — api.format, ui.format, data.normalize, nav.routing
- `icons/` — icon maps
- `styles/` — shared style tokens (`theme.ts`, `styles.ts`) plus per-screen/component StyleSheets
- `types/` — all TypeScript types, re-exported via `types/index.ts`

## `src/constants/`
API endpoints, config, category/business definitions, languages — re-exported
via `constants/index.ts`.
- `configDetails/` — per-listing-category config, one file per category, all in this
  shared folder: `vehicle.ts` (`VEHICLE_CONFIG` + `CARS`/`BOATS`/`MOTORCYCLES`/
  `FARM_EQUIPMENT_ENDPOINTS`, `getVehicleConfig`), `marketplace.ts` (`MARKETPLACE_CONFIG`
  + `MARKETPLACE_ENDPOINTS`, `getMarketplaceConfig`), `realEstate.ts`
  (`REAL_ESTATE_CONFIG` + `REAL_ESTATE_ENDPOINTS`, `getRealEstateConfig`), `jobs.ts`
  (`JOBS_CONFIG` + `JOBS_ENDPOINTS`, `getJobsConfig`), and `buildSpecItems.ts` (shared
  helper each category's detail screen calls to build its spec grid from `fields`,
  translating each `labelKey` at render time).

## `src/i18n/`
Translations (`locales/en.ts`, `locales/so.ts`), i18next setup, language sync.

## `src/navigation/`
Tab navigation — route config (`TAB_ITEMS`, menu/settings rows, category route helpers,
re-exported via `main.ts`) and `useTabBarVisibility` (which routes hide the tab bar) are
shared with web. `BottomTabBar`, `BottomTabItem`, `TabButtonBackground`, and `getActiveTab`
are mobile-only (`.native.tsx`/`.native.ts`) — the bottom tab bar isn't part of the website;
`BottomTabBar.tsx` is a no-op stub so web builds resolve the import to nothing.

## `assets/`
Images, sounds, videos bundled with the app.

## `src/docs/`
Project documentation (this file, `media/` demo videos).

## Root files
- `app.json`, `eas.json` — Expo/EAS config
- `package.json`, `tsconfig.json` — package and TypeScript config (`package.json`'s `main` points at `src/main.tsx`)
- `src/main.tsx` — app entry point
