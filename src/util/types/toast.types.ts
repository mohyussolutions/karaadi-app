export interface ToastPayload {
  message: string;
  type?: 'saved' | 'removed';
  onView?: () => void;
}
