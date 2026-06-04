import React, { memo } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import COLORS from '../../constants/colors';
import { MAIN_CATEGORIES, type MainCategory } from '../../constants/categories';
import { useAppTranslation } from '../../hooks/useAppTranslation';

const { width } = Dimensions.get('window');
const H_PAD = 12;
const GAP = 6;
const COLS = 3;
const CELL_W = (width - H_PAD * 2 - GAP * (COLS - 1)) / COLS;

interface Props {
  onPress?: (category: MainCategory) => void;
}

function CategoryGrid({ onPress }: Props) {
  const router = useRouter();
  const { t } = useAppTranslation();

  function handlePress(cat: MainCategory) {
    if (onPress) {
      onPress(cat);
    } else {
      router.push({ pathname: '/browse/[category]', params: { category: cat.key } });
    }
  }

  const rows: MainCategory[][] = [];
  for (let i = 0; i < MAIN_CATEGORIES.length; i += COLS) {
    rows.push(MAIN_CATEGORIES.slice(i, i + COLS));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((cat) => {
            const label = t(`categories.${cat.key}`) || cat.name;
            return (
              <Pressable
                key={cat.key}
                hitSlop={4}
                onPress={() => handlePress(cat)}
                style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}
              >
                <View style={styles.iconWrap}>
                  <MaterialCommunityIcons name={cat.icon as any} size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.label} numberOfLines={2}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default memo(CategoryGrid);

const styles = StyleSheet.create({
  container: { paddingHorizontal: H_PAD, paddingVertical: 4, gap: 6 },
  row: { flexDirection: 'row', gap: 6 },
  cell: {
    width: CELL_W,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cellPressed: { backgroundColor: COLORS.gray100 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 13,
    paddingHorizontal: 3,
  },
});
