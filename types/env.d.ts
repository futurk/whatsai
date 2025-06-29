declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SAMPLE_OPENAI_KEY: string;
      EXPO_PUBLIC_SAMPLE_ANTHROPIC_KEY: string;
    }
  }
}

export {};