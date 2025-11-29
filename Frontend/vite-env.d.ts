/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IMGBB_API_KEY: string;
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
