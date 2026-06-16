#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Karaadi Deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check for uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Uncommitted changes — commit first then run npm run deploy"
  git status --short
  exit 1
fi

# 2. TypeScript check
echo ""
echo "▶ Step 1/4 — TypeScript check"
if ! npx tsc --noEmit; then
  echo "❌ TypeScript errors — fix them first"
  exit 1
fi
echo "✅ Types clean"

# 3. Push to GitHub
echo ""
echo "▶ Step 2/4 — Push to GitHub"
git push origin main
echo "✅ GitHub up to date"

# 4. iOS — EAS cloud build + auto-submit to App Store
echo ""
echo "▶ Step 3/4 — iOS: build + submit to App Store"
echo "   (Apple reviews in 1-3 days, then releases to users)"
if eas build --profile production --platform ios --auto-submit --non-interactive; then
  echo "✅ iOS submitted to App Store Connect"
else
  echo "⚠️  iOS build/submit failed — check logs above"
fi

# 5. Android — local build (no Expo quota used)
echo ""
echo "▶ Step 4/4 — Android: local build"

if eas build --profile production --platform android --local --non-interactive; then
  AAB=$(ls -t build-*.aab 2>/dev/null | head -1)
  if [ -z "$AAB" ]; then
    echo "⚠️  Could not find .aab file — check project root"
  elif [ -f "./google-play-service-account.json" ]; then
    echo "   Submitting to Google Play..."
    eas submit --profile production --platform android --path "$AAB" --non-interactive
    echo "✅ Android submitted to Google Play (Internal Testing)"
    echo "   Go to Play Console → promote to Production when ready"
  else
    echo "✅ Android .aab built: $AAB"
    echo "   Upload manually at: https://play.google.com/console"
    echo "   (Add google-play-service-account.json to enable auto-submit)"
  fi
else
  echo "⚠️  Android local build failed — check logs above"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Done — check above for any warnings"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
