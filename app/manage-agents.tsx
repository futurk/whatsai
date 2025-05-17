import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit2, Trash2, Key } from 'lucide-react-native';
import { useAgentContext } from '@/context/AgentContext';
import { useApiKeyContext } from '@/context/ApiKeyContext';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ConfirmationDialog from '@/components/ConfirmationDialog';

export default function ManageAgentsScreen() {
  const router = useRouter();
  const { agents, addAgent, updateAgent, deleteAgent } = useAgentContext();
  const { apiKeys, getModelsByVendor } = useApiKeyContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedApiKeyId, setSelectedApiKeyId] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [tags, setTags] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    visible: boolean;
    id: string;
    name: string;
  }>({
    visible: false,
    id: '',
    name: '',
  });
  const [unsavedChangesDialog, setUnsavedChangesDialog] = useState(false);

  const hasUnsavedChanges = () => {
    if (!isEditing) return false;

    if (editingAgent) {
      return (
        name !== editingAgent.name ||
        instructions !== (editingAgent.instructions || '') ||
        selectedModel !== editingAgent.model ||
        selectedApiKeyId !== editingAgent.apiKeyId ||
        color !== editingAgent.color ||
        tags !== editingAgent.tags.join(', ')
      );
    }

    return name || instructions || selectedModel || selectedApiKeyId || tags || color !== '#3B82F6';
  };

  const resetForm = () => {
    setName('');
    setInstructions('');
    setSelectedModel('');
    setSelectedApiKeyId('');
    setColor('#3B82F6');
    setTags('');
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setUnsavedChangesDialog(true);
    } else {
      if (isEditing) {
        setIsEditing(false);
        setEditingAgent(null);
        resetForm();
      } else {
        router.back();
      }
    }
  };

  const handleAddAgent = () => {
    setIsEditing(true);
    setEditingAgent(null);
    resetForm();
  };

  const handleEditAgent = (agent) => {
    setIsEditing(true);
    setEditingAgent(agent);
    setName(agent.name);
    setInstructions(agent.instructions || '');
    setSelectedModel(agent.model);
    setSelectedApiKeyId(agent.apiKeyId);
    setColor(agent.color);
    setTags(agent.tags.join(', '));
  };

  const handleSave = () => {
    if (!name || !selectedModel || !selectedApiKeyId) {
      return;
    }

    const selectedKey = apiKeys.find(key => key.id === selectedApiKeyId);
    if (!selectedKey) {
      return;
    }

    const agentData = {
      name,
      instructions,
      model: selectedModel,
      apiKeyId: selectedKey.id,
      color,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    if (editingAgent) {
      updateAgent(editingAgent.id, agentData);
    } else {
      addAgent(agentData);
    }

    setIsEditing(false);
    setEditingAgent(null);
    resetForm();
  };

  const handleDelete = (agentId: string, agentName: string) => {
    setDeleteConfirmation({
      visible: true,
      id: agentId,
      name: agentName,
    });
  };

  const confirmDelete = () => {
    deleteAgent(deleteConfirmation.id);
    setDeleteConfirmation({
      visible: false,
      id: '',
      name: '',
    });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      visible: false,
      id: '',
      name: '',
    });
  };

  const confirmDiscardChanges = () => {
    setUnsavedChangesDialog(false);
    if (isEditing) {
      setIsEditing(false);
      setEditingAgent(null);
      resetForm();
    } else {
      router.back();
    }
  };

  const cancelDiscardChanges = () => {
    setUnsavedChangesDialog(false);
  };

  const renderItem = ({ item, index }) => {
    const apiKey = apiKeys.find(key => key.id === item.apiKeyId);
    const vendor = apiKey?.vendor || 'Unknown';
    
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 100).springify()}
        style={styles.agentItem}
      >
        <View style={[styles.agentIcon, { backgroundColor: item.color + '20' }]}>
          <Text style={[styles.agentInitial, { color: item.color }]}>
            {item.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.agentContent}>
          <Text style={styles.agentName}>{item.name}</Text>
          <Text style={styles.agentVendor}>{vendor}</Text>
          <Text style={styles.agentModel}>
            {getModelsByVendor(vendor).find(m => m.id === item.model)?.name || item.model}
          </Text>
          {item.instructions && (
            <Text style={styles.agentInstructions} numberOfLines={2}>
              {item.instructions}
            </Text>
          )}
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, idx) => (
              <View key={idx} style={[styles.tag, { backgroundColor: item.color + '15' }]}>
                <Text style={[styles.tagText, { color: item.color }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.actionButton}
            onPress={() => handleEditAgent(item)}
          >
            <Edit2 size={20} color="#6B7280" />
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Trash2 size={20} color="#F43F5E" />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: isEditing ? (editingAgent ? 'Edit Agent' : 'New Agent') : 'Manage Agents',
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#1F2937" />
            </Pressable>
          ),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
      <View style={styles.container}>
        {!isEditing ? (
          <>
            <FlatList
              data={agents}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
            />
            <Pressable style={styles.fab} onPress={handleAddAgent}>
              <Plus size={24} color="#FFFFFF" />
            </Pressable>
          </>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View
                entering={FadeInUp.springify()}
                style={styles.formContainer}
              >
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Text>Name </Text>
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter agent name"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Instructions</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={instructions}
                    onChangeText={setInstructions}
                    placeholder="Enter agent instructions (optional)"
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Text>API Key </Text>
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.apiKeyList}>
                    {apiKeys.map((key) => (
                      <Pressable
                        key={key.id}
                        style={[
                          styles.apiKeyChip,
                          selectedApiKeyId === key.id && styles.apiKeyChipSelected,
                        ]}
                        onPress={() => {
                          setSelectedApiKeyId(key.id);
                          setSelectedModel(''); // Reset model when API key changes
                        }}
                      >
                        <Key size={16} color={selectedApiKeyId === key.id ? '#1D4ED8' : '#4B5563'} />
                        <Text
                          style={[
                            styles.apiKeyChipText,
                            selectedApiKeyId === key.id && styles.apiKeyChipTextSelected,
                          ]}
                        >
                          {key.vendor} - {key.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {selectedApiKeyId && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>
                      <Text>Model </Text>
                      <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={styles.modelList}>
                      {getModelsByVendor(apiKeys.find(key => key.id === selectedApiKeyId)?.vendor || '').map((model) => (
                        <Pressable
                          key={model.id}
                          style={[
                            styles.modelCard,
                            selectedModel === model.id && styles.modelCardSelected,
                          ]}
                          onPress={() => setSelectedModel(model.id)}
                        >
                          <Text style={[
                            styles.modelName,
                            selectedModel === model.id && styles.modelNameSelected
                          ]}>
                            {model.name}
                          </Text>
                          <Text style={[
                            styles.modelDescription,
                            selectedModel === model.id && styles.modelDescriptionSelected
                          ]}>
                            {model.description}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Color</Text>
                  <TextInput
                    style={styles.input}
                    value={color}
                    onChangeText={setColor}
                    placeholder="#3B82F6"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tags (comma-separated)</Text>
                  <TextInput
                    style={styles.input}
                    value={tags}
                    onChangeText={setTags}
                    placeholder="General, Helpful, Assistant"
                  />
                </View>
                <View style={styles.buttonGroup}>
                  <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleBack}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      styles.saveButton,
                      (!name || !selectedModel || !selectedApiKeyId) && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={!name || !selectedModel || !selectedApiKeyId}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}

        <ConfirmationDialog
          visible={deleteConfirmation.visible}
          title="Delete Agent"
          message={`Are you sure you want to delete the agent "${deleteConfirmation.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          destructive
        />

        <ConfirmationDialog
          visible={unsavedChangesDialog}
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to discard them?"
          confirmText="Discard"
          onConfirm={confirmDiscardChanges}
          onCancel={cancelDiscardChanges}
          destructive
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  agentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  agentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  agentInitial: {
    fontSize: 20,
    fontWeight: '600',
  },
  agentContent: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
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
    marginBottom: 4,
  },
  agentInstructions: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
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
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  apiKeyList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  apiKeyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    margin: 4,
  },
  apiKeyChipSelected: {
    backgroundColor: '#BFDBFE',
  },
  apiKeyChipText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  apiKeyChipTextSelected: {
    color: '#1D4ED8',
    fontWeight: '500',
  },
  modelList: {
    marginTop: 8,
  },
  modelCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  modelCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  modelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  modelNameSelected: {
    color: '#1D4ED8',
  },
  modelDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  modelDescriptionSelected: {
    color: '#3B82F6',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});