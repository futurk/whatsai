import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { AgentProvider } from '@/context/AgentContext';
import { ChatProvider } from '@/context/ChatContext';
import { ApiKeyProvider } from '@/context/ApiKeyContext';
import { DebugProvider } from '@/context/DebugContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <LanguageProvider>
            <DebugProvider>
              <ApiKeyProvider>
                <AgentProvider>
                  <ChatProvider>
                    <AuthProvider>
                      <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="welcome" options={{ headerShown: false }} />
                        <Stack.Screen name="auth" options={{ headerShown: false }} />
                        <Stack.Screen 
                          name="(tabs)" 
                          options={{ 
                            headerShown: false,
                            gestureEnabled: false 
                          }} 
                        />
                        <Stack.Screen name="agents" options={{ presentation: 'card' }} />
                        <Stack.Screen name="api-keys" options={{ presentation: 'card' }} />
                        <Stack.Screen name="manage-agents" options={{ presentation: 'card' }} />
                        <Stack.Screen name="chat/[id]" options={{ presentation: 'card' }} />
                        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
                      </Stack>
                      <StatusBar style="auto" />
                    </AuthProvider>
                  </ChatProvider>
                </AgentProvider>
              </ApiKeyProvider>
            </DebugProvider>
          </LanguageProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}