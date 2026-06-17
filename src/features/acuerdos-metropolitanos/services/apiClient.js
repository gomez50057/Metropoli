import axios from 'axios';
import { ACUERDOS_API_BASE_URL, API_BASE_URL, acuerdosUrl } from '@/config/api';

export { ACUERDOS_API_BASE_URL, API_BASE_URL, acuerdosUrl };

let accessToken = null;
let refreshPromise = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function clearAccessToken() {
  setAccessToken(null);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post('/auth/refresh/', null, { skipAuthRefresh: true })
      .then((response) => {
        setAccessToken(response.data.access);
        return response.data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function redirectToLogin() {
  if (typeof window === 'undefined') return;
  if (!window.location.pathname.startsWith('/acuerdos-metropolitanos/login')) {
    window.location.assign('/acuerdos-metropolitanos/login');
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';
    const isAuthEndpoint = ['/auth/login/', '/auth/logout/', '/auth/refresh/'].some((path) => requestUrl.includes(path));

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const token = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export async function downloadFile(path, filename, params) {
  const response = await apiClient.get(path, { params, responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export async function openFile(path, params) {
  const previewWindow = window.open('about:blank', '_blank');

  try {
    const response = await apiClient.get(path, { params, responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.data.type }));
    if (previewWindow) {
      previewWindow.opener = null;
      previewWindow.location.href = url;
    } else {
      window.location.href = url;
    }
    setTimeout(() => window.URL.revokeObjectURL(url), 30000);
  } catch (error) {
    previewWindow?.close();
    throw error;
  }
}

export default apiClient;
