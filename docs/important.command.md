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

# Shared (iOS only — these are aliases for the :ios scripts, not cross-platform)

npm run build   # same as build:ios
npm run deploy  # same as deploy:ios
