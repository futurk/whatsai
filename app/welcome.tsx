import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSquare, Sparkles, Zap, ArrowRight } from 'lucide-react-native';
import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sparkleScale = useSharedValue(1);
  const zapRotation = useSharedValue(0);

  useEffect(() => {
    // Animate icons
    sparkleScale.value = withSequence(
      withDelay(1000, withSpring(1.2)),
      withSpring(1),
      withDelay(2000, withSpring(1.1)),
      withSpring(1)
    );

    zapRotation.value = withSequence(
      withDelay(1500, withSpring(10)),
      withSpring(-5),
      withSpring(0)
    );
  }, []);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
  }));

  const zapAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${zapRotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background decorative elements */}
        <View style={styles.decorativeElements}>
          <Animated.View style={[styles.floatingIcon, styles.sparkleIcon, sparkleAnimatedStyle]}>
            <Sparkles size={24} color="rgba(255, 255, 255, 0.3)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.zapIcon, zapAnimatedStyle]}>
            <Zap size={20} color="rgba(255, 255, 255, 0.2)" />
          </Animated.View>
          <View style={[styles.floatingIcon, styles.messageIcon]}>
            <MessageSquare size={18} color="rgba(255, 255, 255, 0.25)" />
          </View>
        </View>

        {/* Content Container */}
        <View style={[styles.contentContainer, { 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20 
        }]}>
          
          {/* Top Section - Logo */}
          <Animated.View 
            entering={FadeInUp.delay(300).springify()}
            style={styles.topSection}
          >
            <View style={styles.logo}>
              <MessageSquare size={48} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.appName}>ChatBot AI</Text>
          </Animated.View>

          {/* Middle Section - Hero Content */}
          <Animated.View 
            entering={FadeInUp.delay(600).springify()}
            style={styles.middleSection}
          >
            <Text style={styles.heroTitle}>
              Welcome to the Future of{'\n'}
              <Text style={styles.heroTitleAccent}>AI Conversations</Text>
            </Text>
            
            <Text style={styles.heroSubtitle}>
              Chat with multiple AI agents, each with unique personalities and expertise. 
              Experience the next generation of intelligent conversations.
            </Text>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <MessageSquare size={20} color="#667eea" />
                </View>
                <Text style={styles.featureText}>Multiple AI Agents</Text>
              </View>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Sparkles size={20} color="#667eea" />
                </View>
                <Text style={styles.featureText}>Smart Conversations</Text>
              </View>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Zap size={20} color="#667eea" />
                </View>
                <Text style={styles.featureText}>Lightning Fast</Text>
              </View>
            </View>
          </Animated.View>

          {/* Bottom Section - CTA */}
          <Animated.View 
            entering={FadeInDown.delay(1200).springify()}
            style={styles.bottomSection}
          >
            <Pressable
              style={({ pressed }) => [
                styles.getStartedButton,
                pressed && styles.getStartedButtonPressed
              ]}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
              <ArrowRight size={20} color="#667eea" strokeWidth={2.5} />
            </Pressable>
            
            <Text style={styles.bottomText}>
              Join thousands of users already chatting with AI
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingIcon: {
    position: 'absolute',
  },
  sparkleIcon: {
    top: height * 0.15,
    right: width * 0.1,
  },
  zapIcon: {
    top: height * 0.25,
    left: width * 0.15,
  },
  messageIcon: {
    bottom: height * 0.35,
    right: width * 0.2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 32,
    zIndex: 1,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 20,
  },
  heroTitleAccent: {
    color: '#FFE066',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: 50,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 320,
  },
  feature: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600',
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
    justifyContent: 'center',
  },
  getStartedButtonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667eea',
    marginRight: 8,
  },
  bottomText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: 280,
  },
});