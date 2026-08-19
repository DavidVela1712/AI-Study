import axiosClient from '../api/axiosClient'

export async function getStudyStatus(documentId) {
  const response = await axiosClient.get(`/documents/${documentId}/study-status`)
  return response.data
}
