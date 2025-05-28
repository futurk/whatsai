export default {
  common: {
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    confirm: 'Confirm',
  },
  tabs: {
    chats: 'Chats',
    settings: 'Settings',
  },
  chat: {
    newChat: 'New Chat',
    typeMessage: 'Type your message...',
    sendImage: 'Sent an image',
    empty: {
      title: 'No conversations yet',
      message: 'Start chatting with an AI agent to see your conversations here.',
      action: 'Find an agent'
    },
    suggestions: {
      aboutYou: 'Tell me about yourself',
      help: 'What can you help me with?',
      joke: 'Tell me a joke',
      specialty: "What's your specialty?"
    },
    status: {
      typing: 'typing...',
      error: 'Error sending message',
    },
  },
  settings: {
    sections: {
      aiAgents: 'AI Agents',
      preferences: 'Preferences',
      appearance: 'Appearance',
      notifications: 'Notifications',
      developer: 'Developer',
      about: 'About',
      account: 'Account',
    },
    items: {
      manageAgents: 'Manage Agents',
      apiKeys: 'My API Keys',
      defaultAgent: 'Default Agent',
      language: 'Language',
      theme: {
        title: 'Theme',
        system: 'System',
        light: 'Light',
        dark: 'Dark',
      },
      pushNotifications: 'Push Notifications',
      sounds: 'Sounds',
      debugMode: 'Debug Mode',
      privacyPolicy: 'Privacy Policy',
      helpSupport: 'Help & Support',
      appVersion: 'App Version',
      signOut: 'Sign Out',
      clearConversations: 'Clear All Conversations',
    },
    descriptions: {
      apiKeys: 'Manage your API keys for different vendors',
      defaultAgent: 'Select an agent to start new chats immediately',
      language: 'Change the app language',
      pushNotifications: 'Get notified about new messages',
      sounds: 'Play sounds for new messages',
      debugMode: 'Enable developer debugging features',
      clearConversations: 'This cannot be undone',
    },
  },
  agents: {
    title: 'Available Agents',
    empty: {
      title: 'No agents available',
      message: 'Check back soon for new AI agents to chat with.',
      action: 'Refresh',
    },
    edit: {
      title: 'Edit Agent',
    },
    new: {
      title: 'New Agent',
    },
    form: {
      name: 'Name',
      namePlaceholder: 'Enter agent name',
      instructions: 'Instructions',
      instructionsPlaceholder: 'Enter agent instructions (optional)',
      apiKey: 'API Key',
      model: 'Model',
      color: 'Color',
      tags: 'Tags (comma-separated)',
      tagsPlaceholder: 'General, Helpful, Assistant',
      advancedSettings: 'Advanced Settings',
      temperature: 'Temperature (0.0 - 1.0)',
      temperatureHelp: 'Controls randomness: 0 is focused, 1 is creative',
      maxTokens: 'Max Tokens',
      maxTokensHelp: 'Maximum length of the generated response',
    },
  },
  apiKeys: {
    title: 'My API Keys',
    empty: {
      title: 'No API Keys',
      message: 'Add your API keys to use with different AI models',
    },
    form: {
      vendor: 'Select Vendor',
      name: 'Key Name',
      key: 'API Key',
      namePlaceholder: 'Enter a name for this key',
      keyPlaceholder: 'Enter your API key',
    },
  },
  dialogs: {
    deleteKey: {
      title: 'Delete API Key',
      message: 'Are you sure you want to delete this API key? This action cannot be undone.',
    },
    deleteAgent: {
      title: 'Delete Agent',
      message: 'Are you sure you want to delete this agent? This action cannot be undone.',
    },
    clearConversations: {
      title: 'Clear All Conversations',
      message: 'Are you sure you want to delete all conversations? This action cannot be undone.',
    },
    unsavedChanges: {
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to leave?',
      discard: 'Discard',
      continue: 'Continue Editing'
    }
  },
};