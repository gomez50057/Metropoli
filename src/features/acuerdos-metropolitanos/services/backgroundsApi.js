import apiClient, { acuerdosUrl, openFile } from './apiClient';

export async function getBackgrounds() {
  const response = await apiClient.get(acuerdosUrl('/backgrounds/'));
  return response.data;
}

export async function createBackground(values) {
  const formData = new FormData();
  formData.append('title', values.title);
  formData.append('description', values.description);
  formData.append('file', values.file);
  values.responsibles.forEach((id) => formData.append('responsibles', id));
  const response = await apiClient.post(acuerdosUrl('/backgrounds/'), formData);
  return response.data;
}

export async function updateBackground(id, values) {
  const formData = new FormData();
  formData.append('title', values.title);
  formData.append('description', values.description);
  if (values.file) formData.append('file', values.file);
  values.responsibles.forEach((item) => formData.append('responsibles', item));
  const response = await apiClient.patch(acuerdosUrl(`/backgrounds/${id}/`), formData);
  return response.data;
}

export async function deleteBackground(id) {
  await apiClient.delete(acuerdosUrl(`/backgrounds/${id}/`));
}

export function openBackground(item) {
  return openFile(acuerdosUrl(`/backgrounds/${item.id}/download/`));
}
