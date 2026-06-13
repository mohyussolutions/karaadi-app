import { useState } from 'react';
import { useRouter } from 'expo-router';
import { resetPassword, forgotPassword } from '../api/core/auth.actions';

export function useResetPassword(email: string) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (): Promise<{ success: boolean; key?: string }> => {
    setError(null);
    if (!code.trim() || !password.trim() || !confirmPassword.trim()) {
      return { success: false, key: 'fillAll' };
    }
    if (password !== confirmPassword) {
      return { success: false, key: 'passwordsMustMatch' };
    }
    if (password.length < 8) {
      return { success: false, key: 'minChars' };
    }
    setIsLoading(true);
    try {
      await resetPassword({ email, code: code.trim(), password });
      router.replace('/(auth)/login');
      return { success: true };
    } catch (err: any) {
      const msg = err?.response?.data?.message || '';
      setError(msg);
      return { success: false, key: 'errorMessage' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (): Promise<{ success: boolean }> => {
    setIsResendLoading(true);
    try {
      await forgotPassword(email);
      return { success: true };
    } catch {
      return { success: false };
    } finally {
      setIsResendLoading(false);
    }
  };

  return {
    code, setCode,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading, isResendLoading, error,
    handleReset, handleResendCode,
  };
}
