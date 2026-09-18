import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../../../hooks/useTheme';
import { useHageSegments } from '../../../../hooks/useHageSegments';
import { createStyles } from '../../../../util/styles/layout/hageAssistant.styles';
import type { HageMessage, ListingRef } from '../../../../util/types/chat.types';
import type { ListingRoute } from '../../../../util/types/common.types';
import { ListingChip } from '../ListingChip/ListingChip';

export const HageMessageRow = memo(function HageMessageRow({
  item, onListingPress, onLinkPress,
}: {
  item: HageMessage;
  onListingPress: (listing: ListingRef) => void;
  onLinkPress: (route: ListingRoute) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const segments = useHageSegments(item);

  return (
    <View>
      <View style={[styles.bubble, item.fromAI ? styles.bubbleAI : styles.bubbleUser]}>
        <Text style={[styles.bubbleText, !item.fromAI && styles.bubbleTextUser]}>
          {segments
            ? segments.map((seg, i) => (
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
  );
});
