import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AgentProvider } from '@/context/AgentContext';
import { ChatProvider } from '@/context/ChatContext';
import { ApiKeyProvider } from '@/context/ApiKeyContext';
import { DebugProvider } from '@/context/DebugContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Buffer } from 'buffer';

// Polyfill Buffer for React Native Web
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <DebugProvider>
            <ApiKeyProvider>
              <AgentProvider>
                <ChatProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="chat/[id]" options={{ presentation: 'card' }} />
                    <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
                  </Stack>
                  <StatusBar style="auto" />
                </ChatProvider>
              </AgentProvider>
            </ApiKeyProvider>
          </DebugProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}