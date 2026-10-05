# Project structure

`src/` holds the app's top-level folders: `app`, `actions`, `categoriesListing`, `components`, `ui`, `hooks`, `lib`, `navigation`, `utils`, `i18n`, `store`.
Static assets, scripts, native projects, docs and config files stay at the project root.
`package.json`'s `main` points at `src/main.tsx`, and Expo Router uses `src/app/` as the routes root.

## `src/main.tsx` and `src/App.tsx`
How the app starts, in order:
1. `main.tsx` hides known dev warnings and renders `App`.
2. `App.tsx` wraps the app in every provider, outermost first: Redux store → saved state (`PersistGate`) → translations → gestures → safe areas. Once the icon font loads it starts Expo Router.
3. `app/_layout.tsx` is the first screen Expo Router renders: it keeps the language in sync, draws `RootStack` (the screens), and draws `RootOverlays` (header, tab bar, global modals) on top.

## `src/actions/`
Everything that talks to the API.
- `categories/`, `core/`, `search/`, `sockets/` — API calls grouped by area
- `client.ts` — the shared HTTP client
- `constants/` — the one place for fixed values; import them through `actions/constants`
  - `routes.constants.ts` — every app path: `ROUTES`, `PATHNAMES`, URL matchers, notification tap routes, listing detail routes, website paths
  - `tabs.constants.ts` — the bottom tab bar: `TAB_NAMES`, tab items, which tab is active for a path, when the bar hides, bar height
  - `app.constants.ts` — app constants (feed sizes, limits, storage keys, settings menu)
  - `api.constants.ts` — API paging values (`FEED_GROUPS`, `FEED_DEFAULT_PAGE`)
  - `paths.ts` — API route paths (`CAT_PATHS`, `FEED_BASE_PATH`, `vehicleListPath`)
  - `endpoints.ts` — full endpoint builders (`*_ENDPOINTS`, `categoryListPath`)
  - `tracking.constants.ts` — tracking consent values
  - `business.constants.ts` — business type icons, labels and category keys

## `src/app/`
Screens only (Expo Router treats every file here as a route). Route files are lowercase.
- `(auth)/` — login, register, confirm, password reset
- `(tabs)/` — home, businesses, new-ad, messages, notifications, profile
- `browse/`, `business/`, `listing/`, `profile/` — stack screens

## `src/categoriesListing/`
The listing category tree, one file per level.
- `main-categories/mainCategories.ts` — Marketplace, Real Estate, Cars, Motorcycles, Boats, Farm Equipment
- `categories/categories.ts` — categories inside each main category
- `sub-categories/subCategories.ts` — sub-categories inside each category

## `src/i18n/`
English (`locales/en.ts`) and Somali (`locales/so.ts`) translations and language syncing.

## `src/components/`
Every component lives in a PascalCase folder named after it.
- `cards/` — listing, seller, my-ad, detail and social post cards
- `detail/` — parts of a listing detail screen (gallery, action bar, recommended)
- `modals/` — popups and sheets; they share `utils/styles/modals/modalBase.styles.ts`
- `forms/`, `geo/` — form inputs, dropdown, region/city picker
- `layout/` — `GlobalHeader` and `RootOverlays` (everything drawn on top of the screens)
- `loading/` — spinner, skeletons, loading screen
- `browse/` — sub-category screen pieces
- `features/` — self-contained features: chat, notifications, identification, social, subscription, tracking
- `management/create/` — the new-ad and business creation flows
- `ai-assistant/` — the Hage assistant

## `src/components/shared/`
Small reusable pieces used everywhere: `ThemedIcon`, `EmptyState`, `LoadMoreButton`, `RemoteImage`, `FavoriteToast`, `CategoryGrid` (+ `CategoryGridItem`), `VerifiedBadge`, `TutorialsButton`.

## `src/hooks/`
React hooks, grouped by area.
- `app/` — `useTheme`, `useAppTranslation`, `useResponsive`, `useApp`, `useDrag`
- `auth/` — `useAuth`, `useAccount`, `useValidation`
- `listings/` — `useFeed`, `useListingDetail`, `useCategories`, `useSearch`, `useNewAd`
- `messaging/` — `useChat`, `useNotifications`
- `business/` — `useBusiness`, `usePayments`

## `src/lib/`
Plain logic with no UI: `helpers/`, `cache/`, `policy/`, `validation/`, `tracking/`, `platform/`.
- `helpers/api/` — API error and image URL helpers, endpoint builders
- `helpers/format/` — price, date, phone and payment formatting
- `helpers/listing/` — listing normalizing, expiry, search matching, detail routes
- `helpers/category/` — category builders and selectors
- `helpers/chat/`, `helpers/device/` (secure storage, image compression), `helpers/style/` (shadow)

## `src/navigation/`
Everything that decides which screen shows and how you move between them.
- `stack/RootStack.tsx` — the main screen stack; `stack/rootStackScreens.ts` lists which screens open as modals, cards or plain pages
- `tab-bar/` — the bottom tab bar, which tab is active, and when the bar hides
- `header/headerVisibility.ts` — lets a screen hide the global header and tab bar while it's open

## `src/utils/`
Shared building blocks for every screen and component.
- `colors/colors.ts` — the light and dark palette, plus radii and type scale
- `icons/` — icon name sets: `socialIcons`, `navIcons`, `amenityIcons`, `categoryIcons` (import from `utils/icons`)
- `styles/` — every stylesheet, in folders that match the component folders
- `types/` — every TypeScript type and interface. Always import from `src/utils/types`.
  - `models/` — data the app works with: user, listing, chat, hage, business, payment, plan, category…
  - `components/` — component props, one file per component group (`ui`, `cards`, `modals`, `forms`…)
  - `hooks/` — hook arguments and results, one file per hook
  - `store/` — `state` (slice state), `thunks` (thunk arguments), `payloads` (action payloads), `store` (`RootState`, `AppDispatch`)
  - `api/` — API shapes; `responses.types.ts` names every response envelope (`ListingsEnvelope`, `SessionsEnvelope`…)
  - `app/` — theme, icons, navigation, screen URL params (`routeParams`), i18n, tracking, app content

## `src/store/`
Redux Toolkit store.
- `store.ts` — `configureStore` with saved state (`redux-persist`), plus the typed `useAppDispatch` and `useAppSelector` hooks
- `slices/` — all 12 slices; each one uses `createSlice`, `createAsyncThunk` for async work, and `selectors` for reading state
- `actions/` — actions shared outside a slice (`clearCredentials`, used by the API client)
- `hooks/useAuthStore.ts` — sign-in, sign-out and session helpers for screens
- Read state with a slice selector (`useAppSelector(selectUser)`), never an inline `(s) => s.auth.user`

## Rules
- Types go in the matching `utils/types/` subfolder and are imported from `src/utils/types`; no `any`. Styles go in `utils/styles/`, fixed values in `actions/constants`, API paths in `actions/constants/paths.ts` or `endpoints.ts`.
- Colors come from `utils/colors/colors.ts`; runtime style values use helpers in `utils/styles/common/dynamic.styles.ts`.
- No inline object types outside `utils/types`: give every shape a name there.
- No comments in source files.
