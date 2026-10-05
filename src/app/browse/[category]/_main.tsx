import { useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../hooks/app/useTheme";
import { H_PAD, GAP, GRID_GAP, ROUTES, SKELETON_COUNT } from "../../../actions/constants";
import { useCategoryContext } from "../../../hooks/listings/useCategories";
import { EmptyState, ThemedIcon, LoadMoreButton } from "../../../components/shared";
import ListingCard from "../../../components/cards/ListingCard/ListingCard";
import { ListingCardSkeleton } from "../../../components/loading";
import BottomTabBar from "../../../navigation/tab-bar/BottomTabBar";
import { useAppTranslation } from "../../../hooks/app/useAppTranslation";
import { useResponsive } from "../../../hooks/app/useResponsive";
import { useCategoryFeed } from "../../../hooks/listings/useFeed";
import { useFilteredListings } from "../../../hooks/listings/useFeed";
import { useAppSelector } from "../../../store/store";
import type { CategoryParams, GridProps, ListingBase, ListingRenderInfo, SidebarProps, SubCategory } from "../../../utils/types";
import { createStyles } from "../../../utils/styles/browse/categoryBrowse.styles";
import { fixedWidth, gridCellPadding, paddingBottomOf } from '../../../utils/styles/common/dynamic.styles';
import { useSearchTracking } from '../../../hooks/listings/useSearch';

import { selectUser } from '../../../store/slices/authSlice';
import { selectBrowseQuery } from '../../../store/slices/browseSearchSlice';
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
                style={[styles.gridCell, fixedWidth(cellW)]}
              >
                {({ pressed }) => (
                  <>
                    <View style={[styles.gridIconWrap, pressed && styles.gridIconWrapPressed]}>
                      <ThemedIcon name={sub.icon} size={22} color={pressed ? Colors.white : Colors.gray700} />
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
    <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
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
                  <ThemedIcon name={sub.icon} size={20} color={pressed ? Colors.white : Colors.gray700} />
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
  const { category: categoryKey } = useLocalSearchParams<CategoryParams>();
  const router = useRouter();
  const { t } = useAppTranslation();
  const user = useAppSelector(selectUser);
  const searchQuery = useAppSelector(selectBrowseQuery);
  const { isTabletLandscape, sidebarWidth, numColumns } = useResponsive();
  const { listings, loading, refreshing, loadingMore, hasMore, onRefresh, loadMore } = useCategoryFeed(categoryKey, searchQuery);
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const { category, i18nGroup: group } = useCategoryContext(categoryKey);
  const subs = category?.subCategories ?? [];
  const categoryLabel = t(`categories.${categoryKey}`, { defaultValue: category?.name ?? categoryKey });

  const filteredListings = useFilteredListings(listings, searchQuery);
  useSearchTracking({ query: searchQuery, resultsCount: filteredListings.length, loading, filters: { category: categoryKey } });

  function handleSubPress(sub: SubCategory) {
    router.push({ pathname: ROUTES.browseSubcategory, params: { category: categoryKey, subcategory: sub.key } });
  }

  function handlePost() {
    router.push(user ? ROUTES.newAd : ROUTES.login);
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
    </View>
  );

  const skeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({ _id: `sk-${i}`, id: `sk-${i}` }));

  const renderListItem = useCallback(({ item, index }: ListingRenderInfo) => (
    <View
      style={gridCellPadding(index, numColumns, H_PAD, GAP)}
    >
      {loading ? <ListingCardSkeleton /> : <ListingCard item={item} categoryKey={categoryKey} />}
    </View>
  ), [numColumns, categoryKey, loading]);

  const feedList = (
    <FlashList<ListingBase>
      key={`cat-${numColumns}`}
      data={loading ? (skeletonData as unknown as ListingBase[]) : filteredListings}
      numColumns={numColumns}
      keyExtractor={(item) => item.id || item._id}
      contentContainerStyle={filteredListings.length === 0 && !loading ? styles.emptyContainer : [styles.listContent, paddingBottomOf(insets.bottom + 84)]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={feedHeader}
      ListFooterComponent={!loading && hasMore ? <LoadMoreButton onPress={loadMore} loading={loadingMore} /> : null}
      ListEmptyComponent={
        !loading ? <View style={styles.emptyWrap}>
<EmptyState icon="tag-off-outline" title={t("common.noResults")} message={categoryLabel} />
</View> : null
      }
      renderItem={renderListItem}
    />
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={[]}>
        <View style={styles.pageHeader}>
          <ThemedIcon name={category?.icon ?? ""} size={18} color={Colors.primary} />
          <Text style={styles.headerTitle} numberOfLines={1}>{categoryLabel}</Text>
        </View>

        {isTabletLandscape ? (
          <View style={styles.outerRow}>
            <View style={[styles.sidebar, fixedWidth(sidebarWidth)]}>
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
