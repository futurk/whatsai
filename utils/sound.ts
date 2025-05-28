import { Platform } from 'react-native';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (Platform.OS === 'web') {
      // Initialize Web Audio API
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported');
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  async playMessageTone() {
    if (!this.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Error playing message tone:', error);
    }
  }

  async playNotificationTone() {
    if (!this.enabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, this.audioContext.currentTime); // D5 note
      oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.1); // A5 note
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing notification tone:', error);
    }
  }
}

export const soundManager = new SoundManager();