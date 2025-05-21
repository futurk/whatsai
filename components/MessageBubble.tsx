import { View, Text, StyleSheet, Image, Platform, Modal, Pressable } from 'react-native';
import Animated, { 
  FadeInRight, 
  FadeInLeft, 
  FadeIn, 
  FadeOut,
  withSpring,
  withSequence,
  withTiming,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { memo, useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { useTheme } from '@/context/ThemeContext';
import { TriangleAlert as AlertTriangle, Clock, CircleCheck as CheckCircle2, X, Copy, Check } from 'lucide-react-native';
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
  const [showFullImage, setShowFullImage] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [copied, setCopied] = useState(false);
  const bubbleRef = useRef<View>(null);
  const scale = useSharedValue(1);
  
  useEffect(() => {
    if (Platform.OS === 'web' && showCopyButton) {
      const handleClickOutside = (event: MouseEvent) => {
        if (bubbleRef.current && !(bubbleRef.current as any).contains(event.target)) {
          setShowCopyButton(false);
          setCopied(false);
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showCopyButton]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
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

  const handleCopy = async () => {
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(message.text);
        setCopied(true);
        scale.value = withSequence(
          withSpring(1.1, { damping: 10 }),
          withSpring(1, { damping: 10 })
        );
        setTimeout(() => {
          setShowCopyButton(false);
          setCopied(false);
        }, 1500);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };
  
  return (
    <>
      <View ref={bubbleRef}>
        <Pressable onPress={() => !isImage && setShowCopyButton(true)}>
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
                <Pressable onPress={() => setShowFullImage(true)}>
                  <Image
                    source={{ uri: message.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </Pressable>
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

            {showCopyButton && !isImage && Platform.OS === 'web' && (
              <Animated.View
                entering={FadeIn.springify()}
                exiting={FadeOut.springify()}
                style={[
                  styles.copyButton,
                  { backgroundColor: theme.colors.card },
                  animatedStyle
                ]}
              >
                <Pressable
                  onPress={handleCopy}
                  style={({ pressed }) => [
                    styles.copyButtonInner,
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  {copied ? (
                    <Check size={16} color={theme.colors.success} />
                  ) : (
                    <Copy size={16} color={theme.colors.text.primary} />
                  )}
                  <Text 
                    style={[
                      styles.copyText, 
                      { 
                        color: copied ? theme.colors.success : theme.colors.text.primary 
                      }
                    ]}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Text>
                </Pressable>
              </Animated.View>
            )}
          </Animated.View>
        </Pressable>
      </View>

      <Modal
        visible={showFullImage}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFullImage(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowFullImage(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Pressable 
              style={[styles.closeButton, { backgroundColor: theme.colors.card }]}
              onPress={() => setShowFullImage(false)}
            >
              <X size={24} color={theme.colors.text.primary} />
            </Pressable>
            {message.imageUrl && (
              <Image
                source={{ uri: message.imageUrl }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '90%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  copyButton: {
    position: 'absolute',
    top: -36,
    right: 0,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  copyButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  copyText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default memo(MessageBubble);