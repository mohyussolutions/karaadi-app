import { useCallback } from "react";
import { View, RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors, useThemedStyles } from "../../../../hooks/app/useTheme";
import { EmptyState } from "../../../../components/shared";
import ListingCard from "../../../../components/cards/ListingCard/ListingCard";
import { ListingCardSkeleton } from "../../../../components/loading";
import BottomTabBar from "../../../../navigation/tab-bar/BottomTabBar";
import { useAppSelector } from "../../../../store/store";
import { useAppTranslation } from "../../../../hooks/app/useAppTranslation";
import { useResponsive } from "../../../../hooks/app/useResponsive";
import { useCategoryListings } from "../../../../hooks/listings/useFeed";
import { useLocationFilter } from "../../../../hooks/listings/useSearch";
import { useSubcategoryListings } from "../../../../hooks/listings/useFeed";
import { H_PAD, GAP, SKELETON_COUNT, ROUTES } from "../../../../actions/constants";
import { useCategoryContext } from "../../../../hooks/listings/useCategories";
import { createStyles } from "../../../../utils/styles/browse/subcategoryBrowse.styles";
import { SubcategoryHeader } from "../../../../components/browse/SubcategoryScreen/SubcategoryHeader";
import { SidebarNested } from "../../../../components/browse/SubcategoryScreen/SidebarNested";
import { LocationFilterModal } from "../../../../components/modals/LocationFilterModal/LocationFilterModal";
import type { ListingBase, ListingRenderInfo, SubcategoryParams } from "../../../../utils/types";
import { fixedWidth, gridCellPadding, paddingBottomOf } from '../../../../utils/styles/common/dynamic.styles';
import { useSearchTracking } from '../../../../hooks/listings/useSearch';
import { selectUser } from '../../../../store/slices/authSlice';
import { selectBrowseQuery } from '../../../../store/slices/browseSearchSlice';
const skeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({ _id: `sk-${i}`, id: `sk-${i}` }));

export default function SubcategoryScreen() {
  const { category: categoryKey, subcategory: subcategoryKey } =
    useLocalSearchParams<SubcategoryParams>();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const searchQuery = useAppSelector(selectBrowseQuery);
  const { t } = useAppTranslation();
  const { isTabletLandscape, sidebarWidth, numColumns } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  const { category, subCategory: sub, i18nGroup: group } = useCategoryContext(categoryKey, subcategoryKey);
  const nestedItems = sub?.nested ?? [];

  const { listings: allListings, loading, refreshing, onRefresh } = useCategoryListings(categoryKey);

  const {
    regions, selectedRegions, selectedCities, filterOpen, setFilterOpen,
    hasLocationFilter, locationCounts, toggleRegion, toggleCity, clearLocationFilter,
  } = useLocationFilter(allListings, categoryKey, subcategoryKey);

  const { selectedNested, setSelectedNested, listings, nestedCounts } = useSubcategoryListings(
    allListings, categoryKey, subcategoryKey, nestedItems, selectedRegions, selectedCities, searchQuery,
  );
  useSearchTracking({
    query: searchQuery,
    resultsCount: listings.length,
    loading,
    filters: {
      category: categoryKey,
      subcategory: subcategoryKey,
      ...(selectedNested ? { type: String(selectedNested) } : {}),
      ...(selectedRegions.length ? { region: selectedRegions.slice(0, 20).map(String) } : {}),
      ...(selectedCities.length ? { city: selectedCities.slice(0, 20).map(String) } : {}),
    },
  });

  const categoryLabel = t(`categories.${categoryKey}`, { defaultValue: category?.name ?? categoryKey });
  const subLabel = t(`subcategories.${group}.${subcategoryKey}`, { defaultValue: sub?.name ?? subcategoryKey });
  const subIcon = (sub?.icon ?? "tag-outline") as string;

  function handlePost() {
    router.push(user ? ROUTES.newAd : ROUTES.login);
  }

  const renderListItem = useCallback(({ item, index }: ListingRenderInfo) => (
    <View
      style={gridCellPadding(index, numColumns, H_PAD, GAP)}
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
      contentContainerStyle={listings.length === 0 && !loading ? styles.emptyContainer : [styles.listContent, paddingBottomOf(insets.bottom + 84)]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={isTabletLandscape ? null : header}
      ListEmptyComponent={
        !loading ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="tag-off-outline"
              title={t("common.noResults")}
              message={selectedNested ? t(selectedNested.labelKey) : subLabel}
            />
          </View>
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
            <View style={[styles.sidebar, fixedWidth(sidebarWidth)]}>
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
