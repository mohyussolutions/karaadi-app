import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import type { CheckoutBarProps } from '../../utils/types';
import { createStyles } from './CheckoutBar.styles';

export function CheckoutBar({ steps, currentIndex }: CheckoutBarProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

  return (
    <View style={s.container}>
      <View style={s.row}>
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <React.Fragment key={step.key}>
              {i > 0 && <View style={[s.connector, done && s.connectorDone]} />}
              <View style={s.stepCol}>
                {active ? (
                  <View style={s.activeRing}>
                    <View style={[s.circle, s.circleActive]}>
                      <Text style={s.numActive}>{i + 1}</Text>
                    </View>
                  </View>
                ) : done ? (
                  <View style={[s.circle, s.circleDone]}>
                    <MaterialCommunityIcons name="check" size={14} color={Colors.white} />
                  </View>
                ) : (
                  <View style={[s.circle, s.circlePending]}>
                    <Text style={s.numPending}>{i + 1}</Text>
                  </View>
                )}
                <Text style={[s.label, done && s.labelDone, active && s.labelActive]} numberOfLines={1}>
                  {step.label}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
