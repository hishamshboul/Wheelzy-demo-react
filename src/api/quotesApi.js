import apiClient from './apiClient.js';

export async function getQuotes(caseId) {
  const response = await apiClient.get(
    `/car-cases/${caseId}/quotes`
  );

  return response.data;
}

export async function setQuoteAsCurrent(caseId, quoteId) {
  const response = await apiClient.put(
    `/car-cases/${caseId}/quotes/${quoteId}/current`
  );

  return response.data;
}