import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { Moon, Sun, Bell, Volume2, Shield, CircleHelp as HelpCircle, Info, LogOut, Trash2, ChevronRight, Users, Key, Bug } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAgentContext } from '@/context/AgentContext';
import { useApiKeyContext } from '@/context/ApiKeyContext';
import { useDebugContext } from '@/context/DebugContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { agents } = useAgentContext();
  const { apiKeys } = useApiKeyContext();
  const { isDebugMode, toggleDebugMode } = useDebugContext();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);

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
      <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>{title}</Text>
        {description ? <Text style={styles.settingDescription}>{description}</Text> : null}
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
          thumbColor={switchValue ? '#3B82F6' : '#9CA3AF'}
        />
      ) : onPress ? (
        <ChevronRight size={20} color="#9CA3AF" />
      ) : null}
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Agents</Text>
        {renderSettingItem({
          icon: <Users size={22} color="#3B82F6" />,
          title: 'Manage Agents',
          description: 'Create, edit, and delete AI agents',
          badge: agents.length.toString(),
          onPress: () => router.push('/manage-agents')
        })}
        {renderSettingItem({
          icon: <Key size={22} color="#3B82F6" />,
          title: 'My API Keys',
          description: 'Manage your API keys for different vendors',
          badge: apiKeys.length.toString(),
          onPress: () => router.push('/api-keys')
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        {renderSettingItem({
          icon: darkMode ? <Moon size={22} color="#8B5CF6" /> : <Sun size={22} color="#F59E0B" />,
          title: 'Dark Mode',
          description: 'Switch between light and dark themes',
          hasSwitch: true,
          switchValue: darkMode,
          onSwitchChange: setDarkMode
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {renderSettingItem({
          icon: <Bell size={22} color="#3B82F6" />,
          title: 'Push Notifications',
          description: 'Get notified about new messages',
          hasSwitch: true,
          switchValue: notifications,
          onSwitchChange: setNotifications
        })}
        {renderSettingItem({
          icon: <Volume2 size={22} color="#3B82F6" />,
          title: 'Sounds',
          description: 'Play sounds for new messages',
          hasSwitch: true,
          switchValue: sounds,
          onSwitchChange: setSounds
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Developer</Text>
        {renderSettingItem({
          icon: <Bug size={22} color="#3B82F6" />,
          title: 'Debug Mode',
          description: 'Enable developer debugging features',
          hasSwitch: true,
          switchValue: isDebugMode,
          onSwitchChange: toggleDebugMode
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {renderSettingItem({
          icon: <Shield size={22} color="#3B82F6" />,
          title: 'Privacy Policy',
          onPress: () => {}
        })}
        {renderSettingItem({
          icon: <HelpCircle size={22} color="#3B82F6" />,
          title: 'Help & Support',
          onPress: () => {}
        })}
        {renderSettingItem({
          icon: <Info size={22} color="#3B82F6" />,
          title: 'App Version',
          description: '1.0.0'
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {renderSettingItem({
          icon: <LogOut size={22} color="#F43F5E" />,
          title: 'Sign Out',
          destructive: true,
          onPress: () => {}
        })}
        {renderSettingItem({
          icon: <Trash2 size={22} color="#F43F5E" />,
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
    backgroundColor: '#FFFFFF',
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
    color: '#6B7280',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  destructiveIcon: {
    backgroundColor: '#FEE2E2',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#F43F5E',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
});