import { View, Text, StyleSheet, Switch, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { Bell, Volume2, Shield, CircleHelp as HelpCircle, Info, LogOut, Trash2, ChevronRight, Users, Key, Bug, MessageSquare, Monitor, Sun, Moon, Languages, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAgentContext } from '@/context/AgentContext';
import { useApiKeyContext } from '@/context/ApiKeyContext';
import { useDebugContext } from '@/context/DebugContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import AgentSelectionModal from '@/components/AgentSelectionModal';
import LanguageSelectionModal from '@/components/LanguageSelectionModal';
import { ThemeMode } from '@/types/theme';
import { ENV } from '@/utils/env';

export default function SettingsScreen() {
  const router = useRouter();
  const { agents, defaultAgentId, setDefaultAgent, getAgentById } = useAgentContext();
  const { apiKeys, envStatus } = useApiKeyContext();
  const { isDebugMode, toggleDebugMode } = useDebugContext();
  const { theme, themeMode, setThemeMode } = useTheme();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'system':
        return <Monitor size={22} color={themeMode === 'system' ? theme.colors.primary : theme.colors.text.secondary} />;
      case 'light':
        return <Sun size={22} color={themeMode === 'light' ? theme.colors.primary : theme.colors.text.secondary} />;
      case 'dark':
        return <Moon size={22} color={themeMode === 'dark' ? theme.colors.primary : theme.colors.text.secondary} />;
    }
  };

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case 'system':
        return t('settings.items.theme.system');
      case 'light':
        return t('settings.items.theme.light');
      case 'dark':
        return t('settings.items.theme.dark');
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
    badge = null,
    warning = false
  }) => (
    <Pressable 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: destructive ? theme.colors.error + '20' : warning ? theme.colors.warning + '20' : theme.colors.surface },
        destructive && styles.destructiveIcon
      ]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle, 
          { color: destructive ? theme.colors.error : theme.colors.text.primary },
          destructive && styles.destructiveText
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
    <>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]} 
        contentContainerStyle={styles.contentContainer}
      >
        {/* Environment Status */}
        {ENV.IS_DEV && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Environment Status
            </Text>
            <View style={[styles.envStatusCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <AlertCircle size={20} color={theme.colors.info} />
              <Text style={[styles.envStatusText, { color: theme.colors.text.secondary }]}>
                {envStatus}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            {t('settings.sections.developer')}
          </Text>
          {renderSettingItem({
            icon: <Bug size={22} color={theme.colors.primary} />,
            title: t('settings.items.debugMode'),
            description: t('settings.descriptions.debugMode'),
            hasSwitch: true,
            switchValue: isDebugMode,
            onSwitchChange: toggleDebugMode
          })}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            {t('settings.sections.aiAgents')}
          </Text>
          {renderSettingItem({
            icon: <Users size={22} color={theme.colors.primary} />,
            title: t('settings.items.manageAgents'),
            description: t('settings.descriptions.apiKeys'),
            badge: agents.length.toString(),
            onPress: () => router.push('/manage-agents')
          })}
          {renderSettingItem({
            icon: <Key size={22} color={apiKeys.length > 0 ? theme.colors.primary : theme.colors.warning} />,
            title: t('settings.items.apiKeys'),
            description: t('settings.descriptions.apiKeys'),
            badge: apiKeys.length.toString(),
            warning: apiKeys.length === 0,
            onPress: () => router.push('/api-keys')
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            {t('settings.sections.preferences')}
          </Text>
          {renderSettingItem({
            icon: <MessageSquare size={22} color={theme.colors.primary} />,
            title: t('settings.items.defaultAgent'),
            description: defaultAgentId 
              ? `${t('settings.descriptions.defaultAgent')} ${getAgentById(defaultAgentId)?.name}`
              : t('settings.descriptions.defaultAgent'),
            onPress: () => setShowAgentModal(true)
          })}
          {renderSettingItem({
            icon: <Languages size={22} color={theme.colors.primary} />,
            title: t('settings.items.language'),
            description: t('settings.descriptions.language'),
            onPress: () => setShowLanguageModal(true)
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            {t('settings.sections.appearance')}
          </Text>
          <View style={[styles.themeSelector, { backgroundColor: theme.colors.card }]}>
            {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
              <Pressable
                key={mode}
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: themeMode === mode ? theme.colors.primary + '20' : 'transparent',
                    borderColor: themeMode === mode ? theme.colors.primary : 'transparent',
                  }
                ]}
                onPress={() => setThemeMode(mode)}
              >
                {getThemeIcon(mode)}
                <Text
                  style={[
                    styles.themeText,
                    { 
                      color: themeMode === mode ? theme.colors.primary : theme.colors.text.secondary,
                      marginTop: 4,
                    }
                  ]}
                >
                  {getThemeLabel(mode)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <AgentSelectionModal
        visible={showAgentModal}
        onClose={() => setShowAgentModal(false)}
        agents={agents}
        selectedAgentId={defaultAgentId}
        onSelect={setDefaultAgent}
      />

      <LanguageSelectionModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
    </>
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
  themeSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 8,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  envStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  envStatusText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});