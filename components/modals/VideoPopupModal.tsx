import React, { useEffect } from "react";
import { Modal, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView, type VideoSource } from "expo-video";
import { useThemeColors, useThemedStyles } from "../../hooks/useTheme";
import { useResponsive } from "../../hooks/useResponsive";
import { tabletModalStyles, TABLET_MODAL_ICON_SIZES } from "../common/ipad";
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
  const { isTablet } = useResponsive();

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
      <Pressable style={[styles.backdrop, isTablet && tabletModalStyles.videoBackdrop]} onPress={onClose}>
        <Pressable style={[styles.player, isTablet && tabletModalStyles.videoPlayer]} onPress={(e) => e.stopPropagation()}>
          <Pressable style={[styles.closeBtn, isTablet && tabletModalStyles.videoCloseBtn]} onPress={onClose} hitSlop={12}>
            <MaterialCommunityIcons name="close" size={isTablet ? TABLET_MODAL_ICON_SIZES.videoClose : 20} color={Colors.white} />
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
