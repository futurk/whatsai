import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Key, Trash2 } from 'lucide-react-native';
import { useApiKeyContext } from '@/context/ApiKeyContext';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp } from 'react-native-reanimated';
import ConfirmationDialog from '@/components/ConfirmationDialog';

export default function ApiKeysScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { apiKeys, addApiKey, deleteApiKey, getSupportedVendors } = useApiKeyContext();
  const { theme } = useTheme();
  const [selectedVendor, setSelectedVendor] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [keyName, setKeyName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    visible: false,
    id: '',
    name: '',
  });

  const handleBack = () => {
    if (isAdding) {
      setIsAdding(false);
      setSelectedVendor('');
      setApiKey('');
      setKeyName('');
    } else {
      router.push('/(tabs)/settings');
    }
  };

  const handleSave = () => {
    if (selectedVendor && apiKey && keyName) {
      addApiKey(selectedVendor, apiKey, keyName);
      setIsAdding(false);
      setSelectedVendor('');
      setApiKey('');
      setKeyName('');
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfirmation({
      visible: true,
      id,
      name,
    });
  };

  const confirmDelete = () => {
    deleteApiKey(deleteConfirmation.id);
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

  const renderItem = ({ item, index }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100).springify()}
      style={[styles.keyItem, {
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
      }]}
    >
      <View style={[styles.keyIcon, { backgroundColor: theme.colors.primary + '20' }]}>
        <Key size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.keyContent}>
        <Text style={[styles.vendorName, { color: theme.colors.text.primary }]}>
          {item.vendor}
        </Text>
        <Text style={[styles.keyName, { color: theme.colors.text.secondary }]}>
          {item.name}
        </Text>
        <Text style={[styles.keyPreview, { color: theme.colors.text.secondary }]}>
          {item.key.substring(0, 3)}...{item.key.substring(item.key.length - 4)}
        </Text>
      </View>
      <Pressable
        style={[styles.deleteButton, { backgroundColor: theme.colors.error + '20' }]}
        onPress={() => handleDelete(item.id, item.name)}
      >
        <Trash2 size={20} color={theme.colors.error} />
      </Pressable>
    </Animated.View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'My API Keys',
          headerTitleStyle: [styles.headerTitle, { color: theme.colors.text.primary }],
          headerLeft: () => (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text.primary} />
            </Pressable>
          ),
          headerShadowVisible: false,
          headerStyle: { 
            backgroundColor: theme.colors.background,
            height: 64 + insets.top,
            paddingTop: insets.top,
          },
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {!isAdding ? (
          <>
            <FlatList
              data={apiKeys}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Key size={48} color={theme.colors.primary} />
                  <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
                    No API Keys
                  </Text>
                  <Text style={[styles.emptyMessage, { color: theme.colors.text.secondary }]}>
                    Add your API keys to use with different AI models
                  </Text>
                </View>
              }
            />
            <Pressable 
              style={[styles.fab, { backgroundColor: theme.colors.primary }]} 
              onPress={() => setIsAdding(true)}
            >
              <Plus size={24} color="#FFFFFF" />
            </Pressable>
          </>
        ) : (
          <Animated.View
            entering={FadeInUp.springify()}
            style={styles.formContainer}
          >
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
                <Text>Select Vendor </Text>
                <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.vendorList}>
                {getSupportedVendors().map((vendor) => (
                  <Pressable
                    key={vendor}
                    style={[
                      styles.vendorChip,
                      { backgroundColor: theme.colors.card },
                      selectedVendor === vendor && { backgroundColor: theme.colors.primary + '20' },
                    ]}
                    onPress={() => setSelectedVendor(vendor)}
                  >
                    <Text
                      style={[
                        styles.vendorChipText,
                        { color: theme.colors.text.secondary },
                        selectedVendor === vendor && { color: theme.colors.primary, fontWeight: '500' },
                      ]}
                    >
                      {vendor}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
                <Text>Key Name </Text>
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary
                }]}
                value={keyName}
                onChangeText={setKeyName}
                placeholder="Enter a name for this key"
                placeholderTextColor={theme.colors.text.secondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
                <Text>API Key </Text>
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary
                }]}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="Enter your API key"
                placeholderTextColor={theme.colors.text.secondary}
                secureTextEntry
              />
            </View>

            <View style={styles.buttonGroup}>
              <Pressable
                style={[styles.button, styles.cancelButton, { backgroundColor: theme.colors.card }]}
                onPress={() => setIsAdding(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.text.secondary }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.saveButton,
                  { backgroundColor: theme.colors.primary },
                  (!selectedVendor || !apiKey || !keyName) && { opacity: 0.5 },
                ]}
                onPress={handleSave}
                disabled={!selectedVendor || !apiKey || !keyName}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        <ConfirmationDialog
          visible={deleteConfirmation.visible}
          title="Delete API Key"
          message={`Are you sure you want to delete the API key "${deleteConfirmation.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
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
  keyItem: {
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
  keyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  keyContent: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  keyName: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  keyPreview: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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
  vendorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  vendorChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    margin: 4,
  },
  vendorChipSelected: {
    backgroundColor: '#BFDBFE',
  },
  vendorChipText: {
    fontSize: 14,
    color: '#4B5563',
  },
  vendorChipTextSelected: {
    color: '#1D4ED8',
    fontWeight: '500',
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