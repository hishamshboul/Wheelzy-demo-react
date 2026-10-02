import apiClient from './apiClient.js';

export async function getCarCases(filters = {}) {
  const params = new URLSearchParams();

  if (filters.dateFrom) {
    params.set('dateFrom', filters.dateFrom);
  }

  if (filters.dateTo) {
    params.set('dateTo', filters.dateTo);
  }

  for (const statusId of filters.statusIds ?? []) {
    params.append('statusIds', String(statusId));
  }

  if (typeof filters.isActive === 'boolean') {
    params.set('isActive', String(filters.isActive));
  }

  const response = await apiClient.get('/car-cases', {
    params,
  });

  return response.data;
}
export async function createCarCase(request) {
  const response = await apiClient.post('/car-cases', request);

  return response.data;
}

export async function getCarCaseDetails(id) {
  const response = await apiClient.get(
    `/car-cases/${id}/details`
  );

  return response.data;
}