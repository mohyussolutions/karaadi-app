import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/detail/sellerCard.styles';

export function StarRating({ rating, count }: { rating: number; count: number }) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const stars = Math.round(rating);
  return (
    <View style={s.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MaterialCommunityIcons
          key={i}
          name={i <= stars ? 'star' : 'star-outline'}
          size={13}
          color={i <= stars ? Colors.amber : Colors.border}
        />
      ))}
      <Text style={s.ratingText}>{rating.toFixed(1)} ({count})</Text>
    </View>
  );
}
