import React from "react";
import { Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColors, useThemedStyles } from "../../hooks/useTheme";
import { useAppTranslation } from "../../hooks/useAppTranslation";
import { createStyles } from "../../util/styles/shared/howToUseVideo.styles";

export default function HowToUseVideo() {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();

  return (
    <Pressable style={styles.button} onPress={() => router.push('/profile/tutorials')}>
      <MaterialCommunityIcons name="play-circle" size={16} color={Colors.white} />
      <Text style={styles.buttonText}>{t("homeScreen.howToUseKaraadi")}</Text>
    </Pressable>
  );
}
