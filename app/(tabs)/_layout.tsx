import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chrome as Home, Settings } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
          backgroundColor: theme.colors.tabBar,
          borderTopWidth: 0.5,
          borderTopColor: theme.colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          height: 44 + insets.top,
          borderBottomWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
        },
        headerTitleStyle: {
          color: theme.colors.text.primary,
          fontWeight: '600',
          fontSize: 17,
        },
        headerSafeAreaInsets: { top: insets.top },
        headerTopInsetEnabled: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Conversations',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}