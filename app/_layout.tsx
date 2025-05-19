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
                  <Stack screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' },
                  }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen 
                      name="chat/[id]" 
                      options={{ 
                        presentation: 'card',
                        animation: 'slide_from_right',
                      }} 
                    />
                    <Stack.Screen 
                      name="agents" 
                      options={{ 
                        presentation: 'card',
                        animation: 'slide_from_right',
                      }} 
                    />
                    <Stack.Screen 
                      name="manage-agents" 
                      options={{ 
                        presentation: 'card',
                        animation: 'slide_from_right',
                      }} 
                    />
                    <Stack.Screen 
                      name="api-keys" 
                      options={{ 
                        presentation: 'card',
                        animation: 'slide_from_right',
                      }} 
                    />
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