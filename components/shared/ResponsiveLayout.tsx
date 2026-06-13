import React, { memo } from 'react';
import type { ResponsiveLayoutProps } from '../../utils/types';
import { View } from 'react-native';
import { useThemedStyles } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { createStyles } from '../../utils/styles/shared/responsiveLayout.styles';

function ResponsiveLayout({ sidebar, main, sidebarStyle, mainStyle }: ResponsiveLayoutProps) {
  const { isTabletLandscape, sidebarWidth, mainWidth } = useResponsive();
  const styles = useThemedStyles(createStyles);

  if (!isTabletLandscape) {
    return <View style={[styles.fill, mainStyle]}>{main}</View>;
  }

  return (
    <View style={styles.row}>
      <View style={[styles.sidebar, { width: sidebarWidth }, sidebarStyle]}>
        {sidebar}
      </View>
      <View style={[styles.divider]} />
      <View style={[styles.mainArea, { width: mainWidth }, mainStyle]}>
        {main}
      </View>
    </View>
  );
}

export default memo(ResponsiveLayout);
