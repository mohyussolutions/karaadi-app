import { View, Text } from 'react-native';
import { useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/detail/detailCard.styles';

export function SpecGrid({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.grid}>
        {items.map(({ label, value }) => (
          <View key={label} style={styles.gridCell}>
            <Text style={styles.gridLabel}>{label}</Text>
            <Text style={styles.gridValue} numberOfLines={2}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
