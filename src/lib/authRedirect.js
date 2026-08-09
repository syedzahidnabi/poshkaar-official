export const getSafeAuthRedirect = (rawValue, fallback = '/') => {
  const fallbackPath = fallback || '/';

  if (!rawValue || typeof rawValue !== 'string') {
    return fallbackPath;
  }

  if (typeof window === 'undefined') {
    return rawValue.startsWith('/') && !rawValue.startsWith('//') ? rawValue : fallbackPath;
  }

  try {
    const url = new URL(rawValue, window.location.origin);
    if (url.origin !== window.location.origin) {
      return fallbackPath;
    }

    return `${url.pathname}${url.search}${url.hash}` || fallbackPath;
  } catch {
    return rawValue.startsWith('/') && !rawValue.startsWith('//') ? rawValue : fallbackPath;
  }
};

export const withFromUrl = (path, returnTo) => {
  if (!returnTo || returnTo === '/') {
    return path;
  }

  const params = new URLSearchParams({ from_url: returnTo });
  return `${path}?${params.toString()}`;
};
