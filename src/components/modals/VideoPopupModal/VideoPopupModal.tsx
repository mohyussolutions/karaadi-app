import { useEffect, useState } from "react";
import { Modal, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useThemeColors, useThemedStyles } from "../../../hooks/app/useTheme";
import { useResponsive } from "../../../hooks/app/useResponsive";
import { tabletModalStyles } from "../../../utils/styles/common/tablet.styles";
import { createStyles } from "../../../utils/styles/modals/videoPopupModal.styles";
import { TABLET_MODAL_ICON_SIZES } from '../../../actions/constants';
import type { VideoPopupModalProps } from "../../../utils/types";

export default function VideoPopupModal({
  visible,
  onClose,
  source,
}: VideoPopupModalProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { isTablet } = useResponsive();
  const [muted, setMuted] = useState(false);

  const player = useVideoPlayer(source, (p) => { p.muted = false; });

  useEffect(() => {
    if (visible) {
      player.currentTime = 0;
      player.muted = false;
      setMuted(false);
      player.play();
    } else {
      player.pause();
    }
  }, [visible, player]);

  function toggleMuted() {
    const next = !muted;
    player.muted = next;
    setMuted(next);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, isTablet && tabletModalStyles.videoBackdrop]} onPress={onClose}>
        <Pressable style={[styles.player, isTablet && tabletModalStyles.videoPlayer]} onPress={(e) => e.stopPropagation()}>
          <Pressable style={[styles.closeBtn, isTablet && tabletModalStyles.videoCloseBtn]} onPress={onClose} hitSlop={12}>
            <MaterialCommunityIcons name="close" size={isTablet ? TABLET_MODAL_ICON_SIZES.videoClose : 20} color={Colors.white} />
          </Pressable>
          <Pressable style={styles.muteBtn} onPress={toggleMuted} hitSlop={12}>
            <MaterialCommunityIcons name={muted ? "volume-off" : "volume-high"} size={isTablet ? TABLET_MODAL_ICON_SIZES.videoClose : 20} color={Colors.white} />
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
