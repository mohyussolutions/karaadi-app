import React, { useEffect } from "react";
import { Modal, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView, type VideoSource } from "expo-video";
import { useThemeColors, useThemedStyles } from "../../hooks/useTheme";
import { createStyles } from "../../util/styles/shared/videoPopupModal.styles";

export default function VideoPopupModal({
  visible,
  onClose,
  source,
}: {
  visible: boolean;
  onClose: () => void;
  source: VideoSource;
}) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const player = useVideoPlayer(source);

  useEffect(() => {
    if (visible) {
      player.currentTime = 0;
      player.play();
    } else {
      player.pause();
    }
  }, [visible, player]);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.player} onPress={(e) => e.stopPropagation()}>
          <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
            <MaterialCommunityIcons name="close" size={20} color={Colors.white} />
          </Pressable>
          <VideoView
            style={styles.video}
            player={player}
            nativeControls
            contentFit="contain"
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
