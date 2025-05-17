import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { memo } from 'react';
import { Agent } from '@/types/agent';
import { Check } from 'lucide-react-native';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
}

const AgentCard = ({ agent, isSelected, onSelect }: AgentCardProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(isSelected ? 1.05 : 1, { duration: 200 }) },
      ],
      borderColor: withTiming(isSelected ? agent.color : '#E5E7EB', { duration: 200 }),
      borderWidth: withTiming(isSelected ? 2 : 1, { duration: 200 }),
    };
  });

  return (
    <Pressable onPress={onSelect}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
        ]}
      >
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: agent.color }]}>
            <Check size={14} color="#FFFFFF" />
          </View>
        )}
        
        <View style={[styles.avatarContainer, { backgroundColor: agent.color + '20' }]}>
          <Text style={[styles.avatarText, { color: agent.color }]}>
            {agent.name.charAt(0)}
          </Text>
        </View>
        
        <Text style={styles.name} numberOfLines={1}>{agent.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{agent.description}</Text>
        
        <View style={styles.tagsContainer}>
          {agent.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: agent.color + '15' }]}>
              <Text style={[styles.tagText, { color: agent.color }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    height: 180,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    flexShrink: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default memo(AgentCard);