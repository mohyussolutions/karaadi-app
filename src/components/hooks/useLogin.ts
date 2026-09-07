import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/hooks/authStore';
import { emailSchema } from '../../util/validation/schemas';
import type { ApiError } from '../../util/types/generic.types';

export function useLogin() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      setError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter your password.');
      return;
    }
    setIsLoading(true);
    try {
      await login(parsedEmail.data.toLowerCase(), password);
      router.replace('/(tabs)/home');
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.response?.data?.message || apiErr?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, isLoading, error, handleSubmit };
}
