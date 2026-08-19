import axiosClient from '../api/axiosClient'

export async function getStudyStatus(documentId) {
  const response = await axiosClient.get(`/documents/${documentId}/study-status`)
  return response.data
}

export async function triggerGeneration(documentId) {
  const response = await axiosClient.post(`/documents/${documentId}/study-status/generate`)
  return response.data
}
