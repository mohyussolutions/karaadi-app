import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAppSelector } from "../store";
import { useThemeColors } from "../hooks/useTheme";

export default function AuthNavigator() {
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
      }}
    />
  );
}
