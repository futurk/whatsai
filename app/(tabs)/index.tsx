import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { MessageSquare, Plus, Trash2 } from 'lucide-react-native';
import { useChatContext } from '@/context/ChatContext';
import { useAgentContext } from '@/context/AgentContext';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import EmptyState from '@/components/EmptyState';
import { useState } from 'react';
import ConfirmationDialog from '@/components/ConfirmationDialog';

export default function ChatsScreen() {
  const router = useRouter();
  const { conversations, startNewConversation, deleteConversations } = useChatContext();
  const { getAgentById, defaultAgentId } = useAgentContext();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const navigateToChat = (id: string) => {
    try {
      if (selectedChats.size > 0) {
        handleChatSelect(id);
      } else {
        router.push(`/chat/${id}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleLongPress = (id: string) => {
    handleChatSelect(id);
  };

  const handleChatSelect = (id: string) => {
    setSelectedChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteConversations(Array.from(selectedChats));
    setSelectedChats(new Set());
    setShowDeleteDialog(false);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const cancelSelection = () => {
    setSelectedChats(new Set());
  };

  const renderItem = ({ item, index }) => {
    const agent = getAgentById(item.agentId);
    if (!agent) {
      return null;
    }
    
    const lastMessage = item.messages[item.messages.length - 1]?.text || t('chat.newChat');
    const messagePreview = lastMessage.length > 40 ? lastMessage.substring(0, 40) + '...' : lastMessage;
    const isSelected = selectedChats.has(item.id);
    
    return (
      <Animated.View 
        entering={FadeInUp.delay(index * 100).springify()} 
        style={styles.animatedContainer}
      >
        <Pressable 
          style={[
            styles.chatItem,
            { backgroundColor: theme.colors.card },
            isSelected && { backgroundColor: theme.colors.primary + '20' }
          ]} 
          onPress={() => navigateToChat(item.id)}
          onLongPress={() => handleLongPress(item.id)}
          delayLongPress={200}
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
      title={t('chat.empty.title')}
      message={t('chat.empty.message')}
      actionLabel={t('chat.empty.action')}
      onAction={() => router.push('/agents')}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {selectedChats.size > 0 && (
        <View style={[styles.selectionHeader, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.selectionText, { color: theme.colors.text.primary }]}>
            {selectedChats.size} selected
          </Text>
          <View style={styles.selectionActions}>
            <Pressable
              style={[styles.selectionButton, { backgroundColor: theme.colors.surface }]}
              onPress={cancelSelection}
            >
              <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
                {t('common.cancel')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.selectionButton, { backgroundColor: theme.colors.error + '20' }]}
              onPress={handleDeleteSelected}
            >
              <Trash2 size={20} color={theme.colors.error} />
              <Text style={[styles.buttonText, { color: theme.colors.error, marginLeft: 8 }]}>
                {t('common.delete')}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

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

      <ConfirmationDialog
        visible={showDeleteDialog}
        title={t('dialogs.clearConversations.title')}
        message={t('dialogs.clearConversations.message')}
        confirmText={t('common.delete')}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        destructive
      />
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
    paddingBottom: 80,
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
    bottom: 80,
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
    zIndex: 1,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});