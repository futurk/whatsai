import { 
  Platform, 
  Pressable, 
  PressableProps, 
  StyleProp, 
  ViewStyle 
} from 'react-native';

interface AccessibleTouchableProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function AccessibleTouchable({ 
  style, 
  children, 
  accessibilityRole = 'button',
  ...props 
}: AccessibleTouchableProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole={accessibilityRole}
      style={({ pressed }) => [
        style,
        Platform.OS === 'web' && {
          cursor: 'pointer',
          outlineStyle: 'none',
        },
        pressed && { opacity: 0.7 },
      ]}
    >
      {children}
    </Pressable>
  );
}