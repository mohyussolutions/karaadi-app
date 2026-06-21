#!/bin/bash

IPHONE_UUID="7832DFBA-8B9F-4EF3-A066-192F2D0A0EA7"
IPAD_UUID="D26B9490-2B8D-4E66-988F-1A73D1BEF39A"

echo ""
echo "Choose a device:"
echo "  1) iPhone"
echo "  2) iPad"
echo "  3) Android"
echo ""
read -p "Enter 1, 2 or 3: " choice

case $choice in
  1)
    xcrun simctl boot "$IPHONE_UUID" 2>/dev/null
    xcrun simctl bootstatus "$IPHONE_UUID" -b >/dev/null 2>&1
    expo start --ios
    ;;
  2)
    xcrun simctl shutdown all 2>/dev/null
    xcrun simctl boot "$IPAD_UUID" 2>/dev/null
    xcrun simctl bootstatus "$IPAD_UUID" -b >/dev/null 2>&1
    expo start --ios
    ;;
  3)
    expo start --android --no-ios
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac
