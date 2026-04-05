import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,    // send cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Auto-refresh access token on 401 ─────────────────────
// When the server returns 401 (token expired), this interceptor
// automatically calls /auth/refresh, gets a new access token,
// and retries the original request — transparent to components.

let isRefreshing = false;
let refreshQueue = [];       // queued requests waiting for new token

instance.interceptors.response.use(
  (response) => response,   // pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 errors, and only once per request
    if (error.response?.status === 401 && !originalRequest._retry) {

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return instance(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to get a new access token using the refresh token cookie
        const { data } = await instance.post('/auth/refresh');
        const newToken = data.data.accessToken;

        // Set new token as default for future requests
        instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Resolve all queued requests with the new token
        refreshQueue.forEach(({ resolve }) => resolve(newToken));
        refreshQueue = [];

        // Retry the original failed request
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return instance(originalRequest);

      } catch (refreshError) {
        // Refresh failed — clear queue, redirect to login
        refreshQueue.forEach(({ reject }) => reject(refreshError));
        refreshQueue = [];

        // Clear any stored auth state
        delete instance.defaults.headers.common['Authorization'];

        // Redirect to login (unless already there)
        if (window.location.pathname !== '/login') {
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