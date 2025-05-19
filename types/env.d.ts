declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_OPENAI_API_KEY: string;
      EXPO_PUBLIC_ANTHROPIC_API_KEY: string;
    }
  }
}

export {};