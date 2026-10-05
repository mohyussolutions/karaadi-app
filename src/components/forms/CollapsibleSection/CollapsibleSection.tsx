import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColors, useThemedStyles } from '../../../hooks/app/useTheme';
import { createStyles } from '../../../utils/styles/new-ad/collapsibleSection.styles';
import type { CollapsibleSectionProps } from "../../../utils/types";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  hasError = false,
}: CollapsibleSectionProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (hasError) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setOpen(true);
    }
  }, [hasError]);

  function toggle() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  }

  return (
    <View style={[s.wrap, hasError && s.wrapError]}>
      <TouchableOpacity style={s.header} onPress={toggle} activeOpacity={0.7}>
        <View style={s.titleRow}>
          <Text style={[s.title, hasError && s.titleError]}>{title}</Text>
          {hasError && <MaterialCommunityIcons name="alert-circle" size={14} color={Colors.error} />}
        </View>
        <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={20} color={hasError ? Colors.error : Colors.textMuted} />
      </TouchableOpacity>
      {open && <View style={s.body}>{children}</View>}
    </View>
  );
}
