import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, FlatList, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useChatContext } from '@/context/ChatContext';
import { useAgentContext } from '@/context/AgentContext';
import { useDebugContext } from '@/context/DebugContext';
import MessageBubble from '@/components/MessageBubble';
import SuggestionChip from '@/components/SuggestionChip';
import DebugLogs from '@/components/DebugLogs';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getConversationById, addMessageToConversation, isTyping, debugLogs } = useChatContext();
  const { getAgentById } = useAgentContext();
  const { isDebugMode } = useDebugContext();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  
  const conversation = getConversationById(id as string);
  const agent = conversation ? getAgentById(conversation.agentId) : null;

  useEffect(() => {
    if (!conversation) {
      router.replace('/(tabs)');
    }
  }, [conversation, router]);

  // Auto-scroll when messages change or when typing indicator appears/disappears
  useEffect(() => {
    if (flatListRef.current && conversation?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation?.messages, isTyping]);

  const handleBack = () => {
    router.push('/(tabs)');
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText.trim();
    setInputText('');
    
    await addMessageToConversation(id as string, {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    });
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };
  
  const suggestions = [
    "Tell me about yourself",
    "What can you help me with?",
    "Tell me a joke",
    "What's your specialty?"
  ];

  if (!conversation || !agent) return null;

  const currentLogs = debugLogs[id as string] || [];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: agent.name,
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
      
      <FlatList
        ref={flatListRef}
        data={conversation.messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.messagesContainer,
          { paddingBottom: 16 + insets.bottom }
        ]}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            agentColor={agent.color}
            agentName={agent.name}
          />
        )}
        onContentSizeChange={() => {
          if (conversation.messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {suggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                text={suggestion}
                onPress={() => handleSuggestion(suggestion)}
              />
            ))}
          </View>
        }
        ListFooterComponent={
          isDebugMode && currentLogs.length > 0 ? (
            <DebugLogs logs={currentLogs} />
          ) : null
        }
      />
      
      {isTyping && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.typingContainer}
        >
          <View style={[styles.typingBubble, { backgroundColor: agent.color + '20' }]}>
            <View style={styles.typingIndicator}>
              <View style={[styles.typingDot, styles.typingDot1]} />
              <View style={[styles.typingDot, styles.typingDot2]} />
              <View style={[styles.typingDot, styles.typingDot3]} />
            </View>
          </View>
        </Animated.View>
      )}
      
      <View style={[styles.inputContainer, { paddingBottom: Math.max(16, insets.bottom) }]}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          value={inputText}
          onChangeText={setInputText}
          onKeyPress={handleKeyPress}
          multiline
          maxLength={500}
          autoFocus={false}
        />
        <Pressable
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Send size={20} color={inputText.trim() ? '#FFFFFF' : '#94A3B8'} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typingBubble: {
    maxWidth: '70%',
    borderRadius: 20,
    padding: 12,
    alignSelf: 'flex-start',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 40,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B7280',
    marginHorizontal: 2,
    opacity: 0.6,
  },
  typingDot1: {
    animationKeyframes: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0s',
    animationIterationCount: 'infinite',
  },
  typingDot2: {
    animationKeyframes: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0.2s',
    animationIterationCount: 'infinite',
  },
  typingDot3: {
    animationKeyframes: 'bounce',
    animationDuration: '0.6s',
    animationDelay: '0.4s',
    animationIterationCount: 'infinite',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 120,
    fontSize: 16,
    color: '#1F2937',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    alignSelf: 'flex-end',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});