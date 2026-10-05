import type { ColorKey } from '../app/theme.types';
import type { ModalProps } from './modals.types';

export interface SocialShareSheetProps extends ModalProps {
  title: string;
  message: string;
  monochrome?: boolean;
}

export type PostOutcome = 'idle' | 'done' | 'error';

export interface SocialAction {
  key: string;
  label: string;
  icon: string;
  colorKey: ColorKey;
  onPress: (message: string) => Promise<void>;
}
