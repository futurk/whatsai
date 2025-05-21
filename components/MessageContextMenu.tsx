import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Copy, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useRef } from 'react';

interface MessageContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onCopy: () => void;
  onRegenerate?: () => void;
  showRegenerate?: boolean;
}

export default function MessageContextMenu({
  visible,
  position,
  onClose,
  onCopy,
  onRegenerate,
  showRegenerate,
}: MessageContextMenuProps) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.9,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.menu,
            {
              backgroundColor: theme.colors.card,
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { scale: scaleAnim },
              ],
              opacity: fadeAnim,
              shadowColor: theme.colors.text.primary,
            },
          ]}
        >
          <Pressable
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={() => {
              onCopy();
              onClose();
            }}
          >
            <Copy size={18} color={theme.colors.text.primary} />
            <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>
              Copy
            </Text>
          </Pressable>

          {showRegenerate && onRegenerate && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onRegenerate();
                onClose();
              }}
            >
              <RefreshCw size={18} color={theme.colors.primary} />
              <Text style={[styles.menuText, { color: theme.colors.primary }]}>
                Regenerate
              </Text>
            </Pressable>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 140,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
});