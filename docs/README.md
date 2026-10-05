# Karaadi App

The Karaadi mobile app, built with **React Native (Expo)**. It's the mobile client
for the same Karaadi marketplace as the [Karaadi website](../../../../websits/karaadi).

- **Framework:** Expo ~56, React Native 0.85, React 19
- **State:** Redux Toolkit + redux-persist
- **Data:** TanStack Query, Axios, Socket.IO client
- **Navigation:** Expo Router
- **i18n:** i18next / react-i18next

## Getting started

```bash
npm install
npm start          # expo start
npm run ios
npm run android
```

Build/deploy scripts (via EAS): `npm run build:ios`, `npm run build:android`, `npm run deploy`.

## Submitting to stores

```bash
eas submit --platform ios --profile production --latest --non-interactive
eas submit --platform android --profile production --latest --non-interactive
```

## Demo videos

Walkthroughs of the Karaadi app in action, split into three parts.

Drop the `.mp4` files into `media/` using the filenames below and they'll show up here.

| Part | Video |
| --- | --- |
| 1 — Overview | [karaadi-app-part-1.mp4](media/karaadi-app-part-1.mp4) |
| 2 — Core features | [karaadi-app-part-2.mp4](media/karaadi-app-part-2.mp4) |
| 3 — Advanced features | [karaadi-app-part-3.mp4](media/karaadi-app-part-3.mp4) |

## License

See `LICENSE`.
