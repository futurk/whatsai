import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { memo } from 'react';
import { Message } from '@/types/chat';
import { useTheme } from '@/context/ThemeContext';
import { TriangleAlert as AlertTriangle, Clock, CircleCheck as CheckCircle2 } from 'lucide-react-native';
import MarkdownRenderer from '@/components/MarkdownRenderer';

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
  const isSystem = message.sender === 'system';
  const isImage = message.type === 'image';
  
  const getStatusIcon = () => {
    if (!isUser || !message.status) return null;
    
    switch (message.status) {
      case 'pending':
        return <Clock size={16} color={theme.colors.text.secondary} />;
      case 'completed':
        return <CheckCircle2 size={16} color={theme.colors.success} />;
      case 'failed':
        return <AlertTriangle size={16} color={theme.colors.error} />;
    }
  };
  
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
            ? [styles.userBubble, { 
                backgroundColor: message.status === 'failed' 
                  ? theme.colors.error + '20' 
                  : theme.colors.primary 
              }]
            : isSystem
              ? [styles.systemBubble, { backgroundColor: theme.colors.error + '20' }]
              : [styles.assistantBubble, { backgroundColor: agentColor + '20' }],
          isImage && styles.imageBubble,
        ]}
      >
        {isImage && message.imageUrl ? (
          <Image
            source={{ uri: message.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : isUser ? (
          <Text
            style={[
              styles.messageText,
              styles.userMessageText,
              { color: message.status === 'failed' ? theme.colors.error : '#FFFFFF' }
            ]}
          >
            {message.text}
          </Text>
        ) : isSystem ? (
          <Text
            style={[
              styles.messageText,
              styles.systemMessageText,
              { color: theme.colors.error }
            ]}
          >
            {message.text}
          </Text>
        ) : (
          <MarkdownRenderer>
            {message.text}
          </MarkdownRenderer>
        )}
      </View>
      <View style={styles.footer}>
        {getStatusIcon()}
        <Text 
          style={[
            styles.timestampText, 
            { 
              color: theme.colors.text.secondary,
              marginLeft: getStatusIcon() ? 4 : 0 
            }
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
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
    overflow: 'hidden',
  },
  imageBubble: {
    padding: 0,
    borderRadius: 12,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  systemBubble: {
    borderRadius: 12,
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
  systemMessageText: {
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginHorizontal: 4,
  },
  timestampText: {
    fontSize: 12,
  },
  image: {
    width: Platform.OS === 'web' ? 300 : 200,
    height: Platform.OS === 'web' ? 300 : 200,
    backgroundColor: '#F3F4F6',
  },
});

export default memo(MessageBubble);