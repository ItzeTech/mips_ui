// axiosInstance.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { logout, logoutUserApi, setCredentials } from '../features/auth/authSlice';
import { clearUser } from '../features/user/userSlice';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let storeRef: any = null;
export const injectStore = (_store: any) => {
  storeRef = _store;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storeRef?.getState()?.auth?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      if (originalRequest.url === '/auth/token/refresh') {
        await storeRef.dispatch(logoutUserApi());
        await storeRef.dispatch(logout());
        clearUser();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh`, {}, { withCredentials: true });

        const newAccessToken = data.access_token;
        const newRoles = data.roles;

        storeRef.dispatch(setCredentials({ access_token: newAccessToken, token_type: 'bearer', roles: newRoles }));

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.log(refreshError)
        processQueue(refreshError, null);
        await storeRef.dispatch(logoutUserApi());
        await storeRef.dispatch(logout());
        clearUser();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
