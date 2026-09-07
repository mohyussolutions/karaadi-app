import { StatusBar } from 'react-native';

export const KEYBOARD_AVOIDING_BEHAVIOR = undefined;

export function getZoomModalHeaderPaddingTop(): number {
  return StatusBar.currentHeight ?? 24;
}
