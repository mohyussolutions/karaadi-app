import React, { useState, useEffect, useMemo, memo, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors, useThemedStyles } from "../../../hooks/useTheme";
import { ListingCard, ListingCardSkeleton, EmptyState, AppIcon } from "../../../components/shared";
import BottomTabBar from "../../../components/layout/BottomTabBar";
import { clientGetAllRegions } from "../../../api/categories/geo.actions";
import { useAppSelector } from "../../../store";
import { useAppTranslation } from "../../../hooks/useAppTranslation";
import { useResponsive } from "../../../hooks/useResponsive";
import { useCategoryFeed } from "../../../hooks/useCategoryFeed";
import { getCategoryByKey, SUB_I18N_GROUP, type NestedSubCategory } from "../../../constants";
import type { ListingBase } from "../../../utils/types/listing.types";
import type {
  NestedChipsProps, SidebarNestedProps, RegionPickerItem,
  ChipItemProps, NestedItemProps, LocationFilterModalProps, FilterRow,
} from "../../../utils/types";
import { createStyles } from "../../../utils/styles/browse/subcategory.styles";

const H_PAD = 12;
const GAP = 8;
const SKELETON_COUNT = 6;

const ChipItem = memo(function ChipItem({ item, active, onPress }: ChipItemProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const handlePress = useCallback(() => onPress(active ? null : item), [onPress, active, item]);

  return (
    <Pressable onPress={handlePress} style={[styles.chip, active && styles.chipActive]} hitSlop={4}>
      <AppIcon name={item.icon} size={14} color={active ? Colors.white : Colors.textSecondary} />
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]} numberOfLines={1}>
        {t(item.labelKey)}
      </Text>
    </Pressable>
  );
});

function NestedChips({ items, selectedKey, onPress }: NestedChipsProps) {
  const styles = useThemedStyles(createStyles);
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NestedSubCategory>) => (
      <ChipItem item={item} active={selectedKey === item.key} onPress={onPress} />
    ),
    [selectedKey, onPress],
  );

  return (
    <View style={styles.chipsScroll}>
      <FlashList
        horizontal
        data={items}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        renderItem={renderItem}
      />
    </View>
  );
}

const NestedItem = memo(function NestedItem({ item, active, count, onPress }: NestedItemProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const handlePress = useCallback(() => onPress(active ? null : item), [onPress, active, item]);

  return (
    <Pressable onPress={handlePress} style={[styles.nestedItem, active && styles.nestedItemActive]}>
      <View style={[styles.nestedIconWrap, active && styles.nestedIconActive]}>
        <AppIcon name={item.icon} size={18} color={active ? Colors.primary : Colors.textPrimary} />
      </View>
      <Text style={[styles.nestedLabel, active && styles.nestedLabelActive]} numberOfLines={2}>
        {t(item.labelKey)}
      </Text>
      {count > 0 && (
        <Text style={[styles.nestedCount, active && styles.nestedCountActive]}>{count}</Text>
      )}
    </Pressable>
  );
});

function SidebarNested({ items, selectedKey, counts, onPress, subLabel, subIcon, onPost, onFilterPress, hasLocationFilter }: SidebarNestedProps) {
  const { t } = useAppTranslation();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NestedSubCategory>) => (
      <NestedItem item={item} active={selectedKey === item.key} count={counts[item.key] ?? 0} onPress={onPress} />
    ),
    [selectedKey, counts, onPress],
  );

  const header = (
    <View>
      <View style={styles.sidebarHeader}>
        <AppIcon name={subIcon} size={18} color={Colors.primary} />
        <Text style={styles.sidebarTitle} numberOfLines={2}>{subLabel}</Text>
        <Pressable
          style={[styles.filterIconBtn, hasLocationFilter && styles.filterIconBtnActive]}
          onPress={onFilterPress}
          hitSlop={6}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={16}
            color={hasLocationFilter ? Colors.white : Colors.primary}
          />
        </Pressable>
      </View>

      {selectedKey && (
        <Pressable style={styles.clearRow} onPress={() => onPress(null)}>
          <MaterialCommunityIcons name="filter-remove-outline" size={16} color={Colors.primary} />
          <Text style={styles.clearText}>{t("common.clearFilter") || "Clear filter"}</Text>
        </Pressable>
      )}
    </View>
  );

  const footer = (
    <TouchableOpacity style={styles.postBtn} onPress={onPost} activeOpacity={0.88}>
      <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
      <Text style={styles.postBtnText}>{t("wantSell.title")}</Text>
      <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.white} />
    </TouchableOpacity>
  );

  return (
    <FlashList
      data={items}
      keyExtractor={(item) => item.key}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
    />
  );
}

