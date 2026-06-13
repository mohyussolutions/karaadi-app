import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import {
  REGEX_PASSWORD_LOWERCASE,
  REGEX_PASSWORD_UPPERCASE,
  REGEX_PASSWORD_DIGIT,
  REGEX_PASSWORD_SPECIAL,
} from '../constants';

export const PASSWORD_RULES = [
  { id: 'length',  labelKey: 'auth.passwordRules.length',    test: (p: string) => p.length >= 8 },
  { id: 'lower',   labelKey: 'auth.passwordRules.lowercase', test: (p: string) => REGEX_PASSWORD_LOWERCASE.test(p) },
  { id: 'upper',   labelKey: 'auth.passwordRules.uppercase', test: (p: string) => REGEX_PASSWORD_UPPERCASE.test(p) },
  { id: 'digit',   labelKey: 'auth.passwordRules.digit',     test: (p: string) => REGEX_PASSWORD_DIGIT.test(p) },
  { id: 'special', labelKey: 'auth.passwordRules.special',   test: (p: string) => REGEX_PASSWORD_SPECIAL.test(p) },
] as const;

export function useRegister() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, passes: r.test(password) })),
    [password],
  );
  const isPasswordValid = ruleResults.every((r) => r.passes);
  const showRules = password.length > 0;

  const handleSubmit = async () => {
    if (!isPasswordValid) return;
    setErrorMessage('');
    setIsLoading(true);
    try {
      await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      router.push({ pathname: '/(auth)/confirm', params: { email: email.trim().toLowerCase() } });
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || err?.message || '');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    isLoading, errorMessage,
    ruleResults, isPasswordValid, showRules,
    handleSubmit,
  };
}
