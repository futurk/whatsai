export default {
  common: {
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    confirm: 'Onayla',
  },
  tabs: {
    chats: 'Sohbetler',
    settings: 'Ayarlar',
  },
  chat: {
    newChat: 'Yeni Sohbet',
    typeMessage: 'Mesajınızı yazın...',
    sendImage: 'Resim gönderildi',
    empty: {
      title: 'Henüz sohbet yok',
      message: 'Sohbetlerinizi burada görmek için bir yapay zeka ajanıyla sohbet etmeye başlayın.',
      action: 'Ajan bul'
    },
    suggestions: {
      aboutYou: 'Kendinden bahset',
      help: 'Bana nasıl yardımcı olabilirsin?',
      joke: 'Bana bir fıkra anlat',
      specialty: 'Uzmanlık alanın nedir?'
    },
    status: {
      typing: 'yazıyor...',
      error: 'Mesaj gönderilirken hata oluştu',
    },
  },
  settings: {
    sections: {
      aiAgents: 'Yapay Zeka Ajanları',
      preferences: 'Tercihler',
      appearance: 'Görünüm',
      notifications: 'Bildirimler',
      developer: 'Geliştirici',
      about: 'Hakkında',
      account: 'Hesap',
    },
    items: {
      manageAgents: 'Ajanları Yönet',
      apiKeys: 'API Anahtarlarım',
      defaultAgent: 'Varsayılan Ajan',
      language: 'Dil',
      theme: {
        title: 'Tema',
        system: 'Sistem',
        light: 'Açık',
        dark: 'Koyu',
      },
      pushNotifications: 'Push Bildirimleri',
      sounds: 'Sesler',
      debugMode: 'Hata Ayıklama Modu',
      privacyPolicy: 'Gizlilik Politikası',
      helpSupport: 'Yardım & Destek',
      appVersion: 'Uygulama Sürümü',
      signOut: 'Çıkış Yap',
      clearConversations: 'Tüm Sohbetleri Temizle',
    },
    descriptions: {
      apiKeys: 'Farklı sağlayıcılar için API anahtarlarınızı yönetin',
      defaultAgent: 'Yeni sohbetleri hemen başlatmak için bir ajan seçin',
      language: 'Uygulama dilini değiştirin',
      pushNotifications: 'Yeni mesajlar hakkında bildirim alın',
      sounds: 'Yeni mesajlar için ses çal',
      debugMode: 'Geliştirici hata ayıklama özelliklerini etkinleştir',
      clearConversations: 'Bu işlem geri alınamaz',
    },
  },
  agents: {
    title: 'Mevcut Ajanlar',
    empty: {
      title: 'Hiç ajan yok',
      message: 'Yakında yeni yapay zeka ajanlarıyla sohbet etmek için tekrar kontrol edin.',
      action: 'Yenile',
    },
    edit: {
      title: 'Ajanı Düzenle',
    },
    new: {
      title: 'Yeni Ajan',
    },
    form: {
      name: 'İsim',
      namePlaceholder: 'Ajan adını girin',
      instructions: 'Talimatlar',
      instructionsPlaceholder: 'Ajan için talimatları girin (isteğe bağlı)',
      apiKey: 'API Anahtarı',
      model: 'Model',
      color: 'Renk',
      tags: 'Etiketler (virgülle ayrılmış)',
      tagsPlaceholder: 'Genel, Yardımcı, Asistan',
      advancedSettings: 'Gelişmiş Ayarlar',
      temperature: 'Sıcaklık (0.0 - 1.0)',
      temperatureHelp: 'Rastgeleliği kontrol eder: 0 odaklı, 1 yaratıcıdır',
      maxTokens: 'Maksimum Token',
      maxTokensHelp: 'Oluşturulan yanıtın maksimum uzunluğu',
    },
  },
  apiKeys: {
    title: 'API Anahtarlarım',
    empty: {
      title: 'API Anahtarı Yok',
      message: 'Farklı yapay zeka modelleriyle kullanmak için API anahtarlarınızı ekleyin',
    },
    form: {
      vendor: 'Sağlayıcı Seçin',
      name: 'Anahtar Adı',
      key: 'API Anahtarı',
      namePlaceholder: 'Bu anahtar için bir isim girin',
      keyPlaceholder: 'API anahtarınızı girin',
    },
  },
  dialogs: {
    deleteKey: {
      title: 'API Anahtarını Sil',
      message: 'Bu API anahtarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    },
    deleteAgent: {
      title: 'Ajanı Sil',
      message: 'Bu ajanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    },
    clearConversations: {
      title: 'Tüm Sohbetleri Temizle',
      message: 'Tüm sohbetleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    },
  },
};