import apiClient, { acuerdosUrl, downloadFile } from './apiClient';

export async function getZones() {
  const response = await apiClient.get(acuerdosUrl('/catalogs/zones/'));
  return response.data;
}

export async function getInstances(zone) {
  const response = await apiClient.get(acuerdosUrl('/catalogs/instances/'), { params: { zone } });
  return response.data;
}

export async function getTopics() {
  const response = await apiClient.get(acuerdosUrl('/catalogs/topics/'));
  return response.data;
}

export async function getStatuses() {
  const response = await apiClient.get(acuerdosUrl('/catalogs/statuses/'));
  return response.data;
}

export async function getAgreements(params) {
  const response = await apiClient.get(acuerdosUrl('/agreements/'), { params });
  return response.data;
}

export async function getAgreement(id) {
  const response = await apiClient.get(acuerdosUrl(`/agreements/${id}/`));
  return response.data;
}

export async function createAgreement(formData) {
  const response = await apiClient.post(acuerdosUrl('/agreements/'), formData);
  return response.data;
}

export async function updateAgreement(id, values) {
  const response = await apiClient.patch(acuerdosUrl(`/agreements/${id}/`), values);
  return response.data;
}

export async function deleteAgreement(id) {
  await apiClient.delete(acuerdosUrl(`/agreements/${id}/`));
}

export async function getAgreementUpdates(id) {
  const response = await apiClient.get(acuerdosUrl(`/agreements/${id}/updates/`));
  return response.data;
}

export async function createAgreementUpdate(id, formData) {
  const response = await apiClient.post(acuerdosUrl(`/agreements/${id}/updates/`), formData);
  return response.data;
}

export async function updateAgreementUpdate(id, values) {
  const response = await apiClient.patch(acuerdosUrl(`/updates/${id}/`), values);
  return response.data;
}

export async function uploadUpdateEvidence(id, formData) {
  const response = await apiClient.post(acuerdosUrl(`/updates/${id}/evidence/`), formData);
  return response.data;
}

export async function getAgreementHistory(id) {
  const response = await apiClient.get(acuerdosUrl(`/agreements/${id}/history/`));
  return response.data;
}

export async function validateUpdate(id) {
  const response = await apiClient.post(acuerdosUrl(`/updates/${id}/validate/`));
  return response.data;
}

export async function rejectUpdate(id, observations) {
  const response = await apiClient.post(acuerdosUrl(`/updates/${id}/reject/`), { observations });
  return response.data;
}

export function downloadProtectedFile(url, filename) {
  return downloadFile(url, filename);
}

export function exportAgreements(format, params) {
  return downloadFile(
    acuerdosUrl(`/exports/agreements.${format}`),
    `acuerdos-metropolitanos.${format}`,
    params
  );
}
