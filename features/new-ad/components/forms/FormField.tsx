import React from 'react';
import type { FormFieldProps } from '../../../../util/types';
import { View, Text, TextInput } from 'react-native';
import { useThemeColors, useThemedStyles } from '../../../../hooks/useTheme';
import { Dropdown } from './Dropdown';
import { createStyles } from '../../../../util/styles/new-ad/formField.styles';

export function FormField({ field, value, onChange, error }: FormFieldProps) {
  const Colors = useThemeColors();
  const s = useThemedStyles(createStyles);

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

  return (
    <View style={s.wrap}>
      <Text style={s.label}>
        {field.label}
        {field.required && <Text style={s.req}> *</Text>}
      </Text>
      <TextInput
        style={[
          s.input,
          field.type === 'textarea' && s.textarea,
          error ? s.inputError : null,
        ]}
        value={value}
        onChangeText={v => onChange(field.type === 'number' ? v.replace(/[^0-9.]/g, '') : v)}
        placeholder={field.placeholder}
        placeholderTextColor={Colors.placeholder}
        keyboardType={field.type === 'number' ? 'number-pad' : 'default'}
        multiline={field.type === 'textarea'}
        numberOfLines={field.type === 'textarea' ? 4 : 1}
        textAlignVertical={field.type === 'textarea' ? 'top' : 'center'}
        underlineColorAndroid="transparent"
      />
      {!!error && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
}
