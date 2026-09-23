import { useCallback } from "react";
import { View, RefreshControl } from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors, useThemedStyles } from "../../../../hooks/useTheme";
import { EmptyState } from "../../../../components/shared";
import ListingCard from "../../../../components/cards/ListingCard/ListingCard";
import { ListingCardSkeleton } from "../../../../components/loading";
import BottomTabBar from "../../../../navigation/tab-bar/BottomTabBar";
import { useAppSelector } from "../../../../store/store";
import { useAppTranslation } from "../../../../hooks/useAppTranslation";
import { useResponsive } from "../../../../hooks/useResponsive";
import { useCategoryFeed } from "../../../../hooks/useCategoryFeed";
import { useLocationFilter } from "../../../../hooks/useLocationFilter";
import { useSubcategoryListings } from "../../../../hooks/useSubcategoryListings";
import { getCategoryByKey, SUB_I18N_GROUP, H_PAD, GAP, SKELETON_COUNT } from "../../../../constants";
import { createStyles } from "../../../../util/styles/browse/subcategoryBrowse.styles";
import { SubcategoryHeader } from "../../../../components/browse/SubcategoryScreen/SubcategoryHeader";
import { SidebarNested } from "../../../../components/browse/SubcategoryScreen/SidebarNested";
import { LocationFilterModal } from "../../../../components/modals/LocationFilterModal/LocationFilterModal";
import type { ListingBase } from "../../../../util/types/listing.types";
const skeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({ _id: `sk-${i}`, id: `sk-${i}` }));

export default function SubcategoryScreen() {
  const { category: categoryKey, subcategory: subcategoryKey } =
    useLocalSearchParams<{ category: string; subcategory: string }>();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const searchQuery = useAppSelector((s) => s.browseSearch.query);
  const { t } = useAppTranslation();
  const { isTabletLandscape, sidebarWidth, numColumns } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const category = getCategoryByKey(categoryKey);
  const group = SUB_I18N_GROUP[categoryKey] ?? categoryKey.toLowerCase();
  const sub = category?.subCategories.find((s) => s.key === subcategoryKey);
  const nestedItems = sub?.nested ?? [];

  const { listings: allListings, loading, refreshing, onRefresh } = useCategoryFeed(categoryKey, subcategoryKey);

  const {
    regions, selectedRegions, selectedCities, filterOpen, setFilterOpen,
    hasLocationFilter, locationCounts, toggleRegion, toggleCity, clearLocationFilter,
  } = useLocationFilter(allListings, subcategoryKey);

  const { selectedNested, setSelectedNested, listings, nestedCounts } = useSubcategoryListings(
    allListings, subcategoryKey, nestedItems, selectedRegions, selectedCities, searchQuery,
  );

  const categoryLabel = t(`categories.${categoryKey}`, { defaultValue: category?.name ?? categoryKey });
  const subLabel = t(`subcategories.${group}.${subcategoryKey}`, { defaultValue: sub?.name ?? subcategoryKey });
  const subIcon = (sub?.icon ?? "tag-outline") as string;

  function handlePost() {
    router.push(user ? "/(tabs)/new-ad" : "/(auth)/login");
  }

  const renderListItem = useCallback(({ item, index }: ListRenderItemInfo<ListingBase>) => (
    <View
      style={{
        paddingLeft: index % numColumns === 0 ? H_PAD : GAP / 2,
        paddingRight: (index + 1) % numColumns === 0 ? H_PAD : GAP / 2,
        paddingBottom: GAP,
      }}
    >
      {loading ? <ListingCardSkeleton /> : <ListingCard item={item} categoryKey={categoryKey} />}
    </View>
  ), [numColumns, categoryKey, loading]);

  const header = (
    <SubcategoryHeader
      subIcon={subIcon}
      subLabel={subLabel}
      categoryLabel={categoryLabel}
      hasLocationFilter={hasLocationFilter}
      onFilterPress={() => setFilterOpen(true)}
      nestedItems={nestedItems}
      selectedNested={selectedNested}
      onSelectNested={setSelectedNested}
      selectedRegions={selectedRegions}
      selectedCities={selectedCities}
      onClearLocationFilter={clearLocationFilter}
      showPostBtn={!isTabletLandscape}
      onPost={handlePost}
    />
  );

  const feedList = (
    <FlashList<ListingBase>
      key={`sub-${numColumns}`}
      data={loading ? (skeletonData as unknown as ListingBase[]) : listings}
      numColumns={numColumns}
      keyExtractor={(item) => item.id || item._id}
      contentContainerStyle={listings.length === 0 && !loading ? styles.emptyContainer : [styles.listContent, { paddingBottom: insets.bottom + 84 }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={isTabletLandscape ? null : header}
      ListEmptyComponent={
        !loading ? (
          <EmptyState
            icon="tag-off-outline"
            title={t("common.noResults")}
            message={selectedNested ? t(selectedNested.labelKey) : subLabel}
          />
        ) : null
      }
      renderItem={renderListItem}
    />
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={[]}>
        {isTabletLandscape ? (
          <View style={styles.outerRow}>
            <View style={[styles.sidebar, { width: sidebarWidth }]}>
              <SidebarNested
                items={nestedItems}
                selectedKey={selectedNested?.key ?? null}
                counts={nestedCounts}
                onPress={setSelectedNested}
                subLabel={subLabel}
                subIcon={subIcon}
                onPost={handlePost}
                onFilterPress={() => setFilterOpen(true)}
                hasLocationFilter={hasLocationFilter}
              />
            </View>
            <View style={styles.flexFull}>{feedList}</View>
          </View>
        ) : (
          feedList
        )}
      </SafeAreaView>
      <BottomTabBar />
      <LocationFilterModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        regions={regions}
        selectedRegions={selectedRegions}
        selectedCities={selectedCities}
        regionCounts={locationCounts.regionCounts}
        cityCounts={locationCounts.cityCounts}
        onToggleRegion={toggleRegion}
        onToggleCity={toggleCity}
        onClear={clearLocationFilter}
      />
    </View>
  );
}
