import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import COLORS from '../constants/colors';
import {
  clientGetAllRegions,
  clientAddCity,
} from '../services/geoService';

interface Region {
  id: string;
  name: string;
  cities?: City[];
}

interface City {
  id: string;
  name: string;
}

interface Props {
  selectedRegion: string;
  selectedCity: string;
  onRegionChange: (name: string) => void;
  onCityChange: (name: string) => void;
}

export default function RegionCityPicker({
  selectedRegion,
  selectedCity,
  onRegionChange,
  onCityChange,
}: Props) {
  const { t } = useTranslation();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [selectedRegionObj, setSelectedRegionObj] = useState<Region | null>(null);
  const [addingCity, setAddingCity] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [savingCity, setSavingCity] = useState(false);

  useEffect(() => {
    clientGetAllRegions()
      .then((data) => {
        const list: Region[] = Array.isArray(data)
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

  function handleSelectRegion(r: Region) {
    setSelectedRegionObj(r);
    onRegionChange(r.name);
    onCityChange('');
    setAddingCity(false);
    setNewCityName('');
  }

  function handleSelectCity(c: City) {
    onCityChange(c.name);
    setAddingCity(false);
    setNewCityName('');
  }

  async function handleAddCity() {
    const name = newCityName.trim();
    if (!name) return;
    if (!selectedRegionObj) {
      Alert.alert('Select a region first');
      return;
    }
    setSavingCity(true);
    const { success, data } = await clientAddCity({ name, regionId: selectedRegionObj.id });
    setSavingCity(false);
    if (success) {
      const newCity: City = { id: data?.id || data?._id || String(Date.now()), name };
      const updated = { ...selectedRegionObj, cities: [...(selectedRegionObj.cities || []), newCity] };
      setSelectedRegionObj(updated);
      setRegions((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      onCityChange(newCity.name);
      setNewCityName('');
      setAddingCity(false);
    } else {
      Alert.alert('Error', 'Failed to add city. Please try again.');
    }
  }

  const cities = selectedRegionObj?.cities ?? [];

  return (
    <View style={s.container}>
      <Text style={s.sectionLabel}>{t('createRealEstate.regionLabel')}</Text>

      {loadingRegions ? (
        <View style={s.loadingRow}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={s.loadingText}>{t('createCars.loadingRegions')}</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
          {regions.map((r) => {
            const active = selectedRegion === r.name;
            return (
              <TouchableOpacity
                key={r.id}
                style={[s.chip, active && s.chipActive]}
                onPress={() => handleSelectRegion(r)}
                activeOpacity={0.8}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>{r.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {selectedRegionObj && (
        <>
          <Text style={[s.sectionLabel, { marginTop: 12 }]}>{t('createRealEstate.cityLabel')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
            {cities.map((c) => {
              const active = selectedCity === c.name;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => handleSelectCity(c)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.chipText, active && s.chipTextActive]}>{c.name}</Text>
                </TouchableOpacity>
              );
            })}

            {!addingCity && (
              <TouchableOpacity style={s.addChip} onPress={() => setAddingCity(true)}>
                <MaterialCommunityIcons name="plus" size={13} color={COLORS.primary} />
                <Text style={s.addChipText}>{t('createCars.addNewCity')}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {addingCity && (
            <View style={s.addCityRow}>
              <TextInput
                style={s.addCityInput}
                value={newCityName}
                onChangeText={setNewCityName}
                placeholder={t('createCars.newCityPlaceholder')}
                placeholderTextColor={COLORS.placeholder}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleAddCity}
              />
              <TouchableOpacity
                style={[s.addCityBtn, (!newCityName.trim() || savingCity) && s.addCityBtnDisabled]}
                onPress={handleAddCity}
                disabled={!newCityName.trim() || savingCity}
              >
                {savingCity
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={s.addCityBtnText}>Add</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={s.cancelBtn} onPress={() => { setAddingCity(false); setNewCityName(''); }}>
                <MaterialCommunityIcons name="close" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          )}

          {cities.length === 0 && !addingCity && (
            <Text style={s.noCities}>{t('createCars.noCities')}</Text>
          )}
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 14 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  loadingText: { fontSize: 13, color: COLORS.textMuted },
  chipsRow: { gap: 8, paddingBottom: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '500', color: COLORS.textSecondary },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    backgroundColor: COLORS.white,
  },
  addChipText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  addCityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  addCityInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addCityBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
  },
  addCityBtnDisabled: { backgroundColor: COLORS.gray300 },
  addCityBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cancelBtn: { padding: 6 },
  noCities: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', marginTop: 4 },
});
