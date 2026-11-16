// react/src/vite-env.d.ts
/// <reference types="vite/client" />

interface Window {
  __APP_CONFIG__?: {
    API_URL?: string;
  };
}