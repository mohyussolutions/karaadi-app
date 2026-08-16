import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors } from '../hooks/useTheme';
import type { RemoteImageProps } from '../../util/types';

export default function RemoteImage({ style, source, iconSize = 22, recyclingKey, ...rest }: RemoteImageProps) {
  const Colors = useThemeColors();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const uri = typeof source === 'object' && source && 'uri' in source ? source.uri : undefined;

  useEffect(() => {
    setHasError(false);
    setLoading(!!uri);
  }, [uri]);

  return (
    <View style={[styles.wrap, style]}>
      {uri ? (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          cachePolicy="memory-disk"
          transition={150}
          recyclingKey={recyclingKey ?? uri}
          onLoad={() => setLoading(false)}
          onError={() => { setHasError(true); setLoading(false); }}
          {...rest}
        />
      ) : null}

      {(loading && !hasError && uri) ? (
        <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: Colors.surface }]}>
          <ActivityIndicator size="small" color={Colors.textDisabled} />
        </View>
      ) : null}

      {(hasError || !uri) ? (
        <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: Colors.surface }]}>
          <MaterialCommunityIcons name="image-off-outline" size={iconSize} color={Colors.textDisabled} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
