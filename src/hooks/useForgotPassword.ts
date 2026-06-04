import { useState } from 'react';
import { useRouter } from 'expo-router';
import { forgotPassword } from '../api/auth';
import { REGEX_EMAIL } from '../constants/regex';

export function useForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (): Promise<{ success: boolean; message?: string }> => {
    setError(null);
    if (!REGEX_EMAIL.test(email.trim())) {
      return { success: false, message: 'invalid_email' };
    }
    setIsLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      router.push({ pathname: '/(auth)/reset-password', params: { email: email.trim().toLowerCase() } });
      return { success: true };
    } catch (err: any) {
      const msg = err?.response?.data?.message || '';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, isLoading, error, handleSubmit };
}
