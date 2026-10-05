# iOS

# Option A: build, then submit manually
npm run build:ios
eas submit --platform ios --latest --non-interactive

# Option B: build and auto-submit in one step
npm run deploy:ios

# Android

# Option A: build, then submit manually
npm run build:android
eas submit --platform android --latest --non-interactive

# Option B: build and auto-submit in one step
npm run deploy:android

# Shared

npm run build   # same as build:ios

# Both platforms

# Full release in one step: local check, EAS build iOS + Android, submit both
npm run deploy

# Or run the steps one by one
npm run build:local   # typecheck + bundle JS for iOS and Android on this Mac
npm run build:all     # EAS cloud build for iOS and Android, waits until finished
npm run submit        # submit the latest iOS and Android builds
