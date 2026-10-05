import { DeviceEventEmitter } from 'react-native';
import type { ToastPayload } from '../../utils/types';


export function showToast(payload: ToastPayload) {
  DeviceEventEmitter.emit('KARAADI_TOAST', payload);
}
