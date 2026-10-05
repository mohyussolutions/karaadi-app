import { memo } from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../../../hooks/app/useTheme';
import { useHageSegments } from '../../../../hooks/messaging/useChat';
import { createStyles } from '../../../../utils/styles/layout/hageAssistant.styles';
import { ListingChip } from '../ListingChip/ListingChip';
import type { HageMessageRowProps } from "../../../../utils/types";

export const HageMessageRow = memo(function HageMessageRow({
  item, onListingPress, onLinkPress,
}: HageMessageRowProps) {
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
