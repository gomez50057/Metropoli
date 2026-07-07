import apiClient, { acuerdosUrl, openFile } from './apiClient';

export async function getMinutes(params) {
  const response = await apiClient.get(acuerdosUrl('/minutes/'), { params });
  return response.data;
}

export async function createMinute(values) {
  const formData = new FormData();
  formData.append('title', values.title);
  formData.append('description', values.description);
  formData.append('document_type', values.document_type);
  if (values.date) formData.append('date', values.date);
  formData.append('zone', values.zone);
  formData.append('instance', values.instance);
  formData.append('file', values.file);
  const response = await apiClient.post(acuerdosUrl('/minutes/'), formData);
  return response.data;
}

export async function updateMinute(id, values) {
  const formData = new FormData();
  formData.append('title', values.title);
  formData.append('description', values.description);
  formData.append('document_type', values.document_type);
  if (values.date) formData.append('date', values.date);
  formData.append('zone', values.zone);
  formData.append('instance', values.instance);
  if (values.file) formData.append('file', values.file);
  const response = await apiClient.patch(acuerdosUrl(`/minutes/${id}/`), formData);
  return response.data;
}

export async function deleteMinute(id) {
  await apiClient.delete(acuerdosUrl(`/minutes/${id}/`));
}

export function openMinute(item) {
  if (item.url?.startsWith('/minutas/')) {
    window.open(item.url, '_blank', 'noopener,noreferrer');
    return Promise.resolve();
  }
  return openFile(item.url);
}
