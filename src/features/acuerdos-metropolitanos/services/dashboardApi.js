import apiClient, { acuerdosUrl } from './apiClient';

export async function getDashboardSummary(params) {
  const response = await apiClient.get(acuerdosUrl('/dashboard/summary/'), { params });
  return response.data;
}

export async function getDashboardByInstance(params) {
  const response = await apiClient.get(acuerdosUrl('/dashboard/by-instance/'), { params });
  return response.data;
}

export async function getDashboardByZone(params) {
  const response = await apiClient.get(acuerdosUrl('/dashboard/by-zone/'), { params });
  return response.data;
}

export async function getDashboardBySingleInstance(id, params) {
  const response = await apiClient.get(acuerdosUrl(`/dashboard/instance/${id}/`), { params });
  return response.data;
}
