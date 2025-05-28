import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '@/types/language';

interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function LanguageSelectionModal({
  visible,
  onClose,
}: LanguageSelectionModalProps) {
  const { theme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const getLanguageDisplay = (name: string, nativeName: string) => {
    if (name === 'System') return 'System';
    return `${name} (${nativeName})`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
        onPress={onClose}
      >
        <Pressable 
          style={[styles.modal, { backgroundColor: theme.colors.background }]}
          onPress={e => e.stopPropagation()}
        >
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              Select Language
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text.secondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
              Choose your preferred language
            </Text>

            {SUPPORTED_LANGUAGES.map((lang) => (
              <Pressable
                key={lang.id}
                style={[
                  styles.languageItem,
                  { backgroundColor: theme.colors.card }
                ]}
                onPress={() => {
                  setLanguage(lang.id);
                  onClose();
                }}
              >
                <View style={styles.languageInfo}>
                  <Text style={[styles.languageName, { color: theme.colors.text.primary }]}>
                    {getLanguageDisplay(lang.name, lang.nativeName)}
                  </Text>
                </View>
                {language === lang.id && (
                  <Check size={20} color={theme.colors.primary} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
});