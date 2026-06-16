#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Karaadi Deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ You have uncommitted changes. Commit first, then deploy."
  git status --short
  exit 1
fi

# 2. TypeScript check
echo ""
echo "▶ Step 1/4 — TypeScript check"
npx tsc --noEmit
echo "✅ Types clean"

# 3. Push latest to GitHub
echo ""
echo "▶ Step 2/4 — Push to GitHub"
git push origin main
echo "✅ GitHub up to date"

# 4. iOS — EAS cloud build + auto-submit to App Store
echo ""
echo "▶ Step 3/4 — iOS: build on Expo cloud + submit to App Store"
echo "   (Apple will review then release to users — usually 1-3 days)"
eas build --profile production --platform ios --auto-submit --non-interactive
echo "✅ iOS submitted to App Store Connect"

# 5. Android — local build + submit to Google Play
echo ""
echo "▶ Step 4/4 — Android: build locally + submit to Google Play"

if [ ! -f "./google-play-service-account.json" ]; then
  echo "⚠️  google-play-service-account.json not found."
  echo "   Building .aab locally — upload manually to Play Console:"
  echo "   https://play.google.com/console → Karaadi → Internal Testing → Create release"
  eas build --profile production --platform android --local
  AAB=$(ls -t build-*.aab 2>/dev/null | head -1)
  echo "✅ Android .aab ready: $AAB"
else
  eas build --profile production --platform android --local
  AAB=$(ls -t build-*.aab 2>/dev/null | head -1)
  eas submit --profile production --platform android --path "$AAB"
  echo "✅ Android submitted to Google Play (Internal Testing track)"
  echo "   Go to Play Console → promote to Production when ready"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Deploy complete"
echo "  iOS  → Waiting for Apple review (1-3 days)"
echo "  Android → Check Play Console"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
