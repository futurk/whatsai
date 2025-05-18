import { View, Text, StyleSheet, Switch, Pressable, ScrollView, ActionSheetIOS, Platform } from 'react-native';
import { useState } from 'react';
import { Moon, Sun, Bell, Volume2, Shield, CircleHelp as HelpCircle, Info, LogOut, Trash2, ChevronRight, Users, Key, Bug, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAgentContext } from '@/context/AgentContext';
import { useApiKeyContext } from '@/context/ApiKeyContext';
import { useDebugContext } from '@/context/DebugContext';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { agents, defaultAgentId, setDefaultAgent, getAgentById } = useAgentContext();
  const { apiKeys } = useApiKeyContext();
  const { isDebugMode, toggleDebugMode } = useDebugContext();
  const { isDark, toggleTheme, theme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);

  const handleDefaultAgentPress = () => {
    if (Platform.OS === 'ios') {
      const options = [
        ...agents.map(agent => ({
          label: agent.name,
          onPress: () => setDefaultAgent(agent.id)
        })),
        {
          label: 'None',
          onPress: () => setDefaultAgent(null)
        }
      ];

      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...options.map(o => o.label), 'Cancel'],
          cancelButtonIndex: options.length,
          title: 'Select Default Agent',
          message: 'Choose an agent to start new chats with'
        },
        (buttonIndex) => {
          if (buttonIndex < options.length) {
            options[buttonIndex].onPress();
          }
        }
      );
    } else {
      // For other platforms, you might want to implement a modal or dropdown
      const nextAgent = agents.find(agent => agent.id !== defaultAgentId) || null;
      setDefaultAgent(nextAgent?.id || null);
    }
  };

  const renderSettingItem = ({ 
    icon, 
    title, 
    description = '', 
    hasSwitch = false, 
    switchValue = false, 
    onSwitchChange = () => {}, 
    onPress = null,
    destructive = false,
    badge = null
  }) => (
    <Pressable 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: destructive ? theme.colors.error + '20' : theme.colors.surface },
        destructive && styles.destructiveIcon
      ]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle, 
          { color: destructive ? theme.colors.error : theme.colors.text.primary }
        ]}>{title}</Text>
        {description ? (
          <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
            {description}
          </Text>
        ) : null}
      </View>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: theme.colors.primary + '20' }]}>
          <Text style={[styles.badgeText, { color: theme.colors.primary }]}>{badge}</Text>
        </View>
      ) : hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
          thumbColor={switchValue ? theme.colors.primary : theme.colors.secondary}
        />
      ) : onPress ? (
        <ChevronRight size={20} color={theme.colors.text.secondary} />
      ) : null}
    </Pressable>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>AI Agents</Text>
        {renderSettingItem({
          icon: <Users size={22} color={theme.colors.primary} />,
          title: 'Manage Agents',
          description: 'Create, edit, and delete AI agents',
          badge: agents.length.toString(),
          onPress: () => router.push('/manage-agents')
        })}
        {renderSettingItem({
          icon: <Key size={22} color={theme.colors.primary} />,
          title: 'My API Keys',
          description: 'Manage your API keys for different vendors',
          badge: apiKeys.length.toString(),
          onPress: () => router.push('/api-keys')
        })}
        {renderSettingItem({
          icon: <MessageSquare size={22} color={theme.colors.primary} />,
          title: 'Default Agent',
          description: defaultAgentId 
            ? `New chats will start with ${getAgentById(defaultAgentId)?.name}`
            : 'Select an agent to start new chats immediately',
          onPress: handleDefaultAgentPress
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Appearance</Text>
        {renderSettingItem({
          icon: isDark ? <Moon size={22} color="#8B5CF6" /> : <Sun size={22} color="#F59E0B" />,
          title: 'Dark Mode',
          description: 'Switch between light and dark themes',
          hasSwitch: true,
          switchValue: isDark,
          onSwitchChange: toggleTheme
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Notifications</Text>
        {renderSettingItem({
          icon: <Bell size={22} color={theme.colors.primary} />,
          title: 'Push Notifications',
          description: 'Get notified about new messages',
          hasSwitch: true,
          switchValue: notifications,
          onSwitchChange: setNotifications
        })}
        {renderSettingItem({
          icon: <Volume2 size={22} color={theme.colors.primary} />,
          title: 'Sounds',
          description: 'Play sounds for new messages',
          hasSwitch: true,
          switchValue: sounds,
          onSwitchChange: setSounds
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Developer</Text>
        {renderSettingItem({
          icon: <Bug size={22} color={theme.colors.primary} />,
          title: 'Debug Mode',
          description: 'Enable developer debugging features',
          hasSwitch: true,
          switchValue: isDebugMode,
          onSwitchChange: toggleDebugMode
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>About</Text>
        {renderSettingItem({
          icon: <Shield size={22} color={theme.colors.primary} />,
          title: 'Privacy Policy',
          onPress: () => {}
        })}
        {renderSettingItem({
          icon: <HelpCircle size={22} color={theme.colors.primary} />,
          title: 'Help & Support',
          onPress: () => {}
        })}
        {renderSettingItem({
          icon: <Info size={22} color={theme.colors.primary} />,
          title: 'App Version',
          description: '1.0.0'
        })}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Account</Text>
        {renderSettingItem({
          icon: <LogOut size={22} color={theme.colors.error} />,
          title: 'Sign Out',
          destructive: true,
          onPress: () => {}
        })}
        {renderSettingItem({
          icon: <Trash2 size={22} color={theme.colors.error} />,
          title: 'Clear All Conversations',
          description: 'This cannot be undone',
          destructive: true,
          onPress: () => {}
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});