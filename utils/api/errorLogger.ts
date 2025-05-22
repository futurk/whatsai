import { LogEntry } from '@/utils/chatManager';

export class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: Map<string, LogEntry[]> = new Map();

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!this.instance) {
      this.instance = new ErrorLogger();
    }
    return this.instance;
  }

  log(conversationId: string, entry: LogEntry) {
    if (!this.logs.has(conversationId)) {
      this.logs.set(conversationId, []);
    }
    this.logs.get(conversationId)?.push(entry);
  }

  getLogsForConversation(conversationId: string): LogEntry[] {
    return this.logs.get(conversationId) || [];
  }

  clearLogsForConversation(conversationId: string) {
    this.logs.delete(conversationId);
  }
}