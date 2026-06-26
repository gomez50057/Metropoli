import apiClient, { acuerdosUrl, downloadFile, openFile } from './apiClient';

export async function getZones() {
  const response = await apiClient.get(acuerdosUrl('/catalogs/zones/'));
  return response.data;
}

export async function getInstances(zone) {
  const response = await apiClient.get(acuerdosUrl('/catalogs/instances/'), { params: { zone } });
  return response.data;
}

export async function getResponsibles(zone) {
  const response = await apiClient.get(acuerdosUrl('/catalogs/responsibles/'), { params: { zone } });
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

export async function getNotifications() {
  const response = await apiClient.get(acuerdosUrl('/notifications/'));
  return response.data;
}

export async function markNotificationRead(id) {
  const response = await apiClient.post(acuerdosUrl(`/notifications/${id}/read/`));
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

export async function updateResponsibleStatus(id, status) {
  const response = await apiClient.patch(acuerdosUrl(`/responsible-statuses/${id}/`), { status });
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

export async function deleteAgreementDocument(id) {
  await apiClient.delete(acuerdosUrl(`/evidence/${id}/`));
}

export async function replaceAgreementDocument(id, file) {
  const formData = new FormData();
  formData.append('document', file);
  const response = await apiClient.patch(acuerdosUrl(`/evidence/${id}/`), formData);
  return response.data;
}

export async function deleteAgreementOtherFile(id) {
  await apiClient.delete(acuerdosUrl(`/other-files/${id}/`));
}

export async function replaceAgreementOtherFile(id, file) {
  const formData = new FormData();
  formData.append('other_file', file);
  const response = await apiClient.patch(acuerdosUrl(`/other-files/${id}/`), formData);
  return response.data;
}

export async function deleteUpdateEvidence(id) {
  await apiClient.delete(acuerdosUrl(`/update-evidence/${id}/`));
}

export async function replaceUpdateEvidence(id, file) {
  const formData = new FormData();
  formData.append('evidence', file);
  const response = await apiClient.patch(acuerdosUrl(`/update-evidence/${id}/`), formData);
  return response.data;
}

export async function getAgreementHistory(id, params) {
  const response = await apiClient.get(acuerdosUrl(`/agreements/${id}/history/`), { params });
  return response.data;
}

export async function createInternalComment(id, comment) {
  const response = await apiClient.post(acuerdosUrl(`/agreements/${id}/comments/`), { comment });
  return response.data;
}

export async function updateInternalComment(id, comment) {
  const response = await apiClient.patch(acuerdosUrl(`/comments/${id}/`), { comment });
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

export function previewProtectedFile(url) {
  return openFile(url);
}

export function downloadAgreementReport(id, folio) {
  return downloadFile(
    acuerdosUrl(`/agreements/${id}/report.pdf`),
    `${folio || `acuerdo-${id}`}-reporte.pdf`
  );
}

export function downloadAgreementReportPackage(id, folio) {
  return downloadFile(
    acuerdosUrl(`/agreements/${id}/report-package.zip`),
    `${folio || `acuerdo-${id}`}-reporte-con-anexos.zip`
  );
}

export function exportAgreements(format, params) {
  return downloadFile(
    acuerdosUrl(`/exports/agreements.${format}`),
    `acuerdos-metropolitanos.${format}`,
    params
  );
}
