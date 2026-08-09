import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const useSupabase = env.VITE_BACKEND_PROVIDER === 'supabase';

  return {
  plugins: [
    ...(!useSupabase ? [
      base44({
        // Support for legacy code that imports the base44 SDK with @/integrations, @/entities, etc.
        // can be removed if the code has been updated to use the new SDK imports from @base44/sdk
        legacySDKImports: env.BASE44_LEGACY_SDK_IMPORTS === 'true',
        hmrNotifier: true,
        navigationNotifier: true,
        analyticsTracker: true,
        visualEditAgent: true
      })
    ] : []),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  server: {
    watch: {
      // Keep local previews stable when audit artefacts or unrelated nested
      // workspaces exist beside the storefront source.
      ignored: [
        '**/alignerr-task*/**',
        '**/.venv/**',
        '**/test-artifacts/**',
        '**/tmp/**',
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@base44')) return 'vendor_base44';
            if (id.includes('framer-motion')) return 'vendor_framer';
            if (id.includes('lucide-react')) return 'vendor_icons';
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/react-router/') ||
              id.includes('/react-router-dom/') ||
              id.includes('/scheduler/')
            ) return 'vendor_react';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
  };
});
