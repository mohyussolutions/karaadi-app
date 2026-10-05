import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../../../../hooks/app/useTheme';
import { createStyles } from '../../../../../utils/styles/profile/chatScreen.styles';
import type { MessageBubbleProps } from '../../../../../utils/types';

export const MessageBubble = memo(function MessageBubble({ item, isMe }: MessageBubbleProps) {
  const styles = useThemedStyles(createStyles);
  const ts = item.timestamp || item.createdAt || '';

  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowThem]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
          {item.content}
        </Text>
        {!!ts && (
          <Text style={[styles.time, isMe ? styles.timeMe : styles.timeThem]}>
            {new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    </View>
  );
});
