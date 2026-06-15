import { Platform } from 'react-native';
import * as IOS from './special-for-ios';
import * as Android from './special-for-android';

export const KEYBOARD_AVOIDING_BEHAVIOR = Platform.OS === 'ios'
  ? IOS.KEYBOARD_AVOIDING_BEHAVIOR
  : Android.KEYBOARD_AVOIDING_BEHAVIOR;

export function getModalHeaderPaddingTop(insetsTop: number): number {
  return Platform.OS === 'android'
    ? Android.getZoomModalHeaderPaddingTop()
    : IOS.getZoomModalHeaderPaddingTop(insetsTop);
}
