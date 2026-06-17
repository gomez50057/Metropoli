import apiClient from './apiClient';

export async function loginRequest(values) {
  const response = await apiClient.post('/auth/login/', values);
  return response.data;
}

export async function refreshRequest() {
  const response = await apiClient.post('/auth/refresh/', null, { skipAuthRefresh: true });
  return response.data;
}

export async function logoutRequest() {
  await apiClient.post('/auth/logout/');
}

export async function meRequest() {
  const response = await apiClient.get('/auth/me/');
  return response.data;
}
