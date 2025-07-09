import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, FlatList, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, ArrowUp, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useChatContext } from '@/context/ChatContext';
import { useAgentContext } from '@/context/AgentContext';
import { useDebugContext } from '@/context/DebugContext';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';
import MessageBubble from '@/components/MessageBubble';
import SuggestionChip from '@/components/SuggestionChip';
import DebugLogs from '@/components/DebugLogs';
import { useHeaderHeight } from '@react-navigation/elements';
import { Message } from '@/types/chat';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const headerHeight = useHeaderHeight();

  // Context hooks
  const { getConversationById, addMessageToConversation, isTyping, debugLogs } = useChatContext();
  const { getAgentById } = useAgentContext();
  const { isDebugMode } = useDebugContext();

  const conversation = getConversationById(id);
  const agent = conversation ? getAgentById(conversation.agentId) : null;

  const suggestions = [
    t('chat.suggestions.aboutYou'),
    t('chat.suggestions.help'),
    t('chat.suggestions.joke'),
    t('chat.suggestions.specialty')
  ];

  // Redirect if conversation doesn't exist
  useEffect(() => {
    if (!conversation) {
      router.replace('/(tabs)');
    }
  }, [conversation]);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && conversation?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation?.messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim() || !conversation) return;

    const message: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      type: 'text',
      timestamp: new Date().toISOString()
    };

    setInputText('');
    await addMessageToConversation(id, message);
  };

  const handleImagePick = async () => {
    if (!conversation) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const message: Message = {
        id: Date.now().toString(),
        text: t('chat.sendImage'),
        sender: 'user',
        type: 'image',
        imageUrl: result.assets[0].uri,
        timestamp: new Date().toISOString()
      };
      await addMessageToConversation(id, message);
    }
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    inputRef.current?.focus();
  };

  if (!conversation || !agent) return null;

  const currentLogs = debugLogs[id] || [];
  const lastUserMessageIndex = conversation.messages.findLastIndex(
    msg => msg.sender === 'user'
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: agent.name,
          headerTitleStyle: [styles.headerTitle, { color: theme.colors.text.primary }],
          headerLeft: () => (
            <Pressable onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text.primary} />
            </Pressable>
          ),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
        }}
      />

      <FlatList
        ref={flatListRef}
        data={conversation.messages}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.messagesContainer,
          { paddingBottom: 16 + insets.bottom }
        ]}
        renderItem={({ item, index }) => (
          <MessageBubble
            message={item}
            agentColor={agent.color}
            agentName={agent.name}
            conversationId={conversation.id}
            isLastUserMessage={index === lastUserMessageIndex}
          />
        )}
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
          <View style={[styles.typingBubble, { backgroundColor: `${agent.color}20` }]}>
            <View style={styles.typingIndicator}>
              <View style={[styles.typingDot, styles.typingDot1]} />
              <View style={[styles.typingDot, styles.typingDot2]} />
              <View style={[styles.typingDot, styles.typingDot3]} />
            </View>
          </View>
        </Animated.View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <View style={[
          styles.inputContainer,
          {
            paddingBottom: Math.max(16, insets.bottom),
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
            paddingTop: 12,
            paddingHorizontal: 16,
          }
        ]}>
          <Pressable
            style={[styles.iconButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleImagePick}
          >
            <ImageIcon size={20} color={theme.colors.text.secondary} />
          </Pressable>

          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text.primary,
              }
            ]}
            placeholder={t('chat.typeMessage')}
            placeholderTextColor={theme.colors.text.secondary}
            value={inputText}
            onChangeText={setInputText}
            onKeyPress={handleKeyPress}
            multiline
            maxLength={500}
          />

          <Pressable
            style={[
              styles.iconButton,
              {
                backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.surface
              }
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <ArrowUp
              size={20}
              color={inputText.trim() ? '#FFFFFF' : theme.colors.text.secondary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
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
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16,
    maxHeight: 120,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});