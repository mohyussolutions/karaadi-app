import { useState } from 'react';
import { useRouter } from 'expo-router';
import { confirmAccount, resendCode } from '../api/core/auth.actions';

export function useConfirm(email: string) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleConfirm = async (): Promise<{ success: boolean; message?: string }> => {
    setError(null);
    setIsConfirmLoading(true);
    try {
      await confirmAccount(email, code.trim());
      router.replace({ pathname: '/(auth)/login', params: { email } });
      return { success: true };
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid or expired code.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleResendCode = async (): Promise<{ success: boolean; message?: string }> => {
    setResendError(null);
    setIsResendLoading(true);
    try {
      await resendCode(email);
      return { success: true };
    } catch {
      const msg = 'Could not resend code. Try again.';
      setResendError(msg);
      return { success: false, message: msg };
    } finally {
      setIsResendLoading(false);
    }
  };

  return { code, setCode, isConfirmLoading, isResendLoading, error, resendError, handleConfirm, handleResendCode };
}
