
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_LOCAL_ENDPOINT: string;
      EXPO_PUBLIC_LOCAL_GATEWAY: string;
      EXPO_PUBLIC_EM_ENDPOINT: string;
      EXPO_PUBLIC_API_ENDPOINT: string;
    }
  }
}