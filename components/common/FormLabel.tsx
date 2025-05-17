import { Text, StyleSheet, View } from 'react-native';
import { theme } from '@/types/theme';

interface FormLabelProps {
  label: string;
  required?: boolean;
}

export function FormLabel({ label, required }: FormLabelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        <Text>{label}</Text>
        {required && <Text style={styles.required}> *</Text>}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  required: {
    color: theme.colors.error,
  },
});