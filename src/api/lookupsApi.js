import apiClient from './apiClient.js';

export async function getMakes() {
  const response = await apiClient.get('/lookups/makes');

  return response.data;
}

export async function getModelsByMake(makeId) {
  const response = await apiClient.get(
    `/lookups/makes/${makeId}/models`
  );

  return response.data;
}

export async function getSubModelsByModel(modelId) {
  const response = await apiClient.get(
    `/lookups/models/${modelId}/submodels`
  );

  return response.data;
}

export async function getZipCodes() {
  const response = await apiClient.get('/lookups/zip-codes');

  return response.data;
}
export async function getStatuses() {
  const response = await apiClient.get('/lookups/statuses');

  return response.data;
}