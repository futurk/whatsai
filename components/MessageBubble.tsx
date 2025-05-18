import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { memo } from 'react';
import { Message } from '@/types/chat';
import { useTheme } from '@/context/ThemeContext';

interface MessageBubbleProps {
  message: Message;
  agentColor: string;
  agentName: string;
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const MessageBubble = ({ message, agentColor, agentName }: MessageBubbleProps) => {
  const { theme } = useTheme();
  const isUser = message.sender === 'user';
  
  return (
    <Animated.View
      entering={isUser ? FadeInRight.springify() : FadeInLeft.springify()}
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: theme.colors.primary }]
            : [styles.assistantBubble, { backgroundColor: agentColor + '20' }],
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser 
              ? [styles.userMessageText, { color: '#FFFFFF' }]
              : [styles.assistantMessageText, { color: theme.colors.text.primary }],
          ]}
        >
          {message.text}
        </Text>
      </View>
      <Text style={[styles.timestampText, { color: theme.colors.text.secondary }]}>
        {formatTime(message.timestamp)}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#1F2937',
  },
  timestampText: {
    fontSize: 12,
    marginTop: 4,
    marginHorizontal: 4,
  },
});

export default memo(MessageBubble);