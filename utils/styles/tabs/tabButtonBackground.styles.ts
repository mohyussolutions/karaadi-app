import { StyleSheet } from "react-native";
import { COLORS, RADII } from "../../theme";

export const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADII.lg,
    overflow: "hidden",
  },
  image: { borderRadius: RADII.lg },
  content: { alignItems: "center", justifyContent: "center", gap: 2 },
  scrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlaySlate,
    opacity: 0.45,
  },
  scrimActive: { backgroundColor: COLORS.primary, opacity: 0.55 },
  placeholderIdle: { backgroundColor: COLORS.transparent },
  placeholderPressed: { backgroundColor: COLORS.whiteAlpha15 },
  placeholderActive: { backgroundColor: COLORS.transparent },
});
