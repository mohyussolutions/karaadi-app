# Security

## Status (audited 2026-09-07)

**Secrets**: none hardcoded in source. `.env` is gitignored and untracked. Only `EXPO_PUBLIC_API_URL` is exposed client-side, which is a public URL, not a secret.

**Auth storage**: session token/user stored via `expo-secure-store` on native (`src/util/helpers/secureStorage.ts`), never in AsyncStorage. Sent via `Authorization`/`x-auth-token` headers, never in URL query strings. Socket.io auth token passed in the handshake payload.

**Network**: `API_BASE_URL` (`src/api/urls.ts`) is HTTPS in production; only falls back to `http://localhost:8090` in local dev on web.

**No unsafe rendering**: no `eval`, `Function()`, `WebView`, or `dangerouslySetInnerHTML`-equivalent anywhere in the app.

## Fixed this pass

- **TikTok social link could open an unvalidated URL** (`src/app/business/[id].tsx`, `src/constants/configs.ts`): a business's TikTok field had no builder, so it fell through to `Linking.openURL(rawValue)` with no scheme check. Added a `tiktok` builder and a scheme allowlist (`http(s):`, `tel:`, `mailto:`) before any `Linking.openURL` call.
- **`axios` dependency removed**: only used for `isAxiosError()`, which never matched this app's own hand-thrown errors anyway (dead check). Replaced with `getApiErrorMessage()` (`src/util/helpers/api.format.ts`), which reads the actual `{ response: { data } }` shape this app's `apiClient` throws. Also removes a high-severity vulnerable dependency (`axios@1.16.1`, prototype pollution / DoS advisories) from the shipped bundle entirely.

## Known open items

- **Payment activation trust (needs backend verification, not fixable from this repo)**: `activateListing()` (`src/actions/core/payment.actions.ts`) PATCHes a listing to `isPaid: true` with client-supplied amount/plan data, including a zero-payment-reference path. If the backend doesn't independently re-verify the payment against the provider (Waafi/mobile) before honoring this, a client could mark a listing paid without paying. **Needs backend-side confirmation.**
- **`socket.io-parser`**: `npm audit` flags the installed `4.2.7` for a memory-exhaustion advisory. It's already the newest patch release compatible with the installed `socket.io-client@4.8.3` — no fix is published upstream yet. Revisit when `socket.io-client` ships a new release.
- **`decode-uri-component`/`query-string`** (transitive, via `expo-router`): fix requires an `expo-router` major-version bump (breaking change per `npm audit fix --force`). Needs its own upgrade + regression pass, not bundled into an unrelated change.
- Remaining `npm audit` findings (`xmldom`, `browserslist`, `image-size`, `uuid`, `xcode`, `@expo/config-plugins`, etc.) are all Expo/EAS **build-tooling** dependencies — they run on the build machine during `expo prebuild`/bundling, not inside the shipped app, so they don't expose end users directly.
