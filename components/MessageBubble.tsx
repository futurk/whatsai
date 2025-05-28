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
import { TriangleAlert as AlertTriangle, Clock, CircleCheck as CheckCircle2, X, Copy, Check, RefreshCw } from 'lucide-react-native';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useChatContext } from '@/context/ChatContext';

// Global state to track active message ID
let activeMessageId: string | null = null;
let setShowCopyButtonCallback: ((show: boolean) => void) | null = null;

interface MessageBubbleProps {
  message: Message;
  agentColor: string;
  agentName: string;
  conversationId: string;
  isLastUserMessage?: boolean;
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const MessageBubble = ({ message, agentColor, agentName, conversationId, isLastUserMessage }: MessageBubbleProps) => {
  const { theme } = useTheme();
  const { addMessageToConversation } = useChatContext();
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';
  const isImage = message.type === 'image';
  const [showFullImage, setShowFullImage] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);
  const [copied, setCopied] = useState(false);
  const bubbleRef = useRef<View>(null);
  const scale = useSharedValue(1);
  const bubbleScale = useSharedValue(1);
  const copyButtonOpacity = useSharedValue(0);

  useEffect(() => {
    if (showCopyButton) {
      setShowCopyButtonCallback = setShowCopyButton;
      copyButtonOpacity.value = withSpring(1, { damping: 15 });
    } else {
      copyButtonOpacity.value = withTiming(0, { duration: 1000 });
    }

    return () => {
      if (setShowCopyButtonCallback === setShowCopyButton) {
        setShowCopyButtonCallback = null;
      }
    };
  }, [showCopyButton]);
  
  useEffect(() => {
    if (Platform.OS === 'web' && showCopyButton) {
      const handleClickOutside = (event: MouseEvent) => {
        if (bubbleRef.current && !(bubbleRef.current as any).contains(event.target)) {
          setShowCopyButton(false);
          setCopied(false);
          activeMessageId = null;
        }
      };

      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showCopyButton]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: copyButtonOpacity.value,
    };
  });

  const bubbleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bubbleScale.value }],
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
          withSpring(1.1, { damping: 12, stiffness: 200 }),
          withSpring(1, { damping: 12, stiffness: 200 })
        );
        setTimeout(() => {
          setShowCopyButton(false);
          setCopied(false);
          activeMessageId = null;
        }, 1500);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  const handlePress = () => {
    if (!isImage) {
      if (activeMessageId && activeMessageId !== message.id && setShowCopyButtonCallback) {
        setShowCopyButtonCallback(false);
      }
      
      activeMessageId = message.id;
      setShowCopyButton(true);
      
      bubbleScale.value = withSequence(
        withSpring(0.98, { damping: 15, stiffness: 300 }),
        withSpring(1, { damping: 15, stiffness: 300 })
      );
    }
  };

  const handleRetry = async () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.text,
      sender: 'user',
      type: message.type,
      imageUrl: message.imageUrl,
      timestamp: new Date().toISOString()
    };

    await addMessageToConversation(conversationId, newMessage);
  };

  const getBubbleStyle = () => {
    const baseStyle = [
      styles.bubble,
      isUser
        ? [styles.userBubble, { 
            backgroundColor: message.status === 'failed' 
              ? theme.colors.error + '20' 
              : theme.colors.primary,
            opacity: message.status === 'pending' ? 0.6 : 1
          }]
        : isSystem
          ? [styles.systemBubble, { backgroundColor: theme.colors.error + '20' }]
          : [styles.assistantBubble, { backgroundColor: agentColor + '20' }],
      isImage && styles.imageBubble,
    ];

    return baseStyle;
  };
  
  return (
    <>
      <Animated.View
        entering={isUser ? FadeInRight.springify() : FadeInLeft.springify()}
        style={[
          styles.container,
          isUser ? styles.userContainer : styles.assistantContainer,
        ]}
      >
        <View ref={bubbleRef} style={styles.bubbleWrapper}>
          {showCopyButton && !isImage && Platform.OS === 'web' && (
            <Animated.View
              entering={FadeIn.springify()}
              exiting={FadeOut.springify()}
              style={[
                styles.copyButton,
                { backgroundColor: theme.colors.card },
                isUser ? styles.copyButtonLeft : styles.copyButtonRight,
                animatedStyle
              ]}
            >
              <Pressable
                onPress={handleCopy}
                style={({ pressed }) => [
                  styles.copyButtonInner,
                  pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }
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

          <Animated.View style={bubbleAnimatedStyle}>
            <Pressable 
              onPress={handlePress}
              style={getBubbleStyle()}
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
            </Pressable>
          </Animated.View>

          <View style={styles.footer}>
            {isLastUserMessage && message.status === 'failed' ? (
              <Pressable 
                style={({ pressed }) => [
                  styles.retryButton,
                  { backgroundColor: theme.colors.error + '20' },
                  pressed && { opacity: 0.7 }
                ]}
                onPress={handleRetry}
              >
                <RefreshCw size={14} color={theme.colors.error} />
                <Text style={[styles.retryText, { color: theme.colors.error }]}>
                  Retry
                </Text>
              </Pressable>
            ) : (
              getStatusIcon()
            )}
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
        </View>
      </Animated.View>

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
  bubbleWrapper: {
    position: 'relative',
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
    top: '50%',
    transform: [{ translateY: -20 }],
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  copyButtonLeft: {
    right: '100%',
    marginRight: 8,
  },
  copyButtonRight: {
    left: '100%',
    marginLeft: 8,
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
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default memo(MessageBubble);