const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || 'poshkaarkashmirofficial@gmail.com')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const TABLES = {
  Product: 'products',
  Order: 'orders',
  Address: 'addresses',
  WishlistItem: 'wishlist_items',
  Newsletter: 'newsletter_signups',
  Category: 'categories',
  Collection: 'collections',
  Artisan: 'artisans',
  Vendor: 'vendors',
  ProductImage: 'product_images',
  OrderItem: 'order_items',
  Payment: 'payments',
  Review: 'reviews',
  Coupon: 'coupons',
  Notification: 'notifications',
  JournalPost: 'journal_posts',
  ProductIntake: 'product_intake',
  InventoryAdjustment: 'inventory_adjustments',
  CustomerProfile: 'customer_profiles',
  Cart: 'carts',
  CartItem: 'cart_items',
};

const STORAGE_KEYS = {
  accessToken: 'supabase_access_token',
  refreshToken: 'supabase_refresh_token',
  user: 'supabase_user',
  checkoutSession: 'poshkaar_checkout_session',
};

export const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let authSettingsCache = null;
let authSettingsPromise = null;

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

const getOrigin = () => {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
};

const getAbsoluteRedirectUrl = (returnTo = getOrigin()) => {
  const origin = getOrigin();
  if (!origin) return returnTo || '';

  try {
    return new URL(returnTo || '/', origin).toString();
  } catch {
    return origin;
  }
};

const getAccessToken = () => getStorage()?.getItem(STORAGE_KEYS.accessToken) || '';

