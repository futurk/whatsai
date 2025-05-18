import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MessageSquare, Plus } from 'lucide-react-native';
import { useChatContext } from '@/context/ChatContext';
import { useAgentContext, getAgentById } from '@/context/AgentContext';
import { useTheme } from '@/context/ThemeContext';
import EmptyState from '@/components/EmptyState';

export default function ChatsScreen() {
  const router = useRouter();
  const { conversations } = useChatContext();
  const { getAgentById } = useAgentContext();
  const { theme } = useTheme();
  const { defaultAgentId } = useAgentContext();

  const navigateToChat = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const navigateToAgents = () => {
    router.push('/agents');
  };

  const renderItem = ({ item, index }) => {
    const agent = getAgentById(item.agentId);
    if (!agent) {
      return null;
    }
    
    const lastMessage = item.messages[item.messages.length - 1]?.text || 'Start a conversation';
    const messagePreview = lastMessage.length > 40 ? lastMessage.substring(0, 40) + '...' : lastMessage;
    
    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 100).springify()} 
        style={styles.animatedContainer}
      >
        <Pressable 
          style={[styles.chatItem, { backgroundColor: theme.colors.card }]} 
          onPress={() => navigateToChat(item.id)}
        >
          <View style={[styles.avatarContainer, { backgroundColor: agent.color + '20' }]}>
            <Text style={[styles.avatarText, { color: agent.color }]}>
              {agent.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.chatContent}>
            <Text style={[styles.chatName, { color: theme.colors.text.primary }]}>
              {agent.name}
            </Text>
            <Text style={[styles.chatPreview, { color: theme.colors.text.secondary }]}>
              {messagePreview}
            </Text>
          </View>
          <Text style={[styles.timestamp, { color: theme.colors.text.secondary }]}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </Pressable>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <EmptyState
      icon={<MessageSquare size={48} color={theme.colors.primary} />}
      title="No conversations yet"
      message="Start chatting with an AI agent to see your conversations here."
      actionLabel="Find an agent"
      onAction={navigateToAgents}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
      <Pressable 
  style={[styles.fab, { backgroundColor: theme.colors.primary }]} 
  onPress={() => {
    if (defaultAgentId) {
      const conversationId = startNewConversation(defaultAgentId);
      router.push(`/chat/${conversationId}`);
    } else {
      router.push('/agents');
    }
  }}
>
  <Plus size={24} color="#FFFFFF" />
</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  animatedContainer: {
    width: '100%',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  chatPreview: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});