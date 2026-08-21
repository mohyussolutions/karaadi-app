import { DeviceEventEmitter } from 'react-native';
import type { ToastPayload } from '../types/common.types';

export type { ToastPayload };

export function showToast(payload: ToastPayload) {
  DeviceEventEmitter.emit('KARAADI_TOAST', payload);
}
