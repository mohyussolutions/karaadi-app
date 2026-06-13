import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../utils/styles/shared/listingCardSkeleton.styles';

function ListingCardSkeleton() {
  const opacity = useRef(new Animated.Value(1)).current;
  const s = useThemedStyles(createStyles);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View style={[s.card, { opacity }]}>
      <View style={s.img} />
      <View style={s.body}>
        <View style={[s.line, { width: '90%', height: 13 }]} />
        <View style={[s.line, { width: '60%', height: 13, marginTop: 4 }]} />
        <View style={s.footer}>
          <View style={[s.line, { width: 60, height: 13 }]} />
          <View style={[s.line, { width: 70, height: 11 }]} />
        </View>
      </View>
    </Animated.View>
  );
}

export default React.memo(ListingCardSkeleton);
