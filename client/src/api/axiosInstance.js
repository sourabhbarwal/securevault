import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshQueue = [];

instance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // ── SKIP INTERCEPTOR for all auth endpoints ──────────────
    // Auth routes handle their own 401s.
    // Login 401 = wrong password (show that error directly)
    // Refresh 401 = no cookie (AuthContext handles it silently)
    // Register, logout etc. should never trigger auto-refresh
    const isAuthRoute = requestUrl.includes('/auth/');
    if (isAuthRoute) {
      return Promise.reject(error);
    }
    // ── END SKIP ─────────────────────────────────────────────

    // For all other routes (vault, apikeys, audit) hitting 401:
    // Try to refresh the access token, then retry the request
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        // Another request is already refreshing — queue this one
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await instance.post('/auth/refresh');
        const newToken = data.data.accessToken;

        instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        refreshQueue.forEach(({ resolve }) => resolve(newToken));
        refreshQueue = [];

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return instance(originalRequest);

      } catch (refreshError) {
        refreshQueue.forEach(({ reject }) => reject(refreshError));
        refreshQueue = [];
        delete instance.defaults.headers.common['Authorization'];

        // Only hard-redirect if user is on a protected page
        const publicPages = ['/login', '/register', '/verify-2fa', '/home'];
        if (!publicPages.some(p => window.location.pathname.startsWith(p))) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;