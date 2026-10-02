import apiClient from './apiClient.js';

export async function getStatusHistory(caseId) {
  const response = await apiClient.get(
    `/car-cases/${caseId}/status-history`
  );

  return response.data;
}

export async function updateCarCaseStatus(caseId, request) {
  const response = await apiClient.post(
    `/car-cases/${caseId}/status`,
    request
  );

  return response.data;
}