import { useEffect, useState, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/shared/remoteImage.styles';
import type { RemoteImageProps } from '../../../utils/types';

function RemoteImage({ style, source, iconSize = 22, recyclingKey, ...rest }: RemoteImageProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [hasError, setHasError] = useState(false);
  const uri = typeof source === 'object' && source && 'uri' in source ? source.uri : undefined;

  useEffect(() => {
    setHasError(false);
  }, [uri]);

  return (
    <View style={[styles.wrap, style]}>
      {uri ? (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          cachePolicy="memory-disk"
          recyclingKey={recyclingKey ?? uri}
          onError={() => setHasError(true)}
          {...rest}
        />
      ) : null}

      {(hasError || !uri) ? (
        <View style={styles.fallback}>
          <MaterialCommunityIcons name="image-off-outline" size={iconSize} color={Colors.textDisabled} />
        </View>
      ) : null}
    </View>
  );
}

export default memo(RemoteImage);
