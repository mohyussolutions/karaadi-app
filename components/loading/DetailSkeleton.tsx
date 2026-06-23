import React from 'react';
import { View } from 'react-native';
import { useGlobal } from '../../hooks/useGlobal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../util/styles/loading/detailSkeleton.styles';

function Bone({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  const Colors = useThemeColors();
  return <View style={{ width: w as any, height: h, borderRadius: r, backgroundColor: Colors.border }} />;
}

export default function DetailSkeleton() {
  const { width, imgH: calcImgH } = useGlobal();
  const imgH = calcImgH();
  const styles = useThemedStyles((c) => createStyles(c, width, imgH));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.imgPlaceholder} />

      <View style={styles.body}>
        <Bone w="45%" h={14} />
        <Bone w="80%" h={26} r={6} />
        <Bone w="35%" h={20} r={6} />
        <View style={styles.gap} />
        <Bone w="100%" h={14} />
        <Bone w="90%" h={14} />
        <Bone w="75%" h={14} />
        <View style={styles.gap} />
        <Bone w="100%" h={14} />
        <Bone w="85%" h={14} />
      </View>

      <View style={styles.actions}>
        <View style={styles.iconBone} />
        <View style={styles.iconBone} />
        <View style={styles.callBone} />
        <View style={styles.msgBone} />
      </View>
    </SafeAreaView>
  );
}
