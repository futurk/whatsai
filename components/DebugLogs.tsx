import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Clock } from 'lucide-react-native';

interface LogEntry {
  timestamp: string;
  type: 'request' | 'response' | 'error';
  data: any;
  messageStatus?: 'pending' | 'completed' | 'failed';
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

  const formatData = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return String(data);
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'request':
        return '#3B82F6';
      case 'response':
        return '#10B981';
      case 'error':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case 'pending':
        return <Clock size={14} color="#6B7280" />;
      case 'completed':
        return <CheckCircle size={14} color="#10B981" />;
      case 'failed':
        return <AlertCircle size={14} color="#EF4444" />;
      default:
        return null;
    }
  };

  const getStatusText = (status?: string) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
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
            <View style={styles.logHeader}>
              <View style={styles.timestampContainer}>
                <Text style={styles.timestamp}>{log.timestamp}</Text>
                <Text style={[styles.type, { color: getLogColor(log.type) }]}>
                  {log.type.toUpperCase()}
                </Text>
              </View>
              {log.messageStatus && (
                <View style={styles.statusContainer}>
                  {getStatusIcon(log.messageStatus)}
                  <Text style={[
                    styles.statusText,
                    { color: getLogColor(log.messageStatus === 'failed' ? 'error' : 'response') }
                  ]}>
                    {getStatusText(log.messageStatus)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.data}>{formatData(log.data)}</Text>
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
    maxHeight: 300,
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestamp: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  type: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1F2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  data: {
    color: '#E5E7EB',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});