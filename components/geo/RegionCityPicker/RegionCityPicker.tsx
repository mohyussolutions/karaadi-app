import React from 'react';
import { View } from 'react-native';
import type { RegionCityPickerProps } from '../../../util/types';
import { useRegionCityPicker } from './useRegionCityPicker';
import { PickerFields } from './PickerFields';
import { RegionAccordionPanel } from './RegionAccordionPanel';
import { CityAccordionPanel } from './CityAccordionPanel';
import { useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/geo/regionCityPicker.styles';

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
          regions={picker.regions}
          selectedRegion={selectedRegion}
          onSelectRegion={picker.handleSelectRegion}
          onClose={picker.collapseRegionPanel}
        />
      )}

      {picker.cityExpanded && (
        <CityAccordionPanel
          search={picker.citySearch}
          onSearchChange={picker.setCitySearch}
          cities={picker.filteredCities}
          selectedCity={selectedCity}
          savingCity={picker.savingCity}
          onSelectCity={picker.handleSelectCity}
          onAddCustomCity={picker.handleAddCustomCity}
          onClose={picker.collapseCityPanel}
        />
      )}
    </View>
  );
}
