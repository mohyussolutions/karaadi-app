import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { getCategoryByKey, SUB_I18N_GROUP } from "../../../constants/categories";
import { EmptyState, AppIcon } from "../../../components/shared";
import ListingCard from "../../../components/cards/ListingCard";
import ListingCardSkeleton from "../../../components/cards/ListingCardSkeleton";
import BottomTabBar from "../../../components/layout/BottomTabBar";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { useResponsive } from "../../../hooks/useResponsive";
import { useCategoryFeed } from "../../../hooks/useCategoryFeed";
import { useAppSelector } from "../../../store/store";
import type { SubCategory } from "../../../constants";
import type { ListingBase } from "../../../util/types/listing.types";
import type { GridProps, SidebarProps } from "../../../util/types";
import { createStyles, H_PAD, GAP, GRID_GAP } from "../../../util/styles/browse/main.styles";

const SKELETON_COUNT = 6;

function SubcategoryGrid({ subs, group, onPress }: GridProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const { iconCols, gridCellWidth } = useResponsive();
  const cellW = gridCellWidth(iconCols, H_PAD, GRID_GAP);
  const rows: SubCategory[][] = [];
  for (let i = 0; i < subs.length; i += iconCols) rows.push(subs.slice(i, i + iconCols));

  return (
    <View style={styles.gridWrap}>
      {rows.map((row) => (
        <View key={row.map((s) => s.key).join("-")} style={styles.gridRow}>
          {row.map((sub) => {
            const label = t(`subcategories.${group}.${sub.key}`, { defaultValue: sub.name });
            return (
              <Pressable
                key={sub.key}
                hitSlop={4}
                onPress={() => onPress(sub)}
                style={[styles.gridCell, { width: cellW }]}
              >
                {({ pressed }) => (
                  <>
                    <View style={[styles.gridIconWrap, pressed && styles.gridIconWrapPressed]}>
                      <AppIcon name={sub.icon} size={22} color={pressed ? Colors.white : Colors.gray700} />
                    </View>
                    <Text style={[styles.gridLabel, pressed && styles.gridLabelPressed]} numberOfLines={2}>
                      {label}
                    </Text>
                  </>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function SubcategorySidebar({ subs, group, onPress, onPost }: SidebarProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {subs.map((sub) => {
        const label = t(`subcategories.${group}.${sub.key}`, { defaultValue: sub.name });
        return (
          <Pressable
            key={sub.key}
            onPress={() => onPress(sub)}
            style={({ pressed }) => [styles.subItem, pressed && styles.subItemActive]}
          >
            {({ pressed }) => (
              <>
                <View style={[styles.subIconWrap, pressed && styles.subIconActive]}>
                  <AppIcon name={sub.icon} size={20} color={pressed ? Colors.white : Colors.gray700} />
                </View>
                <Text style={[styles.subLabel, pressed && styles.subLabelActive]} numberOfLines={2}>
                  {label}
                </Text>
                <MaterialCommunityIcons name="chevron-right" size={14} color={Colors.textMuted} />
              </>
            )}
          </Pressable>
        );
      })}
      <TouchableOpacity style={styles.postBtn} onPress={onPost} activeOpacity={0.88}>
        <MaterialCommunityIcons name="plus" size={16} color={Colors.white} />
        <Text style={styles.postBtnText}>{t("wantSell.title")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default function CategoryScreen() {
  const { category: categoryKey } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const { t } = useAppTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const searchQuery = useAppSelector((s) => s.browseSearch.query);
  const { isTabletLandscape, sidebarWidth, mainWidth, numColumns, cardWidth } = useResponsive();
  const { listings, loading, refreshing, onRefresh } = useCategoryFeed(categoryKey);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const category = getCategoryByKey(categoryKey);
  const group = SUB_I18N_GROUP[categoryKey] ?? categoryKey.toLowerCase();
  const subs = category?.subCategories ?? [];
  const categoryLabel = t(`categories.${categoryKey}`, { defaultValue: category?.name ?? categoryKey });
  const CARD_W = cardWidth(isTabletLandscape ? mainWidth : undefined, numColumns, H_PAD, GAP);

  const filteredListings = listings.filter((l) => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const matchesTitle = (l.title ?? "").toLowerCase().includes(q);
      const matchesCity = (l.city ?? "").toLowerCase().includes(q);
      const matchesRegion = (l.region ?? "").toLowerCase().includes(q);
      const matchesPrice = String(l.price ?? "").includes(q);
      if (!matchesTitle && !matchesCity && !matchesRegion && !matchesPrice) return false;
    }
    return true;
  });

  function handleSubPress(sub: SubCategory) {
    router.push({ pathname: "/browse/[category]/[subcategory]", params: { category: categoryKey, subcategory: sub.key } });
  }

  function handlePost() {
    router.push(user ? "/(tabs)/new-ad" : "/(auth)/login");
  }

  const feedHeader = (
    <View>
      {!isTabletLandscape && <SubcategoryGrid subs={subs} group={group} onPress={handleSubPress} />}
      {!isTabletLandscape && (
        <TouchableOpacity style={[styles.postBtn, styles.postBtnSpaced]} onPress={handlePost} activeOpacity={0.88}>
          <MaterialCommunityIcons name="plus" size={16} color={Colors.white} />
          <Text style={styles.postBtnText}>{t("wantSell.title")}</Text>
        </TouchableOpacity>
      )}
      {!loading && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>{filteredListings.length} listings</Text>
        </View>
      )}
    </View>
  );

  const skeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({ _id: `sk-${i}`, id: `sk-${i}` }));

  const feedList = (
    <FlatList
      key={`cat-${numColumns}`}
      data={loading ? (skeletonData as any) : (filteredListings as ListingBase[])}
      numColumns={numColumns}
      keyExtractor={(item) => item.id || item._id}
      removeClippedSubviews
      windowSize={5}
      maxToRenderPerBatch={10}
      initialNumToRender={10}
      columnWrapperStyle={styles.colWrapper}
      contentContainerStyle={filteredListings.length === 0 && !loading ? styles.emptyContainer : [styles.listContent, { paddingBottom: insets.bottom + 84 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={feedHeader}
      ListEmptyComponent={
        !loading ? <EmptyState icon="tag-off-outline" title={t("common.noResults")} message={categoryLabel} /> : null
      }
      renderItem={({ item }) => (
        <View style={{ width: CARD_W }}>
          {loading ? <ListingCardSkeleton /> : <ListingCard item={item} categoryKey={categoryKey} />}
        </View>
      )}
    />
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={styles.pageHeader}>
          <AppIcon name={category?.icon ?? ""} size={18} color={Colors.primary} />
          <Text style={styles.headerTitle} numberOfLines={1}>{categoryLabel}</Text>
        </View>

        {isTabletLandscape ? (
          <View style={styles.outerRow}>
            <View style={[styles.sidebar, { width: sidebarWidth }]}>
              <SubcategorySidebar subs={subs} group={group} onPress={handleSubPress} onPost={handlePost} />
            </View>
            <View style={styles.flexFull}>{feedList}</View>
          </View>
        ) : (
          feedList
        )}
      </SafeAreaView>
      <BottomTabBar />
    </View>
  );
}
