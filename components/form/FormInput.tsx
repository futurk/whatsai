import { TextInput, StyleSheet, View } from 'react-native';
import { FormLabel } from '@/components/common/FormLabel';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { theme } from '@/types/theme';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
}

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  error,
  multiline,
  numberOfLines,
  secureTextEntry,
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <FormLabel label={label} required={required} />
      <TextInput
        style={[
          styles.input,
          multiline && { height: numberOfLines ? numberOfLines * 24 : 100 },
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
      />
      {error && <ErrorMessage message={error} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
});