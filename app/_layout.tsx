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
                  <Stack 
                    screenOptions={{
                      headerShown: true,
                      contentStyle: { backgroundColor: 'transparent' },
                      animation: 'slide_from_right',
                      headerStyle: {
                        borderBottomWidth: 0,
                        shadowOpacity: 0,
                        elevation: 0,
                      },
                      headerTopInsetEnabled: true,
                    }}
                  >
                    <Stack.Screen 
                      name="(tabs)" 
                      options={{ headerShown: false }} 
                    />
                    <Stack.Screen name="chat/[id]" />
                    <Stack.Screen name="agents" />
                    <Stack.Screen name="manage-agents" />
                    <Stack.Screen name="api-keys" />
                    <Stack.Screen 
                      name="+not-found" 
                      options={{ 
                        title: 'Oops!',
                        presentation: 'modal',
                        animation: 'fade',
                      }} 
                    />
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