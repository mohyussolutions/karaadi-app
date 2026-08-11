import { DeviceEventEmitter } from 'react-native';

export interface ToastPayload {
  message: string;
  type?: 'saved' | 'removed';
  onView?: () => void;
}

export function showToast(payload: ToastPayload) {
  DeviceEventEmitter.emit('KARAADI_TOAST', payload);
}
