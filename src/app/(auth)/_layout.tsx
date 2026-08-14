import { useEffect } from "react";
import { Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAppSelector } from "../../store/store";
import { useThemeColors } from "../../components/hooks/useTheme";

export default function AuthLayout() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const loading = useAppSelector((s) => s.auth.loading);
  const Colors = useThemeColors();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)/home");
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
