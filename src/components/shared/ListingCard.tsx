import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import type { ListingBase } from '../../types';

interface Props {
  item: ListingBase;
  onPress: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

const PLACEHOLDER = 'https://placehold.co/320x200/9ca3af/ffffff?text=No+Image';

export default function ListingCard({ item, onPress, onFavorite, isFavorite }: Props) {
  const imageUri = item.images?.[0] || PLACEHOLDER;

  const badge = item.isPremium90
    ? { label: 'PREMIUM', color: Colors.premium }
    : item.isStandard60
    ? { label: 'STANDARD', color: Colors.standard }
    : item.isBasic30
    ? { label: 'BASIC', color: Colors.basic }
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        {badge && (
          <View style={[styles.badge, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeText}>{badge.label}</Text>
          </View>
        )}
        {onFavorite && (
          <TouchableOpacity style={styles.favoriteBtn} onPress={onFavorite}>
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? Colors.error : Colors.white}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>
          {item.price > 0 ? `$${item.price.toLocaleString()}` : 'Price on request'}
        </Text>
        <View style={styles.location}>
          <MaterialCommunityIcons name="map-marker-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.locationText}>
            {[item.city, item.region].filter(Boolean).join(', ') || 'Somalia'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.overlay,
    borderRadius: 20,
    padding: 6,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