function LocationFilterModal({
  visible,
  onClose,
  regions,
  selectedRegions,
  selectedCities,
  onToggleRegion,
  onToggleCity,
  onClear,
}: LocationFilterModalProps) {
  const { t } = useAppTranslation();
  const insets = useSafeAreaInsets();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (visible) setSearch("");
  }, [visible]);

  const rows = useMemo<FilterRow[]>(() => {
    const q = search.trim().toLowerCase();
    const out: FilterRow[] = [];
    for (const r of regions) {
      if (q && !r.name.toLowerCase().includes(q)) continue;
      out.push({ key: `region-${r.id}`, kind: "region", name: r.name });
      if (selectedRegions.includes(r.name)) {
        for (const c of r.cities ?? []) {
          out.push({ key: `city-${r.id}-${c.id}`, kind: "city", name: c.name });
        }
      }
    }
    return out;
  }, [regions, search, selectedRegions]);

  const totalSelected = selectedRegions.length + selectedCities.length;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <Pressable style={styles.filterBackdrop} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.filterSheet}>
        <View style={styles.filterSheetHandle} />
        <View style={styles.filterSheetHeader}>
          <Text style={styles.filterSheetTitle}>{t("filters.location.mobileFilter")}</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <MaterialCommunityIcons name="close" size={22} color={Colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.filterSearchBox}>
          <MaterialCommunityIcons name="magnify" size={18} color={Colors.primary} />
          <TextInput
            style={styles.filterSearchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={t("common.region")}
            placeholderTextColor={Colors.placeholder}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>

        <FlatList
          data={rows}
          keyExtractor={(row) => row.key}
          style={styles.filterList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.filterListContent}
          ListEmptyComponent={
            <View style={styles.filterEmpty}>
              <Text style={styles.filterEmptyText}>{t("common.noResults")}</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isCity = item.kind === "city";
            const active = isCity ? selectedCities.includes(item.name) : selectedRegions.includes(item.name);
            return (
              <Pressable
                style={[styles.filterOption, isCity && styles.filterOptionCity, active && styles.filterOptionActive]}
                onPress={() => (isCity ? onToggleCity(item.name) : onToggleRegion(item.name))}
              >
                <MaterialCommunityIcons
                  name={active ? "checkbox-marked" : "checkbox-blank-outline"}
                  size={isCity ? 18 : 20}
                  color={active ? Colors.primary : Colors.textMuted}
                />
                <MaterialCommunityIcons
                  name={isCity ? "city-variant-outline" : "map-marker-outline"}
                  size={isCity ? 16 : 18}
                  color={active ? Colors.primary : Colors.textMuted}
                />
                <Text style={[styles.filterOptionText, active && styles.filterOptionTextActive]} numberOfLines={1}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />

        <View style={[styles.filterFooter, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={styles.filterClearBtn} onPress={onClear} activeOpacity={0.8}>
            <Text style={styles.filterClearText}>{t("filters.location.clearAll")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterApplyBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.filterApplyText}>
              {totalSelected > 0 ? `${t("common.apply")} (${totalSelected})` : t("common.apply")}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function SubcategoryScreen() {
  const { category: categoryKey, subcategory: subcategoryKey } =
    useLocalSearchParams<{ category: string; subcategory: string }>();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const searchQuery = useAppSelector((s) => s.browseSearch.query);
  const { t } = useAppTranslation();
  const { isTabletLandscape, sidebarWidth, mainWidth, numColumns, cardWidth } = useResponsive();
  const Colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const category = getCategoryByKey(categoryKey);
  const group = SUB_I18N_GROUP[categoryKey] ?? categoryKey.toLowerCase();
  const sub = category?.subCategories.find((s) => s.key === subcategoryKey);
  const nestedItems = sub?.nested ?? [];

  const { listings: allListings, loading, refreshing, onRefresh } = useCategoryFeed(categoryKey, subcategoryKey);
  const [selectedNested, setSelectedNested] = useState<NestedSubCategory | null>(null);

  const [regions, setRegions] = useState<RegionPickerItem[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    clientGetAllRegions()
      .then((data) => {
        const list: RegionPickerItem[] = Array.isArray(data)
          ? data.map((r: any) => ({
              id: r.id || r._id || String(Math.random()),
              name: r.name,
              cities: (r.cities || []).map((c: any) => ({ id: c.id || c._id || String(Math.random()), name: c.name })),
            }))
          : [];
        setRegions(list);
      })
      .catch(() => {});
  }, []);

  function toggleRegion(name: string) {
    setSelectedRegions((prev) => {
      if (prev.includes(name)) {
        const cityNames = new Set((regions.find((r) => r.name === name)?.cities ?? []).map((c) => c.name));
        setSelectedCities((cities) => cities.filter((c) => !cityNames.has(c)));
        return prev.filter((r) => r !== name);
      }
      return [...prev, name];
    });
  }

  function toggleCity(name: string) {
    setSelectedCities((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]));
  }

  function clearLocationFilter() {
    setSelectedRegions([]);
    setSelectedCities([]);
  }

  const hasLocationFilter = selectedRegions.length > 0 || selectedCities.length > 0;

  function matchesSub(item: ListingBase, key: string): boolean {
    const raw = item as any;
    if (raw.categoryTag === key) return true;
    if (raw.categoryArr?.includes(key)) return true;
    return item.category === key;
  }

  function matchesNested(item: ListingBase, key: string): boolean {
    const raw = item as any;
    if (raw.subcategoryArr?.includes(key)) return true;
    return item.subcategory === key;
  }

  const listings = useMemo<ListingBase[]>(() => {
    let result = allListings.filter((item) => matchesSub(item, subcategoryKey));
    if (selectedNested) result = result.filter((item) => matchesNested(item, selectedNested.key));
    if (selectedRegions.length) result = result.filter((item) => selectedRegions.includes(item.region));
    if (selectedCities.length) result = result.filter((item) => selectedCities.includes(item.city));
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((item) => {
        const matchesTitle = (item.title ?? "").toLowerCase().includes(q);
        const matchesCity = (item.city ?? "").toLowerCase().includes(q);
        const matchesRegion = (item.region ?? "").toLowerCase().includes(q);
        const matchesPrice = String(item.price ?? "").includes(q);
        return matchesTitle || matchesCity || matchesRegion || matchesPrice;
      });
    }
    return result;
  }, [allListings, subcategoryKey, selectedNested, selectedRegions, selectedCities, searchQuery]);

  const nestedCounts = useMemo<Record<string, number>>(() => {
    const base = allListings.filter((item) => matchesSub(item, subcategoryKey));
    const out: Record<string, number> = {};
    for (const nested of nestedItems) {
      out[nested.key] = base.filter((item) => matchesNested(item, nested.key)).length;
    }
    return out;
  }, [allListings, subcategoryKey, nestedItems]);

  const categoryLabel = t(`categories.${categoryKey}`, { defaultValue: category?.name ?? categoryKey });
  const subLabel = t(`subcategories.${group}.${subcategoryKey}`, { defaultValue: sub?.name ?? subcategoryKey });
  const subIcon = (sub?.icon ?? "tag-outline") as string;
  const CARD_W = cardWidth(isTabletLandscape ? mainWidth : undefined, numColumns, H_PAD, GAP);

  function handlePost() {
    router.push(user ? "/(tabs)/new-ad" : "/(auth)/login");
  }

  const skeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({ _id: `sk-${i}`, id: `sk-${i}` }));

  const listHeader = (
    <View>
      <View style={styles.pageHeader}>
        <AppIcon name={subIcon} size={16} color={Colors.primary} />
        <Text style={styles.pageTitle} numberOfLines={1}>{subLabel}</Text>
        <Text style={styles.pageBreadcrumb} numberOfLines={1}>{categoryLabel}</Text>
        <Pressable
          style={[styles.filterIconBtn, hasLocationFilter && styles.filterIconBtnActive]}
          onPress={() => setFilterOpen(true)}
          hitSlop={6}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={16}
            color={hasLocationFilter ? Colors.white : Colors.primary}
          />
        </Pressable>
      </View>

      {nestedItems.length > 0 && (
        <NestedChips items={nestedItems} selectedKey={selectedNested?.key ?? null} onPress={setSelectedNested} />
      )}

      {selectedNested && (
        <View style={styles.activeFilterRow}>
          <MaterialCommunityIcons name="filter-check" size={14} color={Colors.primary} />
          <Text style={styles.activeFilterText}>{t(selectedNested.labelKey)}</Text>
          <Pressable onPress={() => setSelectedNested(null)} hitSlop={8}>
            <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
          </Pressable>
        </View>
      )}

      {hasLocationFilter && (
        <View style={styles.activeFilterRow}>
          <MaterialCommunityIcons name="map-marker-radius" size={14} color={Colors.primary} />
          <Text style={styles.activeFilterText} numberOfLines={1}>
            {[...selectedRegions, ...selectedCities].join(" • ")}
          </Text>
          <Pressable onPress={clearLocationFilter} hitSlop={8}>
            <MaterialCommunityIcons name="close-circle" size={16} color={Colors.textMuted} />
          </Pressable>
        </View>
      )}

      {!isTabletLandscape && (
        <TouchableOpacity
          style={[styles.postBtn, styles.postBtnSpaced]}
          onPress={handlePost}
          activeOpacity={0.88}
        >
          <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
          <Text style={styles.postBtnText}>{t("wantSell.title")}</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.white} />
        </TouchableOpacity>
      )}

      {!loading && listings.length > 0 && (
        <View style={styles.countRow}>
          <Text style={styles.countLabel}>{t("common.results", { defaultValue: "Results" })}:</Text>
          <Text style={styles.countValue}>{listings.length}</Text>
        </View>
      )}
    </View>
  );

  const feedList = (
    <FlatList
      key={`sub-${numColumns}`}
      data={loading ? (skeletonData as any) : listings}
      numColumns={numColumns}
      keyExtractor={(item) => item.id || item._id}
      removeClippedSubviews
      windowSize={5}
      maxToRenderPerBatch={10}
      initialNumToRender={10}
      columnWrapperStyle={styles.colWrapper}
      contentContainerStyle={listings.length === 0 && !loading ? styles.emptyContainer : styles.listContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={isTabletLandscape ? (
        <View style={styles.countRow}>
          {!loading && listings.length > 0 && (
            <>
              <Text style={styles.countLabel}>{t("common.results", { defaultValue: "Results" })}:</Text>
              <Text style={styles.countValue}>{listings.length}</Text>
            </>
          )}
        </View>
      ) : listHeader}
      ListEmptyComponent={
        !loading ? (
          <EmptyState
            icon="tag-off-outline"
            title={t("common.noResults")}
            message={selectedNested ? t(selectedNested.labelKey) : subLabel}
          />
        ) : null
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
        onToggleRegion={toggleRegion}
        onToggleCity={toggleCity}
        onClear={clearLocationFilter}
      />
    </View>
  );
}

