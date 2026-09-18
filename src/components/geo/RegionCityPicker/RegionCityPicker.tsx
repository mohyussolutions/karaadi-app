import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import type { RegionCityPickerProps } from '../../../util/types';
import { useRegionCityPicker } from './useRegionCityPicker';
import { PickerFields } from './PickerFields';
import { RegionAccordionPanel } from './RegionAccordionPanel';
import { CityAccordionPanel } from './CityAccordionPanel';
import { useThemedStyles } from '../../../hooks/useTheme';
import { createStyles } from '../../../util/styles/geo/regionCityPicker.styles';

export default function RegionCityPicker(props: RegionCityPickerProps) {
  const { selectedRegion, selectedCity, regionError, cityError, scrollViewRef } = props;
  const picker = useRegionCityPicker(props);
  const s = useThemedStyles(createStyles);
  const wrapperY = useRef(0);

  useEffect(() => {
    if (!picker.regionExpanded && !picker.cityExpanded) return;
    const id = requestAnimationFrame(() => {
      scrollViewRef?.current?.scrollTo({ y: Math.max(wrapperY.current - 12, 0), animated: true });
    });
    return () => cancelAnimationFrame(id);
  }, [picker.regionExpanded, picker.cityExpanded, scrollViewRef]);

  return (
    <View style={s.wrapper} onLayout={(e) => { wrapperY.current = e.nativeEvent.layout.y; }}>
      <PickerFields
        selectedRegion={selectedRegion}
        cityText={picker.cityText}
        loadingRegions={picker.loadingRegions}
        regionExpanded={picker.regionExpanded}
        cityExpanded={picker.cityExpanded}
        onToggleRegion={picker.toggleRegionPanel}
        onToggleCity={picker.toggleCityPanel}
        onClearCity={picker.clearCity}
        regionError={regionError}
        cityError={cityError}
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
