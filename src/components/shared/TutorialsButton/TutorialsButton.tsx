import { Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColors, useThemedStyles } from "../../../hooks/app/useTheme";
import { useAppTranslation } from "../../../hooks/app/useAppTranslation";
import { createStyles } from "../../../utils/styles/shared/tutorialsButton.styles";
import { ROUTES } from "../../../actions/constants";

export default function TutorialsButton() {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();

  return (
    <Pressable style={styles.button} onPress={() => router.push(ROUTES.tutorials)}>
      <MaterialCommunityIcons name="play-circle" size={16} color={Colors.white} />
      <Text style={styles.buttonText}>{t("homeScreen.howToUseKaraadi")}</Text>
    </Pressable>
  );
}
