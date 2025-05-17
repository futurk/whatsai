import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { memo } from 'react';
import { Message } from '@/types/chat';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react-native';

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
  const isUser = message.sender === 'user';
  
  const getStatusIndicator = () => {
    if (!isUser || !message.status) return null;

    switch (message.status) {
      case 'pending':
        return <Clock size={14} color="#FFFFFF" style={styles.statusIcon} />;
      case 'completed':
        return <CheckCircle size={14} color="#FFFFFF" style={styles.statusIcon} />;
      case 'failed':
        return <AlertCircle size={14} color="#FFFFFF" style={styles.statusIcon} />;
      default:
        return null;
    }
  };

  const getBubbleStyle = () => {
    if (!isUser || !message.status) return {};

    switch (message.status) {
      case 'pending':
        return { backgroundColor: '#6B7280', opacity: 0.8 };
      case 'failed':
        return { backgroundColor: '#EF4444' };
      default:
        return {};
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
            ? [styles.userBubble, getBubbleStyle()]
            : [styles.assistantBubble, { backgroundColor: agentColor + '20' }],
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userMessageText : [styles.assistantMessageText, { color: '#1F2937' }],
          ]}
        >
          {message.text}
        </Text>
        {getStatusIndicator()}
      </View>
      <Text style={styles.timestampText}>{formatTime(message.timestamp)}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#1F2937',
  },
  timestampText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    marginHorizontal: 4,
  },
  statusIcon: {
    marginLeft: 8,
  },
});

export default memo(MessageBubble);