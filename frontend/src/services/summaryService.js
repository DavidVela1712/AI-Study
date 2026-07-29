import axiosClient from '../api/axiosClient'

export async function generateSummary(documentId) {
  const response = await axiosClient.post('/summaries/generate', { documentId })
  return response.data
}

export async function regenerateSummary(documentId) {
  const response = await axiosClient.post('/summaries/regenerate', { documentId })
  return response.data
}

export async function getSummaryByDocument(documentId) {
  const response = await axiosClient.get(`/summaries/document/${documentId}`)
  return response.data
}

export async function deleteSummary(id) {
  await axiosClient.delete(`/summaries/${id}`)
}
