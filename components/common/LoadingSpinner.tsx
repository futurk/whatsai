import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export function LoadingSpinner({ size = 'large', color }: LoadingSpinnerProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size={size} 
        color={color || theme.colors.primary} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});