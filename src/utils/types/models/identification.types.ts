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

export type SlotKey = 'idCard' | 'selfie';
