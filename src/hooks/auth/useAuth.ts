import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  HTTP_LOCKED,
  HTTP_TOO_MANY_REQUESTS,
  PASSWORD_RULES,
  REGEX_EMAIL,
  RESEND_CODE_COOLDOWN_MS,
  ROUTES,
} from '../../actions/constants';
import { confirmAccount, forgotPassword, resendCode, resetPassword } from '../../actions/core/auth.actions';
import {
  clearLoginHistory,
  deleteLoginHistoryEntry,
  getLoginHistory,
  getSessions,
  logoutAllSessions,
  logoutSession,
} from '../../actions/core/security.actions';
import { useAuthStore } from '../../store/hooks/useAuthStore';
import { getApiErrorStatus } from '../../lib/helpers';
import { confirmationCodeSchema, emailSchema } from '../../lib/validation/schemas';
import { useAppTranslation } from '../app/useAppTranslation';
import { validateRegistration, validateResetInput } from './useValidation';

import type { ApiError, AppRouter, AsyncTask, AuthActionResult, LoginEntry, ResetPasswordResult, Session, Translate, VoidCallback } from '../../utils/types';

const loginErrorKey = (err: unknown): string => {
  const status = getApiErrorStatus(err);
  if (status === HTTP_TOO_MANY_REQUESTS) return 'auth.login.tooManyAttempts';
  if (status === HTTP_LOCKED) return 'auth.login.accountLocked';
  return 'auth.login.failed';
};

const apiErrorMessage = (err: unknown) => (err as ApiError)?.response?.data?.message || '';

const fetchSecurityData = async () => {
  const [sessData, histData] = await Promise.allSettled([getSessions(), getLoginHistory()]);
  return {
    sessions: sessData.status === 'fulfilled' ? sessData.value : [],
    history: histData.status === 'fulfilled' ? histData.value : [],
  };
};

const confirmSignOutAll = (t: Translate, onConfirm: VoidCallback) => {
  Alert.alert(t('mine.security.signOutAllTitle'), t('mine.security.signOutAllConfirm'), [
    { text: t('mine.businesses.cancel'), style: 'cancel' },
    { text: t('mine.security.signOutAll'), style: 'destructive', onPress: onConfirm },
  ]);
};

export const useLogin = () => {
  const router = useRouter();
  const { t } = useAppTranslation();
  const { login } = useAuthStore();
  const guardSubmit = useSubmitGuard();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () =>
    guardSubmit(async () => {
      setError(null);
      const parsedEmail = emailSchema.safeParse(email);
      if (!parsedEmail.success) {
        setError(t('auth.login.invalidEmail'));
        return;
      }
      if (!password) {
        setError(t('auth.login.enterPassword'));
        return;
      }
      setIsLoading(true);
      try {
        await login(parsedEmail.data.toLowerCase(), password);
        router.replace(ROUTES.home);
      } catch (err) {
        setError(t(loginErrorKey(err)));
      } finally {
        setIsLoading(false);
      }
    });

  return { email, setEmail, password, setPassword, isLoading, error, handleSubmit };
};

export const useRegister = () => {
  const router = useRouter();
  const { register } = useAuthStore();
  const guardSubmit = useSubmitGuard();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const ruleResults = useMemo(() => PASSWORD_RULES.map((r) => ({ ...r, passes: r.test(password) })), [password]);
  const isPasswordValid = ruleResults.every((r) => r.passes);
  const showRules = password.length > 0;

  const handleSubmit = () =>
    guardSubmit(async () => {
      if (!isPasswordValid) return;
      setErrorMessage('');
      const valid = validateRegistration(username, email);
      if (valid.error !== undefined) return setErrorMessage(valid.error);

      setIsLoading(true);
      try {
        await register({ username: valid.username, email: valid.email, password });
        router.push({ pathname: ROUTES.confirmCode, params: { email: valid.email } });
      } catch (err) {
        const apiErr = err as ApiError;
        setErrorMessage(apiErr?.response?.data?.message || apiErr?.message || '');
      } finally {
        setIsLoading(false);
      }
    });

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    ruleResults,
    isPasswordValid,
    showRules,
    handleSubmit,
  };
};

const useConfirmResend = (email: string, t: Translate) => {
  const { secondsLeft: resendSecondsLeft, restartCooldown } = useResendCooldown();
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResendCode = async (): Promise<AuthActionResult> => {
    if (resendSecondsLeft > 0 || isResendLoading) return { success: false };
    setResendError(null);
    setIsResendLoading(true);
    try {
      await resendCode(email);
      restartCooldown();
      return { success: true };
    } catch {
      const message = t('auth.confirm.resendError');
      setResendError(message);
      return { success: false, message };
    } finally {
      setIsResendLoading(false);
    }
  };

  return { resendSecondsLeft, isResendLoading, resendError, handleResendCode };
};

