declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_SAMPLE_OPENAI_KEY: string;
    }
  }
}

export { };