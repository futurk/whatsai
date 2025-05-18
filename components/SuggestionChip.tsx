import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { memo } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SuggestionChipProps {
  text: string;
  onPress: () => void;
}

const SuggestionChip = ({ text, onPress }: SuggestionChipProps) => {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.delay(300).duration(300)}
      style={styles.container}
    >
      <Pressable
        style={({ pressed }) => [
          styles.chip,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
          pressed && { backgroundColor: theme.colors.border },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
          {text}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 4,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
  },
});

export default memo(SuggestionChip);