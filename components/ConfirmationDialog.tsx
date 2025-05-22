import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/hooks/useTranslation';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export default function ConfirmationDialog({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmationDialogProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.dialog, { backgroundColor: theme.colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              {title}
            </Text>
            <Pressable onPress={onCancel} style={styles.closeButton}>
              <X size={20} color={theme.colors.text.secondary} />
            </Pressable>
          </View>
          
          <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
            {message}
          </Text>
          
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, { backgroundColor: theme.colors.surface }]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, { color: theme.colors.text.secondary }]}>
                {cancelText || t('common.cancel')}
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.button,
                destructive 
                  ? { backgroundColor: theme.colors.error + '20' }
                  : { backgroundColor: theme.colors.primary }
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[
                  styles.buttonText,
                  destructive 
                    ? { color: theme.colors.error }
                    : { color: '#FFFFFF' }
                ]}
              >
                {confirmText || t('common.confirm')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
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
  dialog: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});