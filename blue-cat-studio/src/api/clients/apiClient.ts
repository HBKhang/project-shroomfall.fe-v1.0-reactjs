import axios, { AxiosError } from 'axios';
import { AUTH_KEYS } from '../../constants/auth.constants';
import { dispatchApiError } from '../handlers/error/errorDispatcher';
import type { ApiErrorDTO } from '../../contracts/dto/common/api-error-dto';
import type { TokenDTO } from '../../contracts/dto/feature/identity/response/token-dto'; 
import type { RefreshTokenDTO } from '../../contracts/dto/feature/identity/command/refresh-token-dto'; 

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent infinite retry loops if multiple requests fail simultaneously
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorDTO>) => {
    const originalRequest = error.config as any;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      
      // If refresh or login itself returns 401, force full session wipe and kick out
      if (originalRequest.url?.includes('/identity/refresh') || originalRequest.url?.includes('/identity/login')) {
        handleSessionExpiration(error);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentRefreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN) || '';
        if (!currentRefreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshPayload: RefreshTokenDTO = { refreshToken: currentRefreshToken };

        // Use a clean axios instance to avoid recursive interceptor loops on /refresh
        const { data } = await axios.post<TokenDTO>(
          `${import.meta.env.VITE_API_BASE_URL}/identity/refresh`, 
          refreshPayload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        localStorage.setItem(AUTH_KEYS.TOKEN, data.accessToken);
        localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, data.refreshToken);
        window.dispatchEvent(new Event('auth:login'));

        processQueue(null, data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
        
      } catch (refreshFailure) {
        processQueue(refreshFailure, null);
        handleSessionExpiration(refreshFailure as AxiosError<ApiErrorDTO>);
        return Promise.reject(refreshFailure);
      } finally {
        isRefreshing = false;
      }
    }

    dispatchApiError(error);
    return Promise.reject(error);
  }
);

function handleSessionExpiration(error: AxiosError<ApiErrorDTO> | Error) {
  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
  window.dispatchEvent(new Event('auth:logout'));
  if ('error' in error) {
    dispatchApiError(error as AxiosError<ApiErrorDTO>);
  }
}