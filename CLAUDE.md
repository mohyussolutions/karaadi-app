# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Stack

- **Expo SDK 56** / React Native 0.85.3 / React 19 / TypeScript (strict)
- **Routing**: Expo Router (file-based, `app/` directory)
- **State**: Redux Toolkit + redux-persist (only `auth` and `language` slices are persisted via AsyncStorage)
- **HTTP**: Axios (`src/api/client.ts`) — auto-injects `Bearer` token from SecureStore on every request, auto-clears auth on 401
- **Real-time**: Socket.io client (`src/services/socketService.ts`) — singleton, connected on login, disconnected on logout
- **i18n**: i18next with English (`en`) and Somali (`so`); default language is `so`
- **Auth storage**: `expo-secure-store` keys `karaadi_token` and `karaadi_user`

## Commands

```bash
npm start          # Expo dev server (offline mode)
npm run android    # Start + open Android
npm run ios        # Start + open iOS
npm run web        # Start + open web
```

There is no lint, test, or type-check script configured. Run TypeScript checks manually with `npx tsc --noEmit`.

Environment variable: `EXPO_PUBLIC_API_URL` (defaults to `https://karaadi.onrender.com`) — set in `.env`.

## Architecture

### Routing (`app/`)

Expo Router file-based routing with two route groups:

- `(auth)/` — unauthenticated stack: login, register, confirm, forgot-password, reset-password
- `(tabs)/` — bottom tab navigator: `index` (home feed), `search`, `messages`, `new-ad`, `profile`
- `browse/[category]/` — category listing pages
- `listing/[id]/`, `listing/vehicle/`, `listing/real-estate/`, `listing/job/`, `listing/subscription/` — detail pages split by listing type
- `profile/` — profile sub-pages (settings, my-ads, favorites, chat, etc.)

`app/_layout.tsx` is the root layout. It wraps the entire app in `Provider` (Redux) → `PersistGate` → `I18nextProvider` → `GestureHandlerRootView` → `SafeAreaProvider`. `AppNavigator` inside it handles font loading, the splash screen, and calls `loadFromStorage()` once on mount to rehydrate auth from SecureStore.

The `GlobalHeader` component (`src/components/GlobalHeader.tsx`) renders above all screens and handles the logo, back button, language switcher, and auth nav items. It hides itself on tab routes and auth routes. The `Hage` component is the floating AI assistant FAB + chat panel, rendered at root level.

### State (`src/store/`)

Four Redux slices:
- `auth` — `{ user, token, loading }`. `loading: true` on init; set to `false` after `loadFromStorage` resolves. Persisted.
- `language` — `{ lang: 'en' | 'so' }`. Persisted.
- `notifications` — notification list + unread count. Not persisted.
- `hage` — AI assistant messages + open/closed state. Not persisted.

**Auth access pattern**: screens use `useAuthStore()` (`src/store/authStore.ts`), not `useAuth()` directly. `useAuthStore` is a thin wrapper that combines Redux selectors with the `useAuth` hook methods plus SecureStore writes.

### API (`src/api/`)

All endpoint strings live in `src/api/urls.ts`. API functions are split by domain: `auth.ts`, `categories.ts`, `favorites.ts`, `messages.ts`, `search.ts`. The axios instance in `client.ts` is the only HTTP client — never use `fetch` directly.

**Important**: `src/api/categories/` (directory) and `src/api/categories.ts` (file) both exist. The file `src/api/categories.ts` is the active one used by screens.

### Components (`src/components/`)

Canonical shared components live in `src/components/shared/` and are exported via `src/components/shared/index.ts`. Always import from this barrel: `import { ListingCard, CategoryGrid } from '../../src/components/shared'`.

There are duplicate component files at `src/components/` root level (`CategoryGrid.tsx`, `EmptyState.tsx`, `ListingCard.tsx`, `LoadingSpinner.tsx`, `SearchBar.tsx`) — these are stale copies; do not use or edit them.

### Feed cache (`src/services/feedCacheService.ts`)

Two-level cache for the home feed:
1. In-memory (`mem`) — 5-minute TTL
2. AsyncStorage key `karaadi_feed_v1` — disk persistence across restarts

Home screen (`app/(tabs)/index.tsx`) reads disk cache first for instant render, then fetches fresh data in background if cache is stale.

### Real-time chat

`socketService.ts` manages a singleton Socket.io connection. `chatService.ts` handles REST calls for chatrooms and messages. `chatProxyService.ts` wraps chatService for use in screens. Chat screens must call `joinChat(chatId)` on mount and `leaveChat(chatId)` on unmount.

### i18n

Translation keys are in `src/i18n/locales/en.ts` and `src/i18n/locales/so.ts`. Use `useAppTranslation()` (`src/hooks/useAppTranslation.ts`) instead of `useTranslation()` directly — it also exposes `lang` and `switchLanguage`.

### Route protection

There is no centralized auth guard. Each screen that requires auth checks `user` from `useAuthStore()` and calls `router.push('/(auth)/login')` manually. Follow this same pattern for new protected screens.

### Android input filtering

`keyboardType` does not restrict characters on Android. For any field that must contain only specific characters (phone numbers, prices, numeric codes), add an `onChangeText` filter: e.g. `(v) => setPhone(v.replace(/[^0-9+\-()\s]/g, ''))`.
