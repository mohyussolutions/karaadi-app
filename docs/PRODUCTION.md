# Production

## Status

- Android: production builds work via EAS cloud builds.
- iOS: run `eas build --profile production --platform ios` once interactively
  to complete Apple login / credentials setup before it can build unattended.

## App identity

- Name / slug: Karaadi / `karaadi`
- Bundle identifier (iOS) / package (Android): `com.karaadi.app`
- EAS owner: `karaadi`
- API base URL (all profiles): `https://karaadi.onrender.com`

## Dev server

```
npm start            # Start Expo bundler
npm run android      # Launch on Android
npm run ios          # Launch on iOS
```

## Builds (eas.json profiles: development, preview, production)

```
eas build --profile production --platform android --local   # Local Android
eas build --profile production --platform ios --local        # Local iOS
eas build --profile production --platform all --local         # Local both

eas build --profile production --platform android             # Cloud Android
eas build --profile production --platform ios                  # Cloud iOS
eas build --profile production --platform all                   # Cloud both
```

## Submit to store

```
eas submit --profile production --platform android   # Submit Android
eas submit --profile production --platform ios        # Submit iOS
```

Submit config (`eas.json`) expects `google-play-service-account.json` for
Android and Apple ASC API key fields (`ascApiKeyPath`, `ascApiKeyIssuerId`,
`ascApiKeyId`, `appleTeamId`) for iOS.
