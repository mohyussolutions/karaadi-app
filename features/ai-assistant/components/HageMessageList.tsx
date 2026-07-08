import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/layout/hage.styles';
import type { ListingRoute } from '../../../util/helpers/nav.routing';
import type { HageMessage, ListingRef } from '../../../util/types/hage.types';
import { ListingChip } from './ListingChip';
import { parseHageReply } from '../utils/parseHageLinks';

interface HageMessageListProps {
  listRef: React.RefObject<FlatList<HageMessage> | null>;
  messages: HageMessage[];
  loading: boolean;
  insets: EdgeInsets;
  emptyText: string;
  thinkingText: string;
  onListingPress: (listing: ListingRef) => void;
  onLinkPress: (route: ListingRoute) => void;
}

export function HageMessageList({
  listRef, messages, loading, insets, emptyText, thinkingText, onListingPress, onLinkPress,
}: HageMessageListProps) {
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.messageListWrap}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => String(m.id)}
        style={styles.messageListWrap}
        contentContainerStyle={[styles.messageList, { paddingBottom: insets.bottom + 8 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="robot-outline" size={48} color={Colors.gray300} />
            <Text style={styles.emptyText}>{emptyText}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View>
            <View style={[styles.bubble, item.fromAI ? styles.bubbleAI : styles.bubbleUser]}>
              <Text style={[styles.bubbleText, !item.fromAI && styles.bubbleTextUser]}>
                {item.fromAI
                  ? parseHageReply(item.content).map((seg, i) => (
                      seg.route ? (
                        <Text key={i} style={styles.bubbleLink} onPress={() => onLinkPress(seg.route!)}>
                          {seg.text}
                        </Text>
                      ) : (
                        <Text key={i}>{seg.text}</Text>
                      )
                    ))
                  : item.content}
              </Text>
            </View>
            {item.fromAI && item.listings && item.listings.length > 0 && (
              <View style={styles.listingsWrap}>
                {item.listings.map((listing) => (
                  <ListingChip
                    key={listing.id || listing._id}
                    item={listing}
                    onPress={() => onListingPress(listing)}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      />
      {loading && (
        <View style={styles.thinkingRow}>
          <View style={styles.thinkingDots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, { opacity: 0.4 + i * 0.2 }]} />
            ))}
          </View>
          <Text style={styles.thinkingText}>{thinkingText}</Text>
        </View>
      )}
    </View>
  );
}
