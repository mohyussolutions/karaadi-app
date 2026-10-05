import { useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../../hooks/app/useTheme';
import { createStyles } from '../../../../utils/styles/layout/hageAssistant.styles';
import type { HageMessageListProps, HageMessageRenderInfo } from '../../../../utils/types';
import { HageMessageRow } from './HageMessageRow';
import { opacityOf, paddingBottomOf } from '../../../../utils/styles/common/dynamic.styles';

export function HageMessageList({
  listRef, messages, loading, insets, emptyText, thinkingText, onListingPress, onLinkPress,
}: HageMessageListProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const renderMessage = useCallback(({ item }: HageMessageRenderInfo) => (
    <HageMessageRow item={item} onListingPress={onListingPress} onLinkPress={onLinkPress} />
  ), [onListingPress, onLinkPress]);

  return (
    <View style={styles.messageListWrap}>
      <FlatList overScrollMode="never"
        ref={listRef}
        data={messages}
        keyExtractor={(m) => String(m.id)}
        style={styles.messageListWrap}
        contentContainerStyle={[styles.messageList, paddingBottomOf(insets.bottom + 8)]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="robot-outline" size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        }
        renderItem={renderMessage}
      />
      {loading && (
        <View style={styles.thinkingRow}>
          <View style={styles.thinkingDots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, opacityOf(0.4 + i * 0.2)]} />
            ))}
          </View>
          <Text style={styles.thinkingText}>{thinkingText}</Text>
        </View>
      )}
    </View>
  );
}
