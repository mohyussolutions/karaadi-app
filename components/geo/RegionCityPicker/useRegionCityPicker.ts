import { useEffect, useMemo, useState } from 'react';
import type { RegionPickerItem, RegionCityPickerProps } from '../../../util/types';
import { clientGetAllRegions, clientAddCity } from '../../../api/categories/geo.actions';

export function useRegionCityPicker({
  selectedRegion,
  selectedCity,
  onRegionChange,
  onCityChange,
}: RegionCityPickerProps) {
  const [regions, setRegions] = useState<RegionPickerItem[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [selectedRegionObj, setSelectedRegionObj] = useState<RegionPickerItem | null>(null);

  const [regionExpanded, setRegionExpanded] = useState(false);

  const [cityExpanded, setCityExpanded] = useState(false);
  const [cityText, setCityText] = useState(selectedCity || '');
  const [citySearch, setCitySearch] = useState('');
  const [savingCity, setSavingCity] = useState(false);

  useEffect(() => {
    clientGetAllRegions()
      .then((data) => {
        const list: RegionPickerItem[] = Array.isArray(data)
          ? data.map((r: any) => ({
              id: r.id || r._id || String(Math.random()),
              name: r.name,
              cities: (r.cities || []).map((c: any) => ({
                id: c.id || c._id || String(Math.random()),
                name: c.name,
              })),
            }))
          : [];
        setRegions(list);
        if (selectedRegion) {
          const match = list.find((r) => r.name === selectedRegion);
          if (match) setSelectedRegionObj(match);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingRegions(false));
  }, []);

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
        setRegions(prev => prev.map(r =>
          r.id === selectedRegionObj.id
            ? { ...r, cities: [...(r.cities ?? []), { id: savedId, name: savedName }] }
            : r
        ));
        setSelectedRegionObj(prev =>
          prev ? { ...prev, cities: [...(prev.cities ?? []), { id: savedId, name: savedName }] } : prev
        );
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
