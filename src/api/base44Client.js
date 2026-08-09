import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { createSupabaseAdapter, hasSupabaseConfig } from '@/api/supabaseAdapter';

const { appId, token, functionsVersion, appBaseUrl } = appParams;
const requestedProvider = (import.meta.env.VITE_BACKEND_PROVIDER || '').toLowerCase();
const isBrowser = typeof window !== 'undefined';
const isLocalHost = isBrowser && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
const hasBase44Config = Boolean(appId) && (!isLocalHost || Boolean(appBaseUrl));
const shouldUseSupabase = hasSupabaseConfig && (
  requestedProvider === 'supabase'
  || (requestedProvider !== 'base44' && !hasBase44Config)
);

export const backendProvider = shouldUseSupabase ? 'supabase' : 'base44';
export const hasConfiguredBackend = shouldUseSupabase ? hasSupabaseConfig : hasBase44Config;

//Create a client with authentication required
export const base44 = shouldUseSupabase ? createSupabaseAdapter() : createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});
