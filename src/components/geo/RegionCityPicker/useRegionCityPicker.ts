import { useEffect, useMemo, useState } from 'react';
import type { RegionPickerItem, RegionCityPickerProps } from '../../../util/types';
import { clientAddCity } from '../../../api/categories/geo.actions';
import { toRegionPickerItems } from '../../../util/helpers';
import { fetchGeoRegions, invalidateGeoCache, GEO_CACHE_TTL } from '../../../store/slices/geoSlice';
import { useAppDispatch, useAppSelector } from '../../../store/store';

export function useRegionCityPicker({
  selectedRegion,
  selectedCity,
  onRegionChange,
  onCityChange,
}: RegionCityPickerProps) {
  const dispatch = useAppDispatch();
  const geo = useAppSelector((s) => s.geo);
  const [regionsOverride, setRegionsOverride] = useState<RegionPickerItem[] | null>(null);
  const [selectedRegionObj, setSelectedRegionObj] = useState<RegionPickerItem | null>(null);

  const [regionExpanded, setRegionExpanded] = useState(false);

  const [cityExpanded, setCityExpanded] = useState(false);
  const [cityText, setCityText] = useState(selectedCity || '');
  const [citySearch, setCitySearch] = useState('');
  const [savingCity, setSavingCity] = useState(false);

  useEffect(() => {
    const isStale = !geo.fetchedAt || Date.now() - geo.fetchedAt >= GEO_CACHE_TTL;
    if (isStale && geo.status !== 'loading') dispatch(fetchGeoRegions());
  }, [dispatch, geo.fetchedAt, geo.status]);

  const regions = regionsOverride ?? toRegionPickerItems(geo.regions);
  const loadingRegions = geo.status === 'loading' && geo.regions.length === 0;

  useEffect(() => {
    if (selectedRegion && !selectedRegionObj) {
      const match = regions.find((r) => r.name === selectedRegion);
      if (match) setSelectedRegionObj(match);
    }
  }, [selectedRegion, regions, selectedRegionObj]);

  useEffect(() => { setCityText(selectedCity || ''); }, [selectedCity]);

  function toggleRegionPanel() {
    setCityExpanded(false);
    setRegionExpanded((prev) => !prev);
  }

  function handleSelectRegion(r: RegionPickerItem) {
    const sameRegion = selectedRegionObj?.id === r.id;
    setSelectedRegionObj(r);
    onRegionChange(r.name);
    setRegionExpanded(false);
    if (!sameRegion) {
      onCityChange('');
      setCityText('');
      setCitySearch('');
      setCityExpanded(true);
    }
  }

  function toggleCityPanel() {
    if (!selectedRegionObj) { toggleRegionPanel(); return; }
    setRegionExpanded(false);
    setCityExpanded((prev) => {
      if (!prev) setCitySearch('');
      return !prev;
    });
  }

  function handleSelectCity(name: string) {
    setCityText(name);
    onCityChange(name);
    setCitySearch('');
    setCityExpanded(false);
  }

  function clearCity() {
    setCityText('');
    onCityChange('');
  }

  async function handleAddCustomCity(name: string) {
    const trimmed = name.trim();
    if (!trimmed || !selectedRegionObj) {
      if (trimmed) handleSelectCity(trimmed);
      return;
    }
    setSavingCity(true);
    try {
      const res = await clientAddCity({ name: trimmed, regionId: selectedRegionObj.id });
      if (res.success && res.data?.name) {
        const savedName = String(res.data.name);
        const savedId = String(res.data._id || res.data.id || trimmed);
        setRegionsOverride(regions.map(r =>
          r.id === selectedRegionObj.id
            ? { ...r, cities: [...(r.cities ?? []), { id: savedId, name: savedName }] }
            : r
        ));
        setSelectedRegionObj(prev =>
          prev ? { ...prev, cities: [...(prev.cities ?? []), { id: savedId, name: savedName }] } : prev
        );
        dispatch(invalidateGeoCache());
        handleSelectCity(savedName);
      } else {
        handleSelectCity(trimmed);
      }
    } catch {
      handleSelectCity(trimmed);
    } finally {
      setSavingCity(false);
    }
  }

  const cities = selectedRegionObj?.cities ?? [];

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities;
    const q = citySearch.toLowerCase();
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cities, citySearch]);

  return {
    loadingRegions,
    cityText,
    savingCity,
    regionExpanded,
    regions,
    cityExpanded,
    citySearch,
    setCitySearch,
    filteredCities,
    toggleRegionPanel,
    collapseRegionPanel: () => setRegionExpanded(false),
    toggleCityPanel,
    collapseCityPanel: () => setCityExpanded(false),
    clearCity,
    handleSelectRegion,
    handleSelectCity,
    handleAddCustomCity,
  };
}
