import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Agent } from '@/types/agent';

interface AgentSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  agents: Agent[];
  selectedAgentId: string | null;
  onSelect: (agentId: string | null) => void;
}

export default function AgentSelectionModal({
  visible,
  onClose,
  agents,
  selectedAgentId,
  onSelect,
}: AgentSelectionModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modal, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              Select Default Agent
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.secondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
              Choose an agent to start new chats with immediately
            </Text>

            {agents.map((agent) => (
              <Pressable
                key={agent.id}
                style={[
                  styles.agentItem,
                  { backgroundColor: theme.colors.card }
                ]}
                onPress={() => {
                  onSelect(agent.id);
                  onClose();
                }}
              >
                <View style={[styles.agentIcon, { backgroundColor: agent.color + '20' }]}>
                  <Text style={[styles.agentInitial, { color: agent.color }]}>
                    {agent.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.agentInfo}>
                  <Text style={[styles.agentName, { color: theme.colors.text.primary }]}>
                    {agent.name}
                  </Text>
                  <Text style={[styles.agentModel, { color: theme.colors.text.secondary }]}>
                    {agent.model}
                  </Text>
                </View>
                {selectedAgentId === agent.id && (
                  <Check size={20} color={theme.colors.primary} />
                )}
              </Pressable>
            ))}

            <Pressable
              style={[styles.agentItem, { backgroundColor: theme.colors.card }]}
              onPress={() => {
                onSelect(null);
                onClose();
              }}
            >
              <View style={[styles.agentIcon, { backgroundColor: theme.colors.surface }]}>
                <X size={20} color={theme.colors.text.secondary} />
              </View>
              <View style={styles.agentInfo}>
                <Text style={[styles.agentName, { color: theme.colors.text.primary }]}>
                  No Default Agent
                </Text>
                <Text style={[styles.agentModel, { color: theme.colors.text.secondary }]}>
                  Select agent manually for each chat
                </Text>
              </View>
              {selectedAgentId === null && (
                <Check size={20} color={theme.colors.primary} />
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  agentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  agentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agentInitial: {
    fontSize: 18,
    fontWeight: '600',
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  agentModel: {
    fontSize: 14,
  },
});