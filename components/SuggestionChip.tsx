import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { memo } from 'react';

interface SuggestionChipProps {
  text: string;
  onPress: () => void;
}

const SuggestionChip = ({ text, onPress }: SuggestionChipProps) => {
  return (
    <Animated.View
      entering={FadeIn.delay(300).duration(300)}
      style={styles.container}
    >
      <Pressable
        style={({ pressed }) => [
          styles.chip,
          pressed && styles.chipPressed,
        ]}
        onPress={onPress}
      >
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 4,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipPressed: {
    backgroundColor: '#E5E7EB',
  },
  text: {
    fontSize: 14,
    color: '#4B5563',
  },
});

export default memo(SuggestionChip);