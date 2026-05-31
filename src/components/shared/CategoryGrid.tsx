import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { CATEGORIES } from '../../constants/categories';

export default function CategoryGrid() {
  const router = useRouter();

  return (
    <FlatList
      data={CATEGORIES}
      numColumns={3}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.8}
        >
          <View style={[styles.iconBg, { backgroundColor: item.color + '20' }]}>
            <MaterialCommunityIcons
              name={item.icon as any}
              size={26}
              color={item.color}
            />
          </View>
          <Text style={styles.label} numberOfLines={2}>{item.label}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 6,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
});
