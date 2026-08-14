# iOS

npm run build:ios
npm run deploy:ios
eas submit --platform ios --latest --non-interactive

# Android

npm run build:android
npm run deploy:android
eas submit --platform android --latest --non-interactive

# Shared

npm run build
npm run deploy
