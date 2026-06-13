import React from 'react';
import { View } from 'react-native';
import type { RegionCityPickerProps } from '../../../utils/types';
import { useRegionCityPicker } from './useRegionCityPicker';
import { PickerFields } from './PickerFields';
import { RegionAccordionPanel } from './RegionAccordionPanel';
import { CityAccordionPanel } from './CityAccordionPanel';
import { useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../utils/styles/geo/regionCityPicker.styles';

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
        regionExpanded={picker.regionExpanded}
        cityExpanded={picker.cityExpanded}
        onToggleRegion={picker.toggleRegionPanel}
        onToggleCity={picker.toggleCityPanel}
        onClearCity={picker.clearCity}
      />

      {picker.regionExpanded && (
        <RegionAccordionPanel
          search={picker.regionSearch}
          onSearchChange={picker.setRegionSearch}
          regions={picker.filteredRegions}
          selectedRegion={selectedRegion}
          onSelectRegion={picker.handleSelectRegion}
          onClose={picker.collapseRegionPanel}
        />
      )}

      {picker.cityExpanded && (
        <CityAccordionPanel
          search={picker.modalSearch}
          onSearchChange={picker.setModalSearch}
          cities={picker.filteredCities}
          selectedCity={selectedCity}
          showUseTyped={picker.showUseTyped}
          savingCity={picker.savingCity}
          onSelectCity={picker.handleSelectCity}
          onAddCustomCity={picker.handleAddCustomCity}
          onClose={picker.collapseCityPanel}
        />
      )}
    </View>
  );
}
