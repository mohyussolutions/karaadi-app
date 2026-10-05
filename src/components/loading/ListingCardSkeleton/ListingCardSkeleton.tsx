import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/loading/listingCardSkeleton.styles';
import { NATIVE_DRIVER } from "../../../actions/constants";
import { opacityOf } from '../../../utils/styles/common/dynamic.styles';

function ListingCardSkeleton() {
  const opacity = useRef(new Animated.Value(1)).current;
  const s = useThemedStyles(createStyles);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: NATIVE_DRIVER }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: NATIVE_DRIVER }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View style={[s.card, opacityOf(opacity)]}>
      <View style={s.img} />
      <View style={s.body}>
        <View style={[s.line, s.lineTitle]} />
        <View style={[s.line, s.lineSubtitle]} />
        <View style={s.footer}>
          <View style={[s.line, s.linePrice]} />
          <View style={[s.line, s.lineMeta]} />
        </View>
      </View>
    </Animated.View>
  );
}

export default React.memo(ListingCardSkeleton);