const createUuid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const getCheckoutSessionId = () => {
  const storage = getStorage();
  if (!storage) return '';

  const existing = storage.getItem(STORAGE_KEYS.checkoutSession);
  if (existing) return existing;

  const sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `checkout_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  storage.setItem(STORAGE_KEYS.checkoutSession, sessionId);
  return sessionId;
};

const clearSession = () => {
  const storage = getStorage();
  if (!storage) return;
  Object.values(STORAGE_KEYS).forEach((key) => storage.removeItem(key));
};

const persistSession = (session = {}) => {
  const storage = getStorage();
  if (!storage) return;

  if (session.access_token) storage.setItem(STORAGE_KEYS.accessToken, session.access_token);
  if (session.refresh_token) storage.setItem(STORAGE_KEYS.refreshToken, session.refresh_token);
  if (session.user) storage.setItem(STORAGE_KEYS.user, JSON.stringify(session.user));
};

const parseHashSession = () => {
  if (typeof window === 'undefined' || !window.location.hash) return;

  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const accessToken = params.get('access_token');
  if (!accessToken) return;

  persistSession({
    access_token: accessToken,
    refresh_token: params.get('refresh_token'),
    user: null,
  });

  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState({}, document.title, cleanUrl);
};

const parseSort = (sortBy = '-created_date') => {
  const field = String(sortBy || 'created_date');
  if (field.startsWith('-')) return `${field.slice(1)}.desc`;
  return `${field}.asc`;
};

const normalizeEntityRecord = (record = {}) => {
  if (!record || typeof record !== 'object') return record;
  return {
    ...record,
    created_date: record.created_date || record.created_at,
    updated_date: record.updated_date || record.updated_at,
    stock_quantity: record.stock_quantity ?? record.stock,
  };
};

const toSupabasePayload = (entityName, value = {}) => {
  const payload = { ...value };
  if (entityName === 'Product') {
    if (payload.stock_quantity !== undefined && payload.stock === undefined) {
      payload.stock = payload.stock_quantity;
    }
    delete payload.stock_quantity;
    delete payload.catalog_source;
    delete payload.source_image_candidates;
  }
  return payload;
};

const buildError = async (response, fallbackMessage) => {
  const text = await response.text().catch(() => '');
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  const rawMessage = data?.msg || data?.message || data?.error_description || data?.error || fallbackMessage;
  const missingTableMatch = String(rawMessage || '').match(/table ['"]public\.([^'"]+)['"]/i);
  const isMissingSupabaseTable = data?.code === 'PGRST205' || Boolean(missingTableMatch);
  const isExpiredSession =
    response.status === 401
    && /jwt expired|token expired|session expired/i.test(String(rawMessage || ''));
  const message = isMissingSupabaseTable
    ? `The Supabase table "${missingTableMatch?.[1] || 'required table'}" is missing. Open Supabase SQL Editor, run supabase/schema.sql, then refresh this page.`
    : isExpiredSession
      ? 'Your sign-in session expired. Please sign in again, or continue checkout as a guest.'
    : rawMessage;
  const error = new Error(message);
  error.status = response.status;
  error.code = data?.code;
  error.isMissingSupabaseSchema = isMissingSupabaseTable;
  error.isExpiredSession = isExpiredSession;
  error.missingTable = missingTableMatch?.[1] || '';
  error.data = data;
  error.response = { data, status: response.status };
  return error;
};

const shouldUseAuthHeader = (auth) => auth === true || auth === 'optional';

const supabaseFetch = async (path, {
  method = 'GET',
  body,
  auth = false,
  headers = {},
} = {}) => {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  const token = shouldUseAuthHeader(auth) ? getAccessToken() : '';
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token || SUPABASE_ANON_KEY}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await buildError(response, 'Supabase request failed');
    if (response.status === 401 && auth === 'optional') {
      clearSession();
      return supabaseFetch(path, {
        method,
        body,
        auth: false,
        headers,
      });
    }

    if (error.isExpiredSession) {
      clearSession();
    }
    throw error;
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const getAuthSettings = async () => {
  if (authSettingsCache) return authSettingsCache;

  if (!authSettingsPromise) {
    authSettingsPromise = supabaseFetch('/auth/v1/settings')
      .then((settings) => {
        authSettingsCache = settings || {};
        return authSettingsCache;
      })
      .catch((error) => {
        authSettingsPromise = null;
        throw error;
      });
  }

  return authSettingsPromise;
};

const buildProviderDisabledError = (provider) => {
  const providerName = String(provider || 'social').replace(/^\w/, (char) => char.toUpperCase());
  const error = new Error(
    `${providerName} login is not turned on in Supabase yet. Use email and password for now, or turn on ${providerName} in Supabase Authentication > Providers.`
  );
  error.code = 'provider_not_enabled';
  error.provider = provider;
  return error;
};

const restFetch = (table, options = {}) => supabaseFetch(`/rest/v1/${table}${options.query || ''}`, options);

const buildFilterQuery = (query = {}, sortBy, limit, skip) => {
  const params = new URLSearchParams();
  params.set('select', '*');

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, `eq.${String(value)}`);
  });

  if (sortBy) params.set('order', parseSort(sortBy));
  if (Number.isFinite(limit)) params.set('limit', String(limit));
  if (Number.isFinite(skip) && skip > 0) params.set('offset', String(skip));

  return `?${params.toString()}`;
};

const getCurrentUserEmail = () => {
  const storage = getStorage();
  if (!storage) return '';
  const raw = storage.getItem(STORAGE_KEYS.user);
  if (!raw) return '';
  try {
    return JSON.parse(raw)?.email || '';
  } catch {
    return '';
  }
};

const createEntityAdapter = (entityName) => {
  const table = TABLES[entityName];
  if (!table) {
    throw new Error(`Supabase adapter does not know entity "${entityName}".`);
  }

  return {
    async list(sortBy = '-created_date', limit, skip) {
      const rows = await restFetch(table, {
        query: buildFilterQuery({}, sortBy, limit, skip),
        auth: getAccessToken() ? 'optional' : false,
      });
      return (rows || []).map(normalizeEntityRecord);
    },

    async filter(query = {}, sortBy = '-created_date', limit, skip) {
      const rows = await restFetch(table, {
        query: buildFilterQuery(query, sortBy, limit, skip),
        auth: getAccessToken() ? 'optional' : false,
      });
      return (rows || []).map(normalizeEntityRecord);
    },

    async get(id) {
      const params = new URLSearchParams({
        select: '*',
        id: `eq.${id}`,
        limit: '1',
      });
      const rows = await restFetch(table, {
        query: `?${params.toString()}`,
        auth: getAccessToken() ? 'optional' : false,
      });
      const record = rows?.[0];
      if (!record) {
        const error = new Error(`${entityName} not found`);
        error.status = 404;
        throw error;
      }
      return normalizeEntityRecord(record);
    },

    async create(data) {
      const payload = toSupabasePayload(entityName, data);
      const isOrder = entityName === 'Order';
      const headers = { Prefer: isOrder ? 'return=minimal' : 'return=representation' };

      if (isOrder) {
        if (!payload.id) {
          payload.id = createUuid();
        }

        if (!payload.created_by) {
          const userEmail = getCurrentUserEmail();
          const checkoutSession = userEmail ? '' : getCheckoutSessionId();
          payload.created_by = userEmail || checkoutSession || payload.customer_email || '';

          if (checkoutSession) {
            headers['x-checkout-session'] = checkoutSession;
          }
        }
      }

      const rows = await restFetch(table, {
        method: 'POST',
        body: payload,
        auth: getAccessToken() ? 'optional' : false,
        headers,
      });
      return normalizeEntityRecord(rows?.[0] || payload);
    },

    async update(id, updates) {
      const params = new URLSearchParams({ id: `eq.${id}` });
      const rows = await restFetch(table, {
        method: 'PATCH',
        query: `?${params.toString()}`,
        body: toSupabasePayload(entityName, updates),
        auth: true,
        headers: { Prefer: 'return=representation' },
      });
      return normalizeEntityRecord(rows?.[0] || { id, ...updates });
    },

    async delete(id) {
      const params = new URLSearchParams({ id: `eq.${id}` });
      await restFetch(table, {
        method: 'DELETE',
        query: `?${params.toString()}`,
        auth: true,
      });
      return true;
    },

    subscribe() {
      return () => {};
    },
  };
};

const getUserRole = async (email) => {
  const normalizedEmail = String(email || '').toLowerCase();
  if (!normalizedEmail) return 'user';
  if (ADMIN_EMAILS.includes(normalizedEmail)) return 'admin';

  try {
    const params = new URLSearchParams({
      select: 'email',
      email: `eq.${normalizedEmail}`,
      limit: '1',
    });
    const rows = await restFetch('admin_users', {
      query: `?${params.toString()}`,
      auth: true,
    });
    return rows?.length ? 'admin' : 'user';
  } catch {
    return 'user';
  }
};

const auth = {
  async me() {
    parseHashSession();
    const token = getAccessToken();
    if (!token) {
      const error = new Error('No active session');
      error.status = 401;
      throw error;
    }

    const user = await supabaseFetch('/auth/v1/user', { auth: true });
    const role = await getUserRole(user.email);
    const mappedUser = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      role,
      raw: user,
    };
    getStorage()?.setItem(STORAGE_KEYS.user, JSON.stringify(mappedUser));
    return mappedUser;
  },

  async loginViaEmailPassword(email, password) {
    const session = await supabaseFetch('/auth/v1/token?grant_type=password', {
      method: 'POST',
      body: { email, password },
    });
    persistSession(session);
    return session;
  },

  async register({ email, password }) {
    const redirectTo = `${getOrigin()}/login`;
    const session = await supabaseFetch(`/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: 'POST',
      body: { email, password },
    });
    persistSession(session);
    return session;
  },

  async verifyOtp({ email, otpCode }) {
    const session = await supabaseFetch('/auth/v1/verify', {
      method: 'POST',
      body: { type: 'signup', email, token: otpCode },
    });
    persistSession(session);
    return session;
  },

  async resendOtp(email) {
    return supabaseFetch('/auth/v1/resend', {
      method: 'POST',
      body: { type: 'signup', email },
    });
  },

  async resetPasswordRequest(email) {
    const redirectTo = `${getOrigin()}/reset-password`;
    return supabaseFetch(`/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
      method: 'POST',
      body: { email },
    });
  },

  async resetPassword({ resetToken, newPassword }) {
    const token = resetToken || getAccessToken();
    if (resetToken) {
      persistSession({ access_token: resetToken });
    }
    if (!token) {
      throw new Error('This reset link is missing an active recovery session.');
    }

    return supabaseFetch('/auth/v1/user', {
      method: 'PUT',
      auth: true,
      body: { password: newPassword },
    });
  },

  setToken(token) {
    persistSession({ access_token: token });
  },

  async isProviderEnabled(provider) {
    const settings = await getAuthSettings();
    return Boolean(settings?.external?.[String(provider || '').toLowerCase()]);
  },

  async loginWithProvider(provider, returnTo = getOrigin()) {
    const providerEnabled = await this.isProviderEnabled(provider);
    if (!providerEnabled) {
      throw buildProviderDisabledError(provider);
    }

    const url = new URL(`${SUPABASE_URL}/auth/v1/authorize`);
    url.searchParams.set('provider', provider);
    url.searchParams.set('redirect_to', getAbsoluteRedirectUrl(returnTo));
    window.location.assign(url.toString());
  },

  async logout(redirectTo) {
    try {
      if (getAccessToken()) {
        await supabaseFetch('/auth/v1/logout', { method: 'POST', auth: true });
      }
    } finally {
      clearSession();
      if (redirectTo) window.location.assign(redirectTo);
    }
  },
};

export const createSupabaseAdapter = () => {
  parseHashSession();

  const entityCache = {};
  const entities = new Proxy({}, {
    get(_, entityName) {
      if (!entityCache[entityName]) {
        entityCache[entityName] = createEntityAdapter(entityName);
      }
      return entityCache[entityName];
    },
  });

  return {
    auth,
    entities,
    functions: {
      async invoke(name, data) {
        const checkoutSession = getCheckoutSessionId();
        const response = await supabaseFetch(`/functions/v1/${name}`, {
          method: 'POST',
          body: data,
          auth: getAccessToken() ? 'optional' : false,
          headers: checkoutSession ? { 'x-checkout-session': checkoutSession } : {},
        });
        return { data: response, status: 200, headers: {} };
      },
    },
  };
};
