import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Users } from 'lucide-react-native';
import { useAgentContext } from '@/context/AgentContext';
import { useChatContext } from '@/context/ChatContext';
import EmptyState from '@/components/EmptyState';

export default function AgentsScreen() {
  const router = useRouter();
  const { agents } = useAgentContext();
  const { startNewConversation } = useChatContext();

  const handleAgentPress = (agentId: string) => {
    const conversationId = startNewConversation(agentId);
    router.push(`/chat/${conversationId}`);
  };

  const renderItem = ({ item, index }) => (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).springify()} 
      style={styles.animatedContainer}
    >
      <Pressable 
        style={({ pressed }) => [
          styles.agentItem,
          pressed && styles.agentItemPressed
        ]} 
        onPress={() => handleAgentPress(item.id)}
      >
        <View style={[styles.avatarContainer, { backgroundColor: item.color + '20' }]}>
          <Text style={[styles.avatarText, { color: item.color }]}>
            {item.name.charAt(0)}
          </Text>
        </View>
        
        <View style={styles.agentContent}>
          <Text style={styles.agentName}>{item.name}</Text>
          <Text style={styles.agentVendor}>{item.vendor}</Text>
          <Text style={styles.agentModel} numberOfLines={1}>
            {item.model}
          </Text>
          
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View 
                key={index} 
                style={[styles.tag, { backgroundColor: item.color + '15' }]}
              >
                <Text style={[styles.tagText, { color: item.color }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <EmptyState
      icon={<Users size={48} color="#3B82F6" />}
      title="No agents available"
      message="Check back soon for new AI agents to chat with."
      actionLabel="Refresh"
      onAction={() => {}}
    />
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Available Agents',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#1F2937" />
            </Pressable>
          ),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={agents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 17,
  },
  backButton: {
    padding: 8,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  animatedContainer: {
    marginBottom: 12,
  },
  agentItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  agentItemPressed: {
    backgroundColor: '#F9FAFB',
    transform: [{ scale: 0.995 }],
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
  },
  agentContent: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  agentVendor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  agentModel: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});