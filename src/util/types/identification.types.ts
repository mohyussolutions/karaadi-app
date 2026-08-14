export interface IdentificationStatus {
  required: boolean;
  submitted: boolean;
  idCardRequired: boolean;
  selfieRequired: boolean;
}

export interface IdentificationRecord {
  id: string;
  userId: string;
  email: string;
  username: string;
  idCardImage: string;
  selfieImage: string;
  submittedAt: string;
  faceMatch: boolean | null;
  faceMatchSimilarity: number | null;
  faceMatchError: string | null;
  faceMatchCheckedAt: string | null;
}

export interface IdentificationSubmitPayload {
  idCardImage?: string;
  selfieImage?: string;
}

export interface IdentificationSubmitResponse {
  success: true;
  identification: IdentificationRecord;
}

export interface IdentityGateProps {
  visible: boolean;
  idCardRequired?: boolean;
  selfieRequired?: boolean;
  onVerified: () => void;
}

export type SlotKey = 'idCard' | 'selfie';

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
  s: ReturnType<typeof import('../styles/profile/verifyIdentity.styles').createStyles>;
  Colors: ReturnType<typeof import('../../components/hooks/useTheme').useThemeColors>;
  t: (key: string) => string;
  onTakePhoto: () => void;
  onUpload: (slot: SlotKey) => void;
  onClear: (slot: SlotKey) => void;
}
