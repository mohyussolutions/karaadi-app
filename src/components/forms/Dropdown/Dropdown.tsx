import { useCallback, useState } from 'react';
import type { DropdownProps } from '../../../util/types';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/useTheme';
import { useDropdownOptions } from '../../../hooks/useDropdownOptions';
import { createStyles } from '../../../util/styles/newAd/dropdown.styles';
import { DropdownOptionRow } from './DropdownOptionRow';

export function Dropdown({ label, value, options, onChange, placeholder, required, error }: DropdownProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { normalized, filtered } = useDropdownOptions(options, search);
  const displayLabel = normalized.find(o => o.value === value)?.label ?? value;

  function close() { setOpen(false); setSearch(''); }

  const handleSelect = useCallback((v: string) => {
    onChange(v);
    setOpen(false);
    setSearch('');
  }, [onChange]);

  return (
    <View style={s.wrap}>
      <Text style={s.label}>
        {label}{required && <Text style={s.req}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[s.trigger, error ? s.triggerError : null]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={displayLabel ? s.triggerVal : s.triggerPlaceholder} numberOfLines={1}>
          {displayLabel || placeholder || `Select ${label}`}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={20} color={Colors.textMuted} />
      </TouchableOpacity>
      {!!error && <Text style={s.errorText}>{error}</Text>}

      <Modal visible={open} animationType="slide" transparent onRequestClose={close}>
        <View style={s.overlay}>
          <TouchableOpacity style={s.backdrop} onPress={close} />
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>{label}</Text>
              <TouchableOpacity onPress={close} hitSlop={12}>
                <MaterialCommunityIcons name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {normalized.length > 6 && (
              <View style={s.searchRow}>
                <MaterialCommunityIcons name="magnify" size={16} color={Colors.textMuted} />
                <TextInput
                  style={s.searchInput}
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search…"
                  placeholderTextColor={Colors.placeholder}
                  autoFocus
                />
              </View>
            )}
            <FlatList overScrollMode="never"
              data={filtered}
              keyExtractor={item => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <DropdownOptionRow
                  option={item}
                  selected={item.value === value}
                  onSelect={handleSelect}
                />
              )}
              ItemSeparatorComponent={() => <View style={s.sep} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
