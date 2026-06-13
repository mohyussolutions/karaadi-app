# Building Karaadi (EAS)

## Development (dev client)
```bash
eas build --profile development --platform android --local
eas build --profile development --platform ios --local
eas build --profile development --platform android
eas build --profile development --platform ios
```

## Preview (internal APK/IPA for testers)
```bash
eas build --profile preview --platform android --local
eas build --profile preview --platform ios --local
eas build --profile preview --platform android
eas build --profile preview --platform ios
```

## Production (store release)
```bash
eas build --profile production --platform android --local
eas build --profile production --platform ios --local
eas build --profile production --platform android
eas build --profile production --platform ios
```

## Both platforms
```bash
eas build --profile <profile> --platform all
eas build --profile <profile> --platform all --local
```

## Submit to store
```bash
eas submit --profile production --platform android
eas submit --profile production --platform ios
```

## Dev server
```bash
npm start
npm run android
npm run ios
```
