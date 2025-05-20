import React from 'react';
import { StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from '@/context/ThemeContext';

interface MarkdownRendererProps {
  children: string;
}

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    body: {
      color: theme.colors.text.primary,
      fontSize: 16,
      lineHeight: 24,
    },
    heading1: {
      color: theme.colors.text.primary,
      fontSize: 28,
      fontWeight: 'bold',
      marginVertical: 16,
    },
    heading2: {
      color: theme.colors.text.primary,
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 14,
    },
    heading3: {
      color: theme.colors.text.primary,
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 12,
    },
    heading4: {
      color: theme.colors.text.primary,
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    heading5: {
      color: theme.colors.text.primary,
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 8,
    },
    heading6: {
      color: theme.colors.text.primary,
      fontSize: 14,
      fontWeight: 'bold',
      marginVertical: 6,
    },
    link: {
      color: theme.colors.primary,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      paddingLeft: 16,
      marginVertical: 8,
      opacity: 0.8,
    },
    code_inline: {
      fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    code_block: {
      fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 8,
      marginVertical: 8,
    },
    list_item: {
      marginVertical: 4,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    bullet_list: {
      marginVertical: 8,
    },
    ordered_list: {
      marginVertical: 8,
    },
    hr: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
      marginVertical: 16,
    },
    image: {
      width: width - 32,
      height: (width - 32) * 0.5625, // 16:9 aspect ratio
      borderRadius: 8,
      marginVertical: 8,
    },
    table: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      marginVertical: 8,
    },
    thead: {
      backgroundColor: theme.colors.surface,
    },
    th: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    td: {
      padding: 12,
    },
  });

  return (
    <Markdown
      style={styles}
      mergeStyle={true}
      debugPrint={false}
    >
      {children}
    </Markdown>
  );
}