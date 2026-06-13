import React from 'react';
import { View } from 'react-native';
import type { RegionCityPickerProps } from '../../../utils/types';
import { useRegionCityPicker } from './useRegionCityPicker';
import { PickerFields } from './PickerFields';
import { RegionPickerModal } from './RegionPickerModal';
import { CityPickerModal } from './CityPickerModal';
import { useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from './styles';

export default function RegionCityPicker(props: RegionCityPickerProps) {
  const { selectedRegion, selectedCity } = props;
  const picker = useRegionCityPicker(props);
  const s = useThemedStyles(createStyles);

  return (
    <View style={s.wrapper}>
      <PickerFields
        selectedRegion={selectedRegion}
        cityText={picker.cityText}
        loadingRegions={picker.loadingRegions}
        onOpenRegion={picker.openRegionPicker}
        onOpenCity={picker.openCityModal}
        onClearCity={picker.clearCity}
      />

      <RegionPickerModal
        visible={picker.regionModalOpen}
        onClose={picker.closeRegionModal}
        search={picker.regionSearch}
        onSearchChange={picker.setRegionSearch}
        regions={picker.filteredRegions}
        selectedRegion={selectedRegion}
        selectedCity={selectedCity}
        onSelectRegion={picker.handleSelectRegion}
        onSelectCity={picker.handleSelectCity}
      />

      <CityPickerModal
        visible={picker.cityModalOpen}
        onClose={picker.closeCityModal}
        search={picker.modalSearch}
        onSearchChange={picker.setModalSearch}
        cities={picker.filteredCities}
        selectedCity={selectedCity}
        showUseTyped={picker.showUseTyped}
        savingCity={picker.savingCity}
        onSelectCity={picker.handleSelectCity}
        onAddCustomCity={picker.handleAddCustomCity}
      />
    </View>
  );
}
