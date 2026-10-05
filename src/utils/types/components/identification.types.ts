import type { createStyles as createVerifyIdentityStyles } from '../../styles/profile/verifyIdentity.styles';
import type { ColorPalette } from '../app/theme.types';
import type { SlotKey } from '../models/identification.types';

export interface IdentityCaptureFormProps {
  submitting: boolean;
  idCardRequired?: boolean;
  selfieRequired?: boolean;
  onSubmit: (idCardImage?: string, selfieImage?: string) => Promise<boolean>;
  onSuccess?: () => void;
}

export interface SlotProps {
  slotKey: SlotKey;
  label: string;
  hint: string;
  icon: string;
  image: string | null;
  compressing: boolean;
  s: ReturnType<typeof createVerifyIdentityStyles>;
  Colors: ColorPalette;
  t: (key: string) => string;
  onTakePhoto: () => void;
  onUpload: (slot: SlotKey) => void;
  onClear: (slot: SlotKey) => void;
}

export interface SlotPreview {
  slot: SlotKey;
  uri: string;
}
