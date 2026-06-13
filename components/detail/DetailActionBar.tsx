import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../hooks/useTheme';
import { createStyles } from '../../utils/styles/detail/DetailActionBar.styles';
import type { DetailActionBarProps } from '../../utils/types';

export default function DetailActionBar({
  onMessage,
  messageLabel,
  messageDisabled = false,
  messageIcon = 'message-outline',
  onCall,
  callLabel,
  priceLabel,
  titleLabel,
  extra,
}: DetailActionBarProps) {
  const Colors = useThemeColors();
  const detailStyles = useThemedStyles(createStyles);

  return (
    <View style={detailStyles.actions}>
      {extra}

      {onCall && (
        <TouchableOpacity style={detailStyles.callBtn} onPress={onCall}>
          <MaterialCommunityIcons name="phone" size={20} color={Colors.primary} />
          {callLabel ? <Text style={detailStyles.callText}>{callLabel}</Text> : null}
        </TouchableOpacity>
      )}

      {priceLabel && (
        <View style={detailStyles.actionsLeft}>
          <Text style={detailStyles.actionPrice} numberOfLines={1}>{priceLabel}</Text>
          {titleLabel ? (
            <Text style={detailStyles.actionTitle} numberOfLines={1}>{titleLabel}</Text>
          ) : null}
        </View>
      )}

      {onMessage && (
        <TouchableOpacity
          style={[detailStyles.msgBtn, messageDisabled && detailStyles.msgBtnDisabled]}
          onPress={onMessage}
          disabled={messageDisabled}
        >
          <MaterialCommunityIcons name={messageIcon as never} size={20} color={Colors.white} />
          <Text style={detailStyles.msgBtnText}>{messageLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
