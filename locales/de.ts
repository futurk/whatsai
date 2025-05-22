export default {
  common: {
    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    confirm: 'Bestätigen',
  },
  tabs: {
    chats: 'Chats',
    settings: 'Einstellungen',
  },
  chat: {
    newChat: 'Neuer Chat',
    typeMessage: 'Nachricht eingeben...',
    sendImage: 'Bild senden',
    suggestions: {
      aboutYou: 'Erzähl mir von dir',
      help: 'Womit kannst du mir helfen?',
      joke: 'Erzähl mir einen Witz',
      specialty: 'Was ist deine Spezialität?',
    },
    status: {
      typing: 'schreibt...',
      error: 'Fehler beim Senden der Nachricht',
    },
  },
  settings: {
    sections: {
      aiAgents: 'KI-Agenten',
      preferences: 'Präferenzen',
      appearance: 'Erscheinungsbild',
      notifications: 'Benachrichtigungen',
      developer: 'Entwickler',
      about: 'Über',
      account: 'Konto',
    },
    items: {
      manageAgents: 'Agenten verwalten',
      apiKeys: 'Meine API-Schlüssel',
      defaultAgent: 'Standard-Agent',
      language: 'Sprache',
      theme: {
        title: 'Design',
        system: 'System',
        light: 'Hell',
        dark: 'Dunkel',
      },
      pushNotifications: 'Push-Benachrichtigungen',
      sounds: 'Töne',
      debugMode: 'Debug-Modus',
      privacyPolicy: 'Datenschutzerklärung',
      helpSupport: 'Hilfe & Support',
      appVersion: 'App-Version',
      signOut: 'Abmelden',
      clearConversations: 'Alle Gespräche löschen',
    },
    descriptions: {
      apiKeys: 'Verwalten Sie Ihre API-Schlüssel für verschiedene Anbieter',
      defaultAgent: 'Wählen Sie einen Agenten für sofortigen Chat-Start',
      language: 'App-Sprache ändern',
      pushNotifications: 'Benachrichtigungen über neue Nachrichten erhalten',
      sounds: 'Töne für neue Nachrichten abspielen',
      debugMode: 'Entwickler-Debugging-Funktionen aktivieren',
      clearConversations: 'Diese Aktion kann nicht rückgängig gemacht werden',
    },
  },
  agents: {
    title: 'Verfügbare Agenten',
    empty: {
      title: 'Keine Agenten verfügbar',
      message: 'Schauen Sie später wieder vorbei, um mit neuen KI-Agenten zu chatten.',
      action: 'Aktualisieren',
    },
  },
  apiKeys: {
    title: 'Meine API-Schlüssel',
    empty: {
      title: 'Keine API-Schlüssel',
      message: 'Fügen Sie Ihre API-Schlüssel hinzu, um verschiedene KI-Modelle zu nutzen',
    },
    form: {
      vendor: 'Anbieter auswählen',
      name: 'Schlüsselname',
      key: 'API-Schlüssel',
      namePlaceholder: 'Geben Sie einen Namen für diesen Schlüssel ein',
      keyPlaceholder: 'Geben Sie Ihren API-Schlüssel ein',
    },
  },
  dialogs: {
    deleteKey: {
      title: 'API-Schlüssel löschen',
      message: 'Sind Sie sicher, dass Sie diesen API-Schlüssel löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    },
    deleteAgent: {
      title: 'Agent löschen',
      message: 'Sind Sie sicher, dass Sie diesen Agenten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    },
    clearConversations: {
      title: 'Alle Gespräche löschen',
      message: 'Sind Sie sicher, dass Sie alle Gespräche löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    },
  },
};