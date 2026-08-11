import React, { useEffect, useRef, useState } from 'react';
import type { FormFieldProps } from '../../../../../util/types';
import { View, Text, TextInput, Animated } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { Dropdown } from './Dropdown';
import { createStyles } from '../../../../../util/styles/new-ad/formField.styles';

export function FormField({ field, value, onChange, error }: FormFieldProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);
  const [focused, setFocused] = useState(false);
  const float = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(float, {
      toValue: focused || !!value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [focused, value, float]);

  if (field.type === 'dropdown') {
    return (
      <Dropdown
        label={field.label}
        value={value}
        options={field.options || []}
        onChange={onChange}
        placeholder={field.placeholder}
        required={field.required}
        error={error}
      />
    );
  }

  const isTextarea = field.type === 'textarea';
  const isNumber = field.type === 'number';
  const isPhone = field.type === 'phone';

  function handleChange(v: string) {
    if (isNumber) return onChange(v.replace(/[^0-9.]/g, ''));
    if (isPhone) return onChange(v.replace(/[^0-9+\-()\s]/g, ''));
    onChange(v);
  }

  const labelTop = float.interpolate({ inputRange: [0, 1], outputRange: [isTextarea ? 18 : 16, -9] });
  const labelSize = float.interpolate({ inputRange: [0, 1], outputRange: [15, 11.5] });

  return (
    <View style={s.wrap}>
      <View style={[s.field, isTextarea && s.fieldTextarea, focused && s.fieldFocused, error ? s.fieldError : null]}>
        <Animated.Text
          style={[s.floatingLabel, { top: labelTop, fontSize: labelSize }, focused && s.floatingLabelActive]}
          numberOfLines={1}
        >
          {field.label}{field.required && ' *'}
        </Animated.Text>
        <TextInput
          style={[s.input, isTextarea && s.inputTextarea]}
          value={value}
          onChangeText={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? field.placeholder : undefined}
          placeholderTextColor={Colors.placeholder}
          keyboardType={isNumber ? 'number-pad' : isPhone ? 'phone-pad' : 'default'}
          autoComplete={isPhone ? 'tel' : undefined}
          multiline={isTextarea}
          numberOfLines={isTextarea ? 4 : 1}
          textAlignVertical={isTextarea ? 'top' : 'center'}
          underlineColorAndroid="transparent"
        />
      </View>
      {!!error && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
}