export const useConfirm = (email: string) => {
  const router = useRouter();
  const { t } = useAppTranslation();
  const guardSubmit = useSubmitGuard();
  const { resendSecondsLeft, isResendLoading, resendError, handleResendCode } = useConfirmResend(email, t);
  const [code, setCode] = useState('');
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const failWith = (message: string): AuthActionResult => {
    setError(message);
    return { success: false, message };
  };

  const submitCode = async (): Promise<AuthActionResult> => {
    setError(null);
    if (!confirmationCodeSchema.safeParse(code).success) return failWith(t('auth.confirm.enterCode'));
    setIsConfirmLoading(true);
    try {
      await confirmAccount(email, code.trim());
      router.replace({ pathname: ROUTES.login, params: { email } });
      return { success: true };
    } catch {
      return failWith(t('auth.confirm.invalidCode'));
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleConfirm = async (): Promise<AuthActionResult> => (await guardSubmit(submitCode)) ?? { success: false };

  return {
    code,
    setCode,
    isConfirmLoading,
    isResendLoading,
    resendSecondsLeft,
    error,
    resendError,
    handleConfirm,
    handleResendCode,
  };
};

export const useForgotPassword = () => {
  const router = useRouter();
  const guardSubmit = useSubmitGuard();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (): Promise<AuthActionResult> =>
    (await guardSubmit(() => sendResetCode())) ?? { success: false };

  const sendResetCode = async (): Promise<AuthActionResult> => {
    setError(null);
    if (!REGEX_EMAIL.test(email.trim())) {
      return { success: false, message: 'invalid_email' };
    }
    setIsLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      router.push({ pathname: ROUTES.resetPassword, params: { email: email.trim().toLowerCase() } });
      return { success: true };
    } catch (err) {
      const msg = apiErrorMessage(err);
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, isLoading, error, handleSubmit };
};

const useResetResend = (email: string) => {
  const [isResendLoading, setIsResendLoading] = useState(false);
  const { secondsLeft: resendSecondsLeft, restartCooldown } = useResendCooldown();

  const handleResendCode = async (): Promise<ResetPasswordResult> => {
    if (resendSecondsLeft > 0 || isResendLoading) return { success: false };
    setIsResendLoading(true);
    try {
      await forgotPassword(email);
      restartCooldown();
      return { success: true };
    } catch {
      return { success: false };
    } finally {
      setIsResendLoading(false);
    }
  };

  return { resendSecondsLeft, isResendLoading, handleResendCode };
};

export const useResetPassword = (email: string) => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const guardSubmit = useSubmitGuard();
  const { resendSecondsLeft, isResendLoading, handleResendCode } = useResetResend(email);

  const handleReset = async (): Promise<ResetPasswordResult> =>
    (await guardSubmit(() => submitNewPassword())) ?? { success: false };

  const submitNewPassword = async (): Promise<ResetPasswordResult> => {
    setError(null);
    const invalidKey = validateResetInput(code, password, confirmPassword);
    if (invalidKey) return { success: false, key: invalidKey };
    setIsLoading(true);
    try {
      await resetPassword({ email, code: code.trim(), password });
      router.replace(ROUTES.login);
      return { success: true };
    } catch (err) {
      setError(apiErrorMessage(err));
      return { success: false, key: 'errorMessage' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    code,
    setCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    isResendLoading,
    resendSecondsLeft,
    error,
    handleReset,
    handleResendCode,
  };
};

export const useResendCooldown = () => {
  const [availableAt, setAvailableAt] = useState(() => Date.now() + RESEND_CODE_COOLDOWN_MS);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (now >= availableAt) return;
    const timer = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(timer);
  }, [now, availableAt]);

  const restartCooldown = useCallback(() => {
    const current = Date.now();
    setAvailableAt(current + RESEND_CODE_COOLDOWN_MS);
    setNow(current);
  }, []);

  return { secondsLeft: Math.max(0, Math.ceil((availableAt - now) / 1000)), restartCooldown };
};

export const useSubmitGuard = () => {
  const inFlightRef = useRef(false);

  return useCallback(async <T>(task: AsyncTask<T>): Promise<T | undefined> => {
    if (inFlightRef.current) return undefined;
    inFlightRef.current = true;
    try {
      return await task();
    } finally {
      inFlightRef.current = false;
    }
  }, []);
};

const useSecurityData = (hasUser: boolean, router: AppRouter) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [history, setHistory] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSecurityData();
      setSessions(data.sessions);
      setHistory(data.history);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasUser) {
      router.replace(ROUTES.login);
      return;
    }
    fetchData();
  }, [hasUser, fetchData, router]);

  const removeSession = useCallback(async (id: string) => {
    try {
      await logoutSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {}
  }, []);

  const deleteHistoryEntry = useCallback((id: number) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    deleteLoginHistoryEntry(id).catch(() => {});
  }, []);

  const clearAllHistory = useCallback(() => {
    setHistory([]);
    clearLoginHistory().catch(() => {});
  }, []);

  return { sessions, history, loading, removeSession, deleteHistoryEntry, clearAllHistory };
};

export const useSecuritySettings = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, clearAuth } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const { sessions, history, loading, removeSession, deleteHistoryEntry, clearAllHistory } = useSecurityData(
    !!user,
    router,
  );

  const confirmLogoutAll = useCallback(() => {
    confirmSignOutAll(t, async () => {
      setLoggingOut(true);
      try {
        await logoutAllSessions();
        await clearAuth();
        router.replace(ROUTES.login);
      } catch {
        setLoggingOut(false);
      }
    });
  }, [t, clearAuth, router]);

  return {
    user,
    clearAuth,
    sessions,
    history,
    loading,
    loggingOut,
    removeSession,
    confirmLogoutAll,
    deleteHistoryEntry,
    clearAllHistory,
  };
};
