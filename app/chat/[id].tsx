import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, Keyboard, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useChatContext } from '@/context/ChatContext';
import { useAgentContext } from '@/context/AgentContext';
import { useDebugContext } from '@/context/DebugContext';
import { useTheme } from '@/context/ThemeContext';
import MessageBubble from '@/components/MessageBubble';
import DebugLogs from '@/components/DebugLogs';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getConversationById, addMessageToConversation, isTyping, debugLogs } = useChatContext();
  const { getAgentById } = useAgentContext();
  const { isDebugMode } = useDebugContext();
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const inputRef = useRef<TextInput>(null);
  
  const conversation = getConversationById(id as string);
  const agent = conversation ? getAgentById(conversation.agentId) : null;

  useEffect(() => {
    if (!conversation) {
      router.replace('/');
    }
  }, [conversation, router]);

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(focusTimeout);
  }, []);

  useEffect(() => {
    if (flatListRef.current && conversation?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation?.messages, isTyping]);

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

  if (!conversation || !agent) return null;

  const currentLogs = debugLogs[id as string] || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: agent.name,
          headerTitleStyle: [styles.headerTitle, { color: theme.colors.text.primary }],
          headerLeft: () => (
            <Pressable onPress={() => router.replace('/')} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text.primary} />
            </Pressable>
          ),
          headerStyle: {
            backgroundColor: theme.colors.background,
            height: 44 + insets.top,
            borderBottomWidth: 0,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerSafeAreaInsets: { top: insets.top },
          headerTopInsetEnabled: true,
        }}
      />
      
      <FlatList
        ref={flatListRef}
        data={conversation.messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            agentColor={agent.color}
            agentName={agent.name}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              Start a conversation with {agent.name}
            </Text>
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
      
      <View style={[
        styles.inputContainer, 
        { 
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border
        }
      ]}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.text.primary,
            }
          ]}
          placeholder="Type your message..."
          placeholderTextColor={theme.colors.text.secondary}
          value={inputText}
          onChangeText={setInputText}
          onKeyPress={handleKeyPress}
          multiline
          maxLength={500}
        />
        <Pressable
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
            { backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.surface }
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Send size={20} color={inputText.trim() ? '#FFFFFF' : theme.colors.text.secondary} />
        </Pressable>
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
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
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
    paddingBottom: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    alignSelf: 'flex-end',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});