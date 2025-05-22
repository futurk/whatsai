export default {
  common: {
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    confirm: 'Confirmar',
  },
  tabs: {
    chats: 'Chats',
    settings: 'Ajustes',
  },
  chat: {
    newChat: 'Nuevo Chat',
    typeMessage: 'Escribe tu mensaje...',
    sendImage: 'Enviar Imagen',
    suggestions: {
      aboutYou: 'Háblame de ti',
      help: '¿En qué puedes ayudarme?',
      joke: 'Cuéntame un chiste',
      specialty: '¿Cuál es tu especialidad?',
    },
    status: {
      typing: 'escribiendo...',
      error: 'Error al enviar el mensaje',
    },
  },
  settings: {
    sections: {
      aiAgents: 'Agentes IA',
      preferences: 'Preferencias',
      appearance: 'Apariencia',
      notifications: 'Notificaciones',
      developer: 'Desarrollador',
      about: 'Acerca de',
      account: 'Cuenta',
    },
    items: {
      manageAgents: 'Gestionar Agentes',
      apiKeys: 'Mis Claves API',
      defaultAgent: 'Agente Predeterminado',
      language: 'Idioma',
      theme: {
        title: 'Tema',
        system: 'Sistema',
        light: 'Claro',
        dark: 'Oscuro',
      },
      pushNotifications: 'Notificaciones Push',
      sounds: 'Sonidos',
      debugMode: 'Modo Debug',
      privacyPolicy: 'Política de Privacidad',
      helpSupport: 'Ayuda y Soporte',
      appVersion: 'Versión de la App',
      signOut: 'Cerrar Sesión',
      clearConversations: 'Borrar Todas las Conversaciones',
    },
    descriptions: {
      apiKeys: 'Gestiona tus claves API para diferentes proveedores',
      defaultAgent: 'Selecciona un agente para iniciar chats inmediatamente',
      language: 'Cambiar el idioma de la aplicación',
      pushNotifications: 'Recibe notificaciones sobre nuevos mensajes',
      sounds: 'Reproducir sonidos para nuevos mensajes',
      debugMode: 'Activar funciones de depuración para desarrolladores',
      clearConversations: 'Esta acción no se puede deshacer',
    },
  },
  agents: {
    title: 'Agentes Disponibles',
    empty: {
      title: 'No hay agentes disponibles',
      message: 'Vuelve pronto para chatear con nuevos agentes de IA.',
      action: 'Actualizar',
    },
  },
  apiKeys: {
    title: 'Mis Claves API',
    empty: {
      title: 'No hay Claves API',
      message: 'Añade tus claves API para usar con diferentes modelos de IA',
    },
    form: {
      vendor: 'Seleccionar Proveedor',
      name: 'Nombre de la Clave',
      key: 'Clave API',
      namePlaceholder: 'Introduce un nombre para esta clave',
      keyPlaceholder: 'Introduce tu clave API',
    },
  },
  dialogs: {
    deleteKey: {
      title: 'Eliminar Clave API',
      message: '¿Estás seguro de que quieres eliminar esta clave API? Esta acción no se puede deshacer.',
    },
    deleteAgent: {
      title: 'Eliminar Agente',
      message: '¿Estás seguro de que quieres eliminar este agente? Esta acción no se puede deshacer.',
    },
    clearConversations: {
      title: 'Borrar Todas las Conversaciones',
      message: '¿Estás seguro de que quieres borrar todas las conversaciones? Esta acción no se puede deshacer.',
    },
  },
};