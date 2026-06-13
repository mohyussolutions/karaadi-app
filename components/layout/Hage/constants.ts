import { Dimensions, Platform, StatusBar } from 'react-native';
import { FAB_SIZE } from '../../../utils/styles/layout/hage.styles';

export const { width: W, height: H } = Dimensions.get('window');
export const STATUSBAR_H = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;
export const SHEET_TOP = STATUSBAR_H + 48;
export const DRAG_THRESHOLD = 80;
export const FAB_INIT_X = W - FAB_SIZE - 20;
export const FAB_INIT_Y = H - FAB_SIZE - 100;
