import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { ReactNode } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon, title, message, actionLabel, onAction }: EmptyStateProps) => {
  const { theme } = useTheme();

  return (
    <Animated.View 
      entering={FadeIn.delay(300).duration(400)} 
      style={styles.container}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
        {icon}
      </View>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
        {message}
      </Text>
      
      {actionLabel && onAction && (
        <Pressable 
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.colors.primary },
            pressed && { opacity: 0.8 }
          ]} 
          onPress={onAction}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EmptyState;