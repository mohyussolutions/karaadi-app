import React, { memo } from 'react';
import type { ResponsiveLayoutProps } from '../../util/types';
import { View, Platform } from 'react-native';
import { useThemedStyles } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/useResponsive';
import { WEB_MAX_WIDTH } from '../../hooks/useGlobal';
import { createStyles } from '../../util/styles/shared/responsiveLayout.styles';

function ResponsiveLayout({ sidebar, main, sidebarStyle, mainStyle }: ResponsiveLayoutProps) {
  const { isTabletLandscape, sidebarWidth, mainWidth } = useResponsive();
  const styles = useThemedStyles(createStyles);

  if (!isTabletLandscape) {
    return <View style={[styles.fill, mainStyle]}>{main}</View>;
  }

  return (
    <View style={[styles.rowWrap, Platform.OS === 'web' && { alignItems: 'center' }]}>
      <View style={[styles.row, Platform.OS === 'web' && { maxWidth: WEB_MAX_WIDTH, width: '100%' }]}>
        <View style={[styles.sidebar, { width: sidebarWidth }, sidebarStyle]}>
          {sidebar}
        </View>
        <View style={[styles.divider]} />
        <View style={[styles.mainArea, { width: mainWidth }, mainStyle]}>
          {main}
        </View>
      </View>
    </View>
  );
}

export default memo(ResponsiveLayout);
