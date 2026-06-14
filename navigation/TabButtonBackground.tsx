import React from "react";
import { ImageBackground, View, type ImageSourcePropType } from "react-native";
import { styles } from "../util/styles/tabs/tabButtonBackground.styles";

interface TabButtonBackgroundProps {
  image?: ImageSourcePropType;
  focused: boolean;
  pressed: boolean;
  children: React.ReactNode;
}

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
