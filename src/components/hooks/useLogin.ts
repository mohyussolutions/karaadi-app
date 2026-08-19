import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import { emailSchema } from '../../util/validation/schemas';

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();
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
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, isLoading, error, handleSubmit };
}
