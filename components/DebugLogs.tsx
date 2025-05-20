import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

interface LogEntry {
  timestamp: string;
  type: 'request' | 'response' | 'error';
  data: any;
}

interface DebugLogsProps {
  logs: LogEntry[];
}

export default function DebugLogs({ logs }: DebugLogsProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [logs]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toISOString();
  };

  const formatData = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(200)} 
      style={styles.container}
    >
      <Text style={styles.title}>API Logs</Text>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {logs.map((log, index) => (
          <View key={index} style={styles.logEntry}>
            <Text style={styles.timestamp}>{formatTimestamp(log.timestamp)}</Text>
            <Text style={[styles.type, { color: log.type === 'request' ? '#3B82F6' : log.type === 'response' ? '#10B981' : '#EF4444' }]}>
              {log.type.toUpperCase()}
            </Text>
            <View style={styles.codeBlock}>
              <Text style={styles.code}>{formatData(log.data)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    margin: 12,
    maxHeight: 400,
  },
  title: {
    color: '#F3F4F6',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  logEntry: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
  },
  timestamp: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  type: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  codeBlock: {
    backgroundColor: '#1F2937',
    borderRadius: 4,
    padding: 8,
  },
  code: {
    color: '#E5E7EB',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});