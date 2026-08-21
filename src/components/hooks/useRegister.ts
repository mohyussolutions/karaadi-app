import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/hooks/authStore';
import {
  REGEX_PASSWORD_LOWERCASE,
  REGEX_PASSWORD_UPPERCASE,
  REGEX_PASSWORD_DIGIT,
  REGEX_PASSWORD_SPECIAL,
} from '../../constants';
import { emailSchema, usernameSchema } from '../../util/validation/schemas';

export const PASSWORD_RULES = [
  { id: 'length',  labelKey: 'auth.passwordRules.length',    test: (p: string) => p.length >= 8 },
  { id: 'lower',   labelKey: 'auth.passwordRules.lowercase', test: (p: string) => REGEX_PASSWORD_LOWERCASE.test(p) },
  { id: 'upper',   labelKey: 'auth.passwordRules.uppercase', test: (p: string) => REGEX_PASSWORD_UPPERCASE.test(p) },
  { id: 'digit',   labelKey: 'auth.passwordRules.digit',     test: (p: string) => REGEX_PASSWORD_DIGIT.test(p) },
  { id: 'special', labelKey: 'auth.passwordRules.special',   test: (p: string) => REGEX_PASSWORD_SPECIAL.test(p) },
] as const;

export function useRegister() {
  const router = useRouter();
  const { register } = useAuthStore();
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

    const parsedUsername = usernameSchema.safeParse(username);
    if (!parsedUsername.success) {
      setErrorMessage(parsedUsername.error.issues[0]?.message || 'Enter a valid username.');
      return;
    }
    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username: parsedUsername.data,
        email: parsedEmail.data.toLowerCase(),
        password,
      });
      router.push({ pathname: '/(auth)/confirm', params: { email: parsedEmail.data.toLowerCase() } });
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
