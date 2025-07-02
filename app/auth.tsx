import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buttonScale = useSharedValue(1);

  const handleModeSwitch = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleAuth = async () => {
    setIsLoading(true);
    buttonScale.value = withSpring(0.95);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      buttonScale.value = withSpring(1);
      // Navigate to main app
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const isFormValid = mode === 'login' 
    ? email && password 
    : email && password && name;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <Pressable 
              onPress={() => router.back()} 
              style={[styles.backButton, { marginTop: insets.top }]}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable 
              onPress={handleSkip}
              style={[styles.skipButton, { marginTop: insets.top }]}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
              <ArrowRight size={16} color="rgba(255, 255, 255, 0.8)" />
            </Pressable>
          ),
        }}
      />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 60 }]}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              entering={FadeInUp.delay(200).springify()}
              style={styles.header}
            >
              <Text style={styles.title}>
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text style={styles.subtitle}>
                {mode === 'login' 
                  ? 'Sign in to continue your AI conversations'
                  : 'Join thousands of users chatting with AI'
                }
              </Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(400).springify()}
              style={styles.formContainer}
            >
              {mode === 'signup' && (
                <Animated.View 
                  entering={FadeInDown.delay(100).springify()}
                  style={styles.inputContainer}
                >
                  <View style={styles.inputWrapper}>
                    <User size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="rgba(255, 255, 255, 0.6)"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </Animated.View>
              )}

              <Animated.View 
                entering={FadeInDown.delay(mode === 'signup' ? 200 : 100).springify()}
                style={styles.inputContainer}
              >
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </Animated.View>

              <Animated.View 
                entering={FadeInDown.delay(mode === 'signup' ? 300 : 200).springify()}
                style={styles.inputContainer}
              >
                <View style={styles.inputWrapper}>
                  <Lock size={20} color="rgba(255, 255, 255, 0.7)" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="rgba(255, 255, 255, 0.7)" />
                    ) : (
                      <Eye size={20} color="rgba(255, 255, 255, 0.7)" />
                    )}
                  </Pressable>
                </View>
              </Animated.View>

              <Animated.View 
                entering={FadeInDown.delay(mode === 'signup' ? 400 : 300).springify()}
                style={styles.buttonContainer}
              >
                <Animated.View style={buttonAnimatedStyle}>
                  <Pressable
                    style={[
                      styles.authButton,
                      !isFormValid && styles.authButtonDisabled,
                      isLoading && styles.authButtonLoading
                    ]}
                    onPress={handleAuth}
                    disabled={!isFormValid || isLoading}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <View style={styles.loadingDot} />
                        <View style={[styles.loadingDot, styles.loadingDot2]} />
                        <View style={[styles.loadingDot, styles.loadingDot3]} />
                      </View>
                    ) : (
                      <Text style={styles.authButtonText}>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                      </Text>
                    )}
                  </Pressable>
                </Animated.View>
              </Animated.View>

              {mode === 'login' && (
                <Animated.View 
                  entering={FadeInDown.delay(400).springify()}
                  style={styles.forgotPasswordContainer}
                >
                  <Pressable>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </Pressable>
                </Animated.View>
              )}
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(500).springify()}
              style={styles.skipContainer}
            >
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
              
              <Pressable
                style={({ pressed }) => [
                  styles.skipMainButton,
                  pressed && styles.skipMainButtonPressed
                ]}
                onPress={handleSkip}
              >
                <Text style={styles.skipMainButtonText}>Try the App First</Text>
                <ArrowRight size={18} color="rgba(255, 255, 255, 0.9)" strokeWidth={2} />
              </Pressable>
              
              <Text style={styles.skipDescription}>
                Explore all features without creating an account
              </Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(600).springify()}
              style={styles.switchModeContainer}
            >
              <Text style={styles.switchModeText}>
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <Pressable onPress={handleModeSwitch}>
                <Text style={styles.switchModeButton}>
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </Pressable>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 16,
  },
  skipButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginRight: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 16,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  authButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  authButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowOpacity: 0.1,
  },
  authButtonLoading: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667eea',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#667eea',
    marginHorizontal: 2,
    opacity: 0.4,
  },
  loadingDot2: {
    animationDelay: '0.2s',
  },
  loadingDot3: {
    animationDelay: '0.4s',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textDecorationLine: 'underline',
  },
  skipContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  skipMainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
  skipMainButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    transform: [{ scale: 0.98 }],
  },
  skipMainButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 8,
  },
  skipDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  switchModeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 8,
  },
  switchModeButton: {
    fontSize: 14,
    color: '#FFE066',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});