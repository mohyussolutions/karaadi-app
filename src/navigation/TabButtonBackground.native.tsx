import React from "react";
import { ImageBackground, View } from "react-native";
import { styles } from "../util/styles/tabs/tabButtonBackground.styles";
import type { TabButtonBackgroundProps } from "../util/types/navigation.types";

export function TabButtonBackground({ image, focused, pressed, children }: TabButtonBackgroundProps) {
  if (image) {
    return (
      <ImageBackground source={image} style={styles.fill} imageStyle={styles.image}>
        <View style={[styles.scrim, focused && styles.scrimActive]} />
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    );
  }

  const placeholderStyle = focused
    ? styles.placeholderActive
    : pressed
      ? styles.placeholderPressed
      : styles.placeholderIdle;

  return (
    <View style={[styles.fill, placeholderStyle]}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}
