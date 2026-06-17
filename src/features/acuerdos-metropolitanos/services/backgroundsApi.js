import apiClient, { acuerdosUrl } from './apiClient';

export async function getBackgrounds() {
  const response = await apiClient.get(acuerdosUrl('/backgrounds/'));
  return response.data;
}

export async function createBackground(values) {
  const response = await apiClient.post(acuerdosUrl('/backgrounds/'), values);
  return response.data;
}

export async function updateBackground(id, values) {
  const response = await apiClient.patch(acuerdosUrl(`/backgrounds/${id}/`), values);
  return response.data;
}

export async function deleteBackground(id) {
  await apiClient.delete(acuerdosUrl(`/backgrounds/${id}/`));
}
