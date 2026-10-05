import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAppSelector } from "../../store/store";
import { useThemeColors } from "../../hooks/app/useTheme";

import { ROUTES } from '../../actions/constants';
import { selectAuthLoading, selectUser } from '../../store/slices/authSlice';
export default function AuthLayout() {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const Colors = useThemeColors();

  useEffect(() => {
    if (!loading && user) {
      router.replace(ROUTES.home);
    }
  }, [user, loading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: Platform.OS === "web" ? "none" : "default",
      }}
    />
  );
}
