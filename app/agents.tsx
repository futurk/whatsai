import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Users } from 'lucide-react-native';
import { useAgentContext } from '@/context/AgentContext';
import { useChatContext } from '@/context/ChatContext';
import { useTheme } from '@/context/ThemeContext';
import EmptyState from '@/components/EmptyState';

export default function AgentsScreen() {
  const router = useRouter();
  const { agents } = useAgentContext();
  const { startNewConversation } = useChatContext();
  const { theme } = useTheme();

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
          { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
          pressed && { backgroundColor: theme.colors.surface }
        ]} 
        onPress={() => handleAgentPress(item.id)}
      >
        <View style={[styles.avatarContainer, { backgroundColor: item.color + '20' }]}>
          <Text style={[styles.avatarText, { color: item.color }]}>
            {item.name.charAt(0)}
          </Text>
        </View>
        
        <View style={styles.agentContent}>
          <Text style={[styles.agentName, { color: theme.colors.text.primary }]}>
            {item.name}
          </Text>
          <Text style={[styles.agentVendor, { color: theme.colors.text.secondary }]}>
            {item.vendor}
          </Text>
          <Text style={[styles.agentModel, { color: theme.colors.text.secondary }]} numberOfLines={1}>
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
      icon={<Users size={48} color={theme.colors.primary} />}
      title="No agents available"
      message="Check back soon for new AI agents to chat with."
      actionLabel="Refresh"
      onAction={() => {}}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Available Agents',
          headerTitleStyle: [styles.headerTitle, { color: theme.colors.text.primary }],
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text.primary} />
            </Pressable>
          ),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <FlatList
          data={agents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    marginBottom: 4,
  },
  agentVendor: {
    fontSize: 14,
    marginBottom: 2,
  },
  agentModel: {
    fontSize: 14,
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